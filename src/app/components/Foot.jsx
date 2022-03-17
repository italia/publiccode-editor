import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import img_upload from "../../asset/img/load.svg";
import img_xx from "../../asset/img/xx.svg";
import { SAMPLE_YAML_URL } from "../contents/constants";
import PropTypes from "prop-types";
import validator from "validator";
import { useDispatch } from "react-redux";
import { ADD_NOTIFICATION } from "../store/notifications";
import { ResetFormConfirm } from "./ResetFormConfirm";

export const Footer = (props) => {
  const { t } = useTranslation();
  const [dialog, setDialog] = useState(false);
  const [isModalVisible, setModalVisibility] = useState(false);
  const [isModalUploadVisible, setModalUploadVisibility] = useState(false);
  const [file, setFile] = useState("");
  const [url, setUrl] = useState(SAMPLE_YAML_URL);
  const dispatch = useDispatch();

  const handleSubmit = (event) => {
    event.preventDefault();
    const { value } = event.target.url;
    if (!value || !validator.isURL(value)) {
      dispatch(
        ADD_NOTIFICATION({ type: "error", msg: t("editor.notvalidurl") })
      );
      return;
    }

    const ext = value.split(/[. ]+/).pop();
    if (ext != "yml" && ext != "yaml") {
      dispatch(
        ADD_NOTIFICATION({ type: 1, msg: t("editor.filenotsupported") })
      );
      return;
    }

    setModalVisibility(true);
  };
  const handleUpload = (e) => {
    setModalUploadVisibility(true);
    setFile(e.target.files[0]);
  };

  const handleChange = (event) => {
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
          {t("editor.form.reset")}
        </button>
      </div>
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
            onChange={handleUpload}
            style={{ display: "none" }}
          />
          <div className="sidebar__prefooter__content">
            <div>
              <div>{t("editor.browsefile")}</div>
              <div className="sidebar__prefooter__content__form">
                <button
                  type="button"
                  className="btn btn-primary btn-block"
                  onClick={() => document.getElementById("load_yaml").click()}
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
          {"Upload"}
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
      {isModalVisible && (
        <ResetFormConfirm
          display={isModalVisible}
          toggle={() => setModalVisibility(!isModalVisible)}
          submit={() => {
            setModalVisibility(false);
            setDialog(false);
            props.loadRemoteYaml(url);
          }}
        />
      )}
      {isModalUploadVisible && (
        <ResetFormConfirm
          display={isModalUploadVisible}
          toggle={() => setModalUploadVisibility(!isModalUploadVisible)}
          submit={() => {
            const reader = new FileReader();
            reader.readAsText(file);
            reader.addEventListener("load", () => {
              props.loadLocalYaml(reader.result);
              setModalUploadVisibility(false);
              setDialog(false);
            })
          }}
        />
      )}
    </div>
  );
};

Footer.propTypes = {
  submit: PropTypes.func.isRequired,
  loadRemoteYaml: PropTypes.func.isRequired,
  trigger: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  languages: PropTypes.array.isRequired,
  yamlLoaded: PropTypes.bool.isRequired,
};
