# STDIO–HTTP Server Alignment Plan

**Status**: 📋 BACKLOG  
**Priority**: Medium — should follow Phase 3a completion  
**Created**: 2026-02-17  
**Related**: [Config Architecture Standardisation](../current/config-architecture-standardisation-plan.md), [Phase 3a MCP Search Integration](../../semantic-search/archive/completed/phase-3a-mcp-search-integration.md)

---

## Principle

The two MCP servers (STDIO and HTTP) should be as close to identical as
possible. The **only** differences should be transport handling. Everything
else — tool registration, config validation, search retrieval, resource/prompt
registration, error handling, correlation IDs — should be shared code.

---

## Current State (Gap Analysis)

| Concern | HTTP Server | STDIO Server | Gap |
|---------|-------------|--------------|-----|
| **Env validation** | Zod schemas via shared `@oaknational/mcp-env` contracts | Manual `StdioEnv` interface, no Zod | Large |
| **Tool registration** | `registerHandlers()` → `listUniversalTools()` | `registerMcpTools()` → iterates `toolNames` inline | Medium |
| **Search retrieval** | Dedicated `search-retrieval-factory.ts` with DI | Inline `createSearchRetrieval()` in `wiring.ts` | Medium |
| **Resources** | `register-resources.ts` (widget, docs, ontology, KG) | None | Large |
| **Prompts** | `register-prompts.ts` (find-lessons, lesson-planning, etc.) | None | Large |
| **Logging** | Stdout via `createHttpLogger()` | File-only (stdout reserved for MCP protocol) | Transport-specific (expected) |
| **Correlation IDs** | Express middleware + `AsyncLocalStorage` | Simple generator function | Medium |
| **Error handling** | Express error middleware with correlation ID propagation | Basic error enrichment in tool handlers | Medium |
| **Auth** | OAuth/Clerk middleware chain | None (trusted local environment) | Transport-specific (expected) |
| **Config structure** | `RuntimeConfig` with Vercel hostnames, display hostname | `ServerConfig` with minimal fields | Medium |

### Expected Differences (transport-only, keep separate)

- Auth middleware (HTTP needs OAuth; STDIO trusts local env)
- Logging sink (HTTP → stdout; STDIO → file, because stdout is the MCP protocol)
- Express middleware chain (HTTP only)
- Vercel deployment configuration (HTTP only)
- Widget rendering (HTTP only — browsers can render HTML)

### Unexpected Differences (should be eliminated)

- Env validation: STDIO should use shared Zod schemas from `@oaknational/mcp-env`
- Tool registration: Both should use the same registration pattern
- Search retrieval: Both should use the same DI-enabled factory
- Resources and prompts: STDIO should register the same resources and prompts
- Error handling: Core error handling should be shared; only the sink differs

---

## Proposed Approach

### Phase A: Shared Core

Extract shared logic into the curriculum SDK or a new shared module:

1. **Shared env validation** — STDIO uses `OakApiKeyEnvSchema`, `LoggingEnvSchema`,
   `ElasticsearchEnvSchema` from `@oaknational/mcp-env` (contracts already exist)
2. **Shared tool registration** — Extract common tool registration logic
3. **Shared search retrieval factory** — Move DI-enabled factory to shared location
4. **Shared resource/prompt registration** — STDIO registers the same resources and
   prompts (widgets are HTTP-only, but documentation/ontology resources are universal)

### Phase B: STDIO Migration

Update the STDIO server to consume shared code:

1. Replace `StdioEnv` interface with Zod schema validation
2. Replace inline tool registration with shared pattern
3. Replace inline search wiring with shared factory
4. Add resource and prompt registration
5. Improve error handling to match HTTP patterns

### Phase C: Verification

- All quality gates pass for both servers
- E2E tests confirm feature parity (tools, resources, prompts)
- Only transport-specific code remains different

---

## Acceptance Criteria

- [ ] STDIO server uses shared Zod schemas from `@oaknational/mcp-env`
- [ ] Both servers register the same tools via the same code path
- [ ] Both servers register the same resources (minus HTTP-only widgets)
- [ ] Both servers register the same prompts
- [ ] Both servers use the same DI-enabled search retrieval factory
- [ ] Diff between the two `src/` directories shows only transport-specific code
- [ ] All quality gates pass
- [ ] E2E tests validate feature parity

---

## Notes

This plan supersedes the STDIO-specific items in the
[Config Architecture Standardisation Plan](config-architecture-standardisation-plan.md)
(task 2.2). The scope here is broader: not just config, but full alignment.
