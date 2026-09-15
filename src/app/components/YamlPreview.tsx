import copy from "copy-to-clipboard";
import { Icon, notify } from "design-react-kit";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import isSafari from "../is-safari";
import { useYamlStore } from "../lib/store";
import UploadPanel from "./UploadPanel";

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

const YamlPreview = (): JSX.Element => {
  const { t } = useTranslation();
  const [showUploadPanel, setShowUploadPanel] = useState(false);
  const { yaml } = useYamlStore();

  return (
    <div className="preview">
      <div className="preview__title">{"File YAML"}</div>
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
      <div
        className="preview__footer"
        role="toolbar"
        aria-label={t("editor.actionsToolbar")}
      >
        {showUploadPanel && (
          <UploadPanel onBack={() => setShowUploadPanel(false)} />
        )}
        {!showUploadPanel && (
          <button
            type="button"
            className="preview__action"
            disabled={!yaml}
            title={!yaml ? t("editor.nocodegenerated") : undefined}
            onClick={() => {
              if (!yaml) {
                return;
              }
              copy(yaml);
              notify(t("editor.copytext"), { state: "info" });
            }}
          >
            <Icon icon="it-copy" size="sm" aria-hidden />
            <span>{t("editor.copy")}</span>
          </button>
        )}
        <button
          type="button"
          className="preview__action"
          aria-expanded={showUploadPanel}
          onClick={() => setShowUploadPanel(true)}
        >
          <Icon icon="it-upload" size="sm" aria-hidden />
          <span>{t("editor.upload.upload")}</span>
        </button>
        {!showUploadPanel && (
          <button
            type="button"
            className="preview__action"
            disabled={!yaml}
            title={!yaml ? t("editor.nocodegenerated") : undefined}
            onClick={() => yaml && download(yaml)}
          >
            <Icon icon="it-download" size="sm" aria-hidden />
            <span>{t("editor.download")}</span>
          </button>
        )}
      </div>
    </div>
  );
};
export default YamlPreview;
