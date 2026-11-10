// Compiles the publiccode-parser-go validator (src/wasm/main.go) to
// public/main.wasm, with the matching wasm_exec.js from the Go installation.
//
// Usage:
//   tsx scripts/buildWasm.ts                      always build
//   tsx scripts/buildWasm.ts --if-needed <mode>   only if VITE_VALIDATOR is
//                                                 "wasm" (the default) in that
//                                                 Vite mode: the Ajv validator
//                                                 doesn't need Go nor main.wasm
import { execFileSync } from "child_process";
import { chmodSync, copyFileSync, rmSync } from "fs";
import { join } from "path";
import { loadEnv } from "vite";

const args = process.argv.slice(2);

if (args[0] === "--if-needed") {
  // The same resolution as Vite: process.env, then .env.[mode].local,
  // .env.[mode], .env.local, .env.
  const mode = args[1] ?? "development";
  const { VITE_VALIDATOR = "wasm" } = loadEnv(mode, process.cwd(), "VITE_");

  if (VITE_VALIDATOR === "ajv") {
    console.log("VITE_VALIDATOR=ajv: skipping the WASM build");
    process.exit(0);
  }
}

const goroot = execFileSync("go", ["env", "GOROOT"], {
  encoding: "utf8",
}).trim();
// The Go toolchain's files are read-only, and copyFileSync keeps the mode:
// replace the old copy and make the new one writable.
rmSync("public/wasm_exec.js", { force: true });
copyFileSync(join(goroot, "lib/wasm/wasm_exec.js"), "public/wasm_exec.js");
chmodSync("public/wasm_exec.js", 0o644);

execFileSync("go", ["build", "-o", "public/main.wasm", "src/wasm/main.go"], {
  stdio: "inherit",
  env: { ...process.env, GOOS: "js", GOARCH: "wasm" },
});
console.log("Built public/main.wasm");
