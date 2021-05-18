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
import {
  BITBUCKET,
  getAPIURL,
  GITHUB,
  GITLAB,
  isBitBucket,
  isGithub,
  isGitlab,
} from "../vcs";

export const mockFetch = (ok, out) => {
  return jest.fn(() =>
    Promise.resolve({
      ok,
      json: () => Promise.resolve(out),
    })
  );
};

beforeEach(() => {
  global.fetch = mockFetch(false, {});
});
afterEach(() => {
  fetch.mockClear();
});

describe("vcs url identification", () => {
  it("github repo url identification", async () => {
    expect(isGithub(githubRepoURL)).toBeTruthy();
    expect(await isGitlab(githubRepoURL)).toBeFalsy();
    expect(isBitBucket(githubRepoURL)).toBeFalsy();
  });
  it("gitlab repo url identification", async () => {
    expect(isGithub(gitlabRepoURL)).toBeFalsy();
    expect(await isGitlab(gitlabRepoURL)).toBeTruthy();
    expect(isBitBucket(gitlabRepoURL)).toBeFalsy();
  });
  it("external gitlab repo url identification", async () => {
    global.fetch = mockFetch(true, {});
    expect(isGithub(extGitlabRepoURL)).toBeFalsy();
    expect(await isGitlab(extGitlabRepoURL)).toBeTruthy();
    expect(isBitBucket(extGitlabRepoURL)).toBeFalsy();
  });
  it("bitbucket repo url identification", async () => {
    expect(isGithub(bitbucketRepoURL)).toBeFalsy();
    expect(await isGitlab(bitbucketRepoURL)).toBeFalsy();
    expect(isBitBucket(bitbucketRepoURL)).toBeTruthy();
  });
  it("unknown repo url identification", async () => {
    expect(isGithub(unknownRepoURL)).toBeFalsy();
    expect(await isGitlab(unknownRepoURL)).toBeFalsy();
    expect(isBitBucket(unknownRepoURL)).toBeFalsy();
  });
});

describe("get API from urlString", () => {
  it("get Github repo api url", async () => {
    const { vcs, url } = await getAPIURL(githubRepoURL);
    expect(vcs).toEqual(GITHUB);
    expect(url).toEqual(githubAPIRepoURL);
  });
  it("get GitLab repo api url", async () => {
    global.fetch = mockFetch(true, {});
    const { vcs, url } = await getAPIURL(gitlabRepoURL);
    expect(vcs).toEqual(GITLAB);
    expect(url).toEqual(gitlabAPIRepoURL);
  });
  it("get external Gitlab repo api url", async () => {
    global.fetch = mockFetch(true, {});
    const { vcs, url } = await getAPIURL(extGitlabRepoURL);
    expect(vcs).toEqual(GITLAB);
    expect(url).toEqual(extGitlabAPIRepoURL);
  });
  it("get Bitbucket repo api url", async () => {
    const { vcs, url } = await getAPIURL(bitbucketRepoURL);
    expect(vcs).toEqual(BITBUCKET);
    expect(url).toEqual(bitbucketAPIRepoURL);
  });
});
