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
import validator from "validator";
import { SAMPLE_YAML_URL } from "../contents/constants";
import { hasYamlFileExtension, isYamlFile } from "../yaml-upload";
import { ResetFormConfirm } from "./ResetFormConfirm";

type YamlLoadEvents = {
  loadRemoteYaml: string;
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
  const [submitType, setSubmitType] = useState<"file" | "url" | undefined>(
    undefined
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const submitFormId = (event.nativeEvent.target as HTMLFormElement).id;

    if (!["file", "url"].includes(submitFormId)) {
      return;
    }
    const submitType = submitFormId === "file" ? "file" : "url";

    setSubmitType(submitType);

    if (submitType === "url") {
      const {
        [0]: { value },
      } = event.target as typeof event.target & {
        [0]: { value?: string };
      };

      if (!value || !validator.isURL(value)) {
        notify(t("editor.notvalidurl"), { state: "error" });
        return;
      }

      const hasNotYamlFilenameExtension = !hasYamlFileExtension(value);
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
        file?.type
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
  };

  return (
    <div className="preview__upload pb-4">
      <div className="px-4">
        <div className="mt-4">
          <p>Upload an existing publiccode.yml</p>
        </div>
        <div>
          {/* <Select
            id="importType"
            label={t("editor.importSource")}
            onChange={handleChange}
          >
            <option value="">-</option>
            <option value="file">File</option>
            <option value="url">URL</option>
          </Select> */}
          <TabContainer defaultActiveKey="file">
            <TabNav className="d-flex justify-content-center mb-3">
              <TabNavItem>
                <TabNavLink disabled={!!url} eventKey="file">
                  File
                </TabNavLink>
              </TabNavItem>
              <TabNavItem>
                <TabNavLink disabled={!!file} eventKey="url">
                  Remote
                </TabNavLink>
              </TabNavItem>
            </TabNav>
            <TabContent>
              <TabPane eventKey="file">
                <Form
                  id="file"
                  inline
                  onSubmit={handleSubmit}
                  innerRef={localFormRef}
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
                      className="mb-2 bg-white w-100"
                      color="primary"
                      onClick={() => inputRef.current?.click()}
                    >
                      <Icon color="primary" icon="it-file" />
                      <span className="text-primary">{t("editor.browse")}</span>
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
                  <Row className="mt-3">
                    <p>{t("editor.pastefile")}</p>
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
              yamlLoadEventBus.emit("loadRemoteYaml", url);
            }

            if (submitType === "file" && file) {
              onBack();
              yamlLoadEventBus.emit("loadFileYaml", file);
            }
          }}
        />
      </div>
      <div className="upload-panel__footer position-relative">
        <Button
          type="button"
          className={`fw-normal text-decoration-underline ${
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
            className="fw-normal text-decoration-underline"
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
