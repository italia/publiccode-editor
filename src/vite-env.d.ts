/// <reference types="vite/client" />

//https://vitejs.dev/guide/env-and-mode#intellisense-for-typescript

interface ImportMetaEnv {
    readonly VITE_REPOSITORY: string;
    readonly VITE_ELASTIC_URL: string;
    readonly VITE_VALIDATOR_URL: string;
    readonly VITE_VALIDATOR_REMOTE_URL: string;
    readonly VITE_DEFAULT_COUNTRY: string;
    readonly VITE_FALLBACK_LANGUAGE?: string;
    readonly VITE_DEFAULT_COUNTRY_SECTIONS?: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
