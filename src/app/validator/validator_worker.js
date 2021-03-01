import { validatorWasm } from "./validator_wasm";
// eslint-disable-next-line no-undef
importScripts("../../../validator-wasm/wasm_exec.js");

onmessage = async (e) => {
  try {
    validatorWasm(e.data, (validator) => {
      postMessage({validator});
    });
  } catch (e) {
    postMessage({ error: e.message });
  }
};
