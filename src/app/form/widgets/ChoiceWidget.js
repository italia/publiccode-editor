import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { zipObject as _zipObject, map as _map } from "lodash";
import Info from "../../components/Info";
import { useController, useFormContext } from "react-hook-form";
import { get } from "lodash";

const ChoiceWidget = (props) => {
  const name = props.fieldName;
  const id = `field-${name}`;
  const { control, formState } = useFormContext();
  const {
    field: { ref, ...inputProps },
    fieldState: { invalid },
  } = useController({
    name,
    control,
    defaultValue: props.schema.value || "",
  });
  const className = classNames(["form-group", { "has-error": invalid }]);
  const options = props.schema.enum;
  const optionNames = props.schema.enum_titles || options;

  const selectOptions = _zipObject(options, optionNames);
  return (
    <div className={className}>
      {props.showLabel && (
        <label className="control-label" htmlFor={id}>
          {props.label} {props.schema.required ? "*" : ""}
        </label>
      )}

      <select
        {...inputProps}
        ref={ref}
        className="form-control"
        id={id}
        required={props.required}
        multiple={props.multiple}
      >
        {!props.required && !props.multiple && (
          <option key={""} value={""}>
            {props.placeholder}
          </option>
        )}
        {_map(selectOptions, (name, value) => {
          return (
            <option key={value} value={value}>
              {name}
            </option>
          );
        })}
      </select>

      {invalid && (
        <span className="help-block">
          {get(formState.errors, name) && get(formState.errors, name).message}
        </span>
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

ChoiceWidget.propTypes = {
  schema: PropTypes.object.isRequired,
  fieldName: PropTypes.string,
  label: PropTypes.string,
  theme: PropTypes.object,
  multiple: PropTypes.bool,
  required: PropTypes.bool,
};

export default ChoiceWidget;
