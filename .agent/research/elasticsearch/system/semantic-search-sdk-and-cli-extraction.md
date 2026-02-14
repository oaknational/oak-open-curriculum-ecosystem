## Semantic Search: CLI/SDK-first; retire hosted API routes

**Date**: 2026-01-01  
**Status**: DECISION (documenting CLI/SDK-only; no hosted API routes)  
**Audience**: Oak engineers + agents working on Elasticsearch-backed curriculum search and MCP tooling

---

## Why this document exists (right problem, right layer)

We currently have a workspace at `apps/oak-search-cli/` that is _packaged_ as a Next.js App Router “app”, but is _used_ primarily as:

- a **search/indexing library** (`src/lib/**`, `src/adapters/**`)
- a **collection of operational scripts/CLIs** (`scripts/**`, plus an existing CLI under `src/lib/elasticsearch/setup/cli.ts`)

The Next.js **UI** and **HTTP surface** exist in the repo, but they are **no longer part of the active system** and should not be extended.

Based on stakeholder intent (captured in this thread):

- **No UI is currently used**
- **No HTTP service is currently needed**
- The goal is a **search SDK** consumed by an **Express-based MCP server**, with **NL handling living in MCP**, expressed as comprehensive tool examples mapping user intent → SDK calls
- The “admin app” should be **local-first** and likely **CLI-driven**, not a deployed Next.js service

Decision: the workspace is **CLI/SDK-only**. Hosted API routes are retired. Any Next.js patterns worth keeping should live only as documentation/examples.

This is a system-level simplification (fewer deployed surfaces, clearer boundaries, better DX) that keeps the Elasticsearch / IR work intact.

---

## Constraints and non-negotiables (repo foundations)

These are the foundation constraints that shape the decision:

- **Schema-first** (Cardinal Rule): static types/guards/validators flow from the Open Curriculum OpenAPI schema and are generated at type-gen time (see `.agent/directives/rules.md` and `.agent/directives/schema-first-execution.md`).
- **Type discipline**: external inputs are `unknown`, validated immediately, and then **never widened** again; avoid `as`, `any`, `!`, broad `Record`, `Object.*`, `Reflect.*` patterns (see `.agent/directives/rules.md`).
- **TDD**: behaviour-first tests, prefer pure functions; integration points accept simple injected fakes (see `.agent/directives/testing-strategy.md`).
- **No compatibility layers**: refactor by replacing, not “supporting both”.

This decision includes an implementation plan that requires periodically re-reading and re-committing to those docs (see “Implementation plan”).

---

## Current state: what’s really built (evidence-based)

### Workspace layout (high-signal)

In `apps/oak-search-cli/` we have:

- **Core library (durable value)**
  - `src/lib/**`: hybrid retrieval (BM25 + ELSER + optional dense vectors), RRF builders, indexing transforms, ES setup helpers, zero-hit observability, suggestions.
  - `src/adapters/**`: Oak SDK adapters (including caching + threads utilities).
- **Operational scripts / CLI (durable value)**
  - `src/lib/elasticsearch/setup/cli.ts`: CLI (setup/reset/status).
  - `src/lib/elasticsearch/setup/ingest-live.ts`: ingestion CLI (API mode + bulk-first mode).
  - `scripts/**` and `operations/**`: ingestion/diagnostics/observability helpers.
- **Deprecated Next.js adapter**
  - `app/api/**` and `app/ui/**` are not part of the current runtime and should be treated as archived patterns only.

This matches the repo’s own description in `apps/oak-search-cli/README.md` (“Next.js App Router workspace… serves server-side RRF…”), but _usage has shifted_: the “app” is acting as a convenient wrapper around a search/indexing toolkit.

### Key “SDK-ish” signals already present

- **Search and index types flow from the SDK** via `@oaknational/curriculum-sdk/public/search.js` and are re-exported in `apps/oak-search-cli/src/types/oak.ts`.
- **Indexing and retrieval are already modularised** in `src/lib/indexing/**` and `src/lib/hybrid-search/**`.
- **Setup and mappings are SDK-led**: `src/lib/elasticsearch/setup/index.ts` uses `@oaknational/curriculum-sdk/elasticsearch.js` for mappings and `@oaknational/curriculum-sdk/public/mcp-tools` for synonyms.
- **CLI ingestion is first-class**: `src/lib/elasticsearch/setup/ingest-live.ts` and `src/lib/elasticsearch/setup/ingest-bulk.ts` wrap `src/lib/indexing/ingest-harness.ts` and `src/lib/indexing/bulk-ingestion.ts`.

