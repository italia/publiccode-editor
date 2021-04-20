import React, { Fragment, useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import Head from "./Head";
import moment from "moment";
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
  NOTIFICATION_TIMEOUT,
} from "../contents/constants";
import { YamlModal } from "./YamlModal";
import { useTranslation } from "react-i18next";
import { staticFieldsJson, staticFieldsYaml } from "../contents/staticFields";
import jsyaml from "js-yaml";
import { getRemotePubliccode } from "../utils/calls";
import { dirtyValues, extractLanguages } from "../utils/transform";
import { setLanguages, resetLanguages } from "../store/language";
import { get } from "lodash";

export const Editor = (props) => {
  const lastGen = moment();

  const dispatch = useDispatch();
  const languages = useSelector((state) => state.language.languages);

  const [isYamlUploaded, setIsYamlUploaded] = useState(false);
  const [yaml, setYaml] = useState(null);
  const [yamlString, setYamlString] = useState("");
  const [flatErrors, setFlatErrors] = useState(null);
  const [activeSection, setActiveSection] = useState(0);
  const [isYamlModalVisible, setYamlModalVisibility] = useState(false);

  const { t } = useTranslation();
  const formMethods = useForm();

  const [elements, blocks, allFields] = useEditor(currentCountry, languages);

  const {
    handleSubmit,
    errors,
    reset,
    clearErrors,
    setError,
    formState,
    getValues,
    setValue,
    register,
  } = formMethods;

  useEffect(() => {
    // get data back in form (upload)
    yaml &&
      Promise.all([reset({}, { dirtyFields: true })]).then(() => {
        setDirtyAllFields();
      });
  }, [yaml, languages]);

  useEffect(() => {
    //all required checkbox and preset values should be set here
    setValue("localisation.localisationReady", false, { shouldDirty: true });
    setValue("publiccodeYmlVersion", "0.2", { shouldDirty: true });

    // loading from localStorage
    setYaml(JSON.parse(localStorage.getItem("publiccode-editor")));
  }, [allFields]);

  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      const data = dirtyValues(formState.dirtyFields, getValues());
      console.log(
        `autosaving data to localStorage every ${AUTOSAVE_TIMEOUT /
          1000} seconds`,
        formState.isDirty
      );
      localStorage.setItem("publiccode-editor", JSON.stringify(data));
    }, AUTOSAVE_TIMEOUT);
    return () => {
      clearInterval(autoSaveInterval);
    };
  }, []);

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
      props.setLoading(true);
      // setting boolean required to dirty
      setValue("localisation.localisationReady", false, { shouldDirty: true });
      allFields.map((x) => {
        const fieldValue = get(yaml, x.title);
        if (fieldValue) {
          register(x.title);
          // simple string arrays are not managed by react-hook-form
          // here we get those from schema dedicated property which
          // allow us to do some special cast
          if (
            Array.isArray(fieldValue) &&
            fieldValue.some((x) => typeof x === "string") &&
            x.simpleStringArray
          ) {
            setValue(x.title, fieldValue.map((y) => ({ value: y })), {
              shouldDirty: true,
            });
          } else {
            setValue(x.title, fieldValue, { shouldDirty: true });
          }
        }
      });
      props.setLoading(false);
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
    props.setLoading(true);

    const response = await getRemotePubliccode(value);
    const yaml = parseYML(response);
    localStorage.setItem("publiccode-editor", JSON.stringify(yaml));
    setYaml(yaml);

    props.setLoading(false);
  };

  const renderFoot = () => {
    const props = {
      reset: handleReset,
      submitFeedback: submitFeedback,
      submit: submit,
      trigger: triggerValidation,
      yamlLoaded: isYamlUploaded,
      languages: languages,
      loadRemoteYaml,
    };
    return <Footer {...props} />;
  };

  const handleReset = () => {
    dispatch(ADD_NOTIFICATION({ type: "info", msg: "Reset" }));
    localStorage.setItem("publiccode-editor", "{}");
    reset({}, { dirtyFields: true });
    setYaml(null);
    clearErrors();
    setFlatErrors(null);
    dispatch(resetLanguages());
  };

  const handleValidationErrors = useCallback((validator) => {
    if (validator.status === "ok") {
      setYamlModalVisibility(true);
    } else {
      console.log(validator.errors);
      setFlatErrors(validator.errors);
      validator.errors.map((x) => {
        setError(x.key, {
          message: x.description,
          type: "manual",
        });
      });
    }
    props.setLoading(false);
  });

  const setResults = (values) => {
    try {
      const mergedValue = Object.assign(staticFieldsJson, values);
      const tmpYaml = jsyaml.safeDump(mergedValue, { forceStyleLiteral: true });
      const yamlString = staticFieldsYaml + tmpYaml;
      values && setYamlString(yamlString);
    } catch (e) {
      throw new Error(e);
    }
  };

  const handleYamlChange = (data) => {
    setResults(data);
  };

  const triggerValidation = () => {
    props.setLoading(true);
    clearErrors();
    validate(
      getValues(),
      allFields,
      formState.dirtyFields,
      languages,
      handleValidationErrors,
      handleYamlChange
    );
    setIsYamlUploaded(false);
  };

  const onError = (data) => {
    console.log("error submitting", data);
  };

  const onSubmit = (data) => {
    triggerValidation();
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
