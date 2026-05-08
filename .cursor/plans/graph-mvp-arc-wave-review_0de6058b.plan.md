---
name: graph-mvp-arc-wave-review
overview: Close the MVP-arc planning arc in a single session — prefix-remediate three drift lines in the spine, dispatch one parallel batch (code-reviewer + assumptions-reviewer over MVP-arc artefacts; topology specialist over ADR-168 + graph-stack in parallel), synthesise, author the three slice plans, then a final two-reviewer pass over the new slice plans. Doc-only; all reviewers readonly; non-MVP plans, NC plan, and execution all out of scope.
todos:
  - id: preflight-identity-claim
    content: "Pre-flight: register PDR-027 identity row on connecting-oak-resources thread; bootstrap fast-path comms event; register own claim covering the spine plan + thread record + the three slice-plan paths"
    status: pending
  - id: phase0-spine-remediation
    content: "Phase 0: prefix-remediate three mvp_arc_status drift lines in graph-mvp-arc.plan.md (lines 299, 453, 563); single commit; format/markdownlint gates"
    status: pending
  - id: phase1-parallel-review
    content: "Phase 1: single parallel batch — Lane A (code-reviewer + assumptions-reviewer over MVP-arc artefacts) + Lane B (architecture-reviewer-betty over ADR-168 + graph-stack.plan.md topology). All readonly: true; each carries the parallel-agents delegation snapshot."
    status: pending
  - id: phase2-synthesis-blocker-remediation
    content: "Phase 2: aggregate Phase 1 verdicts into per-artefact × per-reviewer table; triage BLOCKER/FINDINGS/NOTES; remediate any BLOCKERs in the existing artefacts before slice authoring proceeds"
    status: pending
  - id: phase3-slice-plan-authoring
    content: "Phase 3: author three executable slice plans in connecting-oak-resources/knowledge-graph-integration/current/ — oak-kg-threads-surface.plan.md (slice 2), oak-misconceptions-subgraph-mcp-surface.plan.md (slice 3a), oak-misconceptions-eef-cross-corpus-surface.plan.md (slice 3b). Use feature-workstream-template; inherit spine acceptance criteria; cross-reference spine. Slices 2 + 3a parallel-safe; 3b authors against locked tool names from spine."
    status: pending
  - id: phase4-slice-plan-review
    content: "Phase 4: code-reviewer + assumptions-reviewer over the three new slice plans (single parallel batch, readonly). Per-slice verdicts; remediate any BLOCKERs in same session"
    status: pending
  - id: phase5-spine-closure
    content: "Phase 5: update spine Owner Decisions Log + specialist_reviewers frontmatter + mark author-slice-N-plan todos completed; refresh connecting-oak-resources thread next-session record (planning closed; next session begins execution prep — graph-stack ACTIVE transition + gate-0 substrate floor); drop topology-approval pass from queued work (folded in this session)"
    status: pending
  - id: learning-loop
    content: "After session close: run /jc-consolidate-docs; check whether the two queued graduation candidates (sequence-or-admit-not-doing; spine-drift-via-comprehensive-cataloguing) gain another instance from this pass; record but do not graduate this session"
    status: pending
isProject: false
---

# Graph MVP-Arc Planning Closure (Single Session)

## Context

Owner direction 2026-05-08:

- Reduce reviewers to **code-reviewer + assumptions-reviewer**; one specialist
  on topology in parallel.
- **Finish the planning arc this session.** A four-session prelude before any
  execution is unacceptable.
- NC plan, non-MVP adjacent plans, and implementation are **out of scope**.
- Topology review folds in alongside the MVP-arc review, parallel.

This collapses the previous wave-based proposal: one parallel review batch,
one synthesis, one slice-plan authoring phase, one short final review of the
new slice plans, one closure. Session end state: every artefact in the MVP-arc
planning surface is authored, reviewed, and remediated. The next session
begins execution preparation (graph-stack ACTIVE transition + gate-0
substrate floor) — not more planning.

The boundary-correction drift the previous session's opener missed is
confirmed on inspection — three textual references to the discontinued
`mvp_arc_status: deferred` annotation in
[`.agent/plans/graph-mvp-arc.plan.md`](.agent/plans/graph-mvp-arc.plan.md):

