---
plan_id: context-preservation-and-intent-map-semantic-model
title: "Context Preservation and Intent Map — Semantic Model"
type: semantic-model
status: active
lifecycle: current
thread: strategy-and-plan-estate-holistic-review
last_updated: 2026-06-20
model_scope: project-context-preservation-intent-map
related:
  - governed-repo-document-graph.semantic-model.md
  - governed-repo-document-graph.plan.md
  - service-authority-and-operating-contexts.semantic-model.md
  - vision-strategy-and-plan-estate.plan.md
  - high-level-plan.md
  - ../memory/operational/threads/strategy-and-plan-estate-holistic-review.next-session.md
  - ../../VISION.md
  - ../../docs/strategy/
source_threads:
  - linear-conceptual-model
  - github-branch-review
  - governed-document-graph-discussion
  - semantic-model-loss-sweep
  - service-authority-context-discussion
summary: "Adversarial preservation scan for the ChatGPT project context: what knowledge, understanding, and intent would be lost if only the repo remained, and where each kind of durable intent should live."
---

# Context Preservation and Intent Map — Semantic Model

## Purpose

This document answers two questions:

1. **What would be lost if the originating ChatGPT project context were no longer
   available?**
2. **Where should the corresponding information, knowledge, understanding, and
   intent live in the repository so it survives?**

It is deliberately adversarial. It assumes future agents may not have access to
chat history, project memory, or the human's implicit reasoning. The repo must
therefore hold enough durable structure that future humans and agents can recover
not only the words, but the **intent** behind the model.

## Preservation principle

A durable repo record should preserve four layers:

```text
information  = facts, names, links, artefacts, states
knowledge    = interpreted meaning and relationships
understanding = why the model is shaped this way and what failure modes it avoids
intent       = what the human wanted preserved, protected, or made possible
```

The highest-risk loss is not raw information. It is the loss of **why the
structure matters**.

## Core preservation map

| Project insight / intent | Loss risk if not recorded | Durable repo home |
| --- | --- | --- |
| Repo is an agentic-first product-development operating substrate, not just code/docs. | Future agents treat the repo as ordinary source plus markdown. | `service-authority-and-operating-contexts.semantic-model.md`; `VISION.md`; `docs/strategy/`. |
| Repo owns durable intent; Linear owns execution state. | Linear becomes a competing source of scope/strategy truth. | `governed-repo-document-graph.semantic-model.md`; Linear projection fields in future schemas. |
| GitHub PRs aggregate readiness/review for proposed changes. | PRs are treated as generic code review only, or quality signals scatter. | `service-authority-and-operating-contexts.semantic-model.md`; future PR template/review-lane docs. |
| Oak strategy → repo vision → repo strategy → repo planning is informational dependence, not sequence. | Future work freezes unnecessarily, or downstream activity creates false authority. | `vision-strategy-and-plan-estate.plan.md`; `governed-repo-document-graph.semantic-model.md`; thread next-session record. |
| Three value streams are co-equal and systemic. | Framework/tools/app split into unrelated tracks or one stream dominates by accident. | `VISION.md`; `docs/strategy/`; `vision-strategy-and-plan-estate.plan.md`. |
| Product milestones are product increments/release gates, not repo strategy. | Curriculum MCP release ladder becomes the whole repo's organising spine. | `governed-repo-document-graph.semantic-model.md`; future product-increment model. |
| Threads, value streams, products, product increments, and plans are different projections. | False 1:1 hierarchy is imposed for navigation convenience. | `governed-repo-document-graph.semantic-model.md`; future document-type registry. |
| Relationship direction matters. | Reading evidence from a tool is treated the same as mutating that tool. | `service-authority-and-operating-contexts.semantic-model.md`; future service relationship registry. |
| Preferred agent context is usually local repo terminal with human dev. | Agents migrate into third-party tools or cloud contexts without clear reason. | `service-authority-and-operating-contexts.semantic-model.md`; agent practice docs. |
| Third-party services evidence and support; they do not own repo interpretation. | Sentry/PostHog/Sonar/Elastic/Figma become hidden authorities. | `service-authority-and-operating-contexts.semantic-model.md`; reports/strategy interpretation rules. |
| Governance is not bureaucracy; it preserves meaning across agents and services. | Future agents strip the model down to tooling or schemas only. | This document; `governed-repo-document-graph.semantic-model.md`. |
| Archive discipline is value-preserving. | Estate cleanup becomes destructive tidying. | `vision-strategy-and-plan-estate.plan.md`; archive READMEs; future disposition fields. |
| Continuity records orient but do not govern scope. | Newer handoff docs override controlling plans. | Thread next-session records; `governed-repo-document-graph.semantic-model.md`. |
| Reports can be archived but still useful as evidence/provenance. | Reports are either over-trusted as current strategy or ignored as obsolete. | Report frontmatter; archive supersession mappings; semantic model. |
| System architecture/code design/software engineering discipline are first-class altitudes. | Architecture and code quality are treated as implementation detail rather than operating model. | `service-authority-and-operating-contexts.semantic-model.md`; ADRs; engineering docs; PR review lanes. |

