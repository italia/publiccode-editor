import favicons from "@peterek/vite-plugin-favicons";
import react from "@vitejs/plugin-react";
import type { UserConfig } from "vite";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    plugins: [react(), favicons("public/assets/img/favicon-32x32.png")],
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
