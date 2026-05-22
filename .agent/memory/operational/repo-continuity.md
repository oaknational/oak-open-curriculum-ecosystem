---
fitness_line_target: 400
fitness_line_limit: 525
fitness_char_limit: 35000
fitness_line_length: 200
split_strategy: 'Archive historical session-close summaries to a companion archive file; keep only live operational state and most recent session summary here'
merge_class: index-narrative-tables
---

# Repo Continuity

Repo-level operational index for active thread state. Historical session-close
prose was archived verbatim during the 2026-05-12 consolidation pass at
[`archive/repo-continuity-session-history-2026-05-12.md`](archive/repo-continuity-session-history-2026-05-12.md).
Earlier archives remain under [`archive/`](archive/).

## Current State

- Current branch: `feat/mcp-graph-support-foundation`. HEAD `a49e7a21` (Shadowed Hiding Shade deep-graduation pass under owner direction: 8 Tier A doctrine landings + 9 Tier B pattern/draft captures + 5 Tier C per-user memory marker updates; 34 files +1983/-163; husky pre-commit chain green). Prior: `3f6b258a` (Starlit Beaming Aurora landing Phase Final SKILL update for commit-queue-intent-scope-discipline arc + Cycle 1.3 closeout broadcast `cf32f2c1`; 4 files +154/-0; husky pre-commit chain 87/87 green). Prior: `896312d0` (Starlit landing Cycle 1.3 atomic TDD — workflow-level system-state describing surface; 9 files +297/-687 net; 472/472 tests green; 87/87 turbo). Prior: `989dc6b4` (Starlit metacognition-reshape of Cycle 1.3 plan body; 1 file +128/-112).
- **2026-05-22 (Shadowed Hiding Shade / `claude` / `claude-opus-4-7[1m]` / `e35155`) — deep-graduation pass drains owner-direction-gated buffer entries.** Owner directive: *"please run a deep graduation of knowledge source materials, the napkin, the comms records, the .remember directory, the vendor specific memory locations. Ignore fitness metric levels for now."* Single commit `a49e7a21` lands 8 Tier A graduations (5 new rules — `check-singleton-per-window`, `use-monitor-for-event-driven-wake`, `per-user-memory-is-a-buffer`, `knowledge-preservation-over-fitness-warnings`, plus the directive home for the metacognition two-modes amendment; 2 PDRs Proposed — PDR-067 surface-classification-for-fitness-response, PDR-068 pipeline-back-pressure-as-structural-cure-signal; 1 pattern `where-system-state-is-observable-at-plan-author-time` + `tdd-as-design.md` "One state, one describing surface" amendment; `session-handoff` SKILL §11 + §11a amendments). 9 Tier B captures at pattern/draft fidelity (6 patterns + PDR-069 Draft + PDR-070 Draft + the §11a amendment counts in both tiers). 5 Tier C per-user memory audit-trail markers. Pending-graduations register status flips on graduated entries; one-line ADR-144 vocabulary fix in `fitness-token-measurements-and-frontmatter-mandation.plan.md` surfaced by the vocabulary gate. Gates green for changed scope: markdownlint, format, practice:vocabulary, portability:check, repo-validators:check. Worked instance of PDR-068's consumer-cadence cure — substance gated on owner-direction since 2026-05-17 drained through a focused pass.
- **2026-05-22 (Starlit Beaming Aurora / `claude` / `Opus-4.7` / `1977cf`) —
  commit-queue-intent-scope-discipline arc COMPLETE.** Three commits land the
  full structural cure for the multi-writer queue concurrency failure mode:
  (a) `989dc6b4` plan-body reshape per metacognition pass — one system state
  takes one describing surface, retire implementation-coupled scaffolding;
  (b) `896312d0` Cycle 1.3 atomic landing — workflow-level invariants (f)/(g)
  added, compile-time non-empty `readonly [string, ...string[]]` narrowing on
  three load-bearing dep input pathspec types, single narrowing site at
  `runCommitWorkflow` entry, canonical rename `getStagedBundleScoped` →
  `getStagedBundle` + `ScopedStagedBundleInput` → `GetStagedBundleInput`, two
  new modules `pathspec.ts`+`verify-output.ts`, two scaffolding test files
  deleted (`commit-queue-record-staged-scope.unit.test.ts`,
  `commit-queue-verify-staged-scope.unit.test.ts`); (c) `3f6b258a` Phase Final
  SKILL update — new subsection §"Intent-Scoped End-to-End (2026-05-22 cure)"
  in `.agent/skills/commit/SKILL-CANONICAL.md` documenting disjoint
  multi-writer commits land via queue ceremony, `stagedFileMismatch` "extra
  files" semantic narrowing under scoped reads, empty `intent.files`
  short-circuit. Aggregate `pnpm check` GREEN 104/104 turbo tasks (1m15s).
  Closeout broadcast `cf32f2c1` anchored in `shared-comms-log.md` markdown
  anchor for retention-safe forward-trace to failure-mode instances A/B/C.
