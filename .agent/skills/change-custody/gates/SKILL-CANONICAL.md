---
name: gates
classification: active
description: Run all quality gates and fix issues.
---

# Quality Gates

The hooks run the quality gates: the pre-commit hook the light gate, the
pre-push hook the full aggregate `pnpm check` under a host gate slot and then
the host's product legs, CI the same legs (owner, 2026-10-04: light commit,
full push, in both estates). An agent never runs the gates by hand beside the
hooks (owner, 2026-09-14: "the commit triggers the gates, there is no point
and a fair amount of cost running the gates separately as well, never, ever
do that"). This skill is for reading a refusal and curing it: fix any and all
issues that arise, regardless of location or cause, then commit or push again.

After each fix the hook **re-runs the quality gate sequence from the
beginning**. This prevents regressions to earlier gates from later fixes.

Treat the gate surface as a stack, not a flat list. An upstream red gate can
hide downstream failures because later stages do not become trustworthy until
the earlier stage is green. When one gate clears, expect the next gate to
surface a previously hidden problem. Discovery helpers such as
`pnpm check:profile --dry-run` or a continue-mode run can reveal more of the
stack, but final acceptance still requires the sequence below to pass cleanly
from the beginning.

The sequence is the current `pnpm check` script — the canonical read-only
aggregate local proof gate — unrolled one leg per line, followed by the host's
gates outside it. The Practice-operation legs (format, markdown, shell lint,
lint, type-check, test, the validators) are the family's and read the same in
every estate; the product legs are the host's, and each estate's block below
names its own. CI runs the same legs (in jimcresswell.net
`validate-check-ci-parity` refuses a drift between `check` and
`.github/workflows/ci.yml`). Re-read `package.json` before editing this list;
the root script is the source of truth when the gate graph changes, and the
cited-scripts validator refuses a `pnpm <script>` citation that `package.json`
does not define (its sibling, the cited-paths validator, refuses a
code-formatted `.agent/` or `docs/` path that does not exist).

## The Sequence

The hook runs each gate in order; when one refuses, fix the issue, then
commit or push again. The legs of `check` here are OCE's:

```bash
# OCE: pnpm check, as the push hook runs it (the TypeScript family's sequence, with this
# host's product gates in the two host slots)
pnpm secrets:scan
pnpm format-check:root
pnpm markdownlint-check:root
pnpm lint:shell               # shellcheck over every tracked shell script
pnpm lint:runtime-only
turbo run --continue sdk-codegen                            # host slot: regenerates the SDK
turbo run --continue build type-check lint test test:e2e   # the family's gate leg, every workspace
turbo run --continue test:ui test:widget test:a11y test:widget:ui test:widget:a11y   # host slot
pnpm knip:gate
pnpm depcruise
pnpm portability:check
pnpm subagents:check
pnpm skills:check
pnpm encoding:check
pnpm repo-validators:check    # the family's validators, then this host's
pnpm docs-validators:check
```

The host's gates outside `check` (OCE: the pull request's checks run CodeQL,
Sonar, the Windows and browser jobs; the rest run when the work touches their
surface):

```bash
pnpm check:profile --dry-run    # the gate profile a push would run, without running it
```

Use mutating repair commands such as `pnpm fix` (the mutating aggregate),
`pnpm lint:fix`, `pnpm markdownlint:root` or `pnpm format:root` only to fix a
failing proof, then re-run the proof sequence from the beginning (`pnpm
fix:docs` repairs and re-proves the docs subset). Do not treat mutating
repair commands as final evidence that the tree is clean.

## Rules

1. **All issues are blocking** - There is no such thing as "someone else's problem"
2. **Fix, don't disable** - Never use `eslint-disable`, `@ts-ignore`, or similar escapes
3. **Restart on fix** - After fixing any issue, restart from the beginning
4. **No skipping** - Every gate must pass before proceeding to the next

## Process

For each gate in the sequence above:

- If the gate refuses, fix the issue
- After fixing, commit or push again: the hook restarts from the beginning
- If the gate passes, the hook hands over to the next one

The full sequence mirrors `pnpm check` in the host's `package.json`.

## Success Criteria

All gates pass without:

- Disabled checks
- Skipped tests
- Type assertions (`as`, `any`, `!`)
- Ignored errors

When complete, confirm: "All quality gates pass."
