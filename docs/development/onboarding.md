# Developer Onboarding

Welcome to the Oak MCP ecosystem — infrastructure for AI agents and teacher search over Oak's openly-licensed curriculum. This guide points you to the documentation, plans, and tooling you need in your first pass through the repository.

> **Note**: This repo works with the [Oak Open Curriculum API](https://open-api.thenational.academy/) — Oak's openly-licensed curriculum data, organised to support reuse. See the root README for context on how this relates to Oak's main site.
>
> **Canonical path**: this is the single onboarding source of truth.
>
> **Audience**: human contributors (especially junior-to-mid-level developers).
>
> **AI agents**: onboarding starts with the `start-right` workflow:
>
> - Cursor command: [`.cursor/commands/jc-start-right.md`](../../.cursor/commands/jc-start-right.md)
> - Prompt: [`.agent/prompts/start-right.prompt.md`](../../.agent/prompts/start-right.prompt.md)
> - Skill: [`.agent/skills/start-right/SKILL.md`](../../.agent/skills/start-right/SKILL.md)
>   Then continue with [`.agent/directives/AGENT.md`](../../.agent/directives/AGENT.md).
>
> **Architecture source of truth**: Architectural Decision Records (ADRs) define how the system should work and are the architectural source of truth.

## 0. Choose Your Path

Pick the path that matches your first task:

| Path                | Best for                                                | Credentials needed                                                                                       |
| ------------------- | ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| SDK/docs path       | SDK generation, TypeScript, docs, tests                 | None                                                                                                     |
| MCP server path     | stdio/HTTP server feature work                          | `OAK_API_KEY`                                                                                            |
| Search/release path | Search app, Elasticsearch flows, npm release operations | Multiple service credentials (`OAK_API_KEY`, `ELASTICSEARCH_*`, plus release credentials where relevant) |

## 1. Understand the Core Architecture

**The OpenAPI-First Pipeline**:

Everything in this repository flows from OpenAPI specifications:

1. **`pnpm type-gen`** fetches the Oak Open Curriculum OpenAPI schema
2. **SDK generation** creates TypeScript types, Zod validators, and MCP tool metadata
3. **MCP servers** import the generated tools - no manual mapping
4. **Applications** import the generated types - no manual definitions

**The Cardinal Rule**: If the upstream API changes, `pnpm type-gen` is sufficient to update everything.

Read the full explanation: [OpenAPI Pipeline Architecture](../architecture/openapi-pipeline.md)

Start with the [ADR index](../architecture/architectural-decisions/), then read this lightweight foundational set:

**Foundational ADRs**:

- [ADR-029](../architecture/architectural-decisions/029-no-manual-api-data.md) - No manual API data structures
- [ADR-030](../architecture/architectural-decisions/030-sdk-single-source-truth.md) - SDK as single source of truth
- [ADR-031](../architecture/architectural-decisions/031-generation-time-extraction.md) - Generation-time extraction

## 2. Read the Grounding Docs

1. [`.agent/directives/AGENT.md`](../../.agent/directives/AGENT.md) – the canonical agent entry point. Links to rules, testing strategy, schema-first execution, and essential reading.
2. [`.agent/directives/rules.md`](../../.agent/directives/rules.md) – British spelling, TDD, no disabled quality gates, type safety, and all other mandatory rules.
3. [`.agent/directives/practice.md`](../../.agent/directives/practice.md) – a map of the agentic engineering practice: the system of rules, workflows, sub-agents, and quality gates that governs how work happens.
4. Relevant plans and context documents for the area you're working on (e.g., `.agent/plans/semantic-search/*` for search features).

## 3. Understand the Repository Layout

- [`README.md`](../../README.md) – high-level description of the ecosystem and shared parsing helpers.
- [`packages/sdks/oak-curriculum-sdk/README.md`](../../packages/sdks/oak-curriculum-sdk/README.md) – SDK generation pipeline, MCP tool exports, validation helpers.
- [`apps/oak-search-cli/README.md`](../../apps/oak-search-cli/README.md) – ingestion, admin flows, hybrid search.
- MCP server READMEs (`apps/oak-curriculum-mcp-*`) – running stdio/HTTP servers locally or on Vercel.

## 4. Install, Verify, and Regenerate

```bash
pnpm install
pnpm test       # Unit/integration suites that should pass without API keys
pnpm type-check # TypeScript compilation checks
pnpm lint:fix   # Linting and auto-fixes
pnpm make       # install → build (includes type-gen via Turbo deps) → type-check → doc-gen → lint:fix → markdownlint:root → format:root
```

`pnpm type-gen` rebuilds the SDK and the shared `parseSchema` helper so every workspace stays aligned with the OpenAPI schema.

## 5. Run Full Quality Gates (When Ready)

```bash
pnpm qg  # format-check:root → markdownlint-check:root → type-check → lint → test → test:ui → test:e2e → smoke
```

Use `pnpm qg` once you are ready to run full-gate validation across UI, E2E, and smoke suites. This is slower and typically requires service credentials.

See [Environment Variables Guide](./environment-variables.md) for complete setup details when you're ready.

### Known Gate Caveats

As of **20 February 2026**, this suite is known to fail in clean local runs:

- `apps/oak-curriculum-mcp-streamable-http/tests/widget/widget-rendering.spec.ts` (fails in `pnpm qg` via `test:ui`)

If `pnpm qg` fails, run the affected suite directly and check latest issues/ADRs/plans before assuming local setup problems.

## 6. Shared Parsing Helpers

- `parseSchema`, `parseWithCurriculumSchema`, `parseEndpointParameters`, and `parseSearchResponse` use `schema.safeParse` with generated `_input`/`_output` types.
- Request validators (`request-validators.ts`) and search validators (`search-response-validators.ts`) import these helpers; **never** re-implement validation logic in consumers.
- ADR-048 documents this pattern and when to extend it (e.g. for new request payloads).

## 7. Workspace Priorities

- **Curriculum SDK (`packages/sdks/oak-curriculum-sdk`)** – The type generation pipeline. Keep generation scripts deterministic, update docs via `pnpm doc-gen`, and ensure new helpers are exported from `src/validation/index.ts`.
- **Semantic Search (`apps/oak-search-cli`)** – The largest workspace. 4-way RRF hybrid search across 7 Elasticsearch indices, with ingestion, query processing, ground truth evaluation, and benchmark suite. Currently being extracted into a standalone Search SDK + CLI. See [ARCHITECTURE.md](../../apps/oak-search-cli/docs/ARCHITECTURE.md) for the full picture.
- **MCP Servers** – Expose the curriculum to AI agents. Consume SDK exports directly; configuration examples live in the app READMEs.

**Domain ADR handoffs** (read when you start work in that area):

- **SDK generation**: [ADR-029](../architecture/architectural-decisions/029-no-manual-api-data.md), [ADR-030](../architecture/architectural-decisions/030-sdk-single-source-truth.md), [ADR-031](../architecture/architectural-decisions/031-generation-time-extraction.md), [ADR-048](../architecture/architectural-decisions/048-shared-parse-schema-helper.md)
- **Semantic search**: [ADR-063](../architecture/architectural-decisions/063-sdk-domain-synonyms-source-of-truth.md), [ADR-074](../architecture/architectural-decisions/074-elastic-native-first-philosophy.md), [ADR-076](../architecture/architectural-decisions/076-elser-only-embedding-strategy.md)
- **MCP runtime/auth**: [ADR-107](../architecture/architectural-decisions/107-deterministic-sdk-nl-in-mcp-boundary.md), [ADR-113](../architecture/architectural-decisions/113-mcp-spec-compliant-auth-for-all-methods.md), [ADR-115](../architecture/architectural-decisions/115-proxy-oauth-as-for-cursor.md)

## 8. Documentation Expectations

- Update the relevant README whenever behaviour or setup changes.
- Add or update ADRs when a new architectural rule emerges (e.g. shared parsing, ingestion flow).
- Document architectural patterns and generation improvements.
- When renaming commands in `package.json`, search all markdown files for the old name and update them. See the [Command Naming](./build-system.md#command-naming-source-of-truth) section in the Build System docs.

## 9. Quality Gate Checklist

```bash
pnpm format:root        # Format code
pnpm markdownlint:root  # Lint markdown
pnpm type-check         # Verify types compile
pnpm lint:fix           # Check and auto-fix code style
pnpm test               # Unit and integration tests
pnpm doc-gen            # Generate API documentation
```

Keep CI green locally; no `--no-verify` or disabled lint rules. See [Build System](./build-system.md) for details on caching and gate ordering.

## 10. Understand Curriculum Data Variances

The Oak curriculum data has significant variances across subjects and key stages. Before working on search or ingestion:

- **Read**: [Data Variances](../data/DATA-VARIANCES.md) — transcript availability, structural patterns, KS4 complexity
- **Key insight**: MFL subjects (French, Spanish, German) have 0% transcript coverage; Maths has 100%
- **Key insight**: KS4 has tiers, exam boards, pathways that don't exist in KS1-3
- **Key insight**: Only 3 subjects (English, Science, RE) have categories

## 11. Useful References

- [docs/README.md](../README.md) - Documentation hub
- [Data Variances](../data/DATA-VARIANCES.md) - Subject/key stage differences
- [docs/architecture/architectural-decisions/](../architecture/architectural-decisions/) - ADRs
- [docs/agent-guidance/development-practice.md](../agent-guidance/development-practice.md) - Code standards
- [Testing Strategy](../../.agent/directives/testing-strategy.md) - TDD approach at all levels
- [ontology-data.ts](../../packages/sdks/oak-curriculum-sdk/src/mcp/ontology-data.ts) - Domain model and structural patterns
- [Release and Publishing](./release-and-publishing.md) - SDK publishing, operator runbook, rollback procedures

If you run into problems, check the [Troubleshooting Guide](./troubleshooting.md) first.

Welcome aboard! Keep the documentation close to the code and prefer the shared helpers over bespoke validation.
