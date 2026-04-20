# Invoke MCP Reviewer

Operationalises [ADR-129 (Domain Specialist Capability Pattern)](../../docs/architecture/architectural-decisions/129-domain-specialist-capability-pattern.md), [ADR-123 (MCP Server Primitives Strategy)](../../docs/architecture/architectural-decisions/123-mcp-server-primitives-strategy.md), and [ADR-141 (MCP Apps Standard as Only UI Surface)](../../docs/architecture/architectural-decisions/141-mcp-apps-standard-primary.md).

When changes touch the MCP protocol, MCP Apps Extension, or MCP server implementation, invoke the `mcp-reviewer` specialist in addition to the standard `code-reviewer` gateway.

## Trigger Conditions

Invoke `mcp-reviewer` when the change involves:

- MCP tool definitions (annotations, input schemas, descriptions, metadata)
- MCP server transport or session management patterns
- MCP resource or prompt definitions
- MCP Apps Extension widgets, resources, or capability negotiation
- `@modelcontextprotocol/ext-apps` usage (`registerAppTool`, `registerAppResource`, `getUiCapability`)
- `_meta.ui` fields (resourceUri, csp, domain, permissions)
- Widget HTML, iframe communication, or postMessage bridge patterns
- OpenAI App to MCP Apps migration work
- MCP auth patterns (OAuth 2.1, PRM, AS metadata at the protocol level)
- MCP SDK version upgrades or breaking changes

## Non-Goals

Do not invoke `mcp-reviewer` for:

- Clerk-specific OAuth implementation details (use `clerk-reviewer`)
- Generic HTTP middleware unrelated to MCP transport (request parsing, body limits)
- Security exploitability assessment (use `security-reviewer`)
- Oak product decisions that do not involve MCP protocol capabilities
- TypeScript type safety unrelated to MCP schemas (use `type-reviewer`)

## Overlap Boundaries

- **`code-reviewer`**: Always invoke as the gateway. `mcp-reviewer` adds MCP-specific depth.
- **`clerk-reviewer`**: Add when Clerk OAuth implementation details are involved alongside MCP auth.
- **`security-reviewer`**: Add when MCP auth changes have exploitability implications.
- **`elasticsearch-reviewer`**: Add when search MCP tool definitions involve Elasticsearch query patterns.
- **`architecture-reviewer-fred`**: Add when MCP changes affect package boundaries or ADR compliance.
- **`architecture-reviewer-wilma`**: Add when transport lifecycle or retry patterns have resilience implications.

## Invocation

See `.agent/memory/executive/invoke-code-reviewers.md` for the full reviewer catalogue and invocation policy. The `mcp-reviewer` canonical template is at `.agent/sub-agents/templates/mcp-reviewer.md`.
