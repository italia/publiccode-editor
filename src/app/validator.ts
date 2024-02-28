import PublicCode from "./contents/publiccode";

type Err = {
  column: number;
  description: string;
  key: string;
  line: number;
};

type Result = {
  publicCode: Partial<PublicCode>;
  warnings: Array<Err>;
  errors: Array<Err>;
  version: number;
};

declare function IsPublicCodeYmlValid(
  publiccode: string,
  branch: string
): Promise<string>;

const path = "main.wasm";

const loadWasm = async () => {
  const go = new Go();
  const { instance } = await WebAssembly.instantiateStreaming(
    fetch(path),
    go.importObject
  );
  await go.run(instance);
  console.error("Error: Go main returned, this should never happen.");
};

loadWasm().catch((e) => console.error(`Failed to load Wasm: ${e}`));

export const validator = async (
  publiccode: string,
  branch: string
): Promise<Result> => {
  if (!IsPublicCodeYmlValid) throw new Error("Validator not ready");

  const res = await IsPublicCodeYmlValid(publiccode, branch);

  const {
    publicCode,
    results,
    version,
  }: {
    publicCode: Partial<PublicCode>;
    results: Array<Err & { type: string }>;
    version: number;
  } = JSON.parse(res);

  const warnings: Array<Err> = [];
  const errors: Array<Err> = [];

  for (const { type, ...rest } of results) {
    if (type === "error") {
      errors.push(rest);
    } else {
      warnings.push(rest);
    }
  }

  return {
    publicCode,
    warnings,
    errors,
    version,
  };
};
