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
  AUTOSAVE_TIMEOUT,
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
    formState: {errors, dirtyFields, isDirty, touchedFields},
    getValues,
    setValue,
    watch,
  } = formMethods;
  const urlWatched = useDebounce(watch("url"), 1000);

  // handle uploaded data
  useEffect(() => {
    // get data back in form (upload)
    yaml && 
      Promise.all([reset({}, {keepDirty: false, keepErrors: false, keepTouched: false})]).then(() => {
        setLoading(true);
        setDirtyAllFields();
        setLoading(false);
      });
  }, [yaml, languages]);

  // set default values and load data from localstorage if any
  useEffect(() => {
    //all required checkbox and preset values should be set here
    setValue("localisation.localisationReady", false, { shouldTouch: true });
    setValue("publiccodeYmlVersion", "0.2", { shouldTouch: true });

    // loading from localStorage
    setYaml(JSON.parse(localStorage.getItem("publiccode-editor")));
  }, [allFields]);

  // autosave
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      const data = dirtyValues(dirtyFields, getValues());
      console.log(
        `autosaving data to localStorage every ${
          AUTOSAVE_TIMEOUT / 1000
        } seconds`,
        isDirty
      );
      const yamlSimplified = transformSimpleStringArrays(data, allFields);
      localStorage.setItem("publiccode-editor", JSON.stringify(yamlSimplified));
    }, AUTOSAVE_TIMEOUT);
    return () => {
      clearInterval(autoSaveInterval);
    };
  }, [allFields]);

  useEffect(async () => {
    try {
      const url = new URL(urlWatched).toString();
      const gdb = await getDefaultBranch(url.toString());
      const { branch } = gdb;
      setDefaultBranch(branch);
    } catch (error) {
      console.log("url not valid");
    }
  }, [urlWatched]);

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

  const setDirtyAllFields = () => {
    if (yaml) {
      // setting boolean required fields to dirty
      setValue("localisation.localisationReady", false, { shouldTouch: true });
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

  const loadRemoteYaml = async (value) => {
    // ask confirmation to overwrite form
    // then reset actual form
    setIsYamlUploaded(true);
    setLoading(true);

    const response = await getRemotePubliccode(value);
    const yaml = parseYML(response);
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
    };
    return <Footer {...props} />;
  };

  const handleReset = () => {
    dispatch(ADD_NOTIFICATION({ type: "info", msg: "Reset" }));
    localStorage.setItem("publiccode-editor", "{}");
    reset({});
    setYaml(null);
    clearErrors();
    setFlatErrors(null);
    dispatch(resetLanguages());
  };

  const handleValidationErrors = useCallback((validator) => {
    if (!validator.status) {
      // error thrown
      console.log(validator);
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
      console.log(validator);
      setFlatErrors(validator.errors);
      validator.errors.map((x) => {
        if(x.key!=='description') {
          setError(x.key, {
            message: x.description,
            type: "manual",
          });
        }
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
      throw new Error(e);
    }
  };

  const handleYamlChange = (data) => {
    setResults(data);
  };

  const triggerValidation = (data) => {
    setLoading(true);
    clearErrors();
    validate(
      data,
      allFields,
      languages,
      handleValidationErrors,
      handleYamlChange,
      defaultBranch,
      touchedFields
    );
    setIsYamlUploaded(false);
    // Make sure you are returning an object that has both a values and an errors property. Their default values should be an empty object. For example: {}.
    // The keys of the error object should match the name values of your fields.
    // https://react-hook-form.com/api/useform
  };

  const onError = (data) => {
    triggerValidation(data);
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
