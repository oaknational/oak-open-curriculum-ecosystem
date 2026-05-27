# Next-Session Record — `eef` thread

**Last refreshed**: 2026-05-27 (Starless Prowling Mask / `claude` /
claude-opus-4-7 / `13c7d5` — Definition of Delivery doctrine + EEF
delivery-restructure LANDED; the gate-1a whole-graph approach was RETRACTED and
selection restored; next = increments B–H per the meta-plan).

## Session 2026-05-27 (late) — Definition of Delivery + restructure (Starless Prowling Mask / `13c7d5`)

**Landed (`feat/graph-foundations`):** Increment A — Definition of Delivery
doctrine (`27956bb6`: directive `definition-of-delivery.md` + PDR-085 +
indexes); meta-plan into repo + `eef-first-feature` gate-1a contract superseded
(`a60b51ce`); forward restructure retracting false-delivery claims across the
EEF plan estate (`cc3fad3c`); handoff (`8217082a`, refreshed `89ea5ce0`).

**The frame changed:** the gate-1a "whole-graph" approach (flagged below by
Galactic for owner discussion) was RETRACTED. Sub-graph SELECTION (seed
selection + projection in the explore tool, under a 10k output budget) was
always a gate-1a requirement and is restored; the scoring engine + recommend/
explain/compare tools stay gate-1b. PR #121 as-is (whole-graph, no flag, no
co-registered prompt) is NOT mergeable — it is the basis for increment F.

**Resume here (fresh session):** read the handoff
`.agent/state/collaboration/handoffs/2026-05-27-starless-eef-restructure-handoff.md`,
then the owning meta-plan
`.agent/plans/sector-engagement/eef/current/eef-delivery-restructure.plan.md`.
Next = increments B → C → D → E → F → G → H. Branch coordination: doctrine +
plans on `feat/graph-foundations`; EEF code in the `oak-wt-eef` worktree
(`feat/eef-explore-evidence`).

## Session 2026-05-27 — value-PR review + PR #121 open (Galactic Dancing Constellation / `7efeec`)

**Role**: reviewer (peer to Starless Prowling Mask / `13c7d5`, who drove
`oak-wt-eef`). n=2 worktree-per-agent, ARC AnGels coordination channel.

**Landed**: the EEF gate-1a value-PR is **OPEN as PR #121**
(`feat/eef-explore-evidence` → main, 7 commits): type relocation → adapter →
loader/freshness → substrate hardening → `eef-explore-evidence-for-context`
tool + universal-tools wire-up + ADR-123. Each commit reviewed in-cycle; a full
PR-boundary panel (mcp-expert + security-expert + type-expert + test-expert) on
commit 4 returned **SOUND**, all findings verified against the real repo before
relaying (one betty false-positive rejected: `by_phase.impact_months` is
preserved in the open `school_context_relevance` record). Register ledger lives
in the PR #121 body.

**Key design decision (peer-settled, owner-flagged)**: gate-1a returns the
**whole connected EEF graph**; the model selects contextual fit; server-side
narrowing is deferred to the gate-1b t5 ranking engine. Grounded against the
corpus: focus-enum→tag mapping is mostly empty and only 16/30 strands carry a
phase tag, so phase-narrowing would suppress ~14 phase-general strands. Seed
ids exposed via `loadEefCorpus → { view, strandIds }` as removable gate-1a
scaffolding (swaps to `enumerateNodes()` when Inc.3 un-stubs it). Open for owner
discussion — see [`open-questions.md` Q-001](../open-questions.md).

**Next safe step**: owner-gated — (1) the whole-graph semantics discussion
(Q-001); (2) merge PR #121 to main. Named follow-ons in the PR body: F3
`schemaHash`=schema_version (gate-1b refresh-script), telemetry app-wiring.

**Evidence**: PR #121; commits on `feat/eef-explore-evidence`
(`a6e8efc7`..`49317312`); `pnpm check` green (exit 0) at handoff. Adjacent: the
`feat/graph-foundations` rebase-without-force-push divergence was diagnosed and
resolved (owner force-with-lease; trees were byte-identical); `oak-wt-cure`
worktree + merged branch removed; stray `/tmp` worktree pruned.

## Session 2026-05-27 — value-PR coordination state (Foamy Lapping Harbour / `019e68`)

**Session boundary**: owner asked to commit paused agent files and then merge
main. The EEF contribution in this shared tree was documentation and
coordination-state only; source implementation for the value PR remained in
the separate EEF worktree lane.

**Landed**:

- `544b2f4e` — `docs(eef): record value-pr coordination state`.
- Captured value-PR coordination artefacts:
  - `eef-value-pr-review-register.md`
  - `eef-value-path-reflection-2026-05-27.md`
  - `please-do-a-deep-mighty-peach.plan.md` corrections
  - comms-method comparison report and README update
  - EEF PR1 sidebar backup and collaboration-state claim closure.

**Evidence**:

- Full pre-commit hook passed 90/90 turbo tasks for the commit.
- Later same-session merge of `origin/main` landed at `3c136e9d`; focused
  agent-tools type-check, lint, and tests stayed green after the merge.

**Current state**: EEF remains the active product thread. The value-PR shape is
the owner-approved teacher-value slice: boundary/type relocation, WS4.5
adapter, loader/freshness, and EEF explore tool, with the coordination register
recording review findings and ownership.

**Next safe step**: continue the actual EEF value-PR implementation in the
dedicated EEF worktree/branch lane; use the review register and corrected
`please-do-a-deep-mighty-peach.plan.md` as coordination evidence rather than
reconstructing the plan from older stale 4-PR prose.

**Previous refresh**: 2026-05-23 (Secret Vanishing Wisp / `claude` /
claude-opus-4-7 / `981cbe` first-out closeout-authored; Sparking Melting
Magma / `claude` / claude-opus-4-7 / `4cdb53` committed under owner-directed
overall-closeout-authority handoff at 2026-05-23 06:54Z — first-out
closeout of the 2026-05-22 → 2026-05-23 multi-agent gate-1a substrate-floor
team session; synthesises **19 commits across 6 active agents over ~10
hours**; Round 1+2 substrate floor **effectively complete** — WS4.1 landed
at `3241893d` under Stormbound Spiralling Breeze's owner-directed
ownership-override).

---

## Session 2026-05-25 — PR-0 plan-freshness pass (Stormy Surfing Dock / `2a7b65`)

**Solo session** (no peer collaboration; bootstrap fast-path: no other
agents present in active-claims at session open). PR-0 of the 4-PR
gate-1a closure sequence executed end-to-end and paused for owner
direction per the explicit scope instruction.

**Substantive output**: drift A–I plus the verified `_meta.attribution`
canonical-field corrections applied across three plan files:

- `.agent/plans/sector-engagement/eef/current/eef-first-feature.plan.md`
  — ff1 → completed (skip per 2026-05-23 owner direction); ff3 → completed
  with PR #114 SHA `77fcf746`; ff4 stays pending but content updated with
  partial-progress record (5 of 7 full + partial breakdown corrected from
  prior 8 + 6 framing); ff6 content corrected (`_meta.attribution`,
  not `_meta.source`); Status/Last-Updated/Branch/Substrate-dep header
  refreshed (branch ref corrected to
  `feat/education-evidence-foundational-graphs-take2`); ADR-157 Proposed
  status caveat added; PR-#108 hard-gate section compressed to one
  historical block citing merge SHAs `2462952a` and `77fcf746`; broken
  ADR-175 + ADR-179 link paths corrected (the actual filenames are
  `175-external-evidence-corpus-freshness-governance.md` and
  `179-transport-agnostic-graph-substrate.md`); pre-existing substrate-leak
  in `types.ts:64-219` documented as Drift I with PR-1 healing pointer.
- `.agent/plans/connecting-oak-resources/knowledge-graph-integration/active/graph-stack.plan.md`
  — WS4.4 + WS4.5 status: pending → completed with PR #114 SHA in YAML
  comments (verified by directory listing of substrate workspaces).
- `.agent/memory/operational/threads/eef.next-session.md` — this entry.

**Critical assessment performed before any plan-file edit**: five
concurrent specialist verdicts (architecture-expert-betty + -fred +
-wilma + assumptions-expert + test-expert) reviewed an initial 6-PR
sketch. Key verdicts I verified by direct ADR + corpus-plan read before
absorbing:

- Fred CRITICAL #1 (loader belongs in `graph-corpus-sdk`) — CONFIRMED
  against ADR-173:50.
