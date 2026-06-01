---
name: "WebMCP human-site operability - optional browser-native actions"
collection: discovery
lane: future
status: strategic-tracking
last_updated: 2026-06-01
parent_plan: agentic-mechanisms-discovery.plan.md
---

# WebMCP human-site operability plan

> **Strategic brief (`future/`).** WebMCP is optional for Oak. It belongs only if
> Oak wants the human web app itself to expose in-page actions to browser agents.

## Purpose

Track whether Oak should expose selected human-site actions through WebMCP /
browser-native model context APIs, without confusing that with the headless Oak
MCP server on `mcp.thenational.academy`.

Primary references:

- WebMCP draft/reference: <https://webmachinelearning.github.io/webmcp/>
- Chrome WebMCP overview:
  <https://developer.chrome.com/docs/ai/webmcp>

## Problem, End Goal, Mechanism, And Means

- **Problem.** Browser agents may eventually prefer structured page actions over
  DOM guessing, but Oak's strongest machine surfaces are already APIs, MCP, search,
  graph, markdown, and skills. WebMCP adds value only for actions that truly
  belong inside the human web app.
- **End goal.** If Oak wants in-page agent operability, only safe, user-aligned,
  human-site actions are exposed as WebMCP tools with clear boundaries and tests.
- **Mechanism.** WebMCP lets a page expose browser-native tools through
  JavaScript/model-context APIs. These tools are page affordances, not the same
  thing as Oak's remote MCP server.
- **Means.** Identify candidate human-site workflows, reject anything better
  served by API/MCP/skills/markdown, design a safety and accessibility proof, and
  implement only if the user value survives that filter.

## Domain Boundaries

This plan owns:

- optional WebMCP evaluation for `www.thenational.academy`;
- distinction between in-page tools and remote MCP tools;
- human-site action safety and accessibility criteria.

This plan does not own:

- Oak's remote MCP server;
- Agent Skills publication;
- API catalog and Open API metadata;
- automation of private/authenticated teacher workflows unless separately
  approved.

## Non-Goals

- Do not implement WebMCP to satisfy an agent-readiness checklist alone.
- Do not duplicate API or MCP operations as page tools unless the page context
  adds real value.
- Do not expose account, moderation, or lesson-generation actions without
  product/security approval.
- Do not require WebMCP for Phase 1 agent readiness.

## Dependencies And Sequencing

Blocking prerequisites:

- **`blocking`** - Oak decides browser-native agent operability is a product
  goal.
- **`blocking`** - Candidate actions are safer and more valuable as page tools
  than as API/MCP/skills/markdown surfaces.
- **`blocking`** - Browser/client support and security posture are re-checked.

Beneficial prerequisites:

- **`beneficial`** - Markdown representation has landed. *Without it:* WebMCP
  evaluation must not become a substitute for clean content representation.
- **`beneficial`** - Remote MCP GA is live. *Without it:* only page-native
  actions can justify WebMCP.

## Strategic Acceptance Criteria And Success Signals

This strategic plan is successful when:

- WebMCP is clearly optional and not part of baseline discovery readiness;
- future executors can distinguish human-site page actions from remote MCP;
- candidate actions have a value filter before implementation;
- accessibility and safety are blocking if the plan is promoted.

Success after implementation would mean:

- selected pages expose only ratified WebMCP tools;
- tools are testable, accessible, and safe under user intent;
- API/MCP/skills/markdown remain the preferred surfaces for data and workflow
  guidance.

## Promotion Trigger To `current`

Promote when Oak explicitly wants the human site to be operable by in-browser
agents and names at least one page action whose value cannot be better delivered
by API, MCP, skills, or markdown.
