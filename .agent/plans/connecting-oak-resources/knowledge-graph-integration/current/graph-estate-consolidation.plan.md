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
    content: "Grounded reading DONE 2026-06-01 (six files read against content, substance-loss lens first); dispositions proposed in the disposition map's 't1 grounded findings' block: agent-guidance-consolidation → update-in-place (live MCP-DX debt, EEF-independent); kg-alignment-audit + kg-integration-quick-wins → keep — independent (NOT EEF-gated); open-education-knowledge-surfaces → archive — superseded; oak-kg-threads-surface + oak-misconceptions-subgraph-mcp-surface → park — blocked-on-EEF (MVP-arc scaffold retired). assumptions-expert ratified READY 2026-06-01 (agrees 6/6, no false-keep; two park-header substance-preservation conditions apply at the t4 move). Decision complete; the file moves are t2–t4."
    status: completed
  - id: t2-archive-superseded
    content: "Archive the superseded-framing plans to archive/completed/ with a supersession pointer to the finishing plan; add completed-plans index entries. NEVER delete (knowledge-preservation). DONE 2026-06-02: seven kg files moved with banners + status flips; graph-tooling-rebuild verified already-bannered in eef/archive (no relocation; missing completed-plans entry added); live referrers de-linked across nine collections; orphaned parent_plan pointers removed from surviving children."
    status: completed
  - id: t3-archive-completed
    content: "Archive the genuinely-DONE plans (graph-resource-factory, misconception-graph-mcp-surface, graph-stack-ws1.6-vocab-prep) to archive/completed/ with outcomes + SHAs. DONE 2026-06-02: all three moved with outcome banners (1eb302e8 evidence) + per-plan completed-plans entries; historical citations repointed to archive per ADR-117 completed-plan convention."
    status: completed
  - id: t4-park-future-blocked
    content: "Park the speculative graph-surface future plans with the precise block condition: wider graph work is undefined until the first proper graph tool (EEF) ships — NOT a technical EEF-gate dependency (oak-kg-threads / oak-misconceptions-subgraph depend technically on graph-stack Inc.1b, whose MVP-arc spine is quarantined). State 'spine scaffold retired' in each. Consolidate the four oak-misconceptions feature plans (cross-corpus composition, topic extraction, extended contexts, bounded sub-graph extraction) into one that KEEPS each distinct problem as a named section (do not flatten to a summary); oak-misconceptions-substrate-migration is excluded — it folds into the single all-tools substrate-migration plan (Judgement call 4). Move nc-knowledge-taxonomy-surface from active/ to future/. At the park move, each header must preserve carry-forward substance with no other home: oak-kg-threads — the inverse-edge query primitive + spine-locked tool names; oak-misconceptions-subgraph — the bounded-traversal contract, fixture-manifest scheme, and _meta legacy-disclosure discipline, with maxResponseTokens=16000 marked retired. DONE 2026-06-02: both assumptions-expert park-header conditions honoured — four misconception feature plans consolidated into future/oak-misconceptions-graph-features.plan.md with each problem a named section (bounded-traversal contract, fixture-manifest scheme, _meta discipline preserved in §1; maxResponseTokens marked retired); oak-kg-threads parked with inverse-edge + spine-locked-names header; nc-knowledge-taxonomy parked to future/ (demand tripwire retained); five remaining future surfaces given block-condition headers; oak-misconceptions-substrate-migration untouched bar a parent_plan re-point to the consolidated plan."
    status: completed
  - id: t5-rewrite-readmes
    content: "Rewrite the knowledge-graph-integration README to the corrected reality (drop five-increment/gate-1a-1b/7-op-polymorphic/recommend-explain-compare framing; fix broken current/<->active/ links; remove the eef-evidence-corpus link in the graph-query-layer row; point to the finishing plan only). The EEF README half is DONE (already one-live-plan frame); t5 is now the KG README only. DONE 2026-06-02: README rewritten to the post-move estate — Live Work + Parked Surfaces sections, retired framing removed, all links resolve."
    status: completed
  - id: t6-author-value-plan
    content: "Author future/eef-graph-tool-value-evaluation.plan.md (strategic), superseding future/eef-outcome-evaluation-infrastructure.plan.md, evaluating the FINISHED tool's value (structural fidelity; the discovery questions; usefulness vs the other curriculum tools). Promotion trigger: finishing-plan D7 green. ALSO decide the home for the post-completion 'working with graphs' doctrine graduation (old D5): fold into this value plan or a named follow-on."
    status: pending
    depends_on: [t1-verify-unclassified]
  - id: t7-reconcile-references
    content: "Reconcile remaining gate-1a/1b/Inc.3 references across the live .agent estate ONLY (the old DX): oak-misconceptions-eef-cross-corpus-surface.plan.md, graph-stack.plan.md, graph-query-layer references, repo-continuity.md (coordinate, do not edit unilaterally). graph-portfolio-index.md is now quarantined (not a live target). ADR-173 was decontaminated 2026-06-01 (done). The source tree is clear: the graph-corpus-sdk README + package.json description were brought current 2026-06-02 (see the residue-position note). DONE 2026-06-02: cross-corpus plan cleaned via the t4 consolidation; graph-stack re-framed (sequencing banner naming Inc.N/gate labels retired per ADR-173, landed WS statuses flipped incl. WS4.1 scaffold + WS5 closure, stale PR-108 blocker + quarantined meta-plan navigation removed, archived-sibling refs de-linked); repo-continuity verified zero-edit (all six token instances are decontamination-record framing — no coordination with the parallel claim holder needed); four eef/archive files with stale status:current frontmatter corrected to superseded; agent-guidance-consolidation scrubbed (recommend/compare workflows, eef-toolkit:// resource rows, orphaned parent_plan)."
    status: completed
    depends_on: [t2-archive-superseded, t5-rewrite-readmes]
  - id: t8-verify-clean
    content: "Verify the estate reads clean: no broken links (rg link-check), READMEs accurate, every archived plan has a pointer + index entry, every parked plan states its block condition; markdownlint + relevant gates green."
    status: pending
    depends_on: [t2-archive-superseded, t3-archive-completed, t4-park-future-blocked, t5-rewrite-readmes, t6-author-value-plan, t7-reconcile-references]
  - id: t9-deep-review-cleanup
    content: "2026-06-04 deep-review-driven cleanup (Tempestuous Vaulting Gust / d61788). Archived 8 superseded/complete plans — graph-migration-plan-overhaul, ontology-repo-fresh-perspective-review → archive/completed/; kg-alignment-audit, kg-integration-quick-wins, oak-curriculum-ontology-workspace-reassessment, ontology-integration-strategy, direct-ontology-use-and-graph-serving-prototypes, oak-ontology-graph-opportunities.strategy → archive/superseded/ — and consolidated the 4 empty oak-kg surface stubs (lesson-graph, programme-navigator, schema-browser, iri-traverser) into a README backlog. SUPERSEDES t1's keep-disposition for kg-alignment-audit + kg-integration-quick-wins: the deep review answered their core join-key questions (thread join works on content-slug both sides; lesson/unit identity is disjoint with no public crosswalk — verified against the ontology, the bulk export, and the OpenAPI spec), so the audit is no longer a live precursor. README reindexed; ADR-157 updated with the five-prefix source convention (onto-/bulk-/oakapi-/oaksearch-/eef-), migrated incrementally. Synthesis: ../../../reports/oak-kg-ontology-deep-review-2026-06-04.md."
    status: completed
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
  (D0–D7; impact-led, decision-complete). D0, D1, and D2 are complete; D3 is the
  next deliverable. The wider graph work is **undefined until that tool finishes**
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
- **Moving the existing graph tools onto the new substrate is one coupled,
  cross-thread system this plan must own** (verified 2026-06-02). Replatforming
  the existing bulk-derived graph tools — misconception, prior-knowledge, and
  thread-progressions — onto `graph-corpus-sdk` is graph-stack work
  ([`graph-stack.plan.md`](../active/graph-stack.plan.md), the corpus-adapter
  build), sequenced by consumer-readiness, not a numbered increment (ADR-173 — the
  increment-number framing graph-stack still carries is a t7 decontamination
  target, not a live label to reuse). That ownership was **fragmented and
  gapped**: **misconception** had a dedicated surface re-platform plan
  (`future/oak-misconceptions-substrate-migration.plan.md`, since absorbed by
  the unified plan and archived);
  **prerequisite/prior-knowledge and thread-progressions had no surface
  re-platform plan at all** — those tool re-wraps were unowned. Crossing into the
  `eef` thread: the EEF value path
  ([`eef-graph-tool-completion.plan.md`](../../../sector-engagement/eef/current/eef-graph-tool-completion.plan.md)
  D7) is proven against the **live** `get-misconception-graph` /
  `get-prior-knowledge-graph` tools, so replacing them triggers EEF re-validation,
  owned by
  [`eef/future/eef-revalidate-on-new-graph-tools.plan.md`](../../../sector-engagement/eef/future/eef-revalidate-on-new-graph-tools.plan.md).
  Net: scattered, gapped migration ownership upstream of a single EEF gate. This
  plan therefore takes ownership of unifying it into **one** substrate-migration
  plan covering every existing graph tool (End goal; Judgement call 4), so no tool
  is orphaned and the EEF re-validation gate has one upstream.

