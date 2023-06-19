import { dirtyValues, transformSimpleStringArrays } from "./transform";
import { validator } from "../validator";

export const validate = (
  data,
  allFields,
  dirtyFields,
  languages,
  handleValidationErrors,
  handleYamlChange,
  defaultBranch
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

  validator(dataSimpleStringArrays, defaultBranch)
    .then((res) => {
      handleValidationErrors(res);
    })
    .catch((e) => {
      handleValidationErrors(e);
    });
};
