# Developer Onboarding

Welcome to the Oak MCP ecosystem. This guide points you to the documentation, plans, and tooling you need in your first pass through the repository.

## 1. Understand the Core Architecture

**The OpenAPI-First Pipeline**:

Everything in this repository flows from OpenAPI specifications:

1. **`pnpm type-gen`** fetches the Oak Curriculum OpenAPI schema
2. **SDK generation** creates TypeScript types, Zod validators, and MCP tool metadata
3. **MCP servers** import the generated tools - no manual mapping
4. **Applications** import the generated types - no manual definitions

**The Cardinal Rule**: If the upstream API changes, `pnpm type-gen` is sufficient to update everything.

Read the full explanation: [OpenAPI Pipeline Architecture](../architecture/openapi-pipeline.md)

**Key ADRs**:

- [ADR-029](../architecture/architectural-decisions/029-no-manual-api-data-structures.md) - No manual API data structures
- [ADR-030](../architecture/architectural-decisions/030-sdk-as-single-source-of-truth.md) - SDK as single source of truth
- [ADR-031](../architecture/architectural-decisions/031-generation-at-build-time.md) - Generation at build time

## 2. Read the Grounding Docs

1. `GO.md` – follow the cadence (ACTION → REVIEW, every sixth task is GROUNDING).
2. `.agent/directives-and-memory/AGENT.md` and `.agent/directives-and-memory/rules.md` – British spelling, TDD, no disabled quality gates.
3. Relevant plans and context documents for the area you're working on (e.g., `.agent/plans/semantic-search/*` for search features).

## 3. Understand the Repository Layout

- [`README.md`](../../README.md) – high-level description of the ecosystem and shared parsing helpers.
- [`packages/sdks/oak-curriculum-sdk/README.md`](../../packages/sdks/oak-curriculum-sdk/README.md) – SDK generation pipeline, MCP tool exports, validation helpers.
- [`apps/oak-open-curriculum-semantic-search/README.md`](../../apps/oak-open-curriculum-semantic-search/README.md) – ingestion, admin flows, hybrid search.
- MCP server READMEs (`apps/oak-curriculum-mcp-*`) – running stdio/HTTP servers locally or on Vercel.

## 4. Install & Regenerate Types

```bash
pnpm install
pnpm make   # install → type-gen → build → doc-gen → lint → format
pnpm qg     # format-check → type-check → lint → markdownlint → tests → smoke
```

`pnpm type-gen` rebuilds the SDK and the shared `parseSchema` helper so every workspace stays aligned with the OpenAPI schema.

## 5. Verify Your Setup (No API Keys Required)

Before configuring environment variables, verify your basic setup works:

```bash
pnpm test          # Run unit tests - should all pass
pnpm type-check    # Verify types compile
pnpm lint          # Check code style
```

If these pass, you have a working development environment! Environment variables are only needed for running servers and E2E tests.

See [Environment Variables Guide](./environment-variables.md) for complete setup details when you're ready.

## 6. Shared Parsing Helpers

- `parseSchema`, `parseWithCurriculumSchema`, `parseEndpointParameters`, and `parseSearchResponse` use `schema.safeParse` with generated `_input`/`_output` types.
- Request validators (`request-validators.ts`) and search validators (`search-response-validators.ts`) import these helpers; **never** re-implement validation logic in consumers.
- ADR-048 documents this pattern and when to extend it (e.g. for new request payloads).

## 7. Workspace Priorities

- **SDK (`packages/sdks/oak-curriculum-sdk`)** – keep generation scripts deterministic, update docs via `pnpm doc-gen`, and ensure new helpers are exported from `src/validation/index.ts`.
- **Semantic Search (`apps/oak-open-curriculum-semantic-search`)** – prioritise admin workflows (index management, rollups, telemetry).
- **MCP Servers** – consume SDK exports directly; configuration examples live in the app READMEs.

## 8. Documentation Expectations

- Update the relevant README whenever behaviour or setup changes.
- Add or update ADRs when a new architectural rule emerges (e.g. shared parsing, ingestion flow).
- Document architectural patterns and generation improvements.

## 9. Quality Gate Checklist

```bash
pnpm format
pnpm type-check
pnpm lint
pnpm test
pnpm doc-gen
```

Keep CI green locally; no `--no-verify` or disabled lint rules.

## 10. Useful References

- [docs/README.md](../README.md)
- [docs/architecture/architectural-decisions/](../architecture/architectural-decisions/)
- [docs/agent-guidance/development-practice.md](../agent-guidance/development-practice.md)
- [Testing Strategy](../../.agent/directives-and-memory/testing-strategy.md) - TDD approach at all levels

Welcome aboard! Keep the documentation close to the code and prefer the shared helpers over bespoke validation.
