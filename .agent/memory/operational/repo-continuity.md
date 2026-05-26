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

- **Active thread switches back to `eef` first-feature delivery
  (2026-05-26)**: Owner direction at session close —
  `collaboration-identity-doctrine-enforcement-remediation` plan is
  PAUSED with Phase 0 delivering its intent (collaboration improvement
  for the next session). Next session resumes EEF first-feature work
  per the [`eef` thread record][eef]; `agentic-engineering-enhancements`
  returns to a Practice-continuity tactical lane, not an active
  delivery arc.
- **Collaboration identity remediation Phase 0 DELIVERED + write-side
  type cure (2026-05-26, Airy Whirling Current / claude /
  claude-opus-4-7 / `3624a5`)**: three commits on
  `docs/agent-collaboration-enhancements` closed Phase 0C, the Phase 0
  proof contract, and the write-side type hole:
  - `dee89e09` Cycle 9 — `--to-id` CLI flag wired through write-side schema
    parse at the boundary; REQUIRED, not optional (rejects the named
    failure mode at the earliest point).
  - `6dad98b0` Cycle 10 — `routingKeyFor` emits structured
    `[routing-legacy-fallback]` JSON diagnostic when lifting a
    legacy-shape identity; DI seam (`setLegacyFallbackWriter`) allows test
    capture without `process.stderr` mutation.
  - `597b0945` Cycle 11 — `createDirectedCommsMessage.from/.to` and
    `replyToDirectedCommsMessage.from` tightened to
    `CollaborationAgentIdWrite`; compile-time brand propagation from the
    CLI parse boundary into the stored event is now continuous, and
    legacy-source replies are rejected at the boundary.

  Tests 698 → 707 (+9). Pre-commit gate (90 turbo tasks) green at every
  commit. Phase 0 proof contract closed: ID-0 (`7028b0d6` PDR-027
  amendment), ID-1 (`bed24b57`, `57084c15`, `b977dbab` identity writes
  carry id), ID-2 (`30ef437b` Cycles 6+7+8 routing prefers id), ID-3
  (`6dad98b0` Cycle 10 diagnostic emits). Reviewer dispatch on Sonnet
  (parallel code-expert + type-expert) returned approval with the
  type-expert follow-on which was initially deferred then landed as
  Cycle 11 after owner challenge. One remaining hygiene item (DI-seam
  test isolation). Per plan §Phase 0 completion claim — all four proofs
  in code.

  **Plan now PAUSED** (owner direction 2026-05-26 session close):
  Phase 0 delivered its intent — improving inter-agent collaboration
  for the next session. Phase 1+ remain authored but unscheduled;
  owner directs resumption if/when warranted.

- **Prior context (Tempestuous Sweeping Feather, `a9e5d2`)**: five commits
  landed Phase 0B substrate + Phase 0C cycles 6+7+8 bundled (the
  coordination cure). Tests 671 → 698 (+27). See
  [agentic thread record][agentic] for full landing history.
- **Cross-platform memory import completed (2026-05-26, Feathered Flying Cloud
  / codex / GPT-5 / `019e65`)**: Claude, Codex, Cursor, and `.remember`
  surfaces were swept; the owner then asked to bring the candidates into the
  repo. Five candidates landed in durable homes: F-07 comms summary/show
  affordances, ADR-165 plus Q-005 for the future memory/state boundary,
  warn-first ESLint-rule nuance, start-right-team seat-cost routing, and
  ADR-125 post-canonicalisation plugin retention. Curator-pass report:
  [`2026-05-26-feathered-flying-cloud.md`](curator-passes/2026-05-26-feathered-flying-cloud.md).
  Targeted markdownlint, `git diff --check`, and diff-level local-path scan
  passed. Full `pnpm check` was not run because Tempestuous Sweeping Feather has
  a fresh active agent-tools claim and dirty peer-owned agent-tools WIP; run the
  singleton full gate after that lane settles.
