import copy from "copy-to-clipboard";
import { Modal, ModalBody, notify } from "design-react-kit";
import { useTranslation } from "react-i18next";
import { createUseStyles } from "react-jss";
import img_copy from "../../assets/img/copy.svg";
import img_download from "../../assets/img/download.svg";
import isSafari from "../is-safari";

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

const download = (data: string) => {
  //has dom
  if (!data || data.length == 0) {
    return;
  }
  const blob = new Blob([data], {
    type: "text/yaml;charset=utf-8;",
  });
  const blobURL = window.URL.createObjectURL(blob);
  const tempLink = document.createElement("a");
  tempLink.style.cssText = "display:none";
  tempLink.download = "publiccode.yml";
  tempLink.href = blobURL;
  tempLink.setAttribute("download", "publiccode.yml");
  document.body.appendChild(tempLink);

  if (isSafari()) {
    setTimeout(() => tempLink.click())
  } else {
    tempLink.click();
  }

  setTimeout(function () {
    document.body.removeChild(tempLink);
    window.URL.revokeObjectURL(blobURL);
  }, 1000);
};

interface Props {
  display: boolean;
  toggle: () => void;
  yaml?: string;
}

export const YamlModal = ({ display, toggle, yaml }: Props): JSX.Element => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Modal
      className={classes.modalFullScreen}
      isOpen={display}
      role="dialog"
      toggle={toggle}
      data-testid="yaml-modal"
    >
      <ModalBody className={classes.modalContent}>
        <div className="sidebar">
          <div className="sidebar__title">
            <div
              className={classes.closeButton}
              onClick={toggle}
              data-testid="close-search-modal"
            >
              ×
            </div>
            {"File YAML"}
          </div>

          <div className="sidebar__body">
            {!yaml && (
              <div className="sidebar__info">{t("editor.nocodegenerated")}</div>
            )}

            <div className="sidebar__code">
              <pre>
                <code>
                  {"\n"}
                  {typeof yaml === "string" && yaml}
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
                  onClick={
                    !yaml
                      ? undefined
                      : () => {
                        copy(yaml);
                        notify(t("editor.copytext"), { state: "info" });
                      }
                  }
                >
                  {t("editor.copy")}
                </span>
              </a>
            </div>
            <div className="sidebar__footer_item">
              <a href="#" className={!yaml ? "disabled" : "enabled"}>
                <img src={img_download} alt="dowload" />
                <span
                  className="action"
                  onClick={!yaml ? undefined : () => download(yaml)}
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
