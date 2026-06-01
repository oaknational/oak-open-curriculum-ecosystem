# Discovery

**Last Updated**: 1 June 2026
**Status**: 📋 Reference / tracking

How external clients, registries, crawlers, IDE integrations, and agent
runtimes *discover* Oak's public machine surfaces and workflow artifacts. This
collection tracks emerging web-native discovery specifications and prepares
Oak to publish discovery metadata once those specifications and Oak's value
case stabilise.

It is deliberately distinct from:

- [`sdk-and-mcp-enhancements/`](../sdk-and-mcp-enhancements/README.md) — what
  Oak's MCP servers *do* (tools, resources, prompts, Apps). Discovery is about
  how those servers are *found*, not what they expose at runtime.
- [`compliance/`](../compliance/README.md) — host/store *submission* and policy
  compliance (e.g. Claude/ChatGPT app submission). Discovery is web-native and
  unauthenticated; submission is host-gated. The two are adjacent and may share
  metadata, but the publication surfaces differ.

## Documents

| File | Type | Description |
|------|------|-------------|
| [future/README.md](future/README.md) | Future index | Strategic / later discovery briefs |
| [future/agentic-mechanisms-discovery.plan.md](future/agentic-mechanisms-discovery.plan.md) | Future strategic parent | Owns the broader discovery thread and layer map across skills, MCP server cards, A2A, registry metadata, and adjacent agent-web proposals |
| [future/agent-skills-discovery-research.report.md](future/agent-skills-discovery-research.report.md) | Future research report | Synthesises Agent Skills Discovery, MCP, A2A, and Oak mission/value implications |
| [future/agent-skills-discovery.plan.md](future/agent-skills-discovery.plan.md) | Future strategic brief | Prepare Oak to publish a trusted Agent Skills Library via a `.well-known/agent-skills/index.json` surface |
| [future/mcp-server-cards.plan.md](future/mcp-server-cards.plan.md) | Future strategic brief | Track the draft MCP Server Cards spec (SEP-2127) and prepare a discoverable `.well-known` server card for Oak's public remote MCP server once the spec stabilises |

## Read Order

1. [future/README.md](future/README.md)
2. [future/agentic-mechanisms-discovery.plan.md](future/agentic-mechanisms-discovery.plan.md)
3. [future/agent-skills-discovery-research.report.md](future/agent-skills-discovery-research.report.md)
4. [future/agent-skills-discovery.plan.md](future/agent-skills-discovery.plan.md)
5. [future/mcp-server-cards.plan.md](future/mcp-server-cards.plan.md)

## Status Legend

See the canonical legend in the [root plans README](../README.md#status-indicators).
