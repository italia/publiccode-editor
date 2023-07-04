import classNames from "classnames";
import Info from "../../components/Info";
import { useController, useFormContext } from "react-hook-form";
import { get } from "lodash";

const zipObject = (props, values) =>
  props.reduce(
    (prev, prop, i) => Object.assign(prev, { [prop]: values[i] }),
    {}
  );

const changeValue = (checked, item, onChange, currentValue = []) => {
  console.log("CURRENT ITEM", item, "CURRENT VALUE", currentValue);
  if (checked) {
    if (currentValue.indexOf(checked) === -1) {
      return onChange([...currentValue, item]);
    }
  } else {
    return onChange(currentValue.filter((it) => it != item));
  }
  return onChange(currentValue);
};

const ChoiceMultipleExpandedWidget = (props) => {
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
  const options = props.schema.items.enum;
  const optionNames = props.schema.items.enum_titles || options;

  const selectOptions = zipObject(options, optionNames);
  return (
    <div className={className}>
      <label className="control-label" htmlFor={id}>
        {props.label} {props.required ? "*" : ""}
      </label>
      {Object.entries(selectOptions).map(([value, name]) => {
        return (
          <div className="form-check" key={value}>
            <input
              {...inputProps}
              id={`${name}-${value}`}
              ref={ref}
              type="checkbox"
              className="form-check-input"
              value={value}
              checked={inputProps.value.indexOf(value) !== -1}
              onChange={(e) =>
                changeValue(
                  e.target.checked,
                  value,
                  inputProps.onChange,
                  inputProps.value
                )
              }
            />
            <label className="form-check-label" htmlFor={`${name}-${value}`}>
              {name}
            </label>
          </div>
        );
      })}

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

export default ChoiceMultipleExpandedWidget;
