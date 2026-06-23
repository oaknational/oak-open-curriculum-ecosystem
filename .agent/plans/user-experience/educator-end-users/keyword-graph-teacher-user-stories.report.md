---
title: 'Keyword-graph teacher user stories — discovery note for prioritisation'
collection: user-experience
audience: educator-end-users
type: discovery-note
status: captured-for-prioritisation
last_updated: 2026-06-11
---

# Keyword-graph teacher user stories — discovery note

> **Discovery note, captured for prioritisation.** Owner-directed 2026-06-11:
> capture the keyword-graph teacher user stories so the live tool has named
> user impetus to evaluate against — *"it's hard to evaluate something if
> there is not user impetus to engage with it."* This note names candidate
> stories and the considerations that bear on ordering them; **the
> prioritisation decision is the owner's** and is not made here. One story
> (the position-anchored vocabulary bridge, story 3) is folded into
> [`position-anchored-teaching-continuity.plan.md`](current/position-anchored-teaching-continuity.plan.md)
> as a future cycle by the same owner direction.

## Context

`get-keyword-graph` shipped with Track-G (PR #173, 2026-06-11) and is live on
the production alpha: a bounded, anchored, frequency-ranked keyword retrieval
over the curriculum graph corpus. Every call is anchored by `subject` +
`keyStage` (both required), optionally narrowed by `unitSlugs` /
`lessonSlugs`, and returns a ranked top-N term set in which decorated
keywords carry canonical Oak descriptions, their placing lessons, and a
`firstYear` trace (the teaching year a term first appears).

The EEF re-validation re-proof
([report §3](../../../reports/eef-revalidation-report-2026-06-11.md))
determined the tool is **adjacent enrichment, not an EEF value-path
dependency** — it has no workflow that *requires* it. That finding is the
reason this note exists: the tool's value is now proven only by release and
observed use (the standing doctrine), and observation needs named teacher
journeys to observe against. The stories below are hypotheses awaiting user
impetus, not committed scope.

Frame for every story: ADR-194 (teacher-as-expert) — these surfaces inform
the teacher's decision and never make it; the agent composes served data and
never invents definitions.

## The stories (named considerations, not commitments)

### 1. Explicit vocabulary planning

A teacher preparing a unit or lesson asks for the key vocabulary to
pre-teach. The frequency-ranked, description-carrying bounded term set is the
pre-teach artefact directly — tier-2/3 vocabulary instruction support.

- **Data support (verified)**: the ranked decorated set with canonical
  descriptions is the tool's core response shape.
- **Open**: whether teachers reach for this through an existing prompt or
  need a named entry point.

### 2. Vocabulary continuity across units

"Activate prior knowledge through familiar language": when starting new
content, surface which terms the class has already met and where. The
keyword→lesson placements plus the `firstYear` trace carry exactly this.
Pairs naturally with `get-prior-knowledge-graph` — prerequisites say what was
*taught*; keywords say what was *named*.

- **Data support (verified)**: `firstYear` on keyword nodes; placing-lesson
  decorations within the anchor.
- **Open**: presentation shape (the pairing is an agent-side composition).

### 3. Position-anchored vocabulary bridge (folded into the plan)

At the "my class just finished X — what next?" moment (the position-anchored
prompt; its served name is owner-decided at its PR), bridge the vocabulary
between the finished unit and the candidate next units: shared terms become
continuity anchors, new terms become the pre-teach list.

- **Data support (verified)**: two anchored calls narrowed by `unitSlugs`
  (finished vs candidate units) within the same `subject` + `keyStage`
  anchor; the agent set-compares the ranked terms.
- **Disposition**: folded into
  [`position-anchored-teaching-continuity.plan.md`](current/position-anchored-teaching-continuity.plan.md)
  as a future cycle (owner-directed 2026-06-11, explicitly not blocking that
  plan's W2). This is the one story with a scheduled home.

### 4. Adaptation for EAL/SEND

Bounded ranked terms with canonical Oak descriptions as the raw material for
simplification and glossary generation. The canonical description is the
control: the agent simplifies *from* Oak's definition rather than inventing
one (ADR-194 boundary, same shape as the EEF caveat discipline).

- **Data support (verified)**: canonical descriptions on decorated keywords.
- **Open**: whether adaptation quality holds without curriculum-team review;
  this story most needs observed real use before any build.

### 5. Misconception adjacency (speculative — flagged as such)

Traverse keyword → placing lesson → recorded misconception to surface terms
whose lessons carry known misconceptions ("these words come with traps").
Mechanically possible today (`lessonSlugs` from the keyword decorations into
`get-misconception-graph`). **Speculative**: no evidence yet that the
keyword-indexed view of misconceptions adds value over the direct
misconception tools — test against real use before believing it.

## Considerations that bear on prioritisation (owner-owned decision)

- Story 3 already has a scheduled home (the plan fold); it is the natural
  first observation point because it rides an entry point teachers already
  reach for.
- Stories 1–2 need no new code — they are prompt/orchestration shapes over
  the live tool; their cost is naming and instruction text.
- Story 4 carries the highest adaptation-quality risk; story 5 the weakest
  evidence. Both are capture-only here.
- Value is proven by release and observed use; none of these stories claims a
  pre-release proxy.

## Grounding

- Owner direction: 2026-06-11 session (verbatim rationale quoted above);
  Director routing event `56dcda07`.
- Tool surface:
  `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-keyword-graph.ts` and
  the keyword view in `@oaknational/graph-corpus-sdk/curriculum` (verified at
  `origin/main` 2026-06-11).
- Adjacency finding:
  [EEF re-validation report §3](../../../reports/eef-revalidation-report-2026-06-11.md).
- Persona context: [README — Future Journey Candidates](README.md) item 2
  (vocabulary and concept-relationship exploration journeys) — this note
  grounds that candidate with tool-true stories.
