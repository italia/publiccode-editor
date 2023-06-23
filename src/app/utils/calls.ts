import { defaultBranch } from "../contents/constants";
import { getAPIURL, BITBUCKET, GITHUB, GITLAB } from "./vcs";

export const getDefaultBranch = async (urlString: string) => {
  const { vcs, url } = await getAPIURL(urlString);
  try {
    const response = await fetch(url);
    if (!response.ok || !(response.status >= 200 && response.status <= 299)) {
      return defaultBranch; // assumption
    }
    const data = await response.json();
    switch (vcs) {
      case GITHUB:
      case GITLAB:
        return { branch: data?.default_branch as string };
      case BITBUCKET:
        return { branch: data?.mainbranch?.name as string };
      default:
        return defaultBranch; // assumption
    }
  } catch (error) {
    return defaultBranch; // assumption
  }
};

/*
export const getReleases = (versionsUrl) => {
  return fetch(versionsUrl)
    .then((res) => res.json())
    .then((data) => data.filter((d) => d.type == "dir"))
    .then((data) => data.map((d) => d.name));
};
*/

export const getRemotePubliccode = async (yamlURL: string) => {
  const myInit = {
    method: "GET",
  };

  const res = await fetch(yamlURL, myInit);
  // 422 should pass as it indicates a failed validation
  if (!res.ok && res.status != 422) {
    throw new Error(`fetch(${yamlURL}) returned ${res.status}`);
  }
  return await res.text();
};
