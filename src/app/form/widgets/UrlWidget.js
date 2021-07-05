import React from "react";
import BaseInputWidget from "./BaseInputWidget";

const UrlWidget = props => {
  return <BaseInputWidget type="url" placeholder="https://" {...props} />;
};

export default UrlWidget;
