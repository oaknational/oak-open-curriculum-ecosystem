---
plan_id: project-context-preservation-gap-report
title: "Project Context Preservation Gap Report"
type: report
status: active
lifecycle: current
thread: strategy-and-plan-estate-holistic-review
last_updated: 2026-06-20
related:
  - context-preservation-and-intent-map.semantic-model.md
  - governed-repo-document-graph.semantic-model.md
  - governed-repo-document-graph.plan.md
  - service-authority-and-operating-contexts.semantic-model.md
  - vision-strategy-and-plan-estate.plan.md
  - high-level-plan.md
  - good-first-issues.md
  - completed-plans.md
  - ../memory/operational/threads/strategy-and-plan-estate-holistic-review.next-session.md
  - ../../VISION.md
  - ../../README.md
source_threads:
  - github-repo-context-gap-scan
  - linear-conceptual-model
  - governed-document-graph-discussion
summary: "Report capturing what important project-conversation concepts are already preserved in the repo, what remains at risk, and how high-level-plan.md, good-first-issues.md, and completed-plans.md should be treated under the emerging governed document graph model."
---

# Project Context Preservation Gap Report

## Purpose

This report captures the result of an adversarial scan across the recent project
conversation context and the current `docs/planning-and-validation` branch.

Question answered:

```text
Are there any concepts or conclusions that matter, in the project conversations,
that are not yet recorded in the repo?
```

This report is intentionally a **capture report**, not a new authority layer. The
current scope authority remains
[`vision-strategy-and-plan-estate.plan.md`](vision-strategy-and-plan-estate.plan.md).
The semantic models remain the places where the model is preserved. This report
records what was found, what is still fragile, and which follow-up work should be
considered during the strategy and plan-estate restructure.

## Overall verdict

The branch has captured the main project-conversation intent better than expected.
The core thesis, authority model, service model, and preservation model are now
present in repo documents.

The main remaining risk is not that the model is absent. It is that parts of it
are currently:

- recorded as semantic models but not yet operationalised;
- recorded as pending strategy requirements rather than authored strategy;
- visible in `.agent/plans/` but not yet reflected in all first-read surfaces;
- undermined by stale coordinating/index files that predate the new model;
- not yet protected by a regular chat-to-repo capture discipline.

## Concepts now adequately preserved

### Repo as durable intent substrate

The repository is now explicitly described as more than code, infrastructure, or
product documentation. It is an agentic-first product-development operating
substrate: repo-centred, evidence-aware, multi-altitude, and designed for
human-agent collaboration.

The model now preserves that the repo defines and organises:

- product and ecosystem purpose;
- strategy-to-plan translation;
- architecture and code-design understanding;
- software-engineering discipline;
- review, quality, release readiness, performance, stability, UX, and success
  interpretation;
- evidence interpretation from external services;
- safe and useful AI-agent operation with humans.

Primary homes:

- [`service-authority-and-operating-contexts.semantic-model.md`](service-authority-and-operating-contexts.semantic-model.md)
- [`context-preservation-and-intent-map.semantic-model.md`](context-preservation-and-intent-map.semantic-model.md)
- [`VISION.md`](../../VISION.md)

### Repo, Linear, and GitHub authority split

The repo/Linear/GitHub distinction is now preserved:

```text
Repo documents define durable intent.
Linear coordinates execution.
GitHub PRs aggregate review and readiness for proposed changes.
```

This distinction is central. It prevents Linear from becoming scope authority and
prevents GitHub PRs from becoming strategy by convenience.

Primary homes:

- [`governed-repo-document-graph.semantic-model.md`](governed-repo-document-graph.semantic-model.md)
- [`service-authority-and-operating-contexts.semantic-model.md`](service-authority-and-operating-contexts.semantic-model.md)
- [`governed-repo-document-graph.plan.md`](governed-repo-document-graph.plan.md)

### Informational dependence, not execution order

The branch now records the corrected model:

```text
Oak's strategy → repo vision → repo strategy → repo planning
```

The arrows mean informational dependence: what must be known for the downstream
layer to be authored correctly. They do not freeze downstream work, rank the bodies
by importance, or imply temporal sequence.

Primary homes:

