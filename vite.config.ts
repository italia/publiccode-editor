import favicons from "@peterek/vite-plugin-favicons";
import react from "@vitejs/plugin-react";
import type { UserConfig } from "vite";
import { defineConfig } from "vite";
import pkg from "./package.json";

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    plugins: [react(), favicons("public/assets/img/favicon-32x32.png")],
    // Inject just the package metadata the app needs, instead of letting the
    // bundler inline the whole package.json.
    define: {
      __APP_NAME__: JSON.stringify(pkg.name),
      __APP_VERSION__: JSON.stringify(pkg.version),
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
