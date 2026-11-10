// The publiccode.yml version the editor creates files with and upgrades to.
// It depends on the validator: publiccode-parser-go (the default WASM
// validator) stops at 0.7.0 (PARSER_LATEST), while the Ajv validator of
// publiccode-schema already accepts 0.8.0 (LATEST_SUPPORTED).
//
// Set once at startup by lib/initSections.ts (imported first by main.tsx),
// from VITE_VALIDATOR; it stays PARSER_LATEST in the tests, which can't load
// contents/constants.ts (import.meta). Read it at runtime with latestVersion().
import { LATEST_SUPPORTED, PARSER_LATEST } from "publiccode-schema";

let latest: string = PARSER_LATEST;

export const latestVersion = () => latest;

export const setLatestVersionFor = (validator: string) => {
  latest = validator === "ajv" ? LATEST_SUPPORTED : PARSER_LATEST;
};