- **Hard memory curation stopped at soft (2026-05-26, Feathered Flying Cloud /
  codex / GPT-5 / `019e65`)**: claim
  `0933f219-d404-4f6d-8f6e-15ec45adf028` was closed after the hard memory
  surfaces were routed without compression. Owner direction was followed:
  preserve understanding, treat fitness as signal only, do not commit, do not
  run quality gates, prioritise critical then hard, and stop at soft. Final
  informational fitness signal for this pass: SOFT, with 0 hard and 0 critical
  files.
- **Current branch**: `docs/agent-collaboration-enhancements`, local HEAD
  `b977dbab` (ahead of origin by 11 at handoff). Active claim at handoff:
  Tempestuous Sweeping Feather owns Phase 0B/0C agent-tools implementation
  files; do not fold those dirty files into this memory-import bundle.
- **Processed hard surfaces**: previous active napkin source archived verbatim
  at
  [`napkin-2026-05-26-feathered-hard-curation.md`](../active/archive/napkin-2026-05-26-feathered-hard-curation.md);
  fresh Starless/Open candidates moved to active shard
  [`2026-05-26-starless-open-closeout-candidates.md`](pending-graduations/2026-05-26-starless-open-closeout-candidates.md);
  outgoing detailed Current State prose archived at
  [`repo-continuity-current-state-2026-05-26-feathered-hard-curation.md`](archive/repo-continuity-current-state-2026-05-26-feathered-hard-curation.md).
- **Next implementation route returns to EEF first-feature delivery**
  per owner direction 2026-05-26. The
  [`collaboration-identity-doctrine-enforcement-remediation.plan.md`](../../plans/agent-tooling/current/collaboration-identity-doctrine-enforcement-remediation.plan.md)
  plan is PAUSED with Phase 0 delivering its intent (collaboration
  improvement for the next session). Earlier stale routing notes that
  framed Phase 0B Cycles 2-4 / Phase 0C as the next route are
  superseded by this entry.
- **MCP product analytics** remains paused and owner-gated after the Path-to-GA
  Programme landed at `09eda6f4`; details live in the
  [`mcp-product-analytics`](threads/mcp-product-analytics.next-session.md)
  thread record and the archived Current State prose.
- **Comms retention standing direction remains binding**: do not move or delete
  `.agent/state/collaboration/comms/` files while the
  `agent-collaboration-research` thread remains owner-gated.

## Active Threads

A **thread** is the continuity unit. Full identity tables and lane state live in
each thread record; this table is the repo-level index.

Per owner direction 2026-05-22, the only currently active product thread is
**EEF first-feature delivery**. The temporary Knowledge Curator work in this
session is an agentic-engineering consolidation lane and does not reactivate the
paused implementation program.

| Thread | Purpose | Record | Latest identity |
| --- | --- | --- | --- |
| `eef` | EEF first-feature delivery | [record][eef] | Fiery Kindling Brazier / claude / claude-opus-4-7 / 9f4026 / commit-marshal+pr-115-merged / 2026-05-25 |
| `agentic-engineering-enhancements` | Practice continuity (tactical lane; not the active delivery focus) | [record][agentic] | Airy Whirling Current / claude / claude-opus-4-7 / `3624a5` / Phase 0 DELIVERED + plan PAUSED — Cycles 9+10+11 landed (`dee89e09`, `6dad98b0`, `597b0945`); next session returns to eef / 2026-05-26 |

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
| `agent-collaboration-research` | Comms-corpus pattern research (owner-gated buffer) | [record][collab-research] | Charcoal Brazing Kiln / claude / claude-opus-4-7 / 7c7327 / thread-record-author-post-m1-merge / 2026-05-24 |

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

**due — Phase 0 milestone closed + distilled.md fitness convergence
pending** (Airy Whirling Current `3624a5`, 2026-05-26, second handoff
this session after Cycle 11 landed). Triggers fired:

1. Plan-arc milestone closed: Phase 0 of
   `collaboration-identity-doctrine-enforcement-remediation.plan.md`
   complete (ID-0..ID-3 all in code). Plan itself remains ACTIVE for
   Phase 1+.
