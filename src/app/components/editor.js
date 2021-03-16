import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import Head from "./head";
import moment from "moment";
import { LanguageSwitcher } from "./languageSwitcher";
import { useDispatch, useSelector } from "react-redux";
import EditorForm from "./editorForm";
import InfoBox from "./InfoBox";
import { useEditor } from "../hooks/useEditor";
import { Footer } from "./foot";
import { ADD_NOTIFICATION } from "../store/notifications";
import { useForm } from "react-hook-form";
import { transform, transformLocalized } from "../utils/transform";
import { postDataForValidation } from "../utils/calls";

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
    const yaml = null,
      yamlLoaded = false;
    let type = "success";
    let msg = "Success";

    //was syncErrors
    // if (form[APP_FORM].submitErrors) {
    //   type = "error";
    //   msg = "There are some errors";
    //   yaml = null;
    // } else {
    //   yamlLoaded = false;
    // }

    dispatch(ADD_NOTIFICATION({ type, title, msg, millis }));
    setYaml(yaml);
    setIsYamlLoaded(yamlLoaded);
  };

  const renderFoot = () => {
    const props = {
      reset: handleReset,
      submitFeedback: submitFeedback,
      submit: submit,
      yamlLoaded: isYamlLoaded,
    };
    return <Footer {...props} />;
  };

  const formMethods = useForm();
  const {
    register,
    handleSubmit,
    watch,
    errors,
    reset,
    trigger,
    setError,
  } = formMethods;

  const handleReset = () => {
    dispatch(ADD_NOTIFICATION({ type: "info", msg: "Reset" }));
    reset();
  };

  const validate = (data) => {
    const values = { [currentLanguage]: data };
    console.log("validating", data);
    const obj = transformLocalized(data, currentCountry, elements);
    obj.publiccodeYmlVersion = "0.2";

    // hack to get all description subfield validated
    if (!obj.description) {
      obj.description = {};
      languages.map((x) => (obj.description[x] = {}));
    }

    props.setLoading(true);
    const validatorWorker = postDataForValidation(obj);
    validatorWorker.onmessage = (e) => {
      if (e && e.data && e.data.validator) {
        const validator = JSON.parse(e.data.validator);
        console.log(validator);

        if (validator.status === "ok") {
          props.setLoading(false);
          return this.showResults(obj);
        } else {
          let errors = Object.fromEntries(
            validator.errors.map((x) => {
              const key = x.key.replace(/\./gi, "_");
              return [[key], x.description];
            })
          );
          console.log(validator.errors);
          validator.errors.map((x) => {
            setError(x.key, { message: x.description, type: "manual" });
          });
          // setError(errors);
          props.setLoading(false);
          // this.setState({
          //   errors,
          //   loading: false,
          // });
          // this.props.onLoadingRemote(false);
          // this.props.setValidationErrors(errors);
        }
      } else {
        this.useLocalValidation(data, obj);
      }
    };
  };

  const onSubmit = (data) => {
    validate(data);
  };

  const submit = handleSubmit(onSubmit);

  // console.log(elements, blocks, allFields);
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
              handleSubmit={handleSubmit}
              submit={submit}
              formMethods={formMethods}
              // onSubmit={this.validateAndGenerate.bind(this)}
              data={blocks}
              country={currentCountry}
              onSubmit={onSubmit}
              reset={reset}
              // switchCountry={this.switchCountry.bind(this)}
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
