import {
  FieldPathByValue,
  useController,
  useFormContext,
} from "react-hook-form";
import { RequiredDeep } from "type-fest";
import PublicCode from "../contents/publiccode";
import { useTranslation } from "react-i18next";
import { get } from "lodash";
import { FormGroup, Label } from "design-react-kit";
import Input from "./Input";

type Props<T> = {
  fieldName: T;
  required?: boolean;
  data: Readonly<Array<string>>;
};

export default function EditorRadio<
  T extends FieldPathByValue<RequiredDeep<PublicCode>, string>
>({ fieldName, required, data }: Props<T>): JSX.Element {
  const { control } = useFormContext<PublicCode>();
  const {
    field,
    formState: { errors },
  } = useController<PublicCode, T>({
    control,
    name: fieldName,
  });

  const { t } = useTranslation();
  const label = t(`publiccodeyml.${fieldName}.label`);
  const errorMessage = get(errors, `${fieldName}.message`);

  return (
    <div className="form-group">
      <fieldset className="editor-radio">
        <legend>{`${label}${required ? " *" : ""}`}</legend>
        {!required && (
          <FormGroup check>
            <Input
              {...field}
              checked={!field.value}
              type="radio"
              id={`${fieldName}-unset`}
              value={undefined}
            />
            <Label check htmlFor={`${fieldName}-unset`}>
              (unset)
            </Label>
          </FormGroup>
        )}
        {data.map((key) => (
          <FormGroup check key={key}>
            <Input
              {...field}
              checked={field.value === key}
              type="radio"
              id={`${fieldName}-${key}`}
              value={key}
            />
            <Label check htmlFor={`${fieldName}-${key}`}>
              {key}
            </Label>
          </FormGroup>
        ))}
        {errorMessage && (
          <div className="form-feedback just-validate-error-label ">
            {errorMessage}
          </div>
        )}
      </fieldset>
    </div>
  );
}
