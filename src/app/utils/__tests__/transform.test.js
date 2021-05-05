import {
  allFields,
  simpleYaml,
  simpleFormYaml,
  yamlFlattened,
  yamlFlattenedSimpleArray,
} from "../../../__mocks__/fields";
import {
  convertSimpleStringArray,
  toFlatPropertyMap,
  transformSimpleStringArrays,
} from "../transform";

describe("data transformation", () => {
  const flattened = toFlatPropertyMap(simpleYaml);
  const simplified = convertSimpleStringArray(flattened, allFields);
  it("yaml flattened", () => {
    expect(flattened).toEqual(yamlFlattened);
  });
  it("yaml flattened and simplified", () => {
    expect(simplified).toEqual(yamlFlattenedSimpleArray);
  });
  it("yaml transform back", () => {
    expect(transformSimpleStringArrays(simpleFormYaml, allFields)).toEqual(
      simpleYaml
    );
  });
});