2. `distilled.md` at 221 lines (soft limit 180, target 120) after this
   session added two cross-session lessons: reviewer-verdict authority
   discipline (worked instance: Cycle 11 landing after owner challenge)
   and structural-vs-operational-evidence distinction (worked instance:
   Phase 0 completion framing).

Not escalating to `oak-consolidate-docs` from this closeout because:
the two new distilled entries are knowledge-preservation-valid at full
weight per `knowledge-preservation-over-fitness-warnings`; trimming
them to satisfy the soft-limit signal would defeat their purpose. They
need a second worked instance before graduation to a rule/PDR. The plan
itself is now PAUSED (owner direction 2026-05-26 — Phase 0 delivered
its collaboration-improvement intent; next session returns to eef). No
napkin rotation pressure (273/300, healthy zone). No ADR/PDR candidates
surfaced. Falsifiability for the next consolidator: distilled.md grew
by the two named entries this session; if a second worked instance of
either appears in a future napkin, graduate from distilled to permanent
home rather than letting the soft pressure dictate trimming.

**not due — Phase 0 closeout commit only** (Airy Whirling Current `3624a5`,
2026-05-26, FIRST handoff this session — superseded by the entry above
after Cycle 11 landed). Original entry preserved for audit trail: Phase 0
critical path closed with cycles 9+10 landing the consumer-visible cure
surface plus the audit-signal diagnostic. Status revised after Cycle 11
landed in the same session, which added the two distilled entries.

**not due — mid-arc handoff in active plan** (Tempestuous Sweeping Feather
`a9e5d2`, 2026-05-26). Owner directed a brief session handoff with the
final-session work explicitly carried forward (Cycles 9-10 + closeout). No
consolidation triggers fired: the active plan is in-progress not closed, no
napkin rotation pressure, no ADR/PDR graduation candidates surfaced this
session (the routing-cure work executed locked design; lessons captured as
session-scoped surprises in napkin.md). Falsifiability: the next session
runs against an unchanged Active threads table, the same active plan, and
this same `not due` marker; if any trigger fires mid-final-session, the
consolidation gate at session close handles it then.

**completed — owner-directed cross-platform memory import slice** (Feathered
Flying Cloud `019e65`, 2026-05-26). Owner asked to scan Claude memories, other
platform memories, and `.remember` files, then asked to bring the candidates
into the repo while keeping repo content free of local external paths. Import
landed five durable updates: F-07 summary/show affordances, ADR-165 plus Q-005,
ESLint warn-first nuance, start-right-team seat-cost routing, and ADR-125
plugin-retention amendment. Targeted markdownlint, `git diff --check`, and
diff-level local-path scan passed. Full `pnpm check` is intentionally not
claimed green: at handoff a fresh Tempestuous Sweeping Feather claim owns
agent-tools implementation files and the working tree includes peer-owned
agent-tools WIP. Falsifiability for the next marshal: after that active claim
closes, inspect `git status --short --branch` and rerun the singleton full gate.

**not run — owner-directed skip mid-handoff** (Stellar Glowing Satellite
`9a2967`, 2026-05-26). Owner initially directed *"run a full session
handoff and document consolidation"* at close; mid-handoff (after steps
1–8 completed) owner amended: *"forget the consolidation pass and check"*.
Triggers had fired: plan-arc milestone closed (Path-to-GA Programme +
5 substance amendments landed at `09eda6f4`); new plan collection
scaffold introduced (`.agent/plans/curriculum-mcp-path-to-ga/`);
exploration moved from untracked to committed. No new ADR/PDR candidates
surfaced (paperwork session; design substance is the exploration itself).
**Both `pnpm check` (step 11) and `oak-consolidate-docs` (step 10) skipped
per owner direction**, not silently bypassed. Next consolidation pass to
inherit the queued substance; falsifiability for the next consolidator:
re-check `git log -1` for `09eda6f4`, the new programme path, and Stellar's
napkin + experience entries.

