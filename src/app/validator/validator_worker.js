import { validatorWasm } from "./validator_wasm";

onmessage = async () => {
  try {
    // eslint-disable-next-line no-undef
    importScripts("../../../validator-wasm/wasm_exec.js");
    const validator = await validatorWasm();
    postMessage(validator);
  } catch (e) {
    postMessage({ error: e.message });
  }
};