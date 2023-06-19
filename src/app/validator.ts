type Result = { isValid: true } | { isValid: false; errors: any };

declare function IsPublicCodeYmlValid(
  publiccode: string,
  branch: string
): Promise<string | null>;

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
  if (!IsPublicCodeYmlValid) throw Error("Validator not ready");

  // eslint-disable-next-line no-undef
  const res = await IsPublicCodeYmlValid(JSON.stringify(publiccode), branch);
  if (res === null) return { isValid: true };
  return { isValid: false, errors: JSON.parse(res) };
};
