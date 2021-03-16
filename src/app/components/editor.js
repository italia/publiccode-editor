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
    //this.scrollToError(errors)
    setYaml(yaml);
    setIsYamlLoaded(yamlLoaded);
  };

  const renderFoot = () => {
    //c
    const props = {
      reset: handleReset,
      submitFeedback: submitFeedback,
      submit: submit,
      yamlLoaded: isYamlLoaded,
    };
    return <Footer {...props} />;
  };
  const formMethods = useForm()
  const { register, handleSubmit, watch, errors, reset } = formMethods;

  const handleReset = () => {
    dispatch(ADD_NOTIFICATION({ type: "info", msg: "Reset" }));
    reset();
  };

  const onSubmit = (data) => console.log("submit", data);
  const submit = handleSubmit(onSubmit);

  console.log(elements, blocks, allFields);
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
