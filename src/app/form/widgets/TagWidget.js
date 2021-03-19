import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Multiselect } from "react-widgets";
import Info from "../../components/Info";
import { useController, useFormContext } from "react-hook-form";

const TagWidget = (props) => {
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
  const className = classNames(["form-group", { "has-error": invalid }]);

  return (
    <div className={className}>
      <label className="control-label" htmlFor={id}>
        {props.label} {props.required ? "*" : ""}
      </label>

      <Multiselect
        {...inputProps}
        onBlur={() => inputProps.onBlur()}
        id={id}
        value={inputProps.value || []}
        data={props.schema.items.enum}
        ref={ref}
      />

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

TagWidget.propTypes = {
  schema: PropTypes.object.isRequired,
  fieldName: PropTypes.string,
  label: PropTypes.string,
  theme: PropTypes.object,
  multiple: PropTypes.bool,
  required: PropTypes.bool,
};

export default TagWidget;
