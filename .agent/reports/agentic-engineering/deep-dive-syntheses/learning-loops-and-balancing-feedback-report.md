# Learning Loops and Balancing Feedback Report

## Executive Summary

This report captures the current shape of the repo's learning-loop
system with a specific question in mind: are the negative feedback
loops refined enough to detect unhelpful or low-value memory
accumulation, and can the repo use that information effectively when
it appears?

The short answer is: **partly, but unevenly**.

The repo already has strong reinforcing loops and strong refinement
loops. It is very good at producing observations, patterns, doctrine,
and enforcement. It also has several real balancing loops. The
strongest of those balancing loops, however, regulate **volume**,
**drift**, and **routing pressure** more than **semantic value
density**.

The highest-value improvement tranche is therefore not a new memory
layer or a sweeping redesign. It is a bounded tightening of two
existing junctions:

1. make the executive-memory drift loop materially present on the
   live executive surfaces, not only specified in doctrine;
2. make consolidation-time memory-quality judgement explicit and
   auditable, so "low-value accumulation" is recorded as a
   disposition rather than only inferred from prose.

Queued execution plan:
[learning-loop-negative-feedback-tightening.plan.md](../../../plans/agentic-engineering-enhancements/current/learning-loop-negative-feedback-tightening.plan.md)

## Scope and Method

This synthesis is grounded in the repo's current local doctrine and
live state, not an abstract theory of feedback loops. The main source
surfaces were:

- [practice.md](../../../practice-core/practice.md)
- [practice-index.md](../../../practice-index.md)
- [memory/README.md](../../../memory/README.md)
- [continuity-practice.md](../../../../docs/governance/continuity-practice.md)
- [consolidate-docs.md](../../../commands/consolidate-docs.md)
- [ADR-131](../../../../docs/architecture/architectural-decisions/131-self-reinforcing-improvement-loop.md)
- [ADR-144](../../../../docs/architecture/architectural-decisions/144-two-threshold-fitness-model.md)
- [ADR-150](../../../../docs/architecture/architectural-decisions/150-continuity-surfaces-session-handoff-and-surprise-pipeline.md)
- [PDR-018](../../../practice-core/decision-records/PDR-018-planning-discipline.md)
- [PDR-024](../../../practice-core/decision-records/PDR-024-vital-integration-surfaces.md)
- [PDR-028](../../../practice-core/decision-records/PDR-028-executive-memory-feedback-loop.md)
- [PDR-029](../../../practice-core/decision-records/PDR-029-perturbation-mechanism-bundle.md)
- [PDR-032](../../../practice-core/decision-records/PDR-032-reference-tier-as-curated-library.md)
- [repo-continuity.md](../../../memory/operational/repo-continuity.md)
- [reference/README.md](../../../reference/README.md)
- [onboarding-simulations-public-alpha-readiness.md](../../../plans/developer-experience/active/onboarding-simulations-public-alpha-readiness.md)
- [agentic-engineering research hub](../../../research/agentic-engineering/README.md)
- [graphify-oak-practice-analysis.md](../../../research/graphify-oak-practice-analysis.md)

The live operational check also included a local run of
`pnpm practice:fitness:informational` on 2026-04-23, which reported
`HARD (4 hard, 10 soft)`.

Follow-on exploration after the first draft also included the local
Graphify repo copy under
[`reference-local/repos/graphify/`](../../../reference-local/repos/graphify/),
especially its
[README.md](../../../reference-local/repos/graphify/README.md),
[ARCHITECTURE.md](../../../reference-local/repos/graphify/ARCHITECTURE.md),
[graphify/__main__.py](../../../reference-local/repos/graphify/graphify/__main__.py),
[graphify/serve.py](../../../reference-local/repos/graphify/graphify/serve.py),
[graphify/watch.py](../../../reference-local/repos/graphify/graphify/watch.py),
[graphify/cache.py](../../../reference-local/repos/graphify/graphify/cache.py),
and [graphify/ingest.py](../../../reference-local/repos/graphify/graphify/ingest.py).

## System Map

### Reinforcing Loops

The repo's primary positive loop is explicit in
[practice.md](../../../practice-core/practice.md):

`work -> capture -> refine -> graduate -> enforce -> work`

