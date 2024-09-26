import { defineConfig } from 'vite';
import type { UserConfig } from 'vite'
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import copy from 'rollup-plugin-copy';
import favicons from '@peterek/vite-plugin-favicons'

// Caricare le variabili d'ambiente
dotenv.config();

// https://vitejs.dev/config/
export default defineConfig(()=> {
  return {
    plugins: [
      react(),
      favicons('./src/assets/img/favicon-32x32.png'),
      copy({
        targets: [
          { src: 'src/generated/main.wasm', dest: 'dist' },
          { src: 'src/generated/wasm_exec.js', dest: 'dist' },
          { src: 'src/assets/img/favicon-32x32.png', dest: 'dist/assets/img' },
        ],
        hook: 'writeBundle',
      }),
    ],
    build: { target: 'esnext' }
  } satisfies UserConfig;
})
