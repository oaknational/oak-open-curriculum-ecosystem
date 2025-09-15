# Semantic Search Documentation & Onboarding Plan

Role: This plan covers authored and generated documentation, TSDoc quality, and end‑to‑end onboarding flows at the repo root and per workspace. It extracts documentation content from `semantic-search-service-plan.md`.

Document relationships

- API plan: `semantic-search-api-plan.md`
- UI plan: `semantic-search-ui-plan.md`
- Archived source: `archive/semantic-search-service-plan.md`

---

## Objectives

- Achieve “excellent” documentation for exploration and teaching.
- Zero‑warning TypeDoc runs in SDK (and Search app if enabled) with curated public surfaces.
- Onboarding excellence: root README and each workspace guide a newcomer to working state quickly.

---

## Current status (docs)

- SDK TypeDoc hardened (`treatValidationWarningsAsErrors: true`), suppression removed; helper type exports completed (incl. `PathGroupingKeys`).
- Verification script derives expected Markdown pages from the generated index to match curated surfaces.
- Root `doc-gen` runs docs across workspaces; SDK and Search doc‑gen green.
- Authored Search docs updated: `SETUP.md`, `ARCHITECTURE.md`, `ROLLUP.md`, `SDK-ENDPOINTS.md`; authored vs generated clarified.

---

## Deliverables

1. README (root + Search workspace): purpose, architecture overview, Structured vs NL, screenshots.
2. Quick Start: env, dev server, index/rollup, sample queries; link to API docs.
3. Admin guidance: `x-api-key` safeguards; `/healthz`.
4. TSDoc pass on targeted modules (`hybrid-search`, `openapi*`, adapters, routes, UI components).
5. Generated docs: TypeDoc HTML + JSON (SDK; Search optionally) with zero warnings.
6. Onboarding/Troubleshooting: ES auth/indices, LLM disabled behaviour, Next/SDK integration, common errors.
7. Reuse guide: REST vs GraphQL/Hasura variants, adapter seams, rollup strategy.
8. MCP Tools docs: dedicated tree explaining that most tools are thin facades over Oak API; link to SDK docs.

Acceptance

- Newcomer can run, index, search, and understand architecture in ≤15 minutes.
- TSDoc present on all exported functions/types in target modules; example snippets compile.
- TypeDoc runs with zero warnings; curated entry points only.
- Onboarding/Quick Start/Troubleshooting cover top issues thoroughly.

---

## Tasks

1. Finalise SDK doc curation; confirm zero warnings; enforce in CI.
2. Author Search workspace README, Quick Start, Troubleshooting, Reuse guide updates.
3. Perform TSDoc pass across targeted modules.
4. Add MCP tools authored overview and link out to SDK docs; host under dedicated docs tree.

---

## Repo integration & quality gates

- Align with repo standards: British spelling, strict typing, no unsafe assertions.
- Root gates to run in order: `pnpm make`, then `pnpm qg`.
- See `docs/development/ci-policy.md` for details; ensure this workspace’s docs and TypeDoc runs are included.

---

## References

- Project docs under `docs/` (agent guidance, testing strategy, TypeScript practice).
- TypeDoc configuration and scripts in SDK workspace.