- Fred CRITICAL #2 (freshness vitest insufficient) — PARTIALLY CONFIRMED
  against ADR-175:40-46; the ADR mandates a **plan-promotion gate**, not
  per-PR/per-release CI. Scope softened to: `pnpm freshness:check`
  script + extended unit test + plan-promotion-checklist documentation.
  Scheduled CI workflow is optional excellence, not ADR-mandated.
- Test-expert `_meta.attribution = EEF_ATTRIBUTION` correction — CONFIRMED
  against corpus plan line 66. Propagated through every plan reference.
- Assumptions 3-PR compression argument — REJECTED via direct
  architectural-identity test; 4-PR shape (PR-0 freshness + PR-1
  boundary discipline + PR-2 surface + PR-3 closeout) each maps to one
  identity. PR-0 hygiene argument defended on stale-plan risk grounds.
- Wilma contract-coherence "single best change" — REVISED placement from
  PR-3 closeout to PR-2 cross-cutting reviewer (architecture-expert-betty)
  so mismatch surfaces while PR-2 is still amendable, not after merge.

The full 4-PR delivery sequence with verified ADR citations + critical
assessment is at
`../../../plans/sector-engagement/eef/current/please-do-a-deep-mighty-peach.plan.md`.

**Outstanding state (next-session pickup)**:

- **PR-0 landed and paused** — owner direction this session was PR-0
  only; subsequent PRs trigger on explicit owner extension or new session.
- **PR-1 (boundary discipline)** is the immediate next executable unit:
  relocate corpus-substrate types from
  `oak-curriculum-sdk/src/mcp/evidence-corpus/types.ts:64-219` →
  `graph-corpus-sdk/src/eef-strands/types.ts`; add t2 Zod loader in
  `graph-corpus-sdk/src/eef-strands/loader.ts`; add `pnpm freshness:check`
  script + extend `freshness.unit.test.ts` with invalid-date error
  path + document plan-promotion checklist in
  `.agent/plans/sector-engagement/eef/README.md` §Promotion Rule.
- **PR-2 (MCP feature surface)** sequenced after PR-1:
  Agent A (t6a tool + tests) → Agent B (wire-up: barrel + register +
  ADR-123 amendment + t15 TSDoc) → Agent C (E2E shape conditions). Plus
  the architecture-expert-betty cross-cutting pre-merge contract-coherence
  check against Inc 3 preconditions per
  `.agent/plans/graph-combinatorial-arc.plan.md`.
- **PR-3 (gate-1a closure ceremony)** sequenced after PR-2: ff5 plan
  answers, ff6 acceptance bundle, plan status syncs, Inc-3 verification
  record transcribed.

**Identity row for this session** (added per PDR-027 additive-identity
rule):

| agent_name | platform | model | session_id_prefix | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| `Stormy Surfing Dock` | `claude` | `claude-opus-4-7` | `2a7b65` | `pr-0-plan-freshness-pass-and-4-pr-delivery-sequence-author` | 2026-05-25 | 2026-05-25 |

---

## Session 2026-05-22 → 2026-05-23 — multi-agent gate-1a substrate-floor team session (first-out closeout: Secret Vanishing Wisp / `981cbe`)

**Substantive progress this session**: Round 1 gate-1a substrate floor for
the EEF first-feature delivery contract is effectively complete; Round 2
substrate (t1 EvidenceCorpus types + WS2.2/WS2.3 graph-ingest primitives +
t14 telemetry seam pattern) also landed.

