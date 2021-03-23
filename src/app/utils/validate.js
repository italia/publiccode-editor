import { transformLocalized, dirtyValues } from "./transform";
import { postDataForValidation } from "./calls";

export const validate = (
  data,
  dirtyFields,
  languages,
  handleValidationErrors,
  handleYamlChange
) => {
  console.log("formState", dirtyFields);
  const dataTouched = dirtyValues(dirtyFields, data);
  console.log("dataTouched", dataTouched);

  const dataTransformed = transformLocalized(dataTouched);
  console.log("dataTransformed", dataTransformed);

  // TODO improve
  // hack to get all description subfield validated
  if (!dataTransformed.description) dataTransformed.description = {};
  languages.map((x) => {
    if (!dataTransformed.description[x]) {
      dataTransformed.description[x] = {};
    }
  });
  handleYamlChange(dataTransformed);

  postDataForValidation(dataTransformed).onmessage = (e) => {
    if (e && e.data && e.data.validator) {
      const validator = JSON.parse(e.data.validator);
      handleValidationErrors(validator);
    } else {
      throw new Error("error triggering internal WASM validator");
    }
  };
};