- **2026-05-22 (Shaded Whispering Dusk / `claude` / Opus 4.7 (1M) / `763ef4`) — two-primary lane assignment + meta-plan refresh + coordination-watcher canonicalisation plan captured. Compaction-boundary handoff.** Three commit boundaries this session: (a) `4200a17b` `docs(meta-plan): refresh post-arch-excellence and cure graph-stack link drift` — meta-plan §"Working tree carries" line refreshed to commit-`77d6ce85` pointer; Q1/Q2/Q3 in §"Open structural questions" closed as resolved by the architectural-excellence pass; `current/` → `active/` link drift cured for `graph-stack.plan.md` across 7 plan files including the meta plan itself, `high-level-plan.md`, `graph-portfolio-index.md`, `graph-mvp-arc.plan.md`, `graph-combinatorial-arc.plan.md`, `practice-graph-payoff-peak-pilot.plan.md`, `2026-05-11-graduation-candidates-drain-opener.md`, and `agent-graphs-workspace-organisation.plan.md`. Executed via 4-sub-agent fan-out (A=practice-index bridge, B=meta-plan refresh, C+D=link-drift cure). (b) Working tree at handoff carries the coordination-watcher-canonicalisation plan (new at `agent-tooling/future/coordination-watcher-canonicalisation.plan.md`), napkin entries for the worked-instance defect + reference-folder scope clarification + two-primary-each-fanning-out model + compaction-boundary-handoff pattern, pending-graduations entry "Canonical tool definitions belong code-adjacent" (status `due`, target `multi:plan-execution + doc-amend + rule`), 2 comms team-start events, 2 seen-files, regenerated `shared-comms-log.md`. (c) Two-peer collaboration formed: Shaded Whispering Dusk = Lane A (PR-108 snagging Cycles 5-10 + Phase Final per `pr-108-snagging.plan.md`), Mistbound Slipping Night (`a1cb64`) = Peer B candidate read-only awaiting owner direction (likely Lane B = Inc.1a closure WS2.2/WS2.3/WS3.3 OR Inc.1d substrate WS4.1/WS4.4/WS4.5). **Lane work NOT started this session** — owner direction was "give me a loop command first". Comms watcher armed for Shaded as Monitor task `b7ofkzzv1` (may need restart after compaction). The /loop command for advancing lane work is recorded in the `connecting-oak-resources` thread record verbatim. Substantive metacognition pass produced the canonical-watcher-canonicalisation plan capturing three structural issues with the current watcher contract (canonical home misplaced in `.agent/reference/`; SKILL invocation example as fragile authority; watcher scope narrower than substrate scope). Doctrine substance: canonical tool definitions belong code-adjacent and ideally executable; `.agent/reference/` is for external materials only.
- **🛑 PR #108 IS MERGE-BLOCKED ON QUALITY GATES** — PR #108 (`feat/mcp-graph-support-foundation` → `main`) is failing two quality gates: CodeQL alert #90 (`js/missing-rate-limiting` on `bootstrap-helpers.ts:151`) and SonarCloud Quality Gate (40 new issues, 12 unreviewed security hotspots, 6.0% new-code duplication ≥ 3.0% threshold). **The PR must not merge until those gates clear.** Disposition strategy and execution lane: [`pr-108-snagging.plan.md`](../../plans/connecting-oak-resources/knowledge-graph-integration/current/pr-108-snagging.plan.md). Substantive graph implementation work on this branch is parked behind the snagging plan. Full prior-session context in [`archive/repo-continuity-session-history-2026-05-22.md`](archive/repo-continuity-session-history-2026-05-22.md).

## Active Threads

A **thread** is the continuity unit. Full identity tables and lane state live in
each thread record; this table is the repo-level index.

Per owner direction 2026-05-22, the only currently active thread is **EEF
first-feature delivery**. All other threads are paused — their substance is
preserved in their next-session records, but they are not the current
session-priority lane. The graph-substrate work in plans under
`.agent/plans/connecting-oak-resources/` continues as the executable path
delivering EEF first-feature gate-1a (`eef-explore-evidence-for-context`); the
`connecting-oak-resources` thread record remains as the historical container
for that work but is not itself the active thread.

| Thread | Purpose | Record | Latest identity |
| --- | --- | --- | --- |
| `eef` | EEF first-feature delivery (gate-1a `eef-explore-evidence-for-context`, gate-1b cluster) | [record][eef] | Mistbound Slipping Night / `claude` / Opus 4.7 / `a1cb64` / 2026-05-22 (t12-citation-shape cycle authored end-to-end + commit handed to Stormbound; ff2 + t12 both gate-1a items resolved; **plus seven coordination-substrate graduations** landed under owner-directed promotion — 4 new rules [continuity-surface-orphans, handoff-self-contained, agent-state-observable, owner-attention-at-action-moments (provisional)], 1 rule amendment [pre-execution-review two-shapes], 2 PDR amendments [PDR-063 discontinuity-validation, PDR-014 framing-direction]) |

## Paused Threads

Paused threads retain their next-session records and identity history; they
are not the current session-priority lane. Reactivation is owner-directed.

| Thread | Purpose | Record | Latest identity |
| --- | --- | --- | --- |
| `connecting-oak-resources` | Oak resource graph substrate (delivers EEF first feature); **PR #108 blocked on quality-gate snagging plan** | [record][connecting] | Tempestuous Spiralling Thermal / `claude` / Opus 4.7 (1M) / `9205b8` / 2026-05-22 (OUTPUT-surface knowledge curation: substrate-completion graduations + distilled.md fitness-rotation; 53b00386) |
| `agentic-engineering-enhancements` (alias: "agent communication improvements") | Practice continuity + agent-tools improvement | [record][agentic] | Shadowed Hiding Shade / `claude` / claude-opus-4-7[1m] / `e35155` / 2026-05-22 (deep-graduation pass commit `a49e7a21` — 8 Tier A doctrine landings inc. 5 new rules + PDR-067/PDR-068 Proposed + tdd-as-design and metacognition directive amendments + session-handoff SKILL §11/§11a amendments; 9 Tier B captures inc. 6 patterns + PDR-069/PDR-070 Draft; 5 Tier C per-user memory marker updates) |
| `observability-sentry-otel` | Sentry/OTel integration | [record][observability] | Umbral Creeping Night (commit-only) / `claude-code` / opus-4.7 / `188baa` / 2026-05-10 |
| `main-critical-sonar-remediation` | Sonar remediation | [record][main-critical] | Stormy / `claude-code` / `228bc5` / 2026-05-06 |
| `exploring-open-education-resources` | Third-party OER | [record][oer] | Gnarled / `claude-code` / `e18e2c` / 2026-05-01 |
| `sector-engagement` | External adoption | [record][sector] | Squally / `cursor` / 2026-04-30 |
| `architectural-budget-system` | Architectural budget | [record][budget] | Nebulous / `codex` / 2026-04-29 |
| `cloudflare-mcp-security-and-token-economy-plans` | Cloudflare MCP | [record][cloudflare] | Glassy / `codex` / 2026-04-28 |