**Residue position (verified, point-precise):**

- **Code source comments and source-tree docs carry no `gate-1a`/`gate-1b`/
  `Inc.3` residue** — D2 deleted the eef-strands files that held it; the two
  `graph-ingest` comments were cleaned (2026-06-01); the `graph-corpus-sdk`
  README and `package.json` description were brought current (2026-06-02).
  `CHANGELOG.md` carries one historical `gate-1a` line — generated history,
  left untouched.
- **ADR-173 was decontaminated 2026-06-01** (post-acceptance hygiene amendment):
  the stale pre-promotion sections were cleared (the ADR is Accepted 2026-05-11)
  and the `Inc.3` adapter-sequencing was explicitly retired — the only surviving
  `Inc.3` mention is the dated 2026-05-21 amendment-summary line, now marked
  superseded (history-retained, correct).

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
pointers, the speculative future surfaces parked with an explicit block-on-EEF
condition, and a **single substrate-migration plan that owns moving every
existing graph tool onto the new `graph-corpus-sdk` substrate** (no per-tool
scatter, no orphaned tool) — so any agent opening the estate sees the true state
in one read.

## Disposition map (proposal carried forward; confirm at execution)

| Disposition | Files | Action |
|---|---|---|
| **Archive — superseded framing** | `eef/archive/graph-tooling-rebuild.plan.md` (quarantined 2026-05-30); `kg/current/graph-query-layer.plan.md` (old 7-op layer → S2); `kg/current/gate-1a-delivery-parallel-execution-addendum.plan.md`; `kg/current/2026-05-08-graph-mvp-arc-specialist-review-opener.md`; `kg/current/2026-05-08-pr102-graph-decision-complete-closeout.plan.md`; `kg/current/2026-05-11-graph-execution-prep-opener.md`; `kg/current/pr-108-sonar-live-issues-2026-05-24.md` | move to `archive/completed/` + supersession pointer + index entry |
| **Quarantine — DONE 2026-06-01** | `graph-mvp-arc.plan.md`; `graph-portfolio-index.md`; `graph-combinatorial-arc.plan.md`; **`feat-mcp-graph-support-foundation-meta.md`** (branch-scoped navigation index; its branch merged via PR #108, retiring it) | Owner-directed quarantine — *not* rewrite: rewrite has no live target while wider graph work is undefined until the EEF tool ships, so a rewritten-live spine would be fresh speculative contamination. All four moved to `archive/completed/` with a one-line supersession banner each; one note in `completed-plans.md`; references removed from the live surviving estate and de-linked to plain text in contaminated/pending files. The deeper gate-1a/1b/Inc.3 **concept** decontamination of those contaminated files remains per their own disposition (t1–t7). See §"Current state (verified ground truth)". |
| **Update in place — stale but live** | `eef/README.md`; `kg/README.md`; `kg/active/graph-stack.plan.md` (flip landed WS statuses, fix the active/↔current/ link mismatch, and scrub the retired increment-number + gate framing per t7 — graph-stack is the heaviest remaining carrier, and its labels must not be reused elsewhere) | edit |
| **Archive — completed** | `kg/active/graph-resource-factory.plan.md`; `kg/active/misconception-graph-mcp-surface.plan.md`; `kg/active/graph-stack-ws1.6-vocab-prep.md` | move to `archive/completed/` |
| **Park as `future/`, blocked-on-EEF** | `kg/active/nc-knowledge-taxonomy-surface.plan.md`; the `future/oak-kg-*` (iri-traverser, programme-navigator, schema-browser, lesson-graph-surface) + `future/oak-misconceptions-*` (cross-corpus, extended-contexts, topic-extraction) + `future/cross-source-journeys.plan.md` | mark *"undefined until the first proper graph tool is finished"*; consolidate the four misconceptions feature plans (incl. the parked bounded-sub-graph plan) into one; `oak-misconceptions-substrate-migration` folds into the Judgement-call-4 unified migration plan |
| **Replace — value** | `eef/future/eef-outcome-evaluation-infrastructure.plan.md` | superseded by the new value-evaluation plan (t6) |
| **Keep — reference/independent** | `eef/reference/*`, `eef/archive/*`; `kg/future/ontology-*` (4), `kg/research/*`, `kg/oak-ontology-graph-opportunities.strategy.md`; `kg/future/extending-graph-support-tooling.plan.md` (the named candidate buffer) | leave |
| **t1 — DONE 2026-06-01 (grounded reading + assumptions-expert ratified READY)** | `kg/active/agent-guidance-consolidation.plan.md` → **update-in-place**; `kg/current/kg-alignment-audit.execution.plan.md` + `kg/current/kg-integration-quick-wins.plan.md` → **keep — independent (NOT EEF-gated)**; `kg/active/open-education-knowledge-surfaces.plan.md` → **archive — superseded**; `kg/current/oak-kg-threads-surface.plan.md` + `kg/current/oak-misconceptions-subgraph-mcp-surface.plan.md` → **park — blocked-on-EEF** | per-file: see the grounded findings below |

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

## Judgement calls (owner-surface at execution; recommended verdicts)

1. **Archive the entire superseded gate-1a/1b estate** (moved, never deleted, each with a pointer). *Recommended: yes.*
2. **Park the ~9 speculative graph-surface future plans** with an explicit block-on-EEF condition rather than leaving them reading as live. *Recommended: yes.*
3. **Consolidate the four `oak-misconceptions-*` feature plans into one** parked plan. *Recommended: yes, with a condition (assumptions-expert): the consolidated plan must KEEP each distinct problem as a named section (cross-corpus composition, substrate migration, topic extraction, extended contexts, bounded sub-graph extraction) — they are variations on one undefined-until-EEF theme but not one problem. A single summary paragraph that loses the bounded-extraction contract is the failure mode to avoid. Scope correction (per the multi-way relationship in §Current state): the misconception **substrate-migration** is migration work, not a feature idea — it belongs in the single all-tools substrate-migration plan (Judgement call 4), not in this misconceptions-feature consolidation. So this consolidation covers the four feature plans (cross-corpus composition, topic extraction, extended contexts, bounded sub-graph extraction); substrate-migration moves to Judgement call 4.*
4. **Own the unification of graph-tool substrate migration into ONE plan.** Ensure a single substrate-migration plan moves *all* existing graph tools (misconception, prior-knowledge, thread-progressions; exact set pinned by that plan) onto the new `graph-corpus-sdk` substrate — absorbing the misconception substrate-migration plan, giving prerequisite/prior-knowledge and thread-progressions a home they currently lack, and standing as the single upstream of the EEF re-validation gate ([`eef/future/eef-revalidate-on-new-graph-tools.plan.md`](../../../sector-engagement/eef/future/eef-revalidate-on-new-graph-tools.plan.md)). *Recommended: yes — scattered, gapped per-tool migration ownership is the failure mode; one plan stops an orphaned tool silently breaking the EEF value path. Migration is sequenced by consumer-readiness (ADR-173), not a retired increment number; the plan may be parked until substrate + finishing-plan readiness allow, but its ownership of all tools is established now.* **Owner-ratified scope (2026-06-02):** per tool, the migration is ONE replacement unit — the data/type re-emission (the generated data becomes its own type authority, replacing today's loose `data.json` + hand-written-interface shape), the tool rewrite onto the substrate, and that tool's projection-derived `outputSchema` land together. The existing tools are untouched before their migration: they work today, and the EEF value proof (finishing-plan D7) runs on them as-is — *scaling* that value is what the migration owns. Thread-progressions data is sequence-shaped (ordered unit sequences per thread; a latent thread↔unit bipartite structure exists in the bulk source); the migration plan decides its substrate shape without forcing node/edge graph form onto it. **Authored 2026-06-02** (Galactic Glowing Prism): [`future/graph-tools-value-redesign.plan.md`](../future/graph-tools-value-redesign.plan.md) — parked per this call's allowance with promotion trigger EEF D6 + D7; `oak-misconceptions-substrate-migration` absorbed by re-grounding and archived; the `graph-tool-output-schemas` design content folded in and its file archived.

## Execution sequence

**t1 (decide) is DONE (2026-06-01)** — grounded reading complete and
`assumptions-expert` ratified READY. No file has moved; all six still sit in their
original lanes, so the *execution* of the dispositions (t2–t5, t7) has not begun.
Owner direction (2026-06-02): EEF, graph-estate consolidation, graph
enhancements, and the substrate migration are ONE thread, and this plan's
decontamination + consolidation execute FIRST — the t2–t5/t7/t8 execution unit
precedes EEF D3+ and all other graph work, preceded only by the deep
contamination scan of the 2026-06-02 session outputs (the standing mandate in
the `eef` thread record). Execution is strictly ordered:

1. ~~**Decide — `t1` + readiness review.**~~ **DONE 2026-06-01.** The grounded
   reading ran the **substance-loss question — does any "superseded" file actually
   carry live unique substance? — as the primary lens, and it changed the answer**:
   `kg-alignment-audit`, `kg-integration-quick-wins`, and
   `agent-guidance-consolidation` are independent live work, **not** archive/park
   fodder. `assumptions-expert` ratified READY (agrees 6/6, no false-keep), with
   two park-header substance-preservation conditions to honour at the t4 move.
   `open-education-knowledge-surfaces` → archive and `oak-kg-threads-surface` /
   `oak-misconceptions-subgraph-mcp-surface` → park are confirmed.
2. **Remove + restore (one unit) — `t2` + `t3` + `t4`, then `t5` + `t7`.**
   Archive superseded (t2) and completed (t3) plans; park the speculative future
   plans blocked-on-EEF and consolidate the four `oak-misconceptions-*` feature
   plans into one (t4; `oak-misconceptions-substrate-migration` folds into the
   Judgement-call-4 unified migration plan instead); rewrite the
   `knowledge-graph-integration` README (t5) and sweep the
   surviving gate-1a/1b/Inc.3 concept references across the `.agent` estate (t7).
   These ship as one unit so the estate never carries a dangling pointer between
   an archived file and its referrers.
3. **Verify — scoped `t8`.** Confirm the estate reads clean for steps 1–2: no
   broken links, READMEs accurate, every archived plan has a pointer, every
   parked plan states its block condition, markdownlint + relevant gates green.
   **Scoped verification PASSED 2026-06-02** (the `t8` todo stays `pending` —
   its full acceptance includes the D7-gated t6/value-plan criterion): link
   check over both collections' live lanes + `completed-plans.md` + the
   touched cross-collection indexes returned zero broken links (including 14
   pre-existing path-depth breaks fixed in passing); the retired-token sweep
   over the live kg lanes returned only sanctioned hits (this plan's own
   decontamination vocabulary, naming-as-retired park banners, and the
   untouched Judgement-call-4 fold-in target); every archived plan carries a
   banner + index entry; every parked plan states its block condition;
   markdownlint + prettier green. Reviewed in real time by docs-adr-expert
   (findings remediated: README link depths, parked-claim qualification,
   index-format consistency) and an adversarial dangling-pointer hunt
   (24 confirmed misses remediated by de-link; two deferred — they sit in the
   `agentic-engineering-enhancements` thread record held under a parallel
   agent's active claim).

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

`assumptions-expert` **ran 2026-06-01 and returned READY** (briefed
substance-first — **do any "superseded" plans carry live unique substance**:
yes, three do — `kg-alignment-audit`, `kg-integration-quick-wins`,
`agent-guidance-consolidation` — keep/update-in-place, not archive/park; the
archive/park split for the other three is proportionate). Two conditions to honour
at the **t4 park move** (header-authoring at move time, not new work): (1) the
consolidated `oak-misconceptions-*` plan keeps each distinct problem as a named
section; (2) the `oak-kg-threads` / `oak-misconceptions-subgraph` parked headers
preserve their carry-forward substance (inverse-edge primitive + spine-locked
names; bounded-traversal contract + `_meta` discipline, `maxResponseTokens=16000`
marked retired). No further readiness review is required before the t2–t5/t7
execution unit.
