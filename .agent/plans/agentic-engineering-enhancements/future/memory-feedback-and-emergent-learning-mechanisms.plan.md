# Memory Feedback and Emergent-Learning Mechanisms — Strategic Plan

**Status**: NOT STARTED — execution plan queued in `current/` (owner-gated at Phase 0)
**Domain**: Agentic Engineering Enhancements

> **Operational note (2026-04-21)**: An execution plan has been
> authored at
> [`../current/memory-feedback-and-emergent-learning-mechanisms.execution.plan.md`](../current/memory-feedback-and-emergent-learning-mechanisms.execution.plan.md),
> with first- and second-pass reflection at
> [`memory-feedback-and-emergent-learning-mechanisms.metacognition.md`](memory-feedback-and-emergent-learning-mechanisms.metacognition.md).
> The execution plan supersedes this strategic brief operationally;
> this brief remains authoritative for intent, rationale, and the
> original promotion criteria (retained as historical context).
> The execution plan is owner-gated at Phase 0 (three-plane
> ratification + portability decision) and does not start until
> both answers exist.

**Related conversation**:
[`missing-mechanisms-lack-of-wholes.md`](../../../reference/agentic-engineering/conversations/missing-mechanisms-lack-of-wholes.md)
**Related doctrine**:
[ADR-131](../../../../docs/architecture/architectural-decisions/131-self-reinforcing-improvement-loop.md)
(self-reinforcing improvement loop),
[PDR-011](../../../practice-core/decision-records/PDR-011-continuity-surfaces-and-surprise-pipeline.md)
(continuity surfaces and surprise pipeline),
[PDR-026](../../../practice-core/decision-records/PDR-026-per-session-landing-commitment.md)
(per-session landing commitment),
[`.agent/memory/README.md`](../../../memory/README.md) (three-mode
memory taxonomy),
[`.agent/directives/orientation.md`](../../../directives/orientation.md)
(layering contract).

## Problem and Intent

The 2026-04-20 memory-taxonomy restructure split the repo's
persistent content into three modes — `active/` (learning loop),
`operational/` (continuity), `executive/` (contracts). The taxonomy
is structurally clean, but a close-session review surfaced that the
planes are not fully wired into feedback loops:

- **Active memory** has a mature capture → distil → graduate →
  enforce loop (ADR-131; PDR-011).
- **Operational memory** has a young but functional loop (write at
  handoff; read at start-right; track-card `promotion_needed` →
  workstream watchlist → napkin).
- **Executive memory** is a write-once catalogue with no
  drift-detection surface and no graduation channel. When a session
  notices the reviewer catalogue is stale or the artefact-inventory
  is wrong, there is no standardised pathway for that observation
  to land back in active memory or Practice Core.

Cross-plane paths have two structural gaps: `active → executive`
and `executive → anywhere`. And the emergent whole — cross-plane
redundancy, meta-patterns that only surface by reading all three
planes together, liminal-space learning — has no mechanism at all.
The inherited-framing-without-first-principles-check pattern was
named by the owner this session after surfacing three times; an
agent would not have assembled it alone because it requires looking
across planes simultaneously.

**The owner's framing is the intent**: liminal places — where two
planes meet, or where no single plane owns the observation — are
where evolution happens. Losing emergent cross-domain insights is
the loss of the Practice's own learning capacity.

The intent of this plan is to design feedback loops for every
memory plane, cross-plane paths for every liminal edge, and at
least one mechanism that surfaces emergent-whole signals. It is
not to build surveillance or automation beyond what the Practice
justifies; it is to make the Practice's own learning loop reach
across the full memory system rather than only inside active
memory.

## Domain Boundaries and Non-Goals

### In scope

- Design of the executive-memory feedback loop (drift-detection
  surface + graduation channel).
- Design of the missing cross-plane paths (`active → executive`,
  `operational → executive`, `executive → anywhere`).
- Design of at least one mechanism for emergent-whole observation
  (cross-plane redundancy, meta-pattern detection, liminal-space
  capture).
- Structured `pending graduations` register to prevent captured-
  but-not-graduated backlog from stagnating.
- Practice-level doctrine updates implied by the memory taxonomy:
  portable-vs-host-local decision; executive-memory loop
  doctrine; `practice.md` Artefact Map refresh.
- Graduation of already-captured patterns
  (`inherited-framing-without-first-principles-check`) and the
  perturbation-mechanism bundle (three candidates: non-goal
  re-ratification, standing-decision register, first-principles
  metacognition prompt).

### Non-goals

