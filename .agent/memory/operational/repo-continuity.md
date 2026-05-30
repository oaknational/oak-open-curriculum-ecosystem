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

- **EEF finishing plan (2026-05-30, Igneous Flaring Spark — supersedes the
  2026-05-29 Radiant S1–S5 bullet below)**: `eef-graph-tool-completion.plan.md`
  is now an **impact-led D0–D7, decision-complete** plan opening with a
  **Remediation Context** section (compounded mistakes-on-mistakes; root error =
  external-origin ≡ unknown-shape, repeated across the corpus typing / Zod schema /
  Zod loader / validator / ADRs 157/173/175/032/003). Ratified: axis = KNOWN vs
  UNKNOWN; **no Zod anywhere**; **expunge** the validator `data-export-must-be-unknown`
  rule; node type = `(typeof EEF_TOOLKIT_DATA.strands)[number]`; **graph-core query
  contract reshaped, not treated as fixed**; cap removed; ADR-038 generalised. The
  `repo-validators` gate is **RED** (pre-existing external-data-validator conflation
  — D0 fixes it, first execution step). Resume via the `eef` thread record banner.
- **Current branch**: `feat/graph-tooling-tidyup` (post-merge tidyup branch).
  **EEF Goal 2 / D0 is COMPLETE — PR #122 (`feat/graph-foundations` → `main`)
  MERGED at `29fc29e4` (2026-05-29, Quiet Hiding Hush).** The EEF graph
  foundation now ships **dark** behind `OAK_CURRICULUM_MCP_EEF_ENABLED` (proven
  OFF in every deployed environment). Next EEF step: **execute the finishing
  plan to close the tool** — `eef-graph-tool-completion.plan.md`, **rewritten
  2026-05-29 (Radiant Glimmering Aurora) under a deeper owner critique** to S1–S5
  with three baked-in directives: (1) the fixed `as const` corpus IS its own
  authority — derive types from it, DELETE the Zod/freshness/runtime-validation
  ingest layer; (2) NO stubs anywhere; (3) EXTEND the generic `NodeFilter` to
  nested paths. Then merge. The plan-estate consolidation + value-evaluation are a
  post-merge **team session**.