### Key “app-shaped” coupling that blocks a clean SDK boundary (to address during extraction)

These are the biggest blockers to a portable “SDK”:

- **Global configuration**:
  - `src/lib/env.ts` reads `process.env` directly and throws on invalid env.
- **Singleton infrastructure clients**:
  - `src/lib/es-client.ts` memoises a global `Client` using `env()`
  - `src/adapters/oak-adapter-sdk.ts` memoises a global Oak SDK client using `env()`
- **Next.js-specific adapter code**:
  - Retain only as documentation examples; do not treat as runtime dependencies.

For an SDK, the consuming app (MCP server, local CLI) must provide config and dependencies explicitly. That is now a stated requirement.

---

## Elasticsearch context (what we’re building “around”)

This decision is about package boundaries, but it is grounded in the Elasticsearch capabilities the system already relies on:

- **Hybrid retrieval**:
  - lexical BM25 queries over curated fields
  - semantic retrieval via **ELSER** over `semantic_text` fields
  - fusion via **RRF** retriever (server-side fusion in Elasticsearch)
- **Suggestions**:
  - completion suggester + `search_as_you_type` fallback
- **Optional reranking**:
  - evaluated in repo research; reranking has sharp trade-offs and field-length constraints

Internal repo research already documents these decisions and empirical evaluation:

- `.agent/research/elasticsearch/system/assumptions-validation.md`
- `.agent/research/elasticsearch/system/hybrid-search-reranking-evaluation.md`
- `.agent/research/elasticsearch/methods/hybrid-retrieval.md`

This document does not re-evaluate ranking; it focuses on where the code should live to maximise reuse, maintainability, and MCP integration.

---

## The “right layer” target: SDK + CLI + docs/examples

### Direction summary

We want:

- a **Search SDK** (library) that exposes **services** (not just functions)
- a **first-class CLI/admin surface** (local-only) that consumes those services
- **no hosted API routes** or Next.js runtime dependency
- a lightweight “future service adapter” option later (Next.js or other), but not now
- extracted UI patterns and route orchestration captured as **docs/examples**, not a built artifact

### Important separation: retrieval vs admin vs adapters

To keep the SDK clean and composable, treat these as explicit layers:

- **Retrieval (read path)**: hybrid search + suggestions + result shaping. Calls Elasticsearch `/_search` and `/_suggest`-equivalent operations.
- **Admin/indexing (write path)**: setup, ingestion, rollups, alias swap, metadata writes, telemetry maintenance. Calls Elasticsearch write APIs (`_bulk`, index creation, synonyms, etc.).
- **Adapters (integration points)**: “how to talk to Elasticsearch”, “how to fetch Oak curriculum data”, “how to log”, “how to cache”, “how to read config”.

The current code already mostly follows this separation; the extraction work is about:

1. making the boundaries explicit and stable, and
2. removing environment/singleton assumptions from the reusable parts.

---

## Proposed target architecture (SDK + CLI) — concrete shape

### Packaging options (choose one)

There are two reasonable packaging end-states; both satisfy “SDK first”:

1. **Create a new SDK workspace under `packages/libs/`**, leaving `apps/oak-search-cli` to be retired.
   - Pros: aligns with repo architecture (`packages/libs` is the “runtime-adaptive library” layer).
   - Cons: requires moving code + updating import paths.

2. **Convert the existing workspace into a library package** (remove Next.js, rename directories), and relocate it from `apps/` to `packages/libs/`.
   - Pros: preserves history and package name continuity.
   - Cons: bigger mechanical change (workspace relocation + deleting Next build scaffolding).

This document recommends **Option 1** for blast-radius control: extract a clean SDK package first, then delete/archive the Next.js app layer once consumers have migrated.

### Recommended new package name

Keep naming honest and stable. The current name is `@oaknational/search-cli` (private) but “semantic-search” is overloaded with “Next app”.

Proposed:

