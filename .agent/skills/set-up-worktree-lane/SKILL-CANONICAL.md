---
name: set-up-worktree-lane
classification: active
description: >-
  Create and verify a lane worktree: the branch cut explicitly from origin/<base>,
  the inherited commit identity verified with no worktree-scoped override, deps,
  the pinned shellcheck and the end-to-end gate's browser installed, .env.local carried, a draft PR at first push; in a detected ChatGPT
  Work cloud host, static branch/base checks only with execution routed to
  draft-PR CI. Use for a new lane or a misbehaving worktree (commits attributed
  to nobody, missing env, hook failures). Not for switching branches in place,
  changing session residency alone, or disposing of a worktree. Wrong looks
  like: EnterWorktree fresh mode basing the branch on the principal's
  coordination HEAD so the lane PR ships foreign commits; a worktree-scoped
  identity override that outlives the next correction.
---

# Set Up a Worktree Lane

**Governance**: the procedure that composes three rules at the one moment they all
apply — [`worktree-residency`](../../rules/worktree-residency.md) (where you work and
how residency is established), [`worktree-hygiene`](../../rules/worktree-hygiene.md)
(lane lifecycle, the first-push draft PR, dispositions), and the estate's
committer identity rule (who commits, and under whose authority), here
[`bot-identity-on-third-party-systems`](../../rules/bot-identity-on-third-party-systems.md). Those rules own the doctrine and the
reasoning; this skill owns the ordered steps and the verification, because every
defect below was found in a worktree that satisfied each rule read separately.

## Use When

- Taking up a lane that needs its own checkout (the normal case — new branch work
  never starts on the principal).
- A worktree is behaving oddly: commits attributed to no GitHub user, a gate failing
  for reasons unrelated to the change, a build that cannot find its environment.
- Auditing an inherited worktree before trusting it.

Not for: switching branches in place; the session-level residency switch on its own
(`EnterWorktree` — step 4 here); disposing of a finished worktree (that is
`worktree-hygiene` §6).

## The procedure

### 0. Classify the host before setup

Use the tri-state classification in
[`cloud-environment-routing.md`](../../directives/cloud-environment-routing.md).
If it selects ChatGPT Work, keep that profile for the whole session. It replaces
the identity and buildability work in steps 2 and 3: read the transport
credential (`gh auth status`; the credential helper or SSH key for `git push`)
so the name a remote write will display is known — not `git config user.email`,
which names only the author — but do not mint or rewrite bot credentials; do not install or run pnpm, Corepack, builds, tests or local
gates. Use the configured default credential and the
`HUSKY=0`/draft-PR/CI route in step 6. Detector error is a stop; a genuine
not-Work result does not by itself identify Claude cloud.

### 1. Cut the branch with an explicit start point

```bash
git fetch origin
git worktree add .claude/worktrees/<lane> -b <branch> origin/<base>
```

`<path>` below is that nested directory, `.claude/worktrees/<lane>` (owner ruling
2026-09-30): git ignores its contents, every root check tool ignores it, and entering
it never prompts.

`<base>` is the repository's default branch (refreshed with `git remote set-head origin --auto`, then
read with `git symbolic-ref --short refs/remotes/origin/HEAD` and the `origin/` prefix
stripped, or `gh repo view <owner>/<name> --json defaultBranchRef --jq .defaultBranchRef.name`
with the repository named — derived at the moment of use, never a literal;
`downstream-checkout-never-writes-upstream-surfaces`
verifies both reads), because the default branch is identity held below the tree.
For a build-ahead lane it is the parent branch the worktree is cut from
([`worktree-hygiene`](../../rules/worktree-hygiene.md) §1), so the worktree carries the
parent's changes; its draft PR opens against the default branch at first push, the diff
carrying the parent's commits until the parent lands, and is never based on the parent;
once the parent has landed, bring the child onto the default branch before any check against
it — by a merge when the parent landed by merge commit, by a re-cut with the child's own
commits cherry-picked across when it landed by squash (its commits are not ancestors then).
The explicit `origin/<base>` is load-bearing. `EnterWorktree`'s fresh mode documents
branching from the remote's default branch but, with `worktree.baseRef` set to `"head"`
in any settings layer, bases the branch on the **principal's checked-out HEAD** — a
coordination-branch tip on this estate — so the lane PR ships coordination commits
riding under the story. That cost a close-and-recreate cycle once already
(PR #673 → #674).

### 2. Verify the commit identity — inherited, never re-set here

This step applies to standard and separately provisioned profiles only. In a
detected ChatGPT Work cloud session, step 0 replaces it completely.

The identity lives once in the clone's shared local config and every worktree
inherits it. The estate's committer identity rule sets who is author and who
is committer, on the owner's word in each estate (OCE, 2026-08-04: "we need
to tell Vercel on whose authority this work was done"; "keep the bot identity
locally shared, not in version control": the team bot the clone's merge-bot
config names is the committer and the push transport, and the human on whose
authority the work is done is the author, passed per commit; jimcresswell.net,
2026-09-17: "Owner identity, as now": the owner as author and committer from
the clone's shared identity, the acting agent named in the commit's
`Co-Authored-By` trailer, bot credentials for third-party writes only). The
mechanics are that rule's; this skill holds no value of an identity. A new
worktree therefore needs no identity step at all — only a check that what it
inherited matches the primary:

