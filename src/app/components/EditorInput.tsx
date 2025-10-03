import {
  Button,
  Icon,
  Input,
  TextArea,
  UncontrolledTooltip,
} from "design-react-kit";
import { get } from "lodash";
import { useRef } from "react";
import {
  FieldPathByValue,
  useController,
  useFormContext,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { RequiredDeep } from "type-fest";
import PublicCode, {
  PublicCodeWithDeprecatedFields,
} from "../contents/publiccode";

type Props<T> = {
  fieldName: T;
  required?: boolean;
  textarea?: boolean;
  deprecated?: boolean;
};

type PublicCodeData = PublicCode | PublicCodeWithDeprecatedFields;

export default function EditorInput<
  T extends FieldPathByValue<RequiredDeep<PublicCodeData>, string>,
>({ fieldName, required, textarea, deprecated }: Props<T>) {
  const { control } = useFormContext<PublicCodeData>();
  const {
    field: { onBlur, onChange, value, name, ref },
    formState: { errors },
  } = useController<PublicCodeData, T>({
    control,
    name: fieldName,
  });
  const { t } = useTranslation();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const label = t(`publiccodeyml.${fieldName}.label`);
  const description = t(`publiccodeyml.${fieldName}.description`);

  const Tag = textarea ? TextArea : Input;

  return (
    <div>
      <div className="position-relative mb-2">
        <label className="description-label active">
          {`${label}${required ? " *" : ""}${
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
        onChange={onChange}
        name={name}
        value={value || ""}
        innerRef={ref}
        // label={`${label}${required ? " *" : ""}${
        //   deprecated ? ` - ${t(`editor.form.deprecatedField`)}` : ""
        // }`}
        //placeholder={label}
        // infoText={description}
        valid={get(errors, fieldName) && false}
        validationText={get(errors, `${fieldName}.message`)}
        rows={textarea ? 3 : undefined}
      />
    </div>
  );
}
