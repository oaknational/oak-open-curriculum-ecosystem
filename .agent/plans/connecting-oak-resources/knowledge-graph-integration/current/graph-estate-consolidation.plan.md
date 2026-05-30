---
title: "Graph estate consolidation, decontamination & rewriting — master plan for all graph materials"
status: current
lane: current
type: executable
thread: eef
date: 2026-05-29
authored_by: "Pelagic Sailing Sextant (claude / claude-opus-4-8 / 606a0e) — owner-directed: consolidation deferred to a fresh session with clear context; this plan carries forward the verified estate map so the next session does not re-derive it."
related:
  - "../../../sector-engagement/eef/current/eef-graph-tool-completion.plan.md (the keystone: the single EEF plan)"
todos:
  - id: t1-verify-unclassified
    content: "Verify the 6 not-yet-examined live-lane files and assign each a disposition (status vs code reality, staleness, keep/archive/park): active/agent-guidance-consolidation.plan.md; current/kg-alignment-audit.execution.plan.md; current/kg-integration-quick-wins.plan.md; active/open-education-knowledge-surfaces.plan.md (historical umbrella — likely archive); current/oak-kg-threads-surface.plan.md + current/oak-misconceptions-subgraph-mcp-surface.plan.md (gate-1a-framed speculative surfaces in the wrong lane — likely park-as-future, blocked-on-EEF)."
    status: pending
  - id: t2-archive-superseded
    content: "Archive the superseded-framing plans to archive/completed/ with a supersession pointer to the finishing plan; add completed-plans index entries. NEVER delete (knowledge-preservation)."
    status: pending
  - id: t3-archive-completed
    content: "Archive the genuinely-DONE plans (graph-resource-factory, misconception-graph-mcp-surface, graph-stack-ws1.6-vocab-prep) to archive/completed/ with outcomes + SHAs."
    status: pending
  - id: t4-park-future-blocked
    content: "Reframe the speculative graph-surface future plans as explicitly blocked-on-EEF-first-proper-graph-tool-completion; consolidate the 5 oak-misconceptions-* future plans into one; move nc-knowledge-taxonomy-surface from active/ to future/."
    status: pending
  - id: t5-rewrite-readmes
    content: "Rewrite the EEF README and the knowledge-graph-integration README to the corrected reality (drop five-increment/gate-1a-1b/7-op-polymorphic/recommend-explain-compare framing; fix broken current/<->active/ links; point to the finishing plan only — the foundation doc is quarantined)."
    status: pending
  - id: t6-author-value-plan
    content: "Author future/eef-graph-tool-value-evaluation.plan.md (strategic), superseding future/eef-outcome-evaluation-infrastructure.plan.md, evaluating the FINISHED tool's value (structural fidelity; the discovery questions; usefulness vs the other curriculum tools). Promotion trigger: finishing-plan D7 green. ALSO decide the home for the post-completion 'working with graphs' doctrine graduation (old D5): fold into this value plan or a named follow-on."
    status: pending
    depends_on: [t1-verify-unclassified]
  - id: t7-reconcile-references
    content: "Reconcile remaining gate-1a/1b/Inc.3 references across the live .agent estate (the old DX): graph-portfolio-index.md, oak-misconceptions-eef-cross-corpus-surface.plan.md, graph-stack.plan.md, graph-query-layer references, repo-continuity.md (coordinate, do not edit unilaterally). Source docstring reconciliation in files the finishing plan rewrites is owned by the finishing plan, NOT here."
    status: pending
    depends_on: [t2-archive-superseded, t5-rewrite-readmes]
  - id: t8-verify-clean
    content: "Verify the estate reads clean: no broken links (rg link-check), READMEs accurate, every archived plan has a pointer + index entry, every parked plan states its block condition; markdownlint + relevant gates green."
    status: pending
    depends_on: [t2-archive-superseded, t3-archive-completed, t4-park-future-blocked, t5-rewrite-readmes, t6-author-value-plan, t7-reconcile-references]
---

# Graph estate consolidation, decontamination & rewriting — master plan for all graph materials

