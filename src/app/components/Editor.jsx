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
import { defaultCountry as currentCountry } from "../contents/constants";
import { YamlModal } from "./YamlModal";
import { useTranslation } from "react-i18next";

export const Editor = (props) => {
  const lastGen = moment();
  const dispatch = useDispatch();
  const languages = useSelector((state) => state.language.languages);
  const [elements, blocks, allFields] = useEditor(currentCountry, languages);

  // use custom hook
  const [isYamlLoaded, setIsYamlLoaded] = useState(false);
  const [yaml, setYaml] = useState(null);
  const [activeSection, setActiveSection] = useState(0);
  const [isYamlModalVisible, setYamlModalVisibility] = useState(false);
  const {t} = useTranslation();

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
    setValue("localisation_localisationReady", false, { shouldDirty: true });
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
    let yaml = null,
      yamlLoaded = false;
    let type = "success";
    let msg = t("editor.success");

    //was syncErrors
    if (errors) {
      type = "error";
      msg = t("editor.genericerror");
      yaml = null;
    } else {
      yamlLoaded = false;
    }

    dispatch(ADD_NOTIFICATION({ type, title, msg, millis }));
    setYaml(yaml);
    setIsYamlLoaded(yamlLoaded);
  };

  const renderFoot = () => {
    const props = {
      reset: handleReset,
      submitFeedback: submitFeedback,
      submit: submit,
      trigger: triggerValidation,
      yamlLoaded: isYamlLoaded,
      languages: languages,
    };
    return <Footer {...props} />;
  };

  const handleReset = () => {
    dispatch(ADD_NOTIFICATION({ type: "info", msg: "Reset" }));
    reset();
  };

  const handleValidationErrors = useCallback(
    (validator) => {
      if (validator.status === "ok") {
        //TODO modal
        setYamlModalVisibility(true);
      } else {
        console.log(validator.errors);
        validator.errors.map((x) => {
          setError(x.key.replace(/\./gi, "_"), {
            message: x.description,
            type: "manual",
          });
        });
      }
      props.setLoading(false);
      // dispatch(setError(value));
    }
  );

  const triggerValidation = () => {
    props.setLoading(true);
    clearErrors();
    validate(
      getValues(),
      formState.dirtyFields,
      languages,
      handleValidationErrors,
    );
  };

  const onSubmit = (data) => {
    triggerValidation();
    setYamlModalVisibility(true);
  };

  const submit = handleSubmit(onSubmit);

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
              errors={errors}
              submit={submit}
              formMethods={formMethods}
              data={blocks}
              country={currentCountry}
              reset={reset}
              allFields={allFields}
              languages={languages}
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
