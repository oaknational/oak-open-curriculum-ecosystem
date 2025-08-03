please run the quality gates one by one in the repo root. Fix any and all issues that arise, regardless of location or cause. After each fix, start the quality gate sequence again, this prevents regressions to earlier gates from later fixes.

The sequence is:

pnpm format
pnpm lint:fix
pnpm check-types
pnpm test
pnpm test:e2e
