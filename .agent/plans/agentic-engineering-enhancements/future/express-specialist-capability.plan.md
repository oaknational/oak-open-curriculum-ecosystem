# Express Specialist Capability — Strategic Plan

**Status**: NOT STARTED
**Domain**: Agentic Engineering Enhancements
**Pattern**: [ADR-129 (Domain Specialist Capability Pattern)](../../../../docs/architecture/architectural-decisions/129-domain-specialist-capability-pattern.md)

## Problem and Intent

The repo uses Express 5.x (`express@^5.2.1`) for the streamable HTTP MCP
server. Express 5 has significant breaking changes from Express 4 — and agents
frequently apply v4 patterns (especially around error handling, middleware
signatures, and routing). Without a dedicated specialist, agents:

- Apply `app.use((err, req, res, next) => ...)` error handling patterns that
  changed in Express 5
- Miss Express 5 async error handling (promises are automatically caught)
- Use deprecated v4 APIs
- Miss Vercel-specific deployment constraints

## Scope

### In scope

- Express 5.x middleware patterns and composition
- Error handling (Express 5 async support, error middleware changes)
- Routing and parameter handling
- Request/response typing with TypeScript
- Vercel deployment specifics (serverless Express, cold starts, timeouts)
- Helmet, CORS, and security middleware configuration
- Express + Clerk middleware integration patterns
- Express + MCP transport layer integration
- Performance considerations (middleware ordering, response streaming)

### Out of scope

- Clerk-specific OAuth flows (covered by clerk-reviewer)
- MCP protocol compliance (covered by mcp-reviewer)
- Generic security vulnerabilities (covered by security-reviewer)
- Generic TypeScript patterns (covered by type-reviewer)

## Doctrine Hierarchy

1. **Current official Express documentation** — fetched live from expressjs.com
2. **Express 5.x migration guide** — breaking changes from v4
3. **Official middleware packages** — helmet, cors, express-list-routes
4. **Repository ADRs** — ADR-078 (DI), ADR-113 (auth for all methods)
5. **Existing implementation** — evidence, not authority

## Deployment Context

**Vercel (Express 5.x)** is the default. Key constraints:

- Serverless deployment with cold start considerations
- Express configured as Vercel framework
- Streaming responses for MCP transport
- Shared Clerk instance middleware

## Deliverables

1. Canonical reviewer template: `.agent/sub-agents/templates/express-reviewer.md`
2. Canonical skill: `.agent/skills/express-expert/SKILL.md`
3. Canonical situational rule: `.agent/rules/invoke-express-reviewer.md`
4. Platform adapters (Claude, Cursor, Codex)
5. Discoverability updates
6. Validation

## Overlap Boundaries

| Specialist | Owns | Does NOT own |
|-----------|------|-------------|
| **express-reviewer** | Express middleware, routing, error handling, Vercel deployment | Auth logic, MCP protocol, security vulns |
| **clerk-reviewer** | Clerk middleware configuration | Express middleware ordering |
| **mcp-reviewer** | MCP transport protocol | HTTP server implementation |
| **security-reviewer** | Exploitability | Express configuration correctness |

## Promotion Trigger

This plan promotes to `current/` when:

1. Express-related work is scheduled (middleware refactoring, new routes, etc.)
2. No conflicting work is in progress on the agent artefact layer
