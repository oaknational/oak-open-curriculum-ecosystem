# ADR-149: Frontend Specialist Reviewer Gateway Cluster

**Status**: Accepted
**Date**: 2026-04-02
**Related**: [ADR-114 (Layered Sub-agent Prompt Composition)](114-layered-sub-agent-prompt-composition-architecture.md), [ADR-119 (Agentic Engineering Practice)](119-agentic-engineering-practice.md), [ADR-125 (Agent Artefact Portability)](125-agent-artefact-portability.md), [ADR-129 (Domain Specialist Capability Pattern)](129-domain-specialist-capability-pattern.md), [ADR-135 (Agent Classification Taxonomy)](135-agent-classification-taxonomy.md), [ADR-147 (Browser Accessibility)](147-browser-accessibility-as-blocking-quality-gate.md), [ADR-148 (Design Token Architecture)](148-design-token-architecture.md)

## Context

The repository has 16 specialist reviewers (code-reviewer gateway +
4 architecture + 6 standard + 5 domain specialists). All are backend-
focused. WS3 Phases 4-5 introduce React MCP App views — the first
user-facing rendered UI in this repository. No reviewer assesses DOM
accessibility, token governance, component architecture, or visual
correctness.

The code-reviewer gateway (ADR-114) routes changes to specialists based
on change profile signals. The current routing model has no UI/Frontend
cluster. Changes touching rendered UI, CSS, or React components fall
through to the generic code-reviewer without specialist assessment.

## Decision

### Create a UI/Frontend Triage Cluster

Add a UI/Frontend cluster to the code-reviewer gateway's routing model.
The cluster contains three specialist agents created as a cohort:

1. **accessibility-reviewer** — WCAG 2.2 AA compliance, keyboard
   navigation, screen reader readiness, colour contrast, ARIA patterns,
   landmark structure, focus management, motion sensitivity
2. **design-system-reviewer** — Token usage consistency, tier referencing
   rules, theme-aware styles, component API correctness, visual
   regression triage, style containment
3. **react-component-reviewer** — Component architecture, hook patterns,
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

These reviewers assess DOM, accessibility, token usage, and React
structure _inside_ an MCP App view. `mcp-reviewer` remains required for
`_meta.ui*`, resource registration, visibility, MIME, CSP/domain, and
host bridge lifecycle. When reviewing MCP App surfaces, ADR-141 is in
both clusters' reading sets.

### Overlap Boundaries

| Domain                | UI/Frontend Cluster      | Existing Reviewer |
| --------------------- | ------------------------ | ----------------- |
| DOM accessibility     | accessibility-reviewer   | —                 |
| Token tier violations | design-system-reviewer   | —                 |
| React patterns        | react-component-reviewer | —                 |
| MCP App packaging     | —                        | mcp-reviewer      |
| Type safety in props  | react-component-reviewer | type-reviewer     |
| Security in UI code   | —                        | security-reviewer |
| Test coverage gaps    | —                        | test-reviewer     |

When overlap exists, both reviewers apply — their assessments are
complementary, not competing.

### Agent Construction

All three agents follow the ADR-129 triplet pattern: canonical template +
skill + situational rule. Platform adapters for Cursor, Claude Code,
Codex, and Gemini CLI. Reading requirements include ADR-147, ADR-148,
ADR-149, and `docs/governance/accessibility-practice.md` and
`docs/governance/design-token-practice.md`.

### Testing Reviewer Cluster Pattern (Future-Facing)

This ADR documents a pattern that may influence test-reviewer evolution:
make `test-reviewer` a cluster entry point, split testing reviewers by
test type (unit, integration, E2E, accessibility, visual), with shared
principles in the entry point. This is not implemented in this plan —
it is recorded as a future-facing recommendation for the testing reviewer
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

A single "frontend-reviewer" would have too broad a scope: WCAG 2.2
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

| Risk                                                                                                | Mitigation                                                                                                                                 |
| --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **ADR-135 naming deviation**: New agents use `-reviewer` suffix despite ADR-135 deciding to drop it | Intentional tech debt. All three agents will be included in the taxonomy rename batch when the Agent Classification Taxonomy plan executes |
| Gateway triage routing may not trigger correctly                                                    | Phase 3 of the frontend plan is explicitly a validation step — the new agents review real changes, exercising the routing                  |
| Overlap with existing reviewers creates noise                                                       | Overlap boundaries documented in this ADR; complementary assessment is intentional                                                         |

## Consequences

### Positive

- UI changes receive specialist review before WS3 Phase 4 begins
- The cluster pattern is documented and reusable for future cohorts
- MCP boundary is explicit — UI specialists own inside the view,
  mcp-reviewer owns around it

### Negative

- Three new agents increase the reviewer roster from 16 to 19.
  Mitigation: the gateway handles routing; agents are only invoked
  when their signals match
- The testing reviewer cluster pattern is documented but not
  implemented — may create expectation of near-term delivery.
  Mitigation: explicitly labelled as future-facing recommendation
