import { Tooltip } from "bootstrap";
import {
  Button,
  Icon,
  Input,
  TextArea,
  UncontrolledTooltip,
} from "design-react-kit";
import { get } from "lodash";
import { useEffect, useRef } from "react";
import {
  FieldPathByValue,
  useController,
  useFormContext,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { RequiredDeep } from "type-fest";
import { displayName } from "../../i18n";
import PublicCode, { Description } from "../contents/publiccode";

type Props<T> = {
  fieldName: T;
  lang: string;
  required?: boolean;
  textarea?: boolean;
  deprecated?: boolean;
};

export default function EditorInput<
  T extends FieldPathByValue<RequiredDeep<Description>, string>,
>({ fieldName, lang, required, textarea, deprecated }: Props<T>) {
  const { control } = useFormContext<PublicCode>();
  const {
    field: { onBlur, onChange, value, name, ref },
    formState: { errors },
  } = useController<PublicCode>({
    control,
    name: `description.${lang}.${fieldName}`,
    shouldUnregister: true,
  });
  const { t } = useTranslation();

  const label = t(`publiccodeyml.description.${fieldName}.label`);
  const description = t(`publiccodeyml.description.${fieldName}.description`);

  const extraLangInfo = ` (in ${displayName(lang, undefined, "language")})`;
  const buttonRef = useRef<HTMLButtonElement>(null);

  const Tag = textarea ? TextArea : Input;

  useEffect(() => {
    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]',
    );
    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      new Tooltip(tooltipTriggerEl);
    });
  }, []);

  return (
    <div>
      <div>
        <div className="position-relative mb-2">
          <label className="description-label active">
            {`${label}${extraLangInfo}${required ? " *" : ""}${
              deprecated ? ` - ${t(`editor.form.deprecatedField`)}` : ""
            }`}
          </label>
          <Button
            type="button"
            innerRef={buttonRef}
            className="info-icon-wrapper"
          >
            <Icon icon="it-info-circle" className="info-icon" />
          </Button>
          <UncontrolledTooltip placement="bottom" target={buttonRef}>
            {description}
          </UncontrolledTooltip>
        </div>
        <Tag
          onBlur={onBlur}
          onChange={({ target: { value } }) => onChange(value)}
          name={name}
          value={(value as string) || ""}
          innerRef={ref}
          // label={`${label}${extraLangInfo}${required ? " *" : ""}${
          //   deprecated ? ` - ${t(`editor.form.deprecatedField`)}` : ""
          // }`}
          //placeholder={label}
          // infoText={description}
          valid={get(errors, `description.${lang}.${fieldName}`) && false}
          validationText={get(
            errors,
            `description.${lang}.${fieldName}.message`,
          )}
          rows={textarea ? 3 : undefined}
        />
      </div>
    </div>
  );
}
