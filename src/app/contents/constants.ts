export const {
  VITE_REPOSITORY,
  VITE_SAMPLE_YAML_URL,
  VITE_ELASTIC_URL: ELASTIC_URL,
  VITE_VALIDATOR_URL: VALIDATOR_URL,
  VITE_VALIDATOR_REMOTE_URL: VALIDATOR_REMOTE_URL,
  VITE_DEFAULT_COUNTRY: DEFAULT_COUNTRY,
  VITE_FALLBACK_LANGUAGE: FALLBACK_LANGUAGE = "en",
  VITE_DEFAULT_COUNTRY_SECTIONS: DEFAULT_COUNTRY_SECTIONS = "none",
} = import.meta.env;

export const documentationUrl = `https://yml.publiccode.tools`;
// `||` rather than destructuring defaults, so an empty value (e.g. `VITE_REPOSITORY=`
// copied from .env-example) also falls back to the default.
export const REPOSITORY =
  VITE_REPOSITORY || "https://github.com/italia/publiccode-editor";
export const SAMPLE_YAML_URL =
  VITE_SAMPLE_YAML_URL ||
  "https://raw.githubusercontent.com/italia/publiccode-editor/main/publiccode.yml";
export const elasticUrl = ELASTIC_URL || "";
export const AUTOSAVE_TIMEOUT = 15000;
export const DEFAULT_BRANCH = "master";
export const defaultBranch = { branch: DEFAULT_BRANCH };
