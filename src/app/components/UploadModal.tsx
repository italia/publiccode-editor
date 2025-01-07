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
  Select
} from "design-react-kit";
import { ChangeEventHandler, MouseEventHandler, useEffect, useRef, useState } from "react";
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
type ImportModeType = 'file' | 'url';

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

  const [importMode, setImportMode] = useState<ImportModeType | undefined>(undefined)

  const handleChange = (e: string) => {
    console.log(e);

    if (!e) {
      setImportMode(undefined)
      return;
    }

    setImportMode(e as ImportModeType);
  }

  useEffect(() => {
    return () => {
      setImportMode(undefined)
    }
  }, [isOpen])

  return (
    <Modal isOpen={isOpen} toggle={toggle} scrollable>
      <ModalHeader toggle={toggle}>
        Upload an existing publiccode.yml
      </ModalHeader>
      <ModalBody>
        <Select id='importType' label={t('editor.importSource')} onChange={handleChange}>
          <option value=''>-</option>
          <option value='file'>File</option>
          <option value='url'>URL</option>
        </Select>
        {importMode === 'file' && <Form id="file" inline onSubmit={onSubmit}>

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
          <Row className="d-flex justify-content-center" style={{ marginLeft: 0, marginRight: 0 }}>
            <Button className="mb-2" size="lg" color="outline-primary" onClick={() => inputRef.current?.click()}>
              <Icon color="primary" icon="it-file" />
              {t("editor.browse")}
            </Button>

            <Button size="lg" color="primary" type="submit" disabled={!inputRef?.current?.value}>
              <Icon color="white" icon="it-upload" />
              {t("editor.import")}
            </Button>

          </Row>
        </Form>}

        {importMode === 'url' && <Form id="url" inline onSubmit={onSubmit}>
          <Row className="mt-3">
            <p>{t("editor.pastefile")}</p>
          </Row>
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
        </Form>}
      </ModalBody>
      <ModalFooter></ModalFooter>
    </Modal>
  );
}
