import {
  Button,
  Form,
  Icon,
  Input,
  InputGroup,
  notify,
  Row,
  TabContainer,
  TabContent,
  TabNav,
  TabNavItem,
  TabNavLink,
  TabPane,
} from "design-react-kit";
import mitt from "mitt";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Combobox } from "react-widgets";
import validator from "validator";
import { SAMPLE_YAML_URL } from "../contents/constants";
import { hasYamlFileExtension, isYamlFile } from "../yaml-upload";
import { ResetFormConfirm } from "./ResetFormConfirm";

type YamlLoadEvents = {
  loadRemoteYaml: { url: string; source: "gitlab" | "other" };
  loadFileYaml: File;
};

export const yamlLoadEventBus = mitt<YamlLoadEvents>();

export default function UploadPanel({ onBack }: { onBack: () => void }) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const localFormRef = useRef<HTMLFormElement>(null);
  const remoteFormRef = useRef<HTMLFormElement>(null);
  const [isModalVisible, setModalVisibility] = useState(false);
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const [source, setSource] = useState<"gitlab" | "other">(null!);
  const [submitType, setSubmitType] = useState<"file" | "url" | undefined>(
    undefined,
  );

  const sourceOptions = [
    { value: "gitlab", text: t("editor.gitlab") },
    { value: "other", text: t("editor.other") },
  ];

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const submitFormId = (event.nativeEvent.target as HTMLFormElement).id;

    if (!["file", "url"].includes(submitFormId)) {
      return;
    }
    const submitType = submitFormId === "file" ? "file" : "url";

    setSubmitType(submitType);

    if (submitType === "url") {
      if (!url || !validator.isURL(url)) {
        notify(t("editor.notvalidurl"), { state: "error" });
        return;
      }

      const hasNotYamlFilenameExtension = !hasYamlFileExtension(url);
      if (hasNotYamlFilenameExtension) {
        notify(t("editor.filenotsupported"), { state: "error" });
        return;
      }
    }

    if (submitType === "file") {
      //check application type
      const isNotYamlFile = !isYamlFile(file);
      console.log(
        "submitType: file",
        `isNotYamlFile: ${isNotYamlFile}`,
        file?.type,
      );
      if (isNotYamlFile) {
        notify(t("editor.filenotsupported"), { state: "error" });
        return;
      }
    }

    setModalVisibility(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length) {
      setFile(files[0]);
    }
  };

  const handleUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setUrl(value);

    // Automatically select gitlab source if URL host is gitlab.com
    try {
      const parsedUrl = new URL(value);

      if (parsedUrl.host === "gitlab.com") {
        setSource("gitlab");
      }

      if (parsedUrl.host === "github.com") {
        setSource("other");
      }

      if (parsedUrl.host !== "gitlab.com" && parsedUrl.host !== "github.com") {
        setComboboxOpen(true);
      }
    } catch (error) {
      console.error("Invalid URL:", error);
    }
  };

  const handleSourceChange = (
    selectedValue: string | { value: string; text: string } | null,
  ) => {
    if (selectedValue && typeof selectedValue === "object") {
      setSource(selectedValue.value as "gitlab" | "other");
    } else if (typeof selectedValue === "string") {
      const option = sourceOptions.find((opt) => opt.value === selectedValue);
      if (option) {
        setSource(option.value as "gitlab" | "other");
      }
    }
  };

  return (
    <div className="preview__upload pb-4">
      <div className="px-4">
        <div className="mt-4">
          <p>{t("editor.upload.title")}</p>
        </div>
        <div className="rounded overflow-hidden">
          <TabContainer defaultActiveKey="file">
            <TabNav className="d-flex justify-content-center">
              <TabNavItem>
                <TabNavLink disabled={!!url} eventKey="file">
                  {t("editor.upload.file")}
                </TabNavLink>
              </TabNavItem>
              <TabNavItem>
                <TabNavLink disabled={!!file} eventKey="url">
                  {t("editor.upload.remote")}
                </TabNavLink>
              </TabNavItem>
            </TabNav>
            <TabContent className="bg-white p-4">
              <TabPane eventKey="file">
                <Form
                  id="file"
                  inline
                  onSubmit={handleSubmit}
                  innerRef={localFormRef}
                  className="text-dark"
                >
                  <Row>
                    <p>{t("editor.browsefile")}</p>
                  </Row>
                  <Input
                    className="d-none"
                    innerRef={inputRef}
                    type="file"
                    accept=".yml, .yaml"
                    onChange={handleFileChange}
                  />
                  <Row
                    className="d-flex justify-content-center"
                    style={{ marginLeft: 0, marginRight: 0 }}
                  >
                    <Button
                      className="mb-2 w-100"
                      color="secondary"
                      outline
                      onClick={() => inputRef.current?.click()}
                    >
                      <Icon color="secondary" icon="it-file" />
                      <span>{t("editor.browse")}</span>
                    </Button>
                  </Row>
                </Form>
              </TabPane>
              <TabPane eventKey="url">
                <Form
                  id="url"
                  inline
                  onSubmit={handleSubmit}
                  innerRef={remoteFormRef}
                >
                  <Row>
                    <p className="text-dark">{t("editor.pastefile")}</p>
                  </Row>
                  <Row>
                    <InputGroup>
                      <input
                        className="form-control"
                        placeholder={SAMPLE_YAML_URL}
                        onChange={handleUrlChange}
                        type="url"
                        value={url}
                      />
                    </InputGroup>
                  </Row>
                  {comboboxOpen && (
                    <Row className="mt-4 mb-5 pb-4">
                      <p className="text-dark mb-2">{t("editor.source")}</p>
                      <Combobox
                        data={sourceOptions}
                        value={sourceOptions.find(
                          (opt) => opt.value === source,
                        )}
                        onChange={handleSourceChange}
                        textField="text"
                        className="w-100"
                        placeholder={t("editor.selectSource")}
                      />
                    </Row>
                  )}
                </Form>
              </TabPane>
            </TabContent>
          </TabContainer>
        </div>
        <ResetFormConfirm
          display={isModalVisible}
          toggle={() => setModalVisibility(!isModalVisible)}
          submit={() => {
            setModalVisibility(false);
            if (submitType === "url") {
              onBack();
              yamlLoadEventBus.emit("loadRemoteYaml", { url, source });
            }

            if (submitType === "file" && file) {
              onBack();
              yamlLoadEventBus.emit("loadFileYaml", file);
            }
          }}
        />
      </div>
      <div className="upload-panel__footer position-relative pt-4">
        <Button
          type="button"
          className={`${
            inputRef?.current?.value ? "position-absolute start-0" : ""
          }`}
        >
          <div className="d-flex gap-2 justify-content-center align-items-center ms-4">
            <Icon color="white" icon="it-arrow-left" size="sm" />
            <span className="action" onClick={onBack}>
              {t("editor.back")}
            </span>
          </div>
        </Button>
        {(file || url) && (
          <Button
            type="button"
            onClick={() => {
              if (file) {
                localFormRef.current?.requestSubmit();
              }

              if (url) {
                remoteFormRef.current?.requestSubmit();
              }
            }}
          >
            <div className="d-flex gap-2 justify-content-center align-items-center ms-4">
              <Icon color="white" icon="it-upload" size="sm" />
              <span className="action">{t("editor.import")}</span>
            </div>
          </Button>
        )}
      </div>
    </div>
  );
}