The important reinforcing paths are:

- **Work -> napkin -> distilled -> permanent docs -> rules ->
  work**. Mistakes and discoveries become stable guidance, then
  active enforcement.
- **Work -> pattern instances -> future work**. Reusable solutions
  shorten future design search.
- **Repo -> Practice Core -> other repo -> returned practice**.
  Cross-repo propagation makes the practice self-replicating, not
  just self-documenting.
- **Review/gate findings -> doctrine/rules -> future execution**.
  Failures harden the environment rather than remaining one-off
  corrections.

These loops are already dense, intentional, and cross-linked.

### Refinement Loops

The repo also has a layered refinement system:

- **Lightweight continuity loop** in
  [continuity-practice.md](../../../../docs/governance/continuity-practice.md):
  `session-handoff` keeps orientation, captures surprises, and
  decides whether deeper convergence is due.
- **Deep consolidation loop** in
  [consolidate-docs.md](../../../commands/consolidate-docs.md):
  cross-session scan, pattern extraction, napkin rotation,
  distilled pruning, graduation, thread freshness audit, Practice
  Core review, fitness management, and exchange handling.
- **Fitness refinement loop** in
  [ADR-144](../../../../docs/architecture/architectural-decisions/144-two-threshold-fitness-model.md):
  `healthy -> soft -> hard -> critical`, with higher zones intended
  to trigger earlier corrective action.

This means the repo does not only learn; it also repeatedly
re-shapes its own learning surfaces.

### Balancing Loops

The main existing balancing mechanisms are:

- **Quality gates and reviewer routing** — fast, local correction of
  implementation drift.
- **Fitness thresholds** — control document growth and highlight
  overweight surfaces.
- **Napkin rotation and distilled pruning** — prevent raw capture
  from becoming the permanent memory layer.
- **Pending-graduations register** — keeps candidate doctrine from
  silently disappearing.
- **Reference-tier promotion and aging gate** — deliberate
  promotion, owner-vet, review, and de-promotion.
- **Planning discipline** — detects "activity without outcome" in
  plan structure.

These are real balancing loops. The question is not whether they
exist, but what exactly they regulate well.

## Findings

### 1. Positive and refinement loops are mature and abundant

The system is much stronger at **creating and refining information**
than at suppressing it. That is not itself a flaw; it is the result
of deliberate design. The learning loop is central doctrine, and the
repo has invested heavily in capture, graduation, and enforcement.

From a systems perspective, this means the dominant tendency of the
estate is **knowledge production with later consolidation**, not
minimal-memory operation.

### 2. The strongest balancing loop is volumetric

The clearest live negative feedback mechanism is the three-zone
fitness model in
[ADR-144](../../../../docs/architecture/architectural-decisions/144-two-threshold-fitness-model.md)
plus the repo-wide validator in
[validate-practice-fitness.mjs](../../../../scripts/validate-practice-fitness.mjs).

This loop measures:

- line count
- character count
- prose line width

It is effective at answering:

- "Is this surface overweight?"
- "Did refinement fail to happen soon enough?"
- "Is this file becoming too costly to read?"

It is not effective at answering:

- "Is this paragraph low-value?"
- "Is this memory still consulted?"
- "Did this entry change later behaviour?"

So the current strongest balancing loop is about **mass and pressure**,
not **utility**.

### 3. The best quality-governed memory loop is now the reference tier

The reformed `reference/` tier is the repo's clearest example of a
semantic-quality balancing loop, not just a size loop. Per
[reference/README.md](../../../reference/README.md), material must be:

- deliberately promoted
- evergreen
- owner-vetted

It is then subject to an aging gate:

- still evergreen?
- still owner-vetted?
- still consulted?

A negative answer triggers **de-promotion** back to
`research/notes/`, archive, or delete.

This is the strongest existing answer to the question "can the repo
know when memory has become low value?" It can do so here because the
loop governs **meaning and continued relevance**, not only volume.

### 4. Executive-memory feedback is well specified but not yet visibly live

[PDR-028](../../../practice-core/decision-records/PDR-028-executive-memory-feedback-loop.md)
defines a strong balancing loop for executive memory:

