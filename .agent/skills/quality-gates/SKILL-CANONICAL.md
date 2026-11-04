---
name: quality-gates
classification: active
description: Run quality gates and fix issues systematically. Use when running checks, fixing linter errors, preparing to commit, or when any quality gate fails.
---

# Quality Gates

Run gates sequentially from the repo root. Fix issues as they arise. After any fix, restart the full sequence — this prevents regressions from later fixes undoing earlier ones.

## The sequence

The definitive gate list with all command names lives in
`.agent/directives/principles.md` (Code Quality section). The summary:

- `pnpm check` runs the blocking gate sequence read-only; `pnpm fix` runs the auto-fixers first
  (format, markdownlint, shell and runtime-only lint, lint, type-check, test, the dead-code and
  dependency-graph checks, the secret scan, the Practice validators).
- The pre-push hook runs `pnpm check` and then the host's product legs; pre-commit is light
  (staged-file format and markdown checks, lint on changed workspaces).
- `pnpm test:e2e` and `pnpm test:ui` are separate Playwright surfaces; `pnpm test:e2e` runs
  the host's end-to-end suite against a production build.
- When changing Practice Core or directive docs, run
  `pnpm practice:fitness:informational` and
  `pnpm practice:vocabulary` as advisory companion checks.

When running gates individually for restart-on-fix, start from
`pnpm format:root`, then `pnpm markdownlint:root`.

For rendering-risk changes, rendered proof is also blocking even though it is
not part of `pnpm check` (`.agent/rules/visual-verdicts-require-rendered-proof.md`).
Run the `visual-verification` skill's instrument during implementation once a
slice could affect rendered output, and rerun it after later slices as needed.
Do not leave all rendered-proof review until the end.

## Restart-on-fix discipline

If any gate fails:

1. Fix the issue in product code (not by disabling the check).
2. Restart from `pnpm format:root`.
3. Repeat until all gates pass without fixes.

This matters because a type-check fix might introduce a lint issue, or a test fix might introduce unused code that Knip catches.

## Prohibited shortcuts

- `eslint-disable`, `@ts-ignore`, `@ts-expect-error` — fix the root cause
- `as`, `any`, `!` — these disable the type system
- `it.skip`, `describe.skip` — fix or delete the test
- `--no-verify` on git operations — never bypass hooks
- Commenting out code — fix or delete it

## When to run

- Before every commit (the pre-commit hook enforces this).
- After any substantive code change.
- After resolving merge conflicts.
- When asked to verify the codebase is clean.

## Success

All gates pass. No disabled checks, no skipped tests, no type assertions, no ignored errors. Confirm: "All quality gates pass."
