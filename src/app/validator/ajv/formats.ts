// Custom JSON Schema formats, named after the publiccode-parser-go validation
// tags they reproduce (see publiccode-json-schema/docs/validation-checklist.md).
import bcp47 from "./data/vocab/bcp47.json";
import countries from "./data/vocab/countries.json";
import emailRegex from "./data/vocab/email-regex.json";
import ipaCodes from "./data/vocab/ipa-codes.json";
import { goParse, goParseRequestURI } from "./goUrl";
import { isSPDXExpression } from "./spdx";

const LANGUAGES = new Set(bcp47.languages);
const SCRIPTS = new Set(bcp47.scripts);
const REGIONS = new Set(bcp47.regions);
const M49 = new Set(bcp47.m49);
const VARIANTS = new Set(bcp47.variants);
const EXTLANGS = new Map(Object.entries(bcp47.extlangs));
const COUNTRIES = new Set(countries);
const IPA_CODES = new Set(ipaCodes);

export const SUPPORTS_ALIASES = new Set([
  "gdpr",
  "eidas",
  "nis2",
  "cra",
  "spid",
  "cie",
  "anpr",
  "pagopa",
  "io",
]);

// go-playground/validator's bcp47LanguageTagRe, applied to the lowercased tag.
const BCP47 = new RegExp(
  [
    "^(",
    "en-gb-oed|i-ami|i-bnn|i-default|i-enochian|i-hak|i-klingon|i-lux|i-mingo|i-navajo|i-pwn|i-tao|i-tay|i-tsu|",
    "sgn-be-fr|sgn-be-nl|sgn-ch-de|",
    "art-lojban|cel-gaulish|no-bok|no-nyn|zh-guoyu|zh-hakka|zh-min|zh-min-nan|zh-xiang|",
    "x-[a-z0-9]{1,8}",
    ")$",
    "|",
    "^",
    "((?:[a-z]{2,3}(?:-[a-z]{3}){0,3})|[a-z]{4}|[a-z]{5,8})",
    "(?:-([a-z]{4}))?",
    "(?:-([a-z]{2}|[0-9]{3}))?",
    "(?:-((?:[a-z0-9]{5,8}|[0-9][a-z0-9]{3})(?:-(?:[a-z0-9]{5,8}|[0-9][a-z0-9]{3}))*))?",
    "(?:-((?:[a-wyz0-9](?:-[a-z0-9]{2,8})+)(?:-(?:[a-wyz0-9](?:-[a-z0-9]{2,8})+))*))?",
    "(?:-x(?:-[a-z0-9]{1,8})+)?",
    "$",
  ].join(""),
);

// bcp47_strict_language_tag: RFC 5646 grammar plus registered subtags.
export function isBCP47StrictLanguageTag(tag: string): boolean {
  const lower = tag.toLowerCase();
  const m = BCP47.exec(lower);
  if (!m) return false;

  const [, grandfatheredOrPrivateuse, lang, script, region, variant] = m;
  if (grandfatheredOrPrivateuse) return true;

  if (lang.includes("-")) {
    const [base, ...extlangs] = lang.split("-");
    if (!LANGUAGES.has(base)) return false;
    for (const e of extlangs) {
      const prefixes = EXTLANGS.get(e);
      if (!prefixes) return false;
      if (
        prefixes.length > 0 &&
        !prefixes.some((p) => (lower + "-").startsWith(p))
      ) {
        return false;
      }
    }
  } else if (lang.length > 3 || !LANGUAGES.has(lang)) {
    return false;
  }

  if (script && !SCRIPTS.has(script)) return false;
  if (region && !(region.length === 2 ? REGIONS : M49).has(region)) {
    return false;
  }
  if (variant && !variant.split("-").every((v) => VARIANTS.has(v))) {
    return false;
  }

  return true;
}

// go-playground `url`, run on the lowercased value.
export function isURL(value: string): boolean {
  const s = value.toLowerCase();
  if (s === "") return false;

  const u = goParse(s);
  if (!u || u.scheme === "") return false;

  if (u.scheme === "file") return u.path !== "" && u.path !== "/";

  return u.host !== "" || u.fragment !== "" || u.opaque !== "";
}

// go-playground `http_url`.
export function isHTTPURL(value: string): boolean {
  if (!isURL(value)) return false;

  const u = goParse(value.toLowerCase());

  return !!u && u.host !== "" && (u.scheme === "http" || u.scheme === "https");
}

// go-playground `urn_rfc2141` (github.com/leodido/go-urn): unlike RFC 2141
// it rejects / ? # and accepts any two alphanumerics after %.
const URN = /^urn:(?!urn:)[a-z0-9][a-z0-9-]{0,31}:(?:[a-z0-9()+,\-.:=@;$_!*']|%[a-z0-9]{2})+$/i;

export const isItalianIpaCode = (code: string) =>
  IPA_CODES.has(code.toLowerCase());

export function isOrganisationURI(value: string): boolean {
  const u = goParseRequestURI(value);
  if (!u) return false;

  if (u.scheme === "urn") {
    if (!URN.test(value)) return false;

    if (u.opaque.toLowerCase().startsWith("x-italian-pa:")) {
      return isItalianIpaCode(u.opaque.slice("x-italian-pa:".length));
    }

    return true;
  }

  return u.scheme !== "" && u.host !== "";
}

export function isSupportsID(value: string): boolean {
  if (value.startsWith("alias:")) {
    return SUPPORTS_ALIASES.has(value.slice("alias:".length));
  }

  const u = goParseRequestURI(value);
  if (!u) return false;

  if (u.scheme === "urn") return URN.test(value);

  return u.scheme !== "" && u.host !== "";
}

export const isIso3166Alpha2LowerOrUpper = (code: string) =>
  (code === code.toLowerCase() || code === code.toUpperCase()) &&
  COUNTRIES.has(code.toUpperCase());

const MIME_TYPE =
  /^ *([A-Za-z0-9][A-Za-z0-9!#$&^_-]{0,126})\/([A-Za-z0-9][A-Za-z0-9!#$&^_.+-]{0,126}) *$/;

// Go RE2 \x{HHHH} escapes become JS \u{HHHH} (needs the u flag).
const EMAIL = new RegExp(emailRegex.replace(/\\x\{/g, "\\u{"), "u");

export const formats: Record<string, (value: string) => boolean> = {
  url_url: isURL,
  url_http_url: isHTTPURL,
  email: (value) => EMAIL.test(value),
  mime_type: (value) => MIME_TYPE.test(value),
  spdx_expression: isSPDXExpression,
  bcp47_strict_language_tag: isBCP47StrictLanguageTag,
  iso3166_1_alpha2_lower_or_upper: isIso3166Alpha2LowerOrUpper,
  italian_ipa_code: isItalianIpaCode,
  organisation_uri: isOrganisationURI,
  supports_id: isSupportsID,
};
