---
status: superseded-opener
authored: 2026-05-07
authored_by: Windward Darting Horizon (cursor, claude-opus-4.7, dd084d)
thread: connecting-oak-resources (with eef subthread coordination)
target_session_shape: superseded by completed Breezy planning closure; retained as historical opener only
superseded_by: .agent/memory/operational/threads/connecting-oak-resources.next-session.md#first-task-of-next-session
spine_plan: ../../../graph-mvp-arc.plan.md
artefacts_under_review:
  - .agent/plans/graph-mvp-arc.plan.md
  - .agent/plans/graph-portfolio-index.md
  - .agent/research/graph-library.research.md
  - docs/architecture/architectural-decisions/173-graph-stack-topology.md
  - docs/architecture/architectural-decisions/157-multi-source-open-education-integration.md
  - .agent/plans/sector-engagement/eef/current/eef-evidence-corpus.plan.md
  - .agent/plans/connecting-oak-resources/knowledge-graph-integration/active/nc-knowledge-taxonomy-surface.plan.md
landing_target_per_pdr_026: synthesised reviewer report with per-artefact verdict (CLEAN / FINDINGS / BLOCKER) and a remediation plan for any BLOCKER, landed alongside this opener
out_of_scope:
  - authoring slice-2 / slice-3a / slice-3b executable plans (waits on reviewer settling)
  - any code change (this is doc-only review)
  - reopening the boundary correction (settled 2026-05-07; reviewers note it but do not relitigate)
---

# Next session opener — Graph MVP-arc specialist review

**Superseded**: Breezy Navigating Sail completed this specialist-review
and slice-planning closure on 2026-05-07. Do not execute this opener as
the current next step; use the
[`connecting-oak-resources` thread record](../../../../memory/operational/threads/connecting-oak-resources.next-session.md#first-task-of-next-session)
instead.

**Thread**: `connecting-oak-resources` (primary), with `eef`
subthread coordination for the EEF-shaped artefacts.

**Sole target this session**: a parallel specialist-expert pass
over the artefacts authored on 2026-05-07, synthesise findings,
record verdicts. Slice-2 / slice-3a / slice-3b authoring is
deliberately blocked until review settles — the spine's
`author-slice-N-plan` todos do not start before this opener
completes.

## What landed 2026-05-07 — at-a-glance

Five commits on `planning/graph-tooling`:

- `53698ce0` — graph portfolio + RDF 1.2 doctrine + graph topology ADR
  skeleton (then ADR-168; renumbered to ADR-173 on 2026-05-07 closeout)
  (21 files; research rename, portfolio index, topology ADR, twelve plan
  frontmatters, high-level cross-link, collection README pointer).
- `f07bacfb` — ADR-157 namespace amendment
  (`oak-misconceptions-*` row, compound prefix row, explicit-source-
  attribution discipline) + EEF tool/prompt re-prefix `eef-*` (19
  occurrences across 5 names).
- `3c66bb4d` — graph MVP-arc spine plan (cross-collection
  coordination spine; 3 slices: EEF → Threads → mcg sub-graph +
  EEF×mcg cross-corpus).
- `abd8cd4f` — NC SKOS taxonomy promotion trigger
  (demand-tripwire on its own plan, **not** the spine).
- `146c214f` — session memory + handoff (napkin compacted,
  pending-graduations gained two graduation candidates,
  repo-continuity + thread records refreshed).

## Late-session boundary correction (read first, do not relitigate)

During authoring I twice over-claimed authority for the spine by
treating the NC SKOS taxonomy plan as an "out-of-arc item" the spine
should sequence. Owner correction 2026-05-07: *"the NC work is
explicitly NOT part of the MVP, you have clearly become confused"*.

**Settled outcome**: the spine tracks ONLY what's IN the MVP arc.
Adjacent plans (NC SKOS taxonomy, SPARQL endpoint, etc.) carry their
own promotion triggers in their own homes. The spine has no
out-of-arc / cut-scope tables. The doctrine itself
(*"sequence-or-admit-not-doing"*) is captured to
`pending-graduations.md` for graduation as a rule.

Reviewers should *note* whether this correction is fully settled in
the artefacts (no residual `mvp_arc_*` framing on the NC plan, no
out-of-arc tracking in the spine, MVP Discipline section reads as
intended) but should not re-open the design choice — owner-decided.

## Reviewer dispatch — five specialists in parallel

All five are parallel-safe (different specialisms; no shared
artefact-write expectation since this is read-only review). Dispatch
all five in a single tool-call batch with `readonly: true`.

### 1. `assumptions-expert`

**Focus**: proportionality, dependency validity, blocking
legitimacy, the MVP discipline shape.

**Prompt content**:

- The spine asserts a dependency graph: substrate floor → gate-1
  (EEF) → {gate-2 (Threads), gate-3a (mcg sub-graph)} → gate-3b
  (cross-corpus). Are these dependencies real or assumed? Specifically:
  is gate-1 → gate-2 a strict dependency (owner-stated) or
  parallel-safe? Is the substrate floor genuinely required for slice
  1, or could slice 1 ship on the legacy graph factory?
- The spine claims the MVP "ships something useful soon at full
  quality by reducing scope". Is the scope reduction real? Is the
  three-slice arc the smallest meaningful arc, or has scope crept?
- The boundary correction (spine tracks only what's IN; adjacent
  plans own their own sequencing) — is it fully settled in the
  artefacts? Any residual cataloguing?
- ADR-173's seven binding tripwires — are they tripwires (specific
  named events that fire) or aspirations (vague conditions)?

