import {
  FieldPathByValue,
  useController,
  useFormContext,
} from "react-hook-form";
import { RequiredDeep } from "type-fest";
import PublicCode, { PublicCodeWithDeprecatedFields } from "../contents/publiccode";
import { useTranslation } from "react-i18next";
import { Multiselect } from "react-widgets";
import { Filter } from "react-widgets/Filter";
import { get } from "lodash";

type Props<T> = {
  fieldName: T;
  required?: boolean;
  data: Array<{ value: string; text: string }>;
  filter?: Filter<{ value: string; text: string }>;
  deprecated?: boolean;
};

type PublicCodeData = PublicCode | PublicCodeWithDeprecatedFields;

export default function EditorMultiselect<
  T extends FieldPathByValue<RequiredDeep<PublicCodeData>, Array<string>>
>({ fieldName, required, data, filter, deprecated }: Props<T>): JSX.Element {
  const { control } = useFormContext<PublicCodeData>();
  const {
    field: { onBlur, onChange, value },
    formState: { errors },
  } = useController<PublicCodeData, T>({
    control,
    name: fieldName,
  });
  const { t } = useTranslation();

  const label = t(`publiccodeyml.${fieldName}.label`);
  const description = t(`publiccodeyml.${fieldName}.description`);
  const errorMessage = get(errors, `${fieldName}.message`);

  return (
    <div className="form-group">
      <label className="active" htmlFor={fieldName}>
        {`${label}${required ? " *" : ""}${deprecated ? ` - ${t(`editor.form.deprecatedField`)}` : ""}`}
      </label>
      <Multiselect
        id={fieldName}
        onBlur={onBlur}
        onChange={(arr) => onChange(arr.map((e) => e.value))}
        value={value}
        data={data}
        dataKey="value"
        textField="text"
        filter={filter}
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
