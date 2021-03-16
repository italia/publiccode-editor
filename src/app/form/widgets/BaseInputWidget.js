import React, { useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Info from "../../components/Info";
import { useController, useFormContext } from "react-hook-form";

const BaseInputWidget = (props) => {
  const name = props.fieldName;
  const { control, errors } = useFormContext();
  const {
    field: { ref, ...inputProps },
    meta: { invalid, isTouched, isDirty },
  } = useController({
    name,
    control,
    rules: { required: props.required },
    defaultValue: props.schema.value || "",
  });
  console.log(inputProps, errors);
  const className = classNames([
    "form-group",
    { "has-error": isTouched && invalid },
  ]);
  let [count, setCount] = useState(0);

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
          setCount((count = val.target.value.length));
        }}
        ref={ref}
      />
      {isTouched && invalid && (
        <span className="help-block">{errors[name].message}</span>
      )}
      {props.maxLength && (
        <Info description={count + "/" + props.maxLength + " chars used"} />
      )}
      {props.description && (
        <Info
          title={props.label ? props.label : props.name}
          description={props.description}
        />
      )}
    </div>
  );
};
// const BaseInputWidget = (props) => {
//   return <Input name={props.fieldName} {...props} />;
// };
// const BaseInputWidget = (props) => {
//   const { control } = useForm();
//   return (
//     <Controller
//       name={props.fieldName}
//       control={control}
//       defaultValue={false}
//       rules={{ required: true }}
//       render={renderField} // props contains: onChange, onBlur and value
//     />
//   );
// };

// const BaseInputWidget = props => {
//   return (
//     <DebounceField
//       component={renderInput}
//       label={props.label}
//       name={props.fieldName}
//       required={props.required}
//       id={"field-" + props.fieldName}
//       placeholder={props.schema.default}
//       description={props.schema.description}
//       type={props.type}
//       normalize={props.normalizer}
//       {...props}
//     />
//   );
// };

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
