import publicCodeAdapter from "./publiccode-adapter";
import {
  defaultDependency,
  publicCodeDummyObjectFactory,
} from "./contents/publiccode";
import { getYaml, parseYaml } from "./lib/utils";

describe("dependsOn YAML round-trip", () => {
  it("preserves all dependency categories and fields from imported YAML", () => {
    const imported = parseYaml(`
dependsOn:
  open:
    - name: PostgreSQL
      versionMin: "14"
      versionMax: "16"
      optional: false
  proprietary:
    - name: Oracle
      version: "19"
  hardware:
    - name: NFC Reader
      optional: true
`);
    const adapted = publicCodeAdapter({
      defaultValues: publicCodeDummyObjectFactory(),
      publicCode: imported,
    });

    const roundTripped = parseYaml(getYaml(adapted) ?? "");

    expect(roundTripped?.dependsOn).toEqual({
      open: [
        {
          name: "PostgreSQL",
          versionMin: "14",
          versionMax: "16",
          optional: false,
        },
      ],
      proprietary: [{ name: "Oracle", version: "19" }],
      hardware: [{ name: "NFC Reader", optional: true }],
    });
  });

  it("omits empty dependency rows and the empty dependsOn section", () => {
    const publicCode = publicCodeDummyObjectFactory();
    publicCode.dependsOn = {
      open: [{ ...defaultDependency }],
      proprietary: [],
    };

    const yaml = getYaml(publicCode) ?? "";

    expect(yaml).not.toContain("dependsOn:");
    expect(parseYaml(yaml)?.dependsOn).toBeUndefined();
  });
});
