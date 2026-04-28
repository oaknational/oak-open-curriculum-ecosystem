---
name: Recurrence prevention after VERCEL_BRANCH_URL bug
overview: >
  High-priority future enhancements surfaced by the metacognition pass on
  the 2026-04-25 VERCEL_BRANCH_URL bug. Two items: a new ESLint rule that
  catches half-applied constant-type-predicate patterns, and an amendment
  to `read-diagnostic-artefacts-in-full` that names the workspace-first
  step explicitly. Neither is blocking the PR that fixed the bug; both
  prevent the same class of recurrence.
status: future
---

# Recurrence prevention after `VERCEL_BRANCH_URL` bug

## Context

The 2026-04-25 metacognition pass on the `VERCEL_BRANCH_URL` bug
(commits `6485773f` `c2b1c1e5` `27a7ae78` `51e548e8`) surfaced two
infrastructure improvements that prevent the same class of recurrence.
Both are high-priority future work but not blocking for the PR that
landed the bug fix. Owner direction: surface as future enhancements.

## Item 1 — `no-bare-discriminator-union` ESLint rule

**Problem**: bare string-literal unions (`type X = 'a' | 'b'`) require
discipline at every call site to use the union members consistently.
The `RELEASE_ERROR_KINDS` half-applied state — runtime constant exists,
type derived, but call sites still use magic strings — is detectable
only via `@typescript-eslint/no-unused-vars` once the constant is
defined, and that rule fires at the *constant* not at the *magic
strings*.

**Solution**: add a sibling rule to
`packages/core/oak-eslint/src/rules/no-export-trivial-type-aliases.ts`
called `no-bare-discriminator-union`. The rule fires on:

1. An exported `type X = 'literal-a' | 'literal-b' | ...` declaration
   where the union has ≥ 2 members AND no sibling `as const` runtime
   constant exists in the same file.
2. (Optional follow-up) An object-literal property assignment
   `{ kind: 'literal-x' }` where the type-context expects a member of
   a union AND a sibling runtime constant exists.

The first form catches the source-of-truth design issue; the second
form catches the half-applied refactor.

**Acceptance criteria**:

- Rule lives at
  `packages/core/oak-eslint/src/rules/no-bare-discriminator-union.ts`
  with a unit test file alongside it (per existing pattern).
- Rule autofix where mechanical: convert
  `type X = 'a' | 'b'` to
  `const X_VALUES = { a: 'a', b: 'b' } as const; type X = (typeof X_VALUES)[keyof typeof X_VALUES]`.
- Rule registered in the workspace's flat ESLint config so it fires
  across all workspaces.
- Existing magic-string call sites in
  `apps/oak-curriculum-mcp-streamable-http/src/`,
  `packages/libs/sentry-node/src/`, etc. are migrated as part of the
  same commit OR the rule lands as `warn` initially and the migration
  is a separate workstream (decide based on count).

## Item 2 — Amend `read-diagnostic-artefacts-in-full` rule

**Problem**: the current rule
(`.agent/rules/read-diagnostic-artefacts-in-full.md`) names "re-call
the tool with an explicit high limit, full pagination, or the narrowest
available complete export" as step 1. It does NOT name the
**workspace-first** step: when remote tooling truncates, search the
workspace for owner-provided artefacts (downloaded logs, captured
state) BEFORE retrying the same tool with bigger limits.

The 2026-04-25 incident was exactly this: the owner had downloaded
the complete Vercel build log to `vercel_logs/build-issues.log`
(584KB). I retried the Vercel MCP with bigger limits twice, surrendered
when MCP truncated, and went speculative. I never grepped the
workspace.

**Solution**: amend `.agent/rules/read-diagnostic-artefacts-in-full.md`
to name the workspace-first step explicitly. Suggested wording:

> When a tool returns paginated, truncated, filtered, or sampled
> diagnostic output, before retrying the tool **with bigger limits**,
> first search the workspace for the complete artefact:
> `find . -maxdepth 3 -name '*.log' -o -name '*-issues*'` plus a `ls`
> of any directory whose name matches the failure topic
> (`vercel_logs/` for a Vercel failure, `test-results/` for a test
> failure, etc.). The owner may have downloaded the complete artefact
> locally; remote tooling is the second source.

**Acceptance criteria**:

- Rule file updated with the new step ordered before the existing
  tool-retry step.
- Adapter copies in `.claude/rules/`, `.cursor/rules/`,
  `.agents/rules/` re-pointed (they're thin pointers; no content
  change).
- Memory file
  `feedback_workspace_first_for_diagnostics.md` (already captured
  2026-04-25) flagged as the rule's source-of-truth memory.

## Promotion trigger

Either:

- Owner direction to promote (preferred — these are
  governance-shaped).
- A second instance of the same recurrence (likelihood reduced by
  the 2026-04-25 memories already in place; if it does happen, that
  is the trigger).

## Cross-references

- Bug-fix commits: `6485773f` (fix), `c2b1c1e5` (constant-type-
  predicate refactor), `27a7ae78` (sentry-node consume constants),
  `51e548e8` (BuildEnvSchema + runtime env migration).
- Memory: `~/.claude/projects/<project>/memory/feedback_workspace_first_for_diagnostics.md`,
  `feedback_check_workspace_packages_before_proposing.md`,
  `feedback_gh_pr_checks_over_brief.md`.
- Existing infrastructure to extend: ADR-153 (Constant-Type-Predicate
  Pattern), `.agent/rules/read-diagnostic-artefacts-in-full.md`,
  `packages/core/oak-eslint/src/rules/no-export-trivial-type-aliases.ts`.
