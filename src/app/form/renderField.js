import { createElement } from "react";
import deepmerge from "deepmerge";

const guessWidget = (schema, theme) => {
  if (schema.widget) {
    return schema.widget;
  } else if (Object.prototype.hasOwnProperty.call(schema, "enum")) {
    return "choice";
  } else if (Object.prototype.hasOwnProperty.call(schema, "oneOf")) {
    return "oneOf";
  } else if (theme[schema.format]) {
    return schema.format;
  }
  return schema.type || "object";
};

export const isRequired = (schema, fieldName) => {
  if (!schema.required) {
    return false;
  }
  return schema.required === true || schema.required.indexOf(fieldName) !== -1;
};

const renderField = (
  schema,
  fieldName,
  theme,
  prefix = "",
  context = {},
  required = false,
  defaultValue = null,
  t
) => {
  if (Object.prototype.hasOwnProperty.call(schema, "allOf")) {
    schema = { ...schema, ...deepmerge.all(schema.allOf) };
    delete schema.allOf;
  }

  const widget = guessWidget(schema, theme);
  if (!theme[widget]) {
    throw new Error(widget + " is not defined in the theme");
  }

  const newFieldName = prefix ? prefix + fieldName : fieldName;

  let showLabel = schema.showLabel == false ? false : true;
  // label are same for every element of arrays
  const translationReadyLabel = t(
    `pc:${schema.rawTitle || newFieldName.replace(/\[[0-9]+\]/,'') || schema.title}.label`
  );

  const lbl = translationReadyLabel || schema.title || fieldName;
  return createElement(theme[widget], {
    key: fieldName,
    fieldName: widget === "oneOf" ? fieldName : newFieldName,
    label: lbl,
    required: required,
    schema: schema,
    maxLength: schema.maxLength,
    minLength: schema.minLength,
    theme,
    context,
    prefix,
    id: schema.id,
    group: schema.group,
    showLabel,
    defaultValue,
  });
};

export default renderField;
