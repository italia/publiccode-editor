import { Button, Icon, Input, InputGroup } from "design-react-kit";
import { get } from "lodash";
import { useState } from "react";
import { FieldError, useController, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import PublicCode from "../contents/publiccode";

interface Props {
  lang: string;
}

export default function EditorScreenshots({ lang }: Props): JSX.Element {
  const { control } = useFormContext<PublicCode>();
  const {
    field: { onChange, value },
    formState: { errors },
  } = useController<PublicCode>({
    control,
    name: `description.${lang}.screenshots`,
    shouldUnregister: true,
  });
  const { t } = useTranslation();

  const screenshots: string[] = value ? (value as string[]) : [];
  const [current, setCurrent] = useState<string>("");

  const label = t(`publiccodeyml.description.screenshots.label`);
  const description = t(`publiccodeyml.description.screenshots.description`);
  
  const errorMessages = control.getFieldState(`description.${lang}.screenshots`).error as unknown as FieldError[]

  const add = () => {
    onChange([...screenshots, current.trim()]);
    setCurrent("");
  };

  const remove = (feat: string) => {
    onChange(screenshots.filter((elem) => elem !== feat));
  };


  return (
    <div className="form-group">
      <label
        className="active"
        htmlFor={`description.${lang}.screenshots`}
      >{`${label} *`}</label>
      <ul className="list-group list-group-flush">
        {screenshots.map((screenshot, index) => (
          <li
            className="list-group-item d-flex justify-content-between align-items-center"
            key={screenshot}
          >
            {screenshot}
            {
              get(errors, `description.${lang}.screenshots.${index}`)
              && <p className="form-feedback just-validate-error-label" > *</p>
            }
            <Button
              color="link"
              icon
              onClick={() => remove(screenshot)}
              size="xs"
            >
              <Icon icon="it-delete" size="sm" title="Remove screenshot" />
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
            disabled={current.trim() === ""}
            onClick={add}
          >
            Add screenshot
          </Button>
        </div>
      </InputGroup>

      <small className="form-text">{description}</small>
      {errorMessages && errorMessages.length && (
        <div className="form-feedback just-validate-error-label">
          {
            errorMessages && errorMessages?.map((e, index) =>
              <small key={index}>{e?.message}</small>
            )
          }
        </div>
      )}
    </div>
  );
}
