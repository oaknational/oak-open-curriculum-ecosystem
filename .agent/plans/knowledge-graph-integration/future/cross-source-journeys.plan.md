---
name: "Cross-Source Journeys (Increment 3 Design)"
overview: "First-class user-journey artefacts that compose graph queries, evidence-corpus rankings, and search across sources. Two reference journeys: evidence-aware-lesson-sequencing (cross-source) and prerequisite-trace (graph-only). Discovers whether journeys need a new MCP primitive (playbook) or can ride on prompts."
parent_plan: "../active/open-education-knowledge-surfaces.plan.md"
sibling_plans:
  - "../current/graph-query-layer.plan.md"
  - "../../sector-engagement/eef/current/eef-evidence-corpus.plan.md"
  - "../active/agent-guidance-consolidation.plan.md"
specialist_reviewer: "mcp-reviewer, code-reviewer, architecture-reviewer-betty, docs-adr-reviewer"
status: future
isProject: false
todos:
  - id: t1-journey-shape-decision
    content: "Decide: is a journey a new MCP primitive (playbook resource type), a richer prompt class, or a hybrid? Discovery is the deliverable — both answers are valuable."
    status: pending
  - id: t2-evidence-aware-sequencing
    content: "Design and ship: evidence-aware-lesson-sequencing journey (search × misconception × EEF corpus)."
    status: pending
  - id: t3-prerequisite-trace
    content: "Design and ship: prerequisite-trace journey (lesson → prerequisites → known misconceptions)."
    status: pending
  - id: t4-citation-trace
    content: "Citation trace propagation: every step's citations roll up to the journey output structurally."
    status: pending
  - id: t5-telemetry
    content: "Journey-level Sentry trace; downstream-usage proxy metric (does the next user message reference journey output?)"
    status: pending
  - id: t6-playbook-doctrine
    content: "If a new primitive emerges (T1 = playbook), record as ADR amendment to ADR-123."
    status: pending
---

# Cross-Source Journeys

**Status**: FUTURE — design-only until Increments 1 (graph layer) and 2
(EEF corpus) reach ACTIVE.
**Last Updated**: 2026-04-30
**Increment**: 3 of 5 in the EEF graph-and-corpus delivery sequence.

## Why This Plan Exists

The bridge from "data is exposed" to "data changes what teachers do."

Increments 1 and 2 ship Lego bricks: graph operations and corpus
ranking. They are necessary. They are not sufficient.

The picture on the box — the user journey that composes those bricks
into something a teacher can act on — does not exist as a first-class
artefact today. The agent-guidance-consolidation plan (WS-5) names
"workflows" but they are tool-sequencing strings inside
`tool-guidance-data.ts` — descriptions, not invokable journeys.

This plan asks: when an agent serves a teacher, what artefact carries
the **shape of the answer**? A list of tools the agent might call?
A prompt with prose orchestration? A new MCP primitive that names
journeys explicitly?

## User-Value Template

```text
**User value**: [Specific user] can [do what they couldn't before]
              resulting in [observable teacher/learner outcome].
**Provability**: [How will we know? "Not yet provable, will be when X"
              is acceptable.]
**Architecture validation**: [What assumption does this confirm or break?]
```

## Plan Top-Line User Value

- **User value**: A teacher's "what's the best way to teach negative
  numbers in our PP=68% school?" produces a coherent 3-lesson
  sequence with: aligned Oak lessons, misconceptions targeted, EEF
  approaches with impact + caveat per misconception, prerequisite
  anchors, complete provenance — in one journey invocation, not
  N tool calls the agent stitches together.
- **Provability**: end-to-end Sentry journey trace count;
  manual sample of N=20 outputs reviewed for citation completeness AND
  pedagogical coherence; target ≥80% pass on both axes.
- **Architecture validation**: confirms that journeys are valuable
  artefacts in their own right, AND determines whether they need a
  new MCP primitive (playbook) or can ride on prompts. Either answer
  is valuable; the discovery is the product.

## The Two Reference Journeys

### Journey A: `evidence-aware-lesson-sequencing` (cross-source)

```text
Inputs: subject, key_stage, topic, optional school_context

Steps:
1. Search Oak curriculum for candidate lessons matching topic + KS.
2. For top-3 candidates (manifest+detail tier from search):
   2a. Get misconceptions for the lesson (misconception graph
       neighbours/subgraph).
   2b. Get prerequisite anchors for the lesson (prereq graph
       subgraph, depth=1).
3. Query EEF corpus: rank approaches that address those misconceptions,
   filtered by phase + school_context if supplied.
4. Assemble 3-lesson plan output:
   - lesson_id, lesson_title
   - misconceptions targeted (with ids)
   - evidence-backed approach per misconception (strand_id, impact,
     evidence_strength, caveat)
   - prerequisite checks (concept ids)
   - data_version on every citation
5. Output: structured journey result + provenance trail across all
   tool calls.
```

- **User value**: a Year-7 maths teacher gets a coherent 3-lesson
  sequence on negative numbers that targets actual misconceptions
  in Oak's lessons using EEF-evidenced approaches with citations
  the teacher can audit.
