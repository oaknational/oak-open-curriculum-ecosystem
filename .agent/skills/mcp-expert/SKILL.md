---
name: mcp-expert
classification: active
description: Active workflow skill for MCP planning, research, and implementation support. Grounded in the current canonical MCP specification and ext-apps extension docs with live-spec-first doctrine. Use when the working agent needs MCP expertise for active tasks — distinct from the mcp-reviewer, which is a read-only assessment specialist.
---

# MCP Expert

Active workflow skill for MCP planning, research, and implementation work. This skill supports the working agent during tasks that involve MCP protocol, transport, auth, tool definitions, resources, prompts, or MCP Apps Extensions — it does not replace the `mcp-reviewer`, which provides independent read-only assessment.

## When to Use

Use this skill when the working agent needs to:

- Plan MCP tool, resource, or prompt definition changes
- Research MCP specification capabilities or transport patterns
- Implement or modify MCP server transport or session handling
- Design or update MCP Apps Extension widgets, resources, or capability negotiation
- Plan or execute OpenAI Apps SDK to MCP Apps migration tasks
- Assess whether an MCP-native capability could replace a custom implementation
- Resolve schema generation pipeline issues that affect MCP tool descriptions

## When NOT to Use

- For independent review of completed work — use `mcp-reviewer`
- For authentication security or credential handling — use `security-reviewer`
- For code quality, style, or naming — use `code-reviewer`
- For architectural boundaries or dependency direction — use the architecture reviewers
- For TypeScript type safety unrelated to MCP schemas — use `type-reviewer`
- For test quality or TDD compliance — use `test-reviewer`
- For Oak product decisions not involving MCP capabilities — consult the team

## Capability Routing

This skill is the entry point for MCP expertise. For narrower workflows, route to the appropriate specialist skill:

| Task | Route to |
|------|----------|
| Migrate OpenAI Apps SDK usage to MCP Apps standard (Domain C) | `.agent/skills/mcp-migrate-oai/SKILL.md` |
| Create a new MCP App (tool + HTML resource) from scratch (Domain D) | `.agent/skills/mcp-create-app/SKILL.md` |
| Add an MCP App UI to an existing tool (Domain D) | `.agent/skills/mcp-add-ui/SKILL.md` |
| Convert an existing web component into an MCP App resource (Domain D) | `.agent/skills/mcp-convert-web/SKILL.md` |

Use this skill (`mcp-expert`) for cross-cutting MCP work that does not fit a single narrower skill — protocol planning, transport design, auth model decisions, primitives strategy, and general MCP implementation support. When the task clearly maps to one of the narrower skills above, route directly to it.

## Overlap Boundaries

| Domain | This skill covers | Defer to |
|--------|-------------------|----------|
| Auth security (exploitability, credential handling) | MCP auth model design and ADR compliance | `security-reviewer` for vulnerability assessment |
| Clerk integration with MCP auth | MCP spec requirements that Clerk must satisfy | `clerk-reviewer` for Clerk SDK usage and configuration |
| Architecture (boundaries, coupling, dependencies) | MCP-specific layering (tool DAG, transport patterns) | Architecture reviewers for cross-cutting structural concerns |
| Schema generation pipeline | MCP tool description correctness | `code-reviewer` for general code quality in the pipeline |

## Doctrine Hierarchy

This skill follows the same authority hierarchy as the `mcp-reviewer` (per ADR-129):

1. **Current MCP specification and extensions documentation** — fetched live from the web. Primary authority.
2. **Official MCP SDK and extension package sources** — `@modelcontextprotocol/sdk`, `@modelcontextprotocol/ext-apps` on npm and GitHub.
3. **Repository ADRs and research** — secondary context describing local constraints and trade-offs.
4. **Existing implementation** — evidence of current state, not authority for future decisions.

**Do not cargo-cult existing repo patterns.** Always verify against current official documentation before replicating or extending existing approaches.

## Required External Reading

Before any MCP planning or implementation, consult live official documentation:

