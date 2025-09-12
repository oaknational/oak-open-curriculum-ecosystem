<!-- markdownlint-disable -->

# Curriculum MCP Enhancements Plan

Date: 2025-09-12
Owner: Engineering (MCP/Oak SDK)

## Purpose

- Enable accurate versioning of the MCP servers, using the root package.json version. This includes resolving the issues with the release pipeline (see errors in GitHub release logs). <- This purpose needs properly integrating into this plan. The version is important because we are changing the tools, resources, prompts, and other capabilities of the MCP servers, and clients will need to know when to update their cache etc.
- Extract common logic into a shared MCP library workspace (shared server core and error handling) used by both STDIO and Streamable HTTP apps.
- Migrate from the low‑level Server to MCP SDK abstractions (`McpServer`), removing duplicate validation while preserving the principle that all types, type guards, schemas, and validation are generated at compile time from the OpenAPI schema.
- Enable Resources and Prompts capabilities, and cross‑server composition and pipelines.

## Core References

- `.agent/directives-and-memory/AGENT.md` (Development Practice, Testing Strategy, TypeScript Practice)
- `.agent/reference-docs/mcp-typescript-sdk-readme.md` (McpServer, Streamable HTTP, stdio, debounced notifications, elicitation)
- `docs/architecture/architectural-decisions/` (relevant ADRs)
- [Understanding MCP servers](https://modelcontextprotocol.io/docs/learn/server-concepts)

## Goals

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

### Phase A: Shared MCP server core

1. Package scaffolding

- Create `packages/libs/mcp-server-kit` with proper TypeScript config and exports
- Public API (initial):
  - `buildToolList(MCP_TOOLS): Tool[]`
  - `registerLowLevelHandlers(server, { client, tools, logger }): void`
  - `formatErrorForInspector(error, toolMeta): Content[]`

2. Adoption in apps

- Replace per‑app tool listing and error formatting with shared helpers
- Maintain behaviour parity confirmed by e2e tests:
  - Tools list parity vs SDK `MCP_TOOLS`
  - Error multi‑block content ordering and content

3. Tests

- Unit tests in the shared package for builders and formatters
- Integration/e2e in apps reusing the shared helpers

### Phase B: Migration to McpServer with generated Zod input schemas

1. Type‑gen extension (SDK)

- Emit Zod input schemas per tool alongside existing JSON Schema and response validators
- Ensure literal enums and descriptions are preserved; no `any`/assertions

2. Server migration

- Replace low‑level `Server` handlers with `McpServer.registerTool`
- Use generated Zod input schemas in `inputSchema` and delegate to executors
- Keep output as text content unless/ until `outputSchema` is introduced

3. Debounced notifications

- If bulk updates happen, enable debounced notifications per SDK docs (tools/resources/prompts)

4. Tests

- Unit tests: Zod parse success/failure per representative tool
- E2E/Inspector sanity: argument fields render; validation failures produce shared formatted errors

### Phase C: Resources and Prompts enablement

1. Resource classification and generation

- Derive resource templates from OpenAPI read‑only endpoints; generate URI Templates, titles, descriptions, and MIME types
- Register as Resources (direct and templates) with `McpServer`; add parameter completion where feasible

2. Prompts

- Create a prompt library for common workflows that chain Resources and Tools; add `completable` arguments for guided selection

3. Tests

- E2E: `resources/list`, `resources/templates/list`, and `resources/read` for representative endpoints
- E2E: `prompts/list` and `prompts/get`; verify argument schemas and completions

### Phase D: Cross‑server composition and pipelines

1. Composition patterns

- Define sequencing, retries, idempotency keys, circuit‑breakers/timeouts, and caching for multi‑server flows
- Provide shared helpers in the library to orchestrate calls and aggregate results into structured outputs

2. Integration targets

- Integrate curriculum server with semantic search server to implement cohesive query → fetch → enrich → present pipelines

3. Tests

- E2E multi‑server scenario: a single user request triggers multiple SDK and search calls; results aggregated and validated

4. Documentation

- Codify best practices and examples; reference MCP server concepts for Tools, Resources, Prompts, and bringing servers together

## TDD and Quality Gates

- Follow repo gates: `pnpm type-gen` → `pnpm build` → `pnpm type-check` → `pnpm lint -- --fix` → `pnpm test` → (apps) `pnpm test:e2e`
- No runtime schema building; servers are thin; validation is compile‑time generated

## Acceptance Criteria

- Shared library adopted by both servers; duplication removed for tool listing and error formatting
- Both transports list identical tools and schemas; parity tests green
- Migrated servers use `McpServer` with generated Zod input schemas; no duplicate validation
- Inspector shows argument fields; error messages follow the concise multi‑block format
- Output schemas enforced via `outputSchema`; structured content validated
- Error codes surfaced consistently; formatter maps codes to clear summaries and actionable follow‑ups
- Grouping by tag available and parity‑tested; AI documentation bundle generated and accessible
- Test mocks used in shared library and apps; offline/CI guardrails documented and tested
- String‑argument normalisation centralised and covered by tests; STDIO non‑empty tools list guard present
- Resources exposed with correct metadata and parameter completion; resource operations validated via E2E
- Prompts discoverable with clear argument schemas; completions work; exemplar workflows implemented
- Cross‑server pipelines demonstrated in E2E, aggregating results from multiple servers reliably and within timeouts

## Rollout

- Phase A PR: introduce shared library and adopt in both apps; green gates
- Phase B PR: migrate to `McpServer` using generated Zod input schemas; green gates
- Manual Inspector verification against STDIO and Streamable HTTP endpoints
