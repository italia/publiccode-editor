# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static React/TypeScript web app that helps users create and validate `publiccode.yml`
files (the metadata standard used by Italian public administration for open source
software, see https://github.com/publiccodeyml/publiccode.yml). Users fill out a form
(left panel) which generates YAML in real time (right panel), or they import an
existing `publiccode.yml` (file upload, URL, or GitLab repo URL) to validate/fix it.

## Commands

```sh
npm ci                  # install deps (also runs patch-package via _postinstall)
npm run build:licenses  # generate src/generated/licenses.json (required before first dev/build)
npm run build:wasm      # compile src/wasm/main.go to public/main.wasm (requires Go installed)
npm run dev             # vite dev server on :3000 (predev runs build:wasm automatically)
npm run build           # tsc -b && vite build (prebuild runs build:wasm + build:licenses)
npm run lint             # eslint .
npm run format           # prettier --write 'src/**/*.{ts,tsx,scss,css,json}'
npm run test             # jest --passWithNoTests
npm run preview          # vite preview of the production build
```

- Building/running requires **Go** (1.25.x) on PATH in addition to Node 24, because the
  `publiccode.yml` schema validator is a Go library compiled to WebAssembly
  (`src/wasm/main.go`, using `github.com/italia/publiccode-parser-go/v5`). If Go isn't
  available, `npm run dev`/`build` will fail at the `build:wasm` step.
- Tests are colocated `*.spec.ts` files next to the code they cover (mostly the pure
  helpers in `src/app/`: adapter, serializer, linter's `remove-empty`, `semver`,
  URL/YAML utils). There is no single-test-runner shortcut; use normal Jest CLI flags,
  e.g. `npx jest src/app/publiccode-adapter.spec.ts` or `npx jest -t "test name"`.
- Jest is configured inline in `package.json` (uses `@swc/jest` for ts/tsx transform;
  CSS/image imports and `worker-loader!` imports are mocked via `src/__mocks__/`).
- `src/generated/` (licenses.json, providers-oembed.json) is gitignored and produced by
  `scripts/genLicenseList.ts` / `scripts/getProvidersOembed.ts` — if these are missing,
  imports of them will fail; run the corresponding `build:*` script.
- Config comes from Vite env vars (`.env`, see `.env-example`), all read once and
  re-exported from `src/app/contents/constants.ts` — don't sprinkle `import.meta.env`
  through the app, add to that module. Notable ones: `VITE_DEFAULT_COUNTRY_SECTIONS`
  (`none`/`all`/`italy`), `VITE_DEFAULT_COUNTRY`, `VITE_FALLBACK_LANGUAGE` (default `en`),
  `VITE_VALIDATOR_URL`/`VITE_VALIDATOR_REMOTE_URL`, `VITE_REPOSITORY`, `VITE_ELASTIC_URL`.
- `patches/` holds a patch-package patch (js-yaml) applied automatically on install via
  the `_postinstall` script; the Go WASM side is a separate module wired through the
  root `go.work` (`use ./src/wasm`).

## Architecture

### Data flow

1. **Import** (optional) — user provides a `publiccode.yml` via file upload, a direct
   URL, or a GitLab repo URL. Handled by `src/app/importers/{file,standard,gitlab}.importer.ts`
   (GitLab import goes through `gitlab-url-adapter.ts` to turn a web URL into a GitLab
   API call and base64-decode the response), then parsed as YAML.
2. **Adapt** — `src/app/publiccode-adapter.ts` normalizes imported data into the shape
   the form/store expect: migrates deprecated fields (e.g. `riuso.codiceIPA` →
   `organisation.uri`), dedupes `usedBy`/screenshots/features, normalizes dates to
   ISO `YYYY-MM-DD`, and reshapes the `maintenance` block based on `maintenance.type`.
3. **Edit** — `src/app/components/Editor.tsx` plus the field-specific `Editor*.tsx`
   components (`EditorInput`, `EditorSelect`, `EditorMultiselect`, `EditorBoolean`,
   `EditorRadio`, `EditorDate`, `EditorAwards`, `EditorContacts`, `EditorContractors`,
   `EditorFeatures`, `EditorFundedBy`, `EditorScreenshots`, `EditorVideos`,
   `EditorUsedBy`, etc.) drive a React Hook Form bound to the publiccode schema
   defined in `src/app/contents/publiccode.ts`. Static option lists/enums live in
   `src/app/contents/` (`categories.ts`, `scopes.ts`, `platforms.ts`,
   `developmentStatus.ts`, `maintenanceTypes.ts`, `mime-types.ts`,
   `countrySpecificSection.ts`, etc.). `EditorVideos` resolves pasted video URLs
   through the oEmbed layer in `src/app/oembed/` (provider list built into
   `src/generated/providers-oembed.json`).
4. **Lint** — `src/app/linter/index.ts` (+ `remove-empty.ts`) cleans up the form data
   before serialization: filters invalid categories, sorts structured arrays, drops
   empty funding entries, handles the Italy-specific section
   (`conforme`/`piattaforme`/`riuso`), and strips empty fields recursively.
5. **Validate** — `src/app/validator.ts` loads the Go-built WASM module
   (`public/main.wasm` + `wasm_exec.js`) and calls the global `IsPublicCodeYmlValid`
   function it exposes, returning parsed errors/warnings to display in `WarningBox`.
6. **Preview/Export** — `src/app/components/YamlPreview.tsx` renders the live YAML
   output and supports copy/download; `UploadPanel.tsx` is the import-side UI.

### State management

Global state is a handful of small Zustand stores in `src/app/lib/store.ts`, several
persisted to localStorage via the `persist` middleware:
- `useYamlStore` — the current YAML string and whether it was imported (persisted).
- `useLanguagesStore` — active translation languages for multi-language fields.
- `useWarningStore` — current validation warnings (persisted).
- `useCountryStore` — which country-specific section(s) are shown (`none`/`all`/`italy`),
  synced to the `countrySpecific` query param.
- `useITCountrySpecific` — toggle for showing the Italy country-extension version (persisted).
- `useQueryParamsStore` — small helper for reading/writing URL query params.

### App shell

`src/app/App.tsx` is the root component: a resizable two-panel layout
(`react-resizable-panels`) with the `Editor` on the left and `WarningBox` +
`YamlPreview` on the right, collapsing to a stacked mobile layout
(`useIsMobile` in `src/app/lib/utils.ts`). `Head.tsx` holds top nav and opens
`SettingsPanel.tsx`. UI is built on Bootstrap Italia + Design React Kit (the Italian
public-sector design system) rather than a generic component library.

### i18n

`src/i18n/index.ts` configures i18next/react-i18next for 5 UI languages
(`it`, `en`, `fr`, `de`, `nl`) with detection order: querystring (`?lang=`) →
navigator → localStorage. Translation JSON lives in `src/i18n/locales/`.

### WASM validator boundary

`src/wasm/main.go` is a separate Go module (build-tagged `js && wasm`) that wraps
`publiccode-parser-go` and exposes one JS-callable function,
`IsPublicCodeYmlValid(yaml, branch, baseUrl)`, returning a Promise that resolves to
JSON containing the parsed publiccode object, parser errors/warnings, and detected
schema version. Treat `src/wasm/main.go` and `src/app/validator.ts` as the two halves
of one boundary — changes to the Go function's signature or return shape must be
mirrored in `validator.ts`'s JS-side typing/parsing.

## CI

`.github/workflows/test.yml` runs on every push/PR: `npm ci` → `npm run build` →
`npm run lint` → `npm run test`, on Node 24 + Go 1.25.0. `.github/workflows/deploy.yml`
builds and publishes `dist/` to GitHub Pages on push to `main`.
