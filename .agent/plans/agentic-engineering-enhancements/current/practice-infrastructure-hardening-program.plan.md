---
name: "Practice Infrastructure Hardening Program 2026-05-23"
overview: >
  Owner-initiated roll-up plan tracking the multi-agent practice-infrastructure
  hardening work being done by the 2026-05-23 PM team (Director Seaworthy
  Navigating Beacon lineage; marshal Ashen Brazing Crucible; implementers
  Ferny / Twilit ST / Charcoal / Lanternlit). This file is the source of truth
  for *vision*, *workstream roll-up*, *safe-pause criteria*, and
  *completion criteria*. It exists because owner direction (2026-05-23
  ~15:40Z) is that EEF First Feature is the priority lane and the team needs
  to know when the practice-infrastructure work can be parked without
  stranding in-flight substrate.
todos:
  - id: ws-1-pdr-075
    content: "WS-1 — PDR-075 Director substrate-writing discipline. Status: LANDED at b6ac6147 (Twilit Weaving Moon authored; Seaworthy/Scorched-window verification). Closes when: ratification trail has ≥1 cross-session worked instance after a fresh Director takes the role under PDR-075 discipline (first such instance was Secret bootstrapping from substrate alone in 40s — already in evidence base)."
    status: completed
  - id: ws-2-pdr-076
    content: "WS-2 — PDR-076 v2 Agent identity tuple + body-file frontmatter. Status: LANDED at db4d8b3a with open owner-decision on (C) SPLIT 076a / 076b. Closes when: owner verdicts on SPLIT vs single PDR; if SPLIT, both child PDRs land."
    status: pending
    depends_on: []
  - id: ws-3-adr-185
    content: "ADR-185 v2 comms-event auto-acceptance metadata. Status: LANDED at 5320d6b0 (orphan-absorption; Ferny adoption). Closes when: comms renderer wires [AUTO-ACCEPT] vs [AUTO-ACCEPT-CLAIMED] discriminator from verified vs advisory metadata — separate executable plan, not blocking this program."
    status: completed
  - id: ws-4-recursion-pattern
    content: "WS-4 — Recursion-of-doctrine-under-team-cadence-speed pattern. Status: LANDED at c097bbb3 (5 same-session worked instances). Promotion to PDR (pdr_kind: pattern) on second cross-session worked instance; currently candidate in pending-graduations."
    status: completed
  - id: ws-5-substrate-pointer-pattern
    content: "WS-5 — substrate-pointer-read-as-current-state pattern. Status: DRAFTED in working tree (.agent/memory/active/patterns/substrate-pointer-read-as-current-state.md) with 6 worked instances (D1–D6) captured this session. Closes when: file lands via marshal cycle."
    status: pending
    depends_on: []
  - id: ws-6-marshal-cycle-discipline
    content: "WS-6 — Marshal-as-cycle-discipline. Status: AUTHOR ASSIGNED — Charcoal Brazing Kiln (Seaworthy-routed 2026-05-23 15:56:36Z as idle-fill, concurrent with Charcoal's post-landing adversarial lane on Cycle #10). PDR/ADR kind is fred's principles-first call; 3-way fan-out dispatched (assumptions-expert + architecture-expert-fred + docs-adr-expert). EMPIRICALLY VALIDATED (9 cycles in 45 min under Ashen marshal vs pre-marshal ~1/Director-window). Closes when: doctrine file lands with role definition, cycle protocol, gate-singleton invariant, throughput observation, standing-duty intersection (feedback_marshal_queues_comms_and_memory_state), PDR-063/PDR-064 cross-references."
    status: pending
    depends_on: []
  - id: ws-7-pr-108-sonar-clearance
    content: "WS-7 — PR #108 SonarCloud + CodeQL quality-gate clearance. Status: Scorched fan-out synthesised Cycle Block 1–4 cure plan (event 533e0b02 + addendum); type-expert ES2023 confirmation absorbed; awaiting Seaworthy routing (R1 push-only / R2 mechanical cures / R3 SonarQube MCP dispositions / R4 duplication cures). Closes when: PR #108 quality gate flips GREEN and merge becomes possible. SHARED SUBSTRATE — also EEF merge-path unblock."
    status: pending
    depends_on: []
  - id: ws-8-architectural-direction-self-mod-authz
    content: "WS-8 — Architectural-direction ratification on Claude self-modification authorisation cure-shapes. Status: Charcoal C2/C5 broadcast surfaced (verdict matrix C1 UNSAFE / C2 SAFE-WITH-CONDITIONS / C3 UNSAFE / C4 SAFE-WITH-CONDITIONS / C5 SAFE; recommended C2-near-term + C5-long-term + C4-fallback). Closes when: owner verdicts on cure-shape AND either ADR drafted OR explicit owner deferral with named trigger."
    status: pending
    depends_on: []
  - id: ws-9-twilit-fm2-p2-cure
    content: "WS-9 — Twilit ST FM-2 P2 plan-Wilma verdict + cure landing. Status: Wilma dispatch in progress at handover; 15:04Z verification ask pending. Closes when: Wilma verdict landed; cure code landed; FM-2 (session-open environment freshness check) substrate complete."
    status: pending
    depends_on: []
  - id: ws-10-heartbeat-cron-mechanism
    content: "WS-10 — Heartbeat contract operationalisation (durable mechanism). Status: PENDING — interim mechanism is narrative comms event with tags ['heartbeat'] per Seaworthy tick #4 (2026-05-23 15:58:52Z); durable mechanism is structured `last_heartbeat_at` field on active-claims.json per identity tuple + `pnpm agent-tools:heartbeat` CLI wrapper (PDR candidate at napkin 15:09Z; named in Director tick #4 substrate). Owner-directed permanent + session-wide rule for all start-right-team sessions. Closes when: durable mechanism shipped (schema field + CLI wrapper + claim auto-rebalance protocol substrate). Interim mechanism is workable; durable substrate work deferred until knip-RED + WS-9 land."
    status: pending
    depends_on: []
  - id: ws-11-heartbeat-skill-amendment
    content: "WS-11 — start-right-team SKILL amendment for heartbeat doctrine. Status: AUTHOR ASSIGNED — Lanternlit Listening Dusk (Seaworthy-routed 2026-05-23 16:02:27Z from Ferny-withdrawal at 16:02:24Z per feedback_practice_docs_sacred; care-and-consult sequential-reviewer-pass discipline, NO parallel sub-agent compression). Scope: §0.5 (or fold into §0) heartbeat-cron-start First Move + §1 Register Presence amendment + §Closeout Contract amendment + exemptions (coordinator-transfer 30-min grace, marshal-cycle contiguous-execution, sub-agent-dispatch verdict-synthesis). Cross-references: PDR-064 + ADR-183 + PDR-027 + Ferny substrate-pointer-pattern §C2/§C5 + PDR-candidate-at-napkin-15:09Z. Reviewer flow: docs-adr-expert → assumptions-expert → owner review → marshal-request. Closes when: SKILL amendment landed + owner ratified + Mistbound marshal-cycle commits."
    status: in_progress
    depends_on: []
  - id: gate-safe-pause
    content: "GATE — Safe-Pause readiness for EEF pivot. Holds when ALL of: WS-7 GREEN (PR #108 unblocked), WS-2 owner-verdict on SPLIT recorded, WS-5 pattern landed, WS-9 Wilma verdict surfaced (verdict OR explicit timeout-with-default), and all marshal-queued cure-bundles either landed or explicitly stood down. Trigger: surface to owner with safe-pause attestation; on owner GO, team pivots to EEF WS4.1 graph-corpus-sdk rescue and PR-108-snagging.plan.md execution."
    status: pending
    depends_on: [ws-2-pdr-076, ws-5-substrate-pointer-pattern, ws-7-pr-108-sonar-clearance, ws-9-twilit-fm2-p2-cure]
  - id: gate-complete
    content: "GATE — Program completion. Holds when ALL of: Safe-Pause gate held AND WS-6 marshal-cycle-discipline doctrine home landed AND WS-8 architectural-direction ratified (or explicitly deferred with trigger). The completion bar is observable: next team window runs without producing new substrate-stale-pointer instances OR a new cure-shape for the pattern lands."
    status: pending
    depends_on: [gate-safe-pause, ws-6-marshal-cycle-discipline, ws-8-architectural-direction-self-mod-authz, ws-11-heartbeat-skill-amendment]
