# Releasing publiccode-editor

Releases are cut with [release-please](https://github.com/googleapis/release-please).
They are **started by hand**: nothing is released just because something was merged
into `main`.

Deployment is a separate concern: `.github/workflows/deploy.yml` publishes `main` to
GitHub Pages on **every** push, release or not. Cutting a release does not deploy
anything by itself, and deploying does not create a release.

## How a release happens

1. **Start it.** Actions → [`release`](../../actions/workflows/release.yml)
   → *Run workflow*. Leave `release-as` empty unless you need to force a specific
   version number.

   The bot opens (or updates) a pull request titled `chore: release X.Y.Z` on the
   `release-please--branches--main` branch, containing:

   - `package.json` and `package-lock.json` bumped to the new version;
   - `CHANGELOG.md` with a new section generated from the conventional commits;
   - `publiccode.yml` with `softwareVersion` and `releaseDate` updated.

2. **Label it, if the release adds support for a new publiccode.yml standard version.**
   Add the `publiccode-standard` label to the release PR *before* merging. See below.

3. **Review and merge it.** Editing the changelog by hand in the PR is fine; the bot
   will not overwrite it unless you run the workflow again.

   On merge, the workflow tags the merge commit `vX.Y.Z` and publishes a GitHub release
   with the changelog section as its notes.

## How the version number is chosen

From the [Conventional Commits](https://www.conventionalcommits.org/) in the messages
of the commits merged since the previous release:

| commit                             | bump  |
| ---------------------------------- | ----- |
| `fix: …`                           | patch |
| `feat: …`                          | minor |
| `feat!: …`, or a `BREAKING CHANGE` footer | major |

Other types (`chore:`, `build:`, `ci:`, `docs:`, `refactor:`, `style:`, `test:`) do not
trigger a release and are kept out of the changelog — which is what keeps the hundreds of
Dependabot `build(deps): …` commits from drowning it. A commit that does not follow the
convention is ignored altogether, so it will appear in neither the version bump nor the
changelog.

If the computed version is not the one you want, re-run the workflow with `release-as`
set (for example `3.0.0`); the existing release PR is updated in place.

## The `publiccode-standard` label

Some releases are notable because they add support for a **new version of the
publiccode.yml standard** — for instance
[`876c192e`](../../commit/876c192e) (`feat: support publiccode.yml v0.7.0`). Those get an
extra tag, so that it is possible to find the exact commit where a given version of the
standard became supported.

Adding the `publiccode-standard` label to the release PR before merging makes the
workflow, on merge:

- create an extra `publiccode-x.y.z` tag on the same commit as `vX.Y.Z`, where `x.y.z` is
  read from the `publiccodeYml.latestVersion` field of
  [`package.json`](package.json). A value that is not a plain `x.y.z` fails the job rather
  than producing a malformed tag;
- append a line to the notes of the `vX.Y.Z` GitHub release pointing at that tag.

The editor keeps its own copy of that version, `LATEST_VERSION` in
[`src/app/contents/publiccode.ts`](src/app/contents/publiccode.ts), so adding support for a
new version of the standard means updating both. They cannot silently drift:
[`src/app/contents/publiccode.spec.ts`](src/app/contents/publiccode.spec.ts) compares them
on every pull request.

There is **no** separate GitHub release for `publiccode-x.y.z`: it is a plain tag. If the
tag already exists the step does nothing, so re-running the job is harmless.

Without the label, none of this happens and the release is an ordinary one.

## First-time repository setup

Two one-off settings this workflow depends on:

- Settings → Actions → General → Workflow permissions →
  *Allow GitHub Actions to create and approve pull requests* must be enabled, otherwise
  release-please cannot open its pull request. Already enabled on
  `italia/publiccode-editor`.
- The `publiccode-standard` label must exist, otherwise it cannot be applied to a release
  PR:
  ```sh
  gh label create publiccode-standard \
    -d "Also tag this release as publiccode-x.y.z" -c 0E8A16
  ```

## Troubleshooting

**The release PR has no CI checks.** Expected. It is opened with `GITHUB_TOKEN`, and
GitHub does not start workflows for events raised by that token, so `test.yml` and
`publiccode-validation.yml` do not run on it. The checks do run on `main` right after the
merge. If `main` ever gets branch protection with required checks, the workflow will need
a PAT or GitHub App token instead.

**The PR was merged but no tag appeared.** The merged PR keeps the `autorelease: pending`
label until it is finalised. Re-run the `release` job from the Actions UI; it is
idempotent.

**Nothing to release.** If no `feat:` or `fix:` commit was merged since the last release,
release-please will not open a PR. Use `release-as` if you need a release anyway.