Compact identity rule (per [PDR-027](../../practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md)
and the 2026-05-17 structural refactor): the Latest identity column carries
only the **latest** identity — `agent_name / platform / model / session_id_prefix /
last_session`. Full per-thread identity history and per-session context live
in each thread's next-session record.

[main-critical]: threads/main-critical-sonar-remediation.next-session.md
[observability]: threads/observability-sentry-otel.next-session.md
[agentic]: threads/agentic-engineering-enhancements.next-session.md
[connecting]: threads/connecting-oak-resources.next-session.md
[oer]: threads/exploring-open-education-resources.next-session.md
[budget]: threads/architectural-budget-system.next-session.md
[cloudflare]: threads/cloudflare-mcp-security-and-token-economy-plans.next-session.md
[sector]: threads/sector-engagement.next-session.md
[eef]: threads/eef.next-session.md

## Next Safe Steps

### EEF First-Feature Delivery (active — sole current focus)

Per owner direction 2026-05-22, the active lane is delivery of the first
user-facing EEF MCP feature, **`eef-explore-evidence-for-context`**, at
graph-mvp-arc **gate-1a**. The executable path is the strategic-brief
addendum
[`gate-1a-delivery-parallel-execution-addendum.plan.md`](../../plans/connecting-oak-resources/knowledge-graph-integration/current/gate-1a-delivery-parallel-execution-addendum.plan.md)
authored by Cirrus Circling Plume on 2026-05-21 — dependency-graph-dictated
4-round structure, file-disjoint per-round partitions, ~8–11 hours
wall-clock from authorisation through first tool shipped. Substrate
predecessor chain: Inc.1a (WS2.2 jsonld-compatible + WS2.3 + WS3.3
adjacency primitives) → Inc.1b (WS4.1 graph-corpus-sdk scaffold + WS4.2
Threads adapter) → Inc.1c (WS4.3 query proof) → Inc.1d (WS4.4 GraphView
interface + WS4.5 EefStrandsGraphView adapter) → first-feature ff1–ff6.
Predecessor blocker: **PR #108 is merge-blocked on quality-gate snagging**
per [`pr-108-snagging.plan.md`](../../plans/connecting-oak-resources/knowledge-graph-integration/current/pr-108-snagging.plan.md);
either complete the snagging plan on the current branch and merge clean,
or merge after a green-gate rebase.

Detailed substrate routing is in the `Connecting-Oak-Resources` sub-section
below (now framed as the executable lane delivering EEF first-feature, not
as a standalone active thread).

### Active Cross-Thread Program (2026-05-14 — sequence-live; PAUSED 2026-05-22 under EEF priority)

**Sequence routing**: defer to
[`token-remediation-p8-parallel-program.plan.md`](../../plans/agentic-engineering-enhancements/current/token-remediation-p8-parallel-program.plan.md)
for the four-step owner-stated program: (1) finish token work →
(2) singleton-lane remediation → (3) P8 to acceptance →
(4) cost-of-collaboration residual and graph foundations in parallel.
**Current step: 2** (Step 1 closed at WS2 boundary 2026-05-14). Sessions
advancing the program MUST update the program's §Current Snapshot per its
Anti-Decay Handoff Clause.

**2026-05-19 lens-applied override (Shaded Passing Candle)**: program
advancement rule is **superseded for graph priority**. Step 3 (P8 TUI),
Step 4A (cost-of-collab P6/P7), and hardening tail waves 2–6 defer past
graph. Step 2 lean scope (WS0+WS1+WS2+WS3) plus graph-stack Inc.1a/1b plus
graph-query-layer plus hardening tail wave 1 form the gating set. See
`threads/agentic-engineering-enhancements.next-session.md § Lens-Applied
Sequence` for the authoritative gating list and rationale.

### Agentic-Engineering Enhancements (PAUSED 2026-05-22 under EEF priority)

