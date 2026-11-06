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
    const [{ validate }, YAML] = await Promise.all([
      import("./validator/ajv"),
      data === undefined ? import("yaml") : Promise.resolve(undefined),
    ]);

    return validate(data ?? YAML?.parse(publiccode)) as Result;
  }

  const { validateWasm } = await import("./validator/wasm");

  return validateWasm({ publiccode, branch, baseURL });
};
