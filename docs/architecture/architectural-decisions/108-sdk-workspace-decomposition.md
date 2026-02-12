# ADR-108: SDK Workspace Decomposition

## Status

Accepted

## Context

The current `@oaknational/oak-curriculum-sdk` workspace is a
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

## Decision

Decompose `@oaknational/oak-curriculum-sdk` along two
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
  currently openapi-zod-client, to be replaced by Castr)
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

**Contains**:

- Schema decoration (canonicalUrl, 404 enhancement)
- Security configuration (PUBLIC_TOOLS, DEFAULT_AUTH_SCHEME)
- Tool naming overrides (path-specific overrides)
- Domain guidance (DOMAIN_PREREQUISITE_GUIDANCE)
- Widget constants (BASE_WIDGET_URI)
- Search/ES generation (mappings, field definitions, index
  documents, search responses, facets, subject hierarchy)
- Bulk generation, vocabulary generation, admin/observability
  fixtures
- The orchestrator wiring Oak config into the generic pipeline
- Schema cache with Oak OpenAPI snapshots

**Consumers**: Workspace 4 (Oak Runtime), via the generated
artifacts it produces.

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
workspace 3's framework with workspace 2's generated
artifacts and adds Oak-specific runtime behaviour.

**Contains**:

- Oak client configuration (API URL, API key, rate limits)
- Response augmentation (canonical URL injection)
- Aggregated tools (search, fetch, get-ontology, get-help,
  get-knowledge-graph, get-thread-progressions,
  get-prerequisite-graph)
- Domain features (ontology, knowledge graph, synonyms)
- Agent support (documentation resources, getting-started)
- Generated artifacts (output of workspace 2)
- Public API exports (./client, ./mcp, ./validation, etc.)

**Consumers**: MCP server apps (stdio, streamable-http),
Search SDK.

## Dependency Graph

```text
[Generation Time]
  Castr/Zod Generator
        |
        v
  WS1: Generic Pipeline
        |
        v
  WS2: Oak Type-Gen Config --generates--> artifacts

[Runtime]
  WS3: Generic Runtime Framework
        |
        v
  WS4: Oak Runtime SDK (+ artifacts from WS2)
        |
        v
  MCP servers, Search SDK
```

Key property: no cycles, all arrows point downward. The
generic workspaces (1, 3) have no knowledge of Oak. The
Oak workspaces (2, 4) compose the generic workspaces with
domain configuration.

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
   generation/runtime boundary. This is the existing
   [SDK workspace separation plan][ws-sep].

2. **Step 2 (Castr integration)**: Replace
   openapi-zod-client with Castr as the Zod generation
   strategy. This validates the pluggable generator
   interface.

3. **Step 3 (generic extraction)**: Extract workspace 1
   (Generic Pipeline) from workspace 2, introducing the
   plugin/hook interface. Extract workspace 3 (Generic
   Runtime) from workspace 4.

Steps 1 and 2 are immediate priorities. Step 3 follows
naturally once the generation/runtime boundary is
established and proven.

## Relationship to Castr

Castr replaces openapi-zod-client as the Zod generation
strategy. In this architecture:

- Castr is a dependency of workspace 1 (Generic Pipeline)
- Workspace 1 defines the interface; Castr satisfies it
- Oak Type-Gen (workspace 2) never interacts with Castr
  directly

The existing `packages/core/openapi-zod-client-adapter/`
validates the adapter pattern. After the split, the
adapter's functionality is absorbed into workspace 1 as a
pluggable strategy. When Castr is ready, it takes the
adapter's place.

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

## References

- [ADR-030: SDK as Single Source of Truth](030-sdk-single-source-truth.md)
- [ADR-031: Generation-Time Extraction](031-generation-time-extraction.md)
- [ADR-035: Unified SDK-MCP Type Generation](035-unified-sdk-mcp-type-generation.md)
- [ADR-038: Compilation-Time Revolution](038-compilation-time-revolution.md)
- [ADR-041: Workspace Structure Option A](041-workspace-structure-option-a.md)
- [SDK Workspace Separation Plan](../../../.agent/plans/pipeline-enhancements/sdk-workspace-separation-plan.md)
- [Castr Requirements](../../../.agent/plans/external/castr/README.md)

[ws-sep]: ../../../.agent/plans/pipeline-enhancements/sdk-workspace-separation-plan.md
