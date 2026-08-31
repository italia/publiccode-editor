import packageJson from "../../../package.json";
import { LATEST_VERSION } from "./publiccode";

// The release workflow reads the supported standard version from package.json to
// build the optional `publiccode-x.y.z` tag, while the editor reads it from
// LATEST_VERSION. Keep the two in sync: these tests are what makes a mismatch fail
// on the pull request instead of halfway through a release.
describe("supported publiccode.yml standard version", () => {
  it("is declared in package.json in the x.y.z form the release tag needs", () => {
    expect(packageJson.publiccodeYml.latestVersion).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it("is the same version the editor uses", () => {
    expect(LATEST_VERSION).toBe(packageJson.publiccodeYml.latestVersion);
  });
});
