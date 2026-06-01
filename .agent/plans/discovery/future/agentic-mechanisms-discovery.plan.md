---
name: "Agentic Mechanisms Discovery - parent thread"
collection: discovery
lane: future
status: strategic-parent
last_updated: 2026-06-01
---

# Agentic Mechanisms Discovery parent plan

> **Strategic parent plan (`future/`).** This owns the discovery thread for
> web-based agentic mechanisms in general. Child plans own specific standards or
> publication surfaces. This parent prevents layer confusion and decides when a
> new mechanism deserves its own child plan.

## Purpose

Create a durable planning home for Oak's discovery posture across live,
official, web-based agent standards and adjacent proposals, so Oak can publish
the right metadata and workflow surfaces without conflating skills, MCP servers,
runtime tools, remote agents, registries, or generic service-discovery drafts.

## Problem, End Goal, Mechanism, And Means

- **Problem.** Agent-facing discovery is fragmenting across MCP Server Cards,
  Agent Skills Discovery, MCP Registry metadata, A2A Agent Cards, AI discovery
  documents, `agent.json` proposals, and other well-known URI patterns. Oak
  needs to participate where doing so creates teacher, school, partner, and
  sector value, but adoption without a layer map risks duplicated metadata,
  unsafe publication, or standards-chasing that does not serve the mission.
- **End goal.** Oak has a coherent discovery architecture for public machine
  surfaces: each mechanism has a named owner, value case, publication boundary,
  trust posture, promotion trigger, and relationship to Oak's SDK, MCP, search,
  graph, and Practice assets.
- **Mechanism.** Treat discovery mechanisms as a layered portfolio. Each child
  plan tracks one standard-facing surface, while this parent owns the decision
  framework, sequencing, and cross-surface consistency.
- **Means.** Maintain the layer map; keep child plans for active candidates;
  require value-first promotion; route new proposals through source-neutral
  evaluation; and update indexes/docs when a surface moves from tracking to
  implementation.

## Current Child Lanes

| Child Plan / Report | Owned Surface | Status | Relationship |
| --- | --- | --- | --- |
| [mcp-server-cards.plan.md](mcp-server-cards.plan.md) | Pre-connection metadata for public remote MCP servers | Strategic tracking | Discovers the server endpoint; runtime capabilities remain MCP |
| [agent-skills-discovery.plan.md](agent-skills-discovery.plan.md) | Oak-authored workflow skills and skills index | Strategic tracking | Discovers workflow artifacts; live facts remain MCP/SDK/search/graph |
| [agent-skills-discovery-research.report.md](agent-skills-discovery-research.report.md) | Research synthesis for skills discovery direction | Research report | Evidence base for the skills child plan |
| [dns-aid-discovery.plan.md](dns-aid-discovery.plan.md) | Optional DNS-layer discovery entry point | Strategic tracking | DNS accelerator only; apex catalog remains source of truth |
| [aila-a2a-agent-card.plan.md](aila-a2a-agent-card.plan.md) | Conditional Aila remote-agent discovery | Strategic tracking | Only relevant if Aila becomes an A2A server |
| [webmcp-human-site-operability.plan.md](webmcp-human-site-operability.plan.md) | Optional browser-native page actions | Strategic tracking | Human-site operability, not headless MCP |
| [web-bot-auth-agent-verification.plan.md](web-bot-auth-agent-verification.plan.md) | Signed-agent verification posture for inbound automated access | Strategic tracking | Discovery owns placement; security owns enforcement evidence |

Future child lanes may be added for:

- A2A Agent Cards, if Oak exposes a remote stateful agent.
- Generic AI discovery endpoint documents, if they add public value beyond MCP
  Server Cards and skills discovery.
- MCP Registry publication or downstream aggregator metadata, if separate from
  server-card work.
- Agent readiness or partner-discovery bundles that link multiple standards.

The current promoted implementation slice is
[../current/agent-readiness-discovery-hub.plan.md](../current/agent-readiness-discovery-hub.plan.md).

## Layer Map

| Layer | Oak Use | Standard / Proposal Family | Parent Verdict |
| --- | --- | --- | --- |
| Workflow guidance | Teach agents how to perform Oak curriculum workflows | Agent Skills, Cloudflare Agent Skills Discovery | Near-term high value; child plan created |
| Runtime data/tool access | Fetch/search/inspect curriculum data through typed operations | MCP tools/resources/prompts | Existing product direction; discovery-specific work is Server Cards/Registry |
| Pre-connection server metadata | Let clients find public remote Oak MCP servers | MCP Server Cards, MCP Registry metadata | Track until spec and server publication are ready |
| Remote agent delegation | Delegate stateful curriculum tasks to Oak-hosted agents | A2A Agent Cards and A2A runtime | Future only; requires a real Oak remote agent |
| Generic service action discovery | Describe invocable web service capabilities | AI discovery endpoint / `agent.json` family | Watch; adopt only if it serves a distinct audience/value |
| DNS discovery accelerator | Let agents find Oak's discovery hub before HTTP fetch | DNS-AID | Future only; prefer hub-only to avoid catalog drift |
| Browser-native page actions | Let in-browser agents use selected human-site actions | WebMCP / Web Model Context API | Optional; requires product decision |
| Signed-agent verification | Decide whether official Oak web apps recognise cryptographically signed automated agents | Web Bot Auth / signed agents | First-class discovery lane with security evidence cross-link |
| Partner readiness bundle | Explain how all public machine surfaces compose | Oak-authored docs plus selected standards | Likely valuable after first two child lanes mature |

## Domain Boundaries

This parent plan owns:

- discovery-layer taxonomy;
- candidate-intake rules;
- child-plan creation criteria;
- cross-standard comparison;
- promotion triggers for discovery surfaces;
- consistency between discovery indexes and Oak's public documentation.

