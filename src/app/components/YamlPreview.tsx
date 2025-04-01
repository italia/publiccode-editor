import copy from "copy-to-clipboard";
import { Icon, notify } from "design-react-kit";
import { useTranslation } from "react-i18next";
import img_copy from "../../assets/img/copy.svg";
import img_download from "../../assets/img/download.svg";
import isSafari from "../is-safari";
import UploadPanel from "./UploadPanel";
import { useState } from "react";

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
    setTimeout(() => tempLink.click());
  } else {
    tempLink.click();
  }

  setTimeout(function () {
    document.body.removeChild(tempLink);
    window.URL.revokeObjectURL(blobURL);
  }, 1000);
};

interface Props {
  yaml?: string;
}

const YamlPreview = ({ yaml }: Props): JSX.Element => {
  const { t } = useTranslation();
  const [showUploadPanel, setShowUploadPanel] = useState(false);

  return (
    <div className="preview">
      <div className="preview__title">
        {"File YAML"}
      </div>
      <div className="preview__body">
        {!yaml && (
          <div className="preview__info">{t("editor.nocodegenerated")}</div>
        )}
        <div className="preview__code">
          <pre>
            <code>
              {"\n"}
              {typeof yaml === "string" && yaml}
            </code>
          </pre>
        </div>
      </div>
      <div className="preview__footer">
        {showUploadPanel && (
          <UploadPanel onBack={() => setShowUploadPanel(false)} />
        )}
        <div>
          <Button
            className={`${
              !yaml ? "disabled" : "enabled"
            } d-flex gap-1 justify-content-center align-items-center ${
              showUploadPanel ? "d-none" : ""
            }`}
          >
            <Icon color="white" icon="it-copy" size="sm" />
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
          </Button>
        </div>
        <div>
          <Button
            className="d-flex gap-1 justify-content-center align-items-center"
            onClick={(e) => {
              e.preventDefault();
              setShowUploadPanel(true);
            }}
          >
            <Icon color="white" icon="it-upload" size="sm" />
            <span className="action">{t("editor.load")}</span>
          </Button>
        </div>
        <div>
          <Button
            className={`${
              !yaml ? "disabled" : "enabled"
            } d-flex gap-1 justify-content-center align-items-center ${
              showUploadPanel ? "d-none" : ""
            }`}
          >
            <Icon color="white" icon="it-download" size="sm" />
            <span
              className="action"
              onClick={!yaml ? undefined : () => download(yaml)}
            >
              {t("editor.download")}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};
export default YamlPreview;
