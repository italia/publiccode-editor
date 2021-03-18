import React from "react";
import { useTranslation } from "react-i18next";

export const Footer = (props) => {
  const { t } = useTranslation();
  return (
    <div className="content__foot">
      <div className="content__foot_item">
        <button
          className="editor_button  editor_button--custom"
          onClick={() => props.reset()}
          disabled={!props.languages || props.languages.length === 0}
        >
          {t("editor.form.reset")}
        </button>
      </div>
      <div className="content__foot_item">
        <button
          className="editor_button  editor_button--custom"
          onClick={() => props.trigger()}
          disabled={!props.languages || props.languages.length === 0}
        >
          {"Trigger"}
        </button>
      </div>
      <div className="content__foot_item">
        <button
          className="editor_button  editor_button--secondary"
          onClick={() => props.trigger()}
          disabled={!props.languages || props.languages.length === 0}
        >
          {"Upload"}
        </button>
      </div>
      <div className="content__foot_item">
        <button
          type="button"
          className="editor_button  editor_button--primary"
          disabled={!props.languages || props.languages.length === 0}
          onClick={() => {
            props.submit();
            setTimeout(() => {
              props.submitFeedback();
            }, 250);
          }}
        >
          {props.yamlLoaded
            ? t("editor.form.validate")
            : t("editor.form.generate")}
        </button>
      </div>
    </div>
  );
};
