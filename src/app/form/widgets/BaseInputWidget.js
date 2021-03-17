import React, { useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Info from "../../components/Info";
import { useController, useFormContext } from "react-hook-form";

const BaseInputWidget = (props) => {
  const name = props.fieldName;
  const { control, formState } = useFormContext();
  const {
    field: { ref, ...inputProps },
    meta: { invalid, isTouched, isDirty },
  } = useController({
    name,
    control,
    // rules: { required: props.required },
    defaultValue: props.schema.value || "",
  });
  // console.log(props, inputProps, errors);
  const className = classNames([
    "form-group",
    { "has-error": invalid },
  ]);
  const [count, setCount] = useState(0);

  return (
    <div className={className}>
      {props.showLabel && (
        <label className="control-label" htmlFor={props.id}>
          {props.label} {props.required ? "*" : ""}
        </label>
      )}

      <input
        {...inputProps}
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
