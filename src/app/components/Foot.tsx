import { ChangeEvent, FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Container, notify } from "design-react-kit";

import validator from "validator";
import { ResetFormConfirm } from "./ResetFormConfirm";
import UploadModal from "./UploadModal";

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
  const [uploadOpen, setUploadOpen] = useState(false);
  const [isModalVisible, setModalVisibility] = useState(false);
  const [url, setUrl] = useState("");

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
            onUrlChange={handleChange}
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
              ? t("editor.form.validate")
              : t("editor.form.generate")}
          </Button>
          <ResetFormConfirm
            display={isModalVisible}
            toggle={() => setModalVisibility(!isModalVisible)}
            submit={() => {
              setModalVisibility(false);
              setUploadOpen(false);
              props.loadRemoteYaml(url);
            }}
          />
        </div>
      </Container>
    </>
  );
};
