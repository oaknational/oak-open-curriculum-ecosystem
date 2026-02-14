please run the quality gates one by one in the repo root. Fix any and all issues that arise, regardless of location or cause. After each fix, start the quality gate sequence again, this prevents regressions to earlier gates from later fixes.

The sequence is:

pnpm type-gen
pnpm build
pnpm type-check
pnpm format:root
pnpm markdownlint:root
pnpm lint:fix
pnpm test
pnpm test:e2e
