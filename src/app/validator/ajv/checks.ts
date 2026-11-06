// The publiccode-parser-go rules that aren't expressed in the JSON Schema:
// deprecation warnings and the code checks of validateFieldsV0 (fields.go)
// that don't need the network, as the editor's WASM runs with
// DisableNetwork: true.
import oembedSchemes from "./data/vocab/oembed-schemes.json";
import { goParseRequestURI } from "./goUrl";
import { isItalianIpaCode, isIso3166Alpha2LowerOrUpper } from "./formats";

export interface Issue {
  key: string;
  description: string;
}

type Data = Record<string, unknown>;

const DEPRECATED_DROP =
  "This key is DEPRECATED and will be removed in the future. It's safe to drop it";

const OEMBED = oembedSchemes.map(
  (scheme) =>
    new RegExp(
      "^" + scheme.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\\\*/g, ".*") + "$",
    ),
);

const isObject = (v: unknown): v is Data =>
  typeof v === "object" && v !== null && !Array.isArray(v);

const strings = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((s): s is string => typeof s === "string") : [];

// isRelativePathOrURL in fields.go.
function pathError(value: string, key: string): Issue | null {
  if (value.startsWith("/")) {
    return {
      key,
      description:
        "is an absolute path. Only relative paths or HTTP(s) URLs allowed",
    };
  }
  if (value.startsWith("file:")) {
    return {
      key,
      description:
        "is a file:// URL. Only relative paths or HTTP(s) URLs allowed",
    };
  }
  return null;
}

// Extension check the parser runs on relative paths (toAbsoluteURL returns
// nil for absolute URLs when the network is disabled).
function extensionError(
  value: string,
  key: string,
  allowed: string[],
  message: (value: string) => string,
): Issue | null {
  if (goParseRequestURI(value)) return null;

  const file = value.split("/").pop() ?? "";
  const dot = file.lastIndexOf(".");
  const ext = dot >= 0 ? file.slice(dot).toLowerCase() : "";

  return allowed.includes(ext) ? null : { key, description: message(value) };
}

function checkLogo(value: unknown, key: string, errors: Issue[]) {
  if (typeof value !== "string" || value === "") return;

  const err =
    pathError(value, key) ??
    extensionError(
      value,
      key,
      [".svg", ".svgz", ".png"],
      (v) => `invalid file extension for: ${v}`,
    );
  if (err) errors.push(err);
}

function lowercaseCountries(list: unknown, key: string, warnings: Issue[]) {
  strings(list).forEach((c, i) => {
    if (isIso3166Alpha2LowerOrUpper(c) && c === c.toLowerCase()) {
      warnings.push({
        key: `${key}[${i}]`,
        description: `Lowercase country codes are DEPRECATED. Use uppercase instead ('${c.toUpperCase()}')`,
      });
    }
  });
}

export function checks(data: Data): { errors: Issue[]; warnings: Issue[] } {
  const errors: Issue[] = [];
  const warnings: Issue[] = [];

  checkLogo(data.logo, "logo", errors);

  if (typeof data.monochromeLogo === "string" && data.monochromeLogo !== "") {
    warnings.push({
      key: "monochromeLogo",
      description:
        "This key is DEPRECATED and will be removed in the future. Use 'logo' instead",
    });
    checkLogo(data.monochromeLogo, "monochromeLogo", errors);
  }

  if (isObject(data.intendedAudience)) {
    lowercaseCountries(
      data.intendedAudience.countries,
      "intendedAudience.countries",
      warnings,
    );
    lowercaseCountries(
      data.intendedAudience.unsupportedCountries,
      "intendedAudience.unsupportedCountries",
      warnings,
    );
  }

  const legal = isObject(data.legal) ? data.legal : {};
  // Like the parser, only look at keys that decode to the expected type.
  if (typeof legal.authorsFile === "string") {
    warnings.push({ key: "legal.authorsFile", description: DEPRECATED_DROP });
    const err = pathError(legal.authorsFile, "legal.authorsFile");
    if (err) errors.push(err);
  }
  if (typeof legal.repoOwner === "string") {
    warnings.push({
      key: "legal.repoOwner",
      description:
        "This key is DEPRECATED and will be removed in the future. Use 'organisation.name' instead",
    });
  }

  if (Array.isArray(data.inputTypes)) {
    warnings.push({ key: "inputTypes", description: DEPRECATED_DROP });
  }
  if (Array.isArray(data.outputTypes)) {
    warnings.push({ key: "outputTypes", description: DEPRECATED_DROP });
  }

  const description = isObject(data.description) ? data.description : {};
  for (const [lang, desc] of Object.entries(description)) {
    if (!isObject(desc)) continue;
    const prefix = `description.${lang}`;

    if (typeof desc.genericName === "string" && desc.genericName.length > 0) {
      warnings.push({ key: `${prefix}.genericName`, description: DEPRECATED_DROP });
    }

    strings(desc.screenshots).forEach((s, i) => {
      const key = `${prefix}.screenshots[${i}]`;
      const err =
        pathError(s, key) ??
        extensionError(
          s,
          key,
          [".jpg", ".png"],
          (v) => `'${v}' is not an image: invalid file extension for: ${v}`,
        );
      if (err) errors.push(err);
    });

    strings(desc.videos).forEach((v, i) => {
      if (!OEMBED.some((re) => re.test(v))) {
        errors.push({
          key: `${prefix}.videos[${i}]`,
          description: `'${v}' is not a valid video URL supporting oEmbed: invalid oEmbed link: ${v}`,
        });
      }
    });
  }

  let it = isObject(data.IT) ? data.IT : undefined;
  if (data.it !== undefined) {
    warnings.push({
      key: "it",
      description:
        "Lowercase country codes are DEPRECATED and will be removed in the future. Use 'IT' instead",
    });
    if (isObject(data.it)) it = data.it;
  }
  if (data.IT !== undefined && data.it !== undefined) {
    errors.push({ key: "it", description: "'IT' key already present. Remove this key" });
    it = isObject(data.IT) ? data.IT : undefined;
  }

  if (it) {
    if (it.conforme !== undefined) {
      warnings.push({ key: "IT.conforme", description: DEPRECATED_DROP });
    }

    const codiceIPA = isObject(it.riuso) ? it.riuso.codiceIPA : undefined;
    if (typeof codiceIPA === "string" && isItalianIpaCode(codiceIPA)) {
      warnings.push({
        key: "IT.riuso.codiceIPA",
        description: `This key is DEPRECATED and will be removed in the future. Use 'organisation.uri' and set it to 'urn:x-italian-pa:${codiceIPA}' instead`,
      });
    }
  }

  return { errors, warnings };
}
