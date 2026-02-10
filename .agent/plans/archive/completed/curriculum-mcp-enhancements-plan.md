<!-- markdownlint-disable -->

# Curriculum MCP Enhancements Plan

Date: 2025-09-12
Owner: Engineering (MCP/Oak SDK)

## Purpose

- Support the [OpenAI Connector standard for MCP](https://platform.openai.com/docs/mcp#create-an-mcp-server) servers by exposing `search` and `fetch` built to the OpenAI Connector standard, mounted alongside our existing MCP endpoint in the same Express app at a new path `/openai_connector`. These tools act as intelligent facades over existing SDK MCP tools. The `search` tool aggregates existing search endpoints initially; later it will be powered by the semantic search service.
- Extract common logic into a shared MCP library workspace (shared server core and error handling) used by both STDIO and Streamable HTTP apps.
- Migrate from the low‑level Server to MCP SDK abstractions (`McpServer`), removing duplicate validation while preserving the principle that all types, type guards, schemas, and validation are generated at compile time from the OpenAPI schema.
- Enable Resources and Prompts capabilities, and cross‑server

## New Type-Layering Approach (Adopted)

- Define base MCP types in a shared low‑level workspace (target: `packages/core/mcp-core`). These extend official `@modelcontextprotocol/sdk` `Tool` types minimally to capture the shapes we actually use (e.g., input schema structure), remaining strictly compatible.
- In the SDK, compose domain‑specific generic types from these bases (e.g., Zod builders for input schemas) and emit strict mapped types keyed by generated unions (e.g., `{ [K in ToolName]: ToolDescriptor & { name: K } }`).
- Emit `MCP_TOOLS` as a strict mapped type; each value embeds `name: K` so key and value identities are enforced at compile time.

- Guaranteeing precision beyond JSON:
  - Server‑kit functions are generic over the SDK’s strict map and return `ReadonlyArray<TMap[TNames]>` (the exact tool items), so no widening to JSON occurs.
  - Only the core adapter `toOfficialTools(McpBaseToolSet)` materialises MCP `OfficialTool[]` for server wiring. JSONish shapes are quarantined inside core.

Refinements (naming, boundaries, and adapters)

- Core (`packages/core/mcp-core`):
  - Provide vendor‑neutral base types:
    - `McpBaseToolInputSchemaBase`
    - `McpBaseTool`
    - `type McpBaseToolSet = readonly McpBaseTool[]`
    - `type McpBaseToolsMap<Names extends string> = { [K in Names]: McpBaseTool & { name: K } }`
  - Expose a narrow adapter for the actual MCP server wiring only:
    - `toOfficialTools(tools: McpBaseToolSet): OfficialTool[]`
  - Rule: No `@modelcontextprotocol/sdk` imports outside core; all other workspaces import the base types from core.

- SDK:
  - Export `OakCurriculumMcpTools: McpBaseToolsMap<ToolName>` (strict mapped type with key↔name equality).
  - Generators emit `name: 'literal'` per tool to satisfy the mapped type.

- Server‑kit:
  - Primary API: `buildToolList<TNames extends string, T extends McpBaseToolsMap<TNames>>(tools: T): McpBaseToolSet`.
  - Optional convenience: `buildToolListFromArray<T extends McpBaseToolSet>(tools: T): McpBaseToolSet`.
  - All attach/register helpers accept generics constrained to these base types; conversion to official types is delegated to the core adapter when instantiating the real MCP server.

Benefits

- Single source of truth for types; no ad‑hoc local types or widening.
- Unknown only at external boundaries; immediate validation to strict generated types.
- Compile‑time enforcement of key↔name equivalence and schema consistency; validators and Zod derive from the same types.
- Lint rules become guardrails; no assertions, no `Record<string, *>`, no index signatures.

## Status

- This document is PAUSED. See the new strict MVP plan and context for the active scope.

- Enhancements (Post‑MVP):
  - Shared error handling library workspace (centralised error classes, normalisers, mapping to user‑facing summaries)
  - Shared OpenTelemetry workspace/library for tracing/metrics, consumed by logger and error handler
  - Tool grouping/discovery by tags and Inspector discoverability
  - AI docs bundle generation; test mocks; offline/CI guardrails
  - Resources/Prompts and cross‑server pipelines
  - Caching
  - Accurate versioning of MCP servers surfaced from the repo root `package.json` and reflected in server metadata and docs; align release pipeline to propagate the version consistently

## Core References

- `.agent/reference-docs/openai-connector-standards.md` (OpenAI Connector standard for MCP)
- `.agent/directives/AGENT.md` (Development Practice, Testing Strategy, TypeScript Practice)
- `.agent/reference-docs/mcp-typescript-sdk-readme.md` (McpServer, Streamable HTTP, stdio, debounced notifications, elicitation)
- `docs/architecture/architectural-decisions/046-openai-connector-facades-in-streamable-http.md`
- `docs/architecture/architectural-decisions/` (relevant ADRs)
- [Understanding MCP servers](https://modelcontextprotocol.io/docs/learn/server-concepts)

## Goals

- Support the OpenAI Connector standard for MCP servers by exposing `search` and `fetch` built to the OpenAI Connector standard, as per `.agent/reference-docs/openai-connector-standards.md`.

- Create an internal workspace package (e.g., `packages/libs/mcp-server-kit`) that provides:
  - Tool list builder from SDK: `MCP_TOOLS → Tool[]` with full JSON Schema (Inspector‑friendly)
  - Low‑level handler registration (tools/list, tools/call) for both STDIO and Streamable HTTP servers
  - Unified error formatting: concise first line + required keys + tiny example (multi‑block)
  - Optional resource helpers for exposing per‑tool schema as resources (future)

- Migrate both servers to `McpServer` using compile‑time generated Zod input schemas for tool arguments.
  - Register tools with `registerTool(name, { inputSchema: z.object(...) }, handler)`
  - Delegate execution to generated executors after successful parse
  - Avoid double‑validation; the Zod parse is authoritative for inputs; executors remain the single path to the API call

- Extend SDK + shared library capabilities:
  - Per‑tool Zod output schemas; wire via `outputSchema` and return structuredContent that validates against it
  - Standardised error codes on `McpToolError`/`McpParameterError` and mapping to user‑facing summaries in the shared formatter
  - Tool grouping/discovery by OpenAPI tags; helper for filtered lists and parity tests
  - AI documentation bundle generation (examples, inputs/outputs) and optional exposure as MCP resources
  - Type‑gen test mocks for SDK and MCP tools to enable integration tests without network calls
  - Offline/CI guardrails for schema fetch/refresh with clear diagnostics and documented workflows
  - Centralised string‑argument normalisation in SDK; retain only minimal boundary wrapper if needed, with tests
  - STDIO non‑empty `tools/list` reliability guard and parity checks across transports

- Explore and enable beyond‑tools capabilities (Resources and Prompts) and cross‑server pipelines:
  - Resource classification: keep search endpoints as Tools; reclassify read‑only fetch/list endpoints as Resources with URI Templates, MIME types, and metadata; surface parameter completion where appropriate
  - Prompt library: define reusable prompts that encode multi‑step workflows combining Resources and Tools (e.g., curriculum lookup + semantic search), with `completable` arguments for guided input
  - Cross‑server composition: establish patterns and helpers for orchestrating flows across multiple MCP servers (e.g., curriculum + semantic search) so a single user query can trigger multiple SDK and search calls coherently
  - Good practice codification: document sequencing, idempotency, error handling, timeouts, pagination, and caching across the disparate servers; provide shared helpers/templates in the library

## Non‑Goals

- Changing upstream OpenAPI or adding runtime schema builders
- Introducing SSE in place of Streamable HTTP (SSE is deprecated; keep Streamable HTTP)

## Approach

### Phase A: OpenAI Connector compatibility in the same Express app (new path)

Status summary (completed)

- New `/openai_connector` server and transport mounted in the existing Express app with HEAD/GET/OPTIONS health endpoints.
- Security parity with `/mcp` (bearer auth, DNS rebinding protection, CORS) and Accept header normalization added.
- Tools surface: tools/list exposes all SDK tools except internal ones, plus OpenAI `search` and `fetch` facades. OpenAI facades are now generated at type‑gen time and exported from the SDK public entrypoint; the hand‑authored module has been removed.
- Tools execution: tools/call wraps all results in the OpenAI format (single text item containing JSON).
- SDK: deterministic canonical URL helpers are generated at type‑gen time and are now imported by the app (runtime helpers removed). Generated exports now include `CONTENT_TYPE_PREFIXES`, `ContentType`, `extractSlug`, `generateCanonicalUrlWithContext`, and a new context‑free `generateCanonicalUrl` fallback.
- SDK: OpenAI `search` and `fetch` facades are generated in `types/generated/openai-connector/index.ts` and re‑exported from the SDK root. The hand‑authored module was deleted to eliminate duplication.
- Tests: SDK unit tests and app unit/e2e tests pass for the above behavior; full repo quality gates pass.

1. Server structure

- Create a new MCP `Server` instance (OpenAI Connector server) in `apps/oak-curriculum-mcp-streamable-http`.
- Create a dedicated `StreamableHTTPServerTransport` for this server.
- Mount POST at `/openai_connector` with a handler analogous to `createMcpHandler`.
- Add HEAD/GET/OPTIONS health endpoints at `/openai_connector` (mirror `/mcp`).

2. Middleware and security

- Reuse `bearerAuth`, DNS rebinding protection, and CORS configuration.
- Add Accept header normalisation middleware for `/openai_connector` (same as `/mcp`).

3. Tools: `tools/list`

- Expose all SDK MCP tools (excluding internal-only: changelog, changelog-latest, rate-limit) at `/openai_connector` with their input schemas, plus generated OpenAI `search` and `fetch` tools. (Done)

4. Tools: `tools/call` handlers

- For every OpenAI tool (SDK‑derived or OpenAI‑specific), return results in the OpenAI format: a content array with exactly one item `{ type: "text", text: <JSON string> }`. (Done)
- SDK‑derived tools:
  - Delegate to the SDK executor, then transform the response into a JSON‑encoded string (retain response structure) and wrap in a single text content item. (Done)
  - Multi‑parameter/list endpoints remain callable as first‑class tools (not via fetch), with their input schemas mirroring the SDK. (Done)
- OpenAI `search` (SDK implementation for Phase A):
  - Aggregates `get-search-lessons` and `get-search-transcripts` via SDK executors. (Done)
  - Current output returns `{ q, keyStage?, subject?, unit?, lessons, transcripts }`. Dedupe/normalisation to a compact `{ results: [...] }` can be added later without breaking contract.
  - Returns as a single text content item. (Done)
- OpenAI `fetch` (SDK implementation for Phase A):
  - Routes by ID prefix: `lesson:`, `unit:`, `subject:`, `sequence:`, `thread:` and supports single‑id variants later (`lessonTranscript:`, `lessonQuiz:`, `sequenceQuestions:`, `sequenceAssets:`). (Done for core prefixes)
  - Uses deterministic URL helpers (generated in SDK) for canonical URLs and returns `{ id, type, canonicalUrl?, data }`. (Done)
  - Returns as a single text content item. (Done)
  - Uses generated `CONTENT_TYPE_PREFIXES` and `ContentType` to avoid any app‑local duplication. (Done)

5. Canonical URLs and metadata

- Deterministic URL transforms (no runtime sitemaps) – generated in the SDK at type‑gen time and imported by apps. App runtime helpers have been removed in favor of SDK imports. (Done)
  - lesson → `/teachers/lessons/{lessonSlug}`
  - sequence (programme) → `/teachers/programmes/{sequenceSlug}/units`
  - unit → `/teachers/programmes/{subjectSlug}-{phaseSlug}/units/{unitSlug}` (derive from UnitSummary)
  - subject → `/teachers/key-stages/{ks}/subjects/{subjectSlug}/programmes` (pick ks deterministically from SubjectKeyStages: ks1→ks2→ks3→ks4)
  - variants (lessonTranscript/lessonQuiz) → lesson page; (sequenceQuestions/sequenceAssets) → programme units page
  - thread → no first-class teachers page; omit URL
  - Provide fallback URLs without context, but prefer context-aware form where available
- Include minimal metadata (e.g., `{ contentType, subject?, keyStage?, programmeSlug? }`) when available. (Deferred where not yet in response)

6. Tests (Phase A scope)

- Unit: content-type detection, URL generation, search aggregation, response transformers. (Done)
- Integration: `/openai_connector` `tools/list` returns all SDK tools (filtered) plus `search` & `fetch`. (Done)
- Integration: `tools/call` for both tools returns correct OpenAI format (single `text` item containing JSON). (Done)
- Integration: representative SDK-derived tools return correct OpenAI format with JSON string payloads. (Done)
- Error cases: unknown IDs, upstream failures formatted as multi-block error content. (Done)

7. Docs

- Add ADR-046 and update the app README with the new endpoint.

8. Deferred: Caching

- Do not implement caching in Phase A. Mark as a later enhancement (see Later Enhancements).

### Phase B: Shared MCP server core

Status summary (completed)

- Created `packages/libs/mcp-server-kit` with `McpToolRegistry`, `attachMcpHandlers`, `formatStandardContent`, `formatOpenAiContent`, and `buildToolList`.
- Adopted in both `apps/oak-curriculum-mcp-streamable-http` and `apps/oak-curriculum-mcp-stdio`; duplicate formatters and local tooling removed.
- Zod-backed argument validation wired via SDK-generated schemas for all tools; parity maintained across transports.
- Added HTTP E2E tests for validation failure and enum-violation; updated STDIO E2E assertions to the new "validation error" wording.
- Onboarding updated in root and app READMEs; server-kit README added; root scripts `pnpm make` and `pnpm qg` validated green.

1. Package scaffolding

- Create `packages/libs/mcp-server-kit` with proper TypeScript config and exports
- Public API (initial):
  - `buildToolList(MCP_TOOLS): Tool[]`
  - `registerLowLevelHandlers(server, { client, tools, logger }): void`
  - `formatErrorForInspector(error, toolMeta): Content[]`
  - `formatOpenAiContent(value, isError?): { content: TextContent[]; isError?: true }` for OpenAI Connector responses

2. Adoption in apps

- Replace per‑app tool listing and error formatting with shared helpers
- Maintain behaviour parity confirmed by e2e tests:
  - Tools list parity vs SDK `MCP_TOOLS`
  - Error multi‑block content ordering and content

3. Tests

- Unit tests in the shared package for builders and formatters
- Integration/e2e in apps reusing the shared helpers

### Phase C: Migration to McpServer with generated Zod input schemas

Status summary (completed for MVP scope)

- `/mcp` endpoints (STDIO and Streamable HTTP) migrated to `McpServer` and register tools directly using SDK‑generated Zod input shapes; duplicate validation removed.
- Output validation integrated for structured content via SDK response validators prior to response.
- Error semantics aligned:
  - Unknown tool and argument‑validation failures return JSON‑RPC errors (HTTP SSE envelope; STDIO throws `McpError`).
  - Execution or output‑validation failures return a single text content item containing a compact JSON error payload.
- OpenAI Connector at `/openai_connector` intentionally remains on the low‑level `Server` and uses `formatOpenAiContent` to preserve the exact OpenAI contract.

1. Type‑gen extensions (SDK)

- Emit Zod input schemas per tool alongside existing JSON Schema and response validators
- Generate OpenAI‑specific MCP tools (`search`, `fetch`) with their routing/aggregation logic (now generated and exported)
- Generate deterministic URL helpers (content type prefixes, context‑aware URL builders) (done; extended to include fallback URL helper)
- Ensure literal enums and descriptions are preserved; no `any`/assertions

- Generator hardening and type‑safety improvements (applied across generators):
  - Replaced all `as` assertions with safe accessors using `getOwnValue`, `getOwnString`, and explicit guards; removed reliance on `Object.entries` in emitted validators.
  - Switched enum validators to Set‑based membership checks (`Set.has`) and typed sets as `Set<string|number|boolean>`.
  - Added explicit return types to all emitted helpers; simplified boolean comparisons and control flow for readability.
  - Broke `index.ts`/`lib.ts` import cycle with dynamic imports for `MCP_TOOLS`; typed getters to return entries of `MCP_TOOLS`.
  - Introduced coupled map types: `OperationIdToToolNameMap` with derived `OperationId` and `ToolName`, and guard functions that use maps instead of array scans.
  - Widened generated `ValidRequestParams` shape at call‑sites to include an index signature for compatibility with executors.
  - Added whitespace sanitiser in core type‑gen to strip non‑breaking spaces; added `posttype-gen` to run workspace formatting after generation.
  - Stabilised `MCP_TOOLS` surface via a `ToolDescriptor` type (including typed `inputSchema: ToolInputJsonSchema`) to avoid leaking per‑tool internals.

2. Server migration

- Replace low‑level `Server` handlers with `McpServer.registerTool` for `/mcp` (done for STDIO and HTTP).
- Use generated Zod input schemas in `inputSchema` and delegate to executors (done for `/mcp`).
- Validate outputs against SDK response validators before respond (done for `/mcp`).
- OpenAI Connector: remain on low‑level `Server` short‑term; continue to return a single text content item with JSON using `formatOpenAiContent`.

3. Debounced notifications

- If bulk updates happen, enable debounced notifications per SDK docs (tools/resources/prompts)

4. Tests

- Unit tests: Zod parse success/failure per representative tool
- E2E/Inspector sanity: argument fields render; validation failures produce shared formatted errors

### Phase D: Resources and Prompts enablement

1. Resource classification and generation

- Derive resource templates from OpenAPI read‑only endpoints; generate URI Templates, titles, descriptions, and MIME types
- Register as Resources (direct and templates) with `McpServer`; add parameter completion where feasible

2. Prompts

- Create a prompt library for common workflows that chain Resources and Tools; add `completable` arguments for guided selection

3. Tests

- E2E: `resources/list`, `resources/templates/list`, and `resources/read` for representative endpoints
- E2E: `prompts/list` and `prompts/get`; verify argument schemas and completions

### Phase E: Cross‑server composition and pipelines

1. Composition patterns

- Define sequencing, retries, idempotency keys, circuit‑breakers/timeouts, and caching for multi‑server flows
- Provide shared helpers in the library to orchestrate calls and aggregate results into structured outputs

2. Integration targets

- Integrate curriculum server with semantic search server to implement cohesive query → fetch → enrich → present pipelines

3. Tests

- E2E multi‑server scenario: a single user request triggers multiple SDK and search calls; results aggregated and validated

4. Documentation

- Codify best practices and examples; reference MCP server concepts for Tools, Resources, Prompts, and bringing servers together

## Later Enhancements

- Caching layer (e.g., memory/Redis) for `fetch` and `search`:
  - Response caching with invalidation hooks
  - Popular content cache warming
  - Metrics and cache-hit observability
- Replace search aggregation with the semantic search service while keeping the OpenAI output shape stable

## TDD and Quality Gates

- Follow repo gates: `pnpm make` (install, type‑gen, build, doc‑gen, format, markdownlint, lint --fix) → `pnpm qg` (format‑check, type‑check, lint, markdownlint‑check, test, test:e2e)
- No runtime schema building; servers are thin; validation is compile‑time generated

## Acceptance Criteria

- Shared library adopted by both servers; duplication removed for tool listing and error formatting
- Both transports list identical tools and schemas; parity tests green
- Migrated `/mcp` servers (STDIO and HTTP) use `McpServer` with generated Zod input schemas; no duplicate validation
- Inspector shows argument fields; error messages follow the concise multi‑block format
- Output schemas enforced via SDK response validators; structured content validated
- Error codes surfaced consistently; formatter maps codes to clear summaries and actionable follow‑ups
- Grouping by tag available and parity‑tested; AI documentation bundle generated and accessible
- Test mocks used in shared library and apps; offline/CI guardrails documented and tested
- String‑argument normalisation centralised and covered by tests; STDIO non‑empty tools list guard present
- Resources exposed with correct metadata and parameter completion; resource operations validated via E2E
- Prompts discoverable with clear argument schemas; completions work; exemplar workflows implemented
- Cross‑server pipelines demonstrated in E2E, aggregating results from multiple servers reliably and within timeouts

## Open items for continuation

- Align published SDK declaration types for `MCP_TOOLS` so `inputSchema` is typed as `ToolInputJsonSchema` in `dist` (currently appears as `unknown` in `index.d.ts`); verify tsconfig/build ordering and emitted type imports.
- Keep repo gates green on every change: run `pnpm make` and `pnpm qg` from repo root; add a short note in any PR if a rule must remain temporarily disabled (and why).
- Add parity tests that assert each tool’s `inputSchema` shape is present and inspector‑friendly in both transports.
- Consider applying the coupled‑map pattern to additional generated maps (response validators, path groupings) to preserve relationships at the type level.

## Rollout

- Phase A PR: implement `search` and `fetch` tools as intelligent facades over the existing MCP tools; green gates
- Phase B PR: introduce shared library and adopt in both apps; green gates
- Phase C PR: migrate to `McpServer` using generated Zod input schemas; green gates
- Manual Inspector verification against STDIO and Streamable HTTP endpoints
