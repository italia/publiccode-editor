import React from "react";
import PropTypes from "prop-types";
import renderField from "../renderField";
import { times as _times } from "lodash";
import ChoiceWidget from "./ChoiceWidget";
import classNames from "classnames";
import Info from "../../components/Info";
import CloseButton from "../../components/CloseButton";
import { useFieldArray, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

const renderArrayFields = (
  count,
  schema,
  theme,
  fieldName,
  remove,
  context,
  swap
) => {
  const prefix = fieldName + ".";

  if (count) {
    return _times(count, (idx) => {
      let isSummary = false;
      if (idx != count - 1) {
        isSummary = true;
      }
      schema.isSummary = isSummary;
      return (
        <div key={idx}>
          <div className="float-right">
            <CloseButton
              onClick={(e) => {
                e.preventDefault();
                remove(idx);
              }}
            />
          </div>
          {renderField(
            { ...schema, showLabel: false },
            idx.toString(),
            theme,
            prefix,
            context
          )}
        </div>
      );
    });
  } else {
    return null;
  }
};

const CollectionWidget = (props) => {
  const name = props.fieldName;
  const { control, formState } = useFormContext();
  const { fields, append, remove, swap } = useFieldArray({
    control,
    name,
  });
  const invalid = formState.errors[name];

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
      {invalid && (
        <div className="help-block">{formState.errors[name].message}</div>
      )}
      {renderArrayFields(
        fields.length,
        props.schema.items,
        props.theme,
        props.fieldName,
        (idx) => remove(idx),
        props.context,
        (a, b) => {
          swap(a, b);
        }
      )}
      <div>
        <a href="#" className="link" onClick={() => append({})}>
          {t("editor.form.addnew")}
        </a>
      </div>
      {props.schema.description && (
        <Info
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
};

export default ArrayWidget;