- **Library**: `@oaknational/open-curriculum-search-sdk` (or `@oaknational/open-curriculum-search`)
- **CLI**: `@oaknational/open-curriculum-search-cli`

The exact names can be decided later; the important part is: **one package is the SDK**, one is the CLI/app.

### Suggested SDK directory layout (matches “src/retrieval, src/admin…”)

This is the concrete shape implied by the decisions above:

```text
packages/libs/open-curriculum-search-sdk/
  src/
    retrieval/        # search + suggestions (read path)
    admin/            # setup + ingestion + rollups (write path)
    observability/    # zero-hit capture + persistence + telemetry reads
    adapters/         # Oak + ES adapters (narrow interfaces, not singletons)
    config/           # runtime validation for SDK config objects
    index.ts          # public exports (services + types)
```

The CLI becomes a separate workspace (and can itself use `src/cli/**` internally), rather than living inside the SDK.

### Mapping: current code → proposed SDK modules (concrete)

This mapping is intentionally mechanical; it reduces ambiguity and makes extraction incremental.

| Current path (semantic search workspace)                | Proposed home (SDK)                            | Notes                                                                 |
| ------------------------------------------------------- | ---------------------------------------------- | --------------------------------------------------------------------- |
| `src/lib/hybrid-search/**`                              | `src/retrieval/hybrid/**`                      | Keep RRF/ELSER/BM25 logic together.                                   |
| `src/lib/run-hybrid-search.ts`                          | `src/retrieval/search-service.ts` (or similar) | Becomes the “service method” entrypoint.                              |
| `src/lib/suggestions/**`                                | `src/retrieval/suggestions/**`                 | Replace internal request types with generated types where possible.   |
| `src/lib/index-oak.ts` + `src/lib/index-oak-helpers.ts` | `src/admin/ingest/**`                          | Ingestion orchestration becomes an admin service.                     |
| `src/lib/indexing/**`                                   | `src/admin/indexing/**`                        | Keep transforms + bulk helpers under admin/indexing.                  |
| `src/lib/elasticsearch/setup/**`                        | `src/admin/es-setup/**`                        | Setup logic stays, CLI wrapper moves to CLI workspace.                |
| `src/lib/index-meta.ts`                                 | `src/admin/index-meta/**`                      | Index version metadata should be owned by admin layer.                |
| `src/lib/observability/**`                              | `src/observability/**`                         | Keep zero-hit pipeline cohesive; make IO injectable.                  |
| `src/adapters/**`                                       | `src/adapters/**`                              | Convert singletons → factories/interfaces; remove `env()` dependency. |
| `src/lib/env.ts`                                        | `src/config/**`                                | SDK should validate config objects, not process.env directly.         |
| `scripts/**`                                            | CLI workspace commands                         | Preserve behaviour, not file locations.                               |
| `app/api/**`                                            | removed/archived patterns (not runtime)        | Hosted API routes are retired.                                        |
| `app/ui/**`                                             | removed/archived patterns (not runtime)        | UI is not part of the active system.                                  |

---

## SDK design: “services” as the public surface

### Why services (vs. a bag of functions)

You asked for “services as the public SDK”. The payoff is real:

- You get **stable composition points** (MCP server, future HTTP adapter, local CLI) without leaking internals.
- You can keep the majority of the codebase in **pure functions** and expose only a few integration points.
- You can embed **policy** (timeouts, retries, logging) at the service layer, instead of scattering it.

### Public API sketch (conceptual)

The SDK should expose a single constructor that takes dependencies and validated config, and returns a small set of services:

```text
createSearchSdk({ deps, config }) -> {
  retrieval: { searchStructured, suggest },
  admin: { setup, status, ingest, rebuildRollups },
  observability: { recordZeroHit, readZeroHitSummary, purgeZeroHitEvents },
}
```

Key principles:

- **No `process.env` reads inside services**. All config comes from `config`.
- **No singleton clients**. The consumer supplies an Elasticsearch client and an Oak client (or client factories).
- **Types should flow from generated SDK artifacts where possible** (especially request/response shapes and index document schemas).

### Dependency injection (what the consumer must provide)

At minimum:

