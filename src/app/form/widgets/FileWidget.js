import React from "react";
import classNames from "classnames";
import Info from "../../components/Info";
import { useController, useFormContext } from "react-hook-form";
import { get } from "lodash";

const processFile = (onChange, e) => {
  const files = e.target.files;
  return new Promise(() => {
    let reader = new FileReader();
    reader.addEventListener(
      "load",
      () => {
        onChange(reader.result);
      },
      false
    );
    reader.readAsDataURL(files[0]);
  });
};

const FileWidget = (props) => {
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
      <input
        {...inputProps}
        ref={ref}
        id={id}
        name={name}
        onBlur={inputProps.onBlur}
        onChange={processFile.bind(this, inputProps.onChange)}
        className="form-control"
        type="file"
      />
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

export default FileWidget;
