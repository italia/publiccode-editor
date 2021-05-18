import { isGitlabAPI } from "./calls";

export const GITHUB = "github";
export const GITLAB = "gitlab";
export const BITBUCKET = "bitbucket";
export const UNKNOWN = "unknown";

const toURL = (urlString) => {
  try {
    return new URL(urlString);
  } catch (error) {
    console.err("error parsing url", error, urlString);
    return null;
  }
};

export const isGithub = (urlString) => {
  const { host } = toURL(urlString);
  return host === "github.com" || host === "raw.githubusercontent.com";
};

export const isBitBucket = (urlString) => {
  const { host } = toURL(urlString);
  return host === "bitbucket.org";
};

export const isGitlab = async (urlString) => {
  const url = toURL(urlString);
  if (url.host === "gitlab.com") {
    return true;
  }
  if (!isBitBucket(urlString) && !isGithub(urlString)) {
    url.pathname = `api/v4/projects`
    return isGitlabAPI(url.toString());
  }
  return false;
};

export const getAPIURL = async (urlString) => {
  const url = toURL(urlString);
  switch (true) {
    case isGithub(urlString):
      url.pathname = `repos${url.pathname}`;
      url.host = `api.${url.host}`;
      return { vcs: GITHUB, url: url.toString() };
    case isBitBucket(urlString):
      url.pathname = `2.0/repositories${url.pathname}`;
      url.host = `api.${url.host}`;
      return { vcs: BITBUCKET, url: url.toString() };
    case await isGitlab(urlString):
      url.pathname = `api/v4/projects/${encodeURIComponent(
        url.pathname.substring(1)
      )}`;
      return { vcs: GITLAB, url: url.toString() };
    default:
      return { vcs: UNKNOWN, url: url.toString() };
  }
};