**due — owner-directed at session close** (Open Streaming Updraft `357948`,
2026-05-26). Owner direction at session close: *"this session is complete,
please run a full handoff /oak-session-handoff /oak-consolidate-docs , then
next session will pick up the remaining Phase 0 work"*. Triggers fired:
plan-arc milestone closed (Phase 0A doctrinal landing + Phase 0B Cycle 1
landed; remediation plan now ACTIVE not QUEUED); behaviour-changing lesson
to conserve (metacog cure on reviewer-derived sizing — see distilled.md
entry to be authored under consolidate-docs); a structural correction
landed mid-session (`3ca77972`). Consolidation pass to run after handoff.

**not due — session handoff only for Thermal doctrine-debt planning slice**
(Thermal Swooping Wing `019e63`, 2026-05-26). No plan or milestone closed; the
new remediation plan remains `QUEUED`; no new ADR/PDR candidate was surfaced
outside that plan; open-questions count remains below the drain trigger. This
handoff records the queued Phase 0 critical path and leaves implementation for
an owner-directed future session.

**not due — owner-requested lightweight pass only** (Glassy Flowing Stern
`de55d6`, 2026-05-26). Owner closed MCP analytics exploration session with
`/oak-session-handoff` + `/oak-consolidate-docs`. Trigger checklist: no plan
milestone closed; no napkin rotation threshold; four open questions in register;
no new PDR/ADR graduation candidates from this lane (design record is the
permanent home). Actions taken: thread record created; repo-continuity and
napkin updated; §17 open items LTAE-screened — retained in exploration doc
only; no inbound plan-index edits per outbound-only linking policy. Deferred:
Exploration 10 formal per-sink projection doc sync until plan promotion;
Stage 2 event catalogue until after Stage 1 emitters.

**due — owner-directed post-n=2-bundle consolidate-docs pass** (Torrid Firing
Spark `5054f8`, 2026-05-26T07:30Z). Owner direction at session close:
*"this session is complete, please communicate all of your findings to
Feathered, once that is done please run a deep /oak-session-handoff
followed by a deep /oak-consolidate-docs"*. Triggers: plan milestone closed
(n=2 enforcement bundle Cycle 1 complete; all 6 substantive commits +
2 cross-lane cures + owner consolidation landed on origin); 11 graduation
candidates surfaced through Cycle 1 (7 in the original 2026-05-26T07:25Z
capture + 4 added by Torrid's retirement-class closeout: peer-agent
heartbeat-without-progress diagnostic, `git apply --cached` surgical
staging worked-instance, CLI args inconsistency across comms verbs,
replace-old-with-new applied to WIP-completion). Consolidate-docs
invocation follows this handoff directly per owner sequence.

Prior state (Fiery Kindling Brazier `9f4026`, 2026-05-25T15:09Z). PR #115 merged at
`9fa3a180` on origin/main; owner directed both Fiery and Stormy to run
a final session handoff and docs consolidation pass. Triggers: plan
milestone closed (PR-0 of 4-PR gate-1a sequence + hardening-arc
closeout); new graduation candidates captured (Collaboration ceremony
decomposition discipline + n=2 coordination efficiency, both
`status: due`, owner-direction-triggered); ADR-184 amendment landed
into main; Stormy actively drafting PDR-082 (n=2 collaboration mode)
on the cure substrate Fiery captured. Consolidate-docs invocation
follows this handoff.

Prior state (Riverine Navigating Rudder, 2026-05-25): read-only MCP
UAT + plan WS5 capture + continuity handoff only; no plan milestone
closed at that close.

Prior state (Breezy Flowing Dock bounded critical/hard curation, 2026-05-25):
the active napkin, pending-graduations shards, thread records, and
memory-surface-critical-drain plan remain the live consolidation ledger.
Broader Phase 2/3 soft-file work remains trigger/owner-gated. Falsifiability for
the next consolidator: re-check `git log --oneline -5`, `git status --short`,
active claims, active queue, and
[`memory-surface-critical-drain-2026-05-24.plan.md`](../../plans/agentic-engineering-enhancements/current/memory-surface-critical-drain-2026-05-24.plan.md)
before starting.

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
