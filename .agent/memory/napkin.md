# Napkin

## Session: 2026-02-24 (f) — Distillation

Distilled napkin from sessions 2026-02-22 to 2026-02-24 (873 lines).
Archived to `archive/napkin-2026-02-24.md`.

New entries added to distilled.md:

- Type predicate stubs with `noUnusedParameters`
- `as const satisfies T` for test data
- Interface Segregation eliminates assertion pressure
- ESM missing `.js` in barrel re-exports (E2E-only detection)
- TS2209 rootDir ambiguity after tsconfig narrowing
- Stale tsup entries match nothing silently
- Adapter packages must be rebuilt before type-gen
- When moving files, ESLint overrides and tests must move too
- `*.config.ts` glob doesn't match `*.config.e2e.ts`
- `export * from` banned by `no-restricted-syntax`
- Stale vitest include globs are silent

Pruned: Commander `this.args` (too narrow).

Documentation extractions completed before distillation:

1. Synonyms README — two-concern insight, Domain 4, consumer
   chains, co-location target state
2. ADR-063 — revision note about two-concern insight
3. Generation SDK README — subpath export table, status update
4. ESLint plugin README — `createSdkBoundaryRules` documentation
5. Type-helpers README — created with rationale, helpers table,
   assertion discipline
