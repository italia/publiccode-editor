import {
  Button,
  Form,
  FormProps,
  Icon,
  Input,
  InputGroup,
  InputProps,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row
} from "design-react-kit";
import { ChangeEventHandler, MouseEventHandler, useRef } from "react";
import { useTranslation } from "react-i18next";
import { SAMPLE_YAML_URL } from "../contents/constants";

interface Props {
  isOpen: boolean;
  toggle: MouseEventHandler<unknown>;
  url: string;
  onUrlChange: InputProps["onChange"];
  onFileChange: ChangeEventHandler<HTMLInputElement>;
  onSubmit: FormProps["onSubmit"];
}

export default function UploadModal({
  isOpen,
  toggle,
  url,
  onUrlChange,
  onSubmit,
  onFileChange
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  return (
    <Modal isOpen={isOpen} toggle={toggle} scrollable>
      <ModalHeader toggle={toggle}>
        Upload an existing publiccode.yml
      </ModalHeader>
      <ModalBody>
        <Form id="file" inline onSubmit={onSubmit}>

          <Row>
            <p>{t("editor.browsefile")}</p>
          </Row>
          <Input
            className="d-none"
            innerRef={inputRef}
            type="file"
            accept=".yml, .yaml"
            onChange={onFileChange}
          />
          <Row className="d-flex justify-content-center">
              <Button className="mb-2" size="lg" color="outline-primary" onClick={() => inputRef.current?.click()}>
                <Icon color="primary" icon="it-file" />
                {t("editor.browse")}
              </Button>

              <Button size="lg" color="primary" type="submit" disabled={!inputRef?.current?.value}>
                <Icon color="white" icon="it-upload" />
                {t("editor.import")}
              </Button>

          </Row>
        </Form>
        <Row className="mt-3">
          <p>{t("editor.pastefile")}</p>
        </Row>
        <Form id="url" inline onSubmit={onSubmit}>
          <Row>
            <InputGroup>
              <input
                className="form-control"
                placeholder={SAMPLE_YAML_URL}
                onChange={onUrlChange}
                type="url"
                value={url}
              />
              <Button color="primary" size="xs" type="submit">
                <Icon color="white" icon="it-upload" size="xs" />
              </Button>
            </InputGroup>
          </Row>
        </Form>
      </ModalBody>
      <ModalFooter></ModalFooter>
    </Modal>
  );
}
