export const validatorWasm = (data, cb) => {
  const path = "validator-wasm/wasm_glue.wasm";
  // eslint-disable-next-line no-undef
  const go = new Go();
  // eslint-disable-next-line no-undef
  WebAssembly.instantiateStreaming(fetch(path), go.importObject).then((obj) => {
    go.run(obj.instance);
    console.log(data);
    // eslint-disable-next-line no-undef
    return cb(IsPublicCodeYmlValid(JSON.stringify(data)));
  });
};
