---
plan_id: repo-intent-and-service-knowledge-boundaries-proposal
title: "Repo Intent and Service Knowledge Boundaries — Proposal Record"
type: proposal-record
status: proposed
lifecycle: current
thread: strategy-and-plan-estate-holistic-review
last_updated: 2026-06-20
proposal_scope: repo-intent-service-knowledge-boundaries
related:
  - context-preservation-and-intent-map.semantic-model.md
  - service-authority-and-operating-contexts.semantic-model.md
  - governed-repo-document-graph.semantic-model.md
  - governed-repo-document-graph.plan.md
  - vision-strategy-and-plan-estate.plan.md
  - high-level-plan.md
  - ../memory/operational/threads/strategy-and-plan-estate-holistic-review.next-session.md
source_threads:
  - project-concept-gap-review
  - linear-conceptual-model
  - service-authority-context-discussion
  - context-preservation-and-intent-map-discussion
summary: "Proposal to explicitly preserve the repository's role as durable intent substrate, and to define how external service knowledge should relate to repo-held intent."
---

# Repo Intent and Service Knowledge Boundaries — Proposal Record

## Status

This is a **proposal record**, not an executable plan, semantic model, directive,
or accepted decision.

It is stored at the root of `.agent/plans/` as a sibling to the other
project-derived planning artefacts because its current purpose is planning
triage: preserve the proposal clearly enough that it can be accepted, rejected,
merged into existing semantic models, promoted into a directive, or decomposed
into practical plans without relying on chat history.

## Proposal

Create or consolidate a canonical repo guidance surface that makes the following
model explicit:

```text
The repository is not only source code, infrastructure, product notes, or a
planning archive. It is the durable intent substrate for the ecosystem.

It records enough intent for humans and agents to understand what should be
built, why it matters, how quality is judged, how releases become trustworthy,
how product and engineering learning is interpreted, and how external services
support rather than silently redefine that intent.
```

The guidance should define how repo-held intent relates to knowledge and state in
external services such as Linear, GitHub, Figma, Sentry, PostHog, SonarQube
Cloud, Elastic Cloud Serverless, deployment platforms, and future agent/tooling
surfaces.

## Why this matters

The project is moving toward an agentic-first product-development model. In that
model, work no longer lives only in code, tickets, or human memory. It spans:

- durable repo documents;
- live delivery and assignment systems;
- design tools;
- observability and analytics systems;
- static quality systems;
- search/index infrastructure;
- pull requests and review surfaces;
- local and cloud AI-agent operating contexts.

Without an explicit boundary model, future contributors may accidentally treat
all of those surfaces as equal authorities. That would make the system fragile:
strategy could drift into Linear, design intent could remain unlinked in Figma,
quality signals could become disconnected from product judgement, and agents
could act in the wrong operating context with the wrong authority assumptions.

## Proposed principles

### 1. Repo as durable intent substrate

The repo should hold the durable intent needed to build, validate, release,
operate, improve, and reason about the product across human and agent
contributors.

This includes not only product and strategy intent, but also system architecture,
code design, code quality, software engineering discipline, release readiness,
performance, stability, user experience, and measurement.

### 2. External services as knowledge surfaces

External services should be treated as specialised knowledge and state surfaces,
not as undifferentiated integrations.

Each service relationship should answer:

```text
Which facts live there?
Which live state lives there?
Which durable interpretation belongs in the repo?
Which direction does information flow?
Which actor may read, summarise, annotate, create, or mutate?
Which surface aggregates the result?
```

### 3. Repo defines what and why; delivery tools coordinate who and when

The repo should define what is needed, why it matters, what constraints apply,
and what acceptance or readiness means.

Tools such as Linear should coordinate assignment, workflow state, cycles,
projects, and delivery motion. They should not become competing sources of
strategy, scope, durable product intent, or engineering doctrine.

### 4. GitHub PRs aggregate proposed-change readiness

