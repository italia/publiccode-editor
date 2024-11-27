import {
  FieldPathByValue,
  useController,
  useFormContext,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import PublicCode, { PublicCodeWithDeprecatedFields } from "../contents/publiccode";
import { get } from "lodash";
import { Input, TextArea } from "design-react-kit";
import { RequiredDeep } from "type-fest";

type Props<T> = {
  fieldName: T;
  required?: boolean;
  textarea?: boolean;
  deprecated?: boolean;
};

type PublicCodeData = PublicCode | PublicCodeWithDeprecatedFields;

export default function EditorInput<
  T extends FieldPathByValue<RequiredDeep<PublicCodeData>, string>
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

  const label = t(`publiccodeyml.${fieldName}.label`);
  const description = t(`publiccodeyml.${fieldName}.description`);

  const Tag = textarea ? TextArea : Input;

  return (
    <Tag
      onBlur={onBlur}
      onChange={onChange}
      name={name}
      value={value || ""}
      innerRef={ref}
      label={`${label}${required ? " *" : ""}${deprecated ? ` - ${t(`editor.form.deprecatedField`)}` : ""}`}
      infoText={description}
      valid={get(errors, fieldName) && false}
      validationText={get(errors, `${fieldName}.message`)}
      rows={textarea ? 3 : undefined}
    />
  );
}
