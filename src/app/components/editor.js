import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import Head from "./head";
import moment from "moment";
import { LanguageSwitcher } from "./languageSwitcher";
import { useDispatch, useSelector } from "react-redux";
import EditorForm from "./editorForm";
import InfoBox from "./Info";
import { useEditor } from "../hooks/useEditor";
import { Footer } from "./foot";
import { ADD_NOTIFICATION } from "../store/notifications";
import { useForm } from "react-hook-form";
import { transformLocalized } from "../utils/transform";
import { postDataForValidation } from "../utils/calls";
import { validateRequired, validateSubTypes } from "../utils/validate";

export const Editor = (props) => {
  const currentCountry = "it"; // TODO specific country properties
  let lastGen = moment();
  const dispatch = useDispatch();
  const languages = useSelector((state) => state.language.languages);
  const currentLanguage = useSelector(
    (state) => state.language.currentLanguage
  );
  const [elements, blocks, allFields] = useEditor(currentCountry, languages);

  // use custom hook
  const [isYamlLoaded, setIsYamlLoaded] = useState(false);
  const [yaml, setYaml] = useState(null);
  const [activeSection, setActiveSection] = useState(0);

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
    // const { form } = this.props;
    let yaml = null,
      yamlLoaded = false;
    let type = "success";
    let msg = "Success";

    //was syncErrors
    if (errors) {
      type = "error";
      msg = "There are some errors";
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
    };
    return <Footer {...props} />;
  };

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

  useEffect(()=> {
    //all required checkbox should set here
    setValue('localisation_localisationReady', false, { shouldDirty: true })
  })

  const handleReset = () => {
    dispatch(ADD_NOTIFICATION({ type: "info", msg: "Reset" }));
    reset();
  };

  const useLocalValidation = (formValues, obj) => {
    //CHECK REQUIRED FIELDS
    const required = validateRequired(formValues, elements);
    //VALIDATE TYPES AND SUBOBJECT
    const objs_n_arrays = validateSubTypes(formValues, elements);
    const errors = Object.assign(required, objs_n_arrays);
    console.log(formValues, errors);
    console.error("Generic error with remote validation, using local instead");

    const errorObj = errors;
    const err = {};
    Object.keys(errorObj).forEach((x) => {
      if (!errorObj[x]._error) err[x] = errorObj[x];
    });
    console.log(err);
    props.setLoading(true);

    if (Object.keys(err).length === 0 && err.constructor === Object) {
      this.showResults(obj);
    } else {
      err.map((x) => console.log(x));
    }
  };
  const getOnlyTouched = (data, dirtyFields) => {
    const out = {};
    const touched = Object.keys(data).filter((x) =>
      dirtyFields.hasOwnProperty(x) ? x : null
    );
    touched.map(x => {out[x] = data[x]});
    return out;
  };

  const validate = (data) => {
    console.log("validating", data);
    console.log("formState", formState.dirtyFields);
    const dataTouched = getOnlyTouched(data, formState.dirtyFields);
    const dataTransformed = transformLocalized(dataTouched);
    dataTransformed.publiccodeYmlVersion = "0.2";

    // hack to get all description subfield validated
    if (!dataTransformed.description) {
      dataTransformed.description = {};
      languages.map((x) => (dataTransformed.description[x] = {}));
    }

    props.setLoading(true);
    postDataForValidation(dataTransformed).onmessage = (e) => {
      if (e && e.data && e.data.validator) {
        clearErrors();
        const validator = JSON.parse(e.data.validator);
        console.log(validator);

        if (validator.status === "ok") {
          //TODO
        } else {
          console.log(validator.errors);
          validator.errors.map((x) => {
            setError(x.key.replace(/\./gi, "_"), {
              message: x.description,
              type: "manual",
            });
          });
          props.setLoading(false);
          console.log(errors);
        }
      } else {
        useLocalValidation(data, dataTransformed);
      }
    };
  };

  const triggerValidation = () => {
    validate(getValues());
  };

  const onSubmit = (data) => {
    validate(data);
  };

  const submit = handleSubmit(onSubmit);

  return (
    <Fragment>
      <div className="content">
        <Head lastGen={lastGen} />
        <LanguageSwitcher />
        <div className="content__main" id="content__main">
          {currentLanguage && blocks && allFields && (
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
            />
          )}
        </div>
        {currentLanguage && renderFoot()}
        <InfoBox />
      </div>
      {/* {this.renderSidebar()} */}
    </Fragment>
  );
};

Editor.propTypes = {
  setLoading: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};