Owner direction: program-step 2 next — singleton-lane remediation. Step 1
closed at the WS2 inclusive boundary: WS1 (`ws1-token-measurement`) landed
at `7a050c2a`, WS2 (`ws2-token-frontmatter`) landed at `72d31ca8` with
ADR-144 amended in place, and the program snapshot updated at `737942c0`.
Controlling plan for Step 2:
[`start-right-team-singleton-lane-remediation.plan.md`](../../plans/agent-tooling/current/start-right-team-singleton-lane-remediation.plan.md).
**Status update 2026-05-20 (Shaded Creeping Cloak)**: WS0 baseline
disposition is owner-approved (reviewer dispatch complete; assumptions
APPROVE, fred GO-WITH-CONDITIONS condition 1 absorbed, condition 2
invalid). WS1 opening is partial-in-flight (Register Presence template
amended; first-overlap response naming owed). **Next safe step**:
complete WS1 (name the first-overlap response: route proposal / one
provisional reconciler / support roles by boundary / silent default /
closeout owner; run markdownlint; run the parent plan's rg validation),
then WS2 (claim-overlap routing signal), then WS3 (canonical comms path
interface plus the atomic manifest.json:200 co-change required by
architecture-expert-fred condition 1). After WS3 lands, multi-vendor
parallel fan-out opens for graph-stack Inc.1a remaining cycles plus
the two `due` PDR drafts on a separate agent or session.

P8 remains the paused active collaboration spine, not complete. P0,
P-Foundation, P1, P2, P3, P4, and P5 are complete. The P8 operator-value and
smallest interaction-hardening slices landed at `2791be3c` and `6e804485`.
Resume mandatory P8 live collaboration TUI from `p8-attention-state` after the
token-cost lane unless newer owner direction changes the sequence. P8 must not
be called complete until the plan's `P8-A1` through `P8-A4` proof contract is
satisfied. P6/P7 resume after the P8 operator-view path unless owner direction
changes.

Agentic-engineering collaboration sequence for the next session:

1. **Owner-selected implementation lane** — land the completed WS1 bundle, then
   complete
   [`fitness-token-measurements-and-frontmatter-mandation.plan.md`](../../plans/agentic-engineering-enhancements/current/fitness-token-measurements-and-frontmatter-mandation.plan.md)
   from WS2 through WS6 in dependency order.
2. **Paused active spine** — P8 `p8-attention-state` remains open and resumes
   after token-cost unless the owner reprioritises.
3. **Strategic exercise lane** — if the owner asks to exercise the
   external-substrate learning plan, open
   [`external-skills-substrate-learning.plan.md`](../../plans/agentic-engineering-enhancements/future/external-skills-substrate-learning.plan.md),
   create the decided candidate register, review C1/C2 for Practice fit and
   existing homes, then stop before C3-C8 adoption work. This does not supersede
   the token-cost next-session route unless owner direction explicitly says it
   does.
4. **Guardrail lane** — use
   [`completion-claim-proof-pipeline.plan.md`](../../plans/agentic-engineering-enhancements/current/completion-claim-proof-pipeline.plan.md)
   to keep P8/P5 completion language evidence-bound.
5. **Team-remediation planning lane** — the N=7 WS1 self-organisation
   experiment produced a first-pass remediation plan:
   [`start-right-team-singleton-lane-remediation.plan.md`](../../plans/agent-tooling/current/start-right-team-singleton-lane-remediation.plan.md).
   It is not decision-complete; first safe step is owner/reviewer review, then
   WS0 baseline disposition. It does not supersede the token-cost commit
   boundary unless owner direction explicitly changes the sequence.
6. **Knowledge-graduation disposition lane** — **COMPLETE 2026-05-14**.
   The cross-platform graduation triage plan executed all owner-approved
   scope: Batches A/B/C landed at commit `c6008dee`; all five D1–D5
   amendments landed after owner per-diff review (commits `22d1980d`,
   `54425b6d`, `7821636b`); PDR-060 (Tooling Friction Is First-Class User
   Feedback) landed in closeout commit `0b585435`. Both plans archived
   to `.agent/plans/agentic-engineering-enhancements/archive/completed/`.
   Plan-pre-empted substance remains held against the singleton-lane
   plan; the paused coordinator-PDR stays paused.

Team collaboration research from the P8 controller window now has focused
artefacts: `start-right-team`, proposed ADR-181, the
`team-start-ritual-and-action-trace-2026-05-14.md` research note, and a
conditional team/sole-contributor branch in `session-handoff`. This advances
the agent-collaboration practice surface only; it does not change the next
P8 implementation target.

Current closeout note: the WS1 token-measurement team converged on one coherent
implementation and reported green acceptance evidence, but the session exposed
coordination friction: duplicate WS1 claims opened in parallel, one
consolidation pass initially missed live claims by probing `.active_claims`
instead of `.claims`, stale comms retention cleanup overlapped the WS1 window,
and a transient peer-staged rename made git/index work unsafe until the final
staged diff cleared. The working tree still contains source plus
collaboration-state residue. This handoff captures the positives, blockers,
and exact next step without starting WS2.

Completion-proof lane: continue from
[`completion-claim-proof-pipeline.plan.md`](../../plans/agentic-engineering-enhancements/current/completion-claim-proof-pipeline.plan.md).
The first implementation slice is doctrine/skill level only:
`completion-claims-must-match-plan` plus the smallest `jc-plan` proof-contract
and template amendment. This lane exists to prevent recurrence of the P5/P8
false-completion reports; it must preserve the distinction between
`partial-slice-landed`, `pending`, and `complete`.
The suspected flaky tests
listed in
[`cost-of-collaboration.flaky-tests.md`](../../plans/agent-tooling/current/cost-of-collaboration.flaky-tests.md)
are disposed as not reproduced, and representative busy-checkout cold/warm
`pnpm check:profile` baselines are green. Do not reopen the "make pre-commit
staged-only" framing. The preserved evidence and trigger map live in
[`pnpm-check-profiling-deep-dive-2026-05-12.md`](../../plans/agent-tooling/pnpm-check-profiling-deep-dive-2026-05-12.md);
the implementation tasks live in
[`cost-of-collaboration.plan.md`](../../plans/agent-tooling/current/cost-of-collaboration.plan.md).
P2 committed through the normal pre-commit hook after formatting the new source
files; do not preserve the earlier `codex-exec` dirty-tree blocker as current
state.

Workflow skill review lane remains available but is not the immediate
cost-of-collaboration continuation: the paired `jc-session-handoff` /
`jc-consolidate-docs` and `jc-metacognition` remediation pass is complete;
remaining skills can resume from the thread record if the owner reopens that
lane.

Conservation-first consolidation is staged across four sessions by owner
direction. The active napkin was processed first: the outgoing file was archived
intact as
[`napkin-2026-05-12b.md`](../active/archive/napkin-2026-05-12b.md), and its
behaviour-changing learning was distilled into
[`distilled.md`](../active/distilled.md) without treating fitness numbers as
brevity targets. The distilled-stage pass is now complete: mature lessons were
routed to durable doctrine and pattern homes, and unresolved or owner-shaped
items were kept in [`pending-graduations.md`](pending-graduations.md). The
`pending-graduations.md` pass is also complete: the due queue is empty, stale
body statuses are corrected, and remaining pending items are explicitly retained
by trigger/carrier. The next consolidation session should process
`practice-bootstrap.md`. At every stage, knowledge curation and conservation
outrank brevity; fitness numbers are advisory routing signals.

The acceptance bar remains:

- live state remains in this file;
- historical closeout prose remains archived, not deleted;
- distilled learning and pending-graduations are fully processed;
  practice-bootstrap is the next drain;
- pending-graduations index/counts match body entries marked `status: due`;
- ADR-shaped and PDR-shaped promotion decisions are visible to the owner;
- cost-of-collaboration P0 remains named as the blocker for multi-agent
  implementation windows.

Implementation lane after profiling and consolidation: follow the thread
record's cost-of-collaboration opener. P0, P-Foundation, P1, P2, P3, P4, and
P5 have landed; mandatory P8 live collaboration TUI is the next implementation
step.

### Connecting-Oak-Resources (substrate execution lane for EEF First-Feature Delivery)

This sub-section retains the detailed graph-substrate next-step routing.
Per owner direction 2026-05-22, the work continues but is framed as the
executable path delivering EEF first-feature gate-1a, not as a standalone
active thread. Detail continues from
[`threads/connecting-oak-resources.next-session.md`](threads/connecting-oak-resources.next-session.md).

**🛑 IMMEDIATE NEXT STEP — PR #108 quality-gate snagging plan**: PR #108 is failing CodeQL (alert #90) + SonarCloud Quality Gate (40 issues, 12 hotspots, 6.0% duplication). The snagging plan at [`.agent/plans/connecting-oak-resources/knowledge-graph-integration/current/pr-108-snagging.plan.md`](../../plans/connecting-oak-resources/knowledge-graph-integration/current/pr-108-snagging.plan.md) is the authoritative execution surface — `type: quality-fix`, `status: planning`, 12 cycles, per-finding disposition ledger, aligned with `docs/governance/sonar-disposition-policy.md` and `.agent/rules/never-disable-checks.md`. **Substantive graph implementation work (Inc.1a WS2.2/WS2.3/WS3.3, Inc.1b, Inc.1c, Inc.1d) on PR #108 is parked behind the snagging plan landing.** The next session opening this thread should: (1) read the snagging plan; (2) decide between completing it on `feat/mcp-graph-support-foundation` before merge OR rebasing the substantive cycles onto a fresh branch after PR #108 merges clean; (3) execute Phase 0 (disposition ledger commit) as the first cycle.

**Current state (2026-05-21 close, second session of the day)**: Inc.1a
is **half-complete on the first parallel-pair**: WS3.2 LANDED at
`abe6fcb3` (Foamy Charting Fjord, claude opus-4-7-1m, session 86dbd1)
plus chore(plan) record at `35b49858`. WS2.2 NOT landed this session —
owner-directed mid-session pivot to all-channels comms CLI work
(see `agentic-engineering-enhancements` thread). Landed cycles: WS0
(5ec5004d), WS1.1 (ad2abb69), WS1.2 (1885fbcf), WS1.3 (87e21125), WS1.4
(95f42cb7), WS1.5 (ebd0e8dc), WS1.6 (3add41f9), WS2.1 (0f895070), WS3.1
(84bfffa5), WS3.2 (abe6fcb3). Inc.1a remaining: 3 cycles (WS2.2, WS2.3,
WS3.3).
**Next safe step (post-Cirrus six-agent team session 2026-05-21 evening)**: **the Inc.1d EEF concurrent-tenant amendment-set has LANDED at `0cdaf58c`** (7 files, +657/−129; per-slice PDR-044 vocabulary + integrated coherence pass + atomic commit; all gates green). Substrate dependencies remain unchanged: resume Inc.1a completion (WS2.2 jsonld-compatible + Turtle/SKOS parser, WS2.3, WS3.3 adjacency primitives), then Inc.1b (WS4.1 graph-corpus-sdk scaffold + WS4.2 Threads adapter) and Inc.1c (WS4.3 query proof). Inc.1d (WS4.4 GraphView interface + WS4.5 EefStrandsGraphView adapter) opens once Inc.1a + WS4.1 + WS4.2 + WS4.3 land per the amendment-set's sequencing. Three remaining specialist reviewers still required at Inc.1d authoring time per the prior thread record: **type-expert** (load-bearing for the `Result<T, NotImplementedYet>` variant typing across 5 EEF stub operations + `DeepKeyPath<TNode, Depth>` recursive type + array-stop discipline); **architecture-expert-betty** for the GraphView placement (already resolved to `packages/core/graph-core/src/graph-view/` per the amendment-set; verify holds at WS4.4 author time); **assumptions-expert** for the sparse-relations-on-manifest WS4.5 stub criterion. After Inc.1d landing,
Inc.1b (WS4.1 scaffold + WS4.2 Threads adapter) + Inc.1c (WS4.3 query
proof) + Inc.1d (WS4.4 GraphView interface + WS4.5 EEF adapter — new
sub-increment per the 2026-05-21 amendment). Then the three
pieces of session-output that remained in the working tree from earlier
2026-05-21 sessions: (a) Molten's WS3.3 atomic bundle on
`packages/libs/graph-project/src/adjacency/**` (3 files, 22/22 green,
three in-cycle reviewers absorbed clean — see thread record);
(b) Celestial's `start-right-team` SKILL update encoding the new
inherited-tree gate-verification First Move and the dialogue-over-
competition vocabulary reframe; (c) Pelagic's `apps/oak-search-cli`
bug fixes — verify post-cascade-clear which of these are still in the
tree vs absorbed into the v0.7.0 cascade-clear commits. After the cascade
clears, three pieces of session-output remain in the working tree from
the 2026-05-21 three-agent session and should land as separate
follow-on commits: (a) Molten's WS3.3 atomic bundle on
`packages/libs/graph-project/src/adjacency/**` (3 files, 22/22 green,
three in-cycle reviewers absorbed clean — see thread record);
(b) Celestial's `start-right-team` SKILL update encoding the new
inherited-tree gate-verification First Move and the
dialogue-over-competition vocabulary reframe;
(c) continuity-state updates (this file, thread record, napkin,
pending-graduations). After all of that, **then** resume WS2.2 —
`packages/libs/graph-ingest/src/jsonld-compatible/**` plus a Turtle
parser location (recommended: new `src/turtle/` sub-path peer to the six
WS2.1 pre-declared barrels; n3.js is the W3C-aligned Turtle parser
choice). Lands §Test discipline invariant #2 contract test (every
emitted edge predicate is `NamedNode`, never a bare string). The next
team session may also dispatch WS2.3 ↔ WS3.3 in parallel per plan §Cycle
dependencies; single-agent through WS2.2 → WS2.3 → WS3.3 remains the
explicitly preferred default. The empirical two-agent collaboration
shape (shared physical checkout, coordination via active-claims + comms
on disjoint workspace trees) is now confirmed WORKING from earlier
2026-05-21 sessions; the three-agent shape (Celestial + Molten +
Pelagic) is also confirmed WORKING for coordination, with the
inherited-tree-state failure mode (cascade-discovered-late) now
structurally cured in the updated `start-right-team` SKILL First Moves.
Multi-vendor open of the thread remains forbidden until WS3.3 lands.
Inc.1a continues under the 2026-05-12 holistic re-plan (`f73c42f5`):
WS1.8 is deferred to Inc.2.

