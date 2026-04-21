# Commit Current Work

Create a well-formed commit for the current changes. This skill converts
commitlint from a post-hoc rejection surface (the `commit-msg` hook fires *after*
a full message has been drafted) into an **active, pre-draft tripwire**: the
constraints are enumerated inline before drafting, and a format-check runs
before `git commit` is invoked.

**Always-on** — every commit, every session, no trigger required.

**Motivating pattern**:
[`passive-guidance-loses-to-artefact-gravity`](../memory/active/patterns/passive-guidance-loses-to-artefact-gravity.md)
applied to commit authoring. Prior prose guidance said "lines under 99 chars"
without surfacing the preset's actual rules; every session hit rework
(subject-case violations, header-length overruns, missing footers). This skill
closes that exposure window.

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
3. **Confirm quality gates have passed** (or run them now).
4. **Stage selectively** — never blindly `git add .`. Skip `.env`, credentials,
   `bulk-downloads/`. Review each file staged.
5. **Draft the header** against the enumerated constraints.
6. **Run the format-check BEFORE invoking `git commit`** (see below). If any
   check fails, rewrite and re-check — do not let the hook be your first check.
7. **Commit** using the HEREDOC template below so multi-line body formatting
   survives the shell.
8. **Verify**: `git status` — confirm the commit succeeded.

## Format-Check Before Commit

Run these checks against the drafted header and rewrite if any fail:

1. **Header length** — `type(scope): subject` first line is ≤ **100 chars**
   (measure the whole line, not just the subject).
2. **Type** — matches the `type-enum` set above (lowercase, no typos).
3. **Scope** — if present, lowercase and conventional for this repo.
4. **Subject** — starts lowercase; no trailing `.`; not empty.
5. **Body** — preceded by a blank line; uses imperative voice; explains WHY
   not WHAT.
6. **Footers** — `Co-Authored-By: …` preceded by a blank line; any other repo
   trailers present.

## Commit Message Template

```text
type(scope): short subject starting lowercase

Optional body paragraphs explaining WHY this change exists,
not what it does. Wrap at ~72 chars. Use imperative voice.

Co-Authored-By: <name> <email>
```

Use a HEREDOC to preserve multi-line formatting:

```bash
git commit -m "$(cat <<'EOF'
type(scope): short subject starting lowercase

Body paragraph explaining motivation and context.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

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
*before* the agent drafts, and a format-check runs *before* `git commit` is
invoked. The live hook is still the ground truth — this skill does not replace
it — but the rework loop is closed at draft time rather than commit-invocation
time.

## Related Surfaces

- Pattern: [`.agent/memory/active/patterns/passive-guidance-loses-to-artefact-gravity.md`](../memory/active/patterns/passive-guidance-loses-to-artefact-gravity.md)
  — the failure mode this skill counters.
- PDR: [`.agent/practice-core/decision-records/PDR-029-perturbation-mechanism-bundle.md`](../practice-core/decision-records/PDR-029-perturbation-mechanism-bundle.md)
  — design principles (firing cadence first; two complementary layers target:
  enumerate inline at draft time + format-check at invocation time).
- Principles: [`.agent/directives/principles.md`](../directives/principles.md)
  — the `--no-verify` fresh-authorisation invariant.

## Platform Adapters

- **Claude**: `.claude/commands/jc-commit.md` (slash command `/jc-commit`) —
  thin pointer to this file.
- **Cursor**: `.cursor/commands/jc-commit.md` — thin pointer to this file.
- **Codex**: `.agents/skills/jc-commit/SKILL.md` — thin pointer to this file.
- **Non-loader platforms** (Gemini and others): discover this skill via the
  AGENT.md citation in [`.agent/directives/AGENT.md § Development Commands`](../directives/AGENT.md#development-commands).
