// Experimental country sections: sections of a country package of
// publiccode-json-schema that the standard doesn't define (e.g. `nld:`).
// publiccode-parser-go rejects them as unknown keys, so they can only be
// enabled with the Ajv validator (VITE_EXPERIMENTAL_SECTIONS, read in
// main.tsx); the IT section is standard and has its own UI.
import {
  countries,
  type CountryExtension,
  type CountrySection,
  type FormSchema,
  schemaVersionFor,
  sectionsFormSchema,
} from "publiccode-schema";

type JSONSchema = CountrySection["schema"];

let enabled: CountryExtension[] = [];
let booleanKeys = new Set<string>();

// The packages with experimental sections among `ids`; none unless the
// validator is Ajv, the only one that accepts them.
export function resolveExperimentalPackages(
  ids: string[],
  validator: string,
  available: CountryExtension[] = countries,
): CountryExtension[] {
  const wanted = ids.map((id) => id.trim().toLowerCase()).filter(Boolean);
  if (wanted.length === 0) return [];

  if (validator !== "ajv") {
    console.warn(
      "VITE_EXPERIMENTAL_SECTIONS needs VITE_VALIDATOR=ajv: the WASM validator rejects them",
    );
    return [];
  }

  return wanted.flatMap((id) => {
    const pkg = available.find((c) => c.id === id);
    if (!pkg?.sections?.some((s) => !s.standard)) {
      console.warn(`No country package with an experimental section: ${id}`);
      return [];
    }
    return [pkg];
  });
}

export const setExperimentalPackages = (packages: CountryExtension[]) => {
  enabled = packages;
  booleanKeys = new Set(booleanKeysOf(packages));
};

export const experimentalPackages = () => enabled;

// The keys of the enabled sections in publiccode.yml (e.g. "nld").
export const experimentalSectionKeys = () =>
  enabled.flatMap((c) =>
    (c.sections ?? []).filter((s) => !s.standard).map((s) => s.key),
  );

// The keys typed as booleans in the enabled sections, so that the Ajv
// validator doesn't stringify their values.
export const isExperimentalBooleanKey = (key: string) => booleanKeys.has(key);
// For the library's validate(): the boolean keys of the enabled sections.
export const experimentalBooleanKeys = () => [...booleanKeys];

function booleanKeysOf(packages: CountryExtension[]): string[] {
  const keys: string[] = [];
  const walk = (node: JSONSchema) => {
    const props = (node.properties ?? {}) as Record<string, JSONSchema>;
    for (const [key, child] of Object.entries(props)) {
      if (child.type === "boolean") keys.push(key);
      walk(child);
      if (typeof child.items === "object") walk(child.items as JSONSchema);
    }
  };
  for (const c of packages) {
    for (const s of c.sections ?? []) if (!s.standard) walk(s.schema);
  }

  return keys;
}

// The form of a package's experimental sections for a declared version.
export const sectionsForm = (
  pkg: CountryExtension,
  version: string,
): FormSchema => sectionsFormSchema(pkg, schemaVersionFor(version));