**Deep consolidation status**: **deep-graduation pass completed this handoff (Shadowed Hiding Shade 2026-05-22, commit `a49e7a21`)** — owner-direction-triggered drain of the pending-graduations register. 8 Tier A graduations, 9 Tier B captures, 5 Tier C audit-trail markers landed. Pre-existing CRITICAL fitness pressure on `pending-graduations.md` + `distilled.md` partially relieved by status flips and graduation landings; further drain remains DUE for a dedicated next session if pressure persists. Earlier same-day pass (Starlit Beaming Aurora) is preserved below as historical context.

**Deep consolidation status (Starlit Beaming Aurora earlier 2026-05-22)** —
plan archive + thread-register audit + collaboration-state audit + fitness-pressure assessment. NOT a full
multi-session deep drain — that remains DUE for a deliberate next session. This pass:
(a) archived completed `commit-queue-intent-scope-discipline.plan.md` to `archive/completed/`;
(b) verified thread-register freshness via the six checks (agentic-engineering-enhancements thread:
identity row `last_session: 2026-05-22` updated for Starlit Beaming Aurora; no stale/orphan/missing/expired/
duplicate findings);
(c) verified collaboration state clean (active-claims.json empty; all three session claims closed in-session);
(d) added one PDR-shaped pattern candidate to `pending-graduations.md` (cycle-decomposition-wrong-layer-scaffolding;
status pending, awaiting second instance);
(e) updated thread record + repo-continuity Active threads identity summary + new Session Outcome on the thread;
(f) ran `pnpm practice:fitness:informational` — surfaced significant CRITICAL fitness pressure on
`distilled.md` (895L/49992C), `pending-graduations.md` (4329L/306632C), `napkin.md` prose-line-width, and
`repo-continuity.md` Characters + prose-line-width; reflowed THIS session's contributions to napkin + repo-
continuity to remove avoidable prose-line-width pressure, but pre-existing CRITICAL pressure on
`pending-graduations.md` + `distilled.md` remains unaddressed and is a candidate for a dedicated drain session.
**Carry forward for next consolidation**: pending-graduations.md drain (4329 lines, 4329/1125 critical ratio
~3.85x); distilled.md substantive graduation pass (entries ready for permanent homes); historical-napkin
synthesis (multiple archived rotations available since last marker).

