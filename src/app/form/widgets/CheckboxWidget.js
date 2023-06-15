import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Info from "../../components/Info";
import { useController, useFormContext } from "react-hook-form";
import { get } from "lodash";

const CheckboxWidget = (props) => {
  const name = props.fieldName;
  const id = `field-${name}`;
  const { control, formState } = useFormContext();
  const {
    field,
    fieldState: { invalid },
  } = useController({
    name,
    control,
    defaultValue: props.schema.value || false,
  });
  const className = classNames(["form-group", { "has-error": invalid }]);

  return (
    <div className={className}>
      <div className="form-check">
        <input
          checked={field.value}
          className="form-check-input"
          type="checkbox"
          required={props.required}
          id={id}
          {...field}
          onChange={(e) => field.onChange(e.target.checked)}
        />
        <label className="form-check-label" htmlFor={id}>
          {props.label} {props.required ? "*" : ""}
        </label>
      </div>
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

CheckboxWidget.propTypes = {
  schema: PropTypes.object.isRequired,
  fieldName: PropTypes.string,
  label: PropTypes.string,
  theme: PropTypes.object,
};

export default CheckboxWidget;