- [`vision-strategy-and-plan-estate.plan.md`](vision-strategy-and-plan-estate.plan.md)
- [`governed-repo-document-graph.semantic-model.md`](governed-repo-document-graph.semantic-model.md)
- [`context-preservation-and-intent-map.semantic-model.md`](context-preservation-and-intent-map.semantic-model.md)

### Three value streams as a system

The repo now records that the three streams are co-equal and mutually reinforcing:

```text
agentic framework builds the other two;
engineering tools underpin the app;
the app proves the foundation and reaches teachers;
the framework is itself reusable value.
```

This protects against the MCP app, the engineering-tooling layer, or the agentic
engineering framework becoming accidentally dominant.

Primary homes:

- [`VISION.md`](../../VISION.md)
- [`vision-strategy-and-plan-estate.plan.md`](vision-strategy-and-plan-estate.plan.md)
- [`governed-repo-document-graph.semantic-model.md`](governed-repo-document-graph.semantic-model.md)

### Product increments rather than repo-global milestones

The model now preserves the correction that product-specific milestones should be
understood as product increments or release gates. The Curriculum MCP release
ladder must not become the whole repo's strategic spine.

Primary homes:

- [`governed-repo-document-graph.semantic-model.md`](governed-repo-document-graph.semantic-model.md)
- [`governed-repo-document-graph.plan.md`](governed-repo-document-graph.plan.md)
- [`context-preservation-and-intent-map.semantic-model.md`](context-preservation-and-intent-map.semantic-model.md)

### System architecture, code design, code quality, and engineering discipline as first-class altitudes

The multi-altitude model now includes system architecture, code design, software
engineering discipline, code quality, release readiness, runtime, product usage,
search/retrieval quality, design/UX, and agentic practice.

This matters because architecture and quality are not local PR preferences in an
agentic-first repo. They are part of the operating model.

Primary homes:

- [`service-authority-and-operating-contexts.semantic-model.md`](service-authority-and-operating-contexts.semantic-model.md)
- [`context-preservation-and-intent-map.semantic-model.md`](context-preservation-and-intent-map.semantic-model.md)
- ADRs and engineering docs as durable homes for specific decisions.

### Directional service relationships, including Figma

The branch now records that service relationships are directional and authority-
sensitive. Reading Sentry evidence into a local repo agent context is not the same
as letting an agent mutate Sentry state with repo context.

Figma is now represented explicitly as design-source and UX collaboration
authority, not implementation truth or repo-strategy authority.

Primary home:

- [`service-authority-and-operating-contexts.semantic-model.md`](service-authority-and-operating-contexts.semantic-model.md)

## Remaining preservation gaps and risks

### Gap 1 — Strategy corpus not yet authored

The repo records what the strategy corpus must contain, but the actual
`docs/strategy/` corpus does not yet exist.

Required content is already specified:

- shared diagnosis of the experiment-to-product transition;
- Oak-strategy alignment as original derivation;
- streams-as-system map;
- guiding choices;
- what the repo will not do;
- measures, grounded by owner/Oak input rather than agent invention;
- MCP-app K1-K3 readiness keystones inside the app stream;
- release-readiness requirements as named hand-offs.

Risk if not closed: future agents can recover the *need* for strategy but still do
not have the strategy. The plan-estate restructure remains informationally gated
for new-boundary work.

Recommended treatment: keep this as Body 2 under
[`vision-strategy-and-plan-estate.plan.md`](vision-strategy-and-plan-estate.plan.md).
Do not let high-level indexes or plan bodies substitute for the strategy corpus.

### Gap 2 — Semantic model not yet ratified or enforced

The governed document graph is now recorded, but not yet ratified into a document
registry, relationship registry, schemas, or validation tooling.

Risk if not closed: future agents may agree with the model in prose while still
creating drift through untyped metadata, folder inference, or unregistered
relationship forms.

Recommended treatment: continue
[`governed-repo-document-graph.plan.md`](governed-repo-document-graph.plan.md) as
the delivery plan for ratification, observe-mode extraction, warn mode, and later
enforcement.

### Gap 3 — First-read surfaces are not all reconciled

The model is captured in semantic and plan files, but first-read surfaces can still
lag behind it. In particular, PR descriptions, root indexes, and old planning
spines can preserve outdated framing after the underlying repo files have moved on.

