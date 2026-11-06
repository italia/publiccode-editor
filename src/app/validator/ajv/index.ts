// JSON Schema (Ajv) implementation of the publiccode.yml validation done by
// publiccode-parser-go, returning the same shape as the WASM validator.
import Ajv, { ErrorObject } from "ajv";
import addFormats from "ajv-formats";
import { withCountries } from "../../../vendor/publiccode-schema/src";
import {
  experimentalPackages,
  isExperimentalBooleanKey,
} from "../../lib/sections";
import schema from "./data/publiccode-schema.json";
import { checks, Issue } from "./checks";
import { formats } from "./formats";

// publiccode-parser-go SupportedVersions.
export const SUPPORTED_VERSIONS = [
  "0",
  "0.2",
  "0.2.0",
  "0.2.1",
  "0.2.2",
  "0.3",
  "0.3.0",
  "0.4",
  "0.4.0",
  "0.5.0",
  "0.5",
  "0.7.0",
  "0.7",
];
const LATEST = SUPPORTED_VERSIONS[SUPPORTED_VERSIONS.length - 1];

export interface Err {
  key: string;
  description: string;
  line: number;
  column: number;
}

export interface Result {
  publicCode: Record<string, unknown> | null;
  errors: Array<Err>;
  warnings: Array<Err>;
  version: number | null;
}

type Data = Record<string, unknown>;

const segmenter = new (
  Intl as unknown as {
    Segmenter: new (
      locale?: string,
      options?: { granularity: "grapheme" },
    ) => { segment: (s: string) => Iterable<unknown> };
  }
).Segmenter(undefined, { granularity: "grapheme" });

// The parser's umax/umin count grapheme clusters, not code points.
const graphemes = (s: string) => {
  let n = 0;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const _ of segmenter.segment(s)) n++;
  return n;
};

function createAjv() {
  const ajv = new Ajv({
    allErrors: true,
    allowUnionTypes: true,
    strictTypes: true,
    verbose: true,
  });

  addFormats(ajv, ["date"]);
  for (const [name, validate] of Object.entries(formats)) {
    ajv.addFormat(name, { type: "string", validate });
  }

  ajv.removeKeyword("maxLength");
  ajv.removeKeyword("minLength");
  ajv.addKeyword({
    keyword: "maxLength",
    type: "string",
    schemaType: "number",
    validate: (max: number, data: string) => graphemes(data) <= max,
  });
  ajv.addKeyword({
    keyword: "minLength",
    type: "string",
    schemaType: "number",
    validate: (min: number, data: string) => graphemes(data) >= min,
  });

  return ajv;
}

let ajv: Ajv | undefined;
let compiled: { ids: string; fn: ReturnType<Ajv["compile"]> } | undefined;
const getAjv = () => (ajv ??= createAjv());

// The v0 schema plus the enabled experimental country sections.
function validateSchema() {
  const packages = experimentalPackages();
  const ids = packages.map((c) => c.id).join(",");
  if (compiled?.ids !== ids) {
    // A schema can't be added twice with the same $id: start over.
    if (compiled) ajv = createAjv();
    const s = packages.length > 0 ? withCountries(schema, packages) : schema;
    compiled = { ids, fn: getAjv().compile(s) };
  }

  return compiled.fn;
}

// Runs a single format of the schema (used to test them against the parser).
export function checkFormat(name: string, value: string): boolean {
  const format: unknown = getAjv().formats[name];
  const check =
    typeof format === "object" && format !== null && "validate" in format
      ? format.validate
      : format;

  if (check instanceof RegExp) return check.test(value);
  if (typeof check === "function") return check(value) === true;

  throw new Error(`unknown format ${name}`);
}

const isObject = (v: unknown): v is Data =>
  typeof v === "object" && v !== null && !Array.isArray(v);

// The only non-string scalars in a v0 publiccode.yml.
const BOOLEAN_KEYS = new Set([
  "localisationReady",
  "optional",
  "lineeGuidaDesign",
  "modelloInteroperabilita",
  "misureMinimeSicurezza",
  "gdpr",
  "spid",
  "pagopa",
  "cie",
  "anpr",
  "io",
]);

