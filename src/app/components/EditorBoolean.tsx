import { FormGroup, Label } from "design-react-kit";
import { get } from "lodash";
import {
  FieldPathByValue,
  useController,
  useFormContext,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { RequiredDeep } from "type-fest";
import PublicCode from "../contents/publiccode";
import Input from "./Input";

type Props<T> = {
  fieldName: T;
  required?: boolean;
  deprecated?: boolean;
};

export default function EditorBoolean<
  T extends FieldPathByValue<RequiredDeep<PublicCode>, boolean>,
>({ fieldName, required, deprecated }: Props<T>): JSX.Element {
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
    <fieldset className="editor-boolean">
      <legend>{`${label}${required ? " *" : ""}${
        deprecated ? ` - ${t(`editor.form.deprecatedField`)}` : ""
      }`}</legend>
      <FormGroup check inline>
        <Input
          onBlur={field.onBlur}
          onChange={() => {
            field.onChange(undefined);
          }}
          type="radio"
          id={`${fieldName}-unset`}
          value={"unset"}
          checked={typeof field.value !== "boolean"}
          ref={field.ref}
        />
        <Label check htmlFor={`${fieldName}-unset`}>
          {t("editor.form.unset")}
        </Label>
      </FormGroup>
      <FormGroup check inline>
        <Input
          onBlur={field.onBlur}
          onChange={() => {
            field.onChange(true);
          }}
          type="radio"
          id={`${fieldName}-true`}
          value={"true"}
          checked={field.value === true}
          ref={field.ref}
        />
        <Label check htmlFor={`${fieldName}-true`}>
          {t("editor.form.true")}
        </Label>
      </FormGroup>
      <FormGroup check inline>
        <Input
          onBlur={field.onBlur}
          onChange={() => {
            field.onChange(false);
          }}
          type="radio"
          id={`${fieldName}-false`}
          value={"false"}
          checked={field.value === false}
          ref={field.ref}
        />
        <Label check htmlFor={`${fieldName}-false`}>
          {t("editor.form.false")}
        </Label>
      </FormGroup>
      {errorMessage && (
        <div className="form-feedback just-validate-error-label">
          {errorMessage}
        </div>
      )}
    </fieldset>
  );
}
