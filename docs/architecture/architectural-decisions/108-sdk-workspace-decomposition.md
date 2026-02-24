# ADR-108: SDK Workspace Decomposition

## Status

Accepted

## Context

The current `@oaknational/curriculum-sdk` workspace is a
monolith containing approximately 180 files in `type-gen/`
and 80+ files in `src/`. It conflates four genuinely
independent concerns:

1. **Generic OpenAPI processing** — schema ingestion,
   TypeScript type generation, Zod schema generation,
   MCP tool descriptor emission, path utilities, response
   maps, request validators. None of this code has any
   knowledge of Oak's curriculum domain.

2. **Oak-specific type-gen configuration** — schema
   decoration (canonicalUrl injection, 404 documentation),
   security policy (which tools are public), tool naming
   overrides, domain prerequisite guidance, widget URI
   constants, Elasticsearch mapping generation, bulk schema
   generation, vocabulary generation, subject hierarchy.

3. **Generic runtime SDK framework** — typed HTTP client
   factory (wrapping openapi-fetch), middleware patterns
   (auth, retry, rate limiting), response validation
   framework, MCP tool execution dispatch. None of this
   code has knowledge of Oak's API or domain.

4. **Oak-specific runtime** — Oak API URL and key
   configuration, canonical URL response augmentation,
   aggregated tools (search, fetch, ontology, knowledge
   graph, synonyms), domain features, agent support.

These concerns are currently interleaved. Oak-specific
constants (`PUBLIC_TOOLS`, `THREAD_SCHEMA_NAMES`,
`BASE_WIDGET_URI`) are imported directly by generic-looking
generators. Generated files live in `src/types/generated/`
alongside hand-written runtime code. A change to the
OpenAPI processing logic can inadvertently touch Oak domain
code, and vice versa.

This violates several established principles:

- **ADR-030** (SDK as Single Source of Truth): the "SDK" is
  actually doing four different jobs
- **ADR-031** (Generation-Time Extraction): generation-time
  and runtime code are in the same workspace
- **ADR-041** (Workspace Structure): boundaries between
  workspaces should be explicit and enforceable

The monolithic structure also prevents reuse. External users
wanting an OpenAPI-to-SDK pipeline must take the entire Oak
SDK, including Oak-specific domain logic.

### Two Data Pipelines

A further structural insight is that the Oak-specific
generation concern (concern 2 above) contains two genuinely
separate data pipelines:

1. **API pipeline**: processes the OpenAPI spec to produce
   TypeScript types, Zod schemas, and MCP tool descriptors.
   Changes when the API schema changes. Consumed by the
   curriculum SDK runtime and MCP server apps.

2. **Bulk pipeline**: processes bulk download JSON files
   to produce bulk types, extractors, Elasticsearch
   mappings, knowledge graphs, and vocabulary artefacts.
   Changes when curriculum content changes. Consumed by
   the search SDK and search CLI.

The search SDK never calls the Oak API — it is purely an
Elasticsearch client whose data flows through the bulk
pipeline. The curriculum SDK runtime handles API access
(HTTP client, auth, MCP tools). At the package level the
search SDK still depends on the curriculum SDK runtime for
shared exports (e.g. `buildElasticsearchSynonyms`), but
the data sources are separate. The two SDKs are connected
at the MCP application layer, where aggregated tools
orchestrate both.

Both pipelines run during `pnpm type-gen` and produce
compile-time artefacts. They share the generation workspace
but are internally partitioned by directory and barrel
export. This partition does not warrant separate packages
at this stage — the boundary between them is a directory
boundary, not a package boundary — but it informs the
internal structure of workspace 2 and validates the
"generation as shared foundation" consumer model where
both runtime SDKs depend on generation for type
infrastructure.

## Decision

Decompose `@oaknational/curriculum-sdk` along two
orthogonal axes into four workspaces:

|                  | Generation-time       | Runtime              |
| ---------------- | --------------------- | -------------------- |
| **Generic**      | WS1: Generic Pipeline | WS3: Generic Runtime |
| **Oak-specific** | WS2: Oak Type-Gen     | WS4: Oak Runtime     |

### Workspace 1: Generic OpenAPI-to-SDK Pipeline

Transform any OpenAPI 3.x schema into typed SDK artifacts.

