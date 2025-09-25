import {
  Button,
  Chip,
  ChipLabel,
  Icon,
  Input,
  InputGroup,
  UncontrolledTooltip,
} from "design-react-kit";
import { get } from "lodash";
import { useRef, useState } from "react";
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

  const errorMessages = control.getFieldState(`description.${lang}.screenshots`)
    .error as unknown as FieldError[];

  const add = () => {
    onChange([...screenshots, current.trim()]);
    setCurrent("");
  };

  const remove = (feat: string) => {
    onChange(screenshots.filter((elem) => elem !== feat));
  };

  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <div>
      <div className="position-relative">
        <label
          className="description-label active"
          htmlFor={`description.${lang}.screenshots`}
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
        <div className="d-flex flex-wrap gap-2 mb-3 ps-2">
          {screenshots.map((screenshot, index) => (
            <Chip simple key={screenshot} className="d-flex align-items-center">
              <ChipLabel>{screenshot}</ChipLabel>
              {get(errors, `description.${lang}.screenshots.${index}`) && (
                <span className="form-feedback just-validate-error-label ms-1"> *</span>
              )}
              <Button 
                color="link" 
                icon 
                onClick={() => remove(screenshot)} 
                size="xs"
                className="ms-1 p-0"
                aria-label={`Remove ${screenshot}`}
              >
                <Icon icon="it-close" size="sm" />
              </Button>
            </Chip>
          ))}
        </div>
        <InputGroup>
          <Input
            value={current}
            onChange={({ target }) => setCurrent(target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (current.trim() !== "") {
                  add();
                }
              }
            }}
          />
          <div className="input-group-append">
            <Button
              color="primary"
              disabled={current.trim() === ""}
              onClick={add}
            >
              {t("editor.form.add")}
            </Button>
          </div>
        </InputGroup>

        {errorMessages && errorMessages.length && (
          <div className="form-feedback just-validate-error-label">
            {errorMessages &&
              errorMessages?.map((e, index) => (
                <small key={index}>{e?.message}</small>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
