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
      {/* {dialog && (
            <div className="sidebar__prefooter">
              <div
                className="sidebar__prefooter__close"
                onClick={() => setDialog(false)}
              >
                <img src={img_xx} alt="close" />
              </div>
              <input
                id="load_yaml"
                type="file"
                accept=".yml, .props.yaml"
                style={{ display: "none" }}
                // onChange={(e) => load(e.target.files)}
              />
              <div className="sidebar__prefooter__content">
                <div>
                  <div>Browse file from disk</div>
                  <div className="sidebar__prefooter__content__form">
                    <button
                      type="button"
                      className="btn btn-primary btn-block"
                      onClick={() =>
                        document.getElementById("load_yaml").click()
                      }
                    >
                      <img src={img_upload} alt="upload" />
                      Browse
                    </button>
                  </div>
                </div>
                <div>
                  <div>Paste remote props.yaml url</div>
                  <div>
                    <form
                      onSubmit={(e) => this.loadRemoteYaml(e)}
                      className="sidebar__prefooter__content__form"
                    >
                      <input
                        className="form-control"
                        type="url"
                        value={this.state.remoteYml}
                        required={true}
                        onChange={(e) => this.handleChange(e)}
                      />
                      <button
                        type="submit"
                        className="btn btn-primary btn-block"
                      >
                        <img src={img_upload} alt="upload" />
                        Load
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )} */}
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