**`pnpm check` cleanliness gate** (Step 11 of `session-handoff`): pending verification post-handoff edits. Salty's pre-commit hook chain at `0cdaf58c` was green across 87/87 turbo tasks on the planning-files-only bundle; the post-commit working tree still carries the inherited residual (Molten WS3.3, Pelagic bulk-download, agent-tools surface, ADR-173 touch) that was NOT in scope of the four-slice partition. Will be re-verified before this handoff is declared complete.

**WS1.5 status (2026-05-13, Quiet Stalking Mirror)**: design fully absorbed inline in
the active graph-stack plan under `ws1-canon`. Three-reviewer pre-implementation
pass complete (code-expert APPROVE-WITH-NITS; assumptions-expert
GO-WITH-CONDITIONS; architecture-expert-betty GO-WITH-RESHAPE). Owner-stated
doctrinal rules (`no aliases, no fallbacks, fail fast and hard with helpful
error message, replace old with new`) recorded in plan body; URDNA2015 → RDFC-1.0
plan-text remediation applied in §ws1-canon and §Build-vs-Buy Attestation.
Implementation did NOT land in this session. Resume by: (1) verifying the
owner-known closeout bundle (pnpm/dependency refresh + P8 foundation repair —
see Agentic lane note above) has landed and the lockfile is clean; (2) adding
`rdf-canonize@^5` to `packages/core/graph-core/package.json` direct deps and
regenerating the lockfile; (3) implementing `src/canon/{runtime.ts,
canonicalize.ts, index.ts}` exactly to the absorbed design; (4) running the
five tests atomic-landing with product; (5) plan-text remediation already
applied so no follow-up doc churn required. Reviewer flags for the
implementation cycle remain type-expert (rdf-canonize wrapper shape + literal
preservation) and test-expert (deterministic order across blank-node fixtures).

