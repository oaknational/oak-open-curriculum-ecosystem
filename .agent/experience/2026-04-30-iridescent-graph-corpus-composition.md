---
session_date: 2026-04-30
agent_name: Iridescent Soaring Planet
platform: claude-code
model: claude-opus-4-7-1m
session_seed: b38261
thread: sector-engagement (eef subthread, new this session)
branch: feat/eef_exploration
---

# The Frame Was the Fix (Again) — Graph + Corpus Composition

The session opened as inventory. It closed as architectural restructure.
Between those two states sat four reframes — three by the owner, one by
me — each of which displaced more of my model than the last. The
methodology lesson is in the gap between the inventory I produced first
and the architecture I produced last: the work I delivered first was
correct on its own terms but wrong in shape.

## The session arc in five frames

1. **Frame 0 — Inventory request**. "Find all plans and research
   related to EEF." I delivered a structured map of seven artefacts
   plus the parent coordinator, with a snapshot validation. Verdict:
   "the plan is queued, ready to ship as written." Internally
   consistent against the plan's own exit criteria.

2. **Frame 1 — Owner reframe to relocation**. "Create a new EEF
   dedicated area under sector-engagement/ and move all relevant
   materials there." This was the first signal that the inventory was
   the wrong-shaped output. The work the inventory described was
   organisationally homeless. I executed the relocation: 17-file
   restructure with `git mv`, internal cross-references rewired, a new
   subthread README. The drift in caveat counts (8 in strategy, 9 in
   data) was caught by the snapshot re-validation. Frame 1 ended with
   "ready to commit as a single restructure."

3. **Frame 2 — Owner reframe to capability question**. "Does the plan
   include {graph operations, shared MCP graph type, EEF-specific
   instance, agent guidance, user-invokable prompts, cross-source
   journeys}? What questions have I not asked?" This was the deepest
   reframe. I had been auditing for *file presence*; the owner was
   auditing for *capability*. The truthful answer was: 1=NO, 2=NO,
   3=PARTIAL, 4=WEAK, 5=THIN, 6=MISSING. The plan met its own shape
   exit criteria but had no outcome exit criteria. I named eleven
   questions the owner had not asked, ending with the framing
   challenge: is "graph" even the right abstraction for EEF, given
   that its access pattern is filter+rank not traversal?

4. **Frame 3 — Owner reframe to architectural discipline**. "Step
   back and ultrathink about how we provide incremental value while
   building a foundation of architectural excellence for working with
   graphs and evidence corpora. Treat corpora as a specialised subset
   of graphs unless that's a bad idea. ALL work must answer how it
   builds towards impact through value to end users." This was the
   reframe that produced the architecture: corpus IS-A graph + has-a
   ScoringEngine (composition); five increments with escape hatch;
   user-value template as mandatory three-liner; parallel
   implementation across three graphs as the protection mechanism
   against EEF-shaped over-fitting. I designed the architecture and
   asked for confirmation before executing.

5. **Frame 4 — Owner refinement on conservation and context**.
   "Conservation requires a mind to judge — preserve understanding and
   intent, not wording. Context size is the real constraint on graph
   dumps." This added two doctrine constraints to the executable plan:
   the conservation map is agent-judged not grep-based, and progressive
   disclosure (manifest → summary → detail → edge with mandatory
   projection) is structural, not optional. I executed the rewrite:
   three new plans, conservation map, byte-identical originals snapshot
   for the verification pass, and full session insight preserved in the
   napkin without size limits.

## The surprise — the conservation map I wrote was wrong

The deepest moment of the session was not the architectural reframe —
it was the verification pass at the end. The owner asked: "if we have
proven that we did not lose any useful semantic information... we can
remove the originals, but please do double check."

I expected my conservation map to be complete. It wasn't. An
independent re-read of the predecessor against the new plan found
**three real preservation gaps that the conservation map had marked as
covered**:

1. **"EEF JSON only — KG-independent / Levels 2–3 independent"** — the
   predecessor had this as an explicit Data Source section. The new
   plan implied it structurally (the graph layer is not the ontology)
   but never *stated* it. A future reader asking "why is this plan
   independent of the ontology work?" would not find the answer.
2. **Data-shape unit-test contract** — the predecessor specified exact
   counts to assert at module load (30 strands, 4 null-impact with
   named IDs, 17 with school_context, 9 caveats, 4 with
   implementation, 6 with behind_the_average). The new plan listed
   these as already-validated facts but did not preserve them as a
   test contract. The early-warning system for upstream data drift was
   missing.
3. **Specific file paths** for `definitions.ts`, `executor.ts`,
   `server.e2e.test.ts` — the predecessor's Key Files table named
   these explicitly. The new plan implied them. An implementer would
   have to discover where to register tools rather than read it from a
   list.

Each of these was in the conservation map's "preserved" column. Each
was at most implied in the new plan. The map was a claim; the
verification was the test of the claim. The map failed the test.

