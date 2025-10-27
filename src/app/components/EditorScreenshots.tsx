import {
  Button,
  Icon,
  Input,
  InputGroup,
  LinkList,
  UncontrolledTooltip,
} from "design-react-kit";
import { get } from "lodash";
import { useRef, useState } from "react";
import { FieldError, useController, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import PublicCode from "../contents/publiccode";
import isValidUrlFn from "../is-valid-url";

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
        {screenshots.length > 0 && (
          <div className="mb-3">
            <LinkList>
              {screenshots.map((screenshot, index) => (
                <div
                  key={screenshot}
                  className="ps-2 d-flex justify-content-between align-items-center border-bottom"
                >
                  <div className="d-flex align-items-center py-2">
                    {isValidUrlFn(screenshot) ? (
                      <a
                        href={screenshot}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="me-2 text-decoration-none p-0"
                      >
                        {screenshot}
                      </a>
                    ) : (
                      <span className="me-2">{screenshot}</span>
                    )}
                    {get(
                      errors,
                      `description.${lang}.screenshots.${index}`,
                    ) && (
                      <span className="form-feedback just-validate-error-label">
                        {" "}
                        *
                      </span>
                    )}
                  </div>
                  <Button
                    color="link"
                    icon
                    onClick={() => remove(screenshot)}
                    size="lg"
                    className="p-0"
                    aria-label={`Remove ${screenshot}`}
                  >
                    <Icon icon="it-close" size="sm" />
                  </Button>
                </div>
              ))}
            </LinkList>
          </div>
        )}
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