## Open Owner-Decision Items

1. `practice.md` HARD character pressure remains owner-gated under the Core
   care-and-consult rule. Falsifiability:
   `pnpm practice:fitness:strict-hard`.
2. [`pending-graduations.md`](pending-graduations.md) is a consolidation-pass
   queue, not a daily session-open file. Its 2026-05-12 due queue is drained;
   future passes should preserve pending entries until their trigger fires and
   must not trim for metrics.
3. Monorepo workspace topology (superseding ADR-108, S0-S6 strategic plan) is
   parked until after the graph MVP implementation tranche unless the owner
   explicitly reopens it.
4. Cost-of-collaboration P0, P-Foundation, P1, P2, P3, P4, and P5 are
   complete; P1 landed at `f88d0d67`, P2 at `0d3af914`, P3 at `c083a1ab`, P4
   at `1bb369a5`, and the P5 DI/no-IO repair at `07ffee1d`.

## Repo-Wide Invariants / Non-Goals

Each invariant below has a canonical home; this section is a resume aid, not
the authority.

- no compatibility layers; replace, do not bridge —
  [`replace-dont-bridge`](../../rules/replace-dont-bridge.md);
- distinct architectural layers live in distinct workspaces —
  [ADR-154](../../../docs/architecture/architectural-decisions/154-separate-framework-from-consumer.md)
  and [`principles.md`](../../directives/principles.md);
- TDD at all levels —
  [`tdd-as-design.md`](../../directives/tdd-as-design.md);
- tests prove product behaviour, not configuration or file presence —
  [`testing-strategy.md`](../../directives/testing-strategy.md);
- strict boundary validation only —
  [`strict-validation-at-boundary`](../../rules/strict-validation-at-boundary.md);
- no `process.env` read/write in test files or setup files —
  [`no-global-state-in-tests`](../../rules/no-global-state-in-tests.md);
- `--no-verify` requires fresh per-invocation owner authorisation —
  [`no-verify-requires-fresh-authorisation`](../../rules/no-verify-requires-fresh-authorisation.md);
- no warning toleration —
  [`no-warning-toleration`](../../rules/no-warning-toleration.md);
- owner direction beats plan —
  [`AGENT.md`](../../directives/AGENT.md);
- curriculum data in this monorepo comes only through the published Oak Open
  Curriculum HTTP API and generated SDK;
- knowledge preservation is absolute — writing to shared-state knowledge
  surfaces is never blocked by fitness limits —
  [PDR-026](../../practice-core/decision-records/PDR-026-per-session-landing-commitment.md);
- shared-state files are always writable and commit-includable regardless of
  active claims —
  [`respect-active-agent-claims`](../../rules/respect-active-agent-claims.md).
- current memory/state files should be included in every commit when dirty —
  owner clarification, 2026-05-12.

Current branch non-goals:

- do not reopen broader canonicalisation opportunistically;
- do not guess Vercel, Sentry, SonarCloud, or GitHub state before checking
  primary evidence;
- do not treat monitor setup or owner-handled preview validation as in-repo
  acceptance work.

## Deep Consolidation Status

**Status (2026-05-22 — Blustery Lifting Plume coordinator team session / `claude` / Opus 4.7 / `d4aad7` + team: Foamy `1c0db8`, Ferny `b282b8`, Flamebright `9a01f3`, Veiled / Salty / Midnight `019e4e`)**: **performed inline — multi-agent team session executed deep consolidation under owner direction at session-close**, with Ferny Swaying Leaf as consolidation specialist routed by coordinator event 09:35:57Z, and Blustery landing a branch-concurrency manifest at directed event 10:00:55Z under owner direction "update all relevant plans and continuity surfaces to make the parallel work explicit". Owner subsequently refined the criterion to "describe what highly parallel work is possible, not how it is carried out or by whom", and Blustery superseded the branch-concurrency manifest with a top-level meta plan at [`feat-mcp-graph-support-foundation-meta.md`](../plans/feat-mcp-graph-support-foundation-meta.md) — the earlier manifest had operational drift (Stream framing, Path 1/2/3 merge ordering, coordinator-structure heuristics) which did not match the refined criterion.

**Final closeout this session**: Blustery as the sole remaining team member committed (a) the meta plan, (b) tightened plan amendments (cross-reference the meta plan, drop operational framing) across `pr-108-snagging.plan.md`, `eef-first-feature.plan.md`, `graph-stack.plan.md`, (c) the four PDR drafts (`PDR-063..066`) as preserved artefacts — PDR-064 cures landed, PDR-063/065/066 cures paused mid-work awaiting owner Q1/Q2/Q3 routing, (d) this closeout entry.

**Branch pickup pointer for any future session joining `feat/mcp-graph-support-foundation`**: read [`.agent/plans/feat-mcp-graph-support-foundation-meta.md`](../plans/feat-mcp-graph-support-foundation-meta.md) FIRST — the meta plan names every plan currently in force on this branch, the cross-plan dependency picture, the file-scope partition (work-structure, not team-structure; no operational/team/branch-topology language), current state of work, entry points for different kinds of work, and the open owner-class structural questions on owner surface (PDR-063/065/066 routing Q1/Q2/Q3, ff1/ff2 owner actions, Cycle 8 policy-amendment authorisation, Cycle 10 path). Concurrent-execution shape was a 2026-05-22 amendment landing across `pr-108-snagging.plan.md`, `eef-first-feature.plan.md`, and `graph-stack.plan.md` — each cross-references the manifest and relaxes prior single-stream gates to permit parallel WS authoring.

