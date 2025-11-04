import { get } from "lodash";
import {
  FieldPathByValue,
  useController,
  useFormContext,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Combobox } from "react-widgets";
import { Filter } from "react-widgets/Filter";
import { RequiredDeep } from "type-fest";
import PublicCode from "../contents/publiccode";

type Props<T> = {
  fieldName: T;
  required?: boolean;
  data: Array<{ value: string; text: string; group?: string }>;
  filter?: Filter<{ value: string; text: string; group?: string }>;
};

export default function EditorSelect<
  T extends FieldPathByValue<RequiredDeep<PublicCode>, string>,
>({ fieldName, required, data, filter }: Props<T>): JSX.Element {
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
          const value =
            typeof d !== "string" && d !== undefined ? d.value : (d ?? "");

          onChange(value);
        }}
        value={value}
        data={[...(!required ? [{text: "", value: ""}] : []), ...data]}
        dataKey="value"
        textField="text"
        renderListItem={(item) => {
          if (item.value === "") {
            return <span>(unset)</span>;
          } else {
            return <span>{item.text}</span>;
          }
        }}
        filter={filter}
        groupBy={"group"}
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