- **L299** — Slice 2 cut-scope row claims the NC plan is "annotated `mvp_arc_status: deferred`". The NC plan now carries `promotion_trigger: demand-tripwire` only.
- **L453** — narrative paragraph names the discontinued frame while describing the reversion.
- **L563** — Risks table row mentions "deprioritised by `mvp_arc_status: deferred` annotation"; the risk is moot because the annotation no longer exists.

These prefix-remediate before reviewer dispatch so reviewers see a clean spine.

## Pre-flight

1. **Identity registration** — register a fresh PDR-027 row on the
   `connecting-oak-resources` thread record before any substantive work
   (Cursor / claude-opus-4.7 / `9edbd1` — display name `Breezy Navigating Sail`).
2. **Active-claims scan** — read
   [`.agent/state/collaboration/active-claims.json`](.agent/state/collaboration/active-claims.json);
   the `claims` array is currently empty so this is a bootstrap fast-path.
   Append a "no other agents present" comms event before edits.
3. **Register own claim** covering:
   - `.agent/plans/graph-mvp-arc.plan.md`
   - `.agent/plans/connecting-oak-resources/knowledge-graph-integration/current/oak-kg-threads-surface.plan.md` (new)
   - `.agent/plans/connecting-oak-resources/knowledge-graph-integration/current/oak-misconceptions-subgraph-mcp-surface.plan.md` (new)
   - `.agent/plans/connecting-oak-resources/knowledge-graph-integration/current/oak-misconceptions-eef-cross-corpus-surface.plan.md` (new)
   - `.agent/memory/operational/threads/connecting-oak-resources.next-session.md`

## Phase 0 — Spine remediation (single commit)

Three line-scoped edits to the spine, preserving substance, removing the
discontinued-frame vocabulary that contradicts the boundary correction:

- **L299** (Slice 2 cut-scope row): replace `"annotated `mvp_arc_status: deferred`; queued post-arc"` with `"carries its own `promotion_trigger: demand-tripwire on SKOS-specific demand` in its own frontmatter; promotes when its own tripwire fires, independent of slice-2's gate"`.
- **L453** (narrative): tighten to `"During this session the spine briefly carried out-of-arc framing for the NC plan; both attempts were reverted same-day per owner correction."` Drop the discontinued-frame name from a normative section.
- **L563** (Risks row): remove the row. The risk is moot.

Single commit:

```text
docs(plans): remove residual mvp_arc_status drift from MVP-arc spine
```

Quality gates after edit: `pnpm format:root` + `pnpm markdownlint:root`.

## Phase 1 — Parallel review batch (3 readonly reviewers, single dispatch)

One tool-call batch. All `readonly: true`. Two lanes run concurrently:

| Lane | Reviewer | Lens | Artefact set |
|---|---|---|---|
| A | `code-reviewer` | Gateway-triage per [`invoke-code-reviewers.md`](.agent/memory/executive/invoke-code-reviewers.md). Foundation-doc alignment; cross-artefact consistency; explicit "missing specialists" call (gates whether any other reviewer must run before close) | MVP-arc artefacts (5): spine (post-remediation), portfolio index, EEF plan, ADR-157 amendment, research file |
| A | `assumptions-reviewer` | Proportionality; dependency validity; blocking legitimacy; tripwire-vs-aspiration on ADR-168's seven; whether the three-slice arc is the smallest meaningful arc | Same five MVP-arc artefacts |
| B | `architecture-reviewer-betty` (topology specialist) | Cohesion/coupling/change cost over the eight-workspace topology; MCP-agnostic principle; substrate-vs-surface boundary; first-wave ingestion scope; whether the workspace decomposition is the right shape | ADR-168 + [`graph-stack.plan.md`](.agent/plans/connecting-oak-resources/knowledge-graph-integration/current/graph-stack.plan.md) |

Topology specialist alternative: `architecture-reviewer-fred` (strict ADR
compliance — ADR-168 against ADRs 117/123/144/154/157) is the obvious swap
if owner prefers principles-first over cohesion lens.

Each delegation snapshot carries the
[`parallel-agents`](.agent/skills/parallel-agents/SKILL.md)
contract (Goal / Owned surface / Non-goals / Required evidence /
Acceptance signal / Reintegration owner / Stop or escalate rule).

Expected output per reviewer: per-artefact `CLEAN` / `FINDINGS` / `BLOCKER`,
each finding one sentence; do not author corrections.

