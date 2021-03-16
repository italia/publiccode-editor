import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Combobox } from "react-widgets";
import Info from "../../components/Info";

const ComboBoxWidget = (props) => {
  const className = classNames([
    "form-group",
    { "has-error": props.meta.touched && props.meta.error },
  ]);

  return (
    <div className={className}>
      <label className="control-label" htmlFor={"field-" + props.name}>
        {props.label} {props.required ? "*" : ""}
      </label>

      <Combobox
        {...props.input}
        onBlur={() => props.input.onBlur()}
        value={props.input.value || []}
        data={props.input.data}
        onChange={(v) => props.input.onChange(v.value)}
        valueField="value"
        textField="text"
        filter="contains"
      />

      {props.meta.touched && props.meta.error && (
        <span className="help-block">{props.meta.error}</span>
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

ComboBoxWidget.propTypes = {
  schema: PropTypes.object.isRequired,
  fieldName: PropTypes.string,
  label: PropTypes.string,
  theme: PropTypes.object,
  multiple: PropTypes.bool,
  required: PropTypes.bool,
};

export default ComboBoxWidget;