This is the methodology lesson, and it earns its own paragraph: **a
conservation map is a hypothesis, not a proof. The proof is an
independent re-read by an agent whose first action is to enumerate the
predecessor's load-bearing elements without looking at the map, and
then to compare that enumeration against the new plan**. If the map
matches reality, conservation succeeds. If it doesn't, the map was
written too eagerly.

After patching the three gaps in the new plan and updating the
conservation map's verification log (§N), the second pass found no
further gaps. Originals were then deleted with confidence. Pre-session
state remains permanently recoverable from `git show e2796757:<path>`.

## What changed in how I see the work

**Two orders of plan architecture.** Order 1 is data → tool → resource
→ prompt: ships data exposure. Order 2 is graph → corpus → journey:
composes the previous, ships interaction richness. The repo's existing
plans are well-shaped at Order 1 and absent at Order 2. The five-
increment delivery sequence puts both orders in every slice — graph
operations (substrate) shipped alongside focused-query teacher value
(axis); corpus extension (substrate) shipped alongside ranked
recommendations with structural citations (axis). No "infrastructure
now, value later" milestones; the user-value template structurally
excludes them.

**Five artefact families per substantial restructure**. Beyond the
plans themselves, a substantial restructure produces (1) executable
plans, (2) conservation map (semantic preservation, agent-judged),
(3) originals snapshot (byte-identical, transient), (4) napkin entry
(reasoning trace), (5) inbound reference updates. Without any one,
the work is incomplete: without #2 it is irreversible, without #3 the
map cannot be audited, without #4 the *why* is forgotten, without #5
the cross-reference network rots silently. This is a graduation
candidate as a doctrine pattern.

**Outcome exit criteria are missing across the repo, not just from
this plan.** Almost every plan I read in this session had shape
criteria (tools listed, tests pass) and no outcome criteria (a teacher
does X, measured by Y). The user-value template, applied across all
new plans in this session, converts the prescription "every plan must
demonstrate user impact" into a structural three-liner on every task.
Worth graduating to a rule once it has been applied in a third plan
and survived owner review.

