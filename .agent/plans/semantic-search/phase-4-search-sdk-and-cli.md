# Phase 4: Search SDK + CLI Extraction

**Status**: 📋 PLANNED  
**Estimated Effort**: 3-6 days (depends on how much Next.js removal + CLI consolidation is bundled)  
**Prerequisites**: Phase 3 (Multi-Index Search & Fields)  
**Last Updated**: 2025-12-13

---

## Purpose (right problem, right layer)

We have built a powerful Elasticsearch-backed semantic search capability, but it is currently packaged as a Next.js “app”.

**Actual usage today**: scripts + `src/lib/**` (indexing, retrieval, observability).  
**Required usage next**: an **SDK** consumed by an **Express MCP server** (NL mapping stays in MCP), plus a **first-class local CLI** for admin/indexing workflows.  
**Not required now**: UI and HTTP API layers inside this workspace.

This phase makes the boundaries explicit:

- **SDK**: retrieval + admin + observability services, dependency-injected and testable
- **CLI**: a first-class workspace that consumes the SDK (not ad-hoc scripts)
- **Docs/examples**: preserve useful Next.js patterns (fixture mode, caching concepts, ops UX) as documentation only

Reference research: `.agent/research/elasticsearch/semantic-search-sdk-and-cli-extraction.md`

---

## Foundation Documents (MUST READ + RE-COMMIT)

Before starting, and again at each checkpoint below, re-read and explicitly re-commit to:

1. `.agent/directives-and-memory/rules.md`
2. `.agent/directives-and-memory/testing-strategy.md`
3. `.agent/directives-and-memory/schema-first-execution.md`

Additionally, ensure you are still solving the right problem at the right layer:

- **First question**: could it be simpler without compromising quality?
- **Layer question**: is this change best made in the SDK/type-gen layer, the CLI layer, or the MCP layer?

**All quality gates must pass. No exceptions.**

---

## Scope

### In scope

1. **Extract a Search SDK (services as public API)**
   - Retrieval: structured search + suggestions (hybrid BM25 + ELSER via RRF)
   - Admin: ES setup, ingestion, rollups, index metadata
   - Observability: zero-hit logging/persistence/maintenance
   - **Dependency-injected**: consuming app supplies config + clients (no `process.env` reads inside services)

2. **Promote CLI to first-class citizen**
   - Replace `scripts/**` ad-hoc entrypoints with a cohesive CLI workspace
   - Preserve behaviour, not file locations
   - Provide “operator intent” commands (setup/status/ingest/rollup/telemetry)

3. **Prepare MCP integration**
   - Express MCP server consumes the SDK
   - NL mapping lives in MCP via comprehensive tool examples (not inside SDK)

4. **Retire Next.js runtime from this workspace**
   - Remove the Next.js “app” layer from the active build graph once consumers have migrated
   - Preserve selected UI/HTTP patterns as docs/examples

### Explicitly out of scope

- Building a new UI (will live in a different app)
- Building a deployed HTTP API layer (may be Next.js later, but not now)
- Relevance re-tuning (Phase 3 remains the verification phase for IR correctness)

---

## Architectural decisions (must be explicit before moving files)

### 1) Where the SDK lives

Preferred: **`packages/libs/<search-sdk>/`** (aligns with repo architecture: shared runtime-adaptive libraries).

### 2) SDK public surface: “services”

Public API should be a small set of services returned from a constructor, for example:

- `createSearchSdk({ deps, config }) -> { retrieval, admin, observability }`

Key rule: **config and clients are provided by the consumer**. No internal singletons.

### 3) NL parsing responsibility

NL stays in the **MCP layer**. The SDK remains deterministic.

### 4) Types and schema-first discipline

- Search request/response/index doc types should flow from `@oaknational/oak-curriculum-sdk` generated artefacts.
- If a generated file is involved, **the generator is the source of truth** (update templates, rerun `pnpm type-gen`).

---

## Checkpoints (re-read foundation docs at each)

### Checkpoint A — Confirm assumptions + define contract (TDD entry)

- Confirm no production/active consumer depends on the Next.js UI or HTTP routes.
- Write down the proposed SDK service interfaces (public contract) and the CLI command surface.
- Identify what must remain schema-first (generated) vs what is authored (config objects, command routing).
- Write tests **first** for the new service boundary (unit/integration as appropriate).

### Checkpoint B — Extract Retrieval service (read path)

- Move/port retrieval logic (RRF query builders, result shaping, suggestions)
- Make Elasticsearch client + logging injectable
- Ensure the service surface is small and stable

### Checkpoint C — Extract Admin/Indexing service (write path)

- Move/port setup (synonyms, mappings, index creation), ingestion orchestration, rollups, index metadata
- Make Oak SDK client injectable (no env-based singletons)
- Preserve existing batching/backoff semantics and data integrity reporting

### Checkpoint D — Extract Observability service

- Move/port zero-hit event recording, persistence (if enabled), and maintenance operations
- Make persistence targets and fetch/logging injectable

### Checkpoint E — Build CLI workspace

- Create a first-class CLI workspace with `bin/` entrypoint
- Implement commands by calling SDK services (no duplicated business logic)
- Migrate the most-used existing scripts into CLI commands
- Keep legacy scripts only as archived reference if necessary

### Checkpoint F — MCP integration wiring

- Add / update the semantic search MCP tool in the Express MCP server to call SDK services
- Ship comprehensive tool examples mapping user intent to SDK calls
- Keep NL parsing policy in MCP (and test it there)

### Checkpoint G — Retire the Next.js layer from active builds

- Archive / remove the Next.js app code from the build graph
- Extract the best patterns into docs/examples for future UI/API adapters

---

## Quality gates (mandatory)

Run from repo root, one at a time, no filters:

```bash
pnpm type-gen          # Makes changes
pnpm build             # Makes changes
pnpm type-check
pnpm lint:fix          # Makes changes
pnpm format:root       # Makes changes
pnpm markdownlint:root # Makes changes
pnpm test
pnpm test:e2e
pnpm test:e2e:built
pnpm test:ui
pnpm smoke:dev:stub
```

---

## Notes: @Elasticsearch references for future adapters (non-goals in this phase)

Even though we are not building a UI/API layer now, future adapters should be designed with Elasticsearch-native capabilities in mind:

- Hybrid retrieval (RRF): `https://www.elastic.co/guide/en/elasticsearch/reference/current/rrf.html`
- Semantic search overview: `https://www.elastic.co/guide/en/elasticsearch/reference/current/semantic-search.html`
- ELSER: `https://www.elastic.co/guide/en/elasticsearch/reference/current/semantic-search-elser.html`





