**Expected output**: PASS / FINDINGS / BLOCKERS, each finding a
sentence; do not author corrections.

### 2. `architecture-expert-betty`

**Focus**: cohesion, coupling, long-term change cost.

**Prompt content**:

- ADR-157 namespace conventions as a structural decision: every new
  tool gets a source-identifying prefix (or compound prefix). Long-
  term change cost: what happens when a tool's primary corpus
  changes? When a new corpus is added? Is the convention
  sustainable?
- ADR-173's eight-workspace topology with a deferred ninth: the
  cohesion shape (each workspace owns one substrate concern). Are
  workspace boundaries crisp? Where would a new corpus adapter
  land?
- The MCP-agnostic principle (graph workspaces ship no MCP types,
  surfacing is consumer-side) — does the spine respect this in its
  slice-shape proposals, or do the MCP tool names leak into
  substrate workspace concerns?
- The spine plan's three-slice topology — is the parallel-safe
  branching (slice 2 ‖ slice 3a after slice 1) sound, or is there
  hidden coupling that would force serialisation?

**Expected output**: PASS / FINDINGS / BLOCKERS.

### 3. `architecture-expert-fred`

**Focus**: strict ADR compliance, principles-first review.

**Prompt content**:

- ADR-173 is proposed. Does it comply with existing ADRs? Specifically:
  ADR-157 (namespace conventions — already amended this arc), ADR-123
  (MCP primitives roster), ADR-117 (plan lifecycle / archival),
  ADR-144 (fitness vocabulary). Any contradiction or unspecified
  overlap?
- The 12 plan frontmatters that gained `graph_layer` +
  `graph_portfolio_index` tags — are the values consistent with the
  classification scheme in `graph-portfolio-index.md`? Any plan
  classified to a layer that doesn't fit?
- Citation discipline across the new artefacts: the spine plan
  cross-references many surfaces. Are all back-references closed
  (no broken anchors, no dangling SHA references, no moving-target
  citations per `no-moving-targets-in-permanent-docs.md`)?
- The seven RDF 1.2 / standards-evolution tripwires in
  `graph-library.research.md` §19 + ADR-173: do they meet the
  named-tripwire bar (specific firing condition + named owner) or
  do any read as aspirational?

**Expected output**: PASS / FINDINGS / BLOCKERS.

### 4. `mcp-expert`

**Focus**: MCP spec compliance, namespace discipline, proposed tool
shapes for the three slices.

**Prompt content**:

- ADR-157 amendment introduces a compound prefix
  (`oak-misconceptions-eef-*`) for cross-corpus tools. Does the
  compound shape conform to MCP's tool-naming conventions? Is the
  compound semantically distinct from a single-source prefix in a
  way clients can rely on?
- The five `eef-*` tool/prompt names re-prefixed in
  `eef-evidence-corpus.plan.md` (todos t6–t11) — are the renamed
  names well-formed per current MCP spec? Any reserved-character
  concerns?
- The slice-2 proposed tool/resource shape (`oak-kg-threads`
  resource + `oak-kg-get-thread-content` tool) — does it fit MCP
  resource/tool semantics, or does the shape conflate the two?
- The slice-3a proposed tool shape
  (`oak-misconceptions-subgraph-for-{thread|unit}`) — variant naming
  via brace expansion is a documentation shorthand; what's the actual
  tool-count proposal? Is it 1, 2, or N tools?
- The slice-3b proposed cross-corpus tool name
  (`oak-misconceptions-eef-recommend-for-thread`) — does the verb
  shape (`recommend-for-thread`) fit MCP tool-action conventions
  the rest of the roster uses?
- The MCP-agnostic substrate principle (graph workspaces ship no
  MCP types) — is it consistent with how MCP servers typically
  consume corpus adapters in the broader ecosystem?

**Expected output**: PASS / FINDINGS / BLOCKERS.

### 5. `docs-adr-expert`

**Focus**: documentation completeness, ADR quality, cross-reference
integrity, internal consistency.

**Prompt content**:

- ADR-173 (proposed) — is the skeleton at the right level (decision,
  context, consequences, status)? Anything missing for a proposal
  that would block ratification when ready?
- ADR-157 amendment — is the amendment self-contained (readable
  without prior knowledge of the unamended ADR)? Does it preserve
  the existing decision while extending it cleanly?
