---
name: commit
classification: passive
description: >-
  Create a well-formed commit for current changes with conventional message
  format. Always active, every commit, every session, no trigger required.
  Enumerates live commitlint constraints inline at draft time, validates the
  drafted message via scripts/check-commit-message.sh BEFORE invoking
  git commit.
---

# Commit Current Work

Create a well-formed commit for the current changes. This skill converts
commitlint from a post-hoc rejection surface (the `commit-msg` hook fires
*after* a full message has been drafted) into an **active, pre-draft tripwire**:
the constraints are enumerated inline before drafting, the message is
validated by `scripts/check-commit-message.sh` before `git commit` is invoked,
and every attempt is logged for cross-session diagnostics.

**Always-on** — every commit, every session, no trigger required.

**Motivating pattern**:
[`passive-guidance-loses-to-artefact-gravity`](../../memory/active/patterns/passive-guidance-loses-to-artefact-gravity.md)
applied to commit authoring. Prior prose guidance said "lines under 99 chars"
without surfacing the preset's actual rules; every session hit rework
(subject-case violations, header-length overruns, missing footers). This skill
closes that exposure window.

## Tooling

One active script makes this skill actionable end-to-end:

- **`scripts/check-commit-message.sh`** — validates a commit message against
  this repo's commitlint config in isolation from the rest of the pre-commit /
  commit-msg hook chain. Mirrors `git commit` message intake (`-m` repeats,
  `-F`, `-F -`, stdin). Exit 0 conforms, 1 violates, 2 invalid usage. Catches
  `header-max-length`, `body-max-line-length`, and case violations in ~1s
  before the ~34s pre-commit cycle. **Use BEFORE every `git commit`.**

`scripts/log-commit-attempt.sh` is retained in the repo but currently
disabled. Do not call it unless the owner explicitly re-enables
commit-attempt logging.

## Before You Draft — Load the Live Constraints

Run these steps **before** formulating the commit message.

1. **Locate the commitlint config.** Check these locations in order and read
   whichever is present:

   ```bash
   ls commitlint.config.{mjs,js,cjs,ts} 2>/dev/null || \
     ls .commitlintrc.{json,yaml,yml} 2>/dev/null || \
     grep -n '"commitlint"' package.json 2>/dev/null
   ```

2. **Read the located config file** to discover which preset governs commits
   (typically an `extends:` array) and whether the repo layers on any `rules:`
   overrides.

3. **Read `.husky/commit-msg`** (if present) to see which hooks run at
   commit-msg time — any hook other than `commitlint --edit` is an additional
   gate whose checks must also pass.