- each executive surface should have a `## Drift Detection` section;
- lookup-time verification should update `Last verified accurate`;
- lookup-time drift should be captured and routed via
  `Source plane: executive`;
- consolidation should close the loop through the pending register.

That is a strong design.

The live estate, however, still looks under-instantiated. During this
review, repo-wide search found no live `## Drift Detection` sections
under `.agent/memory/executive/`, and no current active-memory
entries tagged `Source plane: executive` outside archived material.

So the loop currently exists more as **doctrine and intent** than as
routine lookup-time correction.

### 5. Low-value accumulation is mostly detected indirectly

Today the repo can detect low-value memory by proxy:

- files crossing fitness thresholds;
- surfaces becoming catch-alls until an intentional addition forces a
  governance question;
- repeated deferrals without graduation;
- stale or misleading docs;
- plans whose means outgrow their end goals.

This is real signal, but it is indirect.

The key example is already named in the pending register:
[`governance-gap-invisible-until-intentional-addition`](../../../memory/operational/repo-continuity.md).
That pattern describes a surface accumulating content for some time,
without the absence of governance becoming obvious, until a new
addition forces the question.

That is exactly the kind of weak balancing behaviour the user was
concerned about: accumulation can happen quietly until a sharper event
reveals it.

### 6. The repo already knows "apparent productivity can still be low value"

[PDR-018](../../../practice-core/decision-records/PDR-018-planning-discipline.md)
already names two planning failure modes that produce low-value work
despite apparent progress:

- means goals without end goals;
- ambiguous workflow contracts.

This matters because the same logic applies to memory. A memory system
can look productive by its own measures — more patterns, more notes,
more register entries, more refined language — while still failing to
increase later decision quality.

So the repo has the conceptual tools to see the problem; it simply has
not yet turned that insight into a strong general-purpose balancing
loop for memory quality.

### 7. The repo already has a strong textual discovery spine

Follow-on exploration confirms that the repo is not lacking
relationship structure. It already has a dense, intentional discovery
mesh across:

- the root entry-point chain (`README.md` -> `start-right` -> `AGENT.md`
  -> ADR starter block);
- the Practice-index bridge and vital integration surfaces;
- the memory taxonomy and authority order;
- the split-loop continuity model;
- the concept-routed research hub; and
- the canonical onboarding status hub.

From a systems perspective, this matters because a future graph layer
would not be compensating for absent structure. It would be making
**existing structure more navigable**.

### 8. Existing graph infrastructure is already real, but it serves curriculum/domain graphs

The repo also already has live graph-shaped infrastructure in code and
architecture:

- ADR-059's schema-level property graph;
- ADR-157's multi-source graph integration framing;
- the live `get-curriculum-model`, prior-knowledge, thread-progression,
  and misconception graph surfaces; and
- the reusable
  [`graph-resource-factory.ts`](../../../../packages/sdks/oak-curriculum-sdk/src/mcp/graph-resource-factory.ts).

So the missing capability is not "graph support" in general. The
missing capability is a **repo-internal document / Practice topology
layer** over ADRs, plans, onboarding, and operational strategy docs.

### 9. A repo-internal graph layer would be additive, not compensatory

This sharpened the graph-layer question considerably.

The most credible future use is not "replace reading with a graph". It
is to add a path/query/explain layer over the existing discovery estate,
for questions such as:

- which ADRs, plans, and directives form the shortest path around a
  concept;
- which documents act as hidden hubs for onboarding or governance; and
- where an idea first appeared, stabilised, and later graduated.

That is an **additional discovery mechanism**, not a repair for a broken
Practice.

### 10. Graphify is a concrete reference implementation for derived graph discovery

The local Graphify repo is useful not because Oak should adopt it
wholesale, but because it proves a coherent design exists for:

- a three-pass pipeline (detect -> extract -> build -> cluster ->
  analyse -> report -> export);
- explicit edge evidence labels (`EXTRACTED` / `INFERRED` /
  `AMBIGUOUS`);
- persistent derived outputs (`graph.json`, `GRAPH_REPORT.md`,
  `graph.html`, wiki, MCP server);
- body-aware Markdown caching; and
- incremental rebuilds that separate cheap code-only refresh from
  costlier semantic refresh.

