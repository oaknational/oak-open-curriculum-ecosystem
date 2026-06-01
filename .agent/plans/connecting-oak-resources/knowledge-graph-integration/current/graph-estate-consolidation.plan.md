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
    content: "Grounded reading DONE 2026-06-01 (six files read against content, substance-loss lens first); dispositions proposed in the disposition map's 't1 grounded findings' block: agent-guidance-consolidation → update-in-place (live MCP-DX debt, EEF-independent); kg-alignment-audit + kg-integration-quick-wins → keep — independent (NOT EEF-gated); open-education-knowledge-surfaces → archive — superseded; oak-kg-threads-surface + oak-misconceptions-subgraph-mcp-surface → park — blocked-on-EEF (MVP-arc scaffold retired). Remaining gate: assumptions-expert ratification before any file moves. Status pending until ratified."
    status: pending
  - id: t2-archive-superseded
    content: "Archive the superseded-framing plans to archive/completed/ with a supersession pointer to the finishing plan; add completed-plans index entries. NEVER delete (knowledge-preservation)."
    status: pending
  - id: t3-archive-completed
    content: "Archive the genuinely-DONE plans (graph-resource-factory, misconception-graph-mcp-surface, graph-stack-ws1.6-vocab-prep) to archive/completed/ with outcomes + SHAs."
    status: pending
  - id: t4-park-future-blocked
    content: "Park the speculative graph-surface future plans with the precise block condition: wider graph work is undefined until the first proper graph tool (EEF) ships — NOT a technical EEF-gate dependency (oak-kg-threads / oak-misconceptions-subgraph depend technically on graph-stack Inc.1b, whose MVP-arc spine is quarantined). State 'spine scaffold retired' in each. Consolidate the 5 oak-misconceptions-* future plans into one that KEEPS each distinct problem as a named section (do not flatten to a summary). Move nc-knowledge-taxonomy-surface from active/ to future/. At the park move, each header must preserve carry-forward substance with no other home: oak-kg-threads — the inverse-edge query primitive + spine-locked tool names; oak-misconceptions-subgraph — the bounded-traversal contract, fixture-manifest scheme, and _meta legacy-disclosure discipline, with maxResponseTokens=16000 marked retired."
    status: pending
  - id: t5-rewrite-readmes
    content: "Rewrite the knowledge-graph-integration README to the corrected reality (drop five-increment/gate-1a-1b/7-op-polymorphic/recommend-explain-compare framing; fix broken current/<->active/ links; remove the eef-evidence-corpus link in the graph-query-layer row; point to the finishing plan only). The EEF README half is DONE (already one-live-plan frame); t5 is now the KG README only."
    status: pending
  - id: t6-author-value-plan
    content: "Author future/eef-graph-tool-value-evaluation.plan.md (strategic), superseding future/eef-outcome-evaluation-infrastructure.plan.md, evaluating the FINISHED tool's value (structural fidelity; the discovery questions; usefulness vs the other curriculum tools). Promotion trigger: finishing-plan D7 green. ALSO decide the home for the post-completion 'working with graphs' doctrine graduation (old D5): fold into this value plan or a named follow-on."
    status: pending
    depends_on: [t1-verify-unclassified]
  - id: t7-reconcile-references
    content: "Reconcile remaining gate-1a/1b/Inc.3 references across the live .agent estate ONLY (the old DX): oak-misconceptions-eef-cross-corpus-surface.plan.md, graph-stack.plan.md, graph-query-layer references, repo-continuity.md (coordinate, do not edit unilaterally). graph-portfolio-index.md is now quarantined (not a live target). ADR-173 was decontaminated 2026-06-01 (done). The one remaining source-tree Inc.3 (graph-corpus-sdk/README:6) is OUTSIDE this .agent-only sweep — finishing-plan scope; see the residue-position note."
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
>
> **Single current-state, no re-stratification.** This plan holds exactly one
> derived current-state section (§"Current state (verified ground truth)").
> Session hand-offs that affect it land in the `eef` thread record and
> `completed-plans.md`, **never as new dated "Inbound from …" sections here** — a
> plan whose job is to de-stratify the estate must not re-grow a changelog at its
> own head.

## Current state (verified ground truth)

Verified 2026-06-01 against code, ADRs, and git (not plan prose). This section
is the **single derived current-state for the estate**. Session hand-offs that
affect this plan land in the `eef` thread record (and durable outcomes in
`completed-plans.md`), **not as new dated "Inbound from …" sections here** — that
discipline is what stops this consolidation plan from re-growing the stratified
narrative it exists to remove. Re-verify a fact only if a disposition turns on it.

