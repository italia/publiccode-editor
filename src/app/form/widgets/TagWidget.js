import PropTypes from "prop-types";
import classNames from "classnames";
import { Multiselect } from "react-widgets";
import Info from "../../components/Info";
import { useController, useFormContext } from "react-hook-form";
import { get } from "lodash";

const TagWidget = (props) => {
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

  return (
    <div className={className}>
      <label className="control-label active text-muted" htmlFor={id}>
        {props.label} {props.required ? "*" : ""}
      </label>

      <Multiselect
        {...inputProps}
        ref={ref}
        id={id}
        onBlur={() => inputProps.onBlur()}
        value={inputProps.value || []}
        data={props.schema.items.enum}
        filter="contains"
      />

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

TagWidget.propTypes = {
  schema: PropTypes.object.isRequired,
  fieldName: PropTypes.string,
  label: PropTypes.string,
  theme: PropTypes.object,
  multiple: PropTypes.bool,
  required: PropTypes.bool,
};

export default TagWidget;
