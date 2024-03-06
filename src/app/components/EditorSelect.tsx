import {
  FieldPathByValue,
  useController,
  useFormContext,
} from "react-hook-form";
import PublicCode from "../contents/publiccode";
import { RequiredDeep } from "type-fest";
import { useTranslation } from "react-i18next";
import { Combobox } from "react-widgets";
import { get } from "lodash";

type Props<T> = {
  fieldName: T;
  required?: boolean;
  data: Array<{ value: string; text: string }>;
};

export default function EditorSelect<
  T extends FieldPathByValue<RequiredDeep<PublicCode>, string>
>({ fieldName, required, data }: Props<T>): JSX.Element {
  const { control } = useFormContext<PublicCode>();
  const {
    field: { onChange, value, name },
    formState: { errors },
  } = useController<PublicCode, T>({
    control,
    name: fieldName,
  });
  const { t } = useTranslation();

  const label = t(`publiccodeyml.${fieldName}.label`);
  const description = t(`publiccodeyml.${fieldName}.description`);
  const errorMessage = get(errors, `${fieldName}.message`);

  return (
    <div className="form-group">
      <label className="active" htmlFor={fieldName}>{`${label}${
        required ? " *" : ""
      }`}</label>
      <Combobox
        name={name}
        onChange={(d) => {
          if (typeof d !== "string") onChange(d.value);
        }}
        value={value}
        data={[...(!required ? [{ text: "(unset)", value: "" }] : []), ...data]}
        dataKey="value"
        textField="text"
      />
      <small className="form-text">{description}</small>
      {errorMessage && (
        <div className="form-feedback just-validate-error-label">
          {errorMessage}
        </div>
      )}
    </div>
  );
}
