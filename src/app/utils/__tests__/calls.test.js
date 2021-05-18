import {
  bitbucketAPIRepoURL,
  bitbucketRepoURL,
  extGitlabAPIRepoURL,
  extGitlabRepoURL,
  githubAPIRepoURL,
  githubRepoURL,
  gitlabAPIRepoURL,
  gitlabRepoURL,
  unknownRepoURL,
} from "../../../__mocks__/apiEndpoints";
import { getDefaultBranch } from "../calls";
import { mockFetch } from "./vcs.test";

it("bitbucket default branch retrieval", async () => {
  global.fetch = mockFetch(true, { mainbranch: { name: "develop" } });
  const results = await getDefaultBranch(bitbucketRepoURL);

  expect(fetch).toHaveBeenCalledWith(bitbucketAPIRepoURL);

  expect(fetch).toHaveBeenCalledTimes(1);
  expect(results).toEqual({branch: "develop"});
  fetch.mockClear();
});

describe("github/gitlab default branch retrieval", () => {
  it("github", async () => {
    global.fetch = mockFetch(true, { default_branch: "develop" });
    const results = await getDefaultBranch(githubRepoURL);

    expect(fetch).toHaveBeenCalledWith(githubAPIRepoURL);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(results).toEqual({branch: "develop"});
    fetch.mockClear();
  });

  it("gitlab", async () => {
    global.fetch = mockFetch(true, { default_branch: "develop" });
    const results = await getDefaultBranch(gitlabRepoURL);

    expect(fetch).toHaveBeenCalledWith(gitlabAPIRepoURL);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(results).toEqual({branch: "develop"});
    fetch.mockClear();
  });

  it("extgitlab", async () => {
    global.fetch = mockFetch(true, { default_branch: "develop" });
    const results = await getDefaultBranch(extGitlabRepoURL);

    expect(fetch).toHaveBeenCalledWith(extGitlabAPIRepoURL);

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(results).toEqual({branch: "develop"});
    fetch.mockClear();
  });

  it("unknown", async () => {
    global.fetch = mockFetch(false, {});
    const results = await getDefaultBranch(unknownRepoURL);
    expect(fetch.mock.calls).toEqual([
      ["https://google.com/api/v4/projects"], // First call
      [unknownRepoURL + "/"], // Second call
    ]);

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(results).toEqual({branch: "master"});
    fetch.mockClear();
  });
});
