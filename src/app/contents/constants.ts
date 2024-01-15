export const {
  REPOSITORY,
  ELASTIC_URL,
  VALIDATOR_URL,
  VALIDATOR_REMOTE_URL,
  DEFAULT_COUNTRY,
  DEFAULT_LANGUAGE = "it" || navigator.language,
  // eslint-disable-next-line no-undef
} = process.env;

export const repositoryUrl = `https://docs.italia.it/italia/developers-italia/publiccodeyml/it/master/`;
export const versionsUrl = `https://api.github.com/repos/${REPOSITORY}/contents/version`;
export const SAMPLE_YAML_URL = `https://raw.githubusercontent.com/italia/publiccode-editor/master/publiccode.yml`;
export const elasticUrl = ELASTIC_URL || "";
export const validatorUrl = VALIDATOR_URL || "";
export const validatorRemoteUrl = VALIDATOR_REMOTE_URL || "";
export const APP_FORM = "appForm";
export const defaultCountry = DEFAULT_COUNTRY || "it";
export const AUTOSAVE_TIMEOUT = 15000;
export const NOTIFICATION_TIMEOUT = 3000;
export const DEFAULT_BRANCH = "master";
export const defaultBranch = { branch: DEFAULT_BRANCH };
