import React from "react";
import { Modal, ModalBody } from "design-react-kit";
import img_copy from "../../asset/img/copy.svg";
import img_download from "../../asset/img/download.svg";
import copy from "copy-to-clipboard";
import { useDispatch } from "react-redux";
import { ADD_NOTIFICATION } from "../store/notifications";
import { createUseStyles } from "react-jss";
import { useTranslation } from "react-i18next";

const useStyles = createUseStyles({
  modalFullScreen: {
    minWidth: "100% !important",
    minHeight: "100% !important",
    margin: "0 !important",
  },
  modalContent: {
    backgroundColor: "#ffffffc9",
    height: "100vh",
  },
  closeButton: {
    float: "right",
    cursor: "pointer",
    color: "#ffffff",
    lineHeight: "unset",
    fontSize: "3rem",
    marginLeft: "auto",
  },
});

export const YamlModal = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  return (
    <Modal
      className={classes.modalFullScreen}
      isOpen={props.display}
      role="dialog"
      toggle={props.toggle}
      data-testid="yaml-modal"
    >
      <ModalBody className={classes.modalContent}>
        <div className="sidebar">
          <div className="sidebar__title">
            <div
              className={classes.closeButton}
              onClick={props.toggle}
              data-testid="close-search-modal"
            >
              ×
            </div>
            {"File YAML"}
            {/* {fail == true ? "Errors" : "File YAML"}
            {loading && <img src={img_dots} className="loading" />} */}
          </div>

          <div className="sidebar__body">
            {!props.yaml && (
              <div className="sidebar__info">{t("editor.nocodegenerated")}</div>
            )}

            <div className="sidebar__code">
              <pre>
                <code>
                  {"\n"}
                  {typeof props.yaml === "string" && props.yaml}
                </code>
              </pre>
            </div>
          </div>

          <div className="sidebar__footer">
            <div className="sidebar__footer_item">
              <a href="#">
                <img src={img_copy} alt="copy" />
                <span
                  className="action"
                  onClick={() => {
                    copy(props.yaml);
                    dispatch(
                      ADD_NOTIFICATION({
                        type: "info",
                        title: "",
                        msg: t("editor.copytext"),
                      })
                    );
                  }}
                >
                  {t("editor.copy")}
                </span>
              </a>
            </div>
            {/* <div className="sidebar__footer_item">
              <a href="#">
                <img src={img_upload} alt="upload" />
                <span className="action" onClick={() => setDialog(true)}>
                  Upload
                </span>
              </a>
            </div> */}
            <div className="sidebar__footer_item">
              <a href="#" className={!props.yaml ? "disabled" : "enabled"}>
                <img src={img_download} alt="dowload" />
                <span
                  className="action"
                  // onClick={!props.yaml ? null : () => download(props.yaml)}
                >
                  {t("editor.download")}
                </span>
              </a>
            </div>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};
