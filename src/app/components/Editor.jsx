import React, {
  Fragment,
  useCallback,
  useEffect,
  useState,
} from "react";
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
import { defaultCountry as currentCountry } from "../contents/constants";
import { YamlModal } from "./YamlModal";
import { useTranslation } from "react-i18next";
import { staticFieldsJson, staticFieldsYaml } from "../contents/staticFields";
import jsyaml from "js-yaml";
import { getRemotePubliccode } from "../utils/calls";

export const Editor = (props) => {
  const lastGen = moment();
  const dispatch = useDispatch();
  const languages = useSelector((state) => state.language.languages);
  const [elements, blocks, allFields] = useEditor(currentCountry, languages);

  // use custom hook
  const [isYamlUploaded, setIsYamlUploaded] = useState(false);
  const [yaml, setYaml] = useState(null);
  const [flatErrors, setFlatErrors] = useState(null);
  // const [temporaryData, setTemporaryData] = useState(null); //this will contains temp data that later will be converted in yaml
  const [activeSection, setActiveSection] = useState(0);
  const [isYamlModalVisible, setYamlModalVisibility] = useState(false);
  const { t } = useTranslation();

  const formMethods = useForm();
  const {
    handleSubmit,
    errors,
    reset,
    clearErrors,
    setError,
    formState,
    getValues,
    setValue,
  } = formMethods;

  useEffect(() => {
    //all required checkbox and preset values should be set here
    setValue("localisation.localisationReady", false, { shouldDirty: true });
    setValue("publiccodeYmlVersion", "0.2", { shouldDirty: true });
  });

  const onAccordion = (activeSection) => {
    let offset = activeSection * 56;
    let currentScroll = document.getElementById(`content__main`).scrollTop;
    let diff = currentScroll - offset;

    if (diff > 0) {
      console.info("diff", diff);
      document.getElementById(`content__main`).scrollTop = offset;
    } else {
      console.warn("inviewport");
    }
    setActiveSection(activeSection);
  };

  const submitFeedback = () => {
    const title = "";
    const millis = 3000;
    let type = "success";
    let msg = t("editor.success");

    if (errors) {
      console.log("errors:", errors);
      type = "error";
      msg = t("editor.genericerror");
    }

    dispatch(ADD_NOTIFICATION({ type, title, msg, millis }));
  };

  const loadRemoteYaml = async (value) => {
    // ask confirmation to overwrite form
    // then reset actual form
    console.log(value);
    const response = await getRemotePubliccode(value);
    console.log(response);
    
  }

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
    reset();
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
      const yaml = staticFieldsYaml + tmpYaml;
      setYaml(yaml);
      return yaml;
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
      formState.dirtyFields,
      languages,
      handleValidationErrors,
      handleYamlChange
    );
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
              reset={reset}
              allFields={allFields}
              languages={languages}
              flatErrors={flatErrors}
            />
          )}
        </div>
        {blocks && renderFoot()}
        <InfoBox />
        <YamlModal
          yaml={yaml}
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
