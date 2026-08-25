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

  it("drops `supports` when the declared version is older than 0.7.0", () => {
    const pc = {
      ...publicCodeDummyObjectFactory(),
      publiccodeYmlVersion: "0.5.0",
      supports: [{ id: "alias:gdpr" }],
      organisation: { uri: "https://example.org" },
      fundedBy: [{ name: "ACME" }],
    };

    const linted = linter(pc as never);

    expect(linted.supports).toBeUndefined();
    // organisation and fundedBy exist since 0.5.0, so they must survive
    expect(linted.organisation).toEqual({ uri: "https://example.org" });
    expect(linted.fundedBy).toEqual([{ name: "ACME", uri: undefined }]);
  });

  it("drops `organisation` and `fundedBy` when the declared version is older than 0.5.0", () => {
    const pc = {
      ...publicCodeDummyObjectFactory(),
      publiccodeYmlVersion: "0.4.0",
      supports: [{ id: "alias:gdpr" }],
      organisation: { uri: "https://example.org" },
      fundedBy: [{ name: "ACME" }],
    };

    const linted = linter(pc as never);

    expect(linted.supports).toBeUndefined();
    expect(linted.organisation).toBeUndefined();
    expect(linted.fundedBy).toBeUndefined();
  });

  it("keeps version-gated fields at the exact minimum version", () => {
    const pc = {
      ...publicCodeDummyObjectFactory(),
      publiccodeYmlVersion: "0.7.0",
      supports: [{ id: "alias:gdpr" }],
    };

    expect(linter(pc as never).supports).toEqual([{ id: "alias:gdpr" }]);
  });
});
