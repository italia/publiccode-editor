export const GITHUB = "github";
export const GITLAB = "gitlab";
export const BITBUCKET = "bitbucket";
export const UNKNOWN = "unknown";

const toURL = (urlString: string) => {
  try {
    return new URL(urlString);
  } catch (error) {
    console.error("error parsing url", error, urlString);
    return null;
  }
};

export const isGithub = (urlString: string) => {
  const url = toURL(urlString);
  if (url === null) return false;
  const { host } = url;
  return host === "github.com" || host === "raw.githubusercontent.com";
};

export const isBitBucket = (urlString: string) => {
  const url = toURL(urlString);
  if (url === null) return false;
  return url.host === "bitbucket.org";
};

const isGitlabAPI = async (url: string) => {
  try {
    const response = await fetch(url);
    if (!response.ok || !(response.status >= 200 && response.status <= 299)) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
};

export const isGitlab = async (urlString: string) => {
  const url = toURL(urlString);
  if (url === null) return false;
  if (url.host === "gitlab.com") {
    return true;
  }
  if (!isBitBucket(urlString) && !isGithub(urlString)) {
    url.pathname = `api/v4/projects`;
    return isGitlabAPI(url.toString());
  }
  return false;
};

export const getAPIURL = async (urlString: string) => {
  const url = toURL(urlString);
  if (url === null) throw new Error(`Invalid URL: ${url}`);
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
