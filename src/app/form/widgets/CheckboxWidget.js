import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Field, change } from "redux-form";
import Info from "../../components/Info";
import { useDispatch } from 'react-redux';
import { APP_FORM } from "../../contents/constants";

const renderInput = field => {
  const className = classNames([
    "form-group",
    { "has-error": field.meta.touched && field.meta.error }
  ]);

  const dispatch = useDispatch()
  if (field.required && field.input.value != true) {
    dispatch(change(APP_FORM, field.input.name, 'false'));
  }

  return (
    <div className={className}>
      <div className="form-check">
        <input
          {...field.input}
          checked={field.input.value == true || field.input.value == "yes"}
          className="form-check-input"
          type="checkbox"
          required={field.required}
          id={`field-${field.input.name}`}
        />
        <label
          className="form-check-label"
          htmlFor={`field-${field.input.name}`}
        >
          {field.label} {field.required ? "*" : ""}
        </label>
      </div>
      {field.meta.touched &&
        field.meta.error && (
          <span className="help-block">{field.meta.error}</span>
        )}

      {field.description && (
        <Info
          title={field.label ? field.label : field.name}
          description={field.description}
        />
      )}
    </div>
  );
};

const CheckboxWidget = props => {
  return (
    <Field
      component={renderInput}
      label={props.label}
      name={props.fieldName}
      required={props.required}
      id={"field-" + props.fieldName}
      placeholder={props.schema.default}
      description={props.schema.description}
    />
  );
};

CheckboxWidget.propTypes = {
  schema: PropTypes.object.isRequired,
  fieldName: PropTypes.string,
  label: PropTypes.string,
  theme: PropTypes.object
};

export default CheckboxWidget;
