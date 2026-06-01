# Discovery

**Last Updated**: 1 June 2026
**Status**: 🔄 Active + queued execution

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
| [current/README.md](current/README.md) | Current index | Queued executable discovery plans |
| [current/agent-readiness-discovery-hub.plan.md](current/agent-readiness-discovery-hub.plan.md) | Current executable plan | Phase 1 agent-readiness delivery: apex discovery hub, skills index, Open API auth guidance, markdown representation, robots/sitemap baseline, Content Signals routing, and Web Bot Auth decision/evidence bridge |
| [current/standards-verification-2026-06-01.report.md](current/standards-verification-2026-06-01.report.md) | Verification report | Re-checks repo discovery plans and the Oak ticket against live standards and public Oak endpoints |
| [future/README.md](future/README.md) | Future index | Strategic / later discovery briefs |
| [future/agentic-mechanisms-discovery.plan.md](future/agentic-mechanisms-discovery.plan.md) | Future strategic parent | Owns the broader discovery thread and layer map across skills, MCP server cards, A2A, registry metadata, and adjacent agent-web proposals |
| [future/agent-skills-discovery-research.report.md](future/agent-skills-discovery-research.report.md) | Future research report | Synthesises Agent Skills Discovery, MCP, A2A, and Oak mission/value implications |
| [future/agent-skills-discovery.plan.md](future/agent-skills-discovery.plan.md) | Future strategic brief | Prepare Oak to publish a trusted Agent Skills Library via a `.well-known/agent-skills/index.json` surface |
| [future/mcp-server-cards.plan.md](future/mcp-server-cards.plan.md) | Future strategic brief | Track the draft MCP Server Cards spec (SEP-2127) and prepare a discoverable `.well-known` server card for Oak's public remote MCP server once the spec stabilises |
| [future/dns-aid-discovery.plan.md](future/dns-aid-discovery.plan.md) | Future strategic brief | Track optional DNS-AID publication and keep DNS discovery from drifting from the apex catalog |
| [future/aila-a2a-agent-card.plan.md](future/aila-a2a-agent-card.plan.md) | Future strategic brief | Conditional Aila A2A Agent Card plan if Oak exposes Aila to third-party agents |
| [future/webmcp-human-site-operability.plan.md](future/webmcp-human-site-operability.plan.md) | Future strategic brief | Optional WebMCP plan if Oak wants browser-native agent actions on the human site |
| [future/web-bot-auth-agent-verification.plan.md](future/web-bot-auth-agent-verification.plan.md) | Future strategic brief | First-class Web Bot Auth / signed-agent verification posture for official Oak web apps |

## Read Order

1. [current/README.md](current/README.md)
2. [current/standards-verification-2026-06-01.report.md](current/standards-verification-2026-06-01.report.md)
3. [current/agent-readiness-discovery-hub.plan.md](current/agent-readiness-discovery-hub.plan.md)
4. [future/README.md](future/README.md)
5. [future/agentic-mechanisms-discovery.plan.md](future/agentic-mechanisms-discovery.plan.md)
6. [future/agent-skills-discovery-research.report.md](future/agent-skills-discovery-research.report.md)
7. [future/agent-skills-discovery.plan.md](future/agent-skills-discovery.plan.md)
8. [future/mcp-server-cards.plan.md](future/mcp-server-cards.plan.md)
9. Relevant conditional child plans in [future/README.md](future/README.md)

## Status Legend

See the canonical legend in the [root plans README](../README.md#status-indicators).
