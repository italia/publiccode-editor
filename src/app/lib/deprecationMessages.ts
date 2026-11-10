// Deprecation messages in the user's language, from the translations of
// publiccode-json-schema (merged into i18next by src/i18n).
import i18n from "i18next";
import {
  DEPRECATION_SINCE_KEY,
  deprecationKeys,
  type Finding,
} from "publiccode-schema";

export function deprecationMessage(finding: Finding): string {
  const message = i18n.t(deprecationKeys(finding), {
    ...finding.params,
    defaultValue: finding.message,
  });

  return i18n.t(DEPRECATION_SINCE_KEY, {
    message,
    since: finding.since,
    defaultValue: `${message} (deprecated since publiccode.yml ${finding.since})`,
  });
}
