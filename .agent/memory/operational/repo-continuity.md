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

- Current branch: `feat/mcp-graph-support-foundation`.
- Current local HEAD: `d9f21a01`. Remote state was not refreshed during this
  soft-tier consolidation slice; check primary git evidence before push or PR
  claims.
- Owner has reactivated a multi-lane push. Active peer claims currently cover
  source and agent-tools bundles; this consolidation lane is limited to
  memory-state documentation surfaces. Treat active claims and comms as live
  routing truth, not this paragraph.
- Critical and hard memory-surface fitness pressure is currently drained.
  `pnpm practice:fitness:informational` on 2026-05-24T14:44Z reports
  `SOFT (21 soft)`.
- Recent active napkin rotations are preserved under
  [`archive/`](../active/archive/). The current active napkin is healthy at
  28 lines / 1,050 chars after the Hushed critical line-width slice.
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
- Current working tree is dirty with peer-owned source bundles, memory-state
  consolidation surfaces, and fresh comms events. Treat `git status --short`
  as the source of truth before any commit-window work.

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

## Paused Threads

Paused threads retain their next-session records and identity history; they are
not the current session-priority lane. Reactivation is owner-directed.

| Thread | Purpose | Record | Latest identity |
| --- | --- | --- | --- |
| `connecting-oak-resources` | Oak resource graph substrate for EEF | [record][connecting] | Tempestuous Spiralling Thermal / claude / Opus 4.7 (1M) / 9205b8 / 2026-05-22 |
| `agentic-engineering-enhancements` | Practice continuity and agent-tools improvement | [record][agentic] | Sylvan Sprouting Petal / codex / GPT-5 / Knowledge Curator handoff / 2026-05-24; Shaded Silencing Dusk / codex / GPT-5 / 019e59 / 2026-05-24 |
| `observability-sentry-otel` | Sentry/OTel integration | [record][observability] | Umbral Creeping Night / claude-code / opus-4.7 / 188baa / 2026-05-10 |
| `main-critical-sonar-remediation` | Sonar remediation | [record][main-critical] | Stormy / claude-code / unknown / 228bc5 / 2026-05-06 |
| `exploring-open-education-resources` | Third-party OER | [record][oer] | Gnarled / claude-code / unknown / e18e2c / 2026-05-01 |
| `sector-engagement` | External adoption | [record][sector] | Squally / cursor / unknown / unknown / 2026-04-30 |
| `architectural-budget-system` | Architectural budget | [record][budget] | Nebulous / codex / unknown / unknown / 2026-04-29 |
| `cloudflare-mcp-security-and-token-economy-plans` | Cloudflare MCP | [record][cloudflare] | Glassy / codex / unknown / unknown / 2026-04-28 |

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

### Agentic-Engineering Consolidation Lane

The current owner-provided goal is a `start-right-team` plus
`consolidate-docs` continuation. The hard/critical drain is validated as
soft-only, so the next aligned work is soft-surface consolidation by explicit
claim.

Current soft-tier order:

1. Keep active-shard processing under the critical-drain plan moving entry by
   entry, without archiving shards wholesale.
2. Keep this repo-continuity file as a live index; move historical routing into
   archive snapshots before shrinking the live prose.
3. After repo-continuity is comfortably inside target, resume the Phase 2 and
   Phase 3 per-entry work named in the critical-drain plan.

Paused implementation programme details live in the
[`agentic-engineering-enhancements` thread record][agentic]. Do not treat old
repo-continuity prose as current route authority.

### Connecting-Oak-Resources / PR #108 Routing

`connecting-oak-resources` is paused as a thread but remains the graph-substrate
execution history for EEF. Current routing belongs in the thread record and
the PR #108 snagging plan, not duplicated here:

- [connecting-oak-resources thread record][connecting]
- [PR #108 snagging plan](../../plans/connecting-oak-resources/knowledge-graph-integration/current/pr-108-snagging.plan.md)
- [gate-1a delivery addendum](../../plans/connecting-oak-resources/knowledge-graph-integration/current/gate-1a-delivery-parallel-execution-addendum.plan.md)

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
