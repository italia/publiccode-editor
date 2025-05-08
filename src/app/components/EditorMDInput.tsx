import { Button, Icon, UncontrolledTooltip } from "design-react-kit";
import MDEditor from "@uiw/react-md-editor";
import { get } from "lodash";
import {
  FieldPathByValue,
  useController,
  useFormContext,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { RequiredDeep } from "type-fest";
import { displayName } from "../../i18n";
import PublicCode, { Description } from "../contents/publiccode";
import { Tooltip } from "bootstrap";
import { useEffect, useRef } from "react";

type Props<T> = {
  fieldName: T;
  lang: string;
  required?: boolean;
  textarea?: boolean;
  deprecated?: boolean;
};

export default function EditorInput<
  T extends FieldPathByValue<RequiredDeep<Description>, string>
>({ fieldName, lang, required, deprecated }: Props<T>) {
  const { control } = useFormContext<PublicCode>();
  const {
    field: { onBlur, onChange, value, ref, name },
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

  useEffect(() => {
    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]'
    );
    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      new Tooltip(tooltipTriggerEl);
    });
  }, []);

  const isValid = get(errors, `description.${lang}.${fieldName}`) && false;
  const validationText = get(
    errors,
    `description.${lang}.${fieldName}.message`
  );
  return (
    <div>
      <div>
        <div className='position-relative mb-2'>
          <label className='description-label active'>
            {`${label}${extraLangInfo}${required ? " *" : ""}${
              deprecated ? ` - ${t(`editor.form.deprecatedField`)}` : ""
            }`}
          </label>
          <Button
            type='button'
            innerRef={buttonRef}
            className='info-icon-wrapper'
          >
            <Icon icon='it-info-circle' className='info-icon' />
          </Button>
          <UncontrolledTooltip placement='bottom' target={buttonRef}>
            {description}
          </UncontrolledTooltip>
        </div>

        {/*
        <MDEditor value={(value as string) || ""} onChange={setValue} />
        <MDEditor.Markdown source={value} style={{ whiteSpace: "pre-wrap" }} />
        */}
        <input
          type='hidden'
          name={name}
          value={(value as string) || ""}
          ref={ref}
        />
        <MDEditor
          onBlur={onBlur}
          value={(value as string) || ""}
          onChange={onChange}
        />
        {!isValid && validationText && (
          <div className='form-feedback just-validate-error-label'>
            {validationText}
          </div>
        )}
      </div>
    </div>
  );
}
