import classNames from "classnames";
import { DatePicker } from "react-widgets";
import Info from "../../components/Info";
import { useController, useFormContext } from "react-hook-form";
import { get } from "lodash";

const add0 = (t: number) => (t < 10 ? `0${t}` : String(t));

export const getDateStandard = (date: Date | null | undefined) => {
  const dt = date || new Date();
  const y = dt.getFullYear();
  const m = add0(dt.getMonth() + 1);
  const d = add0(dt.getDate()); //day of month
  return `${y}-${m}-${d}`;
};

interface Props {
  fieldName: string;
  label: string;
  placeholder: string;
  required?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: any;
}

const DateTimeReactWidget = (props: Props): JSX.Element => {
  const name = props.fieldName;
  const id = "field-" + name;
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

      <DatePicker
        {...inputProps}
        ref={ref}
        id={id}
        className="border-0"
        placeholder={props.placeholder}
        disabled={props.schema.disabled}
        value={inputProps.value ? new Date(inputProps.value) : undefined}
        onChange={(e) => inputProps.onChange(getDateStandard(e))}
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

export default DateTimeReactWidget;