- **Provability**: per the plan top-line user value.
- **Architecture validation**: confirms that cross-source composition
  benefits from a journey artefact (vs. prompt-only orchestration).
  If output quality is comparable to a hand-crafted prompt, journey
  primitive is not needed yet.

### Journey B: `prerequisite-trace` (graph-only, smaller)

```text
Inputs: lesson_id

Steps:
1. Get lesson detail (curriculum search).
2. Walk prerequisite graph backward from lesson, depth 2-3
   (graph-query-layer subgraph operation).
3. For each prerequisite concept, get known misconceptions
   (misconception graph neighbours).
4. Output: ordered prerequisite chain with misconception annotations
   per step.
```

- **User value**: a teacher planning to teach lesson X can see the
  prerequisite chain and the misconceptions to check at each step
  without composing across two graph tools manually.
- **Provability**: journey invocation count; downstream usage proxy
  (does the next user message reference the journey output?).
- **Architecture validation**: confirms journeys work on graph-only
  composition, validating the increments compose orthogonally.
  Journey A needs the corpus extension; Journey B does not. If both
  ship cleanly, the boundary between graph layer and corpus layer
  is correct.

## The Open Architecture Question (T1)

**Is a journey a new MCP primitive, a richer prompt class, or a hybrid?**

Three candidate shapes:

### Shape 1: Journey = richer prompt with structured output

The agent receives an MCP prompt (the journey is exposed as
`journey-evidence-aware-lesson-sequencing`). The prompt body carries
the orchestration logic in prose. Structured output is requested via
prompt-response shape conventions. No new MCP primitive.

Pros: ships fast, no protocol changes, reuses existing MCP prompt
plumbing.
Cons: orchestration depends on LLM compliance with the prompt;
provenance trail depends on the agent emitting structured citations.

### Shape 2: Journey = new MCP primitive (`playbook`)

The MCP server exposes `playbooks/list` and `playbooks/run` (or similar).
A playbook is a server-side orchestration: the server makes the tool
calls, accumulates citations, and returns a structured result with a
typed schema.

Pros: structural enforcement of citation propagation; deterministic
orchestration; the LLM only handles the user-facing prose.
Cons: protocol extension; needs MCP-spec conformance review; harder
to evolve.

### Shape 3: Hybrid

Journey is a *typed prompt* whose orchestration steps are declared
machine-readably. The server inspects the declaration and either runs
the steps server-side (Shape 2) or surfaces them to the LLM as a
prompt (Shape 1) depending on a runtime decision.

Pros: best-of-both.
Cons: most complex; hardest to defend in review.

**T1 deliverable**: a research write-up + ADR amendment proposing one
of the three shapes, with evidence from prototyping Journey B against
each.

## Sequencing

```text
Inc 1 (graph-query-layer)  ─┐
                             ├─▶  T1 shape decision (research)
Inc 2 (eef-evidence-corpus) ─┘
                                                    │
                                                    ▼
                                          T2 evidence-aware-lesson-sequencing
                                          T3 prerequisite-trace
                                                    │
                                                    ▼
                                          T4 citation trace propagation
                                          T5 telemetry
                                                    │
                                                    ▼
                                          T6 if new primitive: ADR amendment
```

T1 is gating. T2 and T3 are parallel. T4–T6 follow.

## Promotion Trigger from FUTURE to CURRENT

Promote when:

1. Increment 1 (graph layer) has reached ACTIVE.
2. Increment 2 (EEF corpus) has reached ACTIVE.
3. The misconception graph and prerequisite graph have GraphView
   adapters (T3, T4 of the graph layer plan).
4. There is a real teacher question that the existing surface answers
   poorly enough to motivate this work — i.e., we have evidence that
   the prompt-only path is insufficient.

Condition 4 is load-bearing. We do not promote on speculation; we
promote on observed insufficiency.

## Risks

1. **Premature primitive**: building a playbook MCP primitive before
   prompts have been honestly tried at the same task. Mitigation:
   T1 must include a Shape-1 prototype before recommending Shape 2 or 3.

2. **Journey artefact drifts from real teacher needs**: the two
   reference journeys are reasonable bets but not validated. Mitigation:
   the promotion trigger names "real teacher question" as condition 4 —
   no promotion without owner-validated evidence the journeys solve a
   real shortfall.

3. **Citation propagation breaks under LLM paraphrase** (Shape 1
   risk). Mitigation: T4 specifically tests journey output for
   citation presence in the *final user-facing text*, not just
   intermediate steps.

## Cross-Plan References

- **Foundation (Inc 1)**: [`../current/graph-query-layer.plan.md`](../current/graph-query-layer.plan.md)
- **Corpus (Inc 2)**: [`../../sector-engagement/eef/current/eef-evidence-corpus.plan.md`](../../sector-engagement/eef/current/eef-evidence-corpus.plan.md)
- **Parent**: [`../active/open-education-knowledge-surfaces.plan.md`](../active/open-education-knowledge-surfaces.plan.md)
- **Sibling (guidance)**: [`../active/agent-guidance-consolidation.plan.md`](../active/agent-guidance-consolidation.plan.md) — workflows defined there are the prose ancestor of journeys defined here.
- **Session insight**: [`.agent/memory/active/napkin.md` § 2026-04-30 EEF graph-and-corpus architecture session](../../../memory/active/napkin.md)
