---
title: "Agent Skills Discovery research report"
collection: discovery
lane: future
status: research-report
last_updated: 2026-06-01
---

# Agent Skills Discovery research report

> **Research report.** This document records the research synthesis that led to
> the strategic Agent Skills Discovery direction. It is evidence and
> decision-space grounding, not an executable implementation plan. Execution is
> owned by
> [agent-skills-discovery.plan.md](agent-skills-discovery.plan.md) after
> promotion to `current/`.

## Question

How can Oak use live, official web-based agent standards and adjacent proposals
to create mission-aligned value for schools, teachers, Oak product surfaces, and
the wider education technology sector?

## Source Set

Primary external sources reviewed:

- Cloudflare Agent Skills Discovery RFC:
  <https://github.com/cloudflare/agent-skills-discovery-rfc>
- Agent Skills specification: <https://agentskills.io/specification>
- MCP Registry documentation: <https://modelcontextprotocol.io/registry/about>
- A2A latest specification: <https://a2a-protocol.org/latest/specification/>
- A2A and MCP comparison:
  <https://a2a-protocol.org/latest/topics/a2a-and-mcp/>

Repo-local sources used only for Oak value interpretation and planning
placement:

- [Vision](../../../../docs/foundation/VISION.md)
- [Discovery collection index](../README.md)
- [MCP Server Cards tracking plan](mcp-server-cards.plan.md)

## Executive Synthesis

The strongest Oak opportunity is not to choose one standard as the strategy.
The standards occupy different layers:

- **Agent Skills** package repeatable agent workflows as `SKILL.md` files plus
  optional scripts, references, and assets.
- **Cloudflare Agent Skills Discovery** proposes a well-known web index that
  lets a domain answer: "what skills does this organisation publish?"
- **MCP** is the structured runtime interface for tools, resources, and prompts.
  Its registry is about discovering MCP servers and installation or connection
  metadata, not publishing individual workflow instructions.
- **A2A** is the remote-agent collaboration layer for delegating stateful tasks
  to peer agents. It is complementary to MCP rather than a replacement.

The Oak-specific value proposition is therefore:

```text
Oak data + Oak workflow guidance + MCP data access + domain-level discovery
= reliable curriculum help wherever teachers and builders already work.
```

The recommended direction is to create an Oak Agent Skills Library, publish it
through a `.well-known/agent-skills/index.json` surface once the shape is
ratified, and make those skills route agents to Oak's existing and future MCP,
SDK, search, and graph surfaces instead of embedding curriculum facts into
static instructions.

## What The Cloudflare RFC Adds

The Cloudflare RFC is a discovery proposal for Agent Skills. As of the reviewed
draft it uses:

- `/.well-known/agent-skills/index.json`
- a top-level `$schema` URI
- a `skills` array
- per-skill `name`, `type`, `description`, `url`, and `digest`
- `type: "skill-md"` for single-file skills
- `type: "archive"` for skills with supporting files
- SHA-256 artifact digests for downloaded content
- archive-safety guidance for traversal, links, and decompression hazards
- a client requirement not to execute bundled scripts by default

Its contribution is deliberately narrow: it does not define MCP tools, A2A
agents, runtime invocation, or marketplace governance. It provides a predictable
publisher-origin location for skills.

## Oak Mission Interpretation

Oak's mission is to improve pupil outcomes and close the disadvantage gap by
supporting teachers to teach and enabling access to a high-quality curriculum.
This repository amplifies that public asset by making the Open Curriculum API,
SDK, MCP server, search, and graph-aligned surfaces easier for AI products and
sector partners to consume.

Agent Skills Discovery creates impact if it helps Oak-authored workflows travel
into the AI environments teachers and builders already use. The value is not
"Oak has a skills index"; the value is that an agent can discover and load a
trusted Oak workflow for planning, adapting, searching, sequencing, or
evidence-framing curriculum content, then use typed Oak data surfaces to do the
work accurately.

## Audience Value

### Teachers

Teachers benefit when AI assistants can follow Oak-approved workflows without
teachers needing to paste the workflow every time. High-value skill candidates:

- find lessons for a topic, key stage, subject, and sequence position;
- adapt an Oak lesson while preserving curriculum intent;
- explore prior knowledge and progression;
- compare Oak resources and surface trade-offs;
- use evidence summaries honestly, including caveats and uncertainty.

Teacher-facing language must preserve professional judgement. Skills should
support options, trade-offs, and caveats rather than imply that the assistant
decides what a teacher should do.

### Schools And Trusts

Schools and trusts benefit from repeatability and governance. Oak-authored skills
can encode a known quality bar, vocabulary, and safety posture for curriculum
workflows that staff may invoke inside multiple AI products.

### External Developers And EdTech Teams