- **Elasticsearch client**: `@elastic/elasticsearch` `Client` instance (configured by consumer)
- **Oak curriculum client**: either the generated SDK client or a narrow adapter interface (configured by consumer)
- **Logger**: a logger interface (or `@oaknational/mcp-logger` style)
- **Clock/ID**: optional injectable helpers for deterministic tests (timestamps, request ids)

This aligns with the repo’s testing strategy: IO at integration points, pure functions inside.

---

## CLI design: first-class citizen, not “random scripts”

### What we have today (evidence)

We already have two CLI paradigms living side-by-side:

- A real CLI entrypoint under `src/lib/elasticsearch/setup/cli.ts` (supports `setup|reset|status|help`)
- A set of ad-hoc scripts under `scripts/**` (e.g. `scripts/sandbox/ingest.ts`) with bespoke flag parsing

This is a strong signal that the _intent_ was always “CLI first”, but the packaging never caught up.

### Proposal: a dedicated CLI package with a single entrypoint

Create a CLI workspace (recommended) that depends on the SDK package:

```text
packages/apps/open-curriculum-search-cli/
  src/
    cli/
      index.ts          # command dispatch
      commands/         # setup/status/ingest/rebuild/etc.
  bin/
    open-curriculum-search.ts  # thin Node shim, calls src/cli/index.ts
```

Or, if the repo prefers CLIs under `apps/`, place it in `apps/` (the important part is: it’s a first-class workspace with tests and docs).

### Command surface (suggested)

Model the CLI around operator intent:

- **`search-cli es setup`**: create indices + synonyms + mappings (serverless-ready)
- **`search-cli es status`**: verify connection + list oak indices + read `oak_meta` version metadata
- **`search-cli ingest`**: run ingestion for a chosen scope (subject/key-stage selection, batch control)
- **`search-cli rollup rebuild`**: rebuild rollups and completion payloads
- **`search-cli sandbox ingest`**: ingest from fixtures (for offline & deterministic runs)
- **`search-cli telemetry zero-hit purge`**: maintenance operations

All of these already exist in some form; the direction is to unify them behind one cohesive CLI that uses the same SDK services as the MCP server will.

---

## What to do with the Next.js layer (preserve patterns, not runtime)

### Keep as documentation/examples (recommended)

The Next.js layer has useful patterns worth preserving as documentation, even after retirement:

- **Caching model**: the “index version tag” approach (`SEARCH_INDEX_VERSION`) is a good conceptual model for future UI/app caching, even if the mechanism (Next `unstable_cache`) is Next-specific.
- **Fixture mode**: deterministic fixtures and a toggle are excellent DX patterns for offline development and repeatable evidence.
- **Ops UX patterns**: accessible status surfaces (`aria-live`, operator-friendly copy) are valuable references.

Instead of keeping Next as a deployable app, preserve it as:

- **Docs**: “how we built an adapter” (HTTP adapter patterns, caching semantics, fixture mode)
- **Examples**: small, runnable snippets or pseudo-code showing “if you later build an HTTP adapter, do it like this”

### Explicitly retire / delete (recommended)

Given “no UI, no HTTP layer needed”, the Next.js workspace becomes:

- build complexity (Next build, Playwright UI tests, SSR theming)
- dependency magnet (React, Next, styled-components, redoc)

The decision is to remove these from the active build graph and keep only the extracted docs/examples.

---

## MCP integration approach (Express MCP server consumes the SDK)

### NL stays in the MCP layer

This is the right choice:

- NL interpretation is product- and agent-behaviour-specific.
- It benefits from “tool examples” and instruction, not from hiding complexity inside the search SDK.
- It avoids coupling the search SDK to OpenAI/LLM choices.

Concretely: the MCP tool should ship **comprehensive examples** showing mappings like:

- “Find KS4 geography units about mountains” → `retrieval.searchStructured({ scope: 'units', text: 'mountains', subject: 'geography', keyStage: 'ks4' })`
- "Give me suggestions as I type 'pyth' in units" → `retrieval.suggest({ prefix: 'pyth', scope: 'units', ... })`
- “Reindex everything for ks3 maths (sandbox)” → `admin.ingest({ target: 'sandbox', subject: 'maths', keyStages: ['ks3'], ... })`

The tool docs become the place where NL heuristics live, and the SDK remains deterministic and testable.

---

## Elasticsearch UI options (future) — @Elasticsearch references