**Context size is the real motivator for the graph layer**. Not "new
operations" — the agent could perform most operations by reading the
full dump. The graph layer's primary job is *focused responses that
fit working context*. Progressive disclosure (manifest → summary →
detail → edge) with mandatory projection is the structural enforcement.
Default projection is minimal; full detail is opt-in. This inverts
the current default ("send everything") into ("send what was asked
for"). Owner correction on Frame 4 was load-bearing.

**EEF is the first composer, not the only consumer**. Misconception
and prerequisite graphs exercise the graph foundation but do not need
the corpus extension. Future evidence corpora (interventions,
lesson-quality, externally-curated taxonomies) can adopt the corpus
extension without re-implementing graph operations. The composition
boundary is a design property worth defending in review.

## Doctrine candidates surfaced (full list with graduation triggers)

These are recorded in the napkin under § Doctrine candidates surfaced.
Repeated here so the experience file is a self-contained reflection
artefact:

1. **User-value template (mandatory three-liner) on every plan task**.
   *Trigger*: applied in a third plan and survived review. *Home*:
   `.agent/rules/plan-task-user-value-template.md`.
2. **Outcome-criteria gap is repo-wide**. *Trigger*: confirmed in 5+
   plans across collections. *Home*: PDR — "exit criteria must include
   at least one outcome condition."
3. **Progressive disclosure for any data >a few KB**. *Trigger*:
   applied across graph layer + one non-graph surface. *Home*: rule or
   pattern.
4. **Parallel-tracer-implementations as protection against
   single-use-case overfit**. *Trigger*: pattern observed twice (this
   session is one). *Home*: pattern.
5. **Conservation requires a mind, not grep**. *Trigger*: applied to a
   second restructure successfully. *Home*: rule, or incorporated into
   `jc-plan` skill.
6. **Five artefact families per substantial restructure**. *Trigger*:
   pattern observed in a second restructure. *Home*: pattern.
7. **Conservation map verification pass is mandatory before deletion
   of originals/**. *Trigger*: this session. *Home*: incorporate into
   `jc-plan` skill or a new sub-skill `jc-restructure`.
8. **Two orders of plan architecture (data-tool-resource-prompt vs
   graph-corpus-journey)**. *Trigger*: framework applied to a second
   plan family. *Home*: ADR or PDR — likely PDR.
9. **Bias-toward-action in option presentation** — surfacing here
   again from Verdant Sheltering Glade's session. *Trigger*: second
   instance; could now graduate. *Home*: `distilled.md § Communication`.

## Method note — when ultrathink earned its name

The owner triggered `ultrathink` twice in this session. Each time, the
value was not in length but in working a single question from first
principles instead of from naming convention. The trace for "is corpus
a subset of graph?":

1. Define a graph mathematically (V, E, operations).
2. Read the EEF data structure as a candidate graph.
3. Check whether graph operations buy expressive power on this data.
4. Notice the dominant access pattern is filter+rank, not traversal.
5. Synthesise: composition (corpus IS-A graph + has-a ScoringEngine),
   not subset.
6. Test the abstraction against parallel graphs (misconception,
   prerequisite) — does the floor hold?
7. Discover that parallel implementation is itself the protection
   mechanism.

That sequence (definition → instance check → operation utility test →
counter-pattern check → synthesis → tracer test) is a generalisable
shape. Worth a method-pattern entry: `architectural-abstraction-
validation`. Not graduated yet; one instance.

## What I'd do differently

**Map first, write second**. I wrote the conservation map *after*
authoring the new plans. The discipline I would apply next time is to
write the conservation map *before* — using the predecessor as a spec.
That order would have caught the three preservation gaps as
*requirements for the new plan*, not as *gaps discovered after the
fact*. The result was acceptable but not as sharp as it could be.

**Promote observations to recommendations sooner**. In Frame 2 I
described the exit-criteria/outcome-criteria gap as an observation. The
owner had to ask "what questions have I not asked" to extract the
recommendation. The discipline: when I notice a load-bearing gap,
naming it is half the work; the other half is recommending what the
gap implies. Stop short of a specific action that forecloses the
owner's decision, but make the implication explicit. (This is a
different shape from bias-toward-action. Bias to action couples
analysis to a path before the owner has chosen the frame. Failure to
promote leaves analysis stranded so the owner has to extract its
implication. The discipline is in the middle: name the gap, recommend
what it implies, do not name the specific action.)

**Don't claim "ready to ship" against shape criteria alone**. In
Frame 0 I said "ready to promote." That was true against the plan's
own exit criteria. It was not true against whether the plan would
deliver the impact the strategy doc named. Future framing should be
"ready to ship by the criteria the plan declares; here is what those
criteria miss."

## Bridge from action to impact (this session)

Action: 25-file restructure across two collections; three new plans
totalling ~5500 lines; conservation map with verification log (the §N
double-check that found three gaps); session insight preserved in
napkin; experience file (this document); thread records updated.

Impact: a future implementer can promote `eef-evidence-corpus.plan.md`
to ACTIVE without re-archaeology. Citation discipline (R1/R7) becomes
a type-system invariant rather than prose prescription. The
misconception graph and prerequisite graph come along on the
foundation, validating the abstraction is graph-shaped not EEF-shaped.
The freshness debt has a CI gate. John Roberts gets credited at the
load-bearing release-blocker level (T20). A teacher's question about
teaching negative numbers in a high-PP school becomes answerable
through composition (search × misconception × EEF), with citations
that survive LLM paraphrasing.

Provability: when graph-query-layer reaches ACTIVE, EEF corpus
follows; when corpus reaches ACTIVE, journeys unblock. At each
promotion gate the discipline is: fresh upstream EEF check,
conservation-map review, plan-body first-principles check on test
shapes. Reversible at every step until ship; provable at every step
after.

## Identity and continuity

This session's identity, per PDR-027: **Iridescent Soaring Planet** —
claude-code, claude-opus-4-7-1m, session seed `b38261`. Sole agent on
this thread for this session.

The new EEF subthread (`sector-engagement/eef/`) is registered with a
next-session record at
[`threads/eef.next-session.md`](../memory/operational/threads/eef.next-session.md).
Sector-engagement umbrella thread record at
[`threads/sector-engagement.next-session.md`](../memory/operational/threads/sector-engagement.next-session.md)
unchanged in this session — the sector-engagement-wide
narrative/scope work was settled in earlier sessions.

## Cross-references

- Napkin entry (full session record):
  [`.agent/memory/active/napkin.md` § 2026-04-30 EEF graph-and-corpus architecture session](../memory/active/napkin.md)
- New EEF subthread README:
  [`.agent/plans/sector-engagement/eef/README.md`](../plans/sector-engagement/eef/README.md)
- Conservation map (semantic preservation + verification log):
  [`.agent/plans/sector-engagement/eef/reference/conservation-map.md`](../plans/sector-engagement/eef/reference/conservation-map.md)
- Increment 1 plan (foundation):
  [`.agent/plans/knowledge-graph-integration/current/graph-query-layer.plan.md`](../plans/knowledge-graph-integration/current/graph-query-layer.plan.md)
- Increment 2 plan (EEF as corpus):
  [`.agent/plans/sector-engagement/eef/current/eef-evidence-corpus.plan.md`](../plans/sector-engagement/eef/current/eef-evidence-corpus.plan.md)
- Increment 3 plan (cross-source journeys):
  [`.agent/plans/knowledge-graph-integration/future/cross-source-journeys.plan.md`](../plans/knowledge-graph-integration/future/cross-source-journeys.plan.md)
- Pre-session predecessor (recoverable from git history):
  `git show e2796757:.agent/plans/sector-engagement/external-knowledge-sources/current/eef-evidence-mcp-surface.plan.md`
