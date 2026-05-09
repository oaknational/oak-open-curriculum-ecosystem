---
name: clerk-expert
classification: active
description: Active workflow skill for Clerk planning, research, and implementation support. Grounded in current official Clerk documentation with Vercel (Express) + shared Clerk instance as the default deployment context. Use when the working agent needs Clerk expertise for active tasks — distinct from the clerk-reviewer, which is a read-only assessment specialist.
---

# Clerk Expert

Active workflow skill for Clerk planning, research, and implementation work. This skill supports the working agent during tasks that involve Clerk — it does not replace the `clerk-reviewer`, which provides independent read-only assessment.

## When to Use

Use this skill when the working agent needs to:

- Plan Clerk middleware changes or configuration updates
- Research Clerk SDK capabilities or migration paths
- Implement or modify OAuth proxy endpoints (register, authorise, token exchange)
- Design auth error handling or interception patterns
- Assess whether `@clerk/mcp-tools` covers a current need
- Configure social connections (Google, Microsoft) or allowlists
- Implement or modify PRM or AS metadata generation

## When NOT to Use

- For independent review of completed work — use `clerk-reviewer`
- For security vulnerability assessment — use `security-reviewer`
- For MCP specification compliance — use `mcp-reviewer`
- For generic HTTP middleware issues unrelated to Clerk — use standard debugging
- For Oak product decisions not involving Clerk capabilities — consult the team

## Doctrine Hierarchy

This skill follows the same authority hierarchy as the `clerk-reviewer` (per ADR-129):

1. **Current official Clerk documentation** — fetched live from the web. Primary authority.
2. **Official packages and client sources** — `@clerk/backend`, `@clerk/express`, `@clerk/nextjs`, `@clerk/mcp-tools` on npm; `clerk/javascript` on GitHub.
3. **Repository ADRs and research** — secondary context describing local constraints and trade-offs.
4. **Existing implementation** — evidence of current state, not authority for future decisions.

**Do not cargo-cult existing repo patterns.** Always verify against current official documentation before replicating or extending existing approaches.

## Deployment Context

**Vercel (Express) + shared Clerk instance is the default deployment context.** All planning, research, and implementation must be validated against this dual-deployment context. If a recommendation is incompatible with the shared instance (Express + Next.js), flag this explicitly and propose alternatives.

## Required External Reading

Before any Clerk planning or implementation, consult live official documentation:

| Source | URL | Use for |
|--------|-----|---------|
| Clerk Documentation | `https://clerk.com/docs` | All Clerk platform documentation |
| Clerk Express SDK | `https://clerk.com/docs/references/express/overview` | Express middleware, token verification |
| Clerk Backend SDK | `https://clerk.com/docs/references/backend/overview` | Server-side operations, JWKS |
| Clerk OAuth / OIDC | `https://clerk.com/docs/authentication/oauth` | OAuth configuration, social connections |
| Clerk MCP Integration | `https://clerk.com/docs/integrations/mcp` | `@clerk/mcp-tools`, PRM helpers |
| npm: @clerk/express | `https://www.npmjs.com/package/@clerk/express` | Package API and usage patterns |
| GitHub: clerk/javascript | `https://github.com/clerk/javascript` | Client source and types |
| GitHub: clerk/cli | `https://github.com/clerk/cli` | Clerk CLI (in development) — monitor for availability and capabilities |

Use WebFetch or WebSearch to consult these. The URLs are starting points — follow links for specific areas.

When available, the Clerk MCP server and installed Clerk skills (`clerk`, `clerk-setup`, `clerk-nextjs-patterns`, `clerk-orgs`, `clerk-custom-ui`, `clerk-webhooks`, `clerk-testing`) provide additional research capabilities. Use these alongside direct WebFetch/WebSearch.

## Required Local Reading

### Must-Read (always loaded)

| Document | Purpose |
|----------|---------|
| `docs/architecture/architectural-decisions/053-clerk-as-identity-provider.md` | Clerk as IdP, shared instance, proxy AS |
| `docs/architecture/architectural-decisions/113-mcp-spec-compliant-auth-for-all-methods.md` | Auth for all MCP methods |
| `docs/architecture/architectural-decisions/115-proxy-oauth-as-for-cursor.md` | OAuth proxy architecture |
| `.agent/research/clerk-unified-auth-mcp-nextjs.md` | Comprehensive unified auth guide |

### Consult-If-Relevant (loaded when the task touches that area)

> **Note**: This is an intentional subset of the `clerk-reviewer`'s broader consult-if-relevant list. The reviewer needs wider scope for independent assessment; the skill covers the areas most relevant during active implementation work.

| Document | Load when |
|----------|-----------|
| `docs/architecture/architectural-decisions/052-oauth-2.1-for-mcp-http-authentication.md` | OAuth 2.1 protocol decisions |
| `docs/architecture/architectural-decisions/054-tool-level-auth-error-interception.md` | Auth error interception |
| `docs/architecture/architectural-decisions/057-selective-auth-public-resources.md` | Public resource auth bypass |
| `docs/architecture/architectural-decisions/122-permissive-cors-for-oauth-protected-mcp.md` | CORS for OAuth-protected MCP |
| `.agent/analysis/clerk-mcp-tools-usage-review.md` | `@clerk/mcp-tools` usage analysis |
| `.agent/research/clerk-testing-patterns.md` | Clerk testing strategy |

## Workflow

### 1. Understand the Task

Identify what Clerk area is involved (middleware, token verification, OAuth proxy, PRM/AS metadata, social connections, SDK configuration).

### 2. Consult Official Documentation

Fetch current official Clerk documentation for the relevant area. Do not rely on cached knowledge or repo patterns alone.

### 3. Check Shared Instance Compatibility

Verify that all proposed approaches work with the shared Clerk instance (Express + Next.js). Flag incompatibilities immediately.

### 4. Read Local Context

Load the must-read documents. Load consult-if-relevant documents only when the task area demands them.

### 5. Plan, Research, or Implement

Apply official guidance with local context. When official guidance and local patterns diverge, prefer official guidance and flag the divergence for ADR review.

### 6. Flag Opportunities

If current official Clerk capabilities could improve the implementation beyond the immediate task, note the opportunity without committing the product to it.

## Guardrails

- **Never replicate existing code patterns without checking official docs first.** Existing patterns may be outdated.
- **Never recommend approaches incompatible with the shared Clerk instance** without explicit flagging.
- **Never make product commitments** about adopting Clerk capabilities. Flag opportunities; the team decides.
- **Never substitute for the reviewer.** After implementation, invoke `clerk-reviewer` for independent assessment.
