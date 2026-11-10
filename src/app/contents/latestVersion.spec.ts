import { LATEST_SUPPORTED, PARSER_LATEST } from "publiccode-schema";
import { formSchemaFor } from "../lib/formSchema";
import { isMinorThanLatest, toSemVerObject } from "../semver";
import { latestVersion, setLatestVersionFor } from "./latestVersion";
import { getPubliccodeYmlVersionList } from "./publiccode-yml-version";

describe("latest publiccode.yml version", () => {
  afterEach(() => setLatestVersionFor("wasm"));

  it("is the parser's (0.7.0) with the default WASM validator", () => {
    expect(latestVersion()).toBe(PARSER_LATEST);
    expect(PARSER_LATEST).toBe("0.7.0");
  });

  it("is 0.8.0 with the Ajv validator", () => {
    setLatestVersionFor("ajv");
    expect(latestVersion()).toBe(LATEST_SUPPORTED);
    expect(latestVersion()).toBe("0.8.0");
    expect(getPubliccodeYmlVersionList("")[0]).toEqual({ text: "Latest (0.8.0)", value: "0.8.0" });
    expect(isMinorThanLatest(toSemVerObject("0.7.0"))).toBe(true);
    expect(formSchemaFor().version).toBe("0.8.0");
  });

  it("0.7.0 isn't older than the latest with the parser", () => {
    expect(isMinorThanLatest(toSemVerObject("0.7.0"))).toBe(false);
  });
});