- **No new reviewer or specialist.** The existing reviewer roster
  and `jc-consolidate-docs` workflow are the vehicles; this plan
  composes them into richer loops, it does not add capability.
- **No automation requiring ML or heavy tooling.** Detection
  mechanisms must be simple and legible (text search, structured
  markdown, lightweight scripts at most).
- **No extension of the memory taxonomy.** Three modes stand; any
  future change is a separate decision.
- **No replacement of `jc-consolidate-docs`** as the canonical
  graduation pathway. Triggers and registers make graduation
  easier to surface; they do not bypass the convergence workflow.
- **No bypass of the human/owner in emergent-whole decisions.**
  Agents can surface candidates; decisions about what graduates
  and what stays liminal remain with the owner during
  consolidation.

## Dependencies and Sequencing Assumptions

### Met

- Three-mode memory taxonomy landed
  ([`memory/README.md`](../../../memory/README.md), commit
  `feba4a12`).
- Continuation prompt dissolved; PDR-026 + orientation directive
  installed (commit `b637346c`).
- `operational/` and `active/` loops demonstrated by the session
  itself.
- Capture already in active memory for all three required
  graduation candidates (inherited-framing pattern, perturbation-
  mechanism bundle, three doctrine candidates).

### Not yet met

- Owner decision: three-mode taxonomy portable-vs-host-local.
  Required before a PDR can land at Practice Core.
- Confidence that the emergent-whole mechanism is light enough to
  land without ceremony cost exceeding its value. Design slice
  must address this head-on.

### Sequencing

- Public alpha Sentry integration work is owner's priority and
  comes first.
- This lane promotes after alpha-gate work stabilises, OR earlier
  if a second concrete instance of cross-plane drift surfaces
  (raising the concrete-risk signal).

## Success Signals (Promotion Criteria)

Promotion to `current/` is justified when all of the following
hold:

1. At least one concrete drift instance has been observed that
   would have been caught by one of the proposed mechanisms (or
   the absence of detection has caused a real cost).
2. Owner has given a portability decision on the three-mode
   taxonomy (portable Practice doctrine vs host-local).
3. Alpha-gate Sentry work has landed or is scheduled in a way
   that frees execution capacity.
4. A bounded first slice is identified — either (a) executive-
   memory loop as the first target, (b) pending-graduations
   register as the first target, or (c) one named cross-plane
   path as the first target. Slice chosen before promotion.

## Risks and Unknowns

| Risk | Why it matters | Mitigation at planning time |
| --- | --- | --- |
| Mechanism design becomes its own drift source | A complex "emergence detector" that nobody uses is worse than manual noticing | Keep every mechanism light (markdown registers, grep-friendly conventions, existing workflow extensions); prefer structure over automation |
| Cross-plane paths duplicate existing pathways | `active → executive` might re-invent what the reviewer-rule pattern already does | Audit existing pathways before designing new; cite them in the plan's executable promotion |
| Emergent-whole mechanism over-reaches | Trying to detect all meta-patterns is unbounded; pick one shape | The first-slice promotion criterion forces a bounded scope |
| Portability decision on taxonomy is deferred indefinitely | Three-mode memory stays host-local by accident, then a second repo inherits it by file-copy without the doctrine | Surface the decision explicitly at promotion; owner decides portable-vs-host-local before a PDR is drafted |
| Pending-graduations register becomes a todo list that nobody reads | Adds surface area without closing the loop | Bind register updates to `session-handoff` and `jc-consolidate-docs` so they are touched every session |
| Patterns captured but not graduated this session remain stuck | The `inherited-framing` pattern and perturbation-mechanism bundle are in napkin awaiting consolidation | Promote this plan's first slice when graduation surfaces as a blocker; until then, ordinary consolidation is the route |

## Promotion Trigger

Promote to `current/` when:

- A second concrete instance of cross-plane drift or
  captured-but-un-graduated content is observed in the repo, **OR**
- The owner calls for promotion directly, **OR**
- Public alpha Sentry integration work lands and execution capacity
  shifts to agentic-engineering infrastructure.

Whichever fires first.

## Implementation Sketch (not-yet-execution-committed)

Per `plan.md` discipline: the sketches below are reference
context drawn from the 2026-04-20 session's reflection. Execution
decisions (scope, ordering, acceptance criteria) finalise only at
promotion to `current/`.

### Sketch A: Executive-memory feedback loop

- **Drift-detection surface**: a short section added to each
  executive-memory file that records "last verified accurate on
  YYYY-MM-DD" alongside the surface's existing content, plus an
  explicit "known drift / pending update" bullet list. Read on
  session entry when the surface is looked up; update when drift is
  noticed.
