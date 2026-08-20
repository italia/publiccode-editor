import publicCodeAdapter from "./publiccode-adapter";
import { publicCodeDummyObjectFactory } from "./contents/publiccode";
import linter from "./linter";
import { getYaml, parseYaml } from "./lib/utils";

describe("supports (publiccode.yml v0.7) round-trip", () => {
  it("preserves alias and URI entries from imported YAML", () => {
    const imported = parseYaml(`
supports:
  - id: alias:gdpr
  - id: https://standard.example.org/foo
  - id: "urn:example:bar"
`);

    const adapted = publicCodeAdapter({
      defaultValues: publicCodeDummyObjectFactory(),
      publicCode: imported,
    });

    const roundTripped = parseYaml(getYaml(adapted) ?? "");

    expect(roundTripped?.supports).toEqual([
      { id: "alias:gdpr" },
      { id: "https://standard.example.org/foo" },
      { id: "urn:example:bar" },
    ]);
  });

  it("normalizes items imported as plain strings into { id }", () => {
    const imported = {
      ...publicCodeDummyObjectFactory(),
      supports: ["alias:spid", "https://example.org"] as unknown,
    };

    const adapted = publicCodeAdapter({
      defaultValues: publicCodeDummyObjectFactory(),
      publicCode: imported as never,
    });

    expect(adapted.supports).toEqual([
      { id: "alias:spid" },
      { id: "https://example.org" },
    ]);
  });

  it("drops rows with an empty id and the whole key when all rows are empty", () => {
    const withEmptyRows = {
      ...publicCodeDummyObjectFactory(),
      supports: [{ id: "alias:cie" }, { id: "" }, { id: "   " }],
    };

    expect(linter(withEmptyRows).supports).toEqual([{ id: "alias:cie" }]);

    const allEmpty = {
      ...publicCodeDummyObjectFactory(),
      supports: [{ id: "" }],
    };

    expect(linter(allEmpty).supports).toBeUndefined();
  });
});
