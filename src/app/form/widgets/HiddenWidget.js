import React from "react";
import { useController, useFormContext } from "react-hook-form";
import PropTypes from "prop-types";

const HiddenWidget = (props) => {
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

  return (
    <input
      {...inputProps}
      ref={ref}
      id={id}
      type={"hidden"}
      required={props.required}
      disabled={props.schema.disabled}
    />
  );
};

HiddenWidget.propTypes = {
  schema: PropTypes.object.isRequired,
  required: PropTypes.bool,
  fieldName: PropTypes.string,
  label: PropTypes.string,
  normalizer: PropTypes.func,
  description: PropTypes.string,
};

export default HiddenWidget;