```bash
PRIMARY="$(git worktree list --porcelain | head -1 | sed 's/^worktree //')"
ok=1
for key in user.name user.email; do
  want="$(git -C "$PRIMARY" config "$key")"
  if [ -n "$want" ] && [ "$(git -C <path> config "$key")" = "$want" ]; then
    echo "$key inherited: $want"
  else
    echo "$key: not inherited from the primary"; ok=0
  fi
done
[ "$ok" = 1 ]
```

Both keys must report inherited (the check exits non-zero otherwise), and both
values must be the identity the estate's committer identity rule names. The
check proves inheritance, not correctness: a worktree inherits the primary's
error too (the app-id address of 2026-08-04 would pass on both sides), so where
that rule derives the value, run its derivation (for a bot committer, the
merge-bot config and the API; for the owner's own identity, the address the
estate's security directive records and the name on the owner's GitHub
profile) and compare it with `want`. If either differs, is absent, or names
another identity, fix the SHARED config once, as that rule directs. Never
patch this worktree: a `--worktree` override is a second copy that outlives
the next correction and reintroduces the exact drift this step exists to catch.

### 3. Make the worktree buildable

This step applies to execution-capable profiles only. In a detected ChatGPT
Work cloud session, step 0 forbids it; missing dependencies or build output do
not trigger provisioning.

```bash
pnpm --dir <path> install
pnpm --dir <path> build
pnpm --dir <path> --filter <app> exec playwright install chromium-headless-shell
<path>/.agent/setup/install-shellcheck.sh
```