## Phase 2 — Synthesis + Phase 1 BLOCKER remediation

1. Aggregate into a per-artefact × per-reviewer verdict table.
2. Triage BLOCKER / FINDINGS / NOTES.
3. **If code-reviewer flags a missing specialist** the work shape genuinely
   needs (rare — most signal comes from the named two): surface to owner,
   accept the trade vs the single-session commitment.
4. Remediate any BLOCKERs in the existing artefacts before slice authoring
   begins. FINDINGS land incrementally; NOTES tracked for slice authoring.

## Phase 3 — Slice plan authoring (parallel where work shape allows)

Author three executable plans using
[`feature-workstream-template.md`](.agent/plans/templates/feature-workstream-template.md),
all in
`.agent/plans/connecting-oak-resources/knowledge-graph-integration/current/`:

| Slice | Filename | Surface (named in spine) |
|---|---|---|
| 2 | `oak-kg-threads-surface.plan.md` | `curriculum://oak-kg-threads` resource + `oak-kg-get-thread-content` tool via graph-corpus-sdk Oak Curriculum Ontology adapter; inverse-edge query (Unit→Thread) |
| 3a | `oak-misconceptions-subgraph-mcp-surface.plan.md` | `oak-misconceptions-subgraph-for-thread` (and optional `-for-unit`) tool(s) on legacy graph factory; bounded sub-graph extraction |
| 3b | `oak-misconceptions-eef-cross-corpus-surface.plan.md` | `oak-misconceptions-eef-recommend-for-thread` cross-corpus tool composing graph-corpus-sdk EEF + misconception adapters via graph-stack Inc.3 |

Each slice plan inherits substance directly from the spine — substrate
dependencies, tool names, acceptance criteria, namespace prefix, sequencing
gate. The slice plan adds the executable shape: TDD cycles (test+product-code
paired commits), per-cycle quality gates, file-level acceptance, risks,
non-goals (YAGNI), foundation alignment refs, learning-loop step.

**Parallelism**: Slices 2 and 3a are parallel-safe (different files, different
substrate paths). Slice 3b cross-references both upstream tools by name —
because the spine already names them, 3b can author concurrently with 2 + 3a
locked against those names.

**Slice plan authoring is mostly mechanical from the spine.** The spine
carries the substance; the slice plans carry the executable shape under the
template.

## Phase 4 — Slice plan review (same two reviewers, single batch)

`code-reviewer` + `assumptions-reviewer` over the three new slice plans.
Single parallel batch, `readonly: true`. Per-slice verdicts.

The topology specialist is **not** re-run — Phase 1 covered the topology;
slice plans consume substrate but do not modify topology decisions.

Remediate any BLOCKERs in the slice plans the same session.

## Phase 5 — Spine closure

1. Update spine `Owner Decisions Log`:
   - Boundary-correction drift remediated (L299/L453/L563).
   - Phase 1 + Phase 4 reviewer verdicts.
   - Topology-approval pass folded in this session (deviation from prior
     thread-record commitment of "four reviewers"; documented rationale: owner
     direction 2026-05-08 collapsed planning into one session).
2. Update spine `specialist_reviewers` frontmatter with the four invocations:
   `code-reviewer × 2`, `assumptions-reviewer × 2`, `architecture-reviewer-betty × 1`.
3. Mark `author-slice-2-plan`, `author-slice-3a-plan`, `author-slice-3b-plan`
   todos as `completed`.
4. Refresh
   [`connecting-oak-resources.next-session.md`](.agent/memory/operational/threads/connecting-oak-resources.next-session.md):
   - Planning arc closed.
   - Next session: graph-stack CURRENT → ACTIVE transition + ADR-168 Proposed
     → Accepted promotion + gate-0 substrate floor execution.
   - Drop the queued "topology approval pass" from First-Task-of-Next-Session.
5. Land closure as a final commit (or fold into the slice-plan authoring
   commit chunk if the bundle stays coherent).

## Out of scope (owner-confirmed 2026-05-08)

- **NC plan** — `nc-knowledge-taxonomy-surface.plan.md` carries its own
  `promotion_trigger`; not part of MVP arc; not touched.
