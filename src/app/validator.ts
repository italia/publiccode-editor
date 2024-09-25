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

export async function loadWasm() {
  try {
    const go = new (window as any).Go();

    if (go) {
      const { instance } = await WebAssembly.instantiateStreaming(
        fetch(path),
        go.importObject
      );
      go.run(instance);
      return window;
    }
  } catch (error) {
    console.error("Error: Go main returned, this should never happen.", error);
    return null;
  }
}

loadWasm()
  .catch((e) => console.error(`Failed to load Wasm: ${e}`))
  .then((res) => {
    console.log("loadWasm OK");
    return res;
  });

// await loadWasm();
//.catch((e) => console.error(`Failed to load Wasm: ${e}`));

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
    results: Array<Err & { type: string }> | null;
    version: number;
  } = JSON.parse(res);

  const warnings: Array<Err> = [];
  const errors: Array<Err> = [];

  if (results !== null)
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