- **Active delivery focus**: `eef` **graph-tooling rebuild** is the only active
  product lane. The EEF explore tool + the gate-1a/1b split were diagnosed as
  the wrong foundation and discarded; the rebuild is built on the foundation
  doc. D0 (merge-safety) is done; the rebuild chain begins at D1. See the EEF
  section below and the `eef` thread record (which opens with a CURRENT-TRUTH
  banner) for live pickup.
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
- **Routing-legacy-fallback sunset (2026-05-29)**: **executed and landed**
  (`d9225d5b`) by Twilit Orbiting Satellite, picking up Leafy's retained claim
  `14b484d6`. Strict single-path id-keyed routing — legacy arm, fallback writer,
  and diagnostic deleted, fail-fast on an id-less identity; 10 RED unit tests and
  a previously-unlisted e2e greened; doctrine removal finished (PDR-076a sunset
  note; `register-identity-on-thread-join` reconciled to `(name, id)`;
  hardcoded coordinator-name strip in `use-agent-comms-log`). The
  comms-coordination plan cluster was then cross-linked and overlap-mapped
  (`d1525f55`) — see [`agent-tooling/future/README.md` §Comms / coordination
  cluster](../../plans/agent-tooling/future/README.md#comms--coordination-cluster),
  keystoned by the `collaboration-substrate-coordination-rightsizing` brief (M1
  inventory done; M2 owner-gated). Full `pnpm check` green. Claim closed.
- **Agentic-engineering tactical lane**: not an active product delivery arc.
  The recent pending-graduations cleanup collapsed sidecar files back into
  canonical [`pending-graduations.md`](pending-graduations.md), where the 56
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
| `eef` | EEF graph-tooling rebuild | [record][eef] | claude / claude-opus-4-8 / Igneous Flaring Spark / **finishing plan RESTRUCTURED 2026-05-30 to impact-led D0–D7, decision-complete (begun Misty Washing Lagoon, deepened this session under full owner metacognition). Axis = KNOWN vs UNKNOWN (no Zod anywhere); EXPUNGE the validator `data-export-must-be-unknown` rule (not soften); node type = `(typeof EEF_TOOLKIT_DATA.strands)[number]`; graph-core query contract RESHAPED, not fixed; cap removed; ADR-038 generalised. `repo-validators` gate RED — D0 fixes it (first execution step). D0 merge-safety done earlier (`29fc29e4`, dark). No commits this session.** / 2026-05-30 |
| `agentic-engineering-enhancements` | Practice continuity (tactical lane; not the active delivery focus) | [record][agentic] | claude / claude-opus-4-8 / Eclipsed Creeping Secret / Group A graduations LANDED — WS-Z converged + committed: all six graduations (Lane A retired-thread hygiene; Lane B PDR-011/ADR-150/§6c; Lane C PDR-087; Lane D PDR-088; Lane E PDR-058 S3/S4 + PDR-029 note), PDR README + practice-index rows for 087/088, RULES_INDEX 0 new rows, six register entries removed (substance verified live first), execution plan archived. Next: none queued for this thread; Groups B/D/E forks + claim-liveness owner-surfaced; napkin+distilled strict-hard owned by the fitness session / 2026-05-29 |

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
| `agent-collaboration-research` | Comms-corpus pattern research (owner-gated buffer) | [record][collab-research] | claude / claude-opus-4-8 / Twilit Orbiting Satellite / routing-sunset execution (claim 14b484d6) landed `d9225d5b`+`d1525f55` — research vector still owner-gated / 2026-05-29 |

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

> **UPDATED 2026-05-30 (Igneous Flaring Spark).** The S1–S5 detail below is
> SUPERSEDED. The finishing plan is now **impact-led D0–D7, decision-complete**.
> Next session = **execute D0** (doctrine ADRs + expunge the two erroneous
> external-data validator rules → greens the RED `repo-validators` gate), then
> **D1 (value, owner-ratified) ∥ D2 (typed foundation)**, then D3→D7. Authority =
> the `eef` thread record CURRENT-TRUTH banner + the plan's Remediation Context +
> Ratified Decisions sections. Do not resume the S1–S5 framing below.

**Live (2026-05-28 — REBUILT FROM FOUNDATIONS).** The EEF explore tool and the
gate-1a/1b split were diagnosed as the **wrong foundation** (list-thinking in a
graph domain; the graph query surface stubbed and then worked around). The old
EEF plan estate is archived at `.agent/plans/sector-engagement/eef/archive/`.
Superseded rebuild design docs (QUARANTINED 2026-05-30 to `eef/archive/`; the live
plan `eef/current/eef-graph-tool-completion.plan.md` is the single EEF plan):

- foundation (diagnosis carried into the live plan):
  `graph-tooling-rebuild-foundation-2026-05-28.md`
  (diagnosis; principles — graph != list, completeness-as-integrity-not-maximalism,
  build-the-query-surface, budget-as-design-signal, no soft stubs,
  structuredContent-only; discovery framing; open questions).
- plan (superseded by the live plan):
  `graph-tooling-rebuild.plan.md`
  (self-correcting deliverables; D0 merge-safety, D1 restate end-goal +
  graph-tool contract + fresh client research, D2 build the query surface,
  D3 complete navigable subgraph tool, D4 agent round-trip, D5 'working with
  graphs' skills + methodology graduation, D6 explore the value path, DX
  estate-wide reference reconciliation).

**Next safe step:** GOAL 1 is DONE (owner-ratified 2026-05-28). **GOAL 2 / D0
(merge-safety) is COMPLETE — PR #122 (`feat/graph-foundations` → `main`) MERGED at
`29fc29e4` (2026-05-29, Quiet Hiding Hush).** All D0 acceptance conditions met:
PR safe (CI green); flag co-gating proven (local both flag states incl. EEF tool
execution via the real `prod:harness` env path + preview authed `oak-preview`);
flag OFF in preview + production (owner-confirmed unset in Vercel — must be literal
`'true'` to enable); SonarCloud QG green (S4624 fixed `90714ea5`; hotspot S4036
SAFE). A flag-gating leak on the public landing page (EEF names shown even when
OFF) was found by the merge-readiness review and fixed at `28bb7ace` via a
single-source-of-truth `eef-surface.ts` consumed by both registration and the
landing page. **Next = execute the finishing plan
[`eef-graph-tool-completion.plan.md`](../../plans/sector-engagement/eef/current/eef-graph-tool-completion.plan.md)
to CLOSE the EEF work — REWRITTEN 2026-05-29 (Radiant Glimmering Aurora) under a
deeper owner critique**: S1 contract ADR → S2 corpus-is-its-own-typed-source
(derive `EefStrand`/vocab from the `as const` `EEF_TOOLKIT_DATA`; DELETE the Zod
`EefToolkitSchema`, `freshness.ts`, the drift-guard; collapse `loader.ts` to an
infallible adapter) → S3 extend `graph-core` `NodeFilter` to nested paths + build
ONLY the ops the tool consumes (`enumerateNodes`/`getNode`/`subgraph`) and DELETE
every unbuilt op from adapter AND interface → S4 thin tool (delete
`projection.ts`/`response-budget.ts`; `structuredContent`-only + derived
`outputSchema`) → S5 navigation round-trip. **Three deepened owner directives baked
in:** (1) the fixed `as const` corpus IS its own authority — derive types from it,
NEVER validate it (no Zod/freshness/integrity check; only the inbound request is
validated); (2) NO stubs anywhere; (3) EXTEND the generic filter to nested paths
(settled). That plan is now the single EEF plan; the earlier rebuild design docs
were quarantined to `archive/` (2026-05-30) as superseded broken-concept work. **Forward
sequence (owner-directed 2026-05-29):** next session executes the finishing plan →
merge → a **team session** for (a) tool-in-context evaluation (usefulness vs the
other curriculum tools) and (b) the graph + EEF plan-estate consolidation, briefed
by
[`graph-estate-consolidation.plan.md`](../../plans/connecting-oak-resources/knowledge-graph-integration/current/graph-estate-consolidation.plan.md)
(which also authors the value-evaluation plan, superseding
`eef-outcome-evaluation-infrastructure.plan.md`). The earlier "three items"
next-session scope is superseded by this planning session. The estate is mostly
superseded gate-1a/1b / five-increment framing — the consolidation brief carries
the verified disposition map so that session starts grounded. The F explore tool
(`2214f0b2`) is LANDED behind the flag, the wrong shape pending the S3 rebuild.

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

**2026-05-29 Group A graduations — LANDED (WS-Z converged + committed by Eclipsed
Creeping Secret).** All six owner-ratified graduations are committed: Lane A
(retired-thread-record hygiene), Lane B (PDR-011 / ADR-150 / session-handoff §6c
reflection-as-foundational), Lane C (PDR-087 TDD-as-design), Lane D (PDR-088
reviewers-carry-doctrine), Lane E (PDR-058 Surface 3 + Surface 4 optionality, plus
the scope-adjacent PDR-029 Amendment-Log note). WS-Z shared-index convergence done:
PDR README rows for 087/088, practice-index phenotype-bridge rows for 087/088,
RULES_INDEX 0 new rows (Lane E minted no rule files), the six register entries
removed (substance verified live in each home first), this file refreshed.
Execution plan archived to `archive/completed/`. **Next safe step for this thread:
none queued** — Groups B/D/E forks + claim-liveness promotion remain
owner-surfaced/unactioned; napkin + distilled strict-hard remediation is owned by
the separate fitness session.

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

### Pending-Graduations Register (decision packet owner-ratified 2026-05-29; Group C done, Group A planned)

The owner ratified the Sunlit decision packet on 2026-05-29 ("do all of it").
Progress this session (Tempestuous Vaulting Falcon):

- **Group C executed.** Adversarial re-verification (18 agents) found the Sunlit
  ledger's "recommend withdraw" verdicts **~83% wrong** (15 of 18 homes did not
  contain the substance — "verify the auditor" recursed one level deeper). **15
  kept, 3 withdrawn** (recurrence-rank weighting; napkin+`.remember/` PDR-011
  amendment; redundant-config marker). Per-item verdicts:
  [`curator-passes/2026-05-29-tempestuous-vaulting-falcon.md`](curator-passes/2026-05-29-tempestuous-vaulting-falcon.md).
