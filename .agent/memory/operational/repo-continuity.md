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

- **Current branch**: `feat/graph-foundations`, local HEAD `227b5415` (ahead 13
  of `origin`; includes Cursor statusline Lane A `59d50265`).
- **Active delivery focus**: `eef` **graph-tooling rebuild** is the only active
  product lane. The EEF explore tool + the gate-1a/1b split were diagnosed as
  the wrong foundation and discarded; the rebuild is built on the foundation
  doc. See the EEF section below and the `eef` thread record (which opens with a
  CURRENT-TRUTH banner) for live pickup.
- **Solo session (2026-05-28)**: Nebulous Threading Prism stood down; its
  handed-over curation pass was committed (`2f1d100e`). No open claims or queues.
- **Cursor statusline (2026-05-28)**: Stratospheric Hovering Gale landed Lane A
  at `59d50265` (Cursor delegates to the Claude statusline pipeline). Thermal
  Spiralling Airstream completed Lane B — bespoke Cursor TS statusline retired
  (adapter + parser + tests deleted), Claude parser refactored off Zod `.catch()`
  onto explicit type guards, shared `core/json-narrowing.ts` extracted;
  agent-tools gates green. The 2026-05-28 comms-watch runaway exposed an
  un-sunset PDR-076a `routing-legacy-fallback`; captured as the
  `routing-legacy-fallback-sunset` future plan. Lane B + the sweep + codegen +
  continuity landed by the owner in `ae4e09cb` (code + dep sweep + codegen) and
  `227b5415` (memory).
- **Agentic-engineering tactical lane**: not an active product delivery arc.
  The recent pending-graduations cleanup collapsed sidecar files back into
  canonical [`pending-graduations.md`](pending-graduations.md), where the 66
  owner-gated decisions remain live for owner direction.
- **Closed-claims archive curation (Nebulous Threading Prism / codex /
  `019e6b`)**: the 1091-entry closed-claims archive was processed as a
  knowledge source. Durable knowledge was already homed in thread records,
  plans, ADRs/PDRs, rules, commits, `pending-graduations.md`, and curator
  reports; the processed archive content was cleared to an empty schema-valid
  sink. Proof:
  [`2026-05-27-nebulous-threading-prism-closed-claims.md`](curator-passes/2026-05-27-nebulous-threading-prism-closed-claims.md).
- **Collaboration-state lifecycle**: `.agent/state/` files are live signal
  sources, not long-term documentation. Outside explicit owner-gated research
  preservation windows, process them for durable knowledge, route useful
  substance, and clear the stale state.
- Detailed recent closeout history for Gnarled, Kilned, Veiled, Foamy, the EEF
  PR review/divergence work, Phase 0 identity-remediation, and cross-platform
  memory import lives in the relevant thread records and curator reports rather
  than in this repo-wide entry point.

## Active Threads

A **thread** is the continuity unit. Full identity tables and lane state live in
each thread record; this table is the repo-level index.

Per owner direction 2026-05-22, the only currently active product thread is
**EEF first-feature delivery**. The temporary Knowledge Curator work in this
session is an agentic-engineering consolidation lane and does not reactivate the
paused implementation program.

| Thread | Purpose | Record | Latest identity |
| --- | --- | --- | --- |
| `eef` | EEF graph-tooling rebuild | [record][eef] | claude / claude-opus-4-7 / Deep Fathoming Harbour / graph-tooling rebuild foundation + plan (D0 next) / 2026-05-28 |
| `agentic-engineering-enhancements` | Practice continuity (tactical lane; not the active delivery focus) | [record][agentic] | claude / Opus 4.7 / Thermal Spiralling Airstream / Cursor statusline Lane B complete (Cursor TS retired); routing-legacy-fallback-sunset plan created; comms-plan consolidation handed to next session / 2026-05-28 |

## Paused Threads

Paused threads retain their next-session records and identity history; they are
not the current session-priority lane. Reactivation is owner-directed.

