# ADR-149: Frontend Specialist Expert Gateway Cluster

**Status**: Accepted. Amended 2026-05-10 to align the cluster with the
`*-expert` naming model.
**Date**: 2026-04-02
**Related**: [ADR-114 (Layered Sub-agent Prompt Composition)](114-layered-sub-agent-prompt-composition-architecture.md), [ADR-119 (Agentic Engineering Practice)](119-agentic-engineering-practice.md), [ADR-125 (Agent Artefact Portability)](125-agent-artefact-portability.md), [ADR-129 (Domain Specialist Capability Pattern)](129-domain-specialist-capability-pattern.md), [ADR-135 (Agent Classification Taxonomy)](135-agent-classification-taxonomy.md), [ADR-147 (Browser Accessibility)](147-browser-accessibility-as-blocking-quality-gate.md), [ADR-148 (Design Token Architecture)](148-design-token-architecture.md)

## Context

The repository has a growing specialist expert roster (code-expert gateway +
4 architecture + 6 standard + 5 domain specialists). All are backend-
focused. WS3 Phases 4-5 introduce React MCP App views — the first
user-facing rendered UI in this repository. No expert assesses DOM
accessibility, token governance, component architecture, or visual
correctness.

The code-expert gateway (ADR-114/ADR-135) routes changes to specialists based
on change profile signals. The current routing model has no UI/Frontend
cluster. Changes touching rendered UI, CSS, or React components fall
through to the generic code-expert without specialist assessment.

## Decision

### Create a UI/Frontend Triage Cluster

Add a UI/Frontend cluster to the code-expert gateway's routing model.
The cluster contains three specialist agents created as a cohort:

1. **accessibility-expert** — WCAG 2.2 AA compliance, keyboard
   navigation, screen reader readiness, colour contrast, ARIA patterns,
   landmark structure, focus management, motion sensitivity
2. **design-system-expert** — Token usage consistency, tier referencing
   rules, theme-aware styles, component API correctness, visual
   regression triage, style containment
3. **react-component-expert** — Component architecture, hook patterns,
   render performance, accessibility integration, prop API design,
   composition patterns, server/client component boundary

### Routing Triggers

The gateway routes to this cluster when changes touch:

- Rendered HTML/JSX output (React components, HTML templates)
- CSS, design tokens, or styling concerns
- ARIA attributes, landmark structure, or accessibility-related code
- React hooks, component composition, or prop interfaces
- MCP App view files (`widget/`, `*.view.tsx`, `mcp-app.html`)

### MCP Boundary Rule

These experts assess DOM, accessibility, token usage, and React
structure _inside_ an MCP App view. `mcp-expert` remains required for
`_meta.ui*`, resource registration, visibility, MIME, CSP/domain, and
host bridge lifecycle. When reviewing MCP App surfaces, ADR-141 is in
both clusters' reading sets.

### Overlap Boundaries

| Domain                | UI/Frontend Cluster    | Adjacent Expert |
| --------------------- | ---------------------- | --------------- |
| DOM accessibility     | accessibility-expert   | —               |
| Token tier violations | design-system-expert   | —               |
| React patterns        | react-component-expert | —               |
| MCP App packaging     | —                      | mcp-expert      |
| Type safety in props  | react-component-expert | type-expert     |
| Security in UI code   | —                      | security-expert |
| Test coverage gaps    | —                      | test-expert     |

When overlap exists, both experts apply — their assessments are
complementary, not competing.

### Agent Construction

All three agents follow the amended ADR-129 `*-expert` pattern: canonical
expert template, situational invocation, and platform adapters for Cursor,
Claude Code, Codex, and Gemini CLI. Reading requirements include ADR-147,
ADR-148, ADR-149, and `docs/governance/accessibility-practice.md` and
`docs/governance/design-token-practice.md`.

### Testing Expert Cluster Pattern (Future-Facing)

This ADR documents a pattern that may influence test-expert evolution:
make `test-expert` a cluster entry point, split testing experts by
test type (unit, integration, E2E, accessibility, visual), with shared
principles in the entry point. This is not implemented in this plan —
it is recorded as a future-facing recommendation for the testing expert
evolution plan.

## Rationale

### Why a cluster, not individual agents

The three specialists form a natural cohort — they share vocabulary
(browser proof surfaces), context (MCP App views), and routing triggers
(UI file changes). A cluster groups them for triage, documents overlap
boundaries, and establishes inter-agent routing conventions. ADR-129
defines the triplet shape; this ADR documents the cluster concept as
an architectural pattern.

### Why three agents, not one

A single "frontend-expert" would have too broad a scope: WCAG 2.2
compliance, token governance, and React architecture are distinct
disciplines with different doctrine sources. Splitting enables focused
prompts, targeted reading requirements, and independent evolution.

### Why create all three now

WS3 Phase 4 introduces React views. All three disciplines are relevant
from the first view. Creating them together ensures consistent patterns,
shared vocabulary, and correct overlap boundaries. The cost of an
ADR-129 triplet is low; the cost of inconsistent patterns between agents
created at different times is higher.

## Risks

| Risk                                                               | Mitigation                                                                                                                |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| **ADR-135 naming alignment**: New agents use the `*-expert` suffix | Current naming follows the amended ADR-129/ADR-135 model                                                                  |
| Gateway triage routing may not trigger correctly                   | Phase 3 of the frontend plan is explicitly a validation step — the new agents review real changes, exercising the routing |
| Overlap with existing experts creates noise                        | Overlap boundaries documented in this ADR; complementary assessment is intentional                                        |

## Consequences

### Positive

- UI changes receive specialist review before WS3 Phase 4 begins
- The cluster pattern is documented and reusable for future cohorts
- MCP boundary is explicit — UI specialists own inside the view,
  mcp-expert owns around it

### Negative

- Three new agents increase the expert roster from 16 to 19.
  Mitigation: the gateway handles routing; agents are only invoked
  when their signals match
- The testing expert cluster pattern is documented but not
  implemented — may create expectation of near-term delivery.
  Mitigation: explicitly labelled as future-facing recommendation
