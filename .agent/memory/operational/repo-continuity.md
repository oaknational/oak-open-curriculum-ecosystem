---
fitness_line_target: 400
fitness_line_limit: 525
fitness_char_limit: 35000
fitness_line_length: 200
split_strategy: "Archive historical session-close summaries to a companion archive file; keep only live operational state and most recent session summary here"
merge_class: index-narrative-tables
---

# Repo Continuity

Repo-level operational index for active thread state. Historical session-close
prose was archived verbatim during the 2026-05-12 consolidation pass at
[`archive/repo-continuity-session-history-2026-05-12.md`](archive/repo-continuity-session-history-2026-05-12.md).
Earlier archives remain under [`archive/`](archive/).

## Current State

- Current branch: `feat/mcp-graph-support-foundation`.
- The branch-primary lane remains `connecting-oak-resources`; its detailed
  state lives in
  [`threads/connecting-oak-resources.next-session.md`](threads/connecting-oak-resources.next-session.md).
- The Practice/tooling substrate lane for this branch remains
  `agentic-engineering-enhancements`; its detailed state lives in
  [`threads/agentic-engineering-enhancements.next-session.md`](threads/agentic-engineering-enhancements.next-session.md).
- Cost-of-collaboration P0 implementation is in progress. Direct evidence:
  [`.husky/pre-commit`](../../../.husky/pre-commit) now routes staged
  formatting and Markdown checks through `agent-tools:repo-check` while keeping
  shell lint and Turbo `type-check lint test` in the pre-commit broken-code
  guard. Knip and depcruise are now classified as higher-standard gates owned
  by pre-push, `pnpm check`, and CI rather than the commit boundary.
- The `pnpm check` profiling brief has a durable deep dive:
  [`pnpm-check-profiling-deep-dive-2026-05-12.md`](../../plans/agent-tooling/pnpm-check-profiling-deep-dive-2026-05-12.md).
  The final full-profile attempt reached the real workload and failed on
  `@oaknational/oak-curriculum-mcp-streamable-http#test` at
  `src/correlation/middleware.integration.test.ts:203`; the owner subsequently
  reported multiple green full `pnpm check` runs, so this is historical profile
  evidence rather than the current blocker.
- [`cost-of-collaboration.plan.md`](../../plans/agent-tooling/current/cost-of-collaboration.plan.md)
  now contains explicit P0 quality-gate performance tasks: baseline/unblock,
  trigger-contract, staged content scanners, pre-push/CI rebalance, profile
  hardening, and post-change measurement.
- Owner live change on 2026-05-12: root `pnpm check` has moved its lint,
  Markdown, and format proof steps to non-mutating commands. The next
  quality-gate baseline should verify and measure this before further tuning.
- Until P0 lands, multi-agent implementation windows remain structurally
  blocked. Single-agent documentation/state consolidation remains safe when
  claims are registered narrowly and no staging window is opened.
- The owner-directed consolidation drain of `repo-continuity.md` and
  [`pending-graduations.md`](pending-graduations.md) is complete for this
  pass: historical closeout prose was archived, the live state was preserved,
  the pending-graduations due index was reconciled, and ADR/PDR promotion
  decisions were surfaced explicitly.
- Next `agentic-engineering-enhancements` continuation is owner-directed:
  review `jc-session-handoff` and `jc-consolidate-docs` as a paired workflow
  surface, and also review `jc-metacognition`.

## Active Threads

A **thread** is the continuity unit. Full identity tables and lane state live in
each thread record; this table is the repo-level index.

| Thread | Purpose | Record | Latest identity |
| --- | --- | --- | --- |
| `main-critical-sonar-remediation` | Sonar remediation | [record][main-critical] | Stormy / `claude-code` / `228bc5` / 2026-05-06 |
| `observability-sentry-otel` | Sentry/OTel integration | [record][observability] | Umbral Creeping Night (commit-only) / `claude-code` / opus-4.7 / `188baa` / 2026-05-10 |
| `agentic-engineering-enhancements` (alias: "agent communication improvements") | Practice continuity + agent-tools improvement | [record][agentic] | Cosmic Gliding Aurora / `codex` / GPT-5 / `019e1a` / 2026-05-12 (landed 72c5cde1: pre-commit broken-code guard preserved while Prettier/Markdownlint now use staged files; knip/depcruise classified as higher-standard gates); Vining Budding Canopy / `codex` / GPT-5 / `019e1a` / 2026-05-12 (`pnpm check` profiling deep dive + P0 quality-gate task expansion; next step is clean cold/warm profile from owner-reported green state); Volcanic Banking Pyre / `codex` / GPT-5 / `019e1a` / 2026-05-12 (recorded owner-directed paired `jc-session-handoff` + `jc-consolidate-docs` next step with `jc-metacognition`); see thread record for full identity history |
| `connecting-oak-resources` | Oak resource graph | [record][connecting] | Sparking Charring Ash / `claude-code` / opus-4-7-1m / `caf5e1` / 2026-05-12 (graph foundation work; Inc.1a WS1.1 open for execution) |
| `exploring-open-education-resources` | Third-party OER | [record][oer] | Gnarled / `claude-code` / `e18e2c` / 2026-05-01 |
| `architectural-budget-system` | Architectural budget | [record][budget] | Nebulous / `codex` / 2026-04-29 |
| `cloudflare-mcp-security-and-token-economy-plans` | Cloudflare MCP | [record][cloudflare] | Glassy / `codex` / 2026-04-28 |
| `sector-engagement` | External adoption | [record][sector] | Squally / `cursor` / 2026-04-30 |
| `eef` | EEF evidence corpus | [record][eef] | Fragrant Regrowing Root / `codex` / GPT-5 / `019e12` / 2026-05-10 |

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

