import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Info from "../../components/Info";
import { useController, useFormContext } from "react-hook-form";
import { get } from "lodash";

const MoneyWidget = (props) => {
  const name = props.fieldName;
  const id = `field-${name}`;
  const { control, formState, register } = useFormContext();
  const {
    field: { ref, ...inputProps },
    meta: { invalid },
  } = useController({
    name,
    control,
    defaultValue: props.schema.value || "",
  });
  const className = classNames(["form-group", { "has-error": invalid }]);
  return (
    <div className={className}>
      <label className="control-label" htmlFor={id}>
        {props.label}
      </label>
      <div className="input-group">
        <span className="input-group-addon">€ </span>
        <input
          {...inputProps}
          ref={ref}
          id={id}
          type="number"
          className="form-control"
          required={props.required}
          placeholder={props.placeholder}
        />
      </div>
      {invalid && (
        <span className="help-block">
          {get(formState.errors, name) && get(formState.errors, name).message}
        </span>
      )}
      {props.schema.description && (
        <Info
          inputTitle={
            props.schema.rawTitle || props.fieldName || props.schema.title
          }
          title={props.schema.label ? props.schema.label : name}
          description={props.schema.description}
        />
      )}
    </div>
  );
};

MoneyWidget.propTypes = {
  schema: PropTypes.object.isRequired,
  fieldName: PropTypes.string,
  label: PropTypes.string,
  theme: PropTypes.object,
  multiple: PropTypes.bool,
  required: PropTypes.bool,
};

export default MoneyWidget;