Knowledge-graduation backlog (5 candidates) per Blustery directed event 7bbe719a: PDR-064 §Partial/Slice-Scoped Coordinator Transfer; coordinator-delegates-sub-agent-launches; CLI body backtick-shell-substitution cure (option 1 LANDED via `--body-file` at commit 675bb83b); hook-policy substring-matching cross-session pattern; Sonar MCP audit-trail visibility gap.

Session substance: (1) PR-108 quality-gate advancement — `new_security_hotspots_reviewed` moved 0% → 100% (12/12 SAFE dispositions: 11×S5332 in `packages/core/graph-core/` + 1×S4036 at `agent-tools/src/bin/agent-tools-cli-topics.ts:96`), CodeQL alert #90 dismissed pending CI, 5 mechanical commits landed on `feat/mcp-graph-support-foundation` (`77463a22` Cycle 1 / `73ab1624` Cycle 4.1 / `ca28bd83` Cycle 4.2 / `0c3df45b` Cycle 4.3 / `604f64b7` Cycle 4.4). (2) Three PDR-064 two-moments coordinator-handoff instances in one session (Flamebright → Ferny slice; Flamebright → Ferny full; Ferny → Blustery full) — 3-instance trigger fired; PDR-064 §"Partial / Slice-Scoped Coordinator Transfer" amendment ready to graduate. (3) Owner correction on coordinator-vs-implementer discipline — sub-agent dispatches are implementer-class work, not coordination; 2-instance correction (Ferny + Blustery) fired the graduation trigger. (4) PDR-063..066 drafted, reviewed (architecture-expert-fred + assumptions-expert), partially cured (PDR-064 only); cures for PDR-063/065/066 deferred owner-class to next session under open Q1/Q2/Q3 routing. (5) Sonar MCP three-path unblock catalogue durable in napkin: Claude `/mcp` reconnect, `docker mcp gateway --profile sonarqube_oak` for Codex, denied `mcp-add` (auto-mode self-modification). (6) Consolidation pass produced 3 new `pending-graduations.md` entries (Sonar MCP audit-trail visibility gap; CLI body backtick-shell-substitution cure 3+ instance cross-session; hook-policy substring-matching 3+ instance cross-session); `eef.next-session.md` updated with session-2026-05-22 substantive progress block + Last refreshed attribution; this status block.

Roster outcomes: Codex side cleared (Veiled / Salty / Midnight team-member closeouts); Claude side held in pause under owner direction. Open owner-class items carried forward: Q1 portability migration surface; Q2 PDR-065 `[DOCTRINE]` tag mechanism; Q3 PDR-065 `fast_bootstrap_eligible` frontmatter field. Uncommitted in working tree: PDR-064 cures + three uncured PDR drafts (PDR-063/065/066) + napkin entries from this session. `distilled.md` additions deferred to explicit owner go-ahead per "owner-approved matured entries" gate. Prior status preserved below for the audit trail.

**Follow-on inline consolidation (2026-05-22 — Tempestuous Spiralling Thermal / `claude` / Opus 4.7 (1M) / `9205b8`)**: completed this handoff. (1) Substrate-completion graduations — 4 entries from `pending-graduations.md` landed to permanent homes across two complementary commits (`c7fd0b7b` Shaded-absorbed coherence bundle covering PDR-064 §"Partial / Slice-Scoped Coordinator Transfer" amendment + start-right-team SKILL "Coordinator delegates sub-agent launches" amendment + new `.agent/rules/hook-policy-substring-discipline.md` + `.claude/` + `.cursor/` adapters + RULES_INDEX entry + archive header + 4 entry bodies; `20fcf565` Wooded-pass complementary covering pending-graduations.md graduation-log table + 4 graduated-pointers). Status counts moved 5 due → 1 due (remaining: `canonical-tool-definitions-code-adjacent`, plan-execution-gated on `coordination-watcher-canonicalisation` plan). (2) `distilled.md` audit-trail rotation (`53b00386`) — 4 earlier graduation blocks (2026-05-06, 2026-05-09 Woodland Sheltering Glade, 2026-05-10 Quiet Lurking Mask, 2026-05-11 Verdict-not-menu Flamebright Burning Lava) moved to `archive/distilled-graduations-log-2026-05-14.md` "Backfill rotation 2026-05-22" section with full substance preservation; distilled.md 919L → 874L. Further trim deferred — Recently-Distilled entry settling assessment is substantive judgement work requiring a separate session.

Prior session statuses (Soaring Flying Gale 2026-05-22, Feathered Circling Horizon 2026-05-21) archived to [`archive/repo-continuity-session-history-2026-05-22.md`](archive/repo-continuity-session-history-2026-05-22.md) by the Wooded Swaying Thicket 2026-05-22 drain. Per split_strategy, only the most-recent deep-consolidation status entry remains live here; earlier statuses live in the archive snapshots below.

Previous deep-consolidation and session-close prose lives in:

- [`archive/repo-continuity-session-history-2026-05-22.md`](archive/repo-continuity-session-history-2026-05-22.md)
- [`archive/repo-continuity-session-history-2026-05-17.md`](archive/repo-continuity-session-history-2026-05-17.md)
- [`archive/repo-continuity-session-history-2026-05-12.md`](archive/repo-continuity-session-history-2026-05-12.md)
- [`archive/repo-continuity-session-history-2026-05-10.md`](archive/repo-continuity-session-history-2026-05-10.md)
- [`archive/repo-continuity-session-history-2026-05-07.md`](archive/repo-continuity-session-history-2026-05-07.md)
- earlier dated archive files under [`archive/`](archive/)