| Thread | Purpose | Record | Latest identity |
| --- | --- | --- | --- |
| `connecting-oak-resources` | Oak resource graph substrate for EEF | [record][connecting] | Riverine Navigating Rudder / cursor / Composer / 27d9af / oak-preview-1 full manual UAT PASS / 2026-05-25 |
| `branch-fitness-and-push-cadence` | Small-PR, push-often, branch-fitness, PR/Sonar monitoring protocol substrate | [record][branch-fitness] | Pelagic Snorkelling Sextant / codex / GPT-5 / 019e5b / Cycle 1 substrate capture from active napkin / 2026-05-24 |
| `mcp-product-analytics` | MCP product analytics design + Path-to-GA Programme (plan promotion still gated) | [record][mcp-analytics] | Stellar Glowing Satellite / claude / claude-opus-4-7 / 9a2967 / Programme landed + 5 amendments (commit `09eda6f4`) / 2026-05-26 |
| `observability-sentry-otel` | Sentry/OTel integration | [record][observability] | Umbral Creeping Night / claude-code / opus-4.7 / 188baa / 2026-05-10 |
| `main-critical-sonar-remediation` | Sonar remediation | [record][main-critical] | Stormy / claude-code / unknown / 228bc5 / 2026-05-06 |
| `exploring-open-education-resources` | Third-party OER | [record][oer] | Gnarled / claude-code / unknown / e18e2c / 2026-05-01 |
| `sector-engagement` | External adoption | [record][sector] | Squally / cursor / unknown / unknown / 2026-04-30 |
| `architectural-budget-system` | Architectural budget | [record][budget] | Nebulous / codex / unknown / unknown / 2026-04-29 |
| `cloudflare-mcp-security-and-token-economy-plans` | Cloudflare MCP | [record][cloudflare] | Glassy / codex / unknown / unknown / 2026-04-28 |
| `agent-collaboration-research` | Comms-corpus pattern research (owner-gated buffer) | [record][collab-research] | codex / GPT-5 / Solar Illuminating Dawn / state-file-lifecycle-boundary-clarification / 2026-05-27 |

Compact identity rule (per [PDR-027](../../practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md)
and the 2026-05-17 structural refactor): this table carries only the latest
identity. Full per-thread identity history and per-session context live in each
thread's next-session record.

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

## Next Safe Steps

### EEF Graph-Tooling Rebuild (active — sole current product focus)

**Live (2026-05-28 — REBUILT FROM FOUNDATIONS).** The EEF explore tool and the
gate-1a/1b split were diagnosed as the **wrong foundation** (list-thinking in a
graph domain; the graph query surface stubbed and then worked around). The old
EEF plan estate is archived at `.agent/plans/sector-engagement/eef/archive/`.
Single source of truth for the rebuild:

- foundation:
  [`graph-tooling-rebuild-foundation-2026-05-28.md`](../../plans/sector-engagement/eef/current/graph-tooling-rebuild-foundation-2026-05-28.md)
  (diagnosis; principles — graph != list, completeness-as-integrity-not-maximalism,
  build-the-query-surface, budget-as-design-signal, no soft stubs,
  structuredContent-only; discovery framing; open questions).
- plan (skeleton):
  [`graph-tooling-rebuild.plan.md`](../../plans/sector-engagement/eef/current/graph-tooling-rebuild.plan.md)
  (self-correcting deliverables; D0 merge-safety, D1 restate end-goal +
  graph-tool contract + fresh client research, D2 build the query surface,
  D3 complete navigable subgraph tool, D4 agent round-trip, D5 'working with
  graphs' skills + methodology graduation, D6 explore the value path, DX
  estate-wide reference reconciliation).

**Next safe step:** GOAL 1 — fix the plan (design only, no implementation). The
next session resolves the one open design question (the **selection / scoping
strategy**) via worked examples on the real corpus, folds in the 2026-05-28
settled outcomes (encoding = `structuredContent`-only; scope = agent-facing, no
UI/widget), and upgrades the plan skeleton to a fully-specified, owner-ratified
spec. Then GOAL 2 — implement (D0 merge-safety → D6 + DX), each with its
measurable gate. Bounded: must not drift into endless follow-on sessions (plan
§"End goal + bounded goals"). The F explore tool (`2214f0b2`) is LANDED behind the
flag but is the wrong shape pending rebuild.

