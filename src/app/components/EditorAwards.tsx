import {
  Button,
  Icon,
  Input,
  InputGroup,
  UncontrolledTooltip,
} from "design-react-kit";
import { get } from "lodash";
import { useEffect, useRef, useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import PublicCode from "../contents/publiccode";
import flattenObject from "../flatten-object-to-record";
import { removeDuplicate } from "../yaml-upload";

interface Props {
  lang: string;
}

export default function EditorAwards({ lang }: Props): JSX.Element {
  const formFieldName = `description.${lang}.awards` as keyof PublicCode;

  const { control } = useFormContext<PublicCode>();
  const {
    field,
    field: { onChange, value },
    formState: { errors },
  } = useController<PublicCode>({
    control,
    name: `description.${lang}.awards`,
    shouldUnregister: true,
  });
  const { t } = useTranslation();

  const awards: string[] = value ? (value as string[]) : [];
  const [current, setCurrent] = useState<string>("");

  const label = t(`publiccodeyml.description.awards.label`);
  const description = t(`publiccodeyml.description.awards.description`);
  const errorMessage = get(errors, `description.${lang}.awards.message`);

  const add = () => {
    onChange(removeDuplicate([...awards, current.trim()]));
    setCurrent("");
  };

  const remove = (feat: string) => {
    onChange(awards.filter((elem) => elem !== feat));
  };

  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const errorsRecord = flattenObject(
      errors as Record<string, { type: string; message: string }>
    );
    const formFieldKeys = Object.keys(errorsRecord);
    const isFirstError =
      formFieldKeys &&
      formFieldKeys.length &&
      formFieldKeys[0] === formFieldName;

    if (isFirstError) {
      inputRef.current?.focus();
    }
  }, [errors, formFieldName, inputRef]);

  return (
    <div>
      <div className="position-relative">
        <label
          className="description-label active"
          htmlFor={`description.${lang}.awards`}
        >{`${label}`}</label>
        <Button
          type="button"
          innerRef={buttonRef}
          className="info-icon-wrapper"
        >
          <Icon icon="it-info-circle" className="info-icon mb-2" />
        </Button>
        <UncontrolledTooltip placement="bottom" target={buttonRef}>
          {description}
        </UncontrolledTooltip>
      </div>
      <div className="form-group">
        <ul className="list-group list-group-flush">
          {awards.map((feat) => (
            <li
              className="list-group-item d-flex justify-content-between align-items-center"
              key={feat}
            >
              {feat}
              <Button color="link" icon onClick={() => remove(feat)} size="xs">
                <Icon icon="it-delete" size="sm" title="Remove award" />
              </Button>
            </li>
          ))}
        </ul>
        <InputGroup>
          <Input
            {...field}
            value={current}
            onChange={({ target }) => setCurrent(target.value)}
            innerRef={inputRef}
          />
          <div className="input-group-append">
            <Button
              color="primary"
              disabled={current.trim() === ""}
              onClick={add}
            >
              Add
            </Button>
          </div>
        </InputGroup>

        {errorMessage && (
          <div className="form-feedback just-validate-error-label">
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
}
