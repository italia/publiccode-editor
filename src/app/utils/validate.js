import { dirtyValues, transformSimpleStringArrays } from "./transform";
import { postDataForValidation } from "./calls";

export const validate = (
  data,
  allFields,
  dirtyFields,
  languages,
  handleValidationErrors,
  handleYamlChange
) => {
  // console.log("originalData", data);
  // console.log("dirtyFields", dirtyFields);
  const dataTouched = dirtyValues(dirtyFields, data);
  // console.log("dataTouched", dataTouched);

  const dataSimpleStringArrays = transformSimpleStringArrays(
    dataTouched,
    allFields
  );
  // console.log("dataSimpleStringArrays", dataSimpleStringArrays);

  // TODO improve
  // hack to get all description subfield validated
  if (!dataSimpleStringArrays.description)
    dataSimpleStringArrays.description = {};
  languages.map((x) => {
    if (!dataSimpleStringArrays.description[x]) {
      dataSimpleStringArrays.description[x] = {};
    }
  });
  handleYamlChange(dataSimpleStringArrays);

  postDataForValidation(dataSimpleStringArrays).onmessage = (e) => {
    if (e && e.data && e.data.validator) {
      const validator = JSON.parse(e.data.validator);
      handleValidationErrors(validator);
    } else {
      throw new Error("error triggering internal WASM validator");
    }
  };
};
