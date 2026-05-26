---
name: gates
classification: active
description: Run all quality gates and fix issues.
---

# Quality Gates

Run the quality gates one by one from the repo root. Fix any and all issues
that arise, regardless of location or cause.

After each fix, **restart the quality gate sequence from the beginning**. This prevents regressions to earlier gates from later fixes.

Treat the gate surface as a stack, not a flat list. An upstream red gate can
hide downstream failures because later stages do not become trustworthy until
the earlier stage is green. When one gate clears, expect the next gate to
surface a previously hidden problem. Discovery helpers such as
`pnpm check:profile --dry-run` or a continue-mode run can reveal more of the
stack, but final acceptance still requires the sequence below to pass cleanly
from the beginning.

This sequence corresponds to the current `pnpm check` script — the canonical
aggregate local proof gate. See
[ADR-121](../../../docs/architecture/architectural-decisions/121-quality-gate-surfaces.md)
for how this relates to pre-commit, pre-push, and CI. Re-read `package.json`
before editing this list; the root script is the source of truth when the gate
graph changes.

## The Sequence

Run each gate in order. If a gate fails, fix the issues before proceeding.

```bash
pnpm secrets:scan
pnpm clean
pnpm repo-validators:check
pnpm sdk-codegen
pnpm build
pnpm type-check
pnpm doc-gen
pnpm lint
pnpm test
pnpm test:widget
pnpm test:e2e
pnpm test:ui
pnpm test:a11y
pnpm test:widget:ui
pnpm test:widget:a11y
pnpm subagents:check
pnpm portability:check
pnpm skills:check
pnpm knip
pnpm depcruise
pnpm markdownlint-check:root
pnpm format-check:root
```

Use mutating repair commands such as `pnpm lint:fix`, `pnpm markdownlint:root`,
or `pnpm format:root` only to fix a failing proof, then re-run the proof
sequence from the beginning. Do not treat mutating repair commands as final
evidence that the tree is clean.

## Rules

1. **All issues are blocking** - There is no such thing as "someone else's problem"
2. **Fix, don't disable** - Never use `eslint-disable`, `@ts-ignore`, or similar escapes
3. **Restart on fix** - After fixing any issue, restart from the beginning
4. **No skipping** - Every gate must pass before proceeding to the next

## Process

For each gate in the sequence above:

- If the gate fails, fix the issue
- After fixing, restart from the beginning (`pnpm secrets:scan`)
- If the gate passes, proceed to the next one

The full sequence mirrors `pnpm check` in `package.json`.

## Success Criteria

All gates pass without:

- Disabled checks
- Skipped tests
- Type assertions (`as`, `any`, `!`)
- Ignored errors

When complete, confirm: "All quality gates pass."
