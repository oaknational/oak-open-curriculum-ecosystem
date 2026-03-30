# MCP Specialist Upgrade — Strategic Plan

**Status**: PARTIALLY COMPLETE (2026-03-25: situational rule created, live-spec-first doctrine added to template, ext-apps coverage already present. Remaining: dedicated skill at `.agent/skills/mcp-expert/SKILL.md`)
**Domain**: Agentic Engineering Enhancements
**Pattern**: [ADR-129 (Domain Specialist Capability Pattern)](../../../../docs/architecture/architectural-decisions/129-domain-specialist-capability-pattern.md)

## Problem and Intent

The `mcp-reviewer` already exists as a general reviewer but is NOT a full
ADR-129 triplet — it has no skill, no situational rule, and no live-docs-first
doctrine. The MCP specification evolves rapidly (2025-11-25 spec, ext-apps,
streaming, OAuth). Agents using cached knowledge about MCP frequently apply
outdated patterns.

Additionally, `@modelcontextprotocol/ext-apps` (App Extensions) is a new and
evolving surface with host-specific behaviour (ChatGPT, Claude, sandbox
domains, `_meta.ui.domain`) that agents get wrong without current documentation.

## Scope

### In scope

- Upgrade `mcp-reviewer` to a full ADR-129 triplet (add skill + situational rule)
- Add live-spec-first doctrine (fetch current MCP spec before reviewing)
- MCP SDK usage (`@modelcontextprotocol/sdk`)
- MCP App Extensions (`@modelcontextprotocol/ext-apps`, `ext-apps/server`)
- Transport patterns (stdio, streamable-http, SSE)
- Session and authentication (OAuth 2.1, PRM, AS metadata)
- Tool, resource, and prompt definitions
- Widget preview and iframe/CSP patterns
- Host-specific behaviour (ChatGPT, Claude Desktop, Cursor)
- MCP protocol compliance testing patterns

### Out of scope

- Clerk-specific OAuth (covered by clerk-reviewer)
- Generic HTTP/Express concerns (covered by express-reviewer when created)
- Security vulnerability assessment (covered by security-reviewer)
- Sentry MCP Insights (covered by sentry-reviewer)

## Doctrine Hierarchy

1. **Current MCP specification** — fetched live from spec.modelcontextprotocol.io
2. **Official MCP SDK** — `@modelcontextprotocol/sdk`, `@modelcontextprotocol/ext-apps`; `modelcontextprotocol` on GitHub
3. **Repository ADRs and research** — ADR-029, ADR-030, ADR-113, ADR-115, MCP apps research
4. **Existing implementation** — evidence, not authority

## Deployment Context

- **Stdio transport**: Claude Desktop, Cursor (oak-curriculum-mcp-stdio)
- **Streamable HTTP transport**: Remote clients via Vercel (oak-curriculum-mcp-streamable-http)
- **App Extensions**: ChatGPT, Claude (ext-apps iframe pattern)

## Deliverables

This is an UPGRADE, not a greenfield creation:

1. Add live-spec-first doctrine to existing `mcp-reviewer` template
2. Create canonical skill: `.agent/skills/mcp-expert/SKILL.md`
3. Create canonical situational rule: `.agent/rules/invoke-mcp-reviewer.md`
   (may already partially exist — audit and complete)
4. Platform adapters for new skill and rule
5. Add ext-apps coverage section to reviewer template
6. Discoverability updates
7. Validation

## Ext-Apps Sub-Scope

The `@modelcontextprotocol/ext-apps` surface deserves dedicated coverage:

- Server helpers (`ext-apps/server`)
- Widget preview rendering
- `_meta.ui.domain` for cross-origin fetch
- Host-specific iframe behaviour and sandbox domains
- CSP considerations
- Migration from direct tool responses to ext-apps patterns

Decision at implementation time: dedicated section within MCP reviewer, or
separate sub-specialist. Depends on surface area when work begins.

## Promotion Trigger

This plan promotes to `current/` when:

1. MCP-related work is scheduled that would benefit from the full triplet
2. No conflicting work is in progress on the agent artefact layer
