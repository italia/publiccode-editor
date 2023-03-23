import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { DateTimePicker } from "react-widgets";
import Globalize from "globalize";
import globalizeLocalizer from "react-widgets-globalize";
import Info from "../../components/Info";
import { useController, useFormContext } from "react-hook-form";
import { get } from "lodash";
import { DEFAULT_LANGUAGE } from "../../contents/constants";

Globalize.load(
  require("cldr-data/main/it/numbers"),
  require("cldr-data/main/en/numbers"),
  require("cldr-data/main/it/ca-gregorian"),
  require("cldr-data/main/en/ca-gregorian"),
  require("cldr-data/supplemental/likelySubtags"),
  require("cldr-data/supplemental/timeData"),
  require("cldr-data/supplemental/weekData"),
  require("cldr-data/supplemental/calendarData")
);

Globalize.locale(DEFAULT_LANGUAGE);

globalizeLocalizer();

const format = "yyyy-MM-dd";
const add0 = (t) => (t < 10 ? `0${t}` : String(t));

export const getDateStandard = (dt = new Date()) => {
  const y = dt.getFullYear();
  const m = add0(dt.getMonth() + 1);
  const d = add0(dt.getDate()); //day of month
  return `${y}-${m}-${d}`;
};

const DateTimeReactWidget = (props) => {
  const name = props.fieldName;
  const id = "field-" + name;
  const { control, formState } = useFormContext();
  const {
    field: { ref, ...inputProps },
    meta: { invalid, isTouched, isDirty },
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

      <DateTimePicker
        {...inputProps}
        ref={ref}
        id={id}
        className="border-0"
        time={false}
        format={{ raw: format }}
        required={props.required}
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

DateTimeReactWidget.propTypes = {
  schema: PropTypes.object.isRequired,
  fieldName: PropTypes.string,
  label: PropTypes.string,
  theme: PropTypes.object,
  multiple: PropTypes.bool,
  required: PropTypes.bool,
};

export default DateTimeReactWidget;
