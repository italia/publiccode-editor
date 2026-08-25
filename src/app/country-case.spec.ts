import YAML from "yaml";
import { publicCodeDummyObjectFactory } from "./contents/publiccode";
import { getYaml, parseYaml } from "./lib/utils";

describe("country section and country codes case by declared version", () => {
  const withCountryData = (publiccodeYmlVersion: string) => ({
    ...publicCodeDummyObjectFactory(),
    publiccodeYmlVersion,
    intendedAudience: { countries: ["it", "DE"] },
    it: {
      countryExtensionVersion: "1.0",
      riuso: { codiceIPA: "c_h501" },
    },
  });

  it("emits uppercase (IT:, ISO codes) from 0.5.0 onwards", () => {
    const yaml = getYaml(withCountryData("0.7.0") as never) ?? "";
    const parsed = YAMLparse(yaml);

    expect(parsed.IT).toBeDefined();
    expect(parsed.it).toBeUndefined();
    expect(parsed.intendedAudience.countries).toEqual(["IT", "DE"]);
  });

  it("emits lowercase (it:, ISO codes) for versions before 0.5.0", () => {
    const yaml = getYaml(withCountryData("0.4.0") as never) ?? "";
    const parsed = YAMLparse(yaml);

    expect(parsed.it).toBeDefined();
    expect(parsed.IT).toBeUndefined();
    expect(parsed.intendedAudience.countries).toEqual(["it", "de"]);
  });

  it("round-trips an old lowercase file into the internal representation", () => {
    const imported = parseYaml(`
publiccodeYmlVersion: "0.4.0"
it:
  riuso:
    codiceIPA: c_h501
intendedAudience:
  countries:
    - it
`);

    expect(imported?.it?.riuso?.codiceIPA).toBe("c_h501");
    // internal representation is always uppercase
    expect(imported?.intendedAudience?.countries).toEqual(["IT"]);
  });
});

// Parse raw YAML without the internal-representation normalization done by
// parseYaml, to assert on the actual serialized key case.
function YAMLparse(yaml: string) {
  return YAML.parse(yaml);
}
