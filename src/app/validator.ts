import {
  deprecations,
  standardCountries,
} from "../vendor/publiccode-schema/src";
import { VALIDATOR } from "./contents/constants";
import type { Result } from "./validator/wasm";

interface ValidatorParams {
  publiccode: string;
  // The object `publiccode` was serialized from: the Ajv validator checks it
  // directly instead of parsing the YAML back.
  data?: unknown;
  branch?: string;
  baseURL?: string;
}

const parse = async (publiccode: string) => {
  const YAML = await import("yaml");
  return YAML.parse(publiccode) as unknown;
};

// Deprecations the parser doesn't report (the 0.8.0 ones, the Italian
// section in favour of `supports`), from publiccode-json-schema.
function addDeprecations(result: Result, data: unknown): Result {
  const extra = deprecations(data, { countries: standardCountries() })
    .filter((d) => !d.parser)
    .map((d) => ({
      key: d.key,
      description: `${d.message} (deprecated since publiccode.yml ${d.since})`,
      line: 0,
      column: 0,
    }));

  return { ...result, warnings: [...result.warnings, ...extra] };
}

// VITE_VALIDATOR picks the implementation: "wasm" (publiccode-parser-go
// compiled to WebAssembly, the default) or "ajv" (JSON Schema). Each one is
// loaded only when selected, so the Ajv build doesn't download main.wasm.
export const validator = async ({
  publiccode,
  data,
  branch,
  baseURL,
}: ValidatorParams): Promise<Result> => {
  if (VALIDATOR === "ajv") {
    const [{ validate }, input] = await Promise.all([
      import("./validator/ajv"),
      data === undefined ? parse(publiccode) : Promise.resolve(data),
    ]);

    return addDeprecations(validate(input) as Result, input);
  }

  const { validateWasm } = await import("./validator/wasm");
  const [result, input] = await Promise.all([
    validateWasm({ publiccode, branch, baseURL }),
    data === undefined ? parse(publiccode) : Promise.resolve(data),
  ]);

  return addDeprecations(result, input);
};