| Source | URL | Use for |
|--------|-----|---------|
| MCP Specification | `https://modelcontextprotocol.io/specification` | Normative protocol requirements (MUST/SHOULD/MAY per RFC 2119) |
| MCP Introduction | `https://modelcontextprotocol.io/docs/getting-started/intro` | Protocol overview, concepts, architecture |
| MCP SDK Documentation | `https://modelcontextprotocol.io/docs/sdk` | TypeScript SDK usage patterns and API |
| MCP TypeScript SDK | `https://github.com/modelcontextprotocol/typescript-sdk` | SDK source, types, implementation reference |
| MCP Apps Extension | `https://modelcontextprotocol.io/extensions/apps/overview` | Apps Extension spec: widgets, resources, UI |
| MCP Apps SDK | `https://github.com/modelcontextprotocol/ext-apps` | `@modelcontextprotocol/ext-apps` source and skills |
| Extensions Overview | `https://modelcontextprotocol.io/extensions/overview` | Extension mechanism, capability negotiation |

Use WebFetch or WebSearch to consult these. The URLs are starting points — follow links for specific areas.

## Required Local Reading

### Must-Read (always loaded)

| Document | Purpose |
|----------|---------|
| `docs/architecture/architectural-decisions/112-per-request-mcp-transport.md` | Stateless per-request transport pattern |
| `docs/architecture/architectural-decisions/113-mcp-spec-compliant-auth-for-all-methods.md` | Auth required for all MCP methods |
| `docs/architecture/architectural-decisions/123-mcp-server-primitives-strategy.md` | Tools, resources, and prompts strategy |
| `docs/architecture/architectural-decisions/050-mcp-tool-layering-dag.md` | Tool generation DAG and dependency direction |
| `.agent/research/mcp-tool-description-schema-flow-analysis.md` | OpenAPI to MCP tool description pipeline findings |

### Consult-If-Relevant (loaded when the task touches that area)

> **Note**: This is an intentional subset of the `mcp-reviewer`'s broader reading list. The reviewer needs wider scope for independent assessment; the skill covers the areas most relevant during active implementation work.

| Document | Load when |
|----------|-----------|
| `docs/architecture/architectural-decisions/035-unified-sdk-mcp-code-generation.md` | Schema generation pipeline |
| `docs/architecture/architectural-decisions/052-oauth-2.1-for-mcp-http-authentication.md` | OAuth 2.1 protocol decisions |
| `docs/architecture/architectural-decisions/107-deterministic-sdk-nl-in-mcp-boundary.md` | SDK/NL boundary decisions |
| `docs/architecture/architectural-decisions/122-permissive-cors-for-oauth-protected-mcp.md` | CORS design for OAuth-protected MCP |
| `.agent/research/mcp-demo-auth-approach.md` | Auth implementation approach |
| `.agent/research/mcp-inspector-oauth-testing-findings.md` | MCP Inspector testing |
| `.agent/research/mcp-sdk-type-reuse-investigation.md` | SDK type reuse patterns |
| `.agent/plans/sdk-and-mcp-enhancements/mcp-apps-support.research.md` | MCP Apps compatibility and CSP model |
| `.agent/plans/sdk-and-mcp-enhancements/roadmap.md` | Migration sequencing and Domain ordering |

## Workflow

### 1. Understand the Task

Identify what MCP area is involved (tools, resources, prompts, transport, auth, schema generation, MCP Apps widgets, migration). If the task maps to a narrower skill, route to it (see Capability Routing above).

### 2. Consult Official Documentation

Fetch current official MCP documentation for the relevant area. Do not rely on cached knowledge or repo patterns alone. The MCP specification evolves — always check the latest version.

### 3. Read Local Context

Load the must-read documents. Load consult-if-relevant documents only when the task area demands them.

### 4. Plan, Research, or Implement

Apply official guidance with local context. When official guidance and local patterns diverge, prefer official guidance and flag the divergence for ADR review.

### 5. Route to Narrower Skills When Appropriate

If the task becomes a specific MCP Apps workflow (migration, app creation, UI addition, web conversion), hand off to the corresponding narrower skill rather than duplicating its workflow here.

### 6. Flag Opportunities

If current MCP specification capabilities could improve the implementation beyond the immediate task, note the opportunity without committing the product to it.

## Guardrails

- **Never replicate existing code patterns without checking official docs first.** Existing patterns may be outdated — the MCP spec evolves rapidly.
- **Never recommend approaches that violate the MCP specification** without explicitly flagging the deviation and its rationale.
- **Never make product commitments** about adopting MCP capabilities. Flag opportunities; the team decides.
- **Never substitute for the reviewer.** After implementation, invoke `mcp-reviewer` for independent assessment.
- **Never bypass the narrower skills.** When a task cleanly maps to mcp-migrate-oai, mcp-create-app, mcp-add-ui, or mcp-convert-web, route to that skill.