- **The first proper graph tool is not finished.** Its completion is the live
  execution plan
  [`eef-graph-tool-completion.plan.md`](../../../sector-engagement/eef/current/eef-graph-tool-completion.plan.md)
  (D0–D7; impact-led, decision-complete). D0 and D2 are landed; D3 is the next
  deliverable. The wider graph work is **undefined until that tool finishes**
  (owner direction) — so this plan archives/parks the estate around it rather
  than adding documents.
- **The substrate and the typed EEF foundation are built.** `graph-core`,
  `graph-ingest`, `graph-project`, and `graph-corpus-sdk` are on `main`
  (PRs #93/#108/#115/#122; v1.15.0). On this branch (`feat/graph-tooling-tidyup`),
  EEF D2 built the typed raw-corpus foundation in `graph-corpus-sdk/eef-strands`
  (`EefStrand`/`EefStrandId`/`EefStrandById`/`isValidStrandKey` from the `as const`
  corpus; declared/observed vocab domains + divergence record; related-strand
  edges; corpus provenance) and removed the old list-shaped EEF surface + the
  EEF-local graph adapter across three workspaces. The corpus citation surface is
  the source-path table
  ([`eef-d2-source-path-table.md`](../../../sector-engagement/eef/current/eef-d2-source-path-table.md)).
  `OAK_CURRICULUM_MCP_EEF_ENABLED` is a dormant seam awaiting D6.
- **The corrected doctrine is landed in-record.** ADR-038 is generalised to all
  `as const`-known constants; ADR-157/ADR-173 no longer designate an EEF Zod
  loader; ADR-175 is withdrawn and deleted. The EEF-stack decontamination landed
  (validator deleted; `eef/README.md`, `conservation-map.md`, the EEF thread
  banner, `sonar-disposition-policy.md`, `repo-continuity.md` corrected; ledger at
  `eef/current/eef-d0-decontamination-ledger.md`). **The EEF half of t5 is
  therefore done** — `eef/README.md` already reads to the one-live-plan frame, so
  t5 narrows to the `knowledge-graph-integration` README only.
- **The four root graph coordination spines are quarantined**
  (`graph-portfolio-index.md`, `graph-mvp-arc.plan.md`,
  `graph-combinatorial-arc.plan.md`, `feat-mcp-graph-support-foundation-meta.md`)
  to `archive/completed/` with one-line supersession banners; the single
  where-did-they-go record is in `completed-plans.md`. Owner-directed quarantine,
  not rewrite — a rewritten-live spine would be fresh speculative contamination
  while wider graph work is undefined. **Verified:** no live
  `graph_portfolio_index:` / `spine_plan:` frontmatter pointer keys remain, and no
  `parent_plan:` pointer targets the four files; remaining live mentions of the
  spine filenames are de-linked plain-text prose or history/comms (correct).
- **The estate is otherwise mostly superseded framing**: gate-1a/1b, the
  five-increment architecture, the 7-operation polymorphic query layer with
  mandatory projection, the `recommend/explain/compare` tools, and the response
  budget cap — all discarded by the rebuild. Consolidation = archive that framing
  and shrink the estate to a clean minimal set.

**Residue position (verified, point-precise):**

- **Code source comments carry no `gate-1a`/`gate-1b`/`Inc.3` residue** — D2
  deleted the eef-strands files that held it; the two `graph-ingest` comments were
  cleaned (2026-06-01).
- **ADR-173 was decontaminated 2026-06-01** (post-acceptance hygiene amendment):
  the stale pre-promotion sections were cleared (the ADR is Accepted 2026-05-11)
  and the `Inc.3` adapter-sequencing was explicitly retired — the only surviving
  `Inc.3` mention is the dated 2026-05-21 amendment-summary line, now marked
  superseded (history-retained, correct).
- **One source-tree doc surface still carries `Inc.3` framing**:
  `packages/sdks/graph-corpus-sdk/README.md:6` ("adapters following in Increment
  3"). It lives outside `.agent/`, so it is **outside t7's `.agent`-only concept
  sweep** — source-tree scope owned by the finishing plan. `CHANGELOG.md` carries
  one historical `gate-1a` line — generated history, left untouched.

**Live inbound links into the quarantined EEF plans** (t2/t7 — reconcile when
adding supersession pointers): `sdk-and-mcp-enhancements/active/README.md` links
`eef-evidence-corpus.plan.md` as "WS-3", and the `knowledge-graph-integration`
README (the t5 target) links it from the `graph-query-layer` row.

**t7's surviving scope** is the `gate-1a`/`gate-1b`/`Inc.3` **concept** references
inside the contaminated/pending `.agent` files (the openers, `graph-query-layer`,
`gate-1a-delivery-parallel-execution-addendum`, the `future/oak-*` surfaces): they
are de-linked from the quarantined spines but their narratives remain, cleaned
when each file is archived/parked/rewritten under t1–t7.

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
| **Quarantine — DONE 2026-06-01** | `graph-mvp-arc.plan.md`; `graph-portfolio-index.md`; `graph-combinatorial-arc.plan.md`; **`feat-mcp-graph-support-foundation-meta.md`** (branch-scoped, never merged) | Owner-directed quarantine — *not* rewrite: rewrite has no live target while wider graph work is undefined until the EEF tool ships, so a rewritten-live spine would be fresh speculative contamination. All four moved to `archive/completed/` with a one-line supersession banner each; one note in `completed-plans.md`; references removed from the live surviving estate and de-linked to plain text in contaminated/pending files. The deeper gate-1a/1b/Inc.3 **concept** decontamination of those contaminated files remains per their own disposition (t1–t7). See §"Current state (verified ground truth)". |
| **Update in place — stale but live** | `eef/README.md`; `kg/README.md`; `kg/active/graph-stack.plan.md` (flip landed WS statuses, fix the active/↔current/ link mismatch) | edit |
| **Archive — completed** | `kg/active/graph-resource-factory.plan.md`; `kg/active/misconception-graph-mcp-surface.plan.md`; `kg/active/graph-stack-ws1.6-vocab-prep.md` | move to `archive/completed/` |
| **Park as `future/`, blocked-on-EEF** | `kg/active/nc-knowledge-taxonomy-surface.plan.md`; the `future/oak-kg-*` (iri-traverser, programme-navigator, schema-browser, lesson-graph-surface) + `future/oak-misconceptions-*` (cross-corpus, extended-contexts, substrate-migration, topic-extraction) + `future/cross-source-journeys.plan.md` | mark *"undefined until the first proper graph tool is finished"*; consolidate the 5 misconceptions-* into one |
| **Replace — value** | `eef/future/eef-outcome-evaluation-infrastructure.plan.md` | superseded by the new value-evaluation plan (t6) |
| **Keep — reference/independent** | `eef/reference/*`, `eef/archive/*`; `kg/future/ontology-*` (4), `kg/research/*`, `kg/oak-ontology-graph-opportunities.strategy.md`; `kg/future/extending-graph-support-tooling.plan.md` (the named candidate buffer) | leave |
| **t1 — grounded reading done 2026-06-01 (assumptions-expert ratification pending)** | `kg/active/agent-guidance-consolidation.plan.md` → **update-in-place**; `kg/current/kg-alignment-audit.execution.plan.md` + `kg/current/kg-integration-quick-wins.plan.md` → **keep — independent (NOT EEF-gated)**; `kg/active/open-education-knowledge-surfaces.plan.md` → **archive — superseded**; `kg/current/oak-kg-threads-surface.plan.md` + `kg/current/oak-misconceptions-subgraph-mcp-surface.plan.md` → **park — blocked-on-EEF** | per-file: see the grounded findings below |

### t1 grounded findings (2026-06-01) — the substance-loss check, executed

The plan's blanket frame — "archive the superseded estate, park the rest
blocked-on-EEF" — is correct for the MVP-arc slices and the historical umbrella,
but **three of the six t1 files carry live, EEF-independent substance and must
not be archived or parked-blocked-on-EEF**. That mis-categorisation is exactly
the failure the `assumptions-expert` gate exists to catch; the grounded read
below is its input, not a substitute for it.

- **`agent-guidance-consolidation.plan.md` → update-in-place (keep live).** Live
  MCP-DX debt about the **existing** tool surface (search/browse/explore/fetch/
  misconception guidance is scattered, partly stale, not DRY → one generated
  `tool-catalogue.ts`). EEF-independent. Only the stale `recommend`/`compare`
  workflow refs and the `eef-evidence-corpus` sibling link need scrubbing; its
  `parent_plan` pointer to `open-education-knowledge-surfaces` needs re-pointing
  when that umbrella is archived. **Not** archive, **not** park-on-EEF.
- **`kg-alignment-audit.execution.plan.md` + `kg-integration-quick-wins.plan.md`
  → keep — independent.** Ontology↔search alignment and Neo4j/ES integration
  quick wins. Uncontaminated by gate-1a/MVP-arc framing; orthogonal to the EEF
  evidence tool. Their promotion trigger is the KG README's existing
  "Direct ontology work" trigger, **not** the EEF tool finishing. Parking them
  blocked-on-EEF would be a category error that loses real, independent work.
- **`open-education-knowledge-surfaces.plan.md` → archive — superseded.**
  Historical multi-source umbrella: WS-0/1/2 done (committed `1eb302e8`), WS-3
  (EEF recommend-tool) superseded by the rebuild, WS-4/5/6 owned by their own
  plans. Re-point the child plans (`agent-guidance-consolidation`,
  `nc-knowledge-taxonomy-surface`, `graph-resource-factory`,
  `misconception-graph-mcp-surface`) before/at archival.
- **`oak-kg-threads-surface.plan.md` + `oak-misconceptions-subgraph-mcp-surface.plan.md`
  → park.** The underlying surface ideas (Oak KG Threads resource/tool; bounded
  misconception sub-graph extraction) are live future value, but each is an
  orphaned slice of the **quarantined** MVP-arc spine. **Precise block condition
  (assumptions-expert):** these are *not* technically EEF-gated — their own
  `Dependencies` name `graph-stack Inc.1b` (not the EEF gates) as the substrate
  floor. The block is "wider graph work is undefined until the first proper graph
  tool (EEF) ships, and the MVP-arc spine that scaffolded these slices is
  quarantined"; revisit after finishing-plan D7. The
  `spine_slice`/`gate-2`/`gate-3a`/`Inc.1b`/`Inc.3` scaffold — and, in the
  misconceptions plan, the discarded `maxResponseTokens = 16000` response-budget
  cap — are retired framing. **Substance to preserve at the park move** (no other
  home — write into each parked header, do not defer): for `oak-kg-threads`, the
  inverse-edge query primitive insight + the spine-locked tool names
  (`curriculum://oak-kg-threads`, `oak-kg-get-thread-content`); for
  `oak-misconceptions-subgraph`, the bounded-traversal contract, the 20-context
  fixture-manifest selection scheme, and the `_meta` legacy-substrate disclosure
  discipline — all stripped of the retired token-budget framing.

## Judgment calls (owner-surface at execution; recommended verdicts)

1. **Archive the entire superseded gate-1a/1b estate** (moved, never deleted, each with a pointer). *Recommended: yes.*
2. **Park the ~9 speculative graph-surface future plans** with an explicit block-on-EEF condition rather than leaving them reading as live. *Recommended: yes.*
3. **Consolidate the 5 `oak-misconceptions-*` future plans into one** parked plan. *Recommended: yes, with a condition (assumptions-expert): the consolidated plan must KEEP each distinct problem as a named section (cross-corpus composition, substrate migration, topic extraction, extended contexts, bounded sub-graph extraction) — they are variations on one undefined-until-EEF theme but not one problem. A single summary paragraph that loses the bounded-extraction contract is the failure mode to avoid.*

## Execution sequence

t1's grounded reading is **done** (2026-06-01 — all six files read against their
content, not the pre-stated verdicts; findings in the disposition map's "t1
grounded findings" block). No file has moved — all six still sit in their
original lanes. `assumptions-expert` ratification is the **only remaining gate**
before the dispositions are confirmed and t2+ proceed. Execution is strictly
ordered:

1. **Decide — `t1` + readiness review (first, always).** The grounded reading is
   complete; the **substance-loss question — does any "superseded" file actually
   carry live unique substance? — is the primary lens, and it already changed the
   answer**: `kg-alignment-audit`, `kg-integration-quick-wins`, and
   `agent-guidance-consolidation` are independent live work, **not** archive/park
   fodder. Run `assumptions-expert` on the resulting archive/park/keep split with
   that substance question first; only then do `open-education-knowledge-surfaces`
   → archive and `oak-kg-threads-surface` / `oak-misconceptions-subgraph-mcp-surface`
   → park enter t2/t4 scope. This step decision-completes the rest and commits to
   nothing downstream.
2. **Remove + restore (one unit) — `t2` + `t3` + `t4`, then `t5` + `t7`.**
   Archive superseded (t2) and completed (t3) plans; park the speculative future
   plans blocked-on-EEF and consolidate the five `oak-misconceptions-*` into one
   (t4); rewrite the `knowledge-graph-integration` README (t5) and sweep the
   surviving gate-1a/1b/Inc.3 concept references across the `.agent` estate (t7).
   These ship as one unit so the estate never carries a dangling pointer between
   an archived file and its referrers.
3. **Verify — scoped `t8`.** Confirm the estate reads clean for steps 1–2: no
   broken links, READMEs accurate, every archived plan has a pointer, every
   parked plan states its block condition, markdownlint + relevant gates green.

**Deferred until finishing-plan D7 is green:** `t6` (the value-evaluation plan,
promotion trigger = D7 green) and t8's t6/value-plan acceptance criterion. These
are the only graph-estate items gated on the EEF tool finishing — t1–t5 and t7
proceed independently of it.

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

Before READY FOR EXECUTION: `assumptions-expert`, briefed substance-first —
**are any "superseded" plans actually carrying live unique substance** (the t1
grounded reading says three are: `kg-alignment-audit`, `kg-integration-quick-wins`,
`agent-guidance-consolidation`), and only then: is the archive/park/keep split
proportionate. Run after t1's grounded reading (now done) and before any file
moves.
