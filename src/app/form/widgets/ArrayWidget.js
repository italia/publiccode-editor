import React from "react";
import PropTypes from "prop-types";
import renderField from "../renderField";
import ChoiceWidget from "./ChoiceWidget";
import classNames from "classnames";
import Info from "../../components/Info";
import CloseButton from "../../components/CloseButton";
import { useFieldArray, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { get } from "lodash";

const renderArrayFields = (
  fields,
  schema,
  theme,
  fieldName,
  remove,
  context,
  swap,
  t
) => {
  const prefix = fieldName;
  let isSummary = false;
  return (
    <div>
      {fields.map((field, index) => (
        <div key={field.id}>
          {/* {console.log(field, fieldName)} */}
          <div className="float-right">
            <CloseButton
              onClick={(e) => {
                e.preventDefault();
                remove(index);
              }}
            />
          </div>
          {(isSummary = index !== fields.length - 1 ? true : false)}
          {renderField(
            {
              ...schema,
              isSummary,
              showLabel: false,
            },
            // simple string array are not yet supported
            // https://spectrum.chat/react-hook-form/help/usefieldarray-with-array-of-simple-strings-not-objects~99bb71d1-35c4-48cd-a76b-4f895994b794
            schema.type && schema.type === "object"
              ? `[${index}]`
              : `.${index}`,
            theme,
            prefix,
            context, //{ ...context, field },
            null,
            field,
            t
          )}
        </div>
      ))}
    </div>
  );
};

const CollectionWidget = (props) => {
  const name = props.fieldName;
  const { control, formState } = useFormContext();
  const { fields, append, remove, swap } = useFieldArray({
    control,
    name,
  });
  const error = get(formState.errors, name);
  const invalid = error && error.message;

  const { t } = useTranslation();
  const className = classNames(["block__array", { "has-error": invalid }]);
  return (
    <div className={className}>
      {props.showLabel && (
        <label className="control-label">
          {props.label} {props.schema.language ? `(${props.schema.lang})` : ""}{" "}
          {props.required ? "*" : ""}
        </label>
      )}
      {invalid && <span className="help-block">{error && error.message}</span>}
      {renderArrayFields(
        fields,
        props.schema.items,
        props.theme,
        props.fieldName,
        (idx) => remove(idx),
        props.context,
        (a, b) => {
          swap(a, b);
        },
        t
      )}
      <div>
        <a href="#" className="link" onClick={() => append({})}>
          {t("editor.form.addnew")}
        </a>
      </div>
      {props.schema.description && (
        <Info
          inputTitle={props.schema.rawTitle || props.fieldName || props.schema.title}
          title={props.label ? props.label : props.name}
          description={props.schema.description}
        />
      )}
    </div>
  );
};

const ArrayWidget = (props) => {
  // Arrays are tricky because they can be multiselects or collections
  if (
    props.schema.items.hasOwnProperty("enum") &&
    props.schema.hasOwnProperty("uniqueItems") &&
    props.schema.uniqueItems
  ) {
    return ChoiceWidget({
      ...props,
      schema: props.schema.items,
      multiple: true,
    });
  } else {
    return CollectionWidget(props);
  }
};

ArrayWidget.propTypes = {
  schema: PropTypes.object.isRequired,
  fieldName: PropTypes.string,
  label: PropTypes.string,
  theme: PropTypes.object,
  context: PropTypes.object,
  defaultValue: PropTypes.object,
};

export default ArrayWidget;