After the install, confirm the hooks exist: `ls <path>/.husky/_` (this repository's
`core.hooksPath` is `.husky/_`, created only by husky's `prepare` script, per worktree). A
worktree whose install failed part-way has no hooks and commits and pushes ungated in silence;
run `pnpm --dir <path> prepare` before the first commit if the directory is missing
(2026-09-27).

The three pnpm lines are scoped to the worktree with `--dir`, and the installer by its path (it
installs beside itself), because this step runs before entry, from the
principal: an unscoped `pnpm install` there rebuilds the principal and leaves the new
worktree without its dependencies or `dist/`. All four, before any gate, work or entry:
`type-check` and `vitest` pass on install alone, and the install's bootstrap builds
every package agent-tools reaches that has built entry points, the internal ESLint plugin
among them, so a lint config loads; the build line writes what install leaves unbuilt and a
gate reads (generated route types a `type-check` includes; a workspace's `dist/` that
dependency-cruiser, knip and typed lint read). The third line runs once for each workspace
whose gate drives a browser (`<app>`). `pnpm install` fetches no Playwright browser: the
binaries sit in one per-user cache outside the tree, keyed by the revision the lockfile's
Playwright selects, and an install in any checkout on the host can remove a revision another
needs. So every lane runs the line, and a gate that fails with `Executable doesn't exist` is
this step missed, not a flake. The fourth line installs the pinned shellcheck into the
worktree's ignored `.tools/bin`, where the shell lint gate looks before `PATH`; without it the
gate falls back to the shellcheck on `PATH`, which passes only while that one is the pinned
version. A fresh worktree has **no `.env.local`** — copy it from
a worktree that has one when the lane runs anything env-dependent (codegen, ingest, a
local server). Data directories that are gitignored (bulk downloads) do not travel
either; fetch them per the owning workflow rather than copying, so their manifest
vintage stays honest.

### 4. Establish residency — or decide not to enter

In detected ChatGPT Work cloud, operate through the tool's explicit `workdir`
or absolute paths. Do not invoke Claude's `EnterWorktree`; continue at step 5.

Issue `EnterWorktree` with the path. The platform prompts the human only for a path
outside `.claude/worktrees/` ([Claude Code worktrees documentation](https://code.claude.com/docs/en/worktrees),
since v2.1.206), so a lane cut at step 1 enters without a prompt whether or not the
owner is at the keyboard. The one worktree the tool cannot enter is a SIBLING
repository's (it enters worktrees of the session's own repository alone): operate that
one non-resident from the principal (`git -C <path>` for git, the platform's
file-editing tool on absolute paths for edits, one plain command per call — not
residency, and named as such in the lane broadcast), or have a session launched inside
it (`cd <path> && claude`,
[`worktree-residency`](../../rules/worktree-residency.md) clause 2). A bare `cd` is not
residency and does not survive; a `Shell cwd was reset` line means it did not take. Arm
monitors where you reside: at the principal before an entry, or inside the worktree once
resident — the resident arm roots its `cd` at the worktree and passes the supervisor pid
as a literal, because the isolation guard refuses runtime-computed values such as
`$PPID`; verify each monitor after any switch and re-arm what died from where you are.
The arm shapes and the guard's checks are in
[`worktree-residency`](../../rules/worktree-residency.md) clause 4.

### 5. Verify before trusting it

In the ChatGPT Work cloud profile, verify only the branch, explicit base,
story-only diff, exact changed-file set and static file/link invariants. The
identity and attribution rows below belong to the standard profile, and no
local runtime or full-gate claim is made.

| Check | Command | Expected |
| --- | --- | --- |
| Identity resolves in the worktree | `git -C <path> config user.name` and `git -C <path> config user.email` | the primary's name and address |
| Nothing shadows the shared copy | `git -C <path> config --worktree --get-regexp '^user\.'` | no output |
| Base is clean | `git -C <path> log --oneline origin/<base>..HEAD` | only this story's commits |
| Attribution is right | `git -C <path> log -1 --format='%an / %cn'` | author and committer as the estate's committer identity rule sets them |

The second row is not optional, and a green first row cannot stand in for it. A
`--worktree` override holding the *same* value reads correct today and silently keeps
the stale one the day the shared config is corrected — which is how a single wrong id
came to sit in nine places at once.

### 6. First push carries a draft PR

Every pushed branch carries at least a draft PR from its first push that carries a
commit (`worktree-hygiene` §1). Push from the worktree, not the principal — the principal's
hooks gate the whole tree, so one seat's dirty file blocks every seat — and give the
push a **600s timeout**, because the 120s default kills the hook suite mid-run and
leaves an ambiguous write.

Before any push that changes a vocabulary, an order or a bound — a renamed term, a
re-sequenced step, a re-scoped rule — read every surface that carries it (the touched
files' siblings, the rules and skills they cite, the adapters and index rows) and cure
them in the same push; derive the terms from the change's own before→after words,
never from a reviewer's. This is the review-round tally instrument's practice half:
its absence cost one records PR eight rounds (2026-09-08), each round the next
surface the reviewer sampled.

In a detected ChatGPT Work cloud session, use `HUSKY=0` for any local git
commit or push and the configured default credential; when shell transport has
no configured credential, use the already-authenticated GitHub connector. Open
the draft PR immediately and treat only a concluded `run-quality-gates` check
on that head as execution evidence. Static inspection is reported separately,
never as a local-gate result.

## Failure shapes this procedure exists to prevent

- **Attribution that resolves to nobody** (2026-08-04). The shared config carried the
  app id in the commit email, and worktree-scoped copies masked the fault unevenly —
  some worktrees right, the rest broken, with no surface reporting the split. It
  surfaced only as a Vercel deployment warning — "Invalid git email address / No
  matching user / Vercel Account: Unavailable" — days after the drift. The cure is
  structural and now doctrine: one copy in the shared config, so a correction cannot
  be half-applied. Ticket MCP-490 tracks making the check mechanical.
- **The contaminated base** (PR #673). Fresh-mode branch creation from the
  principal's HEAD; the lane PR carried coordination commits; cost a close-recreate.
- **The gate that blames the wrong thing** (2026-08-04). `PNPM_HOME` on a machine may
  point at a directory that does not hold the `pnpm` binary, so the hook's *nested*
  pnpm call fails its trusted-location check and the pre-commit gate reports
  "formatting issues" for a checker that never ran. If a gate blames formatting on a
  file you have just formatted, read the gate's own output before believing it.
  **Never re-point `PNPM_HOME` to make the gate run** — pnpm derives its store root
  from `PNPM_HOME` (`pnpm store path` proves it), so a re-pointed value silently
  creates a second store and rebinds every tree it installs into; every default-env
  pnpm run in such a tree then demands a destructive modules purge
  (`ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY`), and auto-confirming that with
  `CI=true` is a bypass (owner ruling 2026-08-04). The same error appeared with
  `PNPM_HOME` correct in a worktree another seat had installed (2026-09-24);
  the seat cleared it with that bypass before its first commit, which is
  recorded here as evidence that the cause is still open, never as the
  cure: read `pnpm store path` in the new tree and the primary, and surface a
  difference before any purge. A wrong `PNPM_HOME` is an
  environment misconfiguration: surface it to the owner and fix the value itself;
  worked instance 2026-08-04 (two trees rebound to an accidental
  `$PNPM_HOME/store`, a fleet-wide write freeze, and a two-workaround stack that
  each hid the other's cause).

## Related surfaces

- [`worktree-residency`](../../rules/worktree-residency.md) — residency mechanics,
  platform-pinned; clause 8's pre-PR contamination check.
- [`worktree-hygiene`](../../rules/worktree-hygiene.md) — lane lifecycle, the
  first-push draft PR clause, and §6 dispositions when the lane ends.
- [`bot-identity-on-third-party-systems`](../../rules/bot-identity-on-third-party-systems.md)
  — the estate's committer identity rule: the identity this skill verifies, and the
  author and committer ruling.
- [`never-commit-to-main`](../../rules/never-commit-to-main.md) — why lane work
  starts on its own branch in its own worktree at all.