- `graph-mvp-arc.plan.md` post-boundary-correction — is the document
  internally consistent? (Phase 0/2/3/4 sequencing aligns with
  `## Sequencing and Gates`; MVP Discipline aligns with the
  Owner Decisions Log; no orphaned references to removed sections.)
- `graph-portfolio-index.md` — is the goal-by-goal classification
  legible without prior context? Do the cross-references to
  individual plans resolve?
- `high-level-plan.md` Cross-cutting Threads section — does the new
  pointer to the spine + portfolio index integrate with the existing
  high-level structure, or does it sit awkwardly?
- `graph-library.research.md` (renamed from `graph-iibrary.md`) —
  is the rename complete? All in-repo references updated?
  (Renames are a citation-drift risk per
  `no-moving-targets-in-permanent-docs.md`.)
- The boundary correction's settling state in the artefacts — are
  there any residual MVP-arc-framing artefacts on the NC plan or
  the spine that the correction missed?

**Expected output**: PASS / FINDINGS / BLOCKERS.

## After the reviewers return — synthesis

1. **Aggregate verdicts** into a single per-artefact table:
   `<artefact> | <reviewer> | <verdict> | <findings count>`.
2. **Triage findings** into three buckets:
   - **BLOCKERS** — must remediate before slice-2 / slice-3a
     authoring proceeds. These get a tracked remediation todo on
     the spine.
   - **FINDINGS** — should remediate but not blocking. Land
     incrementally on the relevant artefact; record on the spine's
     `learning-loop` todo.
   - **NOTES** — context for downstream reviewers (e.g. slice-2
     plan author should consider X). Land in the spine's risks
     table or as a comment on the relevant slice's authoring todo.
3. **Remediate BLOCKERS** in the same session if scope allows; if
   not, land a remediation plan and stop.
4. **Update the spine's Owner Decisions Log** with the review
   outcome and the next-step disposition.
5. **Mark spine reviewer dispatch complete** by recording each
   reviewer's verdict in the spine's `specialist_reviewers`
   frontmatter or a new `## Specialist Review` section (whichever
   is more legible).

## Why this opener

The artefacts authored 2026-05-07 are coordination amendments and a
new spine plan — they steer downstream work but ship nothing in
themselves. Their value depends entirely on whether they're sound;
specialist review is the cheapest way to detect problems before the
spine starts gating real delivery. The boundary correction
late-session was significant; a clean review pass also serves to
validate that the correction settled cleanly across all artefacts.

This opener's owner-named first-task candidate was completed by the
2026-05-07 planning closure. The current next step now lives in the
[`connecting-oak-resources` thread record](../../../../memory/operational/threads/connecting-oak-resources.next-session.md#first-task-of-next-session):
decision-completeness closeout before slice execution starts.

## Practical notes for the dispatching agent

- Run `/oak-open-curriculum-ecosystem/jc-start-right-quick` (or
  `start-right-thorough` if context is limited) before dispatching.
  The spine plan is large; reading it in full before dispatch is
  worthwhile.
- All five reviewers are read-only (`readonly: true`). They produce
  verdicts and findings; they do not author corrections.
- Reviewers can run in a single parallel batch — none of them write,
  none share file scope.
- Synthesis is the dispatching agent's job, not a sixth reviewer's.
- If a reviewer surfaces a domain outside its specialism, route the
  finding rather than expanding scope — e.g. mcp-expert noting an
  Elasticsearch concern routes to `elasticsearch-expert` next pass.

## Cross-references

- Spine plan: [`../../../graph-mvp-arc.plan.md`](../../../graph-mvp-arc.plan.md)
- Portfolio index: [`../../../graph-portfolio-index.md`](../../../graph-portfolio-index.md)
- Research: [`../../../../research/graph-library.research.md`](../../../../research/graph-library.research.md)
- ADR-173: [`../../../../../docs/architecture/architectural-decisions/173-graph-stack-topology.md`](../../../../../docs/architecture/architectural-decisions/173-graph-stack-topology.md)
- ADR-157: [`../../../../../docs/architecture/architectural-decisions/157-multi-source-open-education-integration.md`](../../../../../docs/architecture/architectural-decisions/157-multi-source-open-education-integration.md)
- EEF plan: [`../../../sector-engagement/eef/current/eef-evidence-corpus.plan.md`](../../../sector-engagement/eef/current/eef-evidence-corpus.plan.md)
- NC plan: [`../active/nc-knowledge-taxonomy-surface.plan.md`](../active/nc-knowledge-taxonomy-surface.plan.md)
- Thread record: [`../../../../memory/operational/threads/connecting-oak-resources.next-session.md`](../../../../memory/operational/threads/connecting-oak-resources.next-session.md)
- EEF subthread record: [`../../../../memory/operational/threads/eef.next-session.md`](../../../../memory/operational/threads/eef.next-session.md)
- Pending-graduations entries from this session: `sequence-or-admit-not-doing` doctrine + `spine-drift-via-comprehensive-cataloguing` anti-pattern at [`../../../../memory/operational/pending-graduations.md`](../../../../memory/operational/pending-graduations.md).
