import {
  FieldPathByValue,
  useController,
  useFormContext,
} from "react-hook-form";
import Input from "./Input";
import { useTranslation } from "react-i18next";
import PublicCode from "../contents/publiccode";
import { FormGroup, Label } from "design-react-kit";
import { RequiredDeep } from "type-fest";

type Props<T> = {
  fieldName: T;
  required?: boolean;
};

export default function EditorBoolean<
  T extends FieldPathByValue<RequiredDeep<PublicCode>, boolean>
>({ fieldName, required }: Props<T>): JSX.Element {
  const { control } = useFormContext<PublicCode>();
  const { field } = useController<PublicCode, T>({
    control,
    name: fieldName,
  });
  const { t } = useTranslation();

  const label = t(`publiccodeyml.${fieldName}.label`);

  return (
    <fieldset>
      <legend>{`${label}${required ? " *" : ""}`}</legend>
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
          unset
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
          true
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
          false
        </Label>
      </FormGroup>
    </fieldset>
  );
}
