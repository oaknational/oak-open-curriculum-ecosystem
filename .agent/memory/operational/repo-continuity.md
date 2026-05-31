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
prose is archived under [`archive/`](archive/), with the latest pre-compaction
source snapshot preserved at
[`archive/repo-continuity-current-state-2026-05-31-foamy-docs-consolidation.md`](archive/repo-continuity-current-state-2026-05-31-foamy-docs-consolidation.md).
Detailed lane histories live in thread records, curator reports, completed
plans, and prior continuity archives; this file should stay a compact pickup
surface.

## Current State

- **Longitudinal napkin review complete (2026-05-31, Blooming Twining Grove /
  `019e7d`)**: the owner-directed current-plus-twenty napkin review landed in
  commit `b19a382a`. The report is
  [`longitudinal-napkin-review-2026-05-31.md`](../../research/agentic-engineering/continuity-memory-and-knowledge-flow/longitudinal-napkin-review-2026-05-31.md)
  and the ledger is
  [`curator-passes/2026-05-31-codex-napkin-longitudinal-review.md`](curator-passes/2026-05-31-codex-napkin-longitudinal-review.md).
  Two owner-gated items were added to `pending-graduations.md`; the review did
  not reopen archive processing or comms-event rotation.
- **EEF owner questions answered + D3 tightened (2026-05-31, Estuarine Rolling
  Harbour / `019e7d`)**: D1/D3 value and MCP-surface questions are recorded in
  the live plan. The settled practical-small MCP surface is one deterministic EEF
  query/fetch tool, one interpretation resource/template, and one user-facing
  prompt. D3 now names two remaining products: a written MCP contract artefact
  and a separate SDK/app verification record. The next EEF move is the holistic
  live-plan pass brief at `eef/current/eef-plan-holistic-pass.codex-brief.md`.
- **EEF pre-decision report fixed and reviewer-polished (2026-05-31, Deep
  Drifting Anchor / `019e7e`)**: the graph pre-decision research report was
  repaired from `eef/current/eef-graph-predecision-report-fix.codex-brief.md`,
  reviewed by six specialist reviewers, and then polished to close the real
  blocker around input-side `TNodeId` threading. Treat
  `eef/current/eef-graph-predecision-research.report.md` as handoff-safe
  pre-decision research, not a decision surface.
- **EEF D0 complete and audited (2026-05-31, Opalescent Transiting Prism /
  `73491c`)**: validator deletion, data relocation, ADR/decontamination work, and
  the intent-vs-letter audit are recorded in the `eef` thread banner. The thread
  record says the D0 bundle is committed at `ce9745c7` and not pushed; verify
  current git state before acting.
- **Current product focus**: `eef` graph-tooling rebuild is the only active
  product lane. The `agentic-engineering-enhancements` activity in this window is
  a temporary knowledge-curation lane, not a product implementation thread.
- **Collaboration-state lifecycle**: `.agent/state/` files are live signal
  sources, not long-term documentation. Outside explicit owner-gated research
  windows, process useful substance into memory/docs/plans and clear stale state.

## Active Threads

A **thread** is the continuity unit. Full identity tables and lane state live in
each thread record; this table is the repo-level index.

| Thread | Purpose | Record | Latest identity |
| --- | --- | --- | --- |
| `eef` | EEF graph-tooling rebuild | [record][eef] | codex / GPT-5 / Deep Drifting Anchor / predecision report repair + reviewer synthesis / 2026-05-31 |
| `agentic-engineering-enhancements` | Practice continuity and temporary curation | [record][agentic] | codex / GPT-5 / Blooming Twining Grove / longitudinal napkin review + deep handoff / 2026-05-31 |

## Paused Threads

Paused threads retain their next-session records and identity history; they are
not the current session-priority lane. Reactivation is owner-directed.

| Thread | Purpose | Record | Latest identity |
| --- | --- | --- | --- |
| `connecting-oak-resources` | Oak resource graph substrate for EEF | [record][connecting] | Riverine Navigating Rudder / cursor / Composer / oak-preview-1 manual UAT pass / 2026-05-25 |
| `branch-fitness-and-push-cadence` | Small-PR, push-often, branch-fitness, PR/Sonar protocol substrate | [record][branch-fitness] | Pelagic Snorkelling Sextant / codex / GPT-5 / Cycle 1 substrate capture / 2026-05-24 |
| `mcp-product-analytics` | MCP product analytics design and Path-to-GA Programme | [record][mcp-analytics] | Stellar Glowing Satellite / claude / claude-opus-4-7 / Programme landed + amendments / 2026-05-26 |
| `observability-sentry-otel` | Sentry/OTel integration | [record][observability] | Umbral Creeping Night / claude-code / opus-4.7 / 2026-05-10 |
| `main-critical-sonar-remediation` | Sonar remediation | [record][main-critical] | Stormy / claude-code / 2026-05-06 |
| `exploring-open-education-resources` | Third-party OER | [record][oer] | Gnarled / claude-code / 2026-05-01 |
| `sector-engagement` | External adoption | [record][sector] | Squally / cursor / 2026-04-30 |
| `architectural-budget-system` | Architectural budget | [record][budget] | Nebulous / codex / 2026-04-29 |
| `cloudflare-mcp-security-and-token-economy-plans` | Cloudflare MCP | [record][cloudflare] | Glassy / codex / 2026-04-28 |
| `agent-collaboration-research` | Comms-corpus pattern research | [record][collab-research] | Twilit Orbiting Satellite / routing-sunset execution landed; research vector owner-gated / 2026-05-29 |

