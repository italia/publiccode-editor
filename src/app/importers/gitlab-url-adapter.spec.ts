import { adaptToGitlabAPIUrl } from "./gitlab-url-adapter";

describe("Gitlab url adapter tests", () => {
  it("should adapt from a raw URI to a API-based uri", async () => {
    //arrange
    const url = new URL(
      "https://gitlab.com/opencity-labs/area-personale/core/-/raw/master/publiccode.yml",
    );
    //act
    const actual = await adaptToGitlabAPIUrl(url);
    //assert
    console.log(actual);
    expect(actual).toBeDefined();
    expect(actual).toBe(
      "https://gitlab.com/api/v4/projects/opencity-labs%2Farea-personale%2Fcore/repository/files/publiccode.yml?ref=master",
    );
  });
});