## Where each kind of intent should live

### Vision intent

**Lives in:** `VISION.md`.

The vision states the intended change, why it matters, and the top-level map to
how. It should not absorb detailed strategy, execution status, or implementation
commitments.

**Preserve here:**

- what change the repo exists to make;
- the three co-equal streams;
- how the repo services Oak's mission and strategy;
- the high-level public/leadership-facing story.

### Strategy intent

**Lives in:** `docs/strategy/` once authored, with transitional authority in
`vision-strategy-and-plan-estate.plan.md`.

Strategy defines diagnosis, choices, non-goals, measures, hand-offs, and how the
streams operate as a system.

**Preserve here:**

- theory of change;
- stream-to-Oak-strategy alignment;
- streams-as-system map;
- strategic choices and what the repo will not do;
- measures and where measurement authority lives;
- external gates and hand-offs.

### Governance/scope intent

**Lives in:** `.agent/plans/vision-strategy-and-plan-estate.plan.md` and sibling
semantic models.

**Preserve here:**

- what body of work is being governed;
- which documents are authorities;
- how vision, strategy, and plan estate relate;
- what can proceed before strategy is fully settled;
- what must wait for upstream information.

### Semantic model intent

**Lives in:**

- `.agent/plans/governed-repo-document-graph.semantic-model.md`;
- `.agent/plans/service-authority-and-operating-contexts.semantic-model.md`;
- this document.

**Preserve here:**

- document ontology;
- authority model;
- relationship families;
- service authority and operating contexts;
- multi-altitude model;
- preservation/loss reasoning.

### Delivery/enforcement intent

**Lives in:** `.agent/plans/governed-repo-document-graph.plan.md` and future
implementation plans.

**Preserve here:**

- phased delivery;
- schema/validation direction;
- agent-tools direction;
- migration strategy;
- observe/warn/enforce modes.

### Product intent

**Lives in:** product docs/plans and product-increment/release-gate records under
`.agent/plans/` or future product-specific homes.

**Preserve here:**

- product surfaces;
- value propositions;
- release/readiness gates;
- product-specific measures;
- product-to-stream relationships.

### Plan intent

**Lives in:** `.agent/plans/`.

Plans preserve durable work intent: what is needed, why, acceptance criteria,
dependencies, evidence expectations, and relationships to strategy/products/
value streams/Linear.

### Execution intent

**Lives primarily in:** Linear.

The repo should record the projection relationship, not mirror every live task
state.

**Preserve in repo only when durable:**

- which repo plan/product increment generated work;
- the Linear project/initiative/issue IDs where useful;
- completion summary when it changes durable repo state;
- evidence that should survive beyond the task lifecycle.

