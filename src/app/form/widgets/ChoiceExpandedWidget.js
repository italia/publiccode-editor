import React from "react";
import classNames from "classnames";
import Info from "../../components/Info";
import { useController, useFormContext } from "react-hook-form";
import { get } from "lodash";

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
    meta: { invalid },
  } = useController({
    name,
    control,
    // rules: { required: props.required },
    defaultValue: props.schema.value || "",
  });
  const className = classNames(["form-group", { "has-error": invalid }]);
  const options = props.schema.enum;
  const optionNames = props.schema.enum_titles || options;

  const selectOptions = zipObject(options, optionNames);
  return (
    <div className={className}>
      <label className="control-label" htmlFor={"field-" + name}>
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
            onChange={(e) => inputProps.onChange(e)}
            ref={ref}
          />
          <label className="form-check-label" htmlFor={`${name}-${value}`}>
            {name}
          </label>
        </div>
      ))}

      {invalid && (
        <span className="help-block">
          {get(formState.errors, name) && get(formState.errors, name).message}
        </span>
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

export default ChoiceExpandedWidget;
