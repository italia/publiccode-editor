import { validate } from ".";

// A minimal valid v0.7 publiccode.yml, as the editor's form produces it.
const minimal = () => ({
  publiccodeYmlVersion: "0.7.0",
  name: "Medusa",
  url: "https://github.com/italia/developers.italia.it.git",
  platforms: ["web"],
  developmentStatus: "development",
  softwareType: "standalone/other",
  description: {
    en: {
      shortDescription: "A short description",
      longDescription: "Very long description of this software. ".repeat(5),
      features: ["Feature 1"],
    },
  },
  legal: { license: "AGPL-3.0-or-later" },
  maintenance: {
    type: "community",
    contacts: [{ name: "Francesco Rossi" }],
  },
  localisation: { localisationReady: true, availableLanguages: ["en"] },
});

const keys = (r: ReturnType<typeof validate>, kind: "errors" | "warnings") =>
  r[kind].map((e) => e.key);

describe("Ajv validator", () => {
  it("accepts a minimal file", () => {
    const res = validate(minimal());
    expect(res.errors).toEqual([]);
    expect(res.warnings).toEqual([]);
    expect(res.version).toBe(0);
  });

  it("stops at an invalid publiccodeYmlVersion, like the parser", () => {
    expect(validate({ name: 1 }).errors).toEqual([
      expect.objectContaining({
        key: "publiccodeYmlVersion",
        description: "publiccodeYmlVersion is a required field",
      }),
    ]);
    expect(
      validate({ ...minimal(), publiccodeYmlVersion: 0.2 }).errors[0],
    ).toMatchObject({ description: "wrong type for this field" });
    expect(
      validate({ ...minimal(), publiccodeYmlVersion: "1" }).errors[0].description,
    ).toMatch(/^unsupported version: '1'/);
  });

  it("warns on versions other than 0 and 0.7", () => {
    const res = validate({ ...minimal(), publiccodeYmlVersion: "0.5" });
    expect(res.errors).toEqual([]);
    expect(keys(res, "warnings")).toEqual(["publiccodeYmlVersion"]);
  });

  it("uses the parser's key format", () => {
    const data = minimal();
    data.maintenance.contacts = [{ name: "" }];
    Object.assign(data.description, {
      "en-US": { ...data.description.en, shortDescription: "" },
    });

    expect(keys(validate(data), "errors")).toEqual([
      "description[en-US].shortDescription",
      "maintenance.contacts[0].name",
    ]);
  });

  it("reports a missing section on its required keys", () => {
    const data: Record<string, unknown> = minimal();
    delete data.localisation;

    expect(keys(validate(data), "errors")).toEqual([
      "localisation.localisationReady",
      "localisation.availableLanguages",
    ]);
  });

  it("applies the maintenance conditions", () => {
    const contract = minimal();
    contract.maintenance = { type: "contract" } as never;
    expect(validate(contract).errors).toEqual([
      expect.objectContaining({
        key: "maintenance.contractors",
        description: 'contractors is a required field when "type" is "contract"',
      }),
    ]);

    const none = minimal();
    none.maintenance = { type: "none", contractors: [{ name: "x" }] } as never;
    expect(keys(validate(none), "errors")).toEqual(["maintenance.contractors"]);
  });

  it("checks the custom formats", () => {
    const data = minimal();
    data.legal.license = "Not-A-License";
    data.localisation.availableLanguages = ["zz"];
    Object.assign(data, { organisation: { uri: "urn:x-italian-pa:nope" } });

    expect(keys(validate(data), "errors").sort()).toEqual([
      "legal.license",
      "localisation.availableLanguages[0]",
      "organisation.uri",
    ]);
  });

  it("counts grapheme clusters like the parser", () => {
    const data = minimal();
    // 150 graphemes, 300 code points.
    data.description.en.shortDescription = "é".repeat(150);
    expect(validate(data).errors).toEqual([]);
  });

  it("treats scalars and nulls like the Go decoder", () => {
    const data = minimal() as Record<string, unknown>;
    data.softwareVersion = 1.0;
    data.maintenance = {
      type: "community",
      contacts: [{ name: "Dario", phone: 391624231322 }],
    };
    data.name = null;

    expect(keys(validate(data), "errors")).toEqual(["name"]);
  });

  it("reports deprecations and IT/it conflicts", () => {
    const data = {
      ...minimal(),
      inputTypes: ["text/plain"],
      legal: { license: "MIT", repoOwner: "Acme" },
      intendedAudience: { countries: ["it"] },
      it: { countryExtensionVersion: "1.0", conforme: { gdpr: true } },
    };

    const res = validate(data);
    expect(res.errors).toEqual([]);
    expect(keys(res, "warnings")).toEqual([
      "intendedAudience.countries[0]",
      "legal.repoOwner",
      "inputTypes",
      "it",
      "IT.conforme",
    ]);

    expect(
      keys(validate({ ...data, IT: { countryExtensionVersion: "1.0" } }), "errors"),
    ).toEqual(["it"]);
  });

  it("checks logo, screenshot and video locations", () => {
    const data = minimal();
    Object.assign(data, { logo: "img/logo.jpg" });
    Object.assign(data.description.en, {
      screenshots: ["/abs/shot.png", "shot.gif", "https://example.org/shot.gif"],
      videos: ["https://example.org/video"],
    });

    expect(keys(validate(data), "errors")).toEqual([
      "logo",
      "description.en.screenshots[0]",
      "description.en.screenshots[1]",
      "description.en.videos[0]",
    ]);
  });
});