### Change/readiness intent

**Lives in:** GitHub PRs, with durable summaries in repo records where needed.

PRs aggregate readiness for proposed changes. They should identify affected
review lanes: strategy, governance, evidence, generated code, runtime, design,
architecture, code quality, release readiness, or migration/disposition.

### Evidence intent

**Lives in:** `.agent/reports/`, evidence records, PR comments/checks, and service
links where appropriate.

Evidence is not automatically strategy. It supports interpretation.

### Architecture intent

**Lives in:** ADRs, architecture docs, relevant plans, and PR review lanes.

Architecture intent includes boundaries, contracts, dependency direction,
transport discipline, package topology, integration patterns, and accepted
constraints.

### Code-design intent

**Lives in:** code, package READMEs, ADRs, engineering docs, and plan acceptance
criteria.

Code design intent includes abstraction boundaries, APIs, naming, layering,
testing seams, type-safety expectations, and maintainability principles.

### Code-quality intent

**Lives in:** engineering docs, quality gates, PR review expectations, SonarQube
interpretation rules, test strategy, and release readiness docs.

SonarQube Cloud, GitHub checks, tests, and review agents evidence quality; they
do not alone define quality.

### Software-engineering discipline intent

**Lives in:** engineering docs, governance docs, ADRs/PDRs, agent practice docs,
PR review norms, and release readiness criteria.

This includes type safety, testing, accessibility, security, observability,
review, documentation, agent collaboration, change control, and quality bars.

### UX/design intent

**Lives in:** Figma for design source; repo for implementation, accessibility,
product context, and release readiness.

Figma expresses design intent. The repo records how design intent becomes
implemented product behaviour.

### Runtime/stability/performance intent

**Lives in:** observability plans, Sentry-linked reports, runtime docs, and
release-readiness criteria.

Sentry provides evidence. The repo interprets whether evidence matters and what
work it implies.

### Product-usage/success intent

**Lives in:** strategy measures, product docs, reports, and PostHog-linked
evidence.

PostHog observes behaviour. The repo defines what success means and how to
interpret the signal.

### Search/retrieval-quality intent

**Lives in:** semantic-search plans, reports, Elastic-linked evidence, and
product/release criteria.

Elastic provides search/index/retrieval evidence. The repo defines quality,
product relevance, and acceptable trade-offs.

### Continuity intent

**Lives in:** `.agent/memory/operational/threads/`.

Continuity records should point to authority and preserve pickup context, but not
become scope authority.

### Provenance/archive intent

**Lives in:** archive frontmatter, archive READMEs, supersession mappings, and
reports.

Archive records should explain what value is preserved, where live authority now
lives, and what must not be treated as current.

## Adversarial scan: high-risk losses and prevention

### 1. Losing the operating-substrate thesis

**Risk:** Future agents treat the repo as source code plus a plan folder.

**Prevention:** Keep the thesis explicit in
`service-authority-and-operating-contexts.semantic-model.md`, `VISION.md`, and
strategy docs. Repeat it at major entry points when relevant.

### 2. Losing the difference between intent and execution

**Risk:** Linear, GitHub, or service dashboards become de facto planning truth.

**Prevention:** Encode repo/Linear/GitHub/service authority boundaries in semantic
models and later in frontmatter/relationship registries.

### 3. Losing the human-agent collaboration model

**Risk:** Agents are treated either as ordinary automation or as independent
owners.

**Prevention:** Preserve operating-context rules: local repo terminal as default
for repo-centred work; tool-native contexts only when the object belongs there;
humans and repo-governed documents retain decision authority.

### 4. Losing directional capability distinctions

**Risk:** "Agent can access Sentry" is treated as one undifferentiated permission.

**Prevention:** Model actor, operating context, source, target, capability mode,
data direction, authority effect, supervision, and preferred surface.

### 5. Losing architecture and engineering discipline as first-class concerns

