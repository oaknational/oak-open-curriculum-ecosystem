---
title: "Product-Development Governance — Collection"
type: collection-index
status: active
lifecycle: current
thread: strategy-and-plan-estate-holistic-review
last_updated: 2026-06-20
---

# Product-Development Governance

How this repository governs and preserves **product-development intent** —
the durable intent graph (Oak strategy → our vision → our strategy → our
planning), the operating model around it, and the active rework that applies it.

## Authority gradient (read this first)

This collection has one authority and a set of subordinate inputs. Do not conflate
them.

- **The authority** — [`vision-strategy-and-plan-estate.plan.md`](vision-strategy-and-plan-estate.plan.md)
  is the **agreed, active controlling plan** for the `strategy-and-plan-estate-holistic-review`
  thread. It owns scope, sequencing, and acceptance for the vision, the strategy,
  and the plan-estate restructure. It is the scope authority.
- **The inputs** — everything under [`suggestions/`](suggestions/) is **imported
  analysis: suggestions, explorations, and conversation-starters**, not instructions
  and not governance authority. They were produced in a parallel ChatGPT-project
  context and merged in 2026-06-20. They are held at arm's length:
  question-and-validate, never adopt wholesale. The sub-folder placement encodes the
  subordination — a suggestion does not acquire authority by being merged or by being
  comprehensive.

## What's in `suggestions/`

| File | What it is |
| --- | --- |
| [`governed-repo-document-graph.semantic-model.md`](suggestions/governed-repo-document-graph.semantic-model.md) | A model of the repo as a typed document graph (nodes + typed relationship edges, authority model, many-to-many). |
| [`governed-repo-document-graph.plan.md`](suggestions/governed-repo-document-graph.plan.md) | A phased delivery plan for that graph (schemas, validation, Linear projection). |
| [`service-authority-and-operating-contexts.semantic-model.md`](suggestions/service-authority-and-operating-contexts.semantic-model.md) | How the repo relates to external services (Linear, GitHub, Figma, Sentry, PostHog, SonarQube, Elastic) and to agent operating contexts. |
| [`context-preservation-and-intent-map.semantic-model.md`](suggestions/context-preservation-and-intent-map.semantic-model.md) | An adversarial "what's lost if chat context vanishes?" map of where each kind of intent should live. |
| [`repo-intent-and-service-knowledge-boundaries.proposal.md`](suggestions/repo-intent-and-service-knowledge-boundaries.proposal.md) | A proposal to codify the repo as a durable intent substrate with explicit service boundaries. |
| [`project-context-preservation-gap-report.md`](suggestions/project-context-preservation-gap-report.md) | A gap report on what the repo already preserves vs what remains at risk. |

## Disposition (how these inputs are being weighed)

Assessed 2026-06-20 against the active controlling plan. Summary verdicts; the
controlling plan and thread record hold the detail.

- **Strong corroboration.** They independently re-derive the model the controlling
  plan already holds (informational dependence; three co-equal streams as a system;
  axis separation; product-increments ≠ repo strategy; continuity-orients-not-governs).
  Convergence raises confidence; it is not redundancy to delete.
- **Graphs — vision ratified 2026-06-21; staged build.** The owner ratified the full
  intent-graph design (the [repo-intent-graph plan](future/repo-intent-graph.plan.md), six
  pillars): the whole contract shape is ratified up front and the build is staged node-type by
  node-type. The smallest slice (the `plan` node-schema + strategic-choice registry +
  observe-mode extractor) unlocks the Body-3 survey and restructure without compromising the
  vision. The specific node/edge **taxonomy remains survey-gated**; these `suggestions/`
  documents are its design input (input-to-verify), not adopted wholesale.
- **Service authority — forward design, not now.** Linear and Figma are real
  near-term needs (a team is forming; a designer is incoming; Oak uses Figma at the
  org level), so the `projects_to_linear` and Figma-source edge *vocabulary* is worth
  defining when that work lands. The model's home, if adopted, is a directive or ADR
  (operating model) — **not** the strategy corpus. Build projection tooling only when
  the consumers exist.
- **Provenance.** These are inputs to verify, not truth. Several premises are the
  ChatGPT synthesis's framing (the "operating substrate" thesis, the exact service
  relationship dimensions); validate against first-hand repo state and owner direction
  before acting. The owner was in the originating conversation, which does not make
  the analysis correct.

## Notes

- The suggestion documents contain internal path references that **predate this
  relocation** (e.g. prose paths to `.agent/plans/vision-strategy-and-plan-estate.plan.md`).
  They are frozen imported inputs; their clickable links were repointed on the move,
  but stale prose paths inside them are left as-is rather than rewriting imported text.
- The fitness-system-closure findings record is a **sibling in location, not subject**;
  it lives with its backbone plan in
  [`../agentic-engineering-enhancements/current/`](../agentic-engineering-enhancements/current/),
  not here.
