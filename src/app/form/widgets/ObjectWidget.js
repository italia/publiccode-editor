import React from "react";
import PropTypes from "prop-types";
import renderFields from "../renderFields";
import { useTranslation } from "react-i18next";

const ObjectWidget = (props) => {
  const {t} = useTranslation();
  let isSummary = false;
  if (props && props.schema && props.schema.isSummary) {
    isSummary = props.schema.isSummary;
  }
  return (
    <div className="block" style={{ marginBottom: "10px" }}>
      {props.showLabel && props.label && (
        <legend className="control-label">
          {props.label} {props.schema.required ? "*" : ""}
        </legend>
      )}

      {renderFields(
        { ...props.schema, isSummary },
        props.theme,
        props.fieldName && props.fieldName + ".",
        props.context,
        props.defaultValue,
        t,
      )}
    </div>
  );
};

ObjectWidget.propTypes = {
  schema: PropTypes.object.isRequired,
  fieldName: PropTypes.string,
  label: PropTypes.string,
  theme: PropTypes.object,
  context: PropTypes.object,
};

export default ObjectWidget;
