import React, { Fragment, useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import Head from "./Head";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useDispatch, useSelector } from "react-redux";
import EditorForm from "./EditorForm";
import InfoBox from "./InfoBox";
import { useEditor } from "../hooks/useEditor";
import { Footer } from "./Foot";
import { ADD_NOTIFICATION } from "../store/notifications";
import { useForm } from "react-hook-form";
import { validate } from "../utils/validate";
import {
  defaultCountry as currentCountry,
  DEFAULT_BRANCH,
  NOTIFICATION_TIMEOUT,
} from "../contents/constants";
import { YamlModal } from "./YamlModal";
import { useTranslation } from "react-i18next";
import { staticFieldsYaml } from "../contents/staticFields";
import jsyaml from "js-yaml";
import { getDefaultBranch, getRemotePubliccode } from "../utils/calls";
import {
  convertSimpleStringArray,
  dirtyValues,
  extractLanguages,
  toFlatPropertyMap,
  transformSimpleStringArrays,
} from "../utils/transform";
import { setLanguages, resetLanguages } from "../store/language";
import useDebounce from "../hooks/useDebounce";

export const Editor = ({setLoading}) => {
  const lastGen = new Date();

  const dispatch = useDispatch();
  const languages = useSelector((state) => state.language.languages);

  const [isYamlUploaded, setIsYamlUploaded] = useState(false);
  const [yaml, setYaml] = useState(null);
  const [yamlString, setYamlString] = useState("");
  const [flatErrors, setFlatErrors] = useState(null);
  const [activeSection, setActiveSection] = useState(0);
  const [isYamlModalVisible, setYamlModalVisibility] = useState(false);
  const [defaultBranch, setDefaultBranch] = useState(DEFAULT_BRANCH);
  const [, blocks, allFields] = useEditor(currentCountry, languages);

  const { t } = useTranslation();
  const formMethods = useForm({reValidateMode: 'onSubmit', mode: 'onSubmit'});

  const {
    handleSubmit,
    reset,
    clearErrors,
    setError,
    formState,
    getValues,
    setValue,
    watch,
  } = formMethods;
  const {errors, touchedFields} = formState;
  const urlWatched = useDebounce(watch("url"), 1000);

  // handle uploaded data
  useEffect(() => {
    // get data back in form (upload)
    yaml && 
      Promise.all([reset({})]).then(() => {
        setLoading(true);
        setFieldsTouched();
        setLoading(false);
      });
  }, [yaml, languages]);

  // set default values and load data from localstorage if any
  useEffect(() => {
    //all required checkbox and preset values should be set here
    setDefaultValues();

    // loading from localStorage
    const data = JSON.parse(localStorage.getItem("publiccode-editor"));
    Promise.all([
      dispatch(setLanguages(extractLanguages(data)))
    ]).then(() => {
      setYaml(data);
    })
  }, []);

  // autosave
  useEffect(() => {
    const autoSaveInterval = setTimeout(() => {
      const data = dirtyValues(touchedFields, getValues());
      const yamlSimplified = transformSimpleStringArrays(data, allFields);
      localStorage.setItem("publiccode-editor", JSON.stringify(yamlSimplified));
    }, 0);
    return () => {
      clearInterval(autoSaveInterval);
    };
  }, [allFields, formState]);

  useEffect(async () => {
    try {
      const url = new URL(urlWatched).toString();
      const gdb = await getDefaultBranch(url.toString());
      const { branch } = gdb;
      setDefaultBranch(branch);
    } catch (error) {
      // console.log("url not valid");
    }
  }, [urlWatched]);

  const setDefaultValues = () => {
    setValue("localisation.localisationReady", false, { shouldTouch: true });
    setValue("publiccodeYmlVersion", "0.2", { shouldTouch: true });
  }

  const onAccordion = (activeSection) => {
    let offset = activeSection * 56;
    let currentScroll = document.getElementById(`content__main`).scrollTop;
    let diff = currentScroll - offset;

    if (diff > 0) {
      document.getElementById(`content__main`).scrollTop = offset;
    } else {
      console.warn("inviewport");
    }
    setActiveSection(activeSection);
  };

  const submitFeedback = () => {
    const title = "";
    const millis = NOTIFICATION_TIMEOUT;
    let type = "success";
    let msg = t("editor.success");

    if (errors) {
      console.log("errors:", errors);
      type = "error";
      msg = t("editor.genericerror");
    }

    dispatch(ADD_NOTIFICATION({ type, title, msg, millis }));
  };

  const setFieldsTouched = () => {
    if (yaml) {
      // setting boolean required fields to dirty
      setDefaultValues();
      const flattenedObj = toFlatPropertyMap(yaml);
      const convertedSimpleStringArray = convertSimpleStringArray(
        flattenedObj,
        allFields
      );
      Object.keys(convertedSimpleStringArray).map((x) => {
        // set touched for array fields
        setValue(x, convertedSimpleStringArray[x], { shouldTouch: true });
        if(Array.isArray(convertedSimpleStringArray[x])) {
          convertedSimpleStringArray[x].map((_,i) => {
            setValue(`${x}[${i}]`, convertedSimpleStringArray[x][i], { shouldTouch: true });
          })
        }
      });
    }
  };

  const parseYML = (yaml) => {
    let data = null;
    try {
      data = jsyaml.load(yaml);
    } catch (e) {
      dispatch(
        ADD_NOTIFICATION({ type: "error", msg: t("editor.errors.yamlloading") })
      );
      throw new Error(t("editor.errors.yamlloading"));
    }
    if (!data) {
      dispatch(
        ADD_NOTIFICATION({ type: "error", msg: t("editor.errors.yamlloading") })
      );
      return;
    }
    dispatch(setLanguages(extractLanguages(data)));
    return data;
  };

  const loadLocalYaml = (value) => {
    setIsYamlUploaded(true);
    setLoading(true);

    const yaml = parseYML(value);
    localStorage.setItem("publiccode-editor", JSON.stringify(yaml));
    setYaml(yaml);

    setLoading(false);
  }

  const loadRemoteYaml = async (value) => {
    // ask confirmation to overwrite form
    // then reset actual form
    setIsYamlUploaded(true);
    setLoading(true);

    const response = await getRemotePubliccode(value).catch((error) => {
      const msg = `An error occured: ${error}`;
      setLoading(false);
      dispatch(ADD_NOTIFICATION({ type: "error", msg, millis: 3000 }));
      throw new Error(error);
    });
    if(!response.ok){
      const msg = `An error occured: ${response.status}`;
      setLoading(false);
      dispatch(ADD_NOTIFICATION({ type: "error", msg, millis: 3000 }));
      throw new Error(msg);
    }
    const yaml = parseYML(await response.text());
    localStorage.setItem("publiccode-editor", JSON.stringify(yaml));
    setYaml(yaml);

    setLoading(false);
  };

  const renderFoot = () => {
    const props = {
      reset: handleReset,
      submitFeedback: submitFeedback,
      submit: submit,
      trigger: submit,
      yamlLoaded: isYamlUploaded,
      languages: languages,
      loadRemoteYaml,
      loadLocalYaml,
    };
    return <Footer {...props} />;
  };

  const handleReset = () => {
    dispatch(ADD_NOTIFICATION({ type: "info", msg: "Reset" }));
    reset({});
    setYaml(null);
    clearErrors();
    setFlatErrors(null);
    dispatch(resetLanguages());
    setDefaultValues();
    localStorage.setItem("publiccode-editor", JSON.stringify(getValues()));
  };

  const handleValidationErrors = useCallback((validator) => {
    console.log(validator);
    if (!validator.status) {
      setLoading(false);
      dispatch(
        ADD_NOTIFICATION({
          type: "error",
          title: "error validating",
          msg: validator,
          millis: 3000,
        })
      );
      return;
    }
    if (validator.status === "ok") {
      setYamlModalVisibility(true);
    } else {
      setFlatErrors(validator.errors);
      validator.errors.map((x) => {
        setError(x.key, {
          message: x.description,
          type: "manual",
        });
      });
    }
    setLoading(false);
  });

  const setResults = (values) => {
    try {
      const tmpYaml = jsyaml.safeDump(values, { forceStyleLiteral: true });
      const yamlString = staticFieldsYaml + tmpYaml;
      values && setYamlString(yamlString);
    } catch (e) {
      setLoading(false);
      console.error(e, values, touchedFields, getValues());
      dispatch(
        ADD_NOTIFICATION({
          type: "error",
          title: "error setting results",
          msg: "Error generating YAML, contact support",
          millis: 5000,
        })
      );
      throw new Error(e);
    }
  };

  const triggerValidation = (data) => {
    setLoading(true);
    clearErrors();
    validate(
      data,
      allFields,
      languages,
      handleValidationErrors,
      setResults,
      defaultBranch,
      touchedFields
    );
    setIsYamlUploaded(false);
  };

  const onError = () => {
    triggerValidation(getValues());
  };

  const onSubmit = (data) => {
    triggerValidation(data);
  };

  const submit = handleSubmit(onSubmit, onError);

  return (
    <Fragment>
      <div className="content">
        <Head lastGen={lastGen} />
        <LanguageSwitcher />
        <div className="content__main" id="content__main">
          {blocks && allFields && (
            <EditorForm
              activeSection={activeSection}
              onAccordion={onAccordion}
              submit={submit}
              formMethods={formMethods}
              data={blocks}
              country={currentCountry}
              allFields={allFields}
              languages={languages}
              flatErrors={flatErrors}
            />
          )}
        </div>
        {blocks && renderFoot()}
        <InfoBox />
        <YamlModal
          yaml={yamlString}
          display={isYamlModalVisible}
          toggle={() => setYamlModalVisibility(!isYamlModalVisible)}
        />
      </div>
    </Fragment>
  );
};

Editor.propTypes = {
  setLoading: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};
