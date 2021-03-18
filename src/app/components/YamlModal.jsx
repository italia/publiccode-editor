import React, { useState } from "react";
import { Modal, ModalBody } from "design-react-kit";
import img_copy from "../../asset/img/copy.svg";
import img_upload from "../../asset/img/load.svg";
import img_download from "../../asset/img/download.svg";
import img_xx from "../../asset/img/xx.svg";
import copy from "copy-to-clipboard";
import { useDispatch } from "react-redux";
import { ADD_NOTIFICATION } from "../store/notifications";
import { createUseStyles } from "react-jss";

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
    // composes: "close",
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

  const [dialog, setDialog] = useState(false);
  const dispatch = useDispatch();
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
              <div className="sidebar__info">No code generated.</div>
            )}

            <div className="sidebar__code">
              <pre>
                <code>
                  {"\n"}
                  {props.yaml}
                </code>
              </pre>
            </div>
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
                        msg: "Copied to clipboard",
                      })
                    );
                  }}
                >
                  Copy
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
                  Download
                </span>
              </a>
            </div>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};
