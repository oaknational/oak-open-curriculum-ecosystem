# Quality Gates

Run the quality gates one by one from the repo root. Fix any and all issues that arise, regardless of location or cause.

After each fix, **restart the quality gate sequence from the beginning**. This prevents regressions to earlier gates from later fixes.

## The Sequence

Run each gate in order. If a gate fails, fix the issues before proceeding.

```bash
pnpm secrets:scan:all
pnpm clean
pnpm type-gen
pnpm build
pnpm type-check
pnpm doc-gen
pnpm format:root
pnpm markdownlint:root
pnpm lint:fix
pnpm test
pnpm test:e2e
pnpm test:ui
pnpm smoke:dev:stub
```

## Rules

1. **All issues are blocking** - There is no such thing as "someone else's problem"
2. **Fix, don't disable** - Never use `eslint-disable`, `@ts-ignore`, or similar escapes
3. **Restart on fix** - After fixing any issue, restart from `pnpm format:root`
4. **No skipping** - Every gate must pass before proceeding to the next

## Process

For each gate in the sequence above:

- If the gate fails, fix the issue
- After fixing, restart from `pnpm format:root`
- If the gate passes, proceed to the next one

The full sequence mirrors `pnpm check` in `package.json`.

## Success Criteria

All gates pass without:

- Disabled checks
- Skipped tests
- Type assertions (`as`, `any`, `!`)
- Ignored errors

When complete, confirm: "All quality gates pass."