**Contains**:

- Schema ingestion (fetch, validate, cache)
- OpenAPI to TypeScript types
- OpenAPI to Zod v4 schemas (via pluggable generator,
  currently openapi-zod-client + openapi3-ts, both to be
  replaced by Castr)
- OpenAPI to MCP tool descriptors and executors
- Path utilities, response maps, request validators
- Operation extraction, parameter generation

**Does not contain**: Schema decoration, security policy,
tool name overrides, search/ES mappings, bulk schemas,
vocabulary generation, subject hierarchy.

**Plugin interface**: Exposes hook points for domain-specific
configuration without modification:

- Schema decoration hook (transform schema before generation)
- Security policy hook (classify tools as public/authenticated)
- Tool naming hook (override generated tool names)
- Tool description hook (append domain guidance)
- Custom generator hook (register additional generators)
- Output configuration (where to write files, naming)

This is dependency inversion: the generic pipeline defines
what it needs; domain-specific workspaces provide
implementations. No import from generic to domain-specific
code ever exists.

**Consumers**: Workspace 2 (Oak Type-Gen), and future
external users with different OpenAPI specs.

### Workspace 2: Oak Type-Gen Configuration

Configure the generic pipeline for the Oak Curriculum API
and add generators that produce Oak-specific artifacts.
Hosts two internally partitioned data pipelines.

**API pipeline** (processes the OpenAPI spec):

- Schema decoration (canonicalUrl, 404 enhancement)
- Security configuration (PUBLIC_TOOLS, DEFAULT_AUTH_SCHEME)
- Tool naming overrides (path-specific overrides)
- Domain guidance (DOMAIN_PREREQUISITE_GUIDANCE)
- Widget constants (BASE_WIDGET_URI)
- The orchestrator wiring Oak config into the generic pipeline
- Schema cache with Oak OpenAPI snapshots

**Bulk pipeline** (processes bulk download JSON files):

- Bulk data readers, extractors, generators, and processing
- Search/ES generation (mappings, field definitions, index
  documents, search responses, facets, subject hierarchy)
- Vocabulary generation
- Domain ontology (property graph data)
- Admin/observability fixtures

Both pipelines run during `pnpm type-gen`. They are
partitioned by directory and barrel export within the
workspace.

**Consumers**: Workspace 4 (Oak Runtime) via API pipeline
artifacts; Search SDK and search CLI via bulk pipeline
artifacts. The generation workspace serves as a shared
foundation for type infrastructure.

### Workspace 3: Generic Runtime SDK Framework

Reusable runtime framework for consuming generated artifacts.

**Contains**:

- Typed HTTP client factory (wrapping openapi-fetch)
- Middleware patterns (auth, retry, rate limiting) as
  configurable factories
- Response validation framework (operation ID lookup,
  schema-based validation via safeParse)
- MCP tool execution framework (dispatch, validation,
  universal tool listing)
- Generic error types (McpToolError, McpParameterError)

**Does not contain**: Oak base URL, Oak API key, Oak rate
limit configuration, aggregated tools, canonical URL
injection, ontology, knowledge graph, synonyms.

**Consumers**: Workspace 4 (Oak Runtime), and future
external users building runtime SDKs.

### Workspace 4: Oak Runtime SDK

The package that MCP server apps actually import. Composes
workspace 3's framework with workspace 2's API pipeline
artifacts and adds Oak-specific runtime behaviour. This
workspace is about **accessing the API** — HTTP client,
auth, middleware, MCP tool execution.

**Contains**:

- Oak client configuration (API URL, API key, rate limits)
- Response augmentation (canonical URL injection)
- Aggregated tools (search, fetch, get-ontology, get-help,
  get-knowledge-graph, get-thread-progressions,
  get-prerequisite-graph)
- Domain features (ontology, knowledge graph, synonyms)
- Agent support (documentation resources, getting-started)
- API pipeline artifacts (output of workspace 2)
- Public API exports (./client, ./mcp, ./validation, etc.)

**Consumers**: MCP server apps (stdio, streamable-http),
Search SDK (for shared runtime exports and functions, not
bulk data — this coupling is retained in Step 1).

## Dependency Graph