Risk if not closed: a future reviewer or agent reads the stale first-read surface
and treats it as current because it is prominent.

Recommended treatment: run a consumer-walk whenever a major reframing lands:
README, VISION, `.agent/plans/README.md`, high-level plan or successor,
continuity record, PR description, and any release/milestone surfaces affected by
the change.

### Gap 4 — Chat-to-repo preservation is not yet a routine rule

This capture happened because the owner asked for it. The repo does not yet appear
to have a crisp standing rule that says materially reframing conversations must be
scanned for durable intent and either recorded or explicitly rejected.

Risk if not closed: the next major conceptual breakthrough stays in chat history
and becomes unavailable to future agents.

Recommended treatment: add a lightweight rule to the consolidation or handoff
workflow:

```text
After any materially reframing project conversation, run a context-preservation
scan. For each durable concept, either home it in the repo, point to an existing
repo home, or explicitly record that it is not durable repo intent.
```

This should not require every chat to become a report. It should apply when the
conversation changes strategy, authority, vocabulary, document structure,
operating model, or durable product/engineering intent.

### Gap 5 — Product, value-stream, thread, and plan mapping remains conceptual

The repo now records that these are different projections in a many-to-many graph,
but the operational schema is not yet ratified.

Risk if not closed: future agents understand the idea but continue to encode it
in inconsistent frontmatter or prose.

Recommended treatment: close through the document-type registry and relationship
registry in the governed document graph work.

## Specific open question: existing coordinating and index files

The owner raised a specific follow-up question: how should the existing
`high-level-plan.md`, `good-first-issues.md`, and `completed-plans.md` fit into the
new model?

Owner preference captured here:

```text
Delete where there is no obvious value, after scanning for useful information.
There likely needs to be some kind of coordinating plan document, but not
necessarily the one we have.
```

This preference should govern the Body 3 estate restructure. It should not be
applied as blind deletion. The correct move is scan → extract → re-home/archive →
remove with disposition.

### `high-level-plan.md`

Current role: strategic cross-collection index and temporary orientation surface.

Observed state:

- It still contains a superseded strategic-goal callout: the old "world-class
  primitives and modular building blocks" goal predates the three-stream vision.
- It usefully routes to major plan collections, release arc, graph/evidence work,
  discovery, practice/tooling, and runtime/quality/developer-experience surfaces.
- It mixes several functions: strategic overview, milestone snapshot, collection
  status table, and update rules.

Disposition analysis:

`high-level-plan.md` probably should not remain the canonical coordinating
document in its current form. It has useful routing content, but its name and
legacy body make it too easy for future agents to treat it as strategic authority.

Recommended treatment:

1. Do **not** delete immediately.
2. During Body 3, scan and extract useful routing content.
3. Replace with a slimmer coordinating index whose authority is explicit.
4. Archive or remove the current file with a recorded disposition once the
   successor exists.

Possible successor shape:

```text
.agent/plans/portfolio-coordination.md
```

or:

```text
.agent/plans/strategy-to-plan-index.md
```

The successor should:

- route from strategy choices to value streams, products, product increments, and
  plan collections;
- avoid defining strategy itself;
- avoid owning collection execution detail;
- declare that `.agent/plans/README.md` owns plan-estate navigation mechanics;
- declare that product roadmaps own product-increment/release-gate detail;
- be generated or easily validated once the governed document graph exists.

The successor should not:

- restate the vision at length;
- carry stale milestone ladders;
- become a second strategy corpus;
- become a dumping ground for cross-collection status.

### `good-first-issues.md`

Current role: curated starter-task/onramp document.

Observed state:

- It already starts with `Deprecated: to be removed - scan for useful content and
  move to permanent docs`.
- It records a useful distinction: the GitHub `good first issue` label is the live,
  drift-free source for individual starter tasks.
- It contains stable area-shaped onramps and definitions of done.
- It also includes contributor/onboarding guidance that may belong elsewhere.

Disposition analysis:

This file does not look like a plan in the new model. It is onboarding/contributor
routing, not durable plan intent. Keeping it in `.agent/plans/` makes the plan
estate noisier.

Recommended treatment:

