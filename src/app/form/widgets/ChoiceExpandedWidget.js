import classNames from "classnames";
import Info from "../../components/Info";
import { useController, useFormContext } from "react-hook-form";
import { get } from "lodash";
import { FormGroup, Input, Label } from "design-react-kit";

const zipObject = (props, values) =>
  props.reduce(
    (prev, prop, i) => Object.assign(prev, { [prop]: values[i] }),
    {}
  );

const ChoiceExpandedWidget = (props) => {
  const name = props.fieldName;
  const id = `field-${name}`;
  const { control, formState } = useFormContext();
  const {
    field: { ref, ...inputProps },
    fieldState: { invalid },
  } = useController({
    name,
    control,
    // rules: { required: props.required },
    defaultValue: props.schema.value || "",
  });
  const className = classNames(["form-group", { "has-error": invalid }]);
  const options = props.schema.enum;
  const optionNames = props.schema.enum_titles || options;

  const selectOptions = zipObject(options, optionNames);
  return (
    <div className={className}>
      <fieldset>
        <legend className="control-label" htmlFor={id}>
          {props.label} {props.required ? "*" : ""}
        </legend>
        {Object.entries(selectOptions).map(([value, name]) => (
          <FormGroup check key={value}>
            <Input
              {...inputProps}
              id={`${name}-${value}`}
              className="form-check-input"
              type="radio"
              name={name}
              value={value}
              checked={inputProps.value === value}
              disabled={props.schema.disabled}
              onChange={(e) => inputProps.onChange(e)}
              innerRef={ref}
            />
            <Label check htmlFor={`${name}-${value}`}>
              {name}
            </Label>
          </FormGroup>
        ))}
      </fieldset>

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

export default ChoiceExpandedWidget;