> **Nominated master plan (owner-directed 2026-05-30).** This is THE plan owning
> consolidation, **decontamination**, and **rewriting** for ALL graph-related
> materials. Decontamination = remove every `gate-1a`/`gate-1b` reference and every
> discarded concept (Zod-over-corpus, the freshness/ADR-175 gate, `NotImplementedYet`
> stubs, the `recommend`/`explain`/`compare` ops, the five-increment + 7-op-polymorphic
> framing) across the whole estate. Rewriting = reshape the salvageable plans around
> the corrected doctrine in the live EEF plan's Ratified Decisions
> ([`eef-graph-tool-completion.plan.md`](../../../sector-engagement/eef/current/eef-graph-tool-completion.plan.md)):
> known-vs-unknown data, no Zod except the single MCP tool output schema, no
> freshness gate, no gates, impact-led delivery. The EEF plan owns only the EEF tool
> build + the EEF-stack decontamination; everything else graph is here.
>
> **Why a fresh session.** Owner-directed 2026-05-29: the consolidation spans
> ~30 live plan files across two collections (`sector-engagement/eef/` and
> `connecting-oak-resources/knowledge-graph-integration/`) and most of them are
> written in a superseded framing. Doing this in a cluttered context risks
> mis-archiving live work. Start fresh, ground on this brief + the two cited
> truth sources, then execute.

## Verified state to inherit (do not re-derive)

Established 2026-05-29 by a 6-agent verification pass against code + git
(not plan prose). Treat as ground truth at session open; re-verify only if a
disposition turns on a detail.

- **The first proper graph tool is NOT finished.** Its completion is the live
  execution plan
  [`eef-graph-tool-completion.plan.md`](../../../sector-engagement/eef/current/eef-graph-tool-completion.plan.md)
  (D0–D7; impact-led, decision-complete). The wider
  graph work is **undefined until that tool is finished** (owner direction).