Companion deep dive:
[graphify-repo-deep-dive-report.md](./graphify-repo-deep-dive-report.md).

### 11. Graphify also exposes a new boundary risk: derived memory can start feeding itself

One of the most important follow-on findings is that Graphify includes
its own memory feedback loop:

- detection always re-includes `graphify-out/memory/`; and
- `save_query_result()` writes question/answer artefacts back into that
  memory area so they can be extracted into later graph runs.

That is powerful: the system can learn from what people asked, not only
from what they authored. But in a canonical-first Practice it also
creates a real risk:

- a derived answer can become future graph input;
- the graph can start amplifying its own prior outputs; and
- canonical-vs-derived boundaries can blur unless governed explicitly.

So Graphify strengthens the positive case for a graph layer **and**
clarifies one of the main reasons to keep any Oak version derived,
advisory, and tightly scoped.

## Answer to the Core Question

### Do we have enough negative feedback loops?

For **volume, drift pressure, and routing pressure**: mostly yes.

For **semantic value density of memory**: not yet.

The current system is not missing balancing loops altogether. It is
missing enough **refined semantic balancing** outside the
`reference/` tier and outside periodic consolidation judgement.

### Can we know when we are accumulating unhelpful or low-value memories?

Yes, but mostly **indirectly** and **later than ideal**.

Current signals are:

- governed files entering `soft`/`hard`/`critical`;
- catch-all accumulation becoming visible during promotion or
  consolidation;
- stale or misleading docs;
- repeated pending items with falsifiability but no graduation;
- memory surfaces that become hard to read or hard to route.

What is weak is a direct, always-on answer to:

- "this memory stopped earning its keep";
- "this memory is no longer consulted";
- "this memory repeats rather than teaches."

### Can we make use of that information if we do have it?

Yes. The repo already has the main sinks:

- prune from `distilled.md`;
- graduate to a better home;
- split or compress governed docs;
- de-promote out of `reference/`;
- convert repeated failure into a rule or PDR;
- keep pending with a named trigger and falsifiability.

The gap is not destination. The gap is **sensing and recording**.

## Recommended Incremental Tranche

This report recommends a deliberately narrow follow-on plan with two
improvements only.

### Improvement 1 — Install executive-memory drift detection on live surfaces

Apply the PDR-028 design to the three executive-memory surfaces:

- `artefact-inventory.md`
- `invoke-code-reviewers.md`
- `cross-platform-agent-surface-matrix.md`

Intended impact:

- make executive memory correctable at lookup cadence;
- reduce silent catalogue drift;
- convert "I noticed this was stale" into first-class capture.

### Improvement 2 — Make consolidation-time memory-quality review explicit and auditable

Tighten `consolidate-docs` step 9 so non-healthy memory surfaces do
not only trigger a judgement question, but also require an explicit
recorded disposition such as:

- retain as dense
- compress
- split
- graduate
- de-promote
- delete
- raise target
- owner limit decision

Intended impact:

- turn "low-value accumulation" from an implicit editorial feeling
  into an inspectable workflow output;
- make later review able to distinguish "overweight but justified"
  from "overweight because stale or duplicative".

## Explicit Deferrals

This report does **not** recommend, in this tranche:

- a new memory plane;
- a new repo-wide semantic-scoring validator;
- ML-assisted memory quality scoring;
- Graphify adoption or a repo-internal document-graph implementation in
  the current tranche;
- tightening the existing hard-zone closure rules;
- sweeping Practice Core or PDR rewrites;
- a broad overhaul of the learning-loop architecture.

Those are all larger than the demonstrated problem requires. The
first question applies here: the simpler move is to strengthen two
existing correction points, not to build a new subsystem.

## Closing View

The repo's learning system is already powerful. Its main asymmetry is
that its reinforcing and refinement loops are more mature than its
semantic balancing loops. The result is not chaos, but **high-output
learning with partially manual value control**.

That is a strong place to improve from. The right next move is not to
slow the system down. It is to make two existing balancing mechanisms
more real:

- executive memory should drift less silently;
- consolidation should say more explicitly what kind of memory is
  worth keeping.

The graph-layer idea remains promising, but as a later, derived
discovery surface over the Practice's existing canonical artefacts, not
as part of the current negative-feedback tightening tranche.
