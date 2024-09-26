import { defineConfig } from 'vite';
import type { UserConfig } from 'vite'
import react from '@vitejs/plugin-react';
import copy from 'rollup-plugin-copy';
import favicons from '@peterek/vite-plugin-favicons'

// https://vitejs.dev/config/
export default defineConfig(()=> {
  return {
    plugins: [
      react(),
      favicons('public/assets/img/favicon-32x32.png'),
      copy({
        targets: [
          { src: 'src/generated/main.wasm', dest: 'dist' },
          { src: 'src/generated/wasm_exec.js', dest: 'dist' },
        ],
        hook: 'writeBundle',
      }),
    ],
    build: { target: 'esnext' }
  } satisfies UserConfig;
})
