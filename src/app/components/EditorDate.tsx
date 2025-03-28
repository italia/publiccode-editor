import {
  FieldPathByValue,
  useController,
  useFormContext,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import PublicCode from "../contents/publiccode";
import { get } from "lodash";
import { Button, Icon, Input, UncontrolledTooltip } from "design-react-kit";
import { RequiredDeep } from "type-fest";
import { useRef } from "react";

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
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <div>
      <div className="position-relative">
        <label className="description-label active" htmlFor={fieldName}>
          {`${label}${required ? " *" : ""}`}
        </label>
        <Button
          type="button"
          innerRef={buttonRef}
          className="info-icon-wrapper"
        >
          <Icon icon="it-info-circle" className="info-icon mb-2" />
        </Button>
        <UncontrolledTooltip placement="bottom" target={buttonRef}>
          {description}
        </UncontrolledTooltip>
      </div>
      <Input
        onBlur={onBlur}
        onChange={onChange}
        name={name}
        value={value || ""}
        innerRef={ref}
        valid={get(errors, fieldName) && false}
        validationText={get(errors, `${fieldName}.message`)}
        type="date"
      />
    </div>
  );
}