- **Group A — DONE (2026-05-29).** All six graduations landed and the WS-Z
  convergence committed (in the owner's whole-tree sweep `9317cdcd`); the
  execution plan `group-a-graduations-execution.plan.md` is archived to
  `archive/completed/`. Two ledger home-recommendations were corrected at
  execution — #37 → PDR-058 sequencing-optionality, #22+23 → PDR-058 Surface 3.

**Group A graduations — DONE (2026-05-29, WS-Z committed by Eclipsed Creeping
Secret).** All six landed and committed; the six register entries removed
(substance verified live in each graduated home before removal — no breadcrumbs
left, the commit and the homes are the record); PDR README + practice-index rows
added for PDR-087/088; RULES_INDEX unchanged (Lane E minted no rule files);
execution plan archived to `archive/completed/`. Lane D naming-fix was DROPPED
("Test Reviewer" is the consistent cross-template H1 convention, not drift). The
register is GREEN. napkin (CRITICAL) + distilled (HARD) strict-hard remediation is
owned by the separate fitness session — NOT rotated or trimmed at WS-Z
(owner-directed deferral). Groups B / D / E forks + claim-liveness promotion remain
owner-surfaced, unactioned.

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

**handoff gate (2026-05-30, Igneous Flaring Spark — EEF finishing plan RESTRUCTURED to impact-led D0–D7)**:
`not due as a fresh trigger — owner-requested session-handoff + consolidate-docs
(session-completion mode) before compaction.` Planning-only session, zero product
code. Deepened the day's earlier impact-led restructure (Misty Washing Lagoon) into
a decision-complete D0–D7 plan under several owner correction passes; captured two
generalised cross-session lessons (existence-is-not-correctness / default-replace;
ground-convenient-claims) to platform memory + napkin + distilled. No commits, no
claim opened. **`pnpm check` is RED** on the pre-existing external-data-validator
conflation (`data-export-must-be-unknown` on the `as const` corpus) — the exact
defect D0 expunges; surfaced to owner repeatedly; owner directed planning +
compaction with it red (named constraint: the gate fix IS the plan's first step;
falsifiable — next session's D0 greens it). Fitness explicitly out of scope per
owner; napkin/distilled written at full weight, pressure owned by the separate
fitness session.

**handoff gate (2026-05-29, Radiant Glimmering Aurora — EEF finishing plan REWRITTEN under deeper owner critique)**:
`not due — planning-only session; no thread completed, no fitness trigger newly
fired.` Owner-directed session: read/reflect on `eef-graph-tool-completion.plan.md`
→ several escalating critique passes → **rewrote the plan S1–S5**. No code (owner
held implementation). Three deepened directives baked in (corpus `as const` is its
own authority — delete the Zod/freshness ingest; NO stubs; extend the generic
`NodeFilter` to nested paths); thread record banner + this file refreshed; the
superseded plan-mode scratch file removed. No claim opened (nothing to close). A
strong behaviour-changing lesson captured (the verify-reflex regenerated in six
costumes; re-served settled decisions as options; read the primary artefact before
the machinery) — napkin + distilled. **napkin is at 705 lines (well past CRITICAL
450)** — remediation remains owned by the separate fitness session per prior owner
deferral; this session added one full-weight entry per knowledge-preservation
rather than trimming. Readiness reviewers for the rewritten plan are pending
(assumptions-expert on the chain; type-expert at S3; mcp-expert at S4) — surfaced,
not dispatched (the plan is queued, not yet owner-moved toward execution).

**handoff gate (2026-05-29, Pelagic Sailing Sextant — EEF completion + consolidation PLANS authored)**:
`not due — planning-only session; the owner deferred the graph-estate
consolidation to a fresh post-merge team session.` Briefed by
`graph-estate-consolidation.plan.md`.
Verified true state against code + git via a 6-agent workflow (D0 merged/dark at
`29fc29e4`/v1.15.0; D1–D6+DX not started; 5/7 GraphView ops `NotImplementedYet`;
the tool is real but F-shape — `capForBudget` + `projectExploreNode` + dual emit).
Authored + committed (`4380bc9e`) the simple/linear finishing plan
`eef-graph-tool-completion.plan.md` (S1–S4; supersedes rebuild D1–D6+DX) and the
`graph-estate-consolidation.plan.md` fresh-session brief; refreshed the `eef`
thread record + these continuity surfaces. assumptions-expert reviewed both plans
(scope proportionate; supersession sound; 3 unclassified files added to the
brief's verify-first). No claim opened (solo). `pnpm check` green at handoff.

**handoff gate (2026-05-29, Quiet Hiding Hush — EEF D0 COMPLETE + merged)**:
`completed this handoff — owner-requested deep session-handoff + consolidate-docs
after PR #122 merged`. EEF Goal 2 / D0 is done and **PR #122 is MERGED to `main`
(`29fc29e4`)**; now on `feat/graph-tooling-tidyup`. This session: pushed the D0
bundle; fixed S4624 (`90714ea5`); wrote the owner-authorised S4036 hotspot SAFE
disposition → QG green; proved the MCP server fully functional locally (real
`prod:harness`, both flag states, EEF tool executes when ON) and in the Vercel
preview (authed `oak-preview` + unauth surfaces); found+fixed a landing-page
flag-gating leak via a single-source-of-truth `eef-surface.ts` (`28bb7ace`,
in-cycle reviewed); ran a merge-readiness review workflow (GO, zero blockers).
No claim opened this session (nothing to close). `pnpm check` run at handoff (see
cleanliness gate). The `feat/graph-tooling-tidyup` tree carries the accumulated
multi-thread continuity/state (Leafy + Eclipsed WS-Z/routing-sunset WIP + this
session's continuity) which the owner directed be landed in a tidyup commit.

**handoff gate (2026-05-29, Twilit Orbiting Satellite — routing-sunset closeout)**:
`not due — focused session-completion consolidation ran this handoff`. The
routing-legacy-fallback sunset landed (`d9225d5b`) and the comms-coordination plan
cluster was cross-linked and overlap-mapped (`d1525f55`); continuity refreshed and
claim `14b484d6` closed (archived). No cross-session graduation was triggered by
this lane. The napkin (CRITICAL) and distilled (HARD) rotation and the
pending-graduations drain remain owned by the separate fitness session, unchanged
by this closeout — the napkin gained one full-weight session entry per
learning-preservation-over-fitness, routing the pressure there rather than trimming.

**handoff gate (2026-05-29, Eclipsed Creeping Secret — WS-Z DONE)**: Group A WS-Z
convergence is committed. All six graduations landed; the six register entries
removed (substance verified live in each home first — no breadcrumbs, the commit
and the homes are the record); PDR README + practice-index rows added for
PDR-087/088; RULES_INDEX unchanged (Lane E minted no rule files); execution plan
archived to `archive/completed/`. The bounded deep-consolidation work named in the
entries below is now COMPLETE — Group A is drained. Remaining deep-consolidation
pressure is owned by the separate fitness session: napkin (CRITICAL, 555 lines) +
distilled (HARD, 236) strict-hard remediation, NOT rotated/trimmed at WS-Z
(owner-directed deferral). Gatekeeper gates run on the settled WS-Z tree before
commit. Inbound for a live pending-graduations triage session: ~14–22 net-new
graduation candidates from Highland (reconcile count first; do not duplicate
existing register entries).

**handoff gate (2026-05-29, Shaded Prowling Threshold; updated at closeout as events
landed)**: `due — not this closeout`. Lane A landed owner-approved (uncommitted); **Lane E
now OWNER-APPROVED** (Furnace Melting Bellows; 3 files incl. scope-adjacent PDR-029). The
bounded deep-consolidation work is Group A **WS-Z convergence** (index rows + the 6 register
removals + single-gatekeeper commit), parked for the **next session** and now **fully
unblocked** (Lane E sign-off cleared). **Napkin is NOT being rotated** — owner pulled fitness
from Highland's scope to a separate fitness session, so `napkin.md` stays **CRITICAL** (508 lines,
hard 300 / critical 450 — past critical, a loop-failure signal per ADR-144); WS-Z records
`strict-hard` RED on it as **remediation-deferred-to-the-fitness-session**, an owner-approved
deferral, not a WS-Z defect. `pnpm check` deferred to WS-Z's single gatekeeper
commit per `check-singleton-per-window`. Shaded's + Furnace's claims closed; the Group A +
Lane E files are unclaimed for the next session. Separately inbound: ~14 net-new graduation
candidates from Highland for next-session pending-graduations triage.

**handoff gate (2026-05-29, Veiled Stealing Candle)**: Group A execution
(agentic-engineering-enhancements). Landed UNCOMMITTED + gated-green:
ws-readiness gate (7-agent workflow — 2 plan reviewers + 5 adversarial
home-verifiers; all 5 lanes confirmed home-correct/non-duplicate/evidence-holds);
Lane B (PDR-011 reflection-as-foundational reframe — including a Vector-B
observable-guard added to consolidate-docs §4 after adversarial verification —
plus ADR-150 mirror + session-handoff §6c); Lane C (PDR-087 TDD-as-design,
governance); Lane D (PDR-088 reviewers-carry-doctrine, governance). PDR numbers
087/088 deconflicted from the role-emission PDR-086 reservation. ALSO landed:
ADR-168 §5 — graduates the `scripts/`-is-no-checks-zone doctrine that Wooded
captured in the napkin AND I misread (two-instance owner-directed cure: doctrine
in ADR-168, discoverable pointer in `vitest.config.base.ts`, optional mechanical
check noted; docs-adr-expert reviewed → sound-with-suggestions, suggestions
folded); plus `.remember/` added to the vocab-validator exclusion (mirrors
`.agent/experience/`; vocab gate GREEN). Deep consolidation NOT separately due —
the Group A WS-Z convergence (next session) IS the bounded convergence + commit +
napkin rotation (napkin HARD 320/300). Owner-directed session-end before lanes
A/E/WS-Z. No retained claim (registry empty). Minimal-ceremony session per owner
direction (no comms broadcasts/monitors/heartbeat cron).

**handoff gate (2026-05-29, Wooded Creeping Thicket)**: EEF Goal 2 / D0 Lane C4
landed (`validate-external-data-files` repo-validator; `0d45cf07` + knip fix
`fc14463d`). My C4 commits are gate-clean (full pre-commit hook + knip + depcruise
verified). **Full `pnpm check` NOT run** — named constraint: the shared tree
carries a concurrent agent's uncommitted substantive WIP (PDR-011, ADR-150,
consolidate-docs + session-handoff SKILLs, PDR-087, group-a plan), which a full
`pnpm check` would validate but is not mine to land; plus the heavy e2e/widget/a11y
suites are unrelated to a repo-validator change. Falsifiable: next session runs
`pnpm check` green on a settled tree before the owner-gated merge. Deep
consolidation **not newly due** by this session; two PDR/pattern candidates
captured in the napkin (external-data file convention; scripts/-is-no-checks-zone)
for the next register refresh — they fold into the Group A execution session that
Tempestuous already queued. My claim closed; see below.

**handoff gate (2026-05-29, Tempestuous Vaulting Falcon)**: pending-graduations
decision-packet execution. Group C re-verified (15 keep, 3 withdraw; ledger
`curator-passes/2026-05-29-tempestuous-vaulting-falcon.md`); Group A queued as
`group-a-graduations-execution.plan.md` (parallel lanes), NOT executed — the
sanctity Core PDRs need owner review and the owner directed plan-now / execute-
next-session. Deep consolidation is **due — Group A graduations + the
verify-the-auditor-recursion distilled candidate** but DEFERRED to the Group A
execution session (that plan IS the bounded convergence). Stale-claim 4th-instance
recorded on the claim-liveness future plan. `pnpm check` NOT run this session —
Deciduous left an uncommitted, test-unverified D0 bundle in the shared tree and
deferred full gates; my commit is doc-only by explicit pathspec. Both Deciduous
and I closed our claims; the active registry is empty.

**handoff gate (2026-05-29, Deciduous Climbing Root)**: Goal 2 / D0 IN PROGRESS,
local uncommitted bundle (Lane A S7763 generator-first + Lane D 4 comments + Lane C
external-data convention rename/policy/config; validator + hotspot SAFE +
flag/Vercel + gates + gateway + owner-gated merge remaining). type-check + lint
GREEN; full `pnpm check` NOT run — deliberate deferral: mid-D0 (validator pending,
not a landing), nothing pushed, and a concurrent agent (`Tempestuous Vaulting
Falcon`, `441c78`) shares the tree so `check-singleton` + `format:root`-collision
risk applies — the next session runs full gates before the owner-gated merge. Deep
consolidation **not due** — no thread completed; the external-data-convention
PDR/pattern candidate is captured in the napkin for the next register refresh.
Continuation: [`eef` thread record][eef] § 2026-05-29 entry.

**current**: the closed-claims archive curation pass processed all 1091 archived
claims, routed the only durable lifecycle lesson to the curation report and this
resume pointer, and cleared the archive content. Proof:
[`2026-05-27-nebulous-threading-prism-closed-claims.md`](curator-passes/2026-05-27-nebulous-threading-prism-closed-claims.md).

**current (2026-05-28, Sunlit Waxing Moon)**: superseding the prior "not another
sidecar drain" stance — the owner commissioned a dedicated drain, so the full
register (~70 items) now carries a verified per-item verdict in
[`curator-passes/2026-05-28-sunlit-waxing-moon.md`](curator-passes/2026-05-28-sunlit-waxing-moon.md).
The live decision work is owner ratification of that ledger's grouped decision
packet. Key finding: the verification report Leafy left is unreliable, so no items
were removed and no rules/PDRs authored. Deep consolidation this handoff: owner-directed
`consolidate-docs` run (graduating this session's process insights).

**routing**: detailed consolidation, handoff, and session-close history now
lives in thread records, curator reports, completed plans, and prior continuity
archives. This file should stay an operational index and should not regain
per-session closeout prose.

**handoff gate (2026-05-28, Kilned Brazing Bellows)**: root-cause investigation
of Leafy's `/compact` crash → agent-tooling substrate recording. Landed (working
tree; explicit-pathspec commit, disjoint from Sunlit's drain): compaction bug
report (`reports/claude-code-compaction-thinking-block-bug-2026-05-28.md`),
`claim-liveness-crash-reconciliation-and-session-forensics` +
`collaboration-substrate-coordination-rightsizing` future plans, relink of
`comms-watch-liveness-floor` non-goal #3, bidirectional cross-link from
`routing-legacy-fallback-sunset` §Open-problems. A 62-item deferral/non-goal audit
of the collaboration-substrate cluster found one genuine orphan (substrate
over-accretion), now homed in the rightsizing brief; the rest were healthy
boundaries-with-homes, ratified principles (doc-consolidation signal), or
correctly-gated deferrals — no plan-proliferation. consolidate-docs run this
handoff (process insights). `pnpm check` NOT run (owner direction;
check-singleton — Sunlit closing concurrently). napkin is co-mingled with
Sunlit's concurrent entries; left unstaged for the gatekeeper.

**handoff gate (2026-05-28, Woodland Swaying Pollen)**: session-handoff +
consolidate-docs at owner request. EEF Goal 1 (design-settling) DONE +
owner-ratified — plan SPECIFIED, foundation §10 resolved, new
`extending-graph-support-tooling` plan, D0 gains the deployed-env flag posture +
a "fix-ALL-open-quality-signals" prerequisite (3 commits `4e443f15` / `a37f4075`
/ `63c7c1be`, last local). PR #122 CI green except the SonarCloud QG (2 `S7763`
in generated SDK code, 1 PATH hotspot, 3.9% new-dup — all branch-wide, none from
this session); captured as the D0 prerequisite with COMPLETE cures (generator
fix, never Sonar-exclusion). Metacognition: the escape-hatch reflex
(defer/menu/list-op/suppress-the-signal) was owner-caught 4× → generative
pre-output screen added to `distilled.md`. `pnpm check` NOT run (owner direction).

**handoff gate (2026-05-28)**: Sylvan Whispering Fern ran
`/oak-consolidate-until-done` (dedicated-knowledge-curation). strict-hard GREEN
(was 1 HARD: `napkin.md`); napkin rotated 408→36 lines (archived verbatim), 4
lessons graduated to `distilled.md`; open-questions Q-001 withdrawn (gate-1a/1b
framing superseded by the graph rebuild); pending-graduations and the 2765-event
comms corpus confirmed owner-gated (preserved by design). Ledger:
[`curator-passes/2026-05-28-sylvan-whispering-fern.md`](curator-passes/2026-05-28-sylvan-whispering-fern.md).
The working tree carries the curation bundle, the 2-file PDR-082→086 renumber
(D4, owner-aware), and these handoff edits — ALL INTENDED; do not classify as
orphan. The stale `.git/index.lock` has since cleared and Cursor staged the
curation + renumber (7 files) externally; the 2 handoff edits (this entry + the
napkin session note) remain unstaged. Commits OWNER-HELD by direction — land as
two commits (A: renumber, message validated; B: curation) after staging the
handoff edits.

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
