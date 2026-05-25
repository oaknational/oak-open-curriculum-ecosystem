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

- Current branch: `feat/education-evidence-foundational-graphs-take2`.
- Current local HEAD: `9f706f17`
  (`chore(memory): record hardening-arc consolidation full-arc landing in napkin (Phase 6)`;
  Hushed Stalking Shade / `bc0a07` consolidation closeout).
- PR #114 merged at `77fcf746` (post-m1-attestation-tidy-up landing). PR #108
  merged earlier at `2462952a`. M1 + M2 milestones both achieved. Owner has
  explicitly pivoted back to graph work (2026-05-25).
- **Hardening-arc consolidation complete 2026-05-25 (4 commits on this branch,
  not yet pushed)**. Phases 1+2+4+5+6 of the `harmonic-fluttering-bentley`
  consolidation plan landed; Phase 3 (comms-event retention pass) explicitly
  deferred under standing direction below. Commits: `4e333441` (Phase 1 status
  reconciliation across hardening + tidy plans), `f3f520ce` (Phase 2 PDR-077 +
  PDR-079 graduations + archive bodies), `650afb08` (Phase 4+5 archive tidy +
  hardening plans + promote new `comms-watch-storage-redesign.plan.md`),
  `9f706f17` (Phase 6 napkin closeout). Reviewers next per owner direction.
- **NEW STANDING DIRECTION 2026-05-25 (binding until comms research plan
  completes)**: comms-file retention has been INCREASED (the previous 7-day
  rule no longer applies). **NO comms files are to be moved or deleted** until
  the comms research plan completes. The comms research plan lives on the
  `agent-collaboration-research` thread (currently owner-gated, buffered).
  Affects: all `.agent/state/collaboration/comms/` events; broadest-interpretation
  reading also affects `.agent/state/collaboration/comms-seen/` (the seen-state
  cursor substrate). Concrete consequence: WS3 of the new
  `comms-watch-storage-redesign.plan.md` is BLOCKED on this constraint
  clearing.
- **New plan promoted**:
  [`comms-watch-storage-redesign.plan.md`](../../plans/agent-tooling/current/comms-watch-storage-redesign.plan.md)
  in `agent-tooling/current/` — covers WS2 + WS3 of the comms-watch trilogy
  (WS1 landed at `75e47923` via tidy cycle 9). Strategic substance lifted
  verbatim from archived hardening program §P5.W1. Queued, not active.
- **Plans archived 2026-05-25** to
  [`agentic-engineering-enhancements/archive/completed/`](../../plans/agentic-engineering-enhancements/archive/completed/):
  `post-m1-attestation-tidy-up.plan.md` + `practice-infrastructure-hardening-program.plan.md`.
  Supersession mappings recorded in that directory's README per
  `consolidate-docs` plan-supersession discipline.
- Active claims at the 2026-05-25T06:40Z refresh include stale Estuarine,
  Sylvan, and Misty claims plus Eclipsed's fresh Cycle 9 claim and an older
  fresh plan-file claim from Eclipsed. Refresh claims before any edit or
  commit-window work.
- Critical and hard fitness pressure is currently drained. Shadowed's
  2026-05-25 consolidation closeout recorded
  `pnpm practice:fitness:informational` and
  `pnpm practice:fitness --strict-hard` both exiting 0 with `SOFT (20 soft)`.
- Recent active napkin rotations are preserved under
  [`archive/`](../active/archive/). The current active napkin remains healthy
  after Pelagic curation slices; preserve and route new lessons there before
  any mechanical archive step.
- Remaining consolidation pressure is tracked by
  [`memory-surface-critical-drain-2026-05-24.plan.md`](../../plans/agentic-engineering-enhancements/current/memory-surface-critical-drain-2026-05-24.plan.md).
  Phase 2 and Phase 3 remain open for active-shard processing and distilled
  home-gap review; Phase 4 validates the hard/critical objective only.
- Unprocessed live queue bodies split out of `pending-graduations.md` now live
  in active shards under
  [`pending-graduations/`](pending-graduations/). These shards are not
  archives; process every entry before removing its live pointer.
- Historical Current State prose removed from this live index is preserved
  verbatim at
  [`repo-continuity-current-state-2026-05-24-shaded-silencing-dusk.md`](archive/repo-continuity-current-state-2026-05-24-shaded-silencing-dusk.md).
- The outgoing pre-Dusky soft-tier live file snapshot is preserved at
  [`repo-continuity-soft-tier-pre-dusky-2026-05-24.md`](archive/repo-continuity-soft-tier-pre-dusky-2026-05-24.md).
- Current working tree is very dirty with peer-owned continuity/config/state
  changes and fresh comms events. Hushed owns commit-marshal work; treat
  `git status --short`, active claims, comms, and the queue as live truth
  before any commit-window work.
