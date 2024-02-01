import { useState } from "react";
import PropTypes from "prop-types";
import Info from "../../components/Info";
import { useController, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { get } from "lodash";
import { Input } from "design-react-kit";

const BaseInputWidget = (props) => {
  const name = props.fieldName;
  const id = `field-${name}`;
  const { control, formState } = useFormContext();
  const { i18n } = useTranslation();
  const propertyNames = name.split(/\./);
  const propertyName = propertyNames[propertyNames.length - 1];

  // when coming from an upload data flow from the top
  // using setValue method of RHF
  // Here we need to check whether props.defaultValue contains
  // a subobject (in case they are from an array field)
  const innerPropertyDefaultValue =
    // eslint-disable-next-line no-prototype-builtins
    props.defaultValue && props.defaultValue.hasOwnProperty(propertyName)
      ? props.defaultValue[propertyName]
      : null;

  // if props.defaultValue is an object that not contains
  // the name key an object is returned and to avoid
  // to fill the input with [object Object] we need
  // to allow only certain types.
  // awful.
  const defaultValue =
    typeof props.defaultValue === "string" ||
    typeof props.defaultValue === "number" ||
    typeof props.defaultValue === "boolean"
      ? props.defaultValue
      : null;
  const {
    field: { ref, ...inputProps },
    fieldState: { invalid },
  } = useController({
    name,
    control,
    defaultValue:
      props.schema.value || innerPropertyDefaultValue || defaultValue || "",
  });
  const [count, setCount] = useState(0);

  const inLang = props.schema.language
    ? ` (in ${new Intl.DisplayNames([i18n.language], { type: 'language' }).of(props.schema.lang)})`
    : '';

  return (
    <>
      <Input
        {...inputProps}
        label={
          props.showLabel &&
          `${props.label}${inLang} ${props.required ? " *" : ""}`
        }
        invalid={invalid}
        validationText={
          invalid ? get(formState.errors, name)?.message : undefined
        }
        innerRef={ref}
        id={id}
        type={props.type}
        required={props.required}
        placeholder={props.placeholder}
        maxLength={props.maxLength}
        minLength={props.minLength}
        disabled={props.schema.disabled}
        onKeyUp={(val) => {
          setCount(val.target.value.length);
        }}
      />
      {props.maxLength && (
        <Info description={count + "/" + props.maxLength + " chars used"} />
      )}
      <Info
        inputTitle={
          props.schema.rawTitle || props.fieldName || props.schema.title
        }
        description={props.schema.description}
      />
    </>
  );
};

BaseInputWidget.propTypes = {
  schema: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  required: PropTypes.bool,
  fieldName: PropTypes.string,
  label: PropTypes.string,
  normalizer: PropTypes.func,
  description: PropTypes.string,
};

export default BaseInputWidget;