**Risk:** Architecture, code design, code quality, and discipline become local PR
preferences rather than repo-owned definitions.

**Prevention:** Keep architecture/code-design/code-quality/software-engineering
altitudes in the service model; record durable decisions in ADRs and engineering
docs; make PR review lanes reflect these surfaces.

### 6. Losing the multi-altitude model

**Risk:** Vision, strategy, product, architecture, code, runtime, UX, quality,
release readiness, and usage metrics collapse into one backlog view.

**Prevention:** Preserve the altitude table and give each altitude a repo-owned
definition plus supporting evidence services.

### 7. Losing the streams-as-system insight

**Risk:** The three value streams are treated as parallel tracks rather than a
mutually reinforcing system.

**Prevention:** Carry the streams-as-system map in strategy and keep plans
traceable to streams without forcing one-to-one ownership.

### 8. Losing the product-increment correction

**Risk:** Product milestones distort repo strategy.

**Prevention:** Use product-increment/release-gate language for product-specific
readiness and keep strategy at the value-stream/system level.

### 9. Losing evidence interpretation boundaries

**Risk:** Service metrics become decisions: Sentry means priority, PostHog means
success, Sonar means release blocker, Figma means implemented truth.

**Prevention:** Record each service as evidence authority only in its domain;
interpretation belongs in repo strategy/plans/reports and human judgement.

### 10. Losing PR readiness aggregation

**Risk:** Readiness signals scatter across tools and no one surface tells whether
a change is safe to merge or promote.

**Prevention:** Treat GitHub PRs as readiness aggregation hubs and require review
lanes for mixed changes.

### 11. Losing archive/provenance discipline

**Risk:** Cleanup removes ideas or reports without preserving value.

**Prevention:** Require disposition mappings: archived, superseded by, extracted
into, re-housed at, or explicitly removed with rationale.

### 12. Losing continuity boundaries

**Risk:** Thread next-session docs become scope authority by recency.

**Prevention:** Continuity records must point to controlling plans and state that
they are pickup surfaces.

### 13. Losing private-source handling

**Risk:** Local/private strategy references are either ignored or leaked into repo
content.

**Prevention:** Preserve the rule: read first-hand where permitted, express
original derivation, never quote/link/copy restricted material.

### 14. Losing the reason for governance

**Risk:** Future agents see schemas, relationship registries, and semantic docs as
ceremony.

**Prevention:** Keep this preservation map and the semantic models near the
controlling plan so the reason remains visible: governance preserves intent
across humans, agents, services, PRs, and time.

## Entry-point preservation checklist

Future agents should be able to recover the model by reading:

1. `VISION.md` — change intent and top-level streams.
2. `.agent/plans/vision-strategy-and-plan-estate.plan.md` — controlling scope and
   informational-dependence model.
3. `.agent/plans/governed-repo-document-graph.semantic-model.md` — document graph
   ontology and authority model.
4. `.agent/plans/service-authority-and-operating-contexts.semantic-model.md` —
   service/agent operating-context model.
5. `.agent/plans/context-preservation-and-intent-map.semantic-model.md` — this
   preservation map.
6. `.agent/memory/operational/threads/strategy-and-plan-estate-holistic-review.next-session.md`
   — current pickup surface, not scope authority.
7. `docs/strategy/` once authored — strategy corpus and measures.
8. `.agent/reports/archive/plan-estate-survey-2026-06-15/README.md` — dated
   survey evidence and method, not current strategy.

## Closing principle

The repository must preserve enough meaning that a future human-agent team can
answer:

```text
What is this repo for?
How does it turn strategy into work?
What does each document type own?
Which services support which kinds of evidence?
Where does live execution belong?
Where does durable intent belong?
How do we know a change is ready?
How do we prevent tools, metrics, or agents from becoming accidental authority?
```

If those answers live in the repo, the project context has been preserved. If
they live only in chat history, the model is fragile.
