import { Button, Icon, Input, InputGroup } from "design-react-kit";
import { useState } from "react";
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

  const add = () => {
    onChange(removeDuplicate([...usedBy, current.trim()]));
    setCurrent("");
  };

  const remove = (feat: string) => {
    onChange(usedBy.filter((elem) => elem !== feat));
  };


  return (
    <div className="form-group">
      <label
        className="active"
        htmlFor={`usedby`}
      >{`${label}`}</label>
      <ul className="list-group list-group-flush">
        {usedBy.map((feat) => (
          <li
            className="list-group-item d-flex justify-content-between align-items-center"
            key={feat}
          >
            {feat}
            <Button
              color="link"
              icon
              onClick={() => remove(feat)}
              size="xs"
            >
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
            disabled={current.trim() === "" || usedBy.includes(current.trim())}
            onClick={add}
          >
            Add PA
          </Button>
        </div>
      </InputGroup>

      <small className="form-text">{description}</small>
    </div>
  );
}