// Mirror what the parser's Go YAML decoder does before validation:
// - `key:` with no value is null, decoded as the zero value (so `required`
//   fires instead of a type error): drop nulls in objects;
// - any scalar decodes into a string field (`phone: +39...` is valid):
//   numbers, and booleans outside the boolean keys, become strings.
function normalize(value: unknown, key?: string): unknown {
  if (typeof value === "number") return String(value);
  if (
    typeof value === "boolean" &&
    !(key && (BOOLEAN_KEYS.has(key) || isExperimentalBooleanKey(key)))
  ) {
    return String(value);
  }
  if (Array.isArray(value)) return value.map((v) => normalize(v));
  if (!isObject(value)) return value;

  return Object.fromEntries(
    Object.entries(value)
      .filter(([, v]) => v !== null && v !== undefined)
      .map(([k, v]) => [k, normalize(v, k)]),
  );
}

// "/maintenance/contacts/0/name" -> "maintenance.contacts[0].name", the key
// format of the parser (and what react-hook-form's lodash.set understands).
// The parser only rewrites `description[en]` to `description.en` for purely
// alphabetic language tags, so `description[en-US].name` keeps the brackets.
function toKey(instancePath: string, data: unknown, extra?: string): string {
  const parts = instancePath
    .split("/")
    .slice(1)
    .map((p) => p.replace(/~1/g, "/").replace(/~0/g, "~"));
  if (extra !== undefined) parts.push(extra);

  let key = "";
  let node: unknown = data;
  for (const part of parts) {
    if (Array.isArray(node)) {
      key += `[${part}]`;
      node = node[Number(part)];
    } else if (key === "description" && !/^[A-Za-z]+$/.test(part)) {
      key += `[${part}]`;
      node = isObject(node) ? node[part] : undefined;
    } else {
      key += key === "" ? part : `.${part}`;
      node = isObject(node) ? node[part] : undefined;
    }
  }

  return key;
}

const field = (key: string) => key.split(".").pop() ?? key;

// Sections that are plain structs in the parser: when missing, it reports
// their required keys instead of the section itself.
const STRUCT_SECTIONS: Record<string, string[]> = {
  legal: ["license"],
  maintenance: ["type"],
  localisation: ["localisationReady", "availableLanguages"],
};

const oneOf = (values: unknown[]) => {
  const s = values.map((v) => `"${v}"`);
  return s.length > 1
    ? `${s.slice(0, -1).join(", ")} or ${s[s.length - 1]}`
    : s.join("");
};

const FORMAT_MESSAGES: Record<string, string> = {
  url_url: "must be a valid URL",
  url_http_url: "must be an HTTP URL",
  email: "must be a valid email address",
  date: "must be a date with format 'YYYY-MM-DD'",
  mime_type: "is not a valid MIME type",
  spdx_expression: "must be a valid license (see https://spdx.org/licenses)",
  bcp47_strict_language_tag: "must be a valid BCP 47 language",
  iso3166_1_alpha2_lower_or_upper:
    "must be a valid ISO 3166-1 alpha-2 two-letter country code",
  italian_ipa_code:
    "must be a valid Italian Public Administration Code (iPA) (see https://github.com/publiccodeyml/italian-organizations-ipa-vocabulary)",
  organisation_uri: "is not a valid URI",
  supports_id:
    "must be a known alias ('alias:<name>') or a valid URI (URL or URN)",
};

// Messages modelled on the parser's go-playground translations.
function toIssues(e: ErrorObject, data: Data): Issue[] {
  if (e.keyword === "required" && e.instancePath === "") {
    const children = STRUCT_SECTIONS[e.params.missingProperty];
    if (children) {
      return children.map((child) => ({
        key: `${e.params.missingProperty}.${child}`,
        description: `${child} is a required field`,
      }));
    }
  }

  const issue = toIssue(e, data);

  return issue ? [issue] : [];
}

