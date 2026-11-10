import { formSchemaFor, hasField, isDeprecated } from "./formSchema";

describe("form schema", () => {
  it("knows which keys exist in each version", () => {
    expect(hasField("0.7.0", "supports")).toBe(true);
    expect(hasField("0.5.0", "supports")).toBe(false);
    expect(hasField("0.5", "organisation")).toBe(true);
    expect(hasField("0.4.0", "fundedBy")).toBe(false);
    // "0" and no version mean the latest.
    expect(hasField("0", "supports")).toBe(true);
    expect(hasField(undefined, "supports")).toBe(true);
  });

  it("knows what's deprecated in each version", () => {
    expect(isDeprecated("0.7.0", "monochromeLogo")).toBe(true);
    expect(isDeprecated("0.2.0", "description.*.genericName")).toBe(false);
    expect(isDeprecated("0.3.0", "description.*.genericName")).toBe(true);
    // The editor's lowercase country section is IT in the schema.
    expect(isDeprecated("0.7.0", "it.piattaforme.spid")).toBe(true);
    expect(isDeprecated("0.5.0", "it.piattaforme.spid")).toBe(false);
    expect(isDeprecated("0.5.0", "it.riuso.codiceIPA")).toBe(true);
  });

  it("uses the closest older schema for versions without one", () => {
    expect(formSchemaFor("0.2.1").version).toBe("0.2.0");
    expect(formSchemaFor("0.6.0").version).toBe("0.5.0");
  });
});