## Next Safe Steps

### EEF Graph-Tooling Rebuild

1. Re-ground in the `eef` thread banner and current git state.
2. Use `eef/current/eef-graph-predecision-research.report.md` as fixed
   pre-decision research material. If not superseded by owner direction, run
   `eef/current/eef-plan-holistic-pass.codex-brief.md` to review the whole live
   plan for coherence, cohesion, completeness, accuracy, and freshness after the
   D1/D3 owner-question resolution and report repair.
3. Then proceed to the written D3 MCP contract artefact and SDK/app verification
   record, or owner-directed D4+ planning, depending on the holistic-pass outcome.

### Agentic-Engineering Curation

1. No immediate next curation action is required for the longitudinal review;
   commit `b19a382a` contains the report and ledger.
2. The two new longitudinal findings are owner-gated in
   [`pending-graduations.md`](pending-graduations.md): active-buffer
   pre-replacement proof and shell-significant collaboration CLI affordance.
3. Continue item-level dispositions from active buffers and the canonical
   `pending-graduations.md` only when the owner route or a trigger asks for
   ordinary docs consolidation.
4. Comms-event rotation remains paused until a dedicated comms research plan
   exists.

### Docs Consolidation Repair

1. For a later ordinary continuation, use
   [`codex-docs-consolidation.brief.md`](codex-docs-consolidation.brief.md).
2. Treat fitness as routing evidence only; do not archive, split, shard, rename,
   pointer-replace, or move unprocessed content to improve scores.
3. Continue item-level dispositions from active buffers and the canonical
   [`pending-graduations.md`](pending-graduations.md). Owner-gated items remain
   there until their trigger fires.
4. Comms-event rotation remains paused until a dedicated comms research plan
   exists.

### Connecting-Oak / PR History

Before resuming paused graph-substrate work, re-check current PR, CI, Sonar,
CodeQL, active claims, commit queue, and git state. Do not rely on historical
issue counts in archived prose.

## Open Owner-Decision Items

1. `pending-graduations.md` contains owner-gated doctrine and follow-up decisions;
   process only when a trigger fires or the owner directs.
2. MCP product analytics execution-plan promotion is deferred. Production PostHog
   capture still needs the legal/privacy gates named in the exploration record.
3. Monorepo workspace topology remains parked until after the graph MVP
   implementation tranche unless the owner reopens it.
4. Comms-event lifecycle research is owner-gated; do not rotate the event corpus
   from calendar age alone.

## Repo-Wide Invariants / Non-Goals

Each invariant below has a canonical home; this section is a resume aid, not the
authority.

- Comms-log rotation is paused until a dedicated comms research plan exists.
- No compatibility layers; replace, do not bridge.
- Distinct architectural layers live in distinct workspaces.
- TDD at all levels; tests prove product behaviour, not file presence.
- Strict validation happens only at boundaries.
- No `process.env` read/write in test files or setup files.
- `--no-verify` requires fresh per-invocation owner authorisation.
- No warning toleration.
- Owner direction beats plan.
- Curriculum data in this monorepo comes through the published Oak Open
  Curriculum HTTP API and generated SDK.
- Knowledge preservation is absolute; fitness warnings route work, not deletion.
- Shared memory/state files are always writable and commit-includable when dirty.

## Deep Consolidation Status

**session-completion closeout (2026-05-31, Deep Drifting Anchor — EEF
pre-decision report repair)**: `not due — owner requested a tight handoff only,
with no check and no commit; no new cross-session doctrine, ADR/PDR candidate, or
open question surfaced beyond the repaired EEF report and thread-state updates`.

**prior history**: detailed 2026-05-28 to 2026-05-31 handoff-gate prose is
preserved in
[`archive/repo-continuity-current-state-2026-05-31-foamy-docs-consolidation.md`](archive/repo-continuity-current-state-2026-05-31-foamy-docs-consolidation.md)
and older archive files under [`archive/`](archive/).

[main-critical]: threads/main-critical-sonar-remediation.next-session.md
[mcp-analytics]: threads/mcp-product-analytics.next-session.md
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
