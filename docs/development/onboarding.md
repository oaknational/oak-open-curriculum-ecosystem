# Developer Onboarding

Welcome to the Oak MCP ecosystem. This guide points you to the documentation, plans, and tooling you need in your first pass through the repository.

## 1. Read the Grounding Docs

1. `GO.md` – follow the cadence (ACTION → REVIEW, every sixth task is GROUNDING).
2. `.agent/directives-and-memory/AGENT.md` and `.agent/directives-and-memory/rules.md` – British spelling, TDD, no disabled quality gates.
3. The UX plan and context you are working from (for Semantic Search: `.agent/plans/semantic-search/*`).

## 2. Understand the Repository Layout

- [`README.md`](../../README.md) – high-level description of the ecosystem and shared parsing helpers.
- [`packages/sdks/oak-curriculum-sdk/README.md`](../../packages/sdks/oak-curriculum-sdk/README.md) – SDK generation pipeline, MCP tool exports, validation helpers.
- [`apps/oak-open-curriculum-semantic-search/README.md`](../../apps/oak-open-curriculum-semantic-search/README.md) – ingestion, admin flows, hybrid search.
- MCP server READMEs (`apps/oak-curriculum-mcp-*`) – running stdio/HTTP servers locally or on Vercel.

## 3. Install & Regenerate Types

```bash
pnpm install
pnpm make   # install → type-gen → build → doc-gen → lint → format
pnpm qg     # format-check → type-check → lint → markdownlint → tests → smoke
```

`pnpm type-gen` rebuilds the SDK and the shared `parseSchema` helper so every workspace stays aligned with the OpenAPI schema.

## 4. Shared Parsing Helpers

- `parseSchema`, `parseWithCurriculumSchema`, `parseEndpointParameters`, and `parseSearchResponse` use `schema.safeParse` with generated `_input`/`_output` types.
- Request validators (`request-validators.ts`) and search validators (`search-response-validators.ts`) import these helpers; **never** re-implement validation logic in consumers.
- ADR-048 documents this pattern and when to extend it (e.g. for new request payloads).

## 5. Workspace Priorities

- **SDK (`packages/sdks/oak-curriculum-sdk`)** – keep generation scripts deterministic, update docs via `pnpm doc-gen`, and ensure new helpers are exported from `src/validation/index.ts`.
- **Semantic Search (`apps/oak-open-curriculum-semantic-search`)** – prioritise admin workflows (index management, rollups, telemetry) before the status page as per the UX plan.
- **MCP Servers** – consume SDK exports directly; configuration examples live in the app READMEs.

## 6. Documentation Expectations

- Update the relevant README whenever behaviour or setup changes.
- Add or update ADRs when a new architectural rule emerges (e.g. shared parsing, ingestion flow).
- Record validation learnings in the plan (Tasks 22/23) and share cross-stream actions in continuation prompts.

## 7. Quality Gate Checklist

```bash
pnpm format
pnpm type-check
pnpm lint
pnpm test
pnpm doc-gen
```

Keep CI green locally; no `--no-verify` or disabled lint rules.

## 8. Useful References

- [docs/README.md](../README.md)
- [docs/architecture/architectural-decisions/](../architecture/architectural-decisions/)
- [docs/agent-guidance/development-practice.md](../agent-guidance/development-practice.md)
- [docs/agent-guidance/testing-strategy.md](../agent-guidance/testing-strategy.md)

Welcome aboard! Keep the documentation close to the code and prefer the shared helpers over bespoke validation.
