export const {
  VITE_REPOSITORY: REPOSITORY,
  VITE_ELASTIC_URL: ELASTIC_URL,
  VITE_VALIDATOR_URL: VALIDATOR_URL,
  VITE_VALIDATOR_REMOTE_URL: VALIDATOR_REMOTE_URL,
  VITE_DEFAULT_COUNTRY: DEFAULT_COUNTRY,
  VITE_FALLBACK_LANGUAGE: FALLBACK_LANGUAGE = "en",
  VITE_DEFAULT_COUNTRY_SECTIONS: DEFAULT_COUNTRY_SECTIONS = "none",
} = import.meta.env;

export const documentationUrl = `https://yml.publiccode.tools`;
export const SAMPLE_YAML_URL = `https://raw.githubusercontent.com/italia/publiccode-editor/master/publiccode.yml`;
export const elasticUrl = ELASTIC_URL || "";
export const AUTOSAVE_TIMEOUT = 15000;
export const DEFAULT_BRANCH = "master";
export const defaultBranch = { branch: DEFAULT_BRANCH };