Even though we are not building a UI now, it’s worth explicitly capturing the “future UI” design space with @Elasticsearch references:

- **Elastic Search UI (React)**: Elastic’s `search-ui` is a reusable UI framework for search experiences.
  - Search UI reference: [@Elasticsearch: Search UI](https://www.elastic.co/docs/reference/search-ui)
  - Start guide (website search): [@Elasticsearch: Website Search quick start](https://www.elastic.co/guide/en/enterprise-search/current/website-search-start.html)
- **Search Applications (Elasticsearch-native)**: a way to define a “search application” over indices and query templates, potentially providing a stable contract for a UI connector.
  - Overview: [@Elasticsearch: Search applications](https://www.elastic.co/docs/solutions/search/search-applications)
  - Search endpoint: [@Elasticsearch: Search application search API](https://www.elastic.co/docs/api/doc/elasticsearch/operation/operation-search-application-search)

Fit notes (important):

- Our current system relies on **server-side RRF retrievers and `semantic_text` fields**. Any future UI connector must support (or at least not block) those request shapes.
- The Elastic Search UI framework can still be useful as **design/reference** even if we don’t use its connectors directly.

---

## Key risks / gaps to resolve during extraction (identified now)

This section is intentionally blunt: it enumerates the work required to make the SDK boundary “real” and compliant.

### 1) Global env + singletons are incompatible with an SDK boundary

Current patterns (env + memoised clients) must be replaced by explicit dependency injection.

### 2) Type discipline gaps inside the “lib”

Examples currently present (to address during extraction):

- internal request/response types that duplicate generated SDK types
- `unknown` in places where post-validation data should be strongly typed
- linter “REFACTOR” suppressions around `Object.*`/`Reflect.*`

The extraction is an opportunity to align the search SDK with repo-wide type discipline and remove entropy.

### 3) NL parsing currently lives in the semantic search workspace

`src/lib/query-parser.ts` currently couples to OpenAI. Per the decision, NL should live in MCP; the SDK should not ship this behaviour.

### 4) Documentation drift signals

Remove references to hosted API routes and ensure CLI/SDK examples are the authoritative integration points. Any remaining Next.js paths should be treated as archived patterns only.

---

## Implementation plan (future work; not executed here)

This is a high-level plan intended to guide the next engineering task. It is not a “do everything” list.

### Re-commit checkpoints (required)

At the start of each phase, re-read and re-commit to:

- `.agent/directives/rules.md`
- `.agent/directives/testing-strategy.md`
- `.agent/directives/schema-first-execution.md`

### Phase 0 — define the SDK contract

- Write a short “SDK public contract” doc: service names, method signatures, types, and error model (Result pattern).
- Identify which types can be imported from generated SDK artifacts and which must be authored (config types).

### Phase 1 — extract retrieval services

- Move query builders + response mapping into the new SDK package.
- Ensure all IO (ES calls) is behind injected clients.
- Write unit/integration tests around the service interface.

### Phase 2 — extract admin/indexing services

- Move ingestion + rollup + index-meta + setup helpers into the SDK.
- Make “Oak data fetching” an injected dependency (Oak client).
- Preserve current batching/backoff semantics.

### Phase 3 — build first-class CLI package

- Replace `scripts/**` functionality with CLI commands that call SDK services.
- Keep existing scripts only as _archived reference_ if needed.

### Phase 4 — integrate into Express MCP server

- Implement a `semantic-search` MCP tool that calls SDK services.
- Ship comprehensive examples mapping user intent → calls (NL policy belongs here).

### Phase 5 — retire Next.js app layer

- Remove Next app from active build graph.
- Preserve selected patterns as docs/examples.

### Quality gates

Run the full repo quality gate sequence one gate at a time, from repo root, after each phase (per repo policy).

---

## Appendix: existing research to reuse (do not duplicate)

This document should be read alongside:

- `.agent/research/elasticsearch/README.md` (index of research)
- `.agent/research/elasticsearch/system/assumptions-validation.md` (field/mapping correctness checks)
- `.agent/research/elasticsearch/system/hybrid-search-reranking-evaluation.md` (ranking + latency evaluation)
- `.agent/research/elasticsearch/methods/mcp-agent-integration.md` (current MCP patterns)
