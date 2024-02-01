import { ChangeEvent, FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { notify } from "design-react-kit";

import img_upload from "../../asset/img/load.svg";
import img_xx from "../../asset/img/xx.svg";
import { SAMPLE_YAML_URL } from "../contents/constants";
import validator from "validator";
import { ResetFormConfirm } from "./ResetFormConfirm";

interface Props {
  submit: () => void;
  loadRemoteYaml: (url: string) => void;
  trigger: () => void;
  reset: () => void;
  languages: Array<string>;
  yamlLoaded: boolean;
}

export const Footer = (props: Props): JSX.Element => {
  const { t } = useTranslation();
  const [dialog, setDialog] = useState(false);
  const [isModalVisible, setModalVisibility] = useState(false);
  const [url, setUrl] = useState(SAMPLE_YAML_URL);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const {
      url: { value },
    } = event.target as typeof event.target & {
      url: { value?: string };
    };
    if (!value || !validator.isURL(value)) {
      notify(t("editor.notvalidurl"), { state: "error" });
      return;
    }

    const ext = value.split(/[. ]+/).pop();
    if (ext != "yml" && ext != "yaml") {
      notify(t("editor.filenotsupported"), { state: "error" });
      return;
    }

    setModalVisibility(true);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setUrl(value);
  };
  return (
    <div className="content__foot">
      <div className="content__foot_item">
        <button
          className="editor_button  editor_button--custom"
          onClick={() => props.reset()}
          disabled={!props.languages || props.languages.length === 0}
        >
          {t("editor.form.reset.button")}
        </button>
      </div>
      {/* <div className="content__foot_item">
        <button
          className="editor_button  editor_button--custom"
          onClick={() => props.submit()}
          disabled={!props.languages || props.languages.length === 0}
        >
          {"Submit"}
        </button>
      </div> */}
      {dialog && (
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
            accept=".yml, .yaml"
            style={{ display: "none" }}
          />
          <div className="sidebar__prefooter__content">
            <div>
              <div>{t("editor.browsefile")}</div>
              <div className="sidebar__prefooter__content__form">
                <button
                  type="button"
                  className="btn btn-primary btn-block"
                  onClick={() => document.getElementById("load_yaml")?.click()}
                >
                  <img src={img_upload} alt="upload" />
                  {t("editor.browse")}
                </button>
              </div>
            </div>
            <div>
              <div>{t("editor.pastefile")}</div>
              <div>
                <form
                  onSubmit={handleSubmit}
                  className="sidebar__prefooter__content__form"
                >
                  <input
                    className="form-control"
                    name="url"
                    type="url"
                    value={url}
                    required={true}
                    onChange={handleChange}
                  />
                  <button type="submit" className="btn btn-primary btn-block">
                    <img src={img_upload} alt="upload" />
                    {t("editor.load")}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="content__foot_item">
        <button
          className="editor_button  editor_button--secondary"
          onClick={() => setDialog(!dialog)}
        >
          {t("editor.form.upload")}
        </button>
      </div>
      <div className="content__foot_item">
        <button
          type="button"
          className="editor_button  editor_button--primary"
          disabled={!props.languages || props.languages.length === 0}
          onClick={() => props.trigger()}
        >
          {props.yamlLoaded
            ? t("editor.form.validate")
            : t("editor.form.generate")}
        </button>
      </div>
      <ResetFormConfirm
        display={isModalVisible}
        toggle={() => setModalVisibility(!isModalVisible)}
        submit={() => {
          setModalVisibility(false);
          setDialog(false);
          props.loadRemoteYaml(url);
        }}
      />
    </div>
  );
};
