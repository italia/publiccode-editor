import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { DateTimePicker } from "react-widgets";
import Globalize from "globalize";
import globalizeLocalizer from "react-widgets-globalize";

import Info from "../../components/Info";
import { useController, useFormContext } from "react-hook-form";
import moment from "moment";
import { get } from "lodash";

Globalize.load(
  require("cldr-data/main/en/numbers"),
  require("cldr-data/main/en/ca-gregorian"),
  require("cldr-data/supplemental/likelySubtags"),
  require("cldr-data/supplemental/timeData"),
  require("cldr-data/supplemental/weekData"),
  require("cldr-data/supplemental/calendarData")
);

Globalize.locale("en");

globalizeLocalizer();

const format = "yyyy-MM-dd";

const DateTimeReactWidget = (props) => {
  const name = props.fieldName;
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
      <label className="control-label" htmlFor={"field-" + name}>
        {props.label} {props.required ? "*" : ""}
      </label>

      <DateTimePicker
        {...inputProps}
        className="border-0"
        time={false}
        format={{ raw: format }}
        required={props.required}
        placeholder={props.placeholder}
        disabled={props.schema.disabled}
        value={inputProps.value ? new Date(inputProps.value) : undefined}
        onChange={(e) =>
          inputProps.onChange(moment(e).format(format.toUpperCase()))
        }
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

DateTimeReactWidget.propTypes = {
  schema: PropTypes.object.isRequired,
  fieldName: PropTypes.string,
  label: PropTypes.string,
  theme: PropTypes.object,
  multiple: PropTypes.bool,
  required: PropTypes.bool,
};

export default DateTimeReactWidget;