Historical EEF substrate-floor work (the 2026-05-22→23 multi-agent gate-1a
session, the WS4.x critical path) and PR #108 graph-substrate details are
superseded by the rebuild and retained for history only in the
[`eef` thread record][eef] and [`connecting-oak-resources` thread record][connecting].

### Agentic-Engineering Tidy-Plan Lane (closed 2026-05-25)

The post-M1 attestation tidy-up plan delivered via PR #114 (merged at
`77fcf746`). The plan is archived at
[`post-m1-attestation-tidy-up.plan.md`](../../plans/agentic-engineering-enhancements/archive/completed/post-m1-attestation-tidy-up.plan.md);
cycles 10 + 11 (comms-watch storage redesign WS2 + WS3) were superseded into
[`comms-watch-storage-redesign.plan.md`](../../plans/agent-tooling/current/comms-watch-storage-redesign.plan.md)
per the archive supersession mapping. The earlier consolidation hard/critical
objective remains complete (`SOFT (20 soft)`). Owner has pivoted back to
graph work; deeper soft-tier consolidation is not the active delivery lane.

2026-05-26 handoff update: the remaining owner-decision-gated due
principles have now graduated to PDR-083 and PDR-084. Next safe step
for this thread is owner commit of the staged closeout bundle, then no
further Thermal action unless the owner reopens a specific curation lane.

2026-05-26 doctrine-debt handoff update: PR #118 was created for the n=2
collaboration improvements, the Sonar remediation was routed to Mistbound and
landed at `cd1810bc`, and the follow-up doctrine/enforcement debt is now queued
as
[`collaboration-identity-doctrine-enforcement-remediation.plan.md`](../../plans/agent-tooling/current/collaboration-identity-doctrine-enforcement-remediation.plan.md).
The immediate future implementation route is Phase 0 only: add UUID ids to new
identity writes and make routing prefer `(agent_name, id)` with legacy fallback.

**2026-05-26 follow-on handoff (Open Streaming Updraft)**: Phase 0A delivered
in five commits on `docs/agent-collaboration-enhancements` (`76920493` plan v3

- `7028b0d6` PDR-027 amendment + `b0faefab` Phase 0A closeout + `3ca77972`
metacog cure replacing 3-session framing with TDD-cycle decomposition +
`c11f698b` Phase 0B Cycle 1 with `UuidV5` brand + read/write schema split).
Phase 0B Cycle 1 also landed in the same session (671/671 tests green; full
pre-commit gate green). **Next safe step**: next session picks up Phase 0B
Cycles 2–4 (deriveCollaborationIdentity returns CollaborationAgentIdWrite +
UUID v5 derivation; parseAgentId → schema.parse(); JSON schemas accept
optional id) then Phase 0C all 5 cycles (`AgentRoutingKey` discriminated
union; classifiers + assertSameAgent prefer id; `--to-id`; legacy-fallback
diagnostic). Design is fully locked in plan v3 body — implementer needs no
further deliberation. Plan §Sub-phase sizing now states cycle-by-cycle
decomposition (was: incorrect "three-session arc" framing from reviewer
file-count framing; corrected at `3ca77972` after owner challenge).

### MCP Product Analytics (paused — design complete, plan deferred)

Thread record:
[`mcp-product-analytics.next-session.md`](threads/mcp-product-analytics.next-session.md).
Design record:
[`2026-05-26-mcp-analytics-identity-and-event-emission.md`](../../docs/explorations/2026-05-26-mcp-analytics-identity-and-event-emission.md).

**Next safe step**: owner-gated — promote execution plan (§14.5) or authorise
implementation; no agent action until then. Open items at plan/legal gates live
in exploration §17 (not duplicated in `open-questions.md`; LTAE-screened at
closeout — defer to plan author time except production legal gates B5–B7).

### Connecting-Oak-Resources / PR #108 Routing

`connecting-oak-resources` is paused as a thread but remains the graph-substrate
execution history for EEF. Current routing belongs in the thread record and
the PR #108 snagging plan, not duplicated here:

