# Upstream contributions plan

Goal: shrink the Swiss fork (`cd-bund`) so that it consists of configuration, data and
Swiss-only files, instead of edits scattered across upstream files. Every rebase onto
[italia/publiccode-editor](https://github.com/italia/publiccode-editor) should then be
conflict-free.

Status at the time of writing (2026-11-24, after rebasing onto upstream 2.2.0):
the Swiss diff is 44 files, +11,415 / −207 lines. ~10,800 lines are organisation data;
the rest are ~25 edits to upstream files — those are what cause rebase conflicts.

## How to contribute (workflow)

`swiss/publiccode-editor` is a GitHub fork of `italia/publiccode-editor`, so PRs can be
opened directly from a branch in our repository.

- `main` is a pure mirror of `italia/main`. **Never commit to `main`.**
- Each contribution gets its own branch **from `main`** (not from `cd-bund`), one topic per PR.

```sh
git switch main && git pull                 # after "Sync fork" on GitHub
git switch -c feat/<topic>
# implement — generic, no Swiss references, Italian defaults unchanged
npm run lint && npm test && npm run build
git commit -m "feat: <description>"        # Conventional Commits (release-please)
git push -u origin feat/<topic>
```

Open the PR with base `italia/publiccode-editor:main`, compare `swiss/publiccode-editor:feat/<topic>`.
The PR title must be a Conventional Commit (`feat:` / `fix:`) — upstream's release-please
derives version and changelog from it. Keep "Allow edits by maintainers" enabled.

- Need it in production before upstream merges? `git cherry-pick` the commit onto `cd-bund`.
- After the merge: sync `main`, rebase `cd-bund`, remove the Swiss edits the feature replaces
  (see "Swiss cleanup" per item), delete the PR branch.

## Phase 1 — small, uncontroversial PRs

### 1.1 Configurable repository link and sample YAML URL

- **Branch / PR title:** `feat/configurable-repository-url` — `feat: make repository link and sample YAML URL configurable`
- **Upstream change:**
  - `Head.tsx`: "Source code" link uses `REPOSITORY` from `constants.ts` instead of the
    hardcoded `https://github.com/italia/publiccode-editor`. `VITE_REPOSITORY` is already
    declared in `vite-env.d.ts` and `.env-example` but currently unused.
  - New `VITE_SAMPLE_YAML_URL` (default: current italia URL), used by `UploadPanel.tsx` / `UploadModal.tsx`.
  - Document both in `.env-example` and `AGENTS.md`.
- **Swiss cleanup:** revert the URL edits in `Head.tsx` and `constants.ts`; set the values in
  `deploy.yml`. Fix the sample URL while at it (currently points to branch `master`, which does not exist).

### 1.2 Configurable base path

- **Branch / PR title:** `feat/configurable-base-path` — `feat: make the vite base path configurable`
- **Upstream change:** `vite.config.ts` reads `VITE_BASE` (default `/`, i.e. unchanged).
- **Swiss cleanup:** remove `base: ""` from `vite.config.ts`; set `VITE_BASE` in `deploy.yml`.

### 1.3 Italian defaults only when the Italian section is active

- **Branch / PR title:** `fix/italy-defaults-only-when-enabled` — `fix: only prefill it section when the italy country section is enabled`
- **Upstream change:** `defaultValues.it` in `Editor.tsx` and `publicCodeDummyObjectFactory`
  in `publiccode.ts` use `defaultItaly` only if `italy` is among the active country sections;
  otherwise `undefined`. Add a test.
- **Swiss cleanup:** drop the `it: undefined` edits (commit "feat: set italian country extension default to undefined").

### 1.4 Grouped options in `EditorSelect`

- **Branch / PR title:** `feat/editor-select-groups` — `feat: support grouped options in EditorSelect`
- **Upstream change:** optional `group` on `data` items, passed as `groupBy` to the widget;
  render the "(unset)" entry via `renderListItem` so it is not used as filter text.
- **Swiss cleanup:** drop the `EditorSelect.tsx` edits.

## Phase 2 — larger features

### 2.1 Pluggable organisation list

- **Branch / PR title:** `feat/organisation-list` — `feat: optional organisation list for organisation.uri`
- **Upstream change:**
  - New `VITE_ORGANISATIONS_URL` (URL or static file in `public/`). If set, `organisation.uri`
    becomes a grouped, searchable select and `organisation.name` is filled automatically.
    If unset, the current free-text inputs remain (no change for Italy).
  - Documented format (JSON Schema), equal to today's `organisations.json`:
    ```json
    [{ "name": {"de": "…", "fr": "…"}, "abbreviation": {"de": "…"},
       "organisations": [{ "id": "https://…", "name": {"de": "…"}, "alternativeName": {"de": "…"} }] }]
    ```
  - Move `getLocalizedText` (`src/i18n/index.ts`) and the `organisation.uri` i18n labels upstream.
  - Linter: emit `organisation` as `{ uri, name }`.
  - Depends on 1.4 (grouped select).
  - Pitch for Italy: usable with an IPA-based list of public administrations.
- **Swiss cleanup:** remove organisation logic from `Editor.tsx`, `linter/index.ts`, `i18n/*`;
  keep only the data and its generator (see Phase 3), serve the JSON from `public/`,
  set `VITE_ORGANISATIONS_URL` in `deploy.yml`.

### 2.2 Theming hook

- **Branch / PR title:** `feat/theming` — `feat: theme via CSS custom properties and optional theme stylesheet`
- **Upstream change:**
  1. Replace hardcoded colours and fonts in `main.css` (`#06c`, `#5a768a`, `#17324d`,
     Titillium Web, …) with CSS custom properties (e.g. `--pce-color-primary`) whose
     defaults are today's Italian values — no visual change upstream.
  2. New `VITE_THEME_CSS`: optional stylesheet loaded after `main.css`; also replaces the
     hardcoded `bootstrap-italia` CSS import in `App.tsx`.
  3. Optional: `VITE_FAVICON` (instead of the fixed path in `vite.config.ts`).
  - Could be split into two PRs (CSS variables first, hook second).
- **Swiss cleanup:**
  - Revert the Swiss edits to `main.css`, `App.tsx` and the favicon; move the Swiss values
    to `swiss/theme.css`.
  - Move purely visual component edits into the theme CSS and revert them:
    `color="primary"` → `secondary outline` and `mb-2` in `EditorAwards`, `EditorContacts`,
    `EditorContractors`, `EditorDate`, `EditorFeatures`, `EditorFundedBy`, `EditorInput`,
    `EditorScreenshots`, `EditorUsedBy`, `EditorVideos`, `EditorToolbar`, `UploadPanel`,
    `ResetFormConfirm`, `SettingsPanel`.
  - Verify with before/after screenshots (e.g. Playwright snapshot of the form).

### 2.3 Optional title bar in the header (try upstream, else keep as Swiss patch)

- **Branch / PR title:** `feat/header-title-bar` — `feat: optional title bar below the slim header`
- **Upstream change:** config switch rendering the title in a separate light header row
  (current Swiss layout) instead of in the slim header.
- **Swiss cleanup:** revert `Head.tsx` edits. If upstream declines, keep `Head.tsx` as a
  single, clearly marked Swiss commit.

## Phase 3 — shrink the Swiss repository

Done incrementally after each upstream merge.

- Move Swiss-only files into `swiss/`: `theme.css`, `organisations/` (data + LINDAS generator,
  currently `src/app/data/`), favicon.
- Delete dead code: the organisation entry in `src/app/contents/fields/generic.ts`
  (`data.ts` is never imported).
- Fix leftovers in `deploy.yml`: `DEFAULT_COUNTRY_SECTION: switzerland` is ignored
  (the code reads `VITE_DEFAULT_COUNTRY_SECTIONS`) — remove it.
- Stop regenerating organisations on every `npm ci`: replace `postinstall: build:organisations`
  with an explicit script or a scheduled workflow that opens a PR with updated data.
- Add a "Syncing with upstream" section to the README.

**Target end state** — the only Swiss differences:

| Kind | Files |
|---|---|
| Swiss-only files | `swiss/` (theme, organisation data + generator, favicon), `publiccode.yml`, `CODEOWNERS` |
| Small edits | `package.json` (`bootstrap-switzerland`, `gdeploy`), `.github/workflows/deploy.yml` (env config), `README.md` |

## Phase 4 (optional) — overlay instead of fork

Once the Swiss diff contains only Swiss-only files, CI could check out a pinned upstream release
tag, copy `swiss/` and the env config on top, build and deploy — no rebasing at all.

## Tracking

| # | Contribution | Branch | Upstream PR | Merged | Swiss cleanup done |
|---|---|---|---|---|---|
| 1.1 | Repository link / sample YAML URL | `feat/configurable-repository-url` | | | |
| 1.2 | Base path | `feat/configurable-base-path` | | | |
| 1.3 | Italian defaults only when enabled | `fix/italy-defaults-only-when-enabled` | | | |
| 1.4 | Grouped `EditorSelect` | `feat/editor-select-groups` | | | |
| 2.1 | Organisation list | `feat/organisation-list` | | | |
| 2.2 | Theming hook | `feat/theming` | | | |
| 2.3 | Header title bar | `feat/header-title-bar` | | | |
