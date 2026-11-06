import i18n from "i18next";
import {
  countries,
  deprecations,
  locales,
  upgrade,
} from "../../vendor/publiccode-schema/src";
import { publicCodeDummyObjectFactory } from "../contents/publiccode";
import { deprecationMessage } from "./deprecationMessages";
import { fromYamlObject, toYamlObject } from "./utils";

const find = (data: object, id: string) =>
  deprecations(data, { countries }).find((d) => d.id === id)!;

describe("deprecation messages", () => {
  beforeAll(() =>
    i18n.init({
      lng: "it",
      fallbackLng: "en",
      resources: {
        it: { translation: locales("it") },
        en: { translation: locales("en") },
      },
      interpolation: { escapeValue: false },
    }),
  );

  it("are in the user's language, with their parameters", () => {
    const f = find(
      { intendedAudience: { countries: ["it"] } },
      "lowercaseCountries",
    );
    expect(deprecationMessage(f)).toBe(
      "I codici paese in minuscolo sono DEPRECATI. Usa il maiuscolo ('IT') (deprecato da publiccode.yml 0.5.0)",
    );
  });

  it("use the country package's wording first", () => {
    const f = find({ IT: { riuso: { codiceIPA: "c_h501" } } }, "codiceIPA");
    expect(deprecationMessage(f)).toContain("'urn:x-italian-pa:c_h501'");
  });

  it("fall back to the library's English message", async () => {
    await i18n.changeLanguage("xx");
    const f = find({ usedBy: ["Comune di Roma"] }, "usedBy");
    expect(deprecationMessage(f)).toBe(
      "This key is DEPRECATED and will be removed in the future (deprecated since publiccode.yml 0.8.0)",
    );
    await i18n.changeLanguage("it");
  });
});

describe("upgrading the form values", () => {
  it("goes through the YAML shape and back", () => {
    const values = {
      ...publicCodeDummyObjectFactory(),
      publiccodeYmlVersion: "0.4.0",
      it: {
        countryExtensionVersion: "1.0",
        piattaforme: { spid: true, cie: false },
        conforme: { gdpr: true },
      },
    };

    const { data, applied, remaining } = upgrade(
      toYamlObject(values as never),
      {
        countries,
        to: "0.7.0",
      },
    );
    const form = fromYamlObject(data);

    expect(applied.map((f) => f.id)).toEqual(
      expect.arrayContaining(["conforme", "piattaforme", "countrySection"]),
    );
    expect(remaining).toEqual([]);
    expect(form.publiccodeYmlVersion).toBe("0.7.0");
    expect(form.supports).toEqual([{ id: "alias:gdpr" }, { id: "alias:spid" }]);
    expect(form).not.toHaveProperty("it");
    expect(form).not.toHaveProperty("IT");
  });
});
