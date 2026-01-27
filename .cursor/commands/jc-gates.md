# Quality Gates

Run the quality gates one by one from the repo root. Fix any and all issues that arise, regardless of location or cause.

After each fix, **restart the quality gate sequence from the beginning**. This prevents regressions to earlier gates from later fixes.

## The Sequence

Run each gate in order. If a gate fails, fix the issues before proceeding.

```bash
pnpm format:root
pnpm lint:fix
pnpm type-check
pnpm test
pnpm test:e2e
```

## Rules

1. **All issues are blocking** - There is no such thing as "someone else's problem"
2. **Fix, don't disable** - Never use `eslint-disable`, `@ts-ignore`, or similar escapes
3. **Restart on fix** - After fixing any issue, restart from `pnpm format:root`
4. **No skipping** - Every gate must pass before proceeding to the next

## Process

1. Run `pnpm format:root`
   - If changes were made, commit them separately
   - Proceed to next gate

2. Run `pnpm lint:fix`
   - If issues remain after auto-fix, fix them manually
   - After manual fixes, restart from step 1
   - If clean, proceed to next gate

3. Run `pnpm type-check`
   - If type errors, fix them
   - After fixes, restart from step 1
   - If clean, proceed to next gate

4. Run `pnpm test`
   - If test failures, fix them (product code or tests as appropriate)
   - After fixes, restart from step 1
   - If clean, proceed to next gate

5. Run `pnpm test:e2e`
   - If E2E failures, fix them
   - After fixes, restart from step 1
   - If clean, all gates pass

## Success Criteria

All gates pass without:

- Disabled checks
- Skipped tests
- Type assertions (`as`, `any`, `!`)
- Ignored errors

When complete, confirm: "All quality gates pass."
