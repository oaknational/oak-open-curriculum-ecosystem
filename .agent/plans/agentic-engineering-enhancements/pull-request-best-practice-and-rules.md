> **Decision home:** the decisions on these candidate inputs live in the
> [PR Merge-Readiness Discipline plan (oak-pr)](../agent-tooling/current/pr-merge-readiness-discipline.plan.md).
> This doc preserves the WS3 evidence; that plan owns the decisions (its Evidence base section).

Agents are carrying out more pull request creations, reviews, responding to comments, and merging.

We need rules, guidance, best practices, and conventions for pull request creation, review, response, and merging.

This needs to be backed up with mechanism, rules, skills, and tools.

## WS3-grounded evidence base (candidate inputs — NOT yet ratified rules)

The comms-corpus research (WS3 failure-mode taxonomy, 2026-06-13) surfaced a coherent PR/commit
failure family, every class grounded in first-hand-verified comms events. **This is the evidence
base for this plan, not its conclusions.** The cure-shapes below are candidate inputs: the plan's
own design process should narrow them, several consolidate EXISTING rules rather than add new ones,
and the eventual rule/skill/tool set is open. Full analysis + cited events:
`.agent/reports/agentic-engineering/2026-06-13-ws3-deep-dives.md` (§D) and the taxonomy
`2026-06-13-ws3-failure-mode-taxonomy.md` (super-category D + T1/T7, H1, R1, P1).

### Candidate inputs, by lifecycle stage

**Commit (multi-writer shared tree):**

- **COMMIT_EDITMSG message-identity isolation.** `.git/COMMIT_EDITMSG` is shared single-writer
  state; pathspec protects file scope but not the message — a peer can overwrite it during your
  pre-commit window, landing your files under their message (`230f3200`). Candidate: inline `-m`
  or per-intent message files. **GAP** (no existing rule).
- **Explicit-pathspec staging + verify-staged-set.** Foreign-staged files get absorbed +
  misattributed when staging trusts the ambient index (`0ba2c822`). **EXISTING:**
  `stage-by-explicit-pathspec` + commit-queue verify-staged — reference/consolidate.
- **Pre-flight commit-subject length** (commitlint 100; composite subjects overrun) —
  `e7878e41` / `31998f7a`. **EXISTING:** commit skill enumerates it; candidate to make structural.

**Push:**

- **Push proof = transfer line + `git ls-remote`, never the hook banner** (`e589b3c7`,
  false-green push ×2). Candidate rule/skill clause (in distilled; graduation candidate).
- **Prefer the direct gated commit (Path-B) over the commit-queue wrapper** until the wrapper's
  captured-hook-output defect is fixed (`5ef5f1c0`, five instances). **TOOL-FIX** (agent-tools) +
  interim convention.

**Gate / hooks:**

- **`--no-verify` is owner-authorised per instance; a hook block is a question, typically the answer is no** (`054f1469`).
  **EXISTING:** `no-verify-requires-fresh-authorisation` — reference.
- **Whole-tree-gate ⇄ commit-scope alignment in shared trees** — a peer's untracked edits can
  break your gate. Candidate guidance + gate-scoping tool consideration. **GAP.**

**Review / response / merge:**

- **Review-dispatch before the commit/merge; no backfill** (`3d56f233`). **EXISTING:** no-backfill.
- **Pin the SHA when pre-grounding a peer PR** (`git show <head-sha>:<path>`, never a live
  worktree) — `b46ccedd`. **EXISTING:** pin-SHA-when-pre-grounding.
- **Merge-window liveness: ping-before-escalate + git-evidence** before reading silence as
  retirement (`5fb2bcd9` / `670cc290`). **EXISTING:** PDR-078 / ping-before-escalate.
- **Resolve-or-refute every review comment before merge — never green-checks alone.** Advisory
  reviewers (Copilot, cursor[bot]) sit on a surface that does not gate the merge button, so
  "mergeable + CI green" is an incomplete readiness model; a PR is merge-ready only when every
  review thread is also resolved-or-refuted. Founding worked instance: PR #203 merged on
  green-checks with four unread valid comments (2026-06-13). **NEW** (oak-pr skill clause + the
  merge-readiness gate; this is the originating decision of the oak-pr plan).
- **Batch-resolve a review round; let advisory reviewers settle before responding.** Fixing one
  comment, pushing, then drawing a fresh comment from the re-review produces a long
  fix-push-per-comment convergence tail (worked instance: the 2026-06-13 arc — every follow-up
  PR #204/#205/#206/#207 drew new advisory comments across successive re-review rounds). Cure:
  after a push, let ALL advisory reviewers settle on that commit, then batch-resolve the round's
  comments in one commit — minimising re-review cycles while still resolving-or-refuting each.
  **NEW** (oak-pr skill efficiency clause; complements the resolve-or-refute gate, does not
  replace it).

### What worked (encourage, not mandate)

Two-moments warden handoff for the commit/push-window singleton (PDR-064); execution-start
re-verification before routing PR work; ls-remote / RED-first as proof disciplines.

### Scope note (read before authoring rules)

Most items above are EXISTING rules to consolidate/reference, not re-author
(`consolidate-at-third-consumer`). The genuine NEW gaps are narrow: COMMIT_EDITMSG message
isolation, whole-tree-gate ⇄ commit-scope alignment, and the commit-queue-wrapper tool-fix.
Whether each becomes a rule, skill clause, tool change, or guidance is THIS plan's decision —
this section preserves the evidence, deliberately not the conclusion.