- New 2026-05-25 closeout addition (Briny Fathoming Dock `95a27b`, no
  implementation per owner direction):
  [`role-emission-citation-binding.plan.md`](../../plans/agentic-engineering-enhancements/current/role-emission-citation-binding.plan.md)
  landed in `current/` with full 6-reviewer pre-execution pass complete and
  consensus absorbed (path B narrowed v1: Director + Heartbeat-emitter
  required scope; ADR-188 status Proposed; lifecycle kind included;
  wilma's HIGH migration findings absorbed). DECISION-COMPLETE pending
  owner execution direction. Plan-tree discoverability updated in
  `current/README.md`. Session insights captured in napkin pending
  graduation (recursive meta-cure shape; doctrine-by-analogy
  self-instance; reviewer fan-out cost-imbalance lesson; status maturity
  inversion lesson). Staged for Hushed Marshal commit.

## Active Threads

A **thread** is the continuity unit. Full identity tables and lane state live in
each thread record; this table is the repo-level index.

Per owner direction 2026-05-22, the only currently active product thread is
**EEF first-feature delivery**. The temporary Knowledge Curator work in this
session is an agentic-engineering consolidation lane and does not reactivate the
paused implementation program.

| Thread | Purpose | Record | Latest identity |
| --- | --- | --- | --- |
| `eef` | EEF first-feature delivery | [record][eef] | Secret Vanishing Wisp / claude / claude-opus-4-7 / 981cbe / 2026-05-23 |
| `agentic-engineering-enhancements` | Practice continuity and post-M1 tidy-plan delivery | [record][agentic] | Hushed Stalking Shade / claude / claude-opus-4-7 / `bc0a07` / hardening-arc consolidation closeout / 2026-05-25 |

## Paused Threads

Paused threads retain their next-session records and identity history; they are
not the current session-priority lane. Reactivation is owner-directed.

| Thread | Purpose | Record | Latest identity |
| --- | --- | --- | --- |
| `connecting-oak-resources` | Oak resource graph substrate for EEF | [record][connecting] | Salty Mooring Dock / cursor / Composer / dc4dd7 / PR #114 preview MCP smoke scripts / 2026-05-25 |
| `branch-fitness-and-push-cadence` | Small-PR, push-often, branch-fitness, PR/Sonar monitoring protocol substrate | [record][branch-fitness] | Pelagic Snorkelling Sextant / codex / GPT-5 / 019e5b / Cycle 1 substrate capture from active napkin / 2026-05-24 |
| `observability-sentry-otel` | Sentry/OTel integration | [record][observability] | Umbral Creeping Night / claude-code / opus-4.7 / 188baa / 2026-05-10 |
| `main-critical-sonar-remediation` | Sonar remediation | [record][main-critical] | Stormy / claude-code / unknown / 228bc5 / 2026-05-06 |
| `exploring-open-education-resources` | Third-party OER | [record][oer] | Gnarled / claude-code / unknown / e18e2c / 2026-05-01 |
| `sector-engagement` | External adoption | [record][sector] | Squally / cursor / unknown / unknown / 2026-04-30 |
| `architectural-budget-system` | Architectural budget | [record][budget] | Nebulous / codex / unknown / unknown / 2026-04-29 |
| `cloudflare-mcp-security-and-token-economy-plans` | Cloudflare MCP | [record][cloudflare] | Glassy / codex / unknown / unknown / 2026-04-28 |
| `agent-collaboration-research` | Comms-corpus pattern research (owner-gated buffer) | [record][collab-research] | Charcoal Brazing Kiln / claude / claude-opus-4-7 / 7c7327 / thread-record-author-post-m1-merge / 2026-05-24 |

Compact identity rule (per [PDR-027](../../practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md)
and the 2026-05-17 structural refactor): this table carries only the latest
identity. Full per-thread identity history and per-session context live in each
thread's next-session record.

[main-critical]: threads/main-critical-sonar-remediation.next-session.md
[observability]: threads/observability-sentry-otel.next-session.md
[agentic]: threads/agentic-engineering-enhancements.next-session.md
[connecting]: threads/connecting-oak-resources.next-session.md
[oer]: threads/exploring-open-education-resources.next-session.md
[budget]: threads/architectural-budget-system.next-session.md
[cloudflare]: threads/cloudflare-mcp-security-and-token-economy-plans.next-session.md
[sector]: threads/sector-engagement.next-session.md
[eef]: threads/eef.next-session.md
[collab-research]: threads/agent-collaboration-research.next-session.md
[branch-fitness]: threads/branch-fitness-and-push-cadence.next-session.md

## Next Safe Steps

### EEF First-Feature Delivery (active — sole current focus)

The 2026-05-22 → 2026-05-23 multi-agent gate-1a substrate-floor session is
closed out in the [`eef` thread record][eef]. Repo-level status, verified
2026-05-24 against that record:

- Round 1+2 substrate floor is effectively complete; WS4.1 landed at
  `3241893d` under Stormbound Spiralling Breeze's owner-directed
  ownership-override, so older repo-continuity notes treating Lunar's WS4.1
  as outstanding are stale.
- Remaining pickup state and the full cycle ledger live in the thread record,
  including the Sparking parser-integration follow-on, WS4.5/t2/t6a/ff3-ff6
  critical path, reciprocal-review evidence, and coordination-pattern
  surfacings routed to `pending-graduations.md`.
- This repo-level index should be treated as the routing pointer only; do not
  reconstruct the EEF lane from old duplicated prose here.

PR #108 / graph-substrate details live in the connecting-oak-resources thread
record and snagging plan. Historical long-form routing that previously lived
in this file is preserved in
[`repo-continuity-soft-tier-pre-dusky-2026-05-24.md`](archive/repo-continuity-soft-tier-pre-dusky-2026-05-24.md).

### Agentic-Engineering Tidy-Plan Lane

The current owner-provided goal is to complete and deliver
[`post-m1-attestation-tidy-up.plan.md`](../../plans/agentic-engineering-enhancements/current/post-m1-attestation-tidy-up.plan.md)
while optimising every decision for long-term architectural excellence.

Next safe step: let Eclipsed complete and enqueue Cycle 9. After Cycle 9 lands,
Wooded opens Cycle 10. Shadowed's handoff adds two readiness notes for later
cycles: Cycle 10 must satisfy its crash-hardening claim with a real fsync-capable
state writer or helper extension, and Cycle 11 must deliberately handle the
ADR-182 `comms-seen` reference before making a zero-reference cleanup claim.

The earlier consolidation hard/critical objective is complete for now
(`SOFT (20 soft)`). Deeper soft-tier consolidation remains useful but is not
the active delivery lane while tidy cycles 9-15 are in flight.

### Connecting-Oak-Resources / PR #108 Routing

`connecting-oak-resources` is paused as a thread but remains the graph-substrate
execution history for EEF. Current routing belongs in the thread record and
the PR #108 snagging plan, not duplicated here:

- [connecting-oak-resources thread record][connecting]
- [PR #108 snagging plan](../../plans/connecting-oak-resources/knowledge-graph-integration/archive/completed/pr-108-snagging.plan.md) (archived; gate cycles landed)
- [M1 Safe Pause program plan](../../plans/agentic-engineering-enhancements/current/practice-infrastructure-hardening-program.plan.md) (Gate 1 WS-7 authority)
- [gate-1a delivery addendum](../../plans/connecting-oak-resources/knowledge-graph-integration/current/gate-1a-delivery-parallel-execution-addendum.plan.md)

**Preview MCP validation**: PR #108 black-box pass documented 2026-05-24
(Velvet Stalking Moth). PR #114 branch adds a manual agent preview test checklist (see
[agent-preview-test-checklist.md](../../../apps/oak-curriculum-mcp-streamable-http/docs/agent-preview-test-checklist.md)
and [connecting thread § 2026-05-25 Salty Mooring Dock][connecting]). Sonar on
PR #114 was green after fake-test-path fixture fix at `2f5e1871`.

Before resuming product work, re-check current PR, CI, Sonar, CodeQL, active
claims, commit queue, and git state. Do not rely on historical issue counts in
archived prose.

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

Due — M1 Safe Pause / PR #108 closure already fires the consolidation trigger
checklist, and the post-M1 tidy-plan session has now added fresh comms
failure-mode and owner-priority-provenance material. This handoff does not run
`oak-consolidate-docs` because the owner requested session completion while
Cycle 9 is actively claimed by Eclipsed and Cycle 10 is pre-routed to Wooded.
Falsifiability for the next consolidator: re-check `git log --oneline -5`,
`git status --short`, active claims, active queue, the Seaworthy attestation
event, and the tidy-plan cycle ledger before starting.

Current live consolidation state is the 2026-05-24 Knowledge Curator drain:
the active napkin has been processed, the former critical
`pending-graduations.md` surface is now soft-only, and the active execution ledger is
[`memory-surface-critical-drain-2026-05-24.plan.md`](../../plans/agentic-engineering-enhancements/current/memory-surface-critical-drain-2026-05-24.plan.md).

Historical deep-consolidation status prose from 2026-05-22 and 2026-05-23 has
been processed into the current plan, thread records, archives, and live
pending routes. It is preserved verbatim at
[`archive/repo-continuity-session-history-2026-05-24.md`](archive/repo-continuity-session-history-2026-05-24.md)
§ "Historical Deep Consolidation Status Archived 2026-05-24".

Previous deep-consolidation and session-close prose lives in:

- [`archive/repo-continuity-session-history-2026-05-24.md`](archive/repo-continuity-session-history-2026-05-24.md)
- [`archive/repo-continuity-session-history-2026-05-22.md`](archive/repo-continuity-session-history-2026-05-22.md)
- [`archive/repo-continuity-session-history-2026-05-17.md`](archive/repo-continuity-session-history-2026-05-17.md)
- [`archive/repo-continuity-session-history-2026-05-12.md`](archive/repo-continuity-session-history-2026-05-12.md)
- [`archive/repo-continuity-session-history-2026-05-10.md`](archive/repo-continuity-session-history-2026-05-10.md)
- [`archive/repo-continuity-session-history-2026-05-07.md`](archive/repo-continuity-session-history-2026-05-07.md)
- earlier dated archive files under [`archive/`](archive/)