```text
[Generation Time]
  Castr/Zod Generator
        |
        v
  WS1: Generic Pipeline
        |
        v
  WS2: Oak Type-Gen Config
        |
        +--[API pipeline]---generates---> API types, Zod, MCP descriptors
        |
        +--[Bulk pipeline]--generates---> bulk types, extractors, ES mappings, vocab

[Runtime]
  WS3: Generic Runtime Framework
        |
        v
  WS4: Oak Runtime SDK (+ API pipeline artifacts from WS2)
        |
        v
  MCP servers (orchestrate both SDKs)

  Search SDK (+ bulk pipeline artifacts from WS2)
        |
        v
  Search CLI, MCP servers
```

Key property: no cycles, all arrows point downward. The
generic workspaces (1, 3) have no knowledge of Oak. The
Oak workspaces (2, 4) compose the generic workspaces with
domain configuration. WS2 serves as a shared foundation:
the curriculum SDK runtime consumes its API pipeline
output; the search SDK and search CLI consume its bulk
pipeline output.

### Consumer Model

Generation (WS2) is the shared foundation for type
infrastructure. All consumers depend on the generation
workspace for types, schemas, type guards, extractors, and
generated artefacts:

- The runtime SDK (WS4) imports API pipeline output from
  generation. It adds runtime concerns: HTTP client, auth,
  middleware, MCP tool execution.
- The search SDK imports bulk pipeline output from
  generation. It adds search-specific runtime: ES queries,
  index management, RRF scoring.
- The search CLI imports bulk pipeline output from
  generation directly.

There is no thin runtime facade that re-exports generation
artefacts. The runtime SDK's public API covers only runtime
concerns — not type re-exports. Consumers needing type
infrastructure (types, schemas, readers, extractors) import
from the generation package directly.

The distinction: the runtime SDK is for _accessing data_
(API client, middleware). Generation is for information
_about_ data (types, schemas, extractors, generated
artefacts).

## Why Four — Not More, Not Fewer

### Why not five or more?

**MCP as a separate workspace?** No. The Cardinal Rule
mandates that MCP tools are generated from the schema. The
MCP execution layer is thin (dispatch and error mapping).
Separating it would create an artificial boundary. The
sub-path exports (`./client`, `./mcp`) already allow
selective imports.

**Search type-gen as a separate workspace?** Not yet. It is
large (~60 files) but purely Oak-specific type-gen. It
belongs in workspace 2. If it develops its own consumers or
change cadence, it can be extracted later.

**Split the two data pipelines into separate workspaces?**
Not yet. The API pipeline and bulk pipeline have different
inputs (OpenAPI spec vs. bulk JSON files), different change
triggers (API schema changes vs. curriculum content changes),
and largely different consumers (curriculum SDK runtime vs.
search SDK/CLI). However, they share the generation
infrastructure (build tooling, output paths, `pnpm type-gen`
orchestration) and the bulk pipeline does import a small
number of constants from the API pipeline (e.g. `SUBJECTS`,
`KEY_STAGES`). The directory-level partition within
workspace 2 is sufficient for now. If the pipelines develop
truly independent change cadences or deployment needs, they
can be extracted into separate workspaces later.

**An interface/contract package?** No. Interfaces should be
defined in the workspace that owns the contract. Workspace 1
defines the plugin interface; workspace 3 defines the
runtime framework interface. A separate package would be
unnecessary indirection.

### Why not three or fewer?

**Merge the two generic workspaces?** No. Type-gen code runs
at build time with AST manipulation and file I/O
dependencies. Runtime code runs in production with HTTP
client and middleware dependencies. Mixing them would
include code generation dependencies in production bundles.

**Merge the two Oak workspaces?** No. That is essentially
the current state. The generation context (Node CLI at
build time) and runtime context (server at request time)
have different dependencies and change triggers.

## Phased Execution

The decomposition is implemented in phases:

1. **Step 1 (2-way split)**: Extract workspace 2 (Oak
   Type-Gen) from the current monolith, establishing the
   generation/runtime boundary. Both data pipelines (API
   and bulk) move to the generation workspace together.
   The generation workspace becomes a shared foundation:
   the curriculum SDK runtime consumes API pipeline output;
   the search SDK and search CLI consume bulk pipeline
   output. This is the existing
   [SDK workspace separation plan][ws-sep].