- [connecting-oak-resources thread record][connecting]
- [PR #108 snagging plan](../../plans/connecting-oak-resources/knowledge-graph-integration/archive/completed/pr-108-snagging.plan.md) (archived; gate cycles landed)
- [M1 Safe Pause program plan](../../plans/agentic-engineering-enhancements/archive/completed/practice-infrastructure-hardening-program.plan.md) (archived; PR #108 at `2462952a`)
- [gate-1a delivery addendum](../../plans/connecting-oak-resources/knowledge-graph-integration/current/gate-1a-delivery-parallel-execution-addendum.plan.md)

**Preview MCP validation**: PR #108 black-box pass documented 2026-05-24
(Velvet Stalking Moth). Education-evidence preview (`oak-preview-1`) full
checklist A–H pass documented 2026-05-25 (Riverine Navigating Rudder); suggest
empty `url` tracked as WS5 in
[`oak-preview-mcp-snagging-2026-04-23.plan.md`](../../plans/sdk-and-mcp-enhancements/current/oak-preview-mcp-snagging-2026-04-23.plan.md).
Manual procedure:
[agent-preview-test-checklist.md](../../../apps/oak-curriculum-mcp-streamable-http/docs/agent-preview-test-checklist.md)
and [connecting thread § 2026-05-25 Riverine Navigating Rudder][connecting].
Sonar on PR #114 was green after fake-test-path fixture fix at `2f5e1871`.

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
5. **MCP product analytics (Jim, plan owner)**: execution plan promotion is
   deferred. Before identified **production** PostHog capture, resolve §11.7
   privacy review and legal notices (B5–B7) in
   [`2026-05-26-mcp-analytics-identity-and-event-emission.md`](../../docs/explorations/2026-05-26-mcp-analytics-identity-and-event-emission.md).
   Warehouse posture (owner lean Option C) and remaining §17 items resolve at
   plan author time unless Jim directs earlier.

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

**current**: the closed-claims archive curation pass processed all 1091 archived
claims, routed the only durable lifecycle lesson to the curation report and this
resume pointer, and cleared the archive content. Proof:
[`2026-05-27-nebulous-threading-prism-closed-claims.md`](curator-passes/2026-05-27-nebulous-threading-prism-closed-claims.md).

**current**: the pending-graduations pseudo-shard collapse is complete. The live
decision work is owner direction on the 66 gated entries in
[`pending-graduations.md`](pending-graduations.md), not another sidecar drain.

**routing**: detailed consolidation, handoff, and session-close history now
lives in thread records, curator reports, completed plans, and prior continuity
archives. This file should stay an operational index and should not regain
per-session closeout prose.

**handoff gate (2026-05-28)**: Thermal Spiralling Airstream session-handoff —
Cursor statusline Lane B complete (Cursor TS retired, agent-tools gates green);
`routing-legacy-fallback-sunset` future plan created; comms-plan consolidation
handed to a separate agent via a consolidation brief; `pnpm check` NOT run
(owner direction); consolidate-docs not due (focused session, no trigger fired).
Session work landed by the owner in `ae4e09cb` (statusline code + dep sweep +
codegen) + `227b5415` (memory); this handoff's continuity edits remain staged.

**handoff gate (2026-05-28)**: Stratospheric Hovering Gale session-handoff —
Cursor statusline Lane A complete; consolidate-docs not due (no trigger fired).

**prior (2026-05-28)**: Deep Fathoming Harbour ran deep session-handoff +
consolidate-docs after the EEF explore-tool diagnosis and graph-tooling rebuild
foundation. Graduation candidates remain in
[`pending-graduations.md`](pending-graduations.md).

Previous deep-consolidation and session-close prose:

- [`archive/repo-continuity-session-history-2026-05-24.md`](archive/repo-continuity-session-history-2026-05-24.md)
- [`archive/repo-continuity-session-history-2026-05-22.md`](archive/repo-continuity-session-history-2026-05-22.md)
- [`archive/repo-continuity-session-history-2026-05-17.md`](archive/repo-continuity-session-history-2026-05-17.md)
- [`archive/repo-continuity-session-history-2026-05-12.md`](archive/repo-continuity-session-history-2026-05-12.md)
- [`archive/repo-continuity-session-history-2026-05-10.md`](archive/repo-continuity-session-history-2026-05-10.md)
- [`archive/repo-continuity-session-history-2026-05-07.md`](archive/repo-continuity-session-history-2026-05-07.md)
- earlier dated archive files under [`archive/`](archive/)
