import favicons from "@peterek/vite-plugin-favicons";
import react from "@vitejs/plugin-react";
import type { UserConfig } from "vite";
import { defineConfig } from "vite";
import { execSync } from "node:child_process";
import pkg from "./package.json";

// Resolved at build time: from GITHUB_SHA in CI, from git locally. The Docker
// build has neither (.dockerignore excludes .git and the alpine image has no
// git), so it degrades to "unknown" instead of failing the build.
// Slicing the full SHA, rather than `git rev-parse --short`, is what guarantees
// exactly 7 characters: git widens the abbreviation as the repo grows.
function resolveCommitHash(): string {
  const fromCI = process.env.GITHUB_SHA;
  if (fromCI) return fromCI.slice(0, 7);

  try {
    return execSync("git rev-parse HEAD", {
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim()
      .slice(0, 7);
  } catch {
    return "unknown";
  }
}

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    plugins: [react(), favicons("public/assets/img/favicon-32x32.png")],
    // Inject just the package metadata the app needs, instead of letting the
    // bundler inline the whole package.json.
    define: {
      __APP_NAME__: JSON.stringify(pkg.name),
      __APP_VERSION__: JSON.stringify(pkg.version),
      __APP_COMMIT__: JSON.stringify(resolveCommitHash()),
    },
    server: {
      // Bind to all interfaces so the dev server is reachable through the
      // forwarded port when running inside a container/devcontainer.
      host: true,
      port: 3000,
    },
    build: {
      target: "esnext",
      // Lightning CSS (default minifier since Vite 8) rejects the pre-minified
      // CSS shipped by bootstrap-italia/design-react-kit (invalid pseudo-element
      // + selector sequences that esbuild tolerated).
      cssMinify: "esbuild",
      rolldownOptions: {
        external: ['wasm_exec.js'],
      }
    },
  } satisfies UserConfig;
});