GitHub PRs are a natural hub for proposed-change evidence: diffs, review,
quality gates, deployment previews, linked issues, observability references,
design links, and human/agent comments.

They should aggregate readiness for a change. They should not become the durable
home of strategy or long-lived intent.

### 5. Figma is part of the intent graph

Design artefacts are product intent. Figma should be included explicitly in the
service map because it may hold UX flows, interaction intent, design-system
constraints, accessibility intent, review comments, and source-of-design
material.

Where design intent lives outside the repo, the repo should still define how it
is referenced, validated, translated into implementation, and kept aligned with
code and product strategy.

### 6. Multi-altitude intent includes engineering discipline

The repo's multi-altitude model should include architecture and engineering
quality explicitly, not as lower-level implementation detail.

The altitude model should be able to place:

- vision;
- strategy;
- threads/value streams;
- products and product increments;
- milestones and release gates;
- plans and execution detail;
- system architecture;
- code design;
- software engineering discipline;
- quality, stability, performance, accessibility, and user-experience evidence;
- operational learning and measurement.

### 7. Loss-prevention review should become a recurring test

For substantial planning, architecture, strategy, governance, or agent-practice
work, future contributors should ask:

```text
If this work disappeared, what intent would be unrecoverable?
Where is that intent recorded?
Is it in the right layer?
Is it discoverable by a new human?
Is it discoverable by an agent?
Is the external source of truth linked?
```

The test is intended to prevent destructive tidying, transcript dependence,
implicit-human-context dependence, and service-state drift.

### 8. Conversation-to-repo capture should be explicit

Substantial project conversations should not be preserved as transcripts by
default. They should be distilled into durable repo records containing:

- decisions;
- definitions;
- open questions;
- assumptions;
- source links;
- placement recommendations;
- loss risks;
- rejected or superseded alternatives where relevant.

The repo should preserve intent, not chat log volume.

## Candidate durable homes if accepted

| Candidate home | Use if the proposal becomes... |
| --- | --- |
| `.agent/directives/` | A stable rule for agents and humans working in the repo. |
| `.agent/plans/*.semantic-model.md` | A semantic model or extension of existing service/document authority models. |
| `.agent/templates/` | A repeatable loss-prevention or conversation-capture review template. |
| `docs/architecture/architectural-decisions/` | A settled architectural decision about repo/service authority boundaries. |
| `VISION.md` or `docs/strategy/` | A public or strategy-facing articulation of the repo as durable intent substrate. |
| Collection plans | Practical work to implement indexes, templates, service maps, PR templates, or governance checks. |

## Non-goals

This proposal does **not** imply that every fact should be copied into the repo.
External systems should continue to own their live operational state.

It also does **not** imply that agents should operate everywhere by default.
The operating context should be chosen from the object of work, the authority
being exercised, and the failure modes of the service relationship.

Finally, this is not a proposal to make governance heavier for its own sake. The
purpose is to preserve meaning, authority boundaries, and continuity across
humans, agents, tools, and time.

## Open questions

1. Should this proposal become a standalone directive, or should it be absorbed
   into the existing service-authority and context-preservation semantic models?
2. Should the loss-prevention review become a reusable template under
   `.agent/templates/`?
3. Should service relationships be recorded in a structured registry using the
   relationship dimensions already described in the service-authority semantic
   model?
4. Should PR templates explicitly include readiness aggregation lanes for Linear,
   Figma, observability, analytics, quality, deployment, and repo-plan links?
5. Which parts, if any, should be promoted into public-facing `VISION.md` or
   `docs/strategy/` rather than remaining agent/planning-facing?

## Promotion criteria

Before this proposal becomes executable work, a future update should decide:

- whether it is already sufficiently covered by existing semantic models;
- which single document, if any, should become canonical;
- which parts are doctrine, which parts are templates, and which parts are
  implementation tasks;
- whether root-level planning remains the right home or the record should be
  archived after durable outcomes are promoted.
