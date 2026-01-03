# Onboarding

Welcome! This is a quick path to productive changes.

## 1. Read these docs in order

- [Root README](../README.md) — repo layout and commands
- [OpenAPI Pipeline](architecture/openapi-pipeline.md) — **THE** architecture doc
- [Data Variances](data/DATA-VARIANCES.md) — subject/key stage differences
- [Architecture Decision Records](architecture/architectural-decisions/)

## 2. Build and test

```bash
pnpm i
pnpm type-gen          # Generate types from OpenAPI schema
pnpm build             # Build all workspaces
pnpm type-check && pnpm lint && pnpm test
```

## 3. Development tips

- **Cardinal Rule**: All types flow from the OpenAPI schema via `pnpm type-gen`
- Inter-workspace imports must use `@oaknational/*` packages
- Use Vitest; prefer type guards and precise types
- Never use `any`, `as`, or type assertions

## 4. Where to make changes

| Area  | Location                           |
| ----- | ---------------------------------- |
| Apps  | `apps/*` (servers, search app)     |
| SDK   | `packages/sdks/oak-curriculum-sdk` |
| Libs  | `packages/libs/*`                  |
| Plans | `.agent/plans/*`                   |

## 5. Key data differences

Before working on search or data:

- **MFL subjects** (French, Spanish, German) have 0% transcript coverage
- **KS4** has tiers, exam boards, pathways not in KS1-3
- **Categories** only exist in English, Science, RE
- See [Data Variances](data/DATA-VARIANCES.md) for full details

## 6. Next steps

You're set! Pick an issue or follow the active plan in `.agent/plans/`.

For comprehensive onboarding, see [Developer Onboarding](development/onboarding.md).
