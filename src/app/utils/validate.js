import ValidatorWorker from "worker-loader!../validator/validator_worker.js";
import { dirtyValues, transformSimpleStringArrays } from "./transform";

export const validate = (
  data,
  allFields,
  dirtyFields,
  languages,
  handleValidationErrors,
  handleYamlChange,
  defaultBranch
) => {
  const dataSimpleStringArrays = transformSimpleStringArrays(
    dirtyValues(dirtyFields, data),
    allFields
  );

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

  postDataForValidation(dataSimpleStringArrays, defaultBranch).onmessage = e => {
    if (e?.data?.validator) {
      const validator = JSON.parse(e.data.validator);
      handleValidationErrors(validator);
    } else {
      handleValidationErrors("error triggering internal WASM validator");
    }
  };
};

const postDataForValidation = (data, defaultBranch) => {
  const validator = new ValidatorWorker();
  const serializedData = JSON.stringify(data);
  validator.postMessage({data: serializedData, defaultBranch});

  return validator;
};