- **Graduation channel**: when a session notices drift, the napkin
  entry convention is extended with an explicit "Source plane:
  executive" tag so consolidation can aggregate executive drift
  separately from other captured learnings.
- **Route to Practice Core**: if drift pattern recurs (e.g. "reviewer
  catalogue and roster drift apart whenever a reviewer is added"),
  consolidation graduates a rule or PDR — the normal active-memory
  graduation pathway, now reachable from executive.

### Sketch B: Missing cross-plane paths

- `active → executive`: no dedicated channel needed beyond rule-
  creation — a napkin observation that "when X changes, update
  executive memory Y" graduates to a rule in `.agent/rules/`. The
  rule is the path.
- `operational → executive`: workstream-brief `Promotion watchlist`
  items tagged `executive-impact` route into executive drift-
  detection surface at session close.
- `executive → anywhere`: covered by Sketch A's graduation channel.

### Sketch C: Emergent-whole observation

- **Cross-plane redundancy check**: lightweight script invoked by
  `jc-consolidate-docs` step 8 that greps for repeated phrases
  across the three memory planes (+ directives) and flags the top-N
  for human review. Not automated graduation — just candidate
  surface.
- **Meta-pattern register**: a new file at
  `.agent/memory/active/patterns/meta/` (or similar) where
  patterns about patterns (like `inherited-framing-without-first-principles-check`)
  land. Read at session open as part of Ground First step 3.
- **Liminal-observations napkin tag**: napkin entries that span
  two or more memory planes get a `cross-plane` tag; consolidation
  step aggregates these for owner review.

### Sketch D: Pending-graduations register

- Extend `repo-continuity.md § Deep consolidation status` from
  narrative to a structured list: each pending graduation has a
  captured-date, source surface, graduation target (PDR / pattern
  / rule / ADR / practice-md), and trigger condition. Session-
  handoff adds new items; consolidate-docs closes or defers them.
- Age-visible without new infrastructure.

### Sketch E: Practice-level doctrine updates

- **Portability decision** (owner input required): is the three-
  mode taxonomy portable Practice doctrine (PDR) or legitimately
  host-local? Outcome gates whether sketches A–D contribute to a
  new portable PDR or a host-local doctrine file.
- **PDR candidate**: *Executive-Memory Feedback Loop* — defines
  drift-detection + graduation channel as Practice doctrine so any
  Practice-bearing repo can apply it. Only meaningful if the three-
  mode taxonomy itself is portable.
- **`practice.md` Artefact Map refresh**: the existing description
  of `.agent/memory/` as a single thing is post-restructure stale.
  Update regardless of portability decision.

### Sketch F: Already-captured candidates to graduate

- **Pattern**: `inherited-framing-without-first-principles-check`
  — three instances observed 2026-04-20; extract to
  `.agent/memory/active/patterns/` at next consolidation.
- **Perturbation-mechanism bundle**: three complementary
  candidates (non-goal re-ratification, standing-decision register,
  first-principles metacognition prompt) flagged in napkin; draft
  as a PDR plus three lightweight artefacts at next consolidation.

These sketches are the 2026-04-20 session's reflection in
deliverable form. Promotion to `current/` reopens each for
explicit scope and sequencing commitment.

## Evidence and Motivating Artefacts

- Conversation source:
  [`missing-mechanisms-lack-of-wholes.md`](../../../reference/agentic-engineering/conversations/missing-mechanisms-lack-of-wholes.md).
- Session-close napkin entry (2026-04-20 evening) with the
  inherited-framing pattern (three instances) and perturbation-
  mechanism candidates.
- Deep consolidation status block in
  [`repo-continuity.md`](../../../memory/operational/repo-continuity.md)
  tracking outstanding graduations.

## Learning Loop

On promotion and at each phase close, consolidate learnings back
into memory/active and into Practice Core doctrine via
`jc-consolidate-docs`. This plan exists partly to improve that
loop itself; its own execution must use the loop rigorously so
the improvements are tested against the use case they address.

## Related Plans

- [`operating-model-mechanism-taxonomy.plan.md`](operating-model-mechanism-taxonomy.plan.md)
  — adjacent mechanism-naming work; may share vocabulary on planes
  and loops but scope is broader.
- [`cross-vendor-session-sidecars.plan.md`](cross-vendor-session-sidecars.plan.md)
  — relevant if the emergent-whole mechanism ever needs durable
  structured metadata across vendors.
- [`graphify-and-graph-memory-exploration.plan.md`](graphify-and-graph-memory-exploration.plan.md)
  — relevant if cross-plane redundancy detection is better
  expressed as a graph query than a text scan.
