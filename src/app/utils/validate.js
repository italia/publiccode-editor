import { transformLocalized } from "./transform";
import { postDataForValidation } from "./calls";

const getOnlyTouched = (data, dirtyFields) => {
  const out = {};
  const touched = Object.keys(data).filter((x) =>
    dirtyFields.hasOwnProperty(x) ? x : null
  );
  touched.map((x) => {
    out[x] = data[x];
  });
  return out;
};

export const validate = (
  data,
  dirtyFields,
  languages,
  handleValidationErrors,
) => {
  console.log("validating", data);
  console.log("formState", dirtyFields);
  const dataTouched = getOnlyTouched(data, dirtyFields);
  const dataTransformed = transformLocalized(dataTouched);

  // TODO improve
  // hack to get all description subfield validated
  if (!dataTransformed.description) dataTransformed.description = {};
  languages.map((x) => {
    if (!dataTransformed.description[x]) {
      dataTransformed.description[x] = {};
    }
  });

  postDataForValidation(dataTransformed).onmessage = (e) => {
    if (e && e.data && e.data.validator) {
      const validator = JSON.parse(e.data.validator);
      handleValidationErrors(validator);
    } else {
      throw new Error("error triggering internal WASM validator");
    }
  };
};