2. **Step 2 (Castr integration)**: Replace
   openapi-zod-client and openapi3-ts with Castr as the
   Zod generation strategy. The existing adapter can
   remain in place initially while Castr output is
   validated side-by-side; adapter removal is a
   subsequent step. This validates the pluggable
   generator interface.

3. **Step 3 (generic extraction)**: Extract workspace 1
   (Generic Pipeline) from workspace 2, introducing the
   plugin/hook interface. Extract workspace 3 (Generic
   Runtime) from workspace 4.

Steps 1 and 2 are immediate priorities. Step 3 follows
naturally once the generation/runtime boundary is
established and proven.

## Relationship to Castr

Castr replaces both openapi-zod-client and openapi3-ts as
the Zod generation and OpenAPI type strategy. In this
architecture:

- Castr is a dependency of workspace 1 (Generic Pipeline)
- Workspace 1 defines the interface; Castr satisfies it
- Oak Type-Gen (workspace 2) never interacts with Castr
  directly

The existing `packages/core/openapi-zod-client-adapter/`
validates the adapter pattern. The adapter can remain in
place initially while Castr output is validated
side-by-side against the existing pipeline. After the
split, the adapter's functionality is absorbed into
workspace 1 as a pluggable strategy. Once Castr output is
validated, the adapter and its openapi-zod-client +
openapi3-ts dependencies are removed.

## Consequences

### Positive

- Reusable generic pipeline: anyone with an OpenAPI spec
  can generate a typed SDK and MCP tools
- Clear, enforceable boundaries between workspaces
- Production bundles contain only runtime dependencies
- Oak-specific changes cannot accidentally break generic
  processing logic
- Castr integration has a clean target (workspace 1)
- Each workspace is independently testable

### Negative

- More workspaces to manage (4 instead of 1)
- Inter-workspace dependency management required
- Plugin interface design is non-trivial
- Migration effort is significant (phased to manage risk)

### Boundary Invariants

These rules are permanent consequences of the decomposition
and are enforced by ESLint SDK boundary rules:

1. **One-way dependency**: generation may not import from
   runtime. The generation workspace has no knowledge of
   runtime concerns.
2. **Subpath exports only**: runtime may import from
   generation only through declared subpath exports in
   `package.json`, never via deep imports to internal paths.
   Subpaths are one level deep only (e.g.
   `@oaknational/curriculum-sdk-generation/api-schema`,
   not `@oaknational/curriculum-sdk-generation/api-schema/errors`).
   Each subpath is backed by a hand-authored barrel file in
   `src/` that re-exports from generated files. The ESLint
   SDK boundary rule `createSdkBoundaryRules('runtime')` uses
   the pattern `@oaknational/curriculum-sdk-generation/*/**`
   to block two-or-more-level imports while allowing single-level
   subpath exports.
3. **Run from repo root**: `pnpm type-gen`, `pnpm build`,
   and all quality gates must be run from the repo root.
   After the split, the runtime workspace does not have a
   `type-gen` script. Turbo orchestrates cross-workspace
   dependencies from the root per ADR-065.
4. **File placement**: new generated files from the OpenAPI
   spec belong in the API pipeline (`type-gen/`,
   `src/types/generated/`). Files from bulk download JSON
   data belong in the bulk pipeline (`vocab-gen/`,
   `src/bulk/`, `src/generated/vocab/`). Runtime
   composition (wrapping generated data for MCP tool
   responses) stays in the runtime workspace.

## References

- [ADR-030: SDK as Single Source of Truth](030-sdk-single-source-truth.md)
- [ADR-031: Generation-Time Extraction](031-generation-time-extraction.md)
- [ADR-035: Unified SDK-MCP Type Generation](035-unified-sdk-mcp-type-generation.md)
- [ADR-038: Compilation-Time Revolution](038-compilation-time-revolution.md)
- [ADR-041: Workspace Structure Option A](041-workspace-structure-option-a.md)
- [SDK Workspace Separation Plan (Canonical)](../../../.agent/plans/semantic-search/active/sdk-workspace-separation.md)
- [Castr Requirements](../../../.agent/plans/external/castr/README.md)

[ws-sep]: ../../../.agent/plans/semantic-search/active/sdk-workspace-separation.md