isProject: true
---

# Practice Infrastructure Hardening Program 2026-05-23

**Last Updated**: 2026-05-23
**Status**: SEQUENCE-LIVE — team mid-window; Safe-Pause gate pending on 4 workstreams.
**Collection**: `agentic-engineering-enhancements/current`.
**Threads Touched**:
[`agentic-engineering-enhancements`](../../../memory/operational/threads/agentic-engineering-enhancements.next-session.md)
(primary — all workstreams);
[`eef`](../../../memory/operational/threads/eef.next-session.md)
(WS-7 cross-cuts because PR #108 unblock is shared substrate).
**Authoring agent**: Lanternlit Listening Dusk / `claude` /
`claude-opus-4-7` / `78683a`.
**Owner direction prompting this plan**: 2026-05-23 ~15:40Z — "EEF First
Feature is the priority, but I want to know what the current team is
working towards … we need an overarching plan tracking this work, not
least because we need to know 1. When it is complete, and 2. when we can
usefully stop without stranding work, and move focus back to EEF First
Feature."

## End Goal

Multi-agent collaboration substrate hardened enough to sustainably
support high-throughput parallel work on product feature lanes — EEF
first-feature delivery being the canonical target. The empirical thesis
under test: marshal-as-cycle-discipline plus substrate-writing
discipline plus identity-tuple disambiguation collapse Director-window
cycle time from ~1 commit/window (pre-active-marshal) to ~9/45min
(observed this session under Ashen marshal authority).

## Mechanism

Every coordination defect caught in the team's own work becomes durable
substrate (PDR / ADR / pattern / rule). The closed loop:

1. Cadence pressure surfaces a defect (substrate-stale-pointer,
   recursion-of-doctrine, identity collision, hidden trust gradient on
   comms events, says-closed asymmetric routing, etc.).
2. Worked instance captured in comms substrate (Director-tick or
   substrate-broadcast).
3. Pattern file authored when ≥2 worked instances accumulate.
4. PDR / ADR drafted when pattern requires architectural change or
   doctrine codification.
5. Rule activated when violation pattern is mechanically catchable.
6. Next team window validates the substrate; if no new instances
   surface, the cure holds. If new instances surface, the cure-shape is
   refined.

This program tracks the *current generation* of cures in flight. It is
not a forever-plan; it closes when the current cures harden enough that
the team can pivot to product-feature work without stranding in-flight
substrate.

## Workstream Roll-up

| WS | Artefact | Status | Closes when |
|----|----------|--------|-------------|
| WS-1 | PDR-075 Director substrate-writing discipline | LANDED `b6ac6147` | Cross-session ratification (already in evidence) |
| WS-2 | PDR-076 v2 Agent identity tuple + body-file frontmatter | LANDED `db4d8b3a` (open (C) SPLIT) | Owner verdict on SPLIT; SPLIT children land if chosen |
| WS-3 | ADR-185 v2 comms-event auto-acceptance metadata | LANDED `5320d6b0` | Renderer wiring (separate plan) |
| WS-4 | Recursion-of-doctrine pattern | LANDED `c097bbb3` | PDR promotion on 2nd cross-session instance |
| WS-5 | substrate-pointer-read-as-current-state pattern | DRAFTED working-tree | Marshal cycle lands the file |
| WS-6 | Marshal-as-cycle-discipline | EMPIRICALLY VALIDATED, no doctrine home | PDR or ADR landing |
| WS-7 | PR #108 SonarCloud + CodeQL clearance | Cycle Block 1–4 ready, queued on Director routing | PR #108 quality gate GREEN, merge possible |
| WS-8 | Claude self-modification authz cure-shape ratification | Verdict matrix surfaced (C2-near + C5-long + C4-fallback) | Owner verdict; ADR drafted or explicit deferral with trigger |
| WS-9 | Twilit ST FM-2 P2 plan-Wilma verdict + cure | Wilma dispatch in progress, verification pending | Verdict + cure code landed |
| WS-10 | Heartbeat contract durable mechanism | INTERIM live (narrative tags); durable mechanism deferred | Schema field + CLI wrapper + auto-rebalance protocol shipped |
| WS-11 | start-right-team SKILL amendment for heartbeat doctrine | AUTHOR IN PROGRESS (Lanternlit, Seaworthy-routed 16:02:27Z) | SKILL amendment landed + owner ratified + marshal-cycle commits |

## Safe-Pause Criteria — when EEF can resume without stranding work

The team can safely stand down this program and pivot focus to EEF
First Feature when ALL of the following hold:

1. **WS-7 GREEN** — PR #108 quality gate clears. This is the
   substrate-blocker for the EEF merge path; pausing with PR #108 still
   red strands all EEF graph-substrate work behind a closed merge gate.
2. **WS-2 owner-decision recorded** — owner has either ratified
   PDR-076 v2 as-is (single PDR) or verdicted SPLIT and both child
   PDRs (076a / 076b) are landed. Leaving an open architectural
   open-question on a landed PDR strands future contributors against
   ambiguous doctrine.
3. **WS-5 pattern file landed** — the substrate-pointer-read pattern
   captures 6 worked instances from this session window; pausing before
   the file lands forfeits the pattern (six observations is high-cost
   substrate; pattern-fade in the next session window is the
   alternative).
4. **WS-9 has a verdict or explicit timeout-with-default** —
   verification asks at 15:04Z to Twilit ST + Charcoal are open;
   substrate-stale-pointer rule means the team cannot assume silence is
   resolution. Either Wilma verdict surfaces and is absorbed, or
   timeout fires and the cure path is explicitly chosen by Director
   default.
5. **All marshal-queued cure-bundles either land or are explicitly
   stood down** — Scorched's Cycle Block 1–4 plan is queued at
   Seaworthy. If Seaworthy resumes and routes them, they land. If not,
   they must be explicitly stood down (handoff record + comms event)
   so the next session does not inherit ghost-queue.

Each of these is a strand. Cutting any of them mid-flight produces
recovery cost in the next session. Holding all five is the bar for
"safe pivot to EEF without leaving knot-ends".

## Completion Criteria — when this program is fully done

The program completes when:

1. All Safe-Pause criteria above are met (no stranded work).
2. **WS-6 has a durable doctrine home** (PDR or ADR landed) capturing
   marshal-as-cycle-discipline. The empirical 9-cycles-in-45-min
   result is not durable substrate — only an ADR or PDR is. Without
   this, the cure dies when the team rotates.
3. **WS-8 architectural-direction ratified** — owner has verdicted on
   C2-near-term + C5-long-term + C4-fallback cure-shapes for Claude
   self-modification authz, and either an ADR is drafted or an
   explicit owner-deferral with a named trigger is recorded.
4. **WS-11 SKILL amendment landed** — heartbeat doctrine codified in
   `start-right-team` SKILL; future sessions inherit the contract
   automatically rather than via in-window broadcasts. (WS-10 durable
   mechanism is NOT a Completion gate — interim narrative-tagged
   events are workable; durable substrate is deferred work.)
5. **Observable next-window evidence** — the next team window applies
   the substrate and either (a) produces no new substrate-stale-pointer
   instances OR (b) produces a new cure-shape that the program absorbs
   as a new workstream.

Completion is observable, not ceremonial: the next team window runs
faster and produces less doctrine debt. If it does not, the program
has not completed and a follow-on cure-shape is required.

## Relationship to EEF First Feature Delivery (priority lane)

This program is *enabling infrastructure* for EEF. Specifically:

- **WS-7 (PR #108 clearance)** is on the EEF critical path — the
  graph-substrate work that delivers EEF first-feature gate-1a
  (`eef-explore-evidence-for-context`) cannot merge until PR #108 is
  GREEN.
- **WS-1 / WS-2 / WS-3 / WS-4 / WS-5 / WS-6** are throughput
  infrastructure — they make multi-agent EEF work sustainable rather
  than producing a single high-cost team session followed by recovery
  windows.

EEF outstanding work after Safe-Pause pivot:

- WS4.1 graph-corpus-sdk scaffold (Lunar Illuminating Eclipse staged
  16 files at 21:21Z 2026-05-22; silent since the COMMIT_EDITMSG
  incident; rescue path TBD).
- `pr-108-snagging.plan.md` execution (Phase 0 disposition ledger +
  12 cycles; converges with WS-7 above).
- ws2-source-map-parser-integration (Sparking's split-out cycle;
  never authored; clean pickup).
- Critical-path beyond Round 2: WS4.5 EefStrandsGraphView, t2-zod-loader,
  t6a-explore-tool, ff3 / ff4 / ff5 / ff6.

See [`threads/eef.next-session.md`](../../../memory/operational/threads/eef.next-session.md)
for the EEF execution detail.

## Non-Goals

- **Not** authoring new PDRs / ADRs / patterns without ≥1 worked
  instance backing them. Doctrine inflation is the failure mode the
  recursion-of-doctrine pattern guards against; this plan is bound by
  that pattern.
- **Not** indefinitely blocking EEF priority. Safe-Pause criteria are
  the bar — once they hold, the team pivots regardless of whether
  Completion criteria hold.
- **Not** capturing every Director-window narrative observation as a
  doctrine landing. Patterns require ≥2 worked instances minimum.
- **Not** re-opening canonicalisation, monorepo workspace topology, or
  other parked architectural threads (per repo-continuity § Repo-Wide
  Invariants / Non-Goals).

## Owner Ratification Status

This plan's vision read is **awaiting Director ratification**.
Directed comms-event sent to Seaworthy Navigating Beacon (incoming
Director, currently compacting) asking:

> Owner asked me to author an overarching plan tracking the team's
> practice-infrastructure-hardening work. My vision read: the team is
> building substrate that makes multi-agent product-feature lanes
> (esp. EEF) sustainably faster. Plan at
> `.agent/plans/agentic-engineering-enhancements/current/practice-infrastructure-hardening-program.plan.md`.
> Confirm or refine the End Goal + Mechanism sections, and ratify the
> Safe-Pause Criteria as the pivot trigger.

Director response will be absorbed via amendment commit; the plan body
is the source of truth, comms substrate is the audit trail.

## Plan-Body First-Principles Check

Per [`.agent/rules/plan-body-first-principles-check.md`](../../../rules/plan-body-first-principles-check.md):

- **Shape**: this is a roll-up program plan, not an executable TDD-cycle
  plan. The unit of landing is per-workstream, not per-cycle within
  this plan. Each workstream has its own atomic landing (commit) under
  its own discipline (most are already landed; WS-5, WS-6, WS-8 are
  the in-flight authoring lanes).
- **Landing path**: this plan body is itself the only landing this
  plan authors. WS-level landings are tracked here but executed under
  their own claims / authors.
- **Vendor-literal**: no vendor commands or API shapes prescribed by
  this plan; WS-7 references vendor surfaces (SonarCloud, CodeQL) but
  delegates execution to `pr-108-snagging.plan.md`.

## Foundation Alignment

- [`principles.md`](../../../directives/principles.md) — architectural
  correctness over short-term expediency; the Safe-Pause gate exists
  precisely because pausing without it would be short-term expediency
  paying long-term recovery cost.
- [`testing-strategy.md`](../../../directives/testing-strategy.md) —
  not directly invoked; this plan tracks doctrine work, not product
  TDD cycles. WS-9 cure code lands under standard TDD discipline.
- [`schema-first-execution.md`](../../../directives/schema-first-execution.md) —
  not directly invoked.

## Lifecycle Triggers

Per [`templates/components/lifecycle-triggers.md`](../../templates/components/lifecycle-triggers.md):

- **Session-open touch point**: any agent opening a session under
  `agentic-engineering-enhancements` or `eef` thread reads this plan's
  Workstream Roll-up + Safe-Pause Criteria to determine current state.
- **Session-close touch point**: any session that lands a workstream
  artefact updates the corresponding WS row in §Workstream Roll-up
  with the landing commit SHA.
- **Director-handover touch point**: incoming Director ratifies or
  refines End Goal / Mechanism / Safe-Pause Criteria; refinements
  land as amendment commits.
- **Owner-decision touch point**: WS-2 SPLIT verdict, WS-8 cure-shape
  verdict, and Safe-Pause GO are owner-decision points; this plan is
  surfaced to owner at each one.
- **Archive touch point**: when Completion gate holds, this plan
  moves to `archive/completed/` and its substance is mined to the
  permanent doctrine homes (PDRs / ADRs / patterns) referenced above.

## Risks

1. **Recursion-of-doctrine** — this plan itself could become another
   instance of the pattern it's trying to track. Mitigation: the plan
   tracks artefacts that already exist (LANDED / DRAFTED / EMPIRICAL),
   not speculative future doctrine. WS-6 and WS-8 are the only
   workstreams authorising new substrate, both gated on existing
   worked-instance evidence.
2. **Substrate-pointer-read on this plan** — future agents reading
   this plan in a snapshot moment may not realise WS rows can land
   between reads. Mitigation: every WS row carries a commit SHA when
   landed; absence of SHA means "not landed yet, check live state".
3. **Safe-Pause flake** — Safe-Pause criteria are checkable but
   require the next agent to actually read them. Mitigation: lifecycle
   trigger at session-open points all `agentic-engineering-enhancements`
   sessions at the Workstream Roll-up + Safe-Pause Criteria sections.

## Readiness Reviewers

Not invoking specialist reviewers on plan-author boundary —
this is a roll-up tracking plan describing existing substrate, not a
plan authorising new architectural work. Each WS authorises its own
reviewer set under its own discipline (e.g., WS-6's PDR / ADR will go
through `assumptions-expert` + relevant architect; WS-7 already had
4-way fan-out under Scorched's window).

If owner directs reviewer dispatch on this plan body itself, the
expected set is `assumptions-expert` (proportionality of the
program-plan shape and Safe-Pause criteria) and the incoming Director
(Seaworthy) as routing arbiter.