- **The substrate is built and on `main`** (PRs #93/#108/#115/#122; v1.15.0):
  `graph-core`, `graph-ingest`, `graph-project`, and `graph-corpus-sdk`
  eef-strands (`loadEefCorpus`, `selectEefSeedIds`, `subgraph`, `manifest`,
  freshness; 53 tests pass). Five of seven `EefStrandsGraphView` ops are
  `NotImplementedYet` stubs (the finishing plan's target). The EEF tool ships **dark** behind
  `OAK_CURRICULUM_MCP_EEF_ENABLED` (default OFF; nothing sets it true).
- **The estate is mostly superseded framing**: gate-1a/1b, the five-increment
  architecture, the 7-operation polymorphic query layer with mandatory
  projection, and `recommend/explain/compare` tools — all discarded by the
  rebuild. Consolidation = archive that framing and shrink the estate to a clean
  minimal set, not add documents.

## End goal

A clean, minimal, accurate graph plan estate: one live finishing plan, one
strategic value plan, accurate READMEs, the superseded framing archived with
pointers, and the speculative future surfaces parked with an explicit
block-on-EEF condition — so any agent opening the estate sees the true state in
one read.

## Disposition map (proposal carried forward; confirm at execution)

| Disposition | Files | Action |
|---|---|---|
| **Archive — superseded framing** | `eef/archive/graph-tooling-rebuild.plan.md` (quarantined 2026-05-30); `kg/current/graph-query-layer.plan.md` (old 7-op layer → S2); `kg/current/gate-1a-delivery-parallel-execution-addendum.plan.md`; `kg/current/2026-05-08-graph-mvp-arc-specialist-review-opener.md`; `kg/current/2026-05-08-pr102-graph-decision-complete-closeout.plan.md`; `kg/current/2026-05-11-graph-execution-prep-opener.md`; `kg/current/pr-108-sonar-live-issues-2026-05-24.md` | move to `archive/completed/` + supersession pointer + index entry |
| **Quarantine or rewrite — structurally gate-based + fully contaminated** | `graph-mvp-arc.plan.md`; `graph-portfolio-index.md`; `graph-combinatorial-arc.plan.md` | their todos/acceptance/dependency-graphs ARE the gates, and they carry the full discarded stack (corpus-local Zod loader, ADR-175 freshness CI gate, `NotImplementedYet` stubs, `t5-scoring`/`t6-recommend`/`t7-explain`/`t8-compare`); `last_updated` 2026-05-11, predating every correction. Decide quarantine (archive + pointer) vs rewrite around the corrected doctrine — a mechanical gate-name removal would break them and leave the rest of the contamination |
| **Update in place — stale but live** | `eef/README.md`; `kg/README.md`; `kg/active/graph-stack.plan.md` (flip landed WS statuses, fix the active/↔current/ link mismatch) | edit |
| **Archive — completed** | `kg/active/graph-resource-factory.plan.md`; `kg/active/misconception-graph-mcp-surface.plan.md`; `kg/active/graph-stack-ws1.6-vocab-prep.md` | move to `archive/completed/` |
| **Park as `future/`, blocked-on-EEF** | `kg/active/nc-knowledge-taxonomy-surface.plan.md`; the `future/oak-kg-*` (iri-traverser, programme-navigator, schema-browser, lesson-graph-surface) + `future/oak-misconceptions-*` (cross-corpus, extended-contexts, substrate-migration, topic-extraction) + `future/cross-source-journeys.plan.md` | mark *"undefined until the first proper graph tool is finished"*; consolidate the 5 misconceptions-* into one |
| **Replace — value** | `eef/future/eef-outcome-evaluation-infrastructure.plan.md` | superseded by the new value-evaluation plan (t6) |
| **Keep — reference/independent** | `eef/reference/*`, `eef/archive/*`; `kg/future/ontology-*` (4), `kg/research/*`, `kg/oak-ontology-graph-opportunities.strategy.md`; `kg/future/extending-graph-support-tooling.plan.md` (the named candidate buffer) | leave |
| **Verify first (t1)** | `kg/active/agent-guidance-consolidation.plan.md`; `kg/current/kg-alignment-audit.execution.plan.md`; `kg/current/kg-integration-quick-wins.plan.md`; `kg/active/open-education-knowledge-surfaces.plan.md` (historical umbrella — likely archive); `kg/current/oak-kg-threads-surface.plan.md` + `kg/current/oak-misconceptions-subgraph-mcp-surface.plan.md` (gate-framed speculative surfaces in the wrong lane — likely park-as-future) | read + assign |

## Judgment calls (owner-surface at execution; recommended verdicts)

1. **Archive the entire superseded gate-1a/1b estate** (moved, never deleted, each with a pointer). *Recommended: yes.*
2. **Park the ~9 speculative graph-surface future plans** with an explicit block-on-EEF condition rather than leaving them reading as live. *Recommended: yes.*
3. **Consolidate the 5 `oak-misconceptions-*` future plans into one** parked plan. *Recommended: yes — they are variations on one undefined-until-EEF idea.*

## Mechanism / acceptance

Per ADR-117 archival: mine any live outcome into permanent docs, move to
`archive/completed/`, add a completed-plans index entry, fix all cross-refs to
point at the archive (clean break, no stubs). Acceptance = t8: no broken links,
READMEs accurate, every archived plan has a pointer, every parked plan states
its block condition, markdownlint + relevant gates green.

## Non-goals

- No source/code changes — this is plan-estate doc work only.
- Do not reopen the rebuild design or the finishing plan's scope.
- Do not touch the source-code docstring reconciliation in files the finishing
  plan rewrites (the finishing plan owns those).
- Do not edit `repo-continuity.md` unilaterally if another agent holds it —
  coordinate.

## Foundation alignment

[`principles.md`](../../../../directives/principles.md) (replace-don't-bridge,
knowledge-preservation, no-moving-targets),
[`never-use-git-to-remove-work`](../../../../rules/never-use-git-to-remove-work.md)
(archive by move, never delete), plan conventions in
[`templates/README.md`](../../../templates/README.md) and the
[`/oak-plan` skill](../../../../skills/plan/SKILL-CANONICAL.md).

## Readiness reviewers

Before READY FOR EXECUTION: `assumptions-expert` (is the archive/park split
proportionate; are any "superseded" plans actually carrying live unique
substance). Run at the fresh session's start, after t1.
