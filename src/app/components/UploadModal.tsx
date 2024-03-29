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
  Row,
} from "design-react-kit";
import { MouseEventHandler, useRef } from "react";
import { useTranslation } from "react-i18next";
import { SAMPLE_YAML_URL } from "../contents/constants";

interface Props {
  isOpen: boolean;
  toggle: MouseEventHandler<unknown>;
  url: string;
  onUrlChange: InputProps["onChange"];
  onSubmit: FormProps["onSubmit"];
}

export default function UploadModal({
  isOpen,
  toggle,
  url,
  onUrlChange,
  onSubmit,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  return (
    <Modal isOpen={isOpen} toggle={toggle} scrollable>
      <ModalHeader toggle={toggle}>
        Upload an existing publiccode.yml
      </ModalHeader>
      <ModalBody>
        <Row>
          <p>{t("editor.browsefile")}</p>
        </Row>
        <Input
          className="d-none"
          innerRef={inputRef}
          type="file"
          accept=".yml, .yaml"
        />

        <Button color="primary" onClick={() => inputRef.current?.click()}>
          <Icon color="white" icon="it-upload" />
          {t("editor.browse")}
        </Button>

        <Row className="mt-3">
          <p>{t("editor.pastefile")}</p>
        </Row>
        <Form inline onSubmit={onSubmit}>
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
