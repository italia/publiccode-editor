import { defineConfig } from "vite";
import type { UserConfig } from "vite";
import react from "@vitejs/plugin-react";
import favicons from "@peterek/vite-plugin-favicons";

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    plugins: [react(), favicons("public/assets/img/favicon-32x32.png")],
    build: { target: "esnext" },
  } satisfies UserConfig;
});
