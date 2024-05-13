export const {
  REPOSITORY,
  ELASTIC_URL,
  VALIDATOR_URL,
  VALIDATOR_REMOTE_URL,
  DEFAULT_COUNTRY,
  FALLBACK_LANGUAGE = "en",
  DEFAULT_COUNTRY_SECTIONS = "all", // TODO: switch this to 'none'
  // eslint-disable-next-line no-undef
} = process.env;

export const documentationUrl = `https://yml.publiccode.tools`;
export const SAMPLE_YAML_URL = `https://raw.githubusercontent.com/italia/publiccode-editor/master/publiccode.yml`;
export const elasticUrl = ELASTIC_URL || "";
export const AUTOSAVE_TIMEOUT = 15000;
export const DEFAULT_BRANCH = "master";
export const defaultBranch = { branch: DEFAULT_BRANCH };
