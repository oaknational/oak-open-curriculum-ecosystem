## Curriculum MCP OpenAI Connector – Living Context

Last updated: 2025-09-16 (post-Phase B adoption; Phase C partially complete; MVP criteria updated)

### Goal

- Expose OpenAI Connector-compatible `search` and `fetch` tools at `/openai_connector` in the existing Streamable HTTP app, per ADR‑046 and OpenAI connector standards. Initially aggregate existing search endpoints; later switch to semantic search. Caching deferred.

### Current Status

- ADR‑046 added.
- Plan updated with detailed Phase A steps for `/openai_connector`, now exposing all SDK tools (excluding internal-only) plus `search` and `fetch` facades.
- Phase A completed:
  - `/openai_connector` server wired with health endpoints, security parity, and Accept header normalization.
  - tools/list: all SDK tools (excluding internal-only) plus OpenAI `search` and `fetch`.
  - tools/call: OpenAI single text content JSON format for all tools.
  - SDK: deterministic canonical URL helpers are generated at type‑gen time and imported by the app; local runtime helpers removed. Generated exports now include `CONTENT_TYPE_PREFIXES`, `ContentType`, `extractSlug`, `generateCanonicalUrlWithContext`, and a context‑free `generateCanonicalUrl` fallback.
  - SDK: OpenAI `search` and `fetch` facades are generated in `types/generated/openai-connector/index.ts` and re‑exported. The old hand‑authored module was removed to avoid duplication.
  - Tests: SDK unit, app unit/e2e, and full repo gates pass.
- Phase B complete: server‑kit adopted by both servers using the registry and Zod validation; duplication removed.
- Added HTTP E2E tests for validation failure and enum‑violation; updated STDIO E2E assertions to "validation error" wording.
- Onboarding documentation updated in root and app READMEs; server‑kit README added. `pnpm make` and `pnpm qg` run green.

- Phase C (partial):
  - `/mcp` endpoints (STDIO and Streamable HTTP) migrated to `McpServer`; tools registered directly from SDK metadata.
  - Input validation uses SDK‑generated Zod shapes via `zodRawShapeFromToolInputJsonSchema`.
  - Output validation added using `validateResponse` before responding.
  - OpenAI Connector at `/openai_connector` intentionally remains on the low‑level `Server` for now and uses `formatOpenAiContent` to preserve exact OpenAI contract.

### Recent technical updates (to be carried forward)

- SDK MCP tools surface:
  - Introduced `ToolDescriptor` (invoke, path/query params, `inputSchema: ToolInputJsonSchema`, metadata) and `Readonly<Record<ToolName, ToolDescriptor>>` for `MCP_TOOLS`.
  - `lib.ts` getters return entries of `MCP_TOOLS` via dynamic import to break init cycles.
  - Types regenerated with coupled maps: `OperationIdToToolNameMap` → derived `OperationId`, `ToolName`, and name/id guards using the map.

- Generators and emitted code hardening:
  - Eliminated `as` assertions by using `getOwnValue`/type guards and Set‑based enum validation.
  - Simplified request‑param validators; added explicit return types and reduced nesting.
  - Widened `ValidRequestParams` with an index signature to satisfy executor invocations.
  - Added whitespace sanitiser in core type‑gen; added `posttype-gen` hook to run repo formatting.

- HTTP app fixes and parity:
  - Mock‐ordering fix in success‑path e2e; JSON‑RPC error envelope assertions in error‐path e2e.
  - Input validation wired from SDK schemas; output validation via `validateResponse`.
  - OpenAI connector handlers now `await getToolFromToolName` and parse with `zodFromToolInputJsonSchema`.

### Next steps (handover focus)

- Verify the SDK’s published declaration file for `MCP_TOOLS` exposes the strict mapped type `{ [K in ToolName]: ToolDescriptor & { name: K } }` with `inputSchema` typed from the shared base type.
- Add parity tests that assert tool `inputSchema` presence in both transports and that `/openai_connector` list excludes internal tools.
- Extend the coupled‑map pattern to response validator maps and path groupings to preserve relationships at the type level.
- Keep CI gates green on each change: `pnpm make` then `pnpm qg` from repo root (all workspaces coupled).

### MVP Focus

- Keep tests green: unit + e2e for `/openai_connector` with strict OpenAI contract checks (single text content item with JSON string for success and error)
- Migrate to `McpServer` using generated Zod input schemas; remove duplicate validation (done for `/mcp` STDIO/HTTP)
- Add output schema validation for structured content while retaining the OpenAI response wrapper (done for `/mcp`)
- Mirror `/mcp` security/middleware on `/openai_connector`; validate envs; deploy via Vercel on push
- Use `@oaknational/mcp-logger`; fail‑fast errors with preserved cause chains; document run/deploy/envs and example payloads

Status: MVP scope expanded — REQUIRED items now include migration to the `McpServer` class (no external behaviour change) and adding output schema enforcement for structured content. These are now complete for `/mcp` endpoints; the OpenAI Connector path remains separate by design and is out of MVP scope to migrate.

### Post‑MVP (Enhancements)

- Shared error handling library workspace (centralised errors, normalisers, summary mapping)
- Shared OpenTelemetry library/workspace for tracing/metrics, used by logger and error handler
- Tag‑based tool grouping, Inspector enhancements; AI docs bundle; offline/CI guardrails
- Resources/Prompts and cross‑server pipelines; caching and semantic search backend

### Key References

- Plan: `.agent/plans/curriculum-mcp-enhancements-plan.md`
- ADR: `docs/architecture/architectural-decisions/046-openai-connector-facades-in-streamable-http.md`
- Standards: `.agent/reference-docs/openai-connector-standards.md`
- Rules: `.agent/directives-and-memory/rules.md`
- Testing: `docs/agent-guidance/testing-strategy.md`