External builders benefit when Oak provides a standards-shaped adoption path:

- discoverable workflows through Agent Skills Discovery;
- live structured data access through MCP;
- typed integration through the SDK;
- search and graph patterns for richer curriculum retrieval;
- clear boundaries on attribution, safety, and evidence framing.

### Oak Product And Engineering Teams

Oak benefits because mission reach no longer depends only on Oak-owned UIs. A
skills library can extend the same curriculum-quality and evidence-framing
discipline into external AI surfaces while keeping live data and runtime
capability in Oak's generated SDK/MCP/search/graph stack.

## Comparison With MCP Server Cards

[mcp-server-cards.plan.md](mcp-server-cards.plan.md) tracks an emerging MCP
Server Cards specification. The Server Cards direction and the Skills Discovery
direction are siblings, not substitutes.

| Dimension | MCP Server Cards | Agent Skills Discovery |
| --- | --- | --- |
| Object discovered | Public remote MCP server metadata | Oak-authored workflow skills |
| Primary question | "How do I find/connect to this MCP server?" | "What skills does this domain publish?" |
| Layer | Pre-connection MCP server discovery | Workflow/package discovery |
| Runtime authority | None; runtime capability remains MCP initialise/list calls | None; live facts should come from MCP/SDK/search/graph |
| Likely publisher | Oak service/domain operating a public MCP server | Oak domain publishing reusable workflows |
| Safety focus | Avoid leaking runtime/user/internal metadata | Avoid loading/executing untrusted prompt/code artifacts |
| Promotion blocker | MCP Server Cards spec acceptance and a public server worth advertising | Oak skill catalogue ratification, trust policy, and discovery index readiness |

The contrast matters. A Server Card should stay sparse: identity, connection,
protocol versions, and public metadata. A Skills Discovery index can point to
workflow instructions, but those instructions should not become a shadow data
source. The correct composition is:

```text
Server Card discovers Oak MCP endpoint.
Skills index discovers Oak workflows.
Oak skills direct the agent to Oak MCP/SDK/search/graph surfaces for facts.
```

## Comparison With A2A

A2A becomes relevant when Oak exposes a remote agent that accepts delegated,
stateful tasks. It is not the right shape for publishing static curriculum
workflows. An Oak A2A surface would be justified if Oak later offers a
curriculum-planning or curriculum-quality agent that can manage a task over
time, exchange artifacts, and collaborate with other agents.

Until then, Oak's near-term discovery stack should prioritise MCP Server Cards
and Agent Skills Discovery:

- MCP Server Cards for "there is a public Oak MCP server here";
- Agent Skills Discovery for "there are Oak-authored workflows here";
- A2A later for "there is an Oak agent you can delegate to".

## Recommended Product Shape

Create an **Oak Agent Skills Library** with a small first tranche:

1. `oak-curriculum-search`
2. `oak-lesson-adaptation`
3. `oak-progression-explorer`
4. `oak-resource-comparison`
5. `oak-evidence-framing`

Each skill should:

- state when to use it;
- route live data lookup through Oak MCP/SDK/search/graph surfaces;
- avoid embedding static curriculum data;
- preserve teacher judgement and uncertainty;
- cite or reference Oak and evidence-source provenance;
- include no executable script unless there is a user-approved reason;
- remain small enough for progressive disclosure.

The first implementation should prefer `skill-md` artifacts. Archives are only
justified when a skill needs supporting references, templates, or validation
assets that would bloat `SKILL.md`.

## Strategic Risks

| Risk | Why It Matters | Mitigation |
| --- | --- | --- |
| Prompt supply-chain risk | A malicious or stale skill can inject instructions into agent context | Trusted-origin allowlist, digest verification, provenance records, no default script execution |
| Static-data drift | Skills could accidentally duplicate curriculum facts that belong in live systems | Skills must route to MCP/SDK/search/graph for facts; no static curriculum payloads |
| Tool-shape confusion | Teams may treat skills, MCP, and A2A as competing choices | Parent discovery plan owns layer map and publication boundaries |
| Teacher trust loss | Over-confident evidence or broken links damage trust | Skills preserve caveats, provenance, and teacher choice; validation includes teacher-journey review |
| Spec churn | Cloudflare RFC is draft and may change | Keep work in `future/` until promotion triggers fire |

## Recommended Next Step

Create a future strategic plan for Agent Skills Discovery and a parent future
plan for the broader agentic mechanism discovery thread. The child plan should
own the Oak Agent Skills Library and `.well-known/agent-skills/index.json`
surface. The parent plan should own the layer map across MCP Server Cards,
Skills Discovery, A2A/Agent Cards, AI discovery drafts, MCP Registry metadata,
and any later agent-web discovery proposals.