### Agentic-Engineering Enhancements

Immediate owner-directed workflow skill review lane: perform the same deep
analysis/remediation treatment on `jc-session-handoff` and
`jc-consolidate-docs` as a pair, and also review `jc-metacognition`. The
handoff workflow runs in more sessions, but it is closely coupled to
consolidation because handoff captures session-close continuity and
consolidation decides what graduates out of temporary surfaces. Start from
the thread record's workflow-skill continuation opener.

Immediate quality-gate lane: execute the remaining cost-of-collaboration P0.QG
tasks after `72c5cde1`: capture clean cold and warm `pnpm check:profile`
baselines from the owner-reported green `pnpm check` state, add regression
coverage for staged Prettier/Markdownlint with unrelated ambient dirty files,
and record post-change hook timing. The preserved evidence and trigger map live in
[`pnpm-check-profiling-deep-dive-2026-05-12.md`](../../plans/agent-tooling/pnpm-check-profiling-deep-dive-2026-05-12.md);
the implementation tasks live in
[`cost-of-collaboration.plan.md`](../../plans/agent-tooling/current/cost-of-collaboration.plan.md).

Consolidation lane from this pass is complete. The next consolidation pass
should continue draining [`pending-graduations.md`](pending-graduations.md) by
promotion or archive, not by metric-shaped trimming. The acceptance bar remains:

- live state remains in this file;
- historical closeout prose remains archived, not deleted;
- pending-graduations index/counts match body entries marked `status: due`;
- ADR-shaped and PDR-shaped promotion decisions are visible to the owner;
- cost-of-collaboration P0 remains named as the blocker for multi-agent
  implementation windows.

Implementation lane after profiling and consolidation: follow the thread
record's cost-of-collaboration opener. The staged content-scanner change has
started; P0 remains open until the trigger contract, validation evidence,
profile hardening, and post-change measurement land in
[`cost-of-collaboration.plan.md`](../../plans/agent-tooling/current/cost-of-collaboration.plan.md).
Do not open P1+ implementation or multi-agent work until P0 lands.

### Connecting-Oak-Resources

Branch-primary graph work continues from
[`threads/connecting-oak-resources.next-session.md`](threads/connecting-oak-resources.next-session.md).
Current entry: Inc.1a WS1.1, scaffold `packages/core/graph-core` with
`packages/core/result/` as the scaffold reference and the active
`graph-stack.plan.md` todo `ws1-graph-core-scaffold` as the acceptance spec.

## Open Owner-Decision Items

1. `practice.md` HARD character pressure remains owner-gated under the Core
   care-and-consult rule. Falsifiability:
   `pnpm practice:fitness:strict-hard`.
2. [`pending-graduations.md`](pending-graduations.md) is a consolidation-pass
   queue, not a daily session-open file. Drain due entries through explicit
   ADR/PDR/rule/doc promotion decisions; do not trim for metrics.
3. Monorepo workspace topology (superseding ADR-108, S0-S6 strategic plan) is
   parked until after the graph MVP implementation tranche unless the owner
   explicitly reopens it.
4. Cost-of-collaboration P0 needs implementation before multi-agent
   implementation windows resume.

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

Current branch non-goals:

- do not reopen broader canonicalisation opportunistically;
- do not guess Vercel, Sentry, SonarCloud, or GitHub state before checking
  primary evidence;
- do not treat monitor setup or owner-handled preview validation as in-repo
  acceptance work.

## Deep Consolidation Status

**Status (2026-05-12 — Cosmic Gliding Aurora / `codex` / GPT-5 /
`019e1a`)**: not escalated in this handoff — the session corrected the
quality-gate plan boundary, landed `72c5cde1`, and captured the owner decision
that knip and depcruise are higher-standard gates. No new ADR/PDR candidate
requires immediate graduation. The existing pending-graduations due queue
remains a separate owner-visible consolidation lane rather than work smuggled
into this handoff.

Previous same-day quality-gate handoff: Vining Budding Canopy converted
quality-gate profiling recommendations into explicit P0 implementation tasks
inside `cost-of-collaboration.plan.md` and refreshed continuity surfaces.

Previous same-day consolidation status: Flamebright Sparking Forge performed
a bounded consolidation pass on `repo-continuity.md` and
`pending-graduations.md`. The historical repo-continuity prose was archived
verbatim before the live file was reconciled. Pending-graduations due counts
were reconciled from body metadata, with ADR/PDR promotion decisions surfaced
explicitly rather than silently graduating doctrine.

Previous deep-consolidation and session-close prose lives in:

- [`archive/repo-continuity-session-history-2026-05-12.md`](archive/repo-continuity-session-history-2026-05-12.md)
- [`archive/repo-continuity-session-history-2026-05-10.md`](archive/repo-continuity-session-history-2026-05-10.md)
- [`archive/repo-continuity-session-history-2026-05-07.md`](archive/repo-continuity-session-history-2026-05-07.md)
- earlier dated archive files under [`archive/`](archive/)
