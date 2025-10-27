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
      errors as Record<string, { type: string; message: string }>,
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
        <div className="d-flex flex-wrap gap-2 mb-3 ps-2">
          {awards.map((feat) => (
            <Chip simple key={feat} className="d-flex align-items-center">
              <ChipLabel>{feat}</ChipLabel>
              <Button
                color="link"
                icon
                onClick={() => remove(feat)}
                size="xs"
                className="ms-1 p-0"
                aria-label={`Remove ${feat}`}
              >
                <Icon icon="it-close" size="sm" />
              </Button>
            </Chip>
          ))}
        </div>
        <InputGroup>
          <Input
            {...field}
            type="text"
            value={current}
            onChange={({ target }) => setCurrent(target.value)}
            innerRef={inputRef}
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

        {errorMessage && (
          <div className="form-feedback just-validate-error-label">
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
}
