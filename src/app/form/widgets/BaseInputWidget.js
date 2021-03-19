import React, { useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Info from "../../components/Info";
import { useController, useFormContext } from "react-hook-form";

const BaseInputWidget = (props) => {
  const name = props.fieldName;
  const id = `field-${name}`;
  const { control, formState } = useFormContext();
  const {
    field: { ref, ...inputProps },
    meta: { invalid },
  } = useController({
    name,
    control,
    defaultValue: props.schema.value || "",
  });
  const className = classNames([
    "form-group",
    { "has-error": invalid },
  ]);
  const [count, setCount] = useState(0);

  return (
    <div className={className}>
      {props.showLabel && (
        <label className="control-label" htmlFor={id}>
          {props.label} {props.schema.language ? `(${props.schema.lang})` : ""} {props.required ? "*" : ""}
        </label>
      )}

      <input
        {...inputProps}
        type={props.type}
        id={id}
        required={props.required}
        className="form-control"
        placeholder={props.placeholder}
        maxLength={props.maxLength}
        minLength={props.minLength}
        disabled={props.schema.disabled}
        onKeyUp={(val) => {
          setCount(val.target.value.length);
        }}
        ref={ref}
      />
      {invalid && (
        <span className="help-block">{formState.errors[name].message}</span>
      )}
      {props.maxLength && (
        <Info description={count + "/" + props.maxLength + " chars used"} />
      )}
      {props.schema.description && (
        <Info
          title={props.schema.label ? props.schema.label : name}
          description={props.schema.description}
        />
      )}
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
