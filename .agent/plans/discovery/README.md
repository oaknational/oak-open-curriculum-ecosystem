# Discovery

**Last Updated**: 31 May 2026
**Status**: 📋 Reference / tracking

How external clients, registries, crawlers, and IDE integrations *discover*
Oak's public machine surfaces — starting with remote MCP servers. This
collection tracks emerging web-native discovery specifications and prepares
Oak to publish discovery metadata once those specifications stabilise.

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
| [future/mcp-server-cards.plan.md](future/mcp-server-cards.plan.md) | Future strategic brief | Track the draft MCP Server Cards spec (SEP-2127) and prepare a discoverable `.well-known` server card for Oak's public remote MCP server once the spec stabilises |

## Read Order

1. [future/README.md](future/README.md)
2. [future/mcp-server-cards.plan.md](future/mcp-server-cards.plan.md)

## Status Legend

See the canonical legend in the [root plans README](../README.md#status-indicators).
