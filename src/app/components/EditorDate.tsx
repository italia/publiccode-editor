import {
  FieldPathByValue,
  useController,
  useFormContext,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import PublicCode from "../contents/publiccode";
import { get } from "lodash";
import { Input } from "design-react-kit";
import { RequiredDeep } from "type-fest";

type Props<T> = {
  fieldName: T;
  required?: boolean;
};

export default function EditorDate<
  T extends FieldPathByValue<RequiredDeep<PublicCode>, string>
>({ fieldName, required }: Props<T>) {
  const { control } = useFormContext<PublicCode>();
  const {
    field: { onBlur, onChange, value, name, ref },
    formState: { errors },
  } = useController<PublicCode, T>({
    control,
    name: fieldName,
  });
  const { t } = useTranslation();

  const label = t(`publiccodeyml.${fieldName}.label`);
  const description = t(`publiccodeyml.${fieldName}.description`);

  return (
    <Input
      onBlur={onBlur}
      onChange={onChange}
      name={name}
      value={value || ""}
      innerRef={ref}
      label={`${label}${required ? " *" : ""}`}
      infoText={description}
      valid={get(errors, fieldName) && false}
      validationText={get(errors, `${fieldName}.message`)}
      type="date"
    />
  );
}
