#!/usr/bin/env bash
#
# Merge the latest upstream publiccode-editor (italia/publiccode-editor, branch main)
# into a new sync branch based on cd-bund, resolving the recurring fork conflicts
# automatically. Nothing is pushed: review, build and push the result yourself.
#
# Usage: ./scripts/sync-upstream.sh
#
# See "Syncing with upstream (publiccode-editor)" in README.md.

set -euo pipefail

UPSTREAM_URL="https://github.com/italia/publiccode-editor.git"
UPSTREAM_BRANCH="main"
FORK_BRANCH="cd-bund"

# Files owned by the fork: the cd-bund version always wins (files deleted on
# cd-bund stay deleted). Upstream changes to these files are reported so they
# can be ported by hand if relevant.
KEEP_OURS=(
  "publiccode.yml"
  "CODEOWNERS"
  ".github/workflows/deploy.yml"
)

die() { echo "error: $*" >&2; exit 1; }
info() { echo "==> $*"; }

command -v node >/dev/null || die "node is required"
command -v npm >/dev/null || die "npm is required"

cd "$(git rev-parse --show-toplevel)"

# --- Preconditions ----------------------------------------------------------

[[ -z "$(git status --porcelain)" ]] || die "working tree is not clean"
[[ "$(git branch --show-current)" == "$FORK_BRANCH" ]] || die "check out $FORK_BRANCH first"

info "Fetching origin/$FORK_BRANCH"
git fetch --quiet origin "$FORK_BRANCH"
[[ "$(git rev-parse HEAD)" == "$(git rev-parse "origin/$FORK_BRANCH")" ]] \
  || die "local $FORK_BRANCH differs from origin/$FORK_BRANCH, pull or push first"

if ! git remote get-url upstream >/dev/null 2>&1; then
  info "Adding remote 'upstream' -> $UPSTREAM_URL"
  git remote add upstream "$UPSTREAM_URL"
fi
info "Fetching upstream/$UPSTREAM_BRANCH"
git fetch --quiet --no-tags upstream "$UPSTREAM_BRANCH"

UP="upstream/$UPSTREAM_BRANCH"
UP_SHORT="$(git rev-parse --short "$UP")"
COUNT="$(git rev-list --count "HEAD..$UP")"
if [[ "$COUNT" -eq 0 ]]; then
  info "$FORK_BRANCH already contains $UP ($UP_SHORT), nothing to do"
  exit 0
fi
BASE="$(git merge-base HEAD "$UP")"

SYNC_BRANCH="sync/upstream-$(date +%Y-%m-%d)-$UP_SHORT"
git show-ref --quiet "refs/heads/$SYNC_BRANCH" && die "branch $SYNC_BRANCH already exists"

info "Merging $COUNT upstream commits ($UP_SHORT) into new branch $SYNC_BRANCH"
git switch --quiet -c "$SYNC_BRANCH"

git merge --no-ff --no-commit "$UP" >/dev/null 2>&1 || true
git rev-parse -q --verify MERGE_HEAD >/dev/null || die "merge could not be started, see 'git status'"

# "chore:" so release-please neither bumps the version nor adds a changelog entry.
printf 'chore: merge upstream publiccode-editor %s\n\nMerge %s commits from italia/publiccode-editor %s (%s).\n' \
  "$UP_SHORT" "$COUNT" "$UPSTREAM_BRANCH" "$(git rev-parse "$UP")" \
  > "$(git rev-parse --git-path MERGE_MSG)"

# --- Fork-owned files: keep ours ------------------------------------------

for f in "${KEEP_OURS[@]}"; do
  if git cat-file -e "HEAD:$f" 2>/dev/null; then
    git checkout HEAD -- "$f"
  else
    git rm -q -f --ignore-unmatch -- "$f"
  fi
done
REVIEW="$(git diff --name-only "$BASE" "$UP" -- "${KEEP_OURS[@]}")"

# --- package.json: field-level three-way merge --------------------------------
# Upstream wins for fields the fork did not touch, the fork wins for fields it
# changed (repository, scripts it added, bootstrap-switzerland instead of
# bootstrap-italia, ...). "version" always follows upstream. Key order follows
# cd-bund; keys new upstream are appended, dependency maps are sorted like npm does.

PKG_CONFLICTS="$(
  node - "$BASE" "$UP" <<'EOF'