**Gate-1a Round 1 cycles landed** (9 of 9 — WS4.1 LANDED at `3241893d` under
Stormbound Spiralling Breeze ownership-override after Lunar's silence):

| Cycle | Commit(s) | Owner |
|---|---|---|
| WS4.4 GraphView interface + T7a array-stop smoke-test | `1fc5b491` (substantive, 11 files, 540/-3) + `bf7fa545` (test-partition amendment) + `db5271af` (test-expert post-exec absorb, 3 audit-shape tightenings) | Foamy Fathoming Compass / `ecb459` |
| WS3.3 adjacency primitives status flip (substantive at f4ca84f6 in prior session) | `83179e11` | Foamy Fathoming Compass / `ecb459` |
| PR-108 SonarCloud quality-gate clearance (6-lane fan-out, 24 files) | `51a02a93` | Secret Dimming Shade / `5a6e56` |
| t9 AGGREGATED_EEF_EVIDENCE_GUIDANCE constant (R1 + R7 prose framings) | `acd2a3f3` | Secret Vanishing Wisp / `981cbe` |
| t10 eef-evidence-grounded-lesson-plan prompt (5-step orchestration of t6a) | `a2136557` + `11c05ced` (Sparking-reciprocal-nits absorb) | Secret Vanishing Wisp / `981cbe` |
| t12 citation shape (`citation-shape.ts` Zod tuple non-empty invariants) | (earlier 2026-05-22 via Mistbound + Stormbound) | (prior identity) |
| t13a freshness check function (gate-1a partial; gate-1b refresh-script deferred) | `968e3cb7` (plan-split) + `745fe919` (function + tests) + `8f253280` (TSDoc-forward-ref absorb) | Sparking Melting Magma / `4cdb53` |
| t20 credits attribution (state-flag only — substance pre-existing) | `e1d76c54` | Sparking Melting Magma / `4cdb53` |
| WS4.1 graph-corpus-sdk scaffold (14 files, +311; two code-expert absorptions baked in — `src/index.ts` type re-exports of `GraphView` + `Result<T, E>`, `knip.config.ts` entry removal) | `3241893d` | Stormbound Spiralling Breeze / `b8a5c9` (owner-directed override; Lunar Illuminating Eclipse Co-Authored-By preserved; SVW coordination preserved in commit body) |

**Round 2 substrate cycles landed**:

| Cycle | Commit(s) | Owner |
|---|---|---|
| t1 EvidenceCorpus type substrate + t16-partial public re-export | `7d8f0b0c` + `5ec02aec` (architecture-expert-betty post-exec absorb: subpath relocation) + `9425faa0` (SVW-reciprocal absorb: 3 RankOptions divergences fixed) | Sparking Melting Magma / `4cdb53` |
| WS2.2 jsonld-compatible + Turtle parsers + §invariant-2 contract | `f58bcb80` (scaffold + deps) + `ce0abe26` (substantive, 7 files) + `361cae35` (SVW-reciprocal absorb: literal-object dataset.has() upgrade) | Sparking Melting Magma / `4cdb53` |
| WS2.3 source-path primitives (JsonPointer + quadKey + SourceLocation; 32 tests) | `6cc7b339` + `c03ace9b` (plan-split into primitives + follow-on) | Sparking Melting Magma / `4cdb53` |
| t14 telemetry seam pattern (pure-type module; gate-1a partial) | `72cd93f0` | Sparking Melting Magma / `4cdb53` |

**Coordination commits**: `e1b9561e` (Velvet's 4 markdown files mis-attributed
under Lunar's WS4.1 commit message — the COMMIT_EDITMSG concurrent-write
incident); `a7134f82` (Sparking session-arc napkin capture); `644c937b` (Shade
push-blocker prettier-normalize cure on Sparking's WS2.3+turtle files).

**Reviewer cadence — reciprocal-review pattern empirically validated**:

The team's reciprocal cross-agent post-execution reviewer dispatch (SVW ↔
Sparking, SVW ↔ Foamy) produced **8 substantive defect catches** across this
session (each absorbed cleanly):

- SVW caught on Sparking cycles (3): t13a TSDoc-filename forward-reference
  (`8f253280`); t1 `RankOptions.context` 3 plan-vs-implementation divergences
  — focus enum 4/6 members + missing `pp_percentage` + `max_results` mis-nested
  (`9425faa0`); WS2.2 jsonld-compatible literal-object quads partial
  C2-deviation (cleaner `dataset.has(quad(..., literal('Ada')))` vs
  manual-iteration predicate-value-only checks) (`361cae35`).
- Sparking caught on SVW t10 cycle (3): registration tests were schema-audit
  not behavioural (removed; added dispatcher-route-correctness); KS5
  phase-resolution coverage gap (F9 edge-case test); `m.content.text` access
  unguarded (narrowing filter); SHA-pinned TSDoc reference rot risk (replaced
  with stable plan-file path). Absorbed at `11c05ced`.
- Foamy ↔ SVW (2): Foamy's post-exec on SVW's t9 caught TSDoc line-range
  references that would rot (absorbed in-touch); SVW's reciprocal on Foamy's
  WS4.4 amendment caught WS4.5 `depends_on` array drift + stale `Last Updated`
  header (recorded as targeted follow-up).

**Coordination-pattern surfacings**:

1. **Authorial-bundle integrity 3rd known instance** — at the `e1b9561e`
   misattribution incident: Lunar `cp`'d their WS4.1 commit message to
   `.git/COMMIT_EDITMSG` while Velvet's commit-queue pre-commit hook was
   running; Velvet's hook then read Lunar's message file but committed
   Velvet's pathspec-scoped 4 files. **Cure shape worth a commit-queue CLI
   amendment**: per-intent **line-scoped** staging via patch-mode `git add -p`
   with a recorded patch fingerprint per intent, NOT just file-scoped
   pathspec discipline. Existing pathspec discipline protects file scope
   but not line-level scope within shared files (worked-instance: Sparking's
   `968e3cb7` swept SVW's unstaged t10 plan-file edits along with Sparking's
   t13 amendment — substance correct, attribution wrong). Captured in
   [`pending-graduations.md`](../pending-graduations.md) for graduation
   evaluation.

2. **Cure-1 emergent default across 4 agents** — intent-scoped message
   file path (e.g. `/tmp/<agent>-<cycle>-commit-msg.txt`) passed to
   `commit-queue commit --message-file <path>` rather than the shared
   `.git/COMMIT_EDITMSG`. Adopted by Foamy, SVW, Sparking, and Stormbound
   without coordination — emergent default. **Cure shape**: commit-queue
   CLI should accept `--message-file` with a per-intent default path
   natively (auto-derive `.git/.commit-queue/<intent-id>.msg`). Captured
   for graduation.

3. **Untracked-WIP whole-tree lint-blocker recurring pattern** — three
   instances this session: (a) Foamy's untracked graph-view/index.ts had
   8 lint errors that blocked Sparking's t20 first commit; (b) Sparking's
   untracked freshness.ts had 4 TSDoc errors + 1 type-assertion that
   blocked SVW's t10 first commit; (c) Sparking's untracked WS2.3 turtle
   parser had prettier format issues (Shade landed `644c937b` as a
   peer-format-cure). **Working cure**: directed diagnostic from peer
   with concrete fix shapes (Foamy → Sparking 22:45:56Z; SVW broadcast +
   Sparking self-fix at 22:47Z; Shade pre-empting WS2.3 push at 06:13Z).

4. **Honest-restructure-over-band-aid pattern** confirmed across two
   agents in two cycles: Foamy split graph-view/index.ts into 3 modules
   (architectural-excellence) rather than compress to pass max-lines;
   Sparking deleted the binding test per `no-conditional-tests.md`
   doctrine rather than use a file-existence guard. Both responses came
   from honest reading of the doctrine the quality-gate enforces.

**Outstanding state (next-session pickup)**:

- **Lunar WS4.1 — RESOLVED at `3241893d`**. Stormbound Spiralling Breeze
  landed Lunar's substance under owner-directed ownership-override at
  06:39Z 2026-05-23 with two pre-execution code-expert absorptions
  baked in (`src/index.ts` placeholder replaced with type re-exports of
  `GraphView` + `Result<T, E>` to make deps knip-visible and declare
  the consumer contract; `knip.config.ts` explicit `entry:` removed
  since knip auto-detects sub-path entries from package.json `exports`).
  Lunar's `355d2ddb` (workspace) + `15465f06` (git:index/head) claims
  closed at the same commit. **WS4.5 (Foamy's natural next cycle —
  EefStrandsGraphView adapter) is now unblocked**.
- **Sparking parser-integration follow-on** (claim `9c163e1c`,
  `ws2-source-map-parser-integration`) — intent broadcast at 01:08Z
  2026-05-23; never authored. Sparking acknowledged session ceiling
  after 15+ cycles. Clean pickup for any agent: per-quad source-location
  attachment refactor across both WS2.2 parsers (JSON-LD custom walker +
  n3.js StreamParser refactor), atomic landing per test-expert C4.
- **Stormbound Floating Wing ff5 intent** at 06:14Z — stood down on owner
  cron cancellation immediately after broadcast; ff5 unclaimed.
- **Critical-path beyond Round 2**: t2-zod-loader (needs WS4.1 substance
  committed for `@oaknational/graph-corpus-sdk` import path stable);
  t6a-explore-tool (needs t2 + WS4.5); ff3 + ff4 + ff5 + ff6 delivery-
  contract items.

**Round 1+2 substrate floor scoreboard**:

```text
WS4.4 ✓ + WS3.3 ✓ + PR-108 ✓ + t9 ✓ + t10 ✓ + t12 ✓ + t13a ✓ + t20 ✓
+ t1 ✓ + WS2.2 ✓ + WS2.3 primitives ✓ + t14 ✓ + WS4.1 ✓ (3241893d)
WS2.3 parser-integration outstanding (Sparking ceiling-stopped)
```

**Reviewer dispatches this session**: SVW dispatched 7 sub-agents (4 pre-exec
t9 + 3 pre-exec t10 + 1 post-exec each on Sparking's t13a, t1, WS2.2);
Sparking dispatched 6+ sub-agents (pre-exec t13a + pre-exec t1 + post-exec
self + pre-exec WS2.2 + post-exec self + pre-exec WS2.3 reviewers); Foamy
dispatched 6 pre-exec on WS4.4 + post-exec on 1fc5b491 + reciprocal on SVW
t9. Sparking ran an architecture-expert-fred cross-cycle audit (GO on
system-level cohesion, ADR-041 + ADR-108 compliant per Sparking napkin entry
at `a7134f82`).

**Identity rows for this session** (added per PDR-027 additive-identity
rule):

| agent_name | platform | model | session_id_prefix | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| `Foamy Fathoming Compass` | `claude` | `claude-opus-4-7` | `ecb459` | `ws4-4-graphview-substantive-author + reciprocal-reviewer` | 2026-05-22 | 2026-05-23 |
| `Lunar Illuminating Eclipse` | `claude` | `claude-opus-4-7` | `326ea7` | `ws4-1-corpus-sdk-scaffold-author + commit-incident-victim` | 2026-05-22 | 2026-05-22 |
| `Velvet Veiling Wisp` | `claude` | `claude-opus-4-7` | `b4bb7a` | `consolidation-curation-3-pass + commit-editmsg-incident-victim` | 2026-05-22 | 2026-05-22 |
| `Secret Dimming Shade` | `claude` | `claude-opus-4-7` | `5a6e56` | `pr-108-sonarcloud-clearance + push-blocker-format-cure` | 2026-05-22 | 2026-05-23 |
| `Secret Vanishing Wisp` | `claude` | `claude-opus-4-7` | `981cbe` | `t9-t10-author + reciprocal-reviewer + first-out-closeout-owner` | 2026-05-22 | 2026-05-23 |
| `Sparking Melting Magma` | `claude` | `claude-opus-4-7` | `4cdb53` | `15-commit-round-1-and-2-cycle-author + reciprocal-reviewer` | 2026-05-22 | 2026-05-23 |
| `Stormbound Floating Wing` | `claude` | `claude-opus-4-7` | `52f264` | `team-start-then-9h-silent-then-return-stand-down` | 2026-05-22 | 2026-05-23 |
| `Stormbound Spiralling Breeze` | `claude` | `claude-opus-4-7` | `b8a5c9` | `team-start-then-silent` | 2026-05-22 | 2026-05-22 |

---

## Session 2026-05-21 — Sequencing pull-forward (Torrid Glowing Flame / `5ab0ec`)

**Last refreshed (prior)**: 2026-05-21 (Torrid Glowing Flame / claude /
claude-opus-4-7-1m / `5ab0ec`) — **Sequencing pull-forward authored
under owner direction. NO product code in this session; planning
amendments only.** The first user-facing EEF MCP feature is now
sequenced at graph-mvp-arc **gate-1a** (a new gate added by the
2026-05-21 split) atop **graph-stack Inc.1d** (new sub-increment: WS4.4
GraphView interface + WS4.5 EEF subgraph+manifest adapter as a
concurrent Inc.1 tenant of `graph-corpus-sdk` alongside the Threads
adapter, per ADR-173 §First-wave ingestion scope 2026-05-21
amendment). The EEF adapter formerly scheduled at Inc.3 is split:
`subgraph` + `manifest` operations land at Inc.1d; the remaining 5
operations (`summary`, `getNode`, `enumerateNodes`, `neighbours`,
`findByTag`) remain at Inc.3 as typed `NotImplementedYet` Result
stubs satisfying the full GraphView interface contract from
day one. The first user-facing tool is **`eef-explore-evidence-for-context`**
(new todo t6a in `eef-evidence-corpus.plan.md`) — a subgraph-shaped
response over EEF strands matching a teacher's seed context
(subject + key_stage + optional focus), wrapped in the structural
citation/caveat/freshness envelope. The first prompt is
`eef-evidence-grounded-lesson-plan` (t10, unchanged). EEF
source-authority status unchanged: the repository-held snapshot
remains the canonical implementation source until EEF clarifies
refresh mechanics. **Gate-1a is the EEF partnership-conversation
opener gate** — contact named, first-contact action recorded with
date + outcome before gate-1a promotes to active. **Non-negotiable
at gate-1a**: full GraphView interface (Inc.1d WS4.4),
DeepKeyPath compile-time discipline (T7a smoke-test), structural
citation envelope (t12 full), ADR-175 freshness CI gate (t13 full
binding), `eef-*` namespace + `_meta` attribution (ADR-157), Sentry
telemetry seam pattern (t14 partial — full pattern, one tool
instrumented). The gate-1b cluster (recommend/explain/compare +
second prompt) ships after graph-stack Inc.3 lands. **Slice 1 still
ships in full**; the split is sequencing only. No scope reduction.
**Predecessor (corrected at handoff close)**: the v0.7.0 upstream-API
cascade CLEARED earlier today via Opalescent Twinkling Supernova's
three commits on `feat/mcp-graph-support-foundation` (`b1afd5bf`
chore(sdk), `5613eee4` refactor(search-cli), `8fcd3200` docs(plans));
my session ran with the cascade already resolved. Graph
implementation work is no longer cascade-blocked. This session's
amendments are planning-only and do not touch SDK codegen output.

> **RETRACTION ANNOTATION (2026-05-27):** The framing above treated the removal of
> sub-graph SELECTION from gate-1a as "sequencing only, not a scope reduction". That
> framing was an UNRATIFIED scope reduction. Per owner direction 2026-05-27,
> sub-graph selection for large graphs (the EEF graph is large) was ALWAYS a
> gate-1a requirement and is RESTORED to gate-1a. The gate-1a contract is now
> owned by `.agent/plans/sector-engagement/eef/current/eef-delivery-restructure.plan.md`,
> rebuilt around the Definition of Delivery directive
> (`.agent/directives/definition-of-delivery.md`). Scope boundary: the
> SCORING/ranking engine and the recommend/explain/compare tools remain gate-1b;
> only the explore tool's seed-SELECTION + projection are restored to gate-1a.
> Current resume state: handoff
> `.agent/state/collaboration/handoffs/2026-05-27-starless-eef-restructure-handoff.md`.

**Prior refresh**: 2026-05-10 (Fragrant Regrowing Root / codex / GPT-5 /
`019e12` — EEF source-authority clarification. The repository-held
`eef-toolkit.json` snapshot is now treated as the canonical implementation
source until EEF clarifies whether refresh should come from a public
download/API endpoint or direct supply. The EEF plan now says not to
reconstruct the corpus from scraped EEF pages and to record the provenance gap
at promotion if EEF has not clarified it. The structural-only evaluation stance
is unchanged: load-bearing acceptance is citation/data/caveat/freshness/
MCP-shape preservation at the tool boundary; LLM paraphrase scoring,
teacher-trust measurement, and SENCO workflow-time measurement remain
follow-on evaluation-infrastructure work outside Vitest.)

**Prior refresh**: 2026-05-08 (Opalescent Shimmering Orbit / codex /
GPT-5 / `019e06` — PR #102 graph decision-complete closeout was pushed as head
`309d9e5e44cebecb1be2478d2fb084a54f39b6b2`; the EEF evaluation stance is
unchanged at handoff. Slice 1 is structural-only for evaluation purposes.
Load-bearing acceptance is citation/data/caveat/freshness/MCP-shape
preservation at the tool boundary; LLM paraphrase scoring, teacher-trust
measurement, and SENCO workflow-time measurement are follow-on
evaluation-infrastructure work outside Vitest. The follow-on now owns the
pre-ACTIVE split decision for teacher-trust and SENCO workflow-time
measurement.)

**Prior refresh**: 2026-04-30 (Vining Whispering Root / claude-code /
claude-opus-4-7-1m / session seed `696765` — drafted the 7×3 T1
tracer matrix into `graph-query-layer.plan.md § Phase 1` with
verification footnotes against real generator output and data files;
ran three review rounds (in-session first-principles, code-expert,
assumptions-expert); applied 6 findings across rounds plus 3
operation-design corrections (drop `find_by_tag` for prerequisite +
misconception under the *stop inventing optionality* doctrine, add
sparse-relations manifest surface, reframe outcome condition);
verified Increment 2 parallel-readiness; assembled the Promotion
Packet for owner sign-off. 17 of 21 tracer cells drafted; 4 NO TRACER
under the ≥2-of-3 rule (`neighbours × misconception`,
`subgraph × misconception`, `find_by_tag × prerequisite`,
`find_by_tag × misconception`). Final MCP tool count: 17, not 21).

---

## Thread Identity

- **Thread**: `eef`
- **Thread purpose**: Integrate the EEF Teaching and Learning Toolkit
  as an evidence corpus on Oak's MCP server, on top of a polymorphic
  graph-query foundation that also serves the misconception and
  prerequisite graphs. Five-increment delivery, parallel implementation
  across three graphs, user-value template enforced on every plan task.
- **Branch**: `feat/eef_exploration` (originating session); execution
  branch TBD when Increment 1 promotes to ACTIVE.

## Participating Agent Identities

| agent_name | platform | model | session_id_prefix | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| `Iridescent Soaring Planet` | `claude-code` | `claude-opus-4-7-1m` | `b38261` | `architecture-restructure-and-handoff` | 2026-04-30 | 2026-04-30 |
| `Fragrant Sheltering Petal` | `claude-code` | `claude-opus-4-7-1m` | `360064` | `type-expert-round` | 2026-04-30 | 2026-04-30 |
| `Vining Whispering Root` | `claude-code` | `claude-opus-4-7-1m` | `696765` | `tracer-matrix-and-promotion-packet` | 2026-04-30 | 2026-05-01 |
| `Gnarled Fruiting Root` | `claude-code` | `claude-opus-4-7-1m` | `e18e2c` | `cross-ref-path-updates-from-thread-restructure-only` | 2026-05-01 | 2026-05-01 |
| `Windward Darting Horizon` | `cursor` | `claude-opus-4.7` | `dd084d` | `eef-tool-rename-eef-prefix-per-adr-157-and-mvp-arc-cross-ref` | 2026-05-07 | 2026-05-07 |
| `Opalescent Shimmering Orbit` | `codex` | `GPT-5` | `019e06` | `pr-102-eef-structural-eval-closeout` | 2026-05-08 | 2026-05-08 |
| `Fragrant Regrowing Root` | `codex` | `GPT-5` | `019e12` | `eef-source-authority-clarification` | 2026-05-10 | 2026-05-10 |
| `Torrid Glowing Flame` | `claude` | `claude-opus-4-7-1m` | `5ab0ec` | `inc-1d-eef-concurrent-tenant-sequencing-pull-forward-author` | 2026-05-21 | 2026-05-21 |
| `Salty Charting Harbour` | `codex` | `GPT-5` | `019e4e` | `standby-team-join-identity-drift-surfaced` | 2026-05-22 | 2026-05-22 |
| `Mistbound Slipping Night` | `claude` | `claude-opus-4-7` | `a1cb64` | `t12-citation-shape-cycle-author-with-stormbound-commit-handoff` | 2026-05-22 | 2026-05-22 |
| `Stormy Surfing Dock` | `claude` | `claude-opus-4-7` | `2a7b65` | `pr-0-plan-freshness-author+pr-115-watcher+adr-184-amendment` | 2026-05-25 | 2026-05-25 |
| `Fiery Kindling Brazier` | `claude` | `claude-opus-4-7` | `9f4026` | `commit-marshal+pr-115-stewardship+merge-landed` | 2026-05-25 | 2026-05-25 |
| `Foamy Lapping Harbour` | `codex` | `GPT-5` | `019e68` | `value-pr-coordination-state-committer; review-register-and-value-path-reflection-preserved; shared-tree-main-merge-verifier` | 2026-05-27 | 2026-05-27 |
| `Galactic Dancing Constellation` | `claude` | `claude-opus-4-7` | `7efeec` | `eef-value-pr-reviewer (commits 2-4 + hardening; full PR-boundary panel); whole-graph-design-peer; graph-foundations-divergence-diagnosis; worktree-cleanup` | 2026-05-27 | 2026-05-27 |

Identity discipline remains additive per
[PDR-027](../../../practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md):
new sessions add rows; matching platform/model/agent_name updates
`last_session`.

---

## Landing Target (per PDR-026)

Landed: a coherent five-increment plan estate covering graph foundation
(`graph-query-layer.plan.md`, CURRENT), evidence-corpus extension on
EEF (`eef-evidence-corpus.plan.md`, CURRENT, replaces predecessor),
cross-source journey design (`cross-source-journeys.plan.md`, FUTURE),
plus operational concerns (telemetry, freshness, negative-space) folded
into the appropriate increments. All new plans carry a mandatory
three-line user-value template on every task. Conservation property
verified via independent re-read pass; predecessor preserved in git
history at commit `e2796757`.

Evidence:

- [eef/README.md](../../../plans/sector-engagement/eef/README.md) — subthread orientation
- [eef/current/eef-evidence-corpus.plan.md](../../../plans/sector-engagement/eef/current/eef-evidence-corpus.plan.md) — Increment 2 executable plan
- [eef/reference/conservation-map.md](../../../plans/sector-engagement/eef/reference/conservation-map.md) — semantic preservation map with verification log (§N)
- [knowledge-graph-integration/current/graph-query-layer.plan.md](../../../plans/connecting-oak-resources/knowledge-graph-integration/current/graph-query-layer.plan.md) — Increment 1 foundation
- [knowledge-graph-integration/future/cross-source-journeys.plan.md](../../../plans/connecting-oak-resources/knowledge-graph-integration/future/cross-source-journeys.plan.md) — Increment 3 design
- [napkin § 2026-04-30 EEF graph-and-corpus architecture session](../../active/napkin.md) — full session insight
- [experience/2026-04-30-iridescent-graph-corpus-composition.md](../../../experience/2026-04-30-iridescent-graph-corpus-composition.md) — methodology + reflection

---

## Current State

- All three plan files (graph-query-layer, eef-evidence-corpus,
  cross-source-journeys) are CURRENT or FUTURE; **none is ACTIVE**.
- `eef-evidence-corpus.plan.md` now carries the structural-only evaluation
  stance: T19 proves shape/citation/data/caveat preservation at the tool
  boundary; LLM/outcome evaluation is sequenced behind follow-on evaluation
  infrastructure.
- Predecessor `eef-evidence-mcp-surface.plan.md` deleted from working
  tree; recoverable via `git show e2796757:.agent/plans/exploring-open-education-resources/external-knowledge-sources/current/eef-evidence-mcp-surface.plan.md`.
- The `originals/` snapshot directory was created during the
  restructure for the verification pass and deleted afterwards (see
  conservation map § Recovery path).
- 25 files in the working tree at session-handoff time; 0 commits
  ahead of main; ready to commit in three sensible chunks (restructure,
  napkin, handoff).
- Sector-engagement umbrella sees the new subthread:
  `sector-engagement/README.md` documents table includes `eef/` row;
  `external-knowledge-sources/README.md` retains education-skills + KG
  meta-strategy plans only.

---

## Session 2026-05-22 — multi-agent team session under Blustery Lifting Plume coordinator

**Substantive progress this session**: PR-108 quality-gate
advancement — `new_security_hotspots_reviewed` moved 0% → 100%
(12/12 hotspots reviewed: 11×S5332 SAFE in
`packages/core/graph-core/` test files + 1×S4036 SAFE at
`agent-tools/src/bin/agent-tools-cli-topics.ts:96`). CodeQL alert
number 90 dismissed via `gh api PATCH state=dismissed
dismissed_reason="false positive"` (Flamebright Cycle 1 tail
action; criterion 3 pending next CI run). Five mechanical commits
landed on `feat/mcp-graph-support-foundation`:

| Cycle | Commit  | Substance                                                |
| ----- | ------- | -------------------------------------------------------- |
| C1    | 77463a22 | CodeQL #90 TSDoc edit + UI dismissal (Flamebright)       |
| C4.1  | 73ab1624 | Object.hasOwn in agent-tools/src/context-cost/cli-options.ts (Salty) |
| C4.2  | ca28bd83 | RegExp.exec in agent-tools/src/practice-fitness/markdown.ts (Salty) |
| C4.3  | 0c3df45b | Optional-chain in graph-core canonicalize.unit.test.ts (Salty) |
| C4.4  | 604f64b7 | Array.at(-1) in agent-tools/src/practice-fitness/paths.ts (Salty) |

**Substrate-unblock framing**: PR-108 is the merge-blocker for the
EEF gate-1a substrate (graph-stack Inc.1d WS4.4 + WS4.5). This
session moved the PR-108 quality-gate conditions (hotspots cleared,
CodeQL #90 dismissed pending CI, four mechanical issues fixed) but
did **not** advance EEF gate-1a named delivery-contract items
(ff1–ff6). The substrate movement is necessary-but-not-sufficient;
gate-1a remains gated on the named delivery contract.

**Open Q1/Q2/Q3 PDR routing questions still on owner surface**:
Foamy Snorkelling Jetty (planning specialist) raised three
architectural routing questions during PDR-063..066 reviewer-verdict
absorption that remain owner-class decisions:

- Q1: portability migration surface — how do PDR-063, PDR-065,
  PDR-066 cure their embedded-repo-path defects without losing
  substantive grounding? (Cure-shape decision: abstract substrate
  language vs migrate detail to a non-Practice-Core surface.)
- Q2: PDR-065 `[DOCTRINE]` tag mechanism — keep, defer, or move to
  PDR-066 Tranche 2 amendment?
- Q3: PDR-065 `fast_bootstrap_eligible` frontmatter field — keep or
  downgrade to deferred-to-first-instance?

All three remain unanswered at session pause. PDR-064 cured cleanly
in working tree (uncommitted); PDR-063/065/066 cures NOT STARTED.

**Roster outcomes**:

- Codex side fully cleared: Veiled Cloaking Threshold, Salty
  Charting Harbour, Midnight Veiling Threshold all rotated out via
  team-member closeout broadcasts.
- Claude side held in pause: Blustery (coordinator), Foamy
  (planning), Flamebright (retired post-Cycle-1/6 prep), Ferny
  (continuing for consolidation pass under owner direction).

**Sonar MCP unblock evidence** (durable; for future sessions): three
substrates demonstrated three distinct unblock paths — (i) Claude
Code `/mcp` reconnect re-attaches the `mcp__sonarqube__` namespace
mid-session (owner-driven); (ii) `docker mcp gateway run --profile
sonarqube_oak` exposes the same tools via shell layer for Codex
sessions (Midnight worked precedent); (iii) `mcp__sonarqube__
mcp-add` is denied by auto-mode classifier as "Self-Modification"
without prior user/inter-agent authorisation. Codex sessions
lacking the `mcp__sonarqube__` namespace should check `docker mcp
tools ls --format json` BEFORE declaring Sonar unavailable.

**Branch-state pickup pointer (2026-05-22 final shape)**: any
session picking up this thread on `feat/mcp-graph-support-foundation`
MUST first read
[`feat-mcp-graph-support-foundation-meta.md`](../../../plans/feat-mcp-graph-support-foundation-meta.md)
— the top-level meta plan naming every plan currently in force on
the branch, the cross-plan dependency picture, the file-scope
partition (work-structure, not team-structure), current state of
work, entry points for different kinds of work, and the open
owner-class structural questions. **The earlier
`branch-concurrency.md` is retired**: it carried operational drift
(Stream-A-to-F framing read as team-shape; Path 1/2/3 merge
ordering = operational; coordinator-structure heuristics =
operational) that did not match owner direction "describe what
parallel work is possible, not how it is carried out or by whom".
Substantive content survives in the meta plan.

## Session 2026-05-22 (later) — Mistbound Slipping Night t12-citation-shape cycle

**Substantive progress this session**: t12-citation-shape (gate-1a
Round 1, load-bearing for both gate-1a and gate-1b) authored end to
end. Three files reach the staged-and-gate-green state under
Mistbound; commit was handed to Stormbound Kiting Squall per owner
direction at session-end.

Files landed in working tree (staged at handoff, not committed by
Mistbound):

- `packages/sdks/oak-curriculum-sdk/src/mcp/evidence-corpus/citation-shape.ts`
  — `CitationSchema` + `CaveatsSchema` + `CitationsSchema` with
  Zod 4 two-arg `z.tuple([T], T).readonly()` producing readonly
  non-empty tuples via `z.infer`. `z.url()` on `eef_url`.
  Source-attribution field DROPPED per owner direction (Option A):
  envelope `_meta.attribution` carries `EEF_ATTRIBUTION` once per
  response.
- `.../citation-shape.unit.test.ts` — 17 tests; `satisfies Citation`
  on fixtures; `safeParse` + `result.success`; `it.each` over
  literal `keyof Citation` array for parametrised missing-field
  rejection. No pure type-only tests (per `test-immediate-fails.md`
  item 19).
- `.agent/plans/sector-engagement/eef/current/eef-evidence-corpus.plan.md`
  — §Phase F amendment dropping `source` from `Citation`;
  frontmatter t12 todo flipped `status: pending` → `completed`.

**Reviewer cadence absorbed**:

- Pre-execution code-expert: CHANGES REQUESTED — surfaced the
  source-field duplication risk against `EEF_ATTRIBUTION` constant;
  Zod 4 tuple/min(1) tension; `@ts-expect-error` convention. Owner
  resolved source-field → Option A (drop).
- Pre-execution type-expert: `z.tuple([T], T).readonly()` Zod 4
  two-arg form; `z.url()` not `z.string().url()`; SSoT via `z.infer`.
- Pre-execution test-expert: no pure type-only tests; `satisfies` +
  `safeParse` + `it.each` over literal dataset.
- Post-execution code-expert: CLEAR; all architectural commitments
  honoured.

**Local gate state at handoff**: lint clean (after
`pnpm --filter @oaknational/eslint-plugin-standards build &&
pnpm --filter @oaknational/sdk-codegen build &&
pnpm --filter @oaknational/result --filter @oaknational/type-helpers build`
sequence); type-check clean; vitest 17/17 pass; full
`pnpm turbo run type-check lint test` 87/87 successful.

**Commit handoff to Stormbound**: directed comms-event
`0f03f45c-a225-4d55-bb15-2e5c44abb678` at 15:42Z carries all
substance: intent_id `131fe2a9` already verify-staged with
fingerprint `35a29ef5...`; message file at
`/tmp/mistbound-t12-commit-message.txt`; three options for landing
(take over intent, open own intent with same files, Path-B
selective `git commit --`). Acknowledged Stormbound's graceful
abandonment of `cf39fd43` (the queue-collision worked instance).

**Claim disposition**: zero Mistbound claims active at handoff. Three
closed: `c847fffc` (stale ff2, absorbed by sweep), `f013f95d`
(t12 main, handed), `59eabaea` (t12 supplementary plan amendment,
handed).

**Workspace-bootstrap blocker surfaced** (pending-graduations
candidate): consumer-workspace lint, type-check, and test commands
fail at config-load time on a fresh checkout because producer
workspaces (`@oaknational/eslint-plugin-standards`,
`@oaknational/sdk-codegen` subpath exports, `@oaknational/result`,
`@oaknational/type-helpers`) ship no `dist/` until explicitly built.
Implicit build-order graph is invisible to new agents. Possible
cures: `pnpm bootstrap` script, `development` exports condition
resolving to `src/`, or precondition in onboarding docs.

**EEF gate-1a progress**: ff2 RESOLVED in prior cycle (this session
inherited the post-resolution state via sweeps `03da8e3d` /
`2cda69a2`). t12-citation-shape RESOLVED this session (subject to
Stormbound's commit). Remaining gate-1a items: ff1 (partnership
opener — owner direction is skip; EEF already aware),
ff3 (substrate floor tracking — WS4.4 + WS4.5 in graph-stack plan),
ff4 (corpus todos tracking — t1, t2, t6a, t9, t10, t13, t20 +
partials), ff5 (shape-understanding evidence — depends on t6a draft),
ff6 (acceptance bundle — terminal). Round 1 parallel-safe cycles
remaining: t9, t13, t20, WS4.4.

**Last refreshed**: 2026-05-22 (later) — Mistbound Slipping Night /
claude / claude-opus-4-7 / `a1cb64`. Topology: peer-primary with
Stormbound Kiting Squall (`ddbea2`) as the commit-window picker-up.

---

## Session 2026-05-22 — Blustery Lifting Plume coordinator (earlier)

**Last refreshed**: 2026-05-22 — Blustery Lifting Plume / claude /
claude-opus-4-7 / `d4aad7` (full-session coordinator) + team
(Flamebright / Foamy / Ferny / Veiled / Salty / Midnight).
Consolidation pass executed under Ferny by coordinator routing
event `09:35:57Z`; branch-concurrency manifest landed by Ferny at
commit `c8860a0f` under owner direction "update all relevant plans
and continuity surfaces to make the parallel work explicit"; the
manifest was subsequently superseded by the meta plan
`feat-mcp-graph-support-foundation-meta.md` after owner refined the
criterion ("describe what highly parallel work is possible, not how
it is carried out or by whom"). Final closeout this session: team
dissolved (last team member Blustery); meta plan landed; three plan
amendments (`pr-108-snagging.plan.md`, `eef-first-feature.plan.md`,
`graph-stack.plan.md`) tightened to cross-reference the meta plan
and drop operational framing; the four PDR drafts
(`PDR-063..066`) preserved on the branch as committed artefacts
under this closeout, with PDR-064 cures landed and PDR-063/065/066
cures paused mid-work awaiting owner Q1/Q2/Q3 routing. Knowledge-
graduation backlog expanded to 6 candidates (added: planning
documents describe work-structure, not operational/team approach
— owner-stated criterion).

---

## Promotion Triggers and Sequencing

The five-increment delivery sequence with explicit promotion gates:

1. **Increment 1** (graph-query-layer) → ACTIVE when:
   - Owner has approved architecture session conclusions ✓ (done this session).
   - T1 (tracer use cases — 21 minimum, 7 ops × 3 graphs) signed off.
   - Plan-body first-principles check applied to tracer shapes against
     actual data files.
   - EEF corpus plan (Increment 2) ready for parallel start.
2. **Increment 2** (eef-evidence-corpus) → ACTIVE when:
   - Increment 1 reached ACTIVE.
   - EEF provenance/refresh check performed with EEF or Oak's EEF contact. If
     unresolved, promotion notes must explicitly record that the checked-in
     JSON remains the definitive implementation source pending clarification.
   - Conservation map signed off by owner.
   - Plan-body first-principles check applied to citation type, corpus
     operations, test shapes.
3. **Increment 3** (cross-source-journeys) → CURRENT when:
   - Increments 1 and 2 both reached ACTIVE.
   - GraphView adapters exist for misconception and prerequisite (T3,
     T4 of graph-query-layer plan).
   - Real teacher question identifies that prompt-only orchestration
     is insufficient (the load-bearing observation the journeys plan
     waits on).
4. **Increment 4** (telemetry/freshness/provenance) — does not have a
   separate plan. EEF-specific work lives in Increment 2 (T13–T15);
   graph-layer telemetry lives in Increment 1 (T8).
5. **Increment 5** (school-context overlay) — deferred. Gated on
   multi-tenant identity work outside this thread.

**Escape hatch**: if Increment 1 slips, the EEF corpus plan can
prototype against an in-line `GraphView` stub and refactor onto the
real interface when it lands. See Increment 2 § Risks.

---

## Type-Expert Round Outcome (2026-04-30, Fragrant Sheltering Petal)

**Status**: type-expert round complete. Verdict: AT-RISK with concrete
remediations applied. Of 11 findings:

- **Bucket (a) principles-decided** — applied: Result<T, E> on fallible
  GraphView ops; non-empty tuple `caveats: readonly [string, ...string[]]`;
  non-empty tuple `citations: readonly [Citation, ...Citation[]]`;
  `ComparisonDimension` literal union (no `string[]` widening).
- **Bucket (b) reviewer-recommendation** — applied: DeepKeyPath
  array-stop constraint named in T2; T7a compile-time smoke-test added;
  `ExplainOptions` clarified TNode-independent (sketched); `NodeFilter<TNode>`
  and `RankOptions<TNode>` sketched in plans to prevent implementor drift;
  T19 claim corrected to match actual structural enforcement;
  `meta.last_updated` and `meta.data_version` Zod precision tightened
  (`z.string().date()` and semver regex); journey citation propagation
  type note added to T4.
- **Bucket (c) resolved by reading the data, not by escalation:**
  `school_context_schema` in `eef-toolkit.json` is itself a JSON Schema
  document with a known closed shape — 9 named properties
  (phase, key_stage, school_type, pupil_premium, send_percentage,
  ofsted_grade, attainment, workforce, priorities), each a standard
  JSON Schema property descriptor. The predecessor's
  `Record<string, unknown>` carve-out was over-conservative; removed.
  Plan T2 now types this as a concrete `SchoolContextSchema` interface
  with a recursive `JsonSchemaProperty` shape; F2/F3 marked as
  *revised*, not preserved verbatim. Owner correction (2026-04-30):
  asking the owner to choose between "open" and "closed" when the
  answer was in a file in the repo is the same optionality-invention
  anti-pattern from last session, applied to a fact-check rather than
  a design call. Fourth instance; graduation candidate has now
  ripened.

Promotion gate update: T1 + T2 of `graph-query-layer.plan.md` and T1,
T2, T5, T8, T12 of `eef-evidence-corpus.plan.md` are now type-design-
clear. Increment 1's "T1 + plan-body first-principles check" gate is
closer to satisfied; the `pnpm sdk-codegen` round-trip is the next
structural verification.

## First Task of Next Session

**Owner: review the Promotion Packet (below) and approve / amend / reject promotion of Increment 1 (`graph-query-layer.plan.md`) to ACTIVE.**

Gates 2 and 3 of the promotion-gate set were satisfied in this
session (Vining Whispering Root, 2026-04-30): the plan-body
first-principles check ran against real data and surfaced 4
findings (all applied to the plan body), and the EEF corpus plan
(Increment 2) was verified parallel-ready. Gate 1 (T1 tracer
sign-off) is now ready for owner review — the 7×3 matrix is drafted
inline in `graph-query-layer.plan.md § Phase 1 § T1 Tracer Matrix`
with verification footnotes.

If the owner approves promotion, the natural next move is the
`pnpm sdk-codegen` round-trip — the round-trip is the next
structural verification that the type designs work in actual SDK
code, not just plan-body sketches.

**Out-of-band next-session candidate** (resolved 2026-05-10):
*stop inventing optionality* graduated to PDR-058 (three-tier
optionality decomposition). The `.agent/rules/apply-dont-ask.md`
rule shape was rejected; the substance now lives at PDR-058 (with
PDR-057 covering the empirical-answerability surface). No EEF
follow-up action.

---

## Promotion Packet (Vining Whispering Root, 2026-04-30)

### What the packet contains

A concrete, owner-reviewable bundle of the work done this session
to satisfy the three remaining promotion-gate conditions for
Increment 1.

### Gate 1 — T1 tracer use cases

Status: **drafted, awaiting owner sign-off.**

Result after two review rounds: **17 of 21 tracer cells drafted**
(7 operations × 3 graphs), **4 cells explicitly marked NO TRACER**
under the ≥2-of-3 rule:

- `neighbours × misconception` — no edges in current `MisconceptionGraph` data (round-1 finding).
- `subgraph × misconception` — same root cause (round-1 finding).
- `find_by_tag × prerequisite` — no tag taxonomy in source data (round-2 finding from assumptions-expert); the synthetic-compound `${subject}-${keyStage}` proxy initially drafted was the *invented optionality* anti-pattern. Agents wanting subject+keyStage filtering use `enumerate_nodes`.
- `find_by_tag × misconception` — same root cause (round-2 finding).

Final MCP tool count: **17**, not 21. Per-graph: prerequisite 6 +
misconception 4 + eef-strands 7. The four carve-outs are explicit in
the plan body and in T6 (registration code names each and links back
to the NO TRACER cell, so the absence is visible to a future
contributor).

Each of the 19 tracers carries:

- A concrete teacher question.
- An expected response shape grounded in the actual data structure.
- A token budget at default projection.
- A boundary check (drops to graph mechanics, not corpus scoring).
- A verification footnote (`Verified against: <file> + <field path>`).

Inline location: `.agent/plans/connecting-oak-resources/knowledge-graph-integration/current/graph-query-layer.plan.md § Phase 1 § T1 Tracer Matrix`.

### Gate 2 — Plan-body first-principles check

Status: **complete.**

Each tracer was drafted with the actual generator-source or data file
open. Initial pass surfaced four findings; a code-expert round
(2026-04-30) caught two more genuine data-shape gaps that the initial
pass had missed. All six findings have been applied to the plan body
in this session:

1. **MisconceptionNode lacks an explicit ID field** — `MisconceptionGraphView`
   adapter (T4) must mint stable IDs. Recommended scheme: SHA-1 of
   `${lessonSlug}::${misconception}` truncated to 12 hex characters.
   Index-based alternatives are NOT viable (upstream extractor
   ordering not guaranteed). Recorded inline in T4 and in Phase B
   findings.
2. **Citation contract uses `strand_id`; data field is `id`** — the
   `id → strand_id` rename happens at the corpus boundary
   (Increment 2 § T2 loader), not inside the graph adapter.
3. **`NodeFilter.FieldPredicate` did not cover array-element membership** —
   added the array arm:
   `TFieldValue extends readonly (infer U)[] ? { readonly contains: U } : never`.
   Required by `enumerate_nodes × eef-strands` (the
   `tags: { contains: 'primary' }` tracer). Plan body T2 spec updated.
   Includes a "Semantic collision note" naming the structural-vs-
   semantic identity with the string-arm `contains`.
4. **MisconceptionGraph has no edges** — the two NO TRACER carve-outs
   above. T4 adapter description updated to reflect "5 of 7 operations".
5. **`related_strands` is absent on 13 of 30 EEF strands** (caught by
   reviewer round). The field is missing entirely on a named list of
   13 strands — not empty arrays. T5 adapter, `neighbours × eef-strands`
   tracer, and `subgraph × eef-strands` tracer all updated to name
   the optionality and the well-defined behaviour for absent strands.
   Increment 2 § T2 Zod loader must accept `related_strands` as
   optional with default `[]`.
6. **`related_guidance_reports` is `{title, url}` objects, not bare URLs**
   (caught by reviewer round). Field present on only 7 of 30 strands;
   each entry is an object. T5 adapter description updated:
   adapter extracts `url` as edge target ID, preserves `title` in
   edge metadata. Zod loader shape:
   `z.array(z.object({title: z.string(), url: z.string().url()})).optional()`.

Two additional plan-body corrections were applied while verifying
the existing T3/T4 adapter descriptions against real data:

- T3 PrerequisiteGraphView previously named edge types `prerequisite_of`,
  `succeeds`. Real data: single edge type `prerequisiteFor` with a
  `source: 'thread' | 'priorKnowledge'` discriminator. Corrected.
- T4 MisconceptionGraphView previously named edge types
  `related_misconception`, `addressed_by_lesson`. Real data: no edges
  at all. Corrected (with carve-outs).

### Gate 3 — Increment 2 parallel-readiness

Status: **complete — PASS on all four checks.**

Verified against `.agent/plans/sector-engagement/eef/current/eef-evidence-corpus.plan.md`:

1. ✓ Status `current`; `parent_plan` and all four `sibling_plans`
   references resolve to existing files.
2. ✓ T1, T2, T5, T8, T12 are in their post-type-expert form
   (`EvidenceCorpus` wrapping shape with `Result<T, E>`; precise Zod
   for `last_updated` and `data_version`; non-empty tuple types on
   `caveats` and `citations`; `ComparisonDimension` literal union;
   citation discipline at compile time + runtime).
3. ✓ `EvidenceCorpus<TNode, TEdgeType extends string>` matches the
   `GraphView<TNode, TEdgeType extends string>` signature exactly.
   The corpus plan does not assume a `GraphView` shape this plan
   does not provide.
4. ✓ No new blocking ambiguities; the four Phase B findings above
   feed forward into Increment 2 cleanly (findings #2 and #3 are
   already accommodated; finding #1 is a T4 design point that does
   not block Increment 2; finding #4 is the carve-out that is
   already explicit in T6).

### Plan-body diff summary (since type-expert round)

Modifications to `.agent/plans/connecting-oak-resources/knowledge-graph-integration/current/graph-query-layer.plan.md`
this session, across two review rounds:

- Added § Phase 1 § T1 Tracer Matrix subsection (17 tracers + 4 NO TRACER cells + 6 Phase B findings + matrix summary).
- Extended `FieldPredicate<TFieldValue>` with the array-element `contains` arm (T2 spec) plus the "Semantic collision note" that names the string-vs-array structural identity for `{ contains }`.
- Corrected T3 PrerequisiteGraphView edge-type description (`prerequisiteFor` only, with `source` discriminator); marked `find_by_tag` as not registered (no tag taxonomy in source data) — implements 6 of 7 operations.
- Rewrote T4 MisconceptionGraphView description: 4-of-7 operations (no edges, no tag taxonomy), mints stable IDs (SHA-1-based; index-based forms ruled out).
- Rewrote T5 EefStrandsGraphView description with concrete tag/edge counts, the `id → strand_id` rename note, the optionality of `related_strands` (absent on 13 of 30) and `related_guidance_reports` (absent on 23 of 30, present as `{title, url}` objects). Added a "Sparse-relations surface" subsection: `manifest()` and `summary()` expose `strands_without_relations: readonly string[]` to front-load the empty-edge knowledge.
- Updated `manifest × eef-strands`, `neighbours × eef-strands`, and `subgraph × eef-strands` tracers to name the absent-field behaviour and the new manifest field.
- Updated T6 description: 17 MCP tools (not 21), with the four carve-outs explicit.
- Replaced Risk #5 ("tag-search semantics drift" mitigation) with a structural resolution: `find_by_tag` no longer ships for prerequisite or misconception, so the docstring-as-correction-of-surface-lie pattern is gone.
- Updated Size Estimate table: 17 tools, ~1605 lines total.
- Updated Exit Criteria § Shape conditions #1 to read "17 MCP tools".
- **Reframed Exit Criteria § Outcome conditions** from a "ratio ≥50% in 4 weeks" gate (sampling-noise-dominated at expected launch volumes) to a composite "adoption evidence" gate with three branches (≥10 distinct sessions / ≥1 downstream consumer composing without special-casing / honest analysis).

`eef-evidence-corpus.plan.md` is unchanged this session (Phase C verified
no drift). However, the round-2 findings have a forward-impact for
Increment 2: the Zod loader (T2 in that plan) must accept `related_strands`
as optional and `related_guidance_reports` as `z.array(z.object({title, url})).optional()`,
not bare strings. This is recorded here for the next execution
session; the corpus plan body itself does not need editing because
its T2 already says "Zod-validated loader for eef-toolkit.json"
without specifying these field shapes.

### Explicit ask

**Approve promotion of Increment 1 (`graph-query-layer.plan.md`) to ACTIVE?**

- **YES** → the plan moves from `current/` to `active/`; the next
  execution session begins with the `pnpm sdk-codegen` round-trip
  (verifying the type designs translate to working SDK code).
- **AMEND** → name the gap; the plan is updated and the packet is
  re-presented.
- **NO** → name the blocker; the plan stays CURRENT and the blocker
  becomes a new pre-promotion task.

No menu of alternative shapes is offered; the doctrine is to apply
the gate, not to invent optionality around it.

## Previous First Task (resolved)

**Run the type-expert over the current plan estate** — code-expert
explicitly recommended this in its session-close report; the
NodeProjection deep-path types and the EvidenceCorpus wrapping shape
are the load-bearing review questions. Owner direction (2026-04-30):
"this isn't something that needs my intervention, the code reviewer
suggested type reviewer follow up, stop inventing optionality and do
it." **Status**: complete (this session, see Type-Expert Round Outcome
above).

Brief the type-expert with:

- Branch: `feat/eef_exploration` at HEAD.
- Primary files: `graph-query-layer.plan.md` (NodeProjection recursive
  deep-path type with depth bound 4; the seven-operation interface),
  `eef-evidence-corpus.plan.md` (EvidenceCorpus wrapping a GraphView,
  Citation type as structural invariant).
- Specific questions for the reviewer:
  1. Does the recursive `DeepKeyPath<TNode, Depth extends number = 4>`
     shape produce useful inference at depth 4 for `EefStrand` (the
     deepest node type), or does it hit instantiation limits earlier?
  2. Does the `EvidenceCorpus { readonly view: GraphView<...>; rank;
     explain; compare }` wrapping shape preserve the corpus/graph
     boundary at every call site (consumers must go through
     `corpus.view.*` for graph ops)?
  3. Is the `Citation` type non-emptiness enforceable at compile time
     via the response-type signature, or does runtime Zod-validation
     have to carry the load?

---

## Resolved Owner Decisions (this session-close)

All twelve open questions surfaced after the docs+code review have
been settled by owner direction on 2026-04-30:

1. **NodeProjection** → recursive deep paths, depth bound 4. Strict,
   everywhere always.
2. **EvidenceCorpus** → wrapping (`{ readonly view: GraphView<...>; ... }`),
   not extends. Architectural evidence over surface ergonomics.
3. **T2 data-shape unit-test contract** → REMOVED. Brittle, asserts
   implementation not behaviour, provides no real value. Loader test
   proves only that real EEF data parses without throwing. Framework
   "surfaces all nodes" question answered by fixture-based behaviour
   tests, not exact-count assertions.
4. **T19 LLM-graded outcome conditions** → REMOVED. Worth measuring,
   but no appropriate infrastructure exists; shoehorning into Vitest
   is not the answer. Structural citation type (T12) is what we ship
   and prove. LLM-paraphrasing verification is honestly out of scope
   until evaluation infrastructure exists.
5. (covered by 3) — Exact counts are brittle and provide no value.
6. **ADR-157** → demoted to **Proposed** status with status-amendment
   note; this work explores the space but is not constrained by it.
7. **User-value template** → reframed as a sense-check, not a
   ceremony. Applied where value or architectural assumption is
   non-obvious; omitted on wiring/credits/registration. The point is
   sense-checking that we are building useful things, not ticking
   boxes.
8. **Outcome operationalisation (named rubric/owner/cadence)** →
   REMOVED. Speculative fantasy without infrastructure to back it.
9. **Type-expert escalation** → first task of next session (see
   above).
10. **Parent plan child_plans drift** → fixed in this session.
11. **Refresh script location** → relocated to SDK workspace.
12. **Edge type rename** → `cites_guidance_report` →
    `related_guidance_report` (matches data field).

---

## Doctrine Candidates Pending Graduation

See napkin § "Doctrine candidates surfaced — explicit graduation queue"
for the full list with triggers and candidate homes. Items cover:

1. User-value sense-check template (now reframed; not "mandatory" — a
   sense-check applied where value is non-obvious)
2. Outcome-criteria gap (repo-wide) — note: separate concern from
   "fantasy-infrastructure outcome conditions in plans without
   evaluation infrastructure"; the gap is real, the fix is not
   prescribing rubrics/owners we cannot deliver
3. Progressive disclosure
4. Parallel-tracer-implementations
5. Conservation-requires-a-mind
6. Five artefact families per substantial restructure
7. Conservation-map verification pass mandatory before originals deletion
8. Two orders of plan architecture (data-tool-resource-prompt vs graph-corpus-journey)
9. Bias-toward-action in option presentation (second instance — could
   graduate now)
10. **NEW (this session-close)**: *Stop inventing optionality.* When
    a reviewer or principle has already named the right path, the
    next move is to apply it, not to wrap it as a question. Owner
    flagged this as the meta-pattern under several of the 12 questions.
11. **NEW**: *Don't shoehorn a value-claim into infrastructure that
    can't carry it.* If the right way to verify something doesn't
    exist yet, the honest plan says so and ships the structural
    enforcement that does exist; it does not invent a brittle test
    or a fantasy operational protocol to fill the gap.

---

## Risks Worth Flagging to Next Session

1. **Snapshot staleness creep**: `eef-toolkit.json` is 28 days old at
   handoff. EEF Toolkit updates ~2x/year. Refresh check is a
   precondition for promoting Increment 2 to ACTIVE.
2. **Three-graph protection erosion**: if Increment 1's tracer use
   cases turn out to have only 1-of-3 coverage for some operations,
   those operations should be dropped, not added speculatively. T1 is
   gating for a reason.
3. **Polymorphism through router tool**: the urge to ship one
   `query-graph` tool with a discriminator instead of 7 specific
   tools per graph (21 total). Resisted in plan body; surface in code
   review if it returns.
4. **Citation enforcement misfire on prompt outputs**: structural
   citation discipline is on tool calls, not LLM prose. The plan no
   longer claims to verify LLM behaviour; that's honestly out of
   scope until evaluation infrastructure exists.
5. **User-value sense-check becoming rote**: at consolidation, sample
   5 sense-check lines and ask "is this falsifiable? does it name a
   teacher action?" If not, push back. Without that discipline the
   sense-check is decorative.

---

## Cross-Plan and Cross-Thread Links

- **Parent (sector-engagement)**: [`sector-engagement.next-session.md`](sector-engagement.next-session.md)
- **Parent (KG-integration coordinator)**: [`open-education-knowledge-surfaces.plan.md`](../../../plans/connecting-oak-resources/knowledge-graph-integration/active/open-education-knowledge-surfaces.plan.md) — this subthread owns its WS-3 (now restructured into Increments 1+2+3).
- **Authoritative ADR**: [ADR-157](../../../../docs/architecture/architectural-decisions/157-multi-source-open-education-integration.md)
- **Strategic brief**: [`evidence-integration-strategy.md`](../../../plans/sector-engagement/eef/future/evidence-integration-strategy.md) — R1–R8 source.
