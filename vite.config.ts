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
      rollupOptions: {
        external: ['wasm_exec.js'],
      }
    },
  } satisfies UserConfig;
});
