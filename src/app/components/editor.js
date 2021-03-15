import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import Head from "./head";
import moment from "moment";
import { LanguageSwitcher } from "./languageSwitcher";

export const Editor = (props) => {
  let lastGen = moment();

  return (
    <Fragment>
      <div className="content">
        <Head lastGen={lastGen} />
        <LanguageSwitcher />;
        {/* 
      <div className="content__main" id="content__main">
        {currentLanguage &&
          blocks && (
            <EditorForm
              activeSection={activeSection}
              onAccordion={this.onAccordion.bind(this)}
              // onSubmit={this.generate.bind(this)}
              onSubmit={this.validateAndGenerate.bind(this)}
              data={blocks}
              // asyncValidate={this.validateWasm.bind(this)}
              country={country}
              switchCountry={this.switchCountry.bind(this)}
              errors={errors}
              allFields={allFields}
            />
          )}
      </div>
      {currentLanguage && this.renderFoot()}
      <InfoBox /> */}
      </div>
      {/* {this.renderSidebar()} */}
    </Fragment>
  );
};

Editor.propTypes = {
  setLoading: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};
