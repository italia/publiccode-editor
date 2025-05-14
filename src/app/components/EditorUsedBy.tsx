import {
  Button,
  Icon,
  Input,
  InputGroup,
  UncontrolledTooltip,
} from "design-react-kit";
import { useRef, useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import PublicCode from "../contents/publiccode";
import { removeDuplicate } from "../yaml-upload";

export default function EditorUsedBy(): JSX.Element {
  const { control } = useFormContext<PublicCode>();
  const {
    field: { onChange, value },
  } = useController<PublicCode>({
    control,
    name: `usedBy`,
    shouldUnregister: true,
  });
  const { t } = useTranslation();

  const usedBy: string[] = value ? (value as string[]) : [];
  const [current, setCurrent] = useState<string>("");

  const label = t(`publiccodeyml.usedBy.label`);
  const description = t(`publiccodeyml.usedBy.description`);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const add = () => {
    onChange(removeDuplicate([...usedBy, current.trim()]));
    setCurrent("");
  };

  const remove = (feat: string) => {
    onChange(usedBy.filter((elem) => elem !== feat));
  };

  return (
    <div>
      <div className="position-relative">
        <label className="description-label active" htmlFor={`usedby`}>
          {`${label}`}
        </label>
        <Button innerRef={buttonRef} className="info-icon-wrapper">
          <Icon icon="it-info-circle" className="info-icon mb-2" />
        </Button>
        <UncontrolledTooltip placement="bottom" target={buttonRef}>
          {description}
        </UncontrolledTooltip>
      </div>
      <div className="form-group">
        <ul className="list-group list-group-flush">
          {usedBy.map((feat) => (
            <li
              className="list-group-item d-flex justify-content-between align-items-center"
              key={feat}
            >
              {feat}
              <Button color="link" icon onClick={() => remove(feat)} size="xs">
                <Icon icon="it-delete" size="sm" title="Remove" />
              </Button>
            </li>
          ))}
        </ul>
        <InputGroup>
          <Input
            value={current}
            onChange={({ target }) => setCurrent(target.value)}
          />
          <div className="input-group-append">
            <Button
              color="primary"
              disabled={
                current.trim() === "" || usedBy.includes(current.trim())
              }
              onClick={add}
            >
              Add PA
            </Button>
          </div>
        </InputGroup>
      </div>
    </div>
  );
}
