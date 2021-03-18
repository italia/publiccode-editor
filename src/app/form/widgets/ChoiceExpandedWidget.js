import React, { useState, useEffect } from "react";
import classNames from "classnames";
import Info from "../../components/Info";
import { useController, useFormContext } from "react-hook-form";

const zipObject = (props, values) =>
  props.reduce(
    (prev, prop, i) => Object.assign(prev, { [prop]: values[i] }),
    {}
  );

const ChoiceExpandedWidget = (props) => {
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
  const className = classNames(["form-group", { "has-error": invalid }]);
  const options = props.schema.enum;
  const optionNames = props.schema.enum_titles || options;

  useEffect(() => {
    if (props.schema.value)
      if (props.input)
        if (!props.input.value) props.input.onChange(props.schema.value);
  });

  const selectOptions = zipObject(options, optionNames);
  return (
    <div className={className}>
      <label className="control-label" htmlFor={"field-" + props.name}>
        {props.label} {props.required ? "*" : ""}
      </label>
      {Object.entries(selectOptions).map(([value, name]) => (
        <div className="form-check" key={value}>
          <input
            {...inputProps}
            id={`${name}-${value}`}
            className="form-check-input"
            type="radio"
            name={name}
            value={value}
            checked={inputProps.value === value}
            disabled={props.schema.disabled}
            onChange={(e) => inputProps.onChange(value)}
            ref={ref}
          />
          <label
            className="form-check-label"
            htmlFor={`${name}-${value}`}
          >
            {name}
          </label>
        </div>
      ))}

      {invalid && (
        <span className="help-block">{formState.errors[name].message}</span>
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

// const ChoiceExpandedWidget = props => {
//   return (
//     <Field
//       component={renderChoice}
//       label={props.label}
//       name={props.fieldName}
//       required={props.required}
//       id={"field-" + props.fieldName}
//       placeholder={props.schema.default}
//       description={props.schema.description}
//       schema={props.schema}
//       multiple={props.multiple}
//     />
//   );
// };

export default ChoiceExpandedWidget;
