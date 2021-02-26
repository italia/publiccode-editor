import { validatorWasm } from "./validator_wasm";

onmessage = async (e) => {
  try {
    // eslint-disable-next-line no-undef
    importScripts("../../../validator-wasm/wasm_exec.js");
    validatorWasm(e.data, (validator) => {
      postMessage({validator});
    });
  } catch (e) {
    postMessage({ error: e.message });
  }
};
