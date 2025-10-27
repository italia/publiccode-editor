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
  branch: string,
  baseURL: string,
): Promise<string>;

const path = "main.wasm";

export async function loadWasm() {
  try {
    const go = new Go();

    if (go) {
      const { instance } = await WebAssembly.instantiateStreaming(
        fetch(path),
        go.importObject,
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

interface ValidatorParams {
  publiccode: string;
  branch?: string;
  baseURL?: string;
}

export const validator = async ({
  publiccode,
  branch = "main",
  baseURL = "",
}: ValidatorParams): Promise<Result> => {
  if (!IsPublicCodeYmlValid) throw new Error("Validator not ready");

  let url = "";
  try {
    url = new URL(baseURL).href;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_: unknown) {
    console.warn("invalid URL");
  }

  const res = await IsPublicCodeYmlValid(publiccode, branch, url);

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
