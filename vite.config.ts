import { defineConfig } from 'vite';
import type { UserConfig } from 'vite'
import react from '@vitejs/plugin-react';
// import path from 'path';
import dotenv from 'dotenv';
import copy from 'rollup-plugin-copy';
// import htmlConfig from 'vite-plugin-html-config'
import {createHtmlPlugin} from 'vite-plugin-html'
import favicons from '@peterek/vite-plugin-favicons'

const minifyConfig = {
  collapseWhitespace: true,
  minifyCSS: true,
  minifyJS: true,
  removeComments: true,
  useShortDoctype: true,
};

// Caricare le variabili d'ambiente
dotenv.config();

// https://vitejs.dev/config/
export default defineConfig(({mode})=> {
  const isProduction = mode === 'production';

  return {
    plugins: [
      react(),
      createHtmlPlugin({
        minify: isProduction ? minifyConfig : false,
        inject: {
          data: {
            // Passare variabili d'ambiente nell'HTML (dovrebbero essere rimosse, non vengono usate in html)
            REPOSITORY: process.env.VITE_REPOSITORY, //0Ref, formerly imported via process.env in constants.ts but never used
            ELASTIC_URL: process.env.VITE_ELASTIC_URL, //0Ref, deploy.yml,formerly imported via process.env in constants.ts
            VALIDATOR_URL: process.env.VITE_VALIDATOR_URL, //0Ref, deploy.yml, formerly imported via process.env in constants.ts
            VALIDATOR_REMOTE_URL: process.env.VITE_VALIDATOR_REMOTE_URL, //0Ref, deploy.yml, formerly imported via process.env in constants.ts but never used
            FALLBACK_LANGUAGE: process.env.VITE_FALLBACK_LANGUAGE, //2Ref
            DEFAULT_COUNTRY_SECTIONS: process.env.VITE_DEFAULT_COUNTRY_SECTIONS, //1Ref, release.yml,
          },
        },
        template: 'index.html', // Come in Webpack
      }),
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
    build: { target: 'esnext'}
  } satisfies UserConfig;
})
