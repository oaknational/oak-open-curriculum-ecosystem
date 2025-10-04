# UI Package Layout

Semantic search UI is organised into four layers:

- `global/` – cross-cutting primitives (header, theming, fixture controls, layout helpers)
- `search/` – landing, structured, and natural search surfaces plus supporting hooks/utilities
- `ops/` – operational surfaces (admin, status) that lean on the global layout primitives
- `shared/` – token helpers and shared utilities consumed by all layers

Components favour composability: global primitives expose tokens and responsive wrappers; surface directories compose them into full pages; leaf modules (e.g. hooks, utilities) live alongside their consumers. Tests sit next to the code they prove (`*.unit.test.ts` for pure functions, `*.integration.test.tsx` for composed components) so TDD remains the default workflow.
