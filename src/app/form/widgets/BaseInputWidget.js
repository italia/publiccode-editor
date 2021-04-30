import React, { useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Info from "../../components/Info";
import { useController, useFormContext } from "react-hook-form";
import { get } from "lodash";

const BaseInputWidget = (props) => {
  const name = props.fieldName;
  const id = `field-${name}`;
  const { control, formState } = useFormContext();
  const propertyNames = name.split(/\./);
  const propertyName = propertyNames[propertyNames.length - 1];

  // when coming from an upload data flow from the top
  // using setValue method of RHF
  // Here we need to check whether props.defaultValue contains
  // a subobject (in case they are from an array field)
  const innerPropertyDefaultValue =
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
    meta: { invalid },
  } = useController({
    name,
    control,
    defaultValue:
      props.schema.value || innerPropertyDefaultValue || defaultValue || "",
  });
  const className = classNames(["form-group", { "has-error": invalid }]);
  const [count, setCount] = useState(0);

  return (
    <div className={className}>
      {props.showLabel && (
        <label className="control-label" htmlFor={id}>
          {props.label} {props.schema.language ? `(${props.schema.lang})` : ""}{" "}
          {props.required ? "*" : ""}
        </label>
      )}

      <input
        {...inputProps}
        ref={ref}
        id={id}
        type={props.type}
        required={props.required}
        className="form-control"
        placeholder={props.placeholder}
        maxLength={props.maxLength}
        minLength={props.minLength}
        disabled={props.schema.disabled}
        onKeyUp={(val) => {
          setCount(val.target.value.length);
        }}
      />
      {invalid && (
        <span className="help-block">
          {get(formState.errors, name) && get(formState.errors, name).message}
        </span>
      )}
      {props.maxLength && (
        <Info description={count + "/" + props.maxLength + " chars used"} />
      )}
      <Info
        inputTitle={
          props.schema.rawTitle || props.fieldName || props.schema.title
        }
        description={props.schema.description}
      />
    </div>
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
