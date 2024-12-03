import { Button, Container, notify } from "design-react-kit";
import { ChangeEvent, FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";

import validator from "validator";
import { isYamlFile } from "../yaml-upload";
import { ResetFormConfirm } from "./ResetFormConfirm";
import UploadModal from "./UploadModal";

interface Props {
  submit: () => void;
  loadRemoteYaml: (url: string) => void;
  loadFileYaml: (file: File) => void;
  trigger: () => void;
  reset: () => void;
  languages: Array<string>;
  yamlLoaded: boolean;
}

export const Footer = (props: Props): JSX.Element => {
  const { t } = useTranslation();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [isModalVisible, setModalVisibility] = useState(false);
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitType, setSubmitType] = useState<'file' | 'url' | undefined>(undefined)


  //https://raw.githubusercontent.com/italia/design-angular-kit/refs/heads/main/publiccode.yml
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const submitFormId = (event.nativeEvent.target as HTMLFormElement).id

    if (!['file', 'url'].includes(submitFormId)) {
      return;
    }
    const submitType = submitFormId === 'file' ? 'file' : 'url';

    setSubmitType(submitType)

    if (submitType === 'url') {
      const {
        [0]: { value },
      } = event.target as typeof event.target & {
        [0]: { value?: string };
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
    }

    if (submitType === 'file') {
      //check application type
      console.log('here', file?.type)
      const isNotApplicationTypeYaml = !isYamlFile(file)
      if (isNotApplicationTypeYaml) {
        notify(t("editor.filenotsupported"), { state: "error" });
        return;
      }
    }

    setModalVisibility(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length) {
      setFile(files[0]);
    }
  };

  const handleUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setUrl(value);
  };
  return (
    <>
      <div className="py-5" />
      <Container
        className="position-fixed bottom-0 start-50 translate-middle-x bg-body py-4 border-top"
        style={{ zIndex: 2 }}
      >
        <div className="d-grid gap-2 d-md-flex justify-content-md-center mx-auto col-md-6">
          <Button
            color="warning"
            onClick={() => props.reset()}
            disabled={!props.languages || props.languages.length === 0}
          >
            {t("editor.form.reset.button")}
          </Button>
          <UploadModal
            isOpen={uploadOpen}
            toggle={() => setUploadOpen(!uploadOpen)}
            url={url}
            onUrlChange={handleUrlChange}
            onFileChange={handleFileChange}
            onSubmit={handleSubmit}
          />
          <Button color="light" onClick={() => setUploadOpen(!uploadOpen)}>
            {t("editor.form.upload")}
          </Button>
          <Button
            color="primary"
            disabled={!props.languages || props.languages.length === 0}
            onClick={props.trigger}
          >
            {props.yamlLoaded
              ? t("editor.form.validate.button")
              : t("editor.form.generate")}
          </Button>
          <ResetFormConfirm
            display={isModalVisible}
            toggle={() => setModalVisibility(!isModalVisible)}
            submit={() => {
              setModalVisibility(false);
              setUploadOpen(false);
              if (submitType === 'url') {
                props.loadRemoteYaml(url);
              }
              if (submitType === 'file' && file) {
                props.loadFileYaml(file)
              }
            }}
          />
        </div>
      </Container>
    </>
  );
};