const { execFileSync } = require('child_process')
const fs = require('fs')
const [base, up] = process.argv.slice(2)
const show = (rev) => JSON.parse(execFileSync('git', ['show', `${rev}:package.json`], { encoding: 'utf8' }))
const b = show(base), o = show('HEAD'), t = show(up)
const same = (x, y) => JSON.stringify(x) === JSON.stringify(y)
const isObj = (x) => x && typeof x === 'object' && !Array.isArray(x)
const DEPS = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']
const conflicts = []
function merge(b, o, t, path) {
  if (same(o, b)) return t
  if (same(t, b) || same(o, t)) return o
  if (isObj(b) && isObj(o) && isObj(t)) {
    let keys = [...new Set([...Object.keys(o), ...Object.keys(t)])]
    if (path.length === 1 && DEPS.includes(path[0])) keys = keys.sort()
    const out = {}
    for (const k of keys) {
      const v = merge(b[k], o[k], t[k], [...path, k])
      if (v !== undefined) out[k] = v
    }
    return out
  }
  if (same(path, ['version'])) return t
  conflicts.push(path.join('.'))
  return o
}
const merged = merge(b, o, t, [])
fs.writeFileSync('package.json', JSON.stringify(merged, null, 2) + '\n')
process.stdout.write(conflicts.join('\n'))
EOF
)"
git add package.json

# --- package-lock.json: upstream lockfile with the fork's package name -------
# Exits non-zero if the fork's dependencies differ from upstream (they do as long
# as bootstrap-switzerland replaces bootstrap-italia); then npm updates the lockfile.
# This needs network access and re-resolves bootstrap-switzerland#gh-pages to its
# latest commit.

git checkout "$UP" -- package-lock.json
if ! node - "$UP" <<'EOF'
const { execFileSync } = require('child_process')
const fs = require('fs')
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'))
const lock = JSON.parse(fs.readFileSync('package-lock.json', 'utf8'))
lock.name = lock.packages[''].name = pkg.name
lock.version = lock.packages[''].version = pkg.version
fs.writeFileSync('package-lock.json', JSON.stringify(lock, null, 2) + '\n')
const up = JSON.parse(execFileSync('git', ['show', `${process.argv[2]}:package.json`], { encoding: 'utf8' }))
const keys = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']
process.exit(keys.every((k) => JSON.stringify(up[k]) === JSON.stringify(pkg[k])) ? 0 : 1)
EOF
then
  info "Dependencies differ from upstream, updating package-lock.json with npm"
  npm install --package-lock-only --ignore-scripts --no-audit --no-fund >/dev/null
fi
git add package-lock.json

# --- Result -------------------------------------------------------------------

echo
if [[ -n "$REVIEW" ]]; then
  echo "Upstream changed these fork-owned files; the $FORK_BRANCH version was kept."
  echo "Check whether anything needs to be ported:"
  BASE_SHORT="$(git rev-parse --short "$BASE")"
  while read -r f; do echo "  git diff $BASE_SHORT $UP_SHORT -- $f"; done <<<"$REVIEW"
  echo
fi
if [[ -n "$PKG_CONFLICTS" ]]; then
  echo "package.json: both sides changed these fields, the $FORK_BRANCH value was kept:"
  sed 's/^/  /' <<<"$PKG_CONFLICTS"
  echo
fi

UNMERGED="$(git diff --name-only --diff-filter=U)"
if [[ -n "$UNMERGED" ]]; then
  echo "These files still have conflicts and need to be resolved by hand:"
  sed 's/^/  /' <<<"$UNMERGED"
  echo
  echo "Resolve them, 'git add' them, then run: git commit --no-edit"
  echo "(To abandon the sync: git merge --abort && git switch $FORK_BRANCH && git branch -D $SYNC_BRANCH)"
  exit 1
fi

git commit --quiet --no-edit
info "Merge committed on $SYNC_BRANCH"
cat <<EOF

Next steps (see README.md, "Syncing with upstream"):
  1. Build and check the result (needs Go, see "Setup"):
       npm ci && npm run build && npm run lint && npm test && npm run dev
  2. Publish it (this deploys the editor to gh-pages):
       git switch $FORK_BRANCH && git merge --ff-only $SYNC_BRANCH && git push origin $FORK_BRANCH
       git branch -d $SYNC_BRANCH
  3. Optionally update the upstream mirror branch:
       git push origin $UP:main
EOF
