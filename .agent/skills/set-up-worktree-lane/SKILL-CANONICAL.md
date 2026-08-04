---
name: set-up-worktree-lane
classification: active
description: >-
  Create a git worktree for a lane and configure it so every downstream surface is
  true: an inherited bot commit identity checked rather than re-set, dependencies,
  environment files, and a draft PR at first push. Use when taking up a lane needing
  its own checkout, or when a worktree misbehaves — commits attributed to nobody,
  missing env, hook failures. Do not use to switch branches in place (never on the
  principal), for the session-level residency switch alone (that is EnterWorktree),
  or to dispose of a finished worktree. Right looks like: branch cut explicitly from
  origin/main, the inherited bot identity verified with no worktree-scoped override
  shadowing it, deps installed, .env.local carried, draft PR at first push. Wrong
  looks like: EnterWorktree fresh mode basing the branch on the principal's
  coordination HEAD so the lane PR ships foreign commits; or the bot commit email
  carrying the app id instead of the bot user id, which resolves to no GitHub user
  and silently breaks deployment attribution.
---

# Set Up a Worktree Lane

**Governance**: the procedure that composes three rules at the one moment they all
apply — [`worktree-residency`](../../rules/worktree-residency.md) (where you work and
how residency is established), [`worktree-hygiene`](../../rules/worktree-hygiene.md)
(lane lifecycle, the first-push draft PR, dispositions), and
[`bot-identity-on-third-party-systems`](../../rules/bot-identity-on-third-party-systems.md)
(who commits, and under whose authority). Those rules own the doctrine and the
reasoning; this skill owns the ordered steps and the verification, because every
defect below was found in a worktree that satisfied each rule read separately.

## Use When

- Taking up a lane that needs its own checkout (the normal case — new branch work
  never starts on the principal).
- A worktree is behaving oddly: commits attributed to no GitHub user, a gate failing
  for reasons unrelated to the change, a build that cannot find its environment.
- Auditing an inherited worktree before trusting it.

Not for: switching branches in place; the session-level residency switch on its own
(`EnterWorktree` — step 3 here); disposing of a finished worktree (that is
`worktree-hygiene` §6).

## The procedure

### 1. Cut the branch with an explicit start point

```bash
git fetch origin
git worktree add <path> -b <branch> origin/main
```

The explicit `origin/main` is load-bearing. `EnterWorktree`'s fresh mode documents
branching from `origin/main` but has been observed basing the branch on the
**principal's checked-out HEAD** — a coordination-branch tip on this estate — so the
lane PR ships coordination commits riding under the story. That cost a
close-and-recreate cycle once already (PR #673 → #674).

### 2. Verify the commit identity — inherited, never re-set here

The identity lives once in the clone's shared local config and every worktree
inherits it (owner ruling 2026-08-04; doctrine in
[`bot-identity-on-third-party-systems`](../../rules/bot-identity-on-third-party-systems.md)).
A new worktree therefore needs no identity step at all — only a check that what it
inherited is right:

```bash
git -C <path> config user.email
# expect: 307435217+jimbot-oakington-iii[bot]@users.noreply.github.com
```

If that is wrong or absent, fix the SHARED config once. Never patch this worktree: a
`--worktree` override is a second copy that outlives the next correction and
reintroduces the exact drift this step exists to catch.

```bash
BOT_SLUG=$(jq -r .appSlug .github/merge-bot.json)
BOT_ID=$(gh api "users/${BOT_SLUG}%5Bbot%5D" --jq .id)

git config user.name  "${BOT_SLUG}[bot]"
git config user.email "${BOT_ID}+${BOT_SLUG}[bot]@users.noreply.github.com"
```

Derive the id, never transcribe it — the address embeds the **bot user id**, not the
app id, the two sit near each other in the docs, and the wrong one produces an
address that resolves to no GitHub user at all. A literal id copied into a document
is a second copy of a fact that already lives somewhere authoritative, and the copy
is the one that goes stale: the identity produced by this sequence is correct by
construction, one transcribed by hand was wrong for days. Because there is exactly
one copy, fixing it cures every worktree at once.

Committer and author are different identities by owner ruling: the **committer** is
the acting agent (the config above); the **author** is the human whose authority the
work carries, passed per commit —
`git commit --author="Jim Cresswell <1314980+jimCresswell@users.noreply.github.com>" -F <msg>`.
The default is deliberately fail-safe: forget the flag and you get a bot-authored
commit, never a commit that silently credits the owner with agent work.

### 3. Establish residency

`EnterWorktree` with the path — the session-level switch. A bare `cd` is not
residency and does not survive; a `Shell cwd was reset` line means it did not take.
Arm background tasks only after this, since they capture their directory for life.

### 4. Make the worktree buildable

```bash
pnpm install
```

A fresh worktree has **no `.env.local`** — copy it from a worktree that has one when
the lane runs anything env-dependent (codegen, ingest, a local server). Data
directories that are gitignored (bulk downloads) do not travel either; fetch them per
the owning workflow rather than copying, so their manifest vintage stays honest.

### 5. Verify before trusting it

| Check | Command | Expected |
| --- | --- | --- |
| Identity resolves in the worktree | `git -C <path> config user.email` | the bot address above |
| Nothing shadows the shared copy | `git -C <path> config --worktree --get-regexp '^user\.'` | no output |
| Base is clean | `git -C <path> log --oneline origin/main..HEAD` | only this story's commits |
| Attribution is right | `git -C <path> log -1 --format='%an / %cn'` | author human, committer bot |

The second row is not optional, and a green first row cannot stand in for it. A
`--worktree` override holding the *same* value reads correct today and silently keeps
the stale one the day the shared config is corrected — which is how a single wrong id
came to sit in nine places at once.

### 6. First push carries a draft PR

Every pushed branch carries at least a draft PR from its first push
(`worktree-hygiene` §1). Push from the worktree, not the principal — the principal's
hooks gate the whole tree, so one seat's dirty file blocks every seat — and give the
push a **600s timeout**, because the 120s default kills the hook suite mid-run and
leaves an ambiguous write.

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
  `CI=true` is a bypass (owner ruling 2026-08-04). A wrong `PNPM_HOME` is an
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
  — the identity contract this configures, and the author/committer ruling.
- [`never-commit-to-main`](../../rules/never-commit-to-main.md) — why lane work
  starts on its own branch in its own worktree at all.
