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

- **Docs consolidation repair + longitudinal brief handed off (2026-05-31,
  Foamy Charting Harbour / `019e7d`)**: the invalid archive-only consolidation
  was repaired into real item dispositions. `distilled.md` is drained to a
  repair note; `napkin.md` is rotated after preserving the verbatim source and
  ledgering the source-buffer items; `pending-graduations.md` carries the
  remaining owner-gated doctrine. The immediate owner-directed next session is
  the longitudinal current-plus-twenty napkin review brief at
  [`codex-napkin-longitudinal-review.brief.md`](codex-napkin-longitudinal-review.brief.md).
  The broader continuation brief remains available at
  [`codex-docs-consolidation.brief.md`](codex-docs-consolidation.brief.md) for a
  later ordinary docs-consolidation continuation.
- **EEF reviewer findings applied + architecture brief ready (2026-05-31,
  Hearthlit Roasting Caldera / `019e7d`)**: the docs/type reviewer pass ran, the
  owner widened scope, and the live plan/README were repaired. Raw
  `EEF_TOOLKIT_DATA as const` is definitively not the graph contract; the graph
  is derived from the raw data and must preserve exact raw-derived typing. The
  next EEF move is the architecture-reviewer Codex brief at
  `eef/current/eef-plan-architecture-reviewers.codex-brief.md`, then owner
  disposition of any architecture findings before D1 value + D2 typed foundation.
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
| `eef` | EEF graph-tooling rebuild | [record][eef] | codex / GPT-5 / Hearthlit Roasting Caldera / reviewer findings applied + architecture brief ready / 2026-05-31 |
| `agentic-engineering-enhancements` | Practice continuity and temporary curation | [record][agentic] | codex / GPT-5 / Foamy Charting Harbour / longitudinal napkin-review brief + light handoff / 2026-05-31 |

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
2. Run `eef/current/eef-plan-architecture-reviewers.codex-brief.md`: all four
   architecture reviewers (`barney`, `betty`, `fred`, `wilma`) over the repaired
   live plan.
3. If architecture findings require repair, ask the owner before editing; if the
   plan is architecture-ready, continue with D1 value and D2 typed foundation,
   then D3-D7, unless the owner changes the route.

### Agentic-Engineering Curation

1. Start the owner-directed longitudinal napkin-review session from
   [`codex-napkin-longitudinal-review.brief.md`](codex-napkin-longitudinal-review.brief.md):
   current active napkin plus the recomputed last twenty archived napkins.
2. Re-run `pnpm practice:fitness:strict-hard` before acting.
3. Treat fitness as routing evidence only; do not archive, split, shard, rename,
   pointer-replace, or move unprocessed content to improve scores.
4. Continue item-level dispositions from active buffers and the canonical
   [`pending-graduations.md`](pending-graduations.md) only when the owner route or
   a trigger asks for ordinary docs consolidation.
5. Comms-event rotation remains paused until a dedicated comms research plan
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

**handoff gate (2026-05-31, Foamy Charting Harbour — longitudinal napkin
review)**: `due — owner explicitly requested a dedicated current-plus-twenty
napkin review for the next Codex session`. The route is
[`codex-napkin-longitudinal-review.brief.md`](codex-napkin-longitudinal-review.brief.md).
This light handoff did not run that review or claim the original consolidation
complete.

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