This parent plan does not own:

- implementation of MCP tools/resources/prompts;
- implementation of search, graph, or SDK features;
- product UX inside Oak-owned teacher applications;
- public legal/licensing policy;
- host/store submission compliance;
- third-party marketplace curation.

## Non-Goals

- Do not create one universal Oak discovery document unless a live standard and
  user value justify it.
- Do not duplicate the same metadata across surfaces without a named source of
  truth.
- Do not publish internal, tenant-specific, user-specific, or experimental
  metadata in public well-known documents.
- Do not treat discovery metadata as authorisation or safety approval.
- Do not ingest external skills, agents, or registries automatically.
- Do not promote standards because they are new; promote only when the
  action-to-impact bridge is clear.

## Candidate Intake Rule

When a new discovery mechanism appears, classify it before planning:

1. **Audience.** Teacher, school/trust, external developer, Oak product team,
   agent runtime, registry, crawler, or partner?
2. **Object discovered.** Skill, server, tool, data resource, prompt, remote
   agent, service action, or package?
3. **Runtime authority.** Does the mechanism invoke anything, or only point to
   something?
4. **Trust boundary.** What could a malicious or stale document cause an agent
   to do?
5. **Oak value.** Which Oak mission outcome becomes easier, safer, or cheaper?
6. **Existing overlap.** Does an existing child plan already own this layer?
7. **Promotion blocker.** What external or Oak-owned fact must be true before
   implementation?

If the mechanism does not survive this classification with a distinct value
case, record it as monitored context rather than creating a child plan.

## Dependencies And Sequencing

Blocking prerequisites for baseline parent readiness:

- **`blocking`** - Child plans exist for every discovery mechanism Oak intends
  to track actively.
- **`blocking`** - Each child plan states its object, audience, runtime
  authority, source of truth, trust posture, and promotion trigger.
- **`blocking`** - Discovery README indexes distinguish research reports,
  strategic tracking plans, and executable plans.

Beneficial prerequisites:

- **`beneficial`** - A partner-facing "agent readiness" page exists. *Without
  it:* child plans can still document their public paths and references.
- **`beneficial`** - MCP Server Cards and Agent Skills Discovery both stabilise.
  *Without them:* keep the parent as a tracking and comparison surface.
- **`beneficial`** - Oak has a public remote agent suitable for A2A. *Without
  it:* keep A2A as watched context only.

## Strategic Acceptance Criteria And Success Signals

This parent plan is successful when:

- The discovery collection has an explicit parent plan and child plan map.
- MCP Server Cards and Agent Skills Discovery are documented as sibling lanes,
  not competing directions.
- Future proposals can be routed through the candidate intake rule without
  creating plan sprawl.
- The next executor can tell which document owns server discovery, skill
  discovery, remote-agent discovery, and generic agent-web discovery.
- No discovery plan asks implementation to publish sensitive, user-specific, or
  runtime-only metadata.
- Every child plan ties its mechanism to Oak mission impact and audience value.

Success after implementation of the portfolio would mean:

- Agents and clients can discover Oak's public machine surfaces through
  standards-shaped web endpoints.
- Teachers and schools receive better curriculum assistance in the tools they
  already use.
- Partners can build with Oak data and workflows with lower integration cost.
- Oak can explain its public discovery surfaces without conflating MCP, skills,
  A2A, SDK, search, and graph.

## Risks And Unknowns

| Risk / Unknown | Impact | Mitigation |
| --- | --- | --- |
| Standards churn | Public endpoints may change shape before stabilising | Keep child plans in `future`; require re-read on promotion |
| Layer conflation | Teams may duplicate capabilities across cards, skills, and agents | Parent layer map and child-plan boundaries |
| Public metadata leakage | Well-known documents are crawlable | Public-metadata-only rule and validation in executable plans |
| Standards-chasing | Effort goes to novelty rather than teacher value | Candidate intake requires audience and Oak value |
| Fragmented docs | Partners cannot tell what to use | Add partner readiness documentation once first surfaces mature |

## Promotion Trigger To `current`

Promote this parent plan or a slice of it to `current` when one of these
conditions holds:

- Two or more child discovery surfaces are ready for implementation and need a
  shared publication/source-of-truth decision.
- Oak decides to publish an agent readiness bundle across skills, MCP, and
  partner documentation.
- A2A or a generic AI discovery standard becomes relevant because Oak has a real
  public remote agent or service-action surface to advertise.
- DNS-AID becomes worth adopting because Oak chooses a DNS-layer discovery
  posture and the draft/final spec is stable enough.
- WebMCP becomes worth adopting because Oak chooses browser-native agent
  operability for the human site.
- Web Bot Auth becomes worth enabling or formally declining because Oak chooses
  a signed-agent verification posture for official web apps.
- Discovery metadata starts to duplicate across plans or docs and needs an
  executable consolidation slice.

## Open Questions

- Should Oak publish all discovery surfaces from one canonical domain, or allow
  product-specific domains to own their own well-known documents?
- Which team owns public metadata review for agent-facing discovery surfaces?
- What is the partner-facing explanation of skills versus MCP versus A2A?
- Should Oak create a single "agent readiness" page that links all discovery
  surfaces once Server Cards and Skills Discovery mature?
- What minimum compatibility testing should a discovery surface pass before
  public publication?

## Recommended Default

Track standards actively, but implement narrowly. The next likely high-value
sequence is:

1. Keep MCP Server Cards tracking until the spec stabilises and public remote
   server publication is confirmed.
2. Ratify the Oak Agent Skills Library catalogue and trust model.
3. Promote Agent Skills Discovery to an executable implementation plan.
4. Add a partner-facing agent readiness page when the first public discovery
   surfaces are available.