function toIssue(e: ErrorObject, data: Data): Issue | null {
  switch (e.keyword) {
    case "if":
      return null; // the then/else error is reported on its own
    case "required": {
      const key = toKey(e.instancePath, data, e.params.missingProperty);
      const when = e.schemaPath.includes("/then/")
        ? ` when "type" is "${(data.maintenance as Data | undefined)?.type}"`
        : "";
      return { key, description: `${field(key)} is a required field${when}` };
    }
    case "additionalProperties": {
      const key = toKey(e.instancePath, data, e.params.additionalProperty);
      return {
        key,
        description: `unknown field "${e.params.additionalProperty}"`,
      };
    }
    case "propertyNames": {
      const key = toKey(e.instancePath, data);
      return {
        key,
        description: `${field(key)} must be a valid BCP 47 language`,
      };
    }
    case "false schema": {
      const key = toKey(e.instancePath, data);
      return {
        key,
        description: `${field(key)} must not be present unless "type" is "contract"`,
      };
    }
  }

  if (e.schemaPath.includes("/propertyNames/")) return null;

  let key = toKey(e.instancePath, data);
  // A single isBasedOn URL is decoded into a one-element list.
  if (key === "isBasedOn" && typeof data.isBasedOn === "string") {
    key = "isBasedOn[0]";
  }
  const name = field(key);

  switch (e.keyword) {
    case "type":
      return { key, description: "wrong type for this field" };
    case "enum":
      return {
        key,
        description: `${name} must be one of the following: ${oneOf(e.params.allowedValues)}`,
      };
    case "format":
      if (
        e.params.format === "organisation_uri" &&
        String(e.data).startsWith("urn:x-italian-pa:")
      ) {
        return {
          key,
          description: `${name} must be a valid Italian Public Administration Code (iPA) with format 'urn:x-italian-pa:[codiceIPA]' (see https://github.com/publiccodeyml/italian-organizations-ipa-vocabulary)`,
        };
      }
      if (
        e.params.format === "supports_id" &&
        String(e.data).startsWith("alias:")
      ) {
        return {
          key,
          description: `${name} contains an unknown alias (see https://github.com/publiccodeyml/publiccode.yml/blob/main/docs/standard/aliases-list.rst)`,
        };
      }
      return {
        key,
        description: `${name} ${FORMAT_MESSAGES[e.params.format] ?? `must match format "${e.params.format}"`}`,
      };
    case "minLength":
      return e.schema === 1
        ? { key, description: `${name} is a required field` }
        : {
            key,
            description: `${name} must be at least ${e.schema} characters in length`,
          };
    case "maxLength":
      return {
        key,
        description: `${name} must be a maximum of ${e.schema} characters in length`,
      };
    case "minItems":
    case "minProperties":
      return {
        key,
        description: `${name} must contain more than ${Number(e.schema) - 1} items`,
      };
  }

  return { key, description: `${name} ${e.message ?? "is invalid"}` };
}

const toErr = ({ key, description }: Issue): Err => ({
  key,
  description,
  line: 0,
  column: 0,
});

// Same early exits as the parser: without a valid version nothing else is
// validated.
function checkVersion(data: unknown): { errors: Issue[]; warnings: Issue[] } {
  const required = {
    errors: [
      {
        key: "publiccodeYmlVersion",
        description: "publiccodeYmlVersion is a required field",
      },
    ],
    warnings: [],
  };

  if (!isObject(data) || !("publiccodeYmlVersion" in data)) return required;

  const version = data.publiccodeYmlVersion;
  if (typeof version !== "string") {
    return {
      errors: [
        {
          key: "publiccodeYmlVersion",
          description: "wrong type for this field",
        },
      ],
      warnings: [],
    };
  }
  if (!SUPPORTED_VERSIONS.includes(version)) {
    return {
      errors: [
        {
          key: "publiccodeYmlVersion",
          description: `unsupported version: '${version}'. Supported versions: ${SUPPORTED_VERSIONS.join(", ")}`,
        },
      ],
      warnings: [],
    };
  }
  if (version !== "0" && !version.startsWith("0.7")) {
    return {
      errors: [],
      warnings: [
        {
          key: "publiccodeYmlVersion",
          description: `v${version} is not the latest version, use '0'. Parsing this file as v${LATEST}.`,
        },
      ],
    };
  }

  return { errors: [], warnings: [] };
}

export function validate(input: unknown): Result {
  // On the raw input: the parser requires publiccodeYmlVersion to be a YAML
  // string, it's the one key where numbers aren't turned into strings.
  const version = checkVersion(input);
  const data = normalize(input);
  if (version.errors.length > 0 || !isObject(data)) {
    return {
      publicCode: null,
      errors: version.errors.map(toErr),
      warnings: [],
      version: null,
    };
  }

  const validateFn = validateSchema();
  validateFn(data);

  const schemaErrors = (validateFn.errors ?? []).flatMap((e) =>
    toIssues(e, data),
  );
  const extra = checks(data);

  return {
    publicCode: data,
    errors: [...schemaErrors, ...extra.errors].map(toErr),
    warnings: [...version.warnings, ...extra.warnings].map(toErr),
    version: 0,
  };
}