1. Scan for useful content.
2. Re-home durable content:
   - GitHub label as authoritative live task source → contributor/onboarding docs
     or README onboarding section.
   - Stable area onramps → onboarding skill, contributor docs, or a dedicated
     `docs/engineering/onramps.md`-style surface.
   - Practice-shaped first tasks → Practice onboarding surface or
     `.agent/skills/onboard-me/`.
3. Delete or archive this file with disposition once re-homed.

Preferred final state: no `good-first-issues.md` in `.agent/plans/` unless it is
reconceived as a generated or externally projected index, not a hand-maintained
plan.

### `completed-plans.md`

Current role: central index of archived completed plans and key outcomes.

Observed state:

- It already starts with `Deprecated: to be removed - scan for useful content and
  move to permanent docs`.
- It contains useful historical summaries and links to archived plans.
- Some entries capture durable outcomes that may need to live in ADRs, package
  READMEs, engineering docs, release runbooks, or archive READMEs.
- As a central hand-maintained file, it is likely to drift.

Disposition analysis:

The value is provenance and outcome discovery, not plan coordination. Under the
new model, completed plans should be findable through archive records, graph
relationships, reports, or generated indexes rather than a manually maintained
root list.

Recommended treatment:

1. Scan every entry for durable outcomes not yet homed elsewhere.
2. Re-home durable outcomes into canonical docs/ADRs/READMEs where needed.
3. Preserve archive provenance in collection archive READMEs or governed archive
   metadata.
4. Replace any genuinely useful cross-archive discovery with a generated report or
   graph surface, not a manually edited plan file.
5. Delete or archive `completed-plans.md` with disposition when the archive graph
   or archive indexes cover its useful function.

Preferred final state: no manually maintained `completed-plans.md` as a planning
surface. Completed-plan discovery should be an archive/provenance concern.

## What coordinating document is still needed?

The repo likely still needs a coordinating document, but it should be clearer and
narrower than the current `high-level-plan.md`.

A useful coordinating document would answer:

```text
Given the strategy, where does each body of durable work live?
Which value streams, products, and product increments are active?
Which plan collections own which execution-intent areas?
Where should a future agent start for each kind of work?
Which surfaces are authoritative for strategy, product increments, execution
projection, reports, and archive/provenance?
```

It should not answer:

```text
What is the strategy?
What is the live task list?
Which issue is assigned to whom?
What is the current status of every archived plan?
```

Possible name:

```text
.agent/plans/portfolio-coordination.md
```

Possible document type:

```yaml
type: strategic-index
authority: routing_only
```

Possible content sections:

1. Strategy corpus pointer.
2. Value-stream map.
3. Product and product-increment map.
4. Plan collection ownership map.
5. Release/readiness coordination pointers.
6. Evidence/report pointers.
7. Execution projection rules: Linear and GitHub PR boundaries.
8. Archive/provenance routing.
9. Update rules and graph-validation expectations.

The most important constraint: the coordinating document should be a **router over
ratified authorities**, not a new authority competing with strategy, product
roadmaps, collection plans, or Linear.

## Recommended next actions

1. Update the PR description so it no longer preserves stale K1-K3 and 2A/2B/2C
   framing.
2. Author the `docs/strategy/` corpus before any strategy-dependent estate
   restructuring.
3. Add the chat-to-repo preservation rule to the relevant consolidation/handoff
   workflow.
4. Treat `high-level-plan.md`, `good-first-issues.md`, and `completed-plans.md` as
   Body 3 disposition targets:
   - scan first;
   - extract durable value;
   - re-home into canonical surfaces;
   - archive/delete with recorded disposition.
5. Continue the governed document graph plan to ratify document types,
   relationship types, frontmatter schemas, and observe-mode reporting.

## Closure test

This report has served its purpose when a future agent can answer, from repo
records alone:

```text
Which project-conversation concepts were captured?
Which ones remain unimplemented rather than unrecorded?
What stale first-read surfaces could mislead us?
What should happen to high-level-plan.md, good-first-issues.md, and
completed-plans.md?
What coordinating document, if any, should replace high-level-plan.md?
What rule prevents the next major chat-only insight from being lost?
```

If those answers are recoverable, this report can later be archived as provenance
once its recommendations are either implemented or deliberately rejected.
