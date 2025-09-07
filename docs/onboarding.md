# Onboarding

Welcome! This is a quick path to productive changes.

1) Read these docs in order:
- Root README (repo layout and commands)
- `docs/architecture/README.md`
- `docs/architecture/provider-system.md`
- `docs/architecture/architectural-decisions/`

2) Build and test:
```bash
pnpm i
pnpm type-check && pnpm lint && pnpm test && pnpm build
```

3) Development tips:
- Inter‑workspace imports must use `@oaknational/*` packages.
- Intra‑package relative imports are fine; avoid private internals.
- Use Vitest; prefer type guards and precise types.

4) Where to make changes:
- Apps: `apps/*` (servers and wiring)
- Core: `packages/core/mcp-core`
- Libs: `packages/libs/*`
- Providers: `packages/providers/*`

5) Identity check (legacy names):
```bash
pnpm identity-report
```

You’re set. Pick an issue or follow the active plan in `.agent/plans/`.