- **Non-MVP adjacent plans** — `cross-source-journeys.plan.md`,
  `external-knowledge-graph-data-source-integration.plan.md`,
  `direct-ontology-use-and-graph-serving-prototypes.plan.md`,
  `oak-curriculum-ontology-workspace-reassessment.plan.md`,
  `graphify-and-graph-memory-exploration.plan.md`,
  `oak-knowledge-graph-external-adoption.plan.md`, and the four named slice-2
  cut-scope follow-up plans (lesson-graph projection, programme/unit
  navigator, IRI traverser, schema/class browser) — strategic briefs, own
  promotion triggers, not touched.
- **Implementation** — gate-0 substrate floor, slice-1 EEF execution, any
  slice 2/3a/3b execution. Strictly planning only this session.
- **ADR-168 Proposed → Accepted promotion** — happens at graph-stack ACTIVE
  transition (execution prep, next session). Topology REVIEW is in scope;
  ratification is not.
- **graph-stack.plan.md CURRENT → ACTIVE promotion** — execution prep,
  next session.
- **Reopening the boundary correction** — settled 2026-05-07; Phase 0
  cleans drift only.
- **Sweeping for `mvp_arc_*` outside the listed artefacts** unless a reviewer
  surfaces an instance.

## Risks

| Risk | Mitigation |
|---|---|
| Three slice plans + two reviewer passes + topology review in one session | Each slice plan is mechanical from the spine; reviewer passes are over MVP-arc-only artefacts (no widening). The single-session commitment is the explicit owner trade against four-session drag. |
| Slice 3b cross-references slices 2 + 3a tool names; if those drift mid-authoring, 3b needs amendment | Tool names are already named in the spine; slice plans lock against those names. Any name change in Phase 4 review triggers all three slice plans amending together. |
| Phase 1 topology review surfaces a BLOCKER that ripples into slice plans | Sequence Phase 1 → Phase 2 → Phase 3, so authoring starts with topology verdict known. If Phase 1 BLOCKERs cascade into slice-plan shape, remediate in Phase 2 before authoring. |
| Code-reviewer flags a missing specialist with real signal | Owner-decided trade: defer to a follow-on session, or accept one extra reviewer in Phase 1. Default: defer (preserves single-session commitment); document in Owner Decisions Log. |
| Topology-specialist choice (betty vs fred) | Default `betty` (cohesion / topology fit). Owner may swap before dispatch. |
| Reviewer findings cite text not in the artefact (per Pelagic Rolling Harbour Surprise 2 in `napkin.md`) | Verify each text-citing finding against the artefact before applying. |
| Single-session deviation from thread-record's "four reviewers for topology approval" commitment | Document deviation explicitly in spine Owner Decisions Log; rationale = owner direction 2026-05-08; topology specialist's verdict is the load-bearing signal. |

## Foundation alignment

- [`principles.md`](.agent/directives/principles.md) — read-before-asking,
  replace-don't-bridge, no-moving-targets, "could it be simpler".
- [`invoke-code-reviewers.md`](.agent/memory/executive/invoke-code-reviewers.md)
  — gateway + specialist roster; reduced set is owner-directed deviation.
- [`parallel-agents/SKILL.md`](.agent/skills/parallel-agents/SKILL.md) —
  delegation snapshot contract for all reviewers.
- [`re-apply-first-question-at-elaboration-boundaries.md`](.agent/rules/re-apply-first-question-at-elaboration-boundaries.md)
  — at each phase boundary, re-ask "could it be simpler without compromising
  quality?".
- ADR-117 — plan templates and components (slice plans use the executable
  template).

## Learning loop

After session close: run `/jc-consolidate-docs`. Two graduation candidates
from prior session (sequence-or-admit-not-doing; spine-drift-via-comprehensive-cataloguing)
at [`pending-graduations.md`](.agent/memory/operational/pending-graduations.md)
may pick up another instance from this pass — record but do not graduate this
session. The single-session-planning-closure pattern itself may emerge as a
new candidate (collapsing wave-based review into one parallel batch + same-
session authoring); capture as napkin observation.

## Session-end exit signal

The planning arc is closed when, at session end:

- Spine post-remediation is internally consistent.
- All three slice plans are authored in `current/` with full executable shape.
- Two reviewer passes complete with verdicts recorded.
- All BLOCKERs remediated.
- Spine Owner Decisions Log + frontmatter updated.
- Thread next-session record refreshed: next session begins execution prep,
  not more planning.