4. **Enumerate the active constraints** based on the preset in use. The active
   constraints are whatever the commitlint preset declares; the rules below are
   the defaults for `@commitlint/config-conventional`, the most common preset
   (currently in use in this repo). If the config `extends` a different preset,
   or layers on `rules:` overrides, surface those instead.

   **`@commitlint/config-conventional` defaults**:

   | Rule | Effective constraint |
   | --- | --- |
   | `header-max-length` | Header ≤ **100 chars** (the whole first line: `type(scope): subject`) |
   | `body-max-line-length` | Each body line ≤ **100 chars** (wrap manually) |
   | `type-empty` | Type is **required** |
   | `type-case` | Type must be **lower-case** |
   | `type-enum` | Type ∈ \{`build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `style`, `test`\} |
   | `scope-case` | Scope (if present) must be **lower-case** |
   | `subject-empty` | Subject is **required** |
   | `subject-case` | Subject must NOT be `sentence-case`, `start-case`, `pascal-case`, or `upper-case` — effectively start **lower-case** |
   | `subject-full-stop` | Subject must NOT end with `.` |
   | `body-leading-blank` | Body must be preceded by a blank line |
   | `footer-leading-blank` | Footer must be preceded by a blank line |

5. **Surface any repo-specific extra hooks** flagged by `.husky/commit-msg`. In
   this repo at the time of writing, `scripts/prevent-accidental-major-version.ts`
   runs **before** commitlint and blocks accidental major-version bumps in
   commit headers — factor that into the message draft if the change touches
   version-bearing files.

## Process

1. **Check status**: `git status` — see all changes.
2. **Review diff**: `git diff --staged && git diff` — understand what will be
   committed.
3. **Confirm quality gates have passed** (or run them now). Do NOT pre-prime
   the turbo cache by running `bash .husky/pre-commit` separately — the real
   commit will warm it; the pre-prime is wasted ~30s and confuses symptom
   for cause.
4. **Stage selectively** — never blindly `git add .`. Skip `.env`, credentials,
   `bulk-downloads/`. Review each file staged.
5. **Draft the message** against the enumerated constraints.
6. **Validate the message via `scripts/check-commit-message.sh` BEFORE
   invoking `git commit`** (see below). If validation fails, rewrite and
   re-validate — do not let the `commit-msg` hook be your first check.
7. **Commit** using the HEREDOC template below so multi-line body formatting
   survives the shell. Cursor-Shell-tool users add the file-redirect
   workaround documented under "Cursor Shell tool — stream truncation
   workaround" below.
8. **Verify**: `git status` — confirm the commit succeeded.

## Pre-Commit Validation (replaces the manual format-check)

Run the helper script against the drafted message. It exits 0 if the message
conforms to the active commitlint config; 1 if it violates; 2 on invalid
usage.

```bash
./scripts/check-commit-message.sh -F - <<'EOF'
type(scope): short subject starting lowercase

Body paragraph explaining motivation and context. Wrap at ~100 chars
to satisfy body-max-line-length.

Co-Authored-By: <name> <email>
EOF
```

Or pass via `-m` (repeats join paragraphs with blank lines, identical to
`git commit -m … -m …`):

```bash
./scripts/check-commit-message.sh \
  -m "type(scope): short subject" \
  -m "Body paragraph one." \
  -m "Body paragraph two."
```

If the script reports a violation, rewrite the message and re-run before
attempting `git commit`. The script runs `commitlint` from the repo root
with the canonical config — same rules as the live `commit-msg` hook,
without the rest of the ~34s pre-commit chain.

## Commit Message Template

```text
type(scope): short subject starting lowercase

Optional body paragraphs explaining WHY this change exists,
not what it does. Wrap at ≤100 chars (body-max-line-length).
Use imperative voice.

Co-Authored-By: <name> <email>
```

Use a HEREDOC to preserve multi-line formatting:

```bash
git commit -F - <<'EOF'
type(scope): short subject starting lowercase

Body paragraph explaining motivation and context.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
```

(`git commit -F -` reads the message from stdin; equivalent to the older
`git commit -m "$(cat <<EOF)"` HEREDOC pattern, with one fewer subshell
layer.)

## Cursor Shell tool — stream truncation workaround

**Scope**: Cursor Shell tool sessions only. Other platforms (Claude Code,
Codex CLI, direct terminal) use the plain HEREDOC above without
modification.

**Observation (active 2026-04-23)**: when `git commit` is invoked from
the Cursor Shell tool with stdout/stderr streaming live, the pre-commit
hook's output is consistently cut off at the `depcruise → turbo`
handover, the tool reports `Exit 1`, and no commit lands. Running the
exact same hook directly via `bash .husky/pre-commit` exits 0 with full
output, and running the same `git commit` invocation with stdout/stderr
redirected to a file completes cleanly with the commit landing.

**Workaround**: redirect stdout/stderr to a temporary file and inspect
the tail after the command completes:

```bash
START=$(date +%s)
git commit -F - >/tmp/commit.log 2>&1 <<'EOF'
type(scope): short subject starting lowercase

Body paragraph.

Co-Authored-By: <name> <email>
EOF
RC=$?
END=$(date +%s)
ELAPSED=$((END-START))
tail -5 /tmp/commit.log
SHA=$(git log -1 --format=%h)
```

**Falsifiability**: keep the file-output workaround only while the
streamed `git commit` path is genuinely unreliable in Cursor Shell
tool sessions. If streamed commits start landing cleanly again, retire
the file-output variant and return to the plain HEREDOC.

**Anti-workaround**: do NOT pre-prime the turbo cache by running
`bash .husky/pre-commit` separately before `git commit`. It does not
prevent the truncation (the truncation is a stream-handover artefact,
not a hook-timing one), and it wastes ~30s per commit.

## Commit-Attempt Logging

Commit-attempt logging is currently paused. The helper script is still
present in `scripts/` for quick reactivation, but the standard commit
workflow should not append to
[`commit-attempts.log`](../../memory/operational/diagnostics/commit-attempts.log)
unless the owner explicitly asks for that diagnostic trace again.

## Safety Rules

**Do NOT modify git history or discard changes** without explicit owner
consent. Prohibited operations without prior discussion:

- `git stash` — can lose uncommitted work
- `git reset` — can discard commits or changes
- `git checkout -- <file>` — discards uncommitted changes
- `git clean` — deletes untracked files
- `git rebase` — rewrites history
- `--no-verify` — bypasses git hooks; **requires fresh per-commit owner
  authorisation** (no carry-forward, per the repo-wide invariant)
- `--force` / `-f` on push — overwrites remote history

If any of these would be helpful, **MUST discuss with the user first**.

Additional prohibitions:

- **Never** force-push to `main` / `master`.
- **Never** amend commits already pushed to remote.
- If a pre-commit or commit-msg hook fails, **fix the underlying issue** — no
  shortcuts, no hook bypassing.

## Why This Skill is Active, Not Passive

Commitlint's `commit-msg` hook is a tripwire, but a **post-hoc** one — it fires
*after* the full message has been drafted. Every failure becomes rework. This
skill installs a **pre-draft** tripwire: constraints are enumerated inline
*before* the agent drafts, and `scripts/check-commit-message.sh` runs the same
commitlint config *before* `git commit` is invoked. The live hook is still the
ground truth — this skill does not replace it — but the rework loop is closed
at draft time rather than commit-invocation time.

## Related Surfaces

- Pattern: [`.agent/memory/active/patterns/passive-guidance-loses-to-artefact-gravity.md`](../../memory/active/patterns/passive-guidance-loses-to-artefact-gravity.md)
  — the failure mode this skill counters.
- PDR: [`.agent/practice-core/decision-records/PDR-029-perturbation-mechanism-bundle.md`](../../practice-core/decision-records/PDR-029-perturbation-mechanism-bundle.md)
  — design principles (firing cadence first; two complementary layers target:
  enumerate inline at draft time + format-check at invocation time).
- PDR: [`.agent/practice-core/decision-records/PDR-011-continuity-surfaces-and-surprise-pipeline.md`](../../practice-core/decision-records/PDR-011-continuity-surfaces-and-surprise-pipeline.md)
  — `capture → distil → graduate → enforce`. The diagnostic log is a
  **diagnostic substrate** the pipeline reasons over; pending PDR-011
  amendment to name diagnostic substrates as a distinct surface class
  (see `repo-continuity.md § Pending-graduations register additions
  (2026-04-23 handoff)`).
- Diagnostics: [`.agent/memory/operational/diagnostics/README.md`](../../memory/operational/diagnostics/README.md)
  — convention for the commit-attempts log + log-commit-attempt script.
- Principles: [`.agent/directives/principles.md`](../../directives/principles.md)
  — the `--no-verify` fresh-authorisation invariant.

## Platform Adapters

This skill is **passive / always-active** — discovery, not invocation.
Adapters are skill-form thin pointers (no slash-command form):

- **Cursor**: `.cursor/skills/commit/SKILL.md` — thin pointer to this file.
- **Codex**: `.agents/skills/commit/SKILL.md` — thin pointer to this file.
- **Claude**: discovered via the `CLAUDE.md` → `AGENT.md` citation chain at
  [`.agent/directives/AGENT.md § Commit Discipline`](../../directives/AGENT.md#commit-discipline).
  No `.claude/skills/commit/` adapter — Claude's always-active discovery
  goes through `CLAUDE.md`, mirroring the pattern used by `napkin` and
  `finishing-branch`.
- **Gemini**: discovered via the same `AGENT.md` citation chain. Gemini
  does not have a native skills surface; the slash-command form
  (`.gemini/commands/jc-commit.toml`) was deliberately removed when this
  workflow was promoted from a slash command to a passive skill.
