import type { CountryExtension } from "../../vendor/publiccode-schema/src";
import linter from "../linter";
import { validate } from "../validator/ajv";
import {
  experimentalSectionKeys,
  isExperimentalBooleanKey,
  resolveExperimentalPackages,
  sectionsForm,
  setExperimentalPackages,
} from "./sections";

// A package with a section of its own, as a fork would add one to
// publiccode-json-schema.
const nld: CountryExtension = {
  id: "nld",
  sections: [
    {
      key: "nld",
      standard: false,
      schema: {
        additionalProperties: false,
        properties: {
          countryExtensionVersion: { type: "string", enum: ["0.1"] },
          digid: { type: "boolean" },
          register: { type: "string", format: "url_http_url" },
        },
      },
    },
  ],
  locales: { en: { countries: { nld: { name: "Netherlands" } } } },
};

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
  maintenance: { type: "community", contacts: [{ name: "Francesco Rossi" }] },
  localisation: { localisationReady: true, availableLanguages: ["en"] },
});

describe("experimental country sections", () => {
  afterEach(() => setExperimentalPackages([]));

  it("are only enabled with the Ajv validator", () => {
    const warn = jest.spyOn(console, "warn").mockImplementation(() => {});

    expect(resolveExperimentalPackages(["nld"], "ajv", [nld])).toEqual([nld]);
    expect(resolveExperimentalPackages([" NLD "], "ajv", [nld])).toEqual([nld]);
    expect(resolveExperimentalPackages([""], "wasm", [nld])).toEqual([]);
    expect(warn).not.toHaveBeenCalled();

    expect(resolveExperimentalPackages(["nld"], "wasm", [nld])).toEqual([]);
    expect(resolveExperimentalPackages(["deu"], "ajv", [nld])).toEqual([]);
    expect(warn).toHaveBeenCalledTimes(2);
    warn.mockRestore();
  });

  it("are validated by the Ajv validator once enabled", () => {
    const file = {
      ...minimal(),
      nld: { digid: true, register: "https://example.org" },
    };
    expect(validate(file).errors).toEqual([
      expect.objectContaining({
        key: "nld",
        description: 'unknown field "nld"',
      }),
    ]);

    setExperimentalPackages([nld]);
    expect(isExperimentalBooleanKey("digid")).toBe(true);
    expect(validate(file).errors).toEqual([]);
    expect(
      validate({ ...file, nld: { register: "not a url" } }).errors,
    ).toEqual([expect.objectContaining({ key: "nld.register" })]);
  });

  it("are kept by the linter once enabled", () => {
    const values = { ...minimal(), nld: { digid: true } } as never;
    expect(linter(values)).not.toHaveProperty("nld");

    setExperimentalPackages([nld]);
    expect(experimentalSectionKeys()).toEqual(["nld"]);
    expect(linter(values)).toHaveProperty("nld", { digid: true });
  });

  it("have a form built from their schema", () => {
    const form = sectionsForm(nld, "0.7.0");
    expect(form.groups).toEqual([
      expect.objectContaining({
        id: "section:nld",
        i18n: "countries.nld.name",
        experimental: true,
      }),
    ]);
    expect(
      form.fields.map(({ path, widget, i18n }) => ({ path, widget, i18n })),
    ).toEqual([
      { path: "nld", widget: "fieldset", i18n: "publiccodeyml.nld" },
      {
        path: "nld.countryExtensionVersion",
        widget: "select",
        i18n: "publiccodeyml.nld.countryExtensionVersion",
      },
      { path: "nld.digid", widget: "boolean", i18n: "publiccodeyml.nld.digid" },
      {
        path: "nld.register",
        widget: "url",
        i18n: "publiccodeyml.nld.register",
      },
    ]);
  });
});
