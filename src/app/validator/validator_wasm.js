export const validatorWasm = (e, cb) => {
  const {data, defaultBranch} = e;
  const path = "validator-wasm/wasm_glue.wasm";
  // eslint-disable-next-line no-undef
  const go = new Go();
  // eslint-disable-next-line no-undef
  WebAssembly.instantiateStreaming(fetch(path), go.importObject).then((obj) => {
    go.run(obj.instance);
    // eslint-disable-next-line no-undef
    IsPublicCodeYmlValid(data, defaultBranch).then((d) => {
      cb(d);
    }).catch((error) => {
      console.error(error);
    })
  });
};
