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
    content: "WS-2 — PDR-076 v2 Agent identity tuple + body-file frontmatter. Status: OWNER-VERDICT-RECEIVED 2026-05-24 — SPLIT into PDR-076a (identity tuple) + PDR-076b (body-file frontmatter); Ferny authors both child PDRs via Cycle #6. Cascade §2 body-file-adjacency overlap with §5 cured by partition. Gate 2 unblocked. Closes when: PDR-076a + PDR-076b land via Cycle #6 marshal-cycle."
    status: pending
    depends_on: []
  - id: ws-3-adr-185
    content: "ADR-185 v2 comms-event auto-acceptance metadata. Status: LANDED at 5320d6b0 (orphan-absorption; Ferny adoption). Closes when: comms renderer wires [AUTO-ACCEPT] vs [AUTO-ACCEPT-CLAIMED] discriminator from verified vs advisory metadata — separate executable plan, not blocking this program."
    status: completed
  - id: ws-4-recursion-pattern
    content: "WS-4 — Recursion-of-doctrine-under-team-cadence-speed pattern. Status: LANDED at c097bbb3 (5 same-session worked instances). Promotion to PDR (pdr_kind: pattern) on second cross-session worked instance; currently candidate in pending-graduations."
    status: completed
  - id: ws-5-substrate-pointer-pattern
    content: "WS-5 — substrate-pointer-read-as-current-state pattern. Status: LANDED at 8a99ed35 under Mistbound marshal Cycle #2 (2026-05-23 ~16:11Z). Pattern v2 absorbs 6 worked instances D1–D6 + Wilma SAFE-WITH-CONDITIONS verdict (3 conditions C2/C3/C5 cadence + handoff-boundary substrate-emission). Wilma's 3 unexposed edge cases (cross-channel temporal inversion, partial-state drain window, subagent-chain propagation) tracked as v3 candidates in pending-graduations, not blocking this WS."
    status: completed
  - id: ws-6-marshal-cycle-discipline
    content: "WS-6 — Marshal-as-cycle-discipline. Status: PDR-077 DRAFT + 3 REVIEW ROUNDS COMPLETE — Charcoal Brazing Kiln authored PDR-077 draft in /tmp (2026-05-23 16:14:10Z); 3 review rounds dispatched (R1 sequential docs-adr-expert; R2 3-way parallel assumptions-expert + architecture-expert-wilma + architecture-expert-betty; R3 3-way parallel re-engagements + final docs-adr-expert returning GO on marshal-request with citation-discipline clean). Remaining: absorb 7 R3 SHOULD-ABSORB items in /tmp/charcoal-pdr077-postresume-fanout-synthesis.md + 1 Director-verdict item (reviewer disagreement on claim-state immutability clause); then marshal-request. CAVEAT: review-trail substrate is in /tmp (session-local), not durable substrate — risk of loss across rotation. SECOND worked instance of marshal-as-cycle-discipline in evidence: Mistbound's 4-commit marshal arc (43e09287 / 8a99ed35 / 499d163b / ccc47de2) by git author timestamps 17:03:45→17:17:45 BST = ~14 min (Mistbound's handoff §4 stated 22 min; git evidence shows 14 min — either way 4 cycles in <25 min including husky 90-task gate-chains). First instance: Ashen's 9-cycles-in-45-min. Twilit ST tick #1 named 3 must-cure gaps; R3 fan-out absorbed them. Closes when: PDR-077 lands with role definition, cycle protocol, gate-singleton invariant, throughput observation, standing-duty intersection (feedback_marshal_queues_comms_and_memory_state), PDR-063/PDR-064 cross-references."
    status: pending
    depends_on: []
  - id: ws-7-pr-108-sonar-clearance
    content: "WS-7 — PR #108 SonarCloud + CodeQL quality-gate clearance. Status: PR #108 OPEN/MERGEABLE; CodeQL PASSING; SonarCloud + run-quality-gates FAILING. ACTIVE CLAIMS HELD: Scorched Tempering Kiln author claim 4e6e18b2 (opened 2026-05-23 19:07:14Z; R2 mechanical Sonar cures — S7735 ternary flip + S7763 export-from collapse + S7781x4 replaceAll + S7750 findLast — on 4 files in graph-ingest + sdks); Mistbound Hiding Threshold marshal claim 00375e07 (opened 19:33:07Z). Original pr-108-snagging.plan.md ARCHIVED as complete (gate-1a Round 1 cycles landed) but underlying gates re-redded by subsequent commits. Owner-directed via Seaworthy tick #2 (2026-05-23 19:28:47Z): 'commit hygiene tranche then push' — verdict not yet executed. Awaiting Scorched re-engagement to execute R2 cure under Mistbound marshal authority. Closes when: PR #108 SonarCloud + run-quality-gates flip GREEN and merge becomes possible. SHARED SUBSTRATE — also EEF merge-path unblock."
    status: pending
    depends_on: []
  - id: ws-8-architectural-direction-self-mod-authz
    content: "WS-8 — Architectural-direction ratification on Claude self-modification authorisation cure-shapes. Status: AUTHOR-IN-FLIGHT (Lanternlit, owner-directed 2026-05-24 'Author it now'). Shape verdict received via Seaworthy Director tick #2 (2026-05-23 19:28:47Z): C2-near-term + C5-long-term + C4-fallback with C2-deferred-until-platform-support. AUTHORING NOW: ADR codifying the shape + the C2-platform-deferred trigger ('when Anthropic platform supports binding self-mod authz'). Closes when: ADR drafted + reviewer-converged + marshal-landed."
    status: in_progress
    depends_on: []
  - id: ws-9-twilit-fm2-p2-cure
    content: "WS-9 — Twilit ST FM-2 P2 plan-Wilma verdict + cure landing. Status: LANDED at 43e09287 under Mistbound marshal Cycle #1 (2026-05-23 ~16:02Z) — watcher-staleness consumer + CollaborationAgentId schema dedupe; knip RED→GREEN. FM-2 (session-open environment freshness check) substrate complete. Pre-existing critical-zone fitness advisory exit-1 NOT introduced by this cycle (ADR-176 advisory-vs-gate distinction)."
    status: completed
  - id: ws-10-heartbeat-cron-mechanism
    content: "WS-10 — Heartbeat contract operationalisation (durable mechanism). Status: NOT-M1-GATED, PENDING — interim mechanism is `narrative` comms event with `tags: ['heartbeat']` per ADR-183 tag-namespace substrate (Seaworthy tick #4 direction 2026-05-23 15:58:52Z). Durable mechanism has 3 sub-components: (a) per-identity-tuple `last_heartbeat_at` field on active-claims.json schema; (b) `pnpm agent-tools:heartbeat` CLI wrapper absorbing identity-tuple resolution from PRACTICE_AGENT_SESSION_ID_* + subject template (`Heartbeat: <agent_name> (<prefix>) — <lane>`) + body prefix (`active; <focus>`) + tag wiring (['heartbeat']) + `comms append` plumbing (--now / --created-at / --active / dirs); per-beat --lane + --focus strings MUST come from the agent on each invocation, NOT cached at cron startup (anti-pattern: silent-staleness if hardcoded focus repeats — equivalent failure mode to substrate-pointer-read-as-current-state); (c) lifecycle.event_type='heartbeat' per pending ADR-186. CLI shape contributed by Mistbound session 0e27cc (R1.4 integration). Owner-directed permanent + session-wide rule for all start-right-team sessions. Closes when: durable mechanism shipped (schema field + CLI wrapper + claim auto-rebalance protocol substrate). Interim mechanism is workable; durable substrate work deferred until WS-11 bundle + schema field + CLI ship together."
    status: pending
    depends_on: []
  - id: ws-11-heartbeat-doctrine-bundle
    content: "WS-11 — Heartbeat doctrine bundle (RESTRUCTURED from SKILL-only). Status: BUNDLE SHAPE RATIFIED via 5-reviewer fan-out RE-SHAPE convergence + E4 RESOLVED via PDR/ADR portability distinction (owner R1.5 2026-05-24). Bundle: PDR-078 liveness-heartbeat-contract (portable principle, emit-side + observe-side, ZERO SHAs/UUIDs per PDR portability constraint) + ADR-186 comms-event-heartbeat-lifecycle-substrate (repo phenotype: lifecycle.event_type='heartbeat'; no schema amendment because event_type is open-string; renderer composes [HEARTBEAT] + [LIFECYCLE]; MUST-tolerate-unknown-event-type rule; SHAs and event-UUIDs ALLOWED per ADR repo-bound nature) + thin SKILL pointer (collapse fat §0.5 to PDR-078 reference; preserve §1 Register Presence cron-status field + §Closeout heartbeat-end clause) + reciprocal §Related amendments to PDR-027 + PDR-063 + PDR-064. Working-tree state: SKILL-CANONICAL.md fat §0.5 draft uncommitted (Director-gated per Practice-Core protection); PDR-078 + ADR-186 not yet authored. Cadence: empirical 3-min (Foamy quiet-stream precedent); PDR-064 coordinator-handoff exemption is unbounded per current PDR-064 text (the 30-min number cited in pre-pause SKILL draft was invented, not in PDR-064). Closes when: PDR-078 (SHA-free) + ADR-186 (SHAs OK) + thin SKILL + reciprocal §Related amendments authored + round-2 reviewer convergence + owner ratification + marshal-landed via Mistbound."
    status: in_progress
    depends_on: []
  - id: ws-12-pdr-079-pdr-adr-portability
    content: "WS-12 — PDR-079 PDR-vs-ADR portability distinction (NEW R1.5 2026-05-24, owner-directed). Status: AUTHOR-IN-FLIGHT (Lanternlit). Scope: new PDR codifying the long-standing-vague distinction owner articulated 2026-05-24: PDRs are portable practice doctrine (apply to any repo with multi-agent collaboration; NO SHAs, NO repo-paths, NO branch names); ADRs are repo-specific architectural decisions (repo-bound by definition; SHAs and event-UUIDs welcome). SHA-in-PDR signal: misclassification — the SHA-bearing content belongs in an ADR, not a PDR. Composition with PDR-066 (PDR↔ADR pattern). Plus mechanical co-cure: scope `.agent/rules/no-moving-targets-in-permanent-docs.md` to apply strictly to portable surfaces (PDRs + rules + patterns), NOT to repo-bound ADRs. Closes when: PDR-079 + rule scope-update authored + reviewer-converged + marshal-landed via Mistbound."
    status: in_progress
    depends_on: []
  - id: gate-safe-pause
    content: "M1 — Safe-Pause Milestone. The near-term target. Reached when ALL 5 gates hold: Gate 1 WS-7 GREEN (PR #108 cure lands); Gate 2 WS-2 SPLIT children land (PDR-076a + PDR-076b via Cycle #6, per owner R1.5 verdict 2026-05-24); Gate 3 WS-5 pattern landed (MET 8a99ed35); Gate 4 WS-9 Wilma verdict + cure landed (MET 43e09287); Gate 5 all queued items (WS-11 bundle, PDR-077, Cycle #5, Cycle #6, PR #108 cure, Marshal hygiene cycle, Cycle #7) reach a terminal state (LAND or explicit STAND-DOWN). On Director Safe-Pause Attestation broadcast, team pivots focus to EEF First Feature lane."
    status: pending
    depends_on: [ws-2-pdr-076, ws-5-substrate-pointer-pattern, ws-7-pr-108-sonar-clearance, ws-9-twilit-fm2-p2-cure]
  - id: gate-complete
    content: "M2 — Completion Milestone. The program-archive target. Reached when ALL of: M1 (Safe-Pause) held AND WS-6 marshal-cycle-discipline PDR-077 landed AND WS-8 architectural-direction codified (ADR or explicit-deferral-with-named-trigger) AND WS-11 heartbeat-doctrine bundle landed AND observable next-window evidence (next team session runs without producing new substrate-stale-pointer instances OR produces a new cure-shape the substrate absorbs). M2-pursuit work is deferred until M1 reached unless owner directs otherwise."
    status: pending
    depends_on: [gate-safe-pause, ws-6-marshal-cycle-discipline, ws-8-architectural-direction-self-mod-authz, ws-11-heartbeat-doctrine-bundle, ws-12-pdr-079-pdr-adr-portability]
isProject: true
---

# Practice Infrastructure Hardening Program 2026-05-23

**Last Updated**: 2026-05-24 (refinement R2 — M1 attestation + post-M1 re-shape; PR #108 merged; companion executable plan landed)
**Status**: **M1 ACHIEVED 2026-05-24T20:09:10Z** (attestation broadcast
`2849b623-5026-4e9d-9938-7ebaffb727fd`; PR #108 merged at
2026-05-24T20:06:12Z via merge commit
`2462952a957c69d4c614ddb95eb880c105839c1e`). Team pivots to EEF First
Feature delivery per P3.E1 (team currently paused; pivot fires on
owner unpause). Carry-forward executable plan landed at
[`post-m1-attestation-tidy-up.plan.md`](post-m1-attestation-tidy-up.plan.md)
covering all post-M1 tidy-up items (PDR-076 SPLIT, PDR-077, WS-11
bundle, comms-watch redesign, test-debt + Sonar residue). M2
(Completion) carries forward: Criterion 1 MET; Criteria 2/3/4 named
in companion plan; Criterion 5 (next-window evidence) BLOCKED ON NEXT
SESSION.
**Plan held under claim**: `8374e240-0faa-4011-a9fd-a5789cc006a9`
(Lanternlit Listening Dusk / claude / claude-opus-4-7 / `78683a`).
Future agents observing drift between this plan and live state should
read the plan, then verify against live substrate, then file a new
§Plan Refinement Log entry rather than opening a parallel claim.
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
**Refinement-prompting owner direction**: 2026-05-24 ~00:00Z (post-credit
reset) — "please deeply update the plan so that it reflects the current
state of the repo accurately… we need to know exactly where we are, where
we are going, and the precise path between the two… this is the
foundation that all next steps are built on".

## Plan Refinement Log

Plans drift the moment they land. This section records refinement passes
so future agents reading the plan can see what changed and why without
having to reconstruct from commit history. Each entry is dated and
identifies the agent + the evidence ground for the changes.

### R1 — 2026-05-24 — Lanternlit Listening Dusk — current-state refresh post-compaction

**Why**: Owner-directed deep refresh after a ~3-hour team-activity window
plus a compaction pause shifted substrate state in multiple workstreams.
Plan as-authored at 2026-05-23 16:00Z no longer reflects current
landings, owner-verdict surface, or the EEF-lane state.

**Evidence ground** (6-subagent fan-out + Mistbound's compaction-handoff
record at `.agent/state/collaboration/handoffs/marshal-role-handoff-2026-05-23-mistbound-compaction.md`):

- All 8 claimed landing SHAs verified present on
  `feat/mcp-graph-support-foundation` (HEAD `5fedf9a4`).
- Mistbound's 4-cycle marshal arc (`43e09287` → `8a99ed35` →
  `499d163b` → `ccc47de2`) landed 16:02–16:18Z, covering WS-5
  drafting-to-landing and WS-9 cure landing.
- Owner verdicts surfaced via Seaworthy Director tick #2 at 19:28:47Z
  on three prior owner-pending decisions (Q1 R1 push timing, Q2 WS-8
  C2 framing, Q3 ADR-186 hook-blocker citation cure).
- EEF lane advanced substantially: WS4.1 graph-corpus-sdk landed at
  `3241893d` 2026-05-23 07:47Z under Stormbound (Lunar's 14-file scaffold
  committed after credit-pause); Round 1+2 substrate floor effectively
  complete; original `pr-108-snagging.plan.md` archived.
- PDR-077 (Charcoal's WS-6 doctrine home) authored as draft in `/tmp`
  at 16:14:10Z; docs-adr-expert reviewer dispatched; awaiting
  Charcoal re-engagement.
- Ferny's WS-2 partition prestage at
  `/tmp/ferny-ws2-partition-prestage-synthesis.md`: 3-way fan-out
  complete; critical Cascade §2 body-file-adjacency overlap with §5
  caught; partition-cure shape needs owner sight before authoring.
- Architecture-expert-fred verdict on the Q3 ADR-186 citation cure path
  (received 2026-05-24 post-compaction) contradicts the owner verdict
  surfaced via Seaworthy tick #2: Fred says descriptive-only,
  owner-via-Seaworthy says "revise citation style to use event-ids".
  Tension SURFACED, NOT YET RESOLVED.

**What changed in this refinement**:

- Frontmatter `todos:` YAML statuses refreshed (WS-5 → completed,
  WS-9 → completed, WS-7/WS-8 content refined, WS-6 content refined,
  WS-11 content refined).
- Workstream Roll-up table refreshed with current SHAs + status text.
- Safe-Pause Criteria gained per-gate MET / PENDING markers with
  evidence pointers.
- Completion Criteria gained current-status markers.
- New section: **Path Forward** (between Completion Criteria and
  Relationship to EEF) — explicit ordering of next moves with
  dependency chain visible.
- New section: **Emergent Observations** (after Non-Goals) — substrate
  candidates surfaced since pre-pause that have NOT been lifted to
  workstream status; trigger conditions for promotion named.
- Relationship to EEF section: major refresh — WS4.1 landed,
  `pr-108-snagging.plan.md` archived, Round 1+2 substrate floor
  complete, outstanding EEF work re-sequenced.
- Risks section: refreshed with current-cycle risks.

**What was deliberately NOT changed**:

- End Goal, Mechanism, Non-Goals, Foundation Alignment, Plan-Body
  First-Principles Check — these remain accurate after R0.
- The WS-1 to WS-11 decomposition itself — new substrate candidates
  surfaced in this session are tracked in pending-graduations or in
  the new Emergent Observations section, not promoted to WS rows
  (per Non-Goals: doctrine inflation guard).
- Authoring agent + R0 history — preserved as audit trail.

### R2.1 — 2026-05-24 — Seaworthy Navigating Beacon — Lanternlit lane absorption (owner-directed)

**Why**: Owner direction this turn: *"Lanternlit has been gone for a
long time, whatever needs doing, integrate it into the plan as a
step"*. Lanternlit's two AUTHOR-IN-FLIGHT lanes (WS-8 self-mod authz
ADR; WS-12 PDR-079 + rule scope-update) had no in-flight author and
WS-12 was a BLOCKING prerequisite for companion plan cycles 6 + 7.
R2.1 relocates both to the companion plan as new cycles 5a + 8a.

**Changes**:

- WS-8 row: AUTHOR-IN-FLIGHT (Lanternlit) → CARRY FORWARD to companion
  plan cycle 8a. ADR-187 lands there.
- WS-12 row: AUTHOR-IN-FLIGHT (Lanternlit) → CARRY FORWARD to companion
  plan cycle 5a. PDR-079 + rule scope-update land there.
- §M2 Criterion 3: CARRY FORWARD pointer updated to companion plan
  cycle 8a.
- Companion plan refinement R2 (in
  `post-m1-attestation-tidy-up.plan.md` §Plan Refinement Log) carries
  the substantive insertion (cycle 5a + cycle 8a bodies, dependency
  re-wiring, prerequisite-classification update).
- Cycle count in companion plan: 14 → 16 (cycles 5a + 8a inserted;
  existing cycle numbers preserved via letter-suffix to avoid
  cascading rewrites of primary plan cycle-number references).

**M1 impact**: none.

### R2 — 2026-05-24 — Seaworthy Navigating Beacon — M1 attestation + post-M1 re-shape (owner-directed deep update)

**Why**: PR #108 merged at `2026-05-24T20:06:12Z` via merge commit
`2462952a957c69d4c614ddb95eb880c105839c1e`; M1 Safe Pause Attestation
broadcast emitted by Director Seaworthy at comms event
`2849b623-5026-4e9d-9938-7ebaffb727fd` (`2026-05-24T20:09:10Z`). Owner
direction this turn: *"we have completed M1, I think you have
identified a handfull of tidy up follow ons?"* followed by *"do a
deep update of the primary plan, and then write a separate, highly
focussed, highly linear, utterly defined plan for items 1-6"*.
R2 records the M1 attestation in the plan body, reshapes WS / gate /
phase status against attestation evidence, folds the R1.7
verification-primitive cure (formerly carry-forward item 6) into
§Roles + triggers M1 Gate Monitor, and lands a §Post-M1 Cleanups
pointer to the new executable plan covering carry-forward items 1–5.

**Owner-authority override of plan-coordination model**: Same
justification as R1.6 — owner-direct direction; the recorded
substrate is M1 attestation evidence (Director Seaworthy duty
discharge) not Lanternlit's plan body design; sidebar would strand the
M1-attestation-recording substrate. Lanternlit (when re-engaged) may
reshape sections at next plan stewardship pass; the sidebar convention
remains the architecturally-correct shape for future
non-owner-directed contributions.

**Companion plan landing** (this refinement's pair-commit):
[`post-m1-attestation-tidy-up.plan.md`](post-m1-attestation-tidy-up.plan.md)
— executable linear cycle sequence covering all post-M1-attestation
carry-forward items: PDR-076 SPLIT (PDR-076a + PDR-076b), PDR-077
R3-absorption, WS-11 bundle (PDR-078 + ADR-186 + thin SKILL +
reciprocal amendments), §P5.W1 comms-watch seen-state redesign
(promoted from `future/`-shape inside this plan to executable cycles),
and test-debt + Sonar residue (Twilit Cycle 3 + Charcoal Beta
substance + Charcoal Gamma substance). The companion plan is the
canonical executable surface for the carry-forwards; this primary
plan's §Post-M1 Cleanups + §Path Forward Phase 4 reference it as the
actionable substrate.

**Changes** (section-by-section):

1. Header `**Status**:` flipped from *"SEQUENCE-LIVE — racing toward
   M1"* to *"M1 ACHIEVED 2026-05-24T20:09:10Z"* with attestation event
   ID + merge SHA + companion plan link.
2. §Workstream Roll-up table: WS-7 → LANDED + MERGED (PR #108 via
   merge `2462952a`; bundle `340752bb` + hygiene tail `efe13aae` /
   `9e8079c8` / `58feff48`). WS-2 → LANDED v2 foundation + SPLIT
   children carry-forward to companion plan. WS-6 → STOOD DOWN to
   companion plan (draft + R3 synthesis in `/tmp` pending capture).
   WS-11 → STOOD DOWN to companion plan (bundle shape ratified). WS-8
   - WS-12 carry-forward AUTHOR-IN-FLIGHT (unaffected).
3. §M1 — Safe-Pause Milestone Criteria: All 5 gates flipped to MET
   with terminal-state evidence (per attestation broadcast). Per-gate
   sections updated with stand-down dispositions for un-landed items.
   M1 Roll-up table refreshed.
4. §M2 — Completion Milestone Criteria → Criterion 1 (M1 held)
   flipped MET. Criteria 2/3/4 carry forward via companion plan.
   Criterion 5 (next-window evidence) → BLOCKED ON NEXT SESSION
   (untestable until next team window opens post-pause).
5. §Path Forward Phase 1/2/3 closure markers added; P3.E1 marked
   EXECUTED; Phase 4 (M2-PURSUIT) carries forward with sub-section
   "P4-via-companion-plan" pointing at the new executable surface.
6. §Roles + triggers / M1 Gate Monitor: new "**Verification primitive
   (R1.7 fold)**" paragraph codifies that the M1 Gate Monitor MUST
   verify gate state against actual artefacts (`gh pr checks`, commit
   log, file presence, comms-events), NEVER against the plan body's
   own enumeration. Worked-instance evidence captured in §Emergent
   Observations E7.
7. §Post-M1 Cleanups → P5.W1 marked **PROMOTION-ELIGIBLE 2026-05-24
   (M1 attestation fired)**; pointer to companion plan cycles 8–10.
8. New §Emergent Observation E7 — substrate-pointer-read on plan's
   own gate enumeration (Director Seaworthy worked instance,
   2026-05-24 ~16:30Z; cured by R1.7 verification-primitive landing
   in §Roles + triggers).
9. §Risks: #3 (M1 attestation flake) → MITIGATED via R1.7
   verification-primitive landing; #4 (E4 blocking WS-11) → RESOLVED
   via R1.5 PDR/ADR portability distinction; #5 (PR #108 cure-claim
   execution stall) → RESOLVED via PR merge.
10. §Owner Ratification Status → R2 entry added (owner direction
    *"we have completed M1"* is direct ratification of the M1
    attestation).

**M1 impact**: confirms and records the attestation in the canonical
plan body. Does not change the M1 outcome itself; the attestation
broadcast `2849b623` is the source-of-truth event, this plan is the
authoritative reference. Next-window readers reading this plan have
authoritative M1-attestation evidence with broadcast event ID + merge
commit SHA + Director identity tuple.

**Carry-forward to next session (canonical post-R2 list)**: 5 items
absorbed into companion plan as 13 linear cycles. See
[`post-m1-attestation-tidy-up.plan.md`](post-m1-attestation-tidy-up.plan.md)
§Atomic Cycles for executable substrate.

### R1.6 — 2026-05-24 — Seaworthy Navigating Beacon — Post-M1 Cleanups section integration (owner-directed correction)

**Why**: Owner-directed structural correction. Prior Seaworthy session
window (pre-compaction-4) created a standalone collection at
`.agent/plans/post-m1-cleanups/` for post-M1 friction-cure briefs.
Owner direction this session (post-compaction-4 resume):

> "your last session put the post M1 work in a new directory, instead
> of integrating it into the existing plan in a post M1 section"

The correction integrates the substance into this plan's body and
removes the standalone collection.

**Owner-authority override of plan-coordination model**: This
refinement is a direct-edit by an agent (Seaworthy `6966d4`) that does
not hold the primary-author claim (`8374e240`, Lanternlit). The
override is justified by (a) owner-direct direction; (b) the corrected
substrate is Seaworthy's prior-window output, not Lanternlit's plan
body design; (c) the sidebar shape would strand the substance until
Lanternlit re-engages, which is not certain. Lanternlit (when
re-engaged) may reshape the §Post-M1 Cleanups section as part of plan
stewardship; the sidebar convention remains the architecturally-
correct shape for future non-owner-directed contributions.

**Changes**:

- New top-level section §Post-M1 Cleanups — Friction-Cures Deferred
  Until M1 Attestation inserted between §Path Forward and
  §Relationship to EEF First Feature Delivery.
- First entry P5.W1: comms-watch seen-state redesign — substance
  folded from the standalone strategic brief (four problem dimensions,
  three-workstream cure decomposition, scope + non-goals, acceptance
  signals, promotion trigger, capture pointer).
- Meta-pattern named (make-doc-generated-by-impl) + entry criteria
  - distinction from §Emergent Observations (code vs doctrine cures).
- Standalone collection at `.agent/plans/post-m1-cleanups/` removed
  (README.md + future/comms-watch-seen-state-redesign.plan.md
  deleted).

**M1 impact**: none. This is plan-shape correction work; M1 critical
path unchanged. The team's marshal-seat resume (Mistbound
post-compaction-4 at 14:46:53Z) and queued Twilit + Charcoal cycles
proceed on the M1 critical path independently.

### R1.5 — 2026-05-24 — Lanternlit Listening Dusk — all owner decisions resolved

**Why**: Owner-directed resolution of all outstanding owner-decision
items in one session. AskUserQuestion call surfaced 4 decisions; owner
answered 5 (one of the answers — the citation policy — triggered a
deeper architectural distinction that became a 5th decision).

**Owner verdicts captured**:

1. **WS-2 partition-cure**: **SPLIT** confirmed. Ferny authors
   PDR-076a (identity tuple) + PDR-076b (body-file frontmatter) via
   Cycle #6. Cascade §2 + §5 body-file-adjacency overlap cured by
   partition. Gate 2 unblocked; awaiting Ferny re-engagement.
2. **E4 citation policy → PDR/ADR portability distinction**: owner
   reframed the question. The recurring vagueness was not "which
   citation style?" but "what are PDRs and ADRs fundamentally?"
   Verdict: PDRs are portable practice doctrine (NO SHAs / repo paths
   / branch names); ADRs are repo-specific architectural decisions
   (SHAs / event-UUIDs welcome). SHA-in-PDR = misclassification
   signal: move the SHA-bearing substance to an ADR. Binding cure for
   the WS-11 bundle: PDR-078 SHA-free, ADR-186 SHAs allowed. Replaces
   R1's hybrid framing entirely.
3. **WS-8 codification author**: **Author it NOW** (Lanternlit). ADR
   codifying C2+C5+C4 shape + C2-platform-deferred trigger is
   AUTHOR-IN-FLIGHT.
4. **R1.4 deployment broadcast**: **Emit bundled with owner verdicts**
   — single comprehensive broadcast covering R1.4 + R1.5 changes.
   Emitted at end of R1.5 plan refresh.
5. **PDR/ADR distinction capture**: **Author new PDR (PDR-079)** —
   heavier option chosen. WS-12 added.

**Changes**:

- Frontmatter `todos:` YAML:
  - WS-2 content updated to reflect SPLIT verdict + Ferny Cycle #6.
  - WS-8 content updated to AUTHOR-IN-FLIGHT (Lanternlit, NOW); status
    flipped from `pending` to `in_progress`.
  - WS-11 content updated to reflect E4 RESOLVED (PDR-078 SHA-free /
    ADR-186 SHAs allowed); Fred-vs-owner tension removed.
  - WS-12 NEW entry added: PDR-079 PDR-vs-ADR portability distinction
    (Lanternlit, AUTHOR-IN-FLIGHT). Status `in_progress`.
  - gate-safe-pause content refreshed to name SPLIT verdict + the 7
    Gate 5 queue entries.
  - gate-complete `depends_on` extended to include `ws-12-pdr-079-pdr-adr-portability`.
- §Workstream Roll-up table: WS-2 / WS-8 / WS-11 rows refreshed; new
  WS-12 row added.
- §M1 — Safe-Pause Milestone Criteria → Gate 2: status flipped from
  BLOCKED-ON-OWNER-VERDICT to "PENDING (OWNER-VERDICT RECEIVED,
  AWAITING FERNY EXECUTION)".
- §M2 — Completion Milestone Criteria → Criterion 3: flipped from
  CODIFICATION-PENDING to AUTHOR-IN-FLIGHT.
- §Emergent Observations → E4: marked **RESOLVED 2026-05-24 (R1.5)**
  with full reframing per PDR/ADR portability distinction.
- §Path Forward → P1.C1: rewritten as "Ferny resumes Cycle #6" (was
  "owner reads Ferny prestage").
- §Path Forward → P2.A1: rewritten — E4 prerequisite cleared, LAND
  path now recommended.
- §Path Forward → Phase 4 (M2-PURSUIT): P4.C2 (WS-8) flipped to
  AUTHOR-IN-FLIGHT; new P4.C3 (WS-12) added.

**M1 status after R1.5**:

- Gate 1 (WS-7 cure): CLAIMED, awaiting Scorched execution
- Gate 2 (WS-2 SPLIT): CLAIMED conceptually (Ferny named author),
  awaiting re-engagement
- Gate 3 (WS-5 pattern): MET ✅ `8a99ed35`
- Gate 4 (WS-9 cure): MET ✅ `43e09287`
- Gate 5 (queue closure): 7 entries; Marshal hygiene cycle pending
  next tree-green window; WS-11 bundle now LAND-recommended;
  PDR-077 awaiting Charcoal re-engagement

**No owner decisions remain outstanding for M1**. All M1-critical
items now have named actors and triggers. Director Seaworthy operates
M1 Gate Monitor duty.

**Bundled broadcast emitted at end of R1.5** (covers R1.4 + R1.5
substance for team).

**Authoring queue (in-flight, parallel to M1 monitoring)**:

- Lanternlit: PDR-078 + ADR-186 + thin SKILL + reciprocal amendments
  (WS-11 bundle); ADR for WS-8; PDR-079 + rule scope-update (WS-12)
- Ferny: PDR-076a + PDR-076b (Cycle #6, WS-2)
- Charcoal: PDR-077 R3-absorption (WS-6)
- Scorched: PR #108 R2 cure (WS-7)
- Mistbound: marshal-cycle for all of the above + Marshal hygiene cycle

### R1.4 — 2026-05-24 — Lanternlit Listening Dusk — sidebar co-authoring model + heartbeat CLI integration

**Why**: Owner-directed integration response to R1.3's Gap 5
surfacing. Owner verdict: **sidebar is the right model**. Owner
also directed: integrate the Mistbound "Ideas to be integrated"
section into the plan proper, with the first question being whether
it is part of M1 or not.

**M1-or-not verdict on heartbeat CLI**: **NOT part of M1.** The
heartbeat CLI is scope detail for WS-10, which is explicitly
not-M1-gated. WS-10's closure condition is "schema field + CLI
wrapper + claim auto-rebalance protocol shipped" — Mistbound's CLI
shape is the specification of the *CLI wrapper sub-component*.
Interim heartbeat mechanism (narrative+tags per ADR-183) is workable
per the plan, so M1 (EEF pivot-ready) does not depend on this work
landing. The CLI is quality-of-life infrastructure that reduces
M1-execution-risk indirectly (preventing the hand-rolled-heartbeat-
loop failure mode Mistbound flagged) but is not M1-pivot-blocking.

**Changes**:

- WS-10 frontmatter content rewritten to embed the CLI specification
  Mistbound contributed: identity-tuple resolution, subject template,
  body prefix, tag wiring, comms-append plumbing, AND the load-bearing
  constraint that per-beat `--lane` + `--focus` MUST come from the
  agent each invocation (silent-staleness anti-pattern named as
  equivalent failure mode to substrate-pointer-read).
- WS-10 row in §Workstream Roll-up table updated similarly, with
  pointer to frontmatter for full CLI shape.
- §Ideas to be integrated into the plan section REMOVED — its
  substance is now integrated into WS-10; the section header was
  itself a violation of the sidebar model (multi-writer direct edit).
- New §Plan Coordination — co-authoring model section ADOPTED:
  sidebar model formalised. Location convention
  (`sidebars/<contributor-prefix>-<topic-slug>.md`), append-only
  contributor conventions, plan-holder integration cadence (at
  Refinement Log boundaries), retroactive note on Mistbound's R1.2
  contribution.
- Gap 5 in R1.3 marked RESOLVED with sidebar adoption.

**Deferred (out of R1.4 scope)**:

- Creating actual sidebar files for current/future contributors.
  Convention is documented; first contributor under the new model
  creates the directory when they need it. Premature directory
  creation is unjustified.
- Migrating Mistbound's "Ideas to be integrated" section to a
  retroactive sidebar file. The substance is integrated; recreating
  history-via-sidebar is unnecessary ceremony.
- Migrating WS-10 to a different status (e.g., "ACCEPTED-DEFERRED"
  vs current "NOT-M1-GATED, PENDING"). The current vocabulary serves;
  WS-10 was not changed in scope, only specified in detail.

**Steady-state assessment**: R1.4 is a targeted integration pass on
owner-directed scope (Mistbound substance + sidebar model). Not a
full review-and-absorption pass. No new gaps surfaced; the M1-path
specification from R1.3 remains the foundation. Next refinement
boundary will be Charcoal's PDR-077 absorption or owner direction.

### R1.3 — 2026-05-24 — Lanternlit Listening Dusk — path-trigger completeness

**Why**: Owner-directed metacognitive critique on R1.2 exposed that
the path to M1 was substantially clearer but not fully specified.
R1.2 corrected accuracy and state; it did not close the *trigger
ambiguity*: actions named the actor and the action but not what
triggers the actor to act.

**5 gaps found on honest self-critique** (the questions: is the path
absolutely clear, decision complete, fully specified?):

1. **Trigger ambiguity** — Scorched re-engagement, owner attention
   to Ferny's prestage, Safe-Pause detection — actors named, triggers
   unnamed.
2. **Decision-owner ambiguity for stand-down** — Gate 5 queue entries
   say "responsible agent" without naming the agent per entry.
3. **Monitoring duty** — no explicit "M1 Gate Monitor" responsibility;
   detection of "all 5 gates MET" was implicit Director.
4. **Substrate-in-/tmp durability** — PDR-077 + R3 synthesis at
   session-loss risk; cure named, ownership and timing unspecified.
5. **Parallel-writer coordination** — Mistbound's R1.2 contribution
   exposed multi-writer pattern; coordination model undefined.

**Cures applied (4 of 5; architecturally forced)**:

- New §Path Forward subsection "**Roles + triggers**" naming:
  - **M1 Gate Monitor** = Director Seaworthy (continuous duty;
    transfers on rotation per PDR-064).
  - **Surfacing-to-owner duty** = Director Seaworthy (with explicit
    escalation framing if no response within 1 active team session).
  - **Stand-down authority per Gate 5 queue entry** = table mapping
    each queue entry to its stand-down authoriser (author / Director /
    owner / Mistbound per entry).
  - **Re-engagement triggers per silent-actor item** = table mapping
    each silent-actor risk (Scorched, Charcoal, owner-on-WS-2, etc.)
    to its named trigger and default-action-if-no-response, grounded
    on the PDR-076 retirement threshold (10 min).
- §P1.Gate5 amended with explicit reference to stand-down authoriser
  table + **capture-to-durable substrate rule** for `/tmp` content.
- §P3.E1 amended to name the Director M1 Gate Monitor duty as the
  detection mechanism for "all 5 gates MET".

**Cure surfaced for owner (1 of 5)**:

- **Parallel-writer coordination (Gap 5)**: the plan body is co-
  authored. Lanternlit (claim `8374e240`) authored R0+R1+R1.1+R1.2+R1.3;
  Mistbound authored the "Ideas to be integrated" section in parallel.
  No coordination decision yet. **Surfacing to owner**: should plan
  body be (a) single-author with marshal-mediated merges, (b) sidebar-
  shaped collaborative authoring, or (c) current free-for-all
  (acceptable if all writers acknowledge each other's contributions)?
  R1.3 default if no owner response within 1 active team session:
  continue with (c) and capture Gap 5 as a deferred-cure pending
  future worked-instance evidence.

**Post-cure verdict (the question that prompted R1.3)**:

| Criterion | Before R1.3 | After R1.3 |
|-----------|--------------|-------------|
| Absolutely clear | NO (gaps 1, 2, 3) | YES for path-trigger; Gap 5 explicitly surfaced for owner |
| Decision complete | NO (gaps 1, 4, 5) | YES for all M1-critical decisions; Gap 5 surfaced |
| Fully specified | NO (actor named, trigger absent) | YES for all M1-critical items; Gap 5 specified as open-decision-with-default-action |

**Steady-state assessment after R1.3**: the path is now fully
specified except for Gap 5 (parallel-writer coordination), which is
explicitly an owner-decision with default-action recorded. A 3rd
reviewer-pass iteration would catch NIT-level inconsistencies at
diminishing return. Declared steady-state on M1-critical specification.

### R1.2 — 2026-05-24 — Lanternlit Listening Dusk — reviewer absorption pass

**Why**: Owner-directed reviewer-pass + critical-analysis loop with
docs-adr-expert + code-expert. Both reviewers returned
GO-WITH-CONDITIONS. 21 findings tabulated across CRITICAL (2),
IMPORTANT (8), NIT (5), and surprise-by-absence (3) categories.

**Evidence ground** (parallel reviewer dispatch + verification):

- docs-adr-expert dispatched on plan + Mistbound handoff +
  pending-graduations. Returned GO-WITH-CONDITIONS with 15 findings.
- code-expert dispatched on plan + SHA/state spot-checks via git +
  gh + active-claims jq. Returned GO-WITH-CONDITIONS with 6 findings.
- 3 highest-stakes findings independently re-verified by me before
  absorption: (a) Scorched `4e6e18b2` + Mistbound `00375e07` claims
  ACTIVE via jq on active-claims.json; (b) Mistbound 4-cycle arc git
  author timestamps 17:03:45 BST → 17:17:45 BST = ~14 min (not 22 min
  as inherited from upstream handoff); (c) `/tmp/charcoal-pdr077-postresume-fanout-synthesis.md`
  exists (6.8KB) — confirms 3-round review state for PDR-077.

**Metacognitive observation**: the dominant failure mode in my R1
authoring was *trust-without-reverification* — I trusted Mistbound's
handoff numbers, subagent C's earlier snapshot, and my own
cross-references without checking internal consistency. This is the
substrate-pointer-read-as-current-state failure mode (named in WS-5)
firing on my own authoring of the plan that names the failure mode.
The reviewer-pass + critical-analysis loop is the cure-shape working
as intended.

**CRITICAL absorptions**:

- **WS-7 active-claim state corrected** (docs F1). R1 said "no active
  cure-claim retained" based on subagent C's earlier snapshot which
  checked claim ID `7f24a994` (Mistbound's handoff-cited claim). The
  current active claims are Scorched `4e6e18b2` (R2 author) + Mistbound
  `00375e07` (marshal), both opened post-handoff. Updated: frontmatter
  WS-7 content; Workstream Roll-up WS-7 row; M1 Gate 1 section;
  Path Forward P1.B1 ("Scorched executes" not "fresh claim needed");
  Safe-Pause Criteria roll-up table; Risk #5 (execution stall, not
  claim void); Gate 5 queue entry.
- **WS-10 ADR-186 contradiction resolved** (docs F2 / code F1, convergent).
  R1 said "INTERIM live (lifecycle-event-shape per ADR-186 landing)" in
  the Roll-up table; ADR-186 does not exist. Interim is actually
  narrative+tags['heartbeat'] per ADR-183. Updated: Workstream Roll-up
  WS-10 row; M2 Criterion 4 body text.

**IMPORTANT absorptions**:

- **22-min arithmetic discrepancy** (docs F3, F15). Mistbound's
  compaction handoff §4 said "22 min including husky (~5.5 min/cycle)".
  Git author timestamps show 14 min (~3.5 min/cycle). The thesis still
  holds — 4 cycles in <25 min is the substantive claim. Updated:
  Empirical Thesis Under Test; frontmatter WS-6; both note the
  discrepancy honestly.
- **Section-reference drift after R1.1 renames** (docs F4). "Sections
  that follow" pointer box used pre-R1.1 names. Updated to M1/M2-prefixed.
- **Duplicate paragraph in Readiness Reviewers** (docs F5). Editing
  residue from R1 → R1.1. Replaced second paragraph with R1.2-specific
  reviewer-pass record.
- **§Mechanism collision with "mechanism" word in §Empirical Thesis**
  (docs F6/F7). Renamed §Mechanism to §Substrate-Cure Loop; reworded
  §Empirical Thesis opening line to avoid the word "mechanism".
- **LANDED vocabulary masking doctrine status** (docs F8). Refined
  status vocabulary definition to clarify: file-LANDED ≠ doctrine-
  ratified. PDR Status:Candidate/Proposed/Adopted/Cured is independent
  of file-landing.
- **Lifecycle Triggers owner-decision list incomplete** (docs F9).
  Added E3 verification-discipline-correction owner-direction
  graduation path. Moved Safe-Pause Attestation to Director-decision
  bucket (not owner-decision). Removed WS-7 implementer assignment
  (moot now that claim is held). Added WS-7 execution-monitoring as
  Director-decision touch point.
- **E5 graduation-target misclassification** (docs F10). Corrected
  "currently rule-shape" to "currently memory-feedback-shape" —
  `feedback_gatekeeper_specialisation` is a memory feedback entry,
  not a rule file.
- **WS-6 review state understated** (code F2). R1 said "docs-adr-expert
  reviewer dispatched"; actual state is 3 review rounds complete with
  final docs-adr-expert GO. Updated: frontmatter WS-6; Workstream
  Roll-up WS-6 row; M2 Criterion 2; Path Forward P2.A2 (with /tmp-
  substrate-risk caveat); Gate 5 queue.
- **t12 SHA wrong** (code F3). R1 said "rolled into `3241893d` umbrella";
  actual landing is `0b7289e9` (2026-05-22 16:51 BST). Updated EEF
  lane state table.
- **Gate 5 queue missing Marshal hygiene cycle** (code F4). Mistbound
  handoff §8 listed 6 items; R1 enumerated 5. Added 6th entry
  ("Marshal hygiene cycle") + Gate 5 queue count updated from 5 to 7
  (with Queue-Cycle #7 also added).

**Surprise-by-absence absorptions** (per docs-adr-expert "what I did
not find" section):

- **R1.2 explicit ratification status entry**: this Refinement Log
  entry itself serves; plus a note in §Readiness Reviewers naming the
  reviewer pass.
- **Plan's own claim_id pointer**: added to header
  (`8374e240` Lanternlit). Future agents observing drift now know who
  to direct refinement-coordination to rather than opening parallel
  claims.
- **Plan-archive-lifetime declaration**: clarified in Lifecycle
  Triggers Archive touch point (R1.2 amendment below).

**NIT absorptions**:

- "Cycle #N" terminology overload disambiguated as "Mistbound Cycle #N"
  (commits) vs "Queue-Cycle #N" (pending items) throughout (docs F11).
- "Safe-Pause GO" mis-attributed as owner-decision; corrected to
  Director-decision (docs F13).
- Risk #6 future-tense reference to "R2" reworded to discipline-shape
  reference (docs F14).
- Post-WS commit list labelled as newest-first ordering (code F5).

**Deferred (out of R1.2 scope)**:

- SHA citation density (docs F12) — would require descriptive prefixes
  on many citations; cosmetic; future hygiene pass.
- WS-11 ADR-183-amendment vs ADR-186-standalone framing ambiguity
  (code F6) — already resolved in the chosen bundle shape; no action.

**Parallel multi-writer observation (caught during R1.2 self-check)**:

A new section "§Ideas to be integrated into the plan" appeared between
§Emergent Observations and §Owner Ratification Status during my R1.2
editing window. The content is attributed to Mistbound session
`0e27cc` and describes a `pnpm agent-tools:heartbeat` convenience CLI
candidate. The section is well-formed and substantively accurate — it
is NOT part of R1.2; it is a separate, parallel-authored contribution
from Mistbound's session while I was running R1.2 absorption.

Meta-observation: this is the second instance this session of parallel-
agent activity I was not initially tracking — first the Scorched +
Mistbound active claims on PR #108, now Mistbound writing to the plan
body in parallel. The plan claims to be held under `8374e240`
(Lanternlit) but in practice other agents are also writing it. The
coordination model is partially fictional. This is itself a worked
instance of the substrate-pointer-read failure mode firing on the
plan's own claim-state declaration. Captured here for future
refinement consideration; not absorbed in R1.2 because the right cure
is a coordination decision (multi-author allowed? marshal-mediated?
sidebar-shaped?) not a doctrine edit.

**Steady-state assessment**: after R1.2 absorption, the most
consequential reviewer findings are absorbed. A 2nd reviewer pass on
R1.2 would primarily catch (a) any contradictions introduced by R1.2's
edits, (b) NIT-level findings of diminishing return. Decision: declare
steady state at R1.2 unless owner directs another iteration.

### R1.1 — 2026-05-24 — Lanternlit Listening Dusk — M1/M2 milestone framing

**Why**: Owner-directed metacognitive critique exposed 4 gaps in R1:
(1) End Goal section conflated end-state with empirical thesis;
(2) end goals were structurally separate from first-safe-stopping
milestone but conceptually blurred — both framed as "criteria"
without priority asymmetry;
(3) the first-safe-stopping point was never named as a milestone
(only as "Safe-Pause Criteria");
(4) Path Forward was not focused on reaching that milestone — it
treated M1-blocking work and M2-pursuit work with equal prominence.

**What changed in this sub-refinement**:

- §End Goal split into three named subsections: End Goal (future-state
  capability), Intended Impact (named impact on EEF + broader work +
  doctrine debt), Empirical Thesis Under Test (the mechanism, framed
  as falsifiable claim — not the End Goal itself).
- New §End Goal vs Milestones section names two explicit milestones:
  **M1 — Safe-Pause Milestone** (near-term target; pivot-ready, no
  stranded work) and **M2 — Completion Milestone** (open-ended; full
  program end-state). Priority asymmetry made explicit:
  M1 first, M2 deferred.
- §Safe-Pause Criteria renamed to §M1 — Safe-Pause Milestone Criteria.
  §Completion Criteria renamed to §M2 — Completion Milestone Criteria.
- §Path Forward restructured around 4 phases: Phase 1 M1-CRITICAL
  (must close to reach M1); Phase 2 M1-INCIDENTAL (land-or-stand-down
  branching for queue entries); Phase 3 M1 attestation + EEF pivot;
  Phase 4 M2-PURSUIT (DEFERRED until post-M1).
- YAML frontmatter gates renamed semantically:
  `gate-safe-pause` content text reframed as M1 description;
  `gate-complete` content text reframed as M2 description.
  IDs preserved for machine-readable stability.
- Header Status line refreshed to lead with "racing toward M1".

**What was deliberately NOT changed in R1.1**:

- WS-1 through WS-11 decomposition (R1's catalogue stays).
- Per-WS state markers (R1's status text stays).
- The 5+5 gate enumeration (gates themselves unchanged; only renamed
  - reframed).
- Path Forward action substance (the actions stay; only the priority
  ordering and tagging change).

## End Goal

The future state this program produces: **a multi-agent collaboration
substrate in which each team session can move EEF and other product
feature lanes forward at high throughput without the substrate itself
producing recovery-window tax in the next session.** The substrate
ships as durable artefacts (PDRs, ADRs, patterns, rules) that the
next session inherits automatically rather than reconstructing from
comms substrate.

Concretely, the substrate is "done" when:

- Marshal-as-cycle-discipline has a durable doctrine home (PDR-077 or
  equivalent), so the throughput observed under Ashen and Mistbound
  marshal regimes survives team rotation.
- The identity-tuple + body-file frontmatter substrate (PDR-076 line)
  is unambiguous, so cross-session identity collision and
  body-file-adjacency drift no longer cost a Director cycle to recover
  from.
- The substrate-pointer-read failure mode has a pattern home with
  enough worked cure-instances that the next-session-Director catches
  the failure mode in real time rather than after it has corrupted a
  routing decision.
- Liveness inference (heartbeat doctrine) lives in PDR + ADR + SKILL
  form, so a fresh agent joining a running team can read a single
  pointer rather than picking the discipline up by osmosis.
- Self-modification authorisation for Claude has a recorded shape
  decision (ADR or explicit-deferral-with-trigger), so the security
  vs throughput trade-off does not need to be re-argued each session.

## Intended Impact

What the End Goal enables that the *status quo ante* prevented:

1. **EEF First Feature delivery at sustainable cadence.** Today, a
   team session lands ~9 cycles in 45 min under active-marshal
   authority — but the next session starts with substrate drift, ghost
   queues, and rebuilt mental models that consume the first 30–60 min.
   Net: ~2–3 productive hours per session. With substrate hardened,
   the next session opens with substrate-as-canonical-truth, no
   recovery overhead, and the cadence sustains across the rotation
   boundary. EEF first-feature delivery is the canonical lane that
   benefits; the broader impact is **every** product feature lane that
   touches multi-agent work.
2. **Cross-agent-platform sustainability.** The substrate is portable
   (Practice Core surface). Claude, Codex, and Cursor agents read
   the same PDRs / ADRs / patterns. Hardening this substrate lifts
   throughput across the agent fleet, not just one platform.
3. **Doctrine-debt floor.** Today the team accumulates doctrine debt
   faster than it codifies cures (Director-window narrative observations
   piling up in napkins faster than PDRs land). Substrate-hardening
   closes the debt-to-cure gap so the team is in maintenance mode on
   doctrine rather than backlog mode.

## Empirical Thesis Under Test

The cause-and-effect claim that this program tests. **Not the End Goal
itself** — the thesis is the testable claim that the proposed cures
produce the named impact. (Distinct from the §Substrate-Cure Loop
below, which describes the operational *mechanism* by which cures are
authored.)

> Marshal-as-cycle-discipline + substrate-writing discipline +
> identity-tuple disambiguation, in simultaneous force, collapse
> Director-window cycle time from ~1 commit/window (pre-active-marshal)
> to multi-cycle-per-window — AND that throughput survives the
> rotation boundary because the discipline is encoded in durable
> substrate rather than in-window memory.

Evidence to date spans two marshal regimes:

- **Ashen Brazing Crucible**: 9 cycles + Class A in a 58-min Director
  window (2026-05-23 13:50Z – 15:05Z). First worked instance; thesis
  formation evidence.
- **Mistbound Hiding Threshold**: 4 cycles in a ~14-min marshal window
  per git author timestamps (`43e09287` 17:03:45 BST → `ccc47de2`
  17:17:45 BST), including husky 90-task gate-chains. Mistbound's
  compaction handoff §4 stated "22 min including husky" — git evidence
  shows ~14 min. Either way: 4 cycles in <25 min. Second worked
  instance; thesis confirmation evidence. PDR-077 candidate trigger
  fires on this 2nd instance.

The thesis is strongest when read in both directions: not just
"marshal authority enables high throughput" but "high throughput
depends on marshal authority + substrate-writing discipline + identity
discipline being simultaneously in force; remove any leg and the
throughput regresses to pre-active-marshal baseline".

The thesis is **falsifiable**: if the next team session opens, reads
the hardened substrate, and produces a new substrate-stale-pointer
instance OR a new cure-shape the substrate does not handle, the
thesis needs refinement and the cure-shape needs absorbing.

## End Goal vs Milestones

The End Goal is a future-state capability with named impact. The path
to it passes through **two named milestones**:

- **M1 — Safe-Pause Milestone**: the first point at which the program
  can pause without stranding work. EEF-merge-blocking substrate
  cleared. Already-delivered value (WS-1, WS-3, WS-4, WS-5, WS-9
  landed) is locked in. The team can pivot focus to EEF First Feature
  delivery. M1 is the **near-term** target.
- **M2 — Completion Milestone**: the program's End-Goal-reached state.
  All in-flight doctrine landed. Observable next-window evidence
  confirms the thesis. The program archives.

The asymmetry: **M1 is the urgent target.** M2-pursuit work is
deferred until M1 holds, unless owner directs otherwise. M2-pursuit
items will continue to land naturally as M1-incidental work is
completed (e.g., A1 / A2 stand-down vs land — landing also feeds M2),
but the *priority sequencing* of the team's effort goes to M1-blocking
items first.

| | M1 — Safe-Pause | M2 — Completion |
|---|-----------------|------------------|
| What it means | Pivot-ready; no stranded work | Full End-Goal reached |
| Why it matters | Unblocks EEF First Feature | Closes the program |
| Time horizon | This session or the next | Open-ended; depends on M1 + remaining doctrine + next-window evidence |
| Failure mode if blurred | M2-pursuit work crowds M1 critical path | Program never explicitly closes |

Sections that follow:

- **§Workstream Roll-up** — the catalogue of all in-flight work.
- **§M1 — Safe-Pause Milestone Criteria** — the M1 gates.
- **§M2 — Completion Milestone Criteria** — the M2 gates.
- **§Path Forward — the M1-focused sequence** — sequenced for M1 first.

## Substrate-Cure Loop

(Previously titled §Mechanism; renamed in R1.2 to avoid collision with
the word "mechanism" appearing in §Empirical Thesis Under Test.)

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

Status vocabulary: **LANDED** (commit exists on branch — i.e.,
*file-landed*; this does NOT imply the doctrine inside is ratified.
PDRs in the Practice Core surface carry their own `Status: Candidate /
Proposed / Adopted / Cured` field which is independent of file-landing.
A WS marked LANDED means the artefact is in the tree, not that the
team has adopted the discipline it codifies); **PENDING** (active
work, not yet landed); **BLOCKED-ON-X** (waiting on a named
prerequisite); **DRAFT-IN-FLIGHT** (authored but not yet
review-converged or marshal-landed); **OWNER-VERDICT-PENDING** (waiting
on owner decision); **OWNER-VERDICT-RECEIVED, CODIFICATION-PENDING**
(owner decided, doctrine codification not yet authored).

| WS | Artefact | Status | Closes when |
|----|----------|--------|-------------|
| WS-1 | PDR-075 Director substrate-writing discipline | **LANDED** `b6ac6147` | Cross-session ratification (already in evidence: Secret bootstrap from substrate alone in 40s) |
| WS-2 | PDR-076 v2 Agent identity tuple + body-file frontmatter | **LANDED** `db4d8b3a` (v2 foundation); **SPLIT children CARRY FORWARD** to companion plan cycles 3–4 — PDR-076a (identity tuple) + PDR-076b (body-file frontmatter) author from Ferny's `/tmp` prestage. M1 Gate 2: MET via stand-down (v2 substrate is foundation; SPLIT is doctrine refinement). | PDR-076a + PDR-076b both land per companion plan cycles 3–4 |
| WS-3 | ADR-185 v2 comms-event auto-acceptance metadata | **LANDED** `5320d6b0` | Renderer wiring (separate executable plan) |
| WS-4 | Recursion-of-doctrine pattern | **LANDED** `c097bbb3` | PDR promotion on 2nd cross-session instance |
| WS-5 | substrate-pointer-read-as-current-state pattern v2 | **LANDED** `8a99ed35` (Mistbound Cycle #2) — 6 instances D1–D6 absorbed; Wilma SAFE-WITH-CONDITIONS verdict folded | (closed) — 3 unexposed edge cases tracked as v3 candidates in pending-graduations |
| WS-6 | Marshal-as-cycle-discipline (PDR-077) | **STOOD DOWN, CARRY FORWARD** to companion plan cycle 5 — Charcoal authored draft in `/tmp` at 16:14:10Z; 3 review rounds complete (R1 docs-adr-expert; R2 3-way assumptions+wilma+betty; R3 3-way re-engagements + final docs-adr-expert GO); 7 R3 SHOULD-ABSORB items + 1 Director-verdict item pending absorption. Pre-cycle: capture `/tmp` draft + R3 synthesis to durable handoff record (companion plan cycle 1). M1 Gate 5: MET via stand-down. M2 Criterion 2: carries forward. | PDR-077 lands per companion plan cycle 5 |
| WS-7 | PR #108 SonarCloud + CodeQL clearance | **LANDED + MERGED** — PR #108 MERGED `2026-05-24T20:06:12Z` via merge commit `2462952a957c69d4c614ddb95eb880c105839c1e`. Cure cycles: bundle `340752bb` (Twilit ef315373 CLI bootstrap + Charcoal Cycle Alpha 625fb072 Sonar cures + 93-file owner-directed bundle) + hygiene tail `efe13aae` / `9e8079c8` / `58feff48`. All quality gates GREEN pre-merge: `run-quality-gates` PASS, `SonarCloud Code Analysis` PASS, `CodeQL` (all variants) PASS, `Vercel` PASS. M1 Gate 1: MET. | (closed) |
| WS-8 | Claude self-modification authz cure-shape ratification | **CARRY FORWARD** to companion plan cycle 8a (R2.1 owner-directed Lanternlit absorption, 2026-05-24). Was AUTHOR-IN-FLIGHT (Lanternlit, owner-directed R1.5 *"Author it now"*); never landed. Shape verdict: C2-near-term + C5-long-term + C4-fallback with C2-deferred-until-platform-support. Authoring relocated to [`post-m1-attestation-tidy-up.plan.md`](post-m1-attestation-tidy-up.plan.md) cycle 8a. | ADR-187 lands per companion plan cycle 8a |
| WS-9 | Twilit ST FM-2 P2 plan-Wilma verdict + cure | **LANDED** `43e09287` (Mistbound Cycle #1) — watcher-staleness consumer + CollaborationAgentId schema dedupe; knip RED→GREEN | (closed) |
| WS-10 | Heartbeat contract durable mechanism | **NOT-M1-GATED, PENDING** — INTERIM live (`narrative` comms event with `tags: ["heartbeat"]` per ADR-183). Durable substrate = 3 sub-components: (a) `last_heartbeat_at` schema field; (b) `pnpm agent-tools:heartbeat` CLI wrapper (shape spec'd by Mistbound R1.4 contribution — see WS-10 frontmatter for full shape); (c) lifecycle.event_type='heartbeat' per pending ADR-186. Per-beat `--lane` + `--focus` MUST come from agent each call, NOT be cached (silent-staleness anti-pattern). | Schema field + CLI wrapper + claim auto-rebalance protocol shipped |
| WS-11 | Heartbeat doctrine bundle (PDR-078 + ADR-186 + thin SKILL) | **STOOD DOWN, CARRY FORWARD** to companion plan cycles 6–8 — 5-reviewer convergence on RE-SHAPE; E4 RESOLVED via PDR/ADR portability distinction (R1.5 2026-05-24). PDR-078 SHA-free portable principle; ADR-186 SHAs/UUIDs allowed as repo-bound phenotype. Interim mechanism (`narrative` + `tags: ["heartbeat"]`) carried session-traffic without incident. M1 Gate 5: MET via stand-down. M2 Criterion 4: carries forward. | Per companion plan cycles 6 (PDR-078) + 7 (ADR-186) + 8 (thin SKILL + reciprocal amendments) |

| WS-12 | PDR-079 PDR-vs-ADR portability distinction | **CARRY FORWARD** to companion plan cycle 5a (R2.1 owner-directed Lanternlit absorption, 2026-05-24). Was AUTHOR-IN-FLIGHT (Lanternlit, owner-directed R1.5); never landed. Co-cure: scope `no-moving-targets` rule to portable surfaces (PDRs + rules + patterns), not ADRs. Authoring relocated to [`post-m1-attestation-tidy-up.plan.md`](post-m1-attestation-tidy-up.plan.md) cycle 5a. | PDR-079 + rule scope-update land per companion plan cycle 5a |

**Post-WS commits since `ccc47de2`** (recorded for branch hygiene, not
WS-changing; newest-first ordering matches `git log`). HEAD-on-main
post-merge: `2462952a` (PR #108 merge commit). HEAD-on-feature-branch
post-merge / pre-pause: `58feff48` (chore(agent): land collaboration
state cleanup) — followed by `9e8079c8` (chore(sonar): mirror cpd
exclusions for automatic analysis) + `efe13aae` (refactor(sonar):
reduce pr 108 cpd duplication) + bundle `340752bb` + earlier
session-substrate commits. Current local + origin: in sync.

## M1 — Safe-Pause Milestone Criteria

**M1 ACHIEVED 2026-05-24T20:09:10Z.** Attestation broadcast `2849b623`
emitted by Director Seaworthy. All 5 gates MET. Team pivots focus to
EEF First Feature delivery on owner unpause.

### Attestation discharge

| Field | Value |
|-------|-------|
| Discharging actor | Seaworthy Navigating Beacon / claude / claude-opus-4-7 / `6966d4` (M1 Gate Monitor duty per §Roles + triggers) |
| Broadcast event ID | `2849b623-5026-4e9d-9938-7ebaffb727fd` |
| Broadcast timestamp | `2026-05-24T20:09:10.000Z` |
| Owner ratification | Direct: *"we have completed M1"* (2026-05-24 post-merge turn) |
| Source body | `/tmp/seaworthy-m1-safe-pause-attestation.md` (capture-to-durable: companion plan cycle 1) |

Each gate carries a MET marker with terminal-state evidence.

### Gate 1 — WS-7 GREEN — **MET ✅**

PR #108 quality gate cleared. PR #108 was the substrate-blocker for
the EEF merge path; with it now MERGED, the EEF graph-substrate work
is unblocked.

*Terminal evidence*: PR #108 **MERGED** `2026-05-24T20:06:12Z` via
merge commit `2462952a957c69d4c614ddb95eb880c105839c1e`. All quality
gates GREEN on pre-merge HEAD `58feff48`: `run-quality-gates` PASS
(3m22s), `SonarCloud Code Analysis` PASS (2m21s), `CodeQL`
javascript-typescript + actions PASS, `Vercel` PASS. Cure path: bundle
`340752bb` (Twilit `ef315373` CLI bootstrap extraction collapsing
cpd density 76-92% → 0% on touched files + Charcoal Cycle Alpha
`625fb072` Sonar cures + 93-file owner-directed bundle) followed by
hygiene tail `efe13aae` (refactor(sonar): reduce pr 108 cpd
duplication) + `9e8079c8` (chore(sonar): mirror cpd exclusions for
automatic analysis) + `58feff48` (chore(agent): land collaboration
state cleanup). Owner pushed; CI re-graded GREEN; owner merged.

### Gate 2 — WS-2 SPLIT children land — **MET (via stand-down)**

*Terminal evidence*: PDR-076 v2 foundation already LANDED at
`db4d8b3a`; agents operated under v2 substrate without confusion all
session. SPLIT children (PDR-076a + PDR-076b) are doctrine refinement
of an already-foundation substrate; **stood down to companion plan
cycles 3–4**. Pre-cycle hygiene gate: capture Ferny's `/tmp` prestage
to durable handoff record (companion plan cycle 1). Stand-down impact:
zero on EEF; zero on team operation across this session.

*Carry-forward action*: companion plan cycles 3 (PDR-076a) + 4
(PDR-076b) author both from the captured Ferny prestage.

### Gate 3 — WS-5 pattern file landed — **MET ✅**

*Evidence*: substrate-pointer-read-as-current-state pattern v2 landed at
`8a99ed35` under Mistbound marshal Cycle #2 (2026-05-23 ~16:11Z).
Captures 6 instances D1–D6 + Wilma SAFE-WITH-CONDITIONS conditions.
Wilma's 3 unexposed edge cases (cross-channel temporal inversion,
partial-state drain window, subagent-chain propagation) tracked as v3
candidates in pending-graduations — does NOT block this gate.

### Gate 4 — WS-9 verdict + cure landed — **MET ✅**

*Evidence*: Wilma SAFE-WITH-CONDITIONS verdict absorbed during
Mistbound's second-wave reviewer dispatch (transcript referenced as
`a921a49f1da80a46c` in Mistbound's compaction handoff). Cure code
landed at `43e09287` under Mistbound marshal Cycle #1 — watcher-
staleness consumer + CollaborationAgentId schema dedupe; knip
RED→GREEN. FM-2 (session-open environment freshness check) substrate
complete.

### Gate 5 — All marshal-queued cure-bundles land or stand down — **MET ✅**

*Queue terminal state inventory* (per attestation `2849b623`):

| Entry | Terminal state | Evidence |
|-------|----------------|----------|
| Mistbound's 4-cycle marshal arc | LANDED | `43e09287` / `8a99ed35` / `499d163b` / `ccc47de2` |
| PR #108 cure (WS-7) | LANDED + MERGED | bundle `340752bb` + hygiene tail `efe13aae` / `9e8079c8` / `58feff48`; merge `2462952a` |
| Marshal hygiene cycle | LANDED | absorbed into bundle `340752bb` (93 files; owner-directed single commit) |
| Twilit `ef315373` (CLI bootstrap extraction) | LANDED | bundle `340752bb`; PR-108 cpd 76-92% → 0% on touched files |
| Charcoal Cycle Alpha `625fb072` | LANDED | bundle `340752bb`; 5 cure-types / 7 sites |
| WS-11 heartbeat doctrine bundle | STOOD DOWN → companion plan cycles 6–8 | Bundle shape ratified; interim mechanism carried session-traffic without incident |
| PDR-077 (Charcoal R3-absorption) | STOOD DOWN → companion plan cycle 5 (after capture in cycle 1) | Empirical discipline proven 3+ times; codification is the carry-forward |
| Queue-Cycle #5 (verdict-absorption compound) | STOOD DOWN | Unclaimed all session; Director-default per stand-down authority table; no downstream dependency |
| Queue-Cycle #6 (WS-2 SPLIT) | STOOD DOWN → companion plan cycles 3–4 | Coextensive with Gate 2 stand-down |
| Queue-Cycle #7 (C-12 dedupe) | STOOD DOWN | Already plan-classified non-blocking / deferred |
| Charcoal Cycle Beta (S5443×14 + consistency sweep) | STOOD DOWN → companion plan cycle 12 | Pause broadcast `e4f680c6` covered; Sonar gate GREEN without this cycle |
| Charcoal Cycle Gamma (resolveSelfIdentity + eslint cpd-exclusion) | STOOD DOWN → companion plan cycle 13 | Pause broadcast `e4f680c6` covered; Sonar gate GREEN without this cycle |
| Twilit Cycle 3 (audit-shaped test deletion) | STOOD DOWN → companion plan cycle 14 | Pause broadcast `e4f680c6` covered; test-debt cleanup independent of milestone |

Note on Cycle terminology: "Mistbound Cycle #N" refers to commits
landed in Mistbound's marshal arc; "Queue-Cycle #N" refers to
queue entries; "companion plan cycle N" refers to cycles in
[`post-m1-attestation-tidy-up.plan.md`](post-m1-attestation-tidy-up.plan.md).

### Roll-up

| Gate | State | Evidence |
|------|-------|----------|
| 1 — WS-7 GREEN | **MET ✅** | PR #108 MERGED via merge commit `2462952a` (`2026-05-24T20:06:12Z`); all CI gates GREEN on `58feff48` |
| 2 — WS-2 SPLIT children | **MET (stand-down)** | v2 foundation landed `db4d8b3a`; SPLIT children carry-forward to companion plan cycles 3–4 |
| 3 — WS-5 pattern landed | **MET ✅** | `8a99ed35` |
| 4 — WS-9 verdict + cure | **MET ✅** | `43e09287` + Wilma verdict |
| 5 — Queued bundles closed | **MET ✅** | All queue entries terminal-state — see §Gate 5 queue terminal state inventory above |

**All gates MET. Attestation broadcast `2849b623` emitted by Director
Seaworthy at `2026-05-24T20:09:10Z`. Team pivots to EEF First Feature
delivery on owner unpause.**

## M2 — Completion Milestone Criteria

**M2 is the open-ended target.** The program completes (archives) when
ALL of the following hold. Each criterion carries a current state
marker. **M2-pursuit work is deferred until M1 holds, unless owner
directs otherwise.**

### Criterion 1 — M1 (Safe-Pause) held — **PENDING (2 of 5 gates MET)**

All five M1 gates hold (no stranded work). Current state per
§M1 — Safe-Pause Milestone Criteria: Gates 3 + 4 MET; Gates 1, 2, 5
in-flight or blocked.

### Criterion 2 — WS-6 has a durable doctrine home — **DRAFT-IN-FLIGHT, REVIEW-CONVERGED**

PDR-077 (or ADR) landed capturing marshal-as-cycle-discipline. The
empirical 9-cycles-in-45-min + 4-cycles-in-~14-min results are not
durable substrate — only a PDR or ADR is. Without this, the cure dies
when the team rotates.

*Current state*: Charcoal Brazing Kiln authored PDR-077 draft in `/tmp`
at 16:14:10Z. **3 review rounds complete** (R1 sequential
docs-adr-expert; R2 3-way parallel assumptions-expert +
architecture-expert-wilma + architecture-expert-betty; R3 3-way
parallel re-engagements + final docs-adr-expert returning GO on
marshal-request with citation-discipline clean). Remaining: absorb 7
R3 SHOULD-ABSORB items + 1 Director-verdict item (claim-state
immutability clause) pending Charcoal re-engagement → marshal-request.
CAVEAT: review-trail substrate is in `/tmp` (session-local), not
durable substrate.

### Criterion 3 — WS-8 architectural-direction ratified — **AUTHOR-IN-FLIGHT (Lanternlit)**

Owner has verdicted on C2-near-term + C5-long-term + C4-fallback
cure-shapes for Claude self-modification authz, AND an ADR is being
drafted (owner-directed 2026-05-24 'Author it now').

*Current state*: Owner shape-verdict received via Seaworthy Director
tick #2 (2026-05-23 19:28:47Z): ratify C2+C5+C4 with C2-deferred-
until-platform-support. Authoring NOW (R1.5 owner-direction): Lanternlit
drafts ADR codifying the shape + the C2-platform-deferred trigger
('when Anthropic platform supports binding self-mod authz').

### Criterion 4 — WS-11 heartbeat doctrine bundle landed — **PENDING**

PDR-078 + ADR-186 + thin SKILL pointer + reciprocal §Related amendments
landed. Future sessions inherit the contract automatically rather than
via in-window broadcasts. (WS-10 durable mechanism is NOT a Completion
gate — interim lifecycle-event mechanism is workable; durable substrate
is deferred work.)

*Current state*: bundle shape ratified by 5-reviewer convergence; SKILL
§0.5 fat-draft uncommitted in working tree; PDR-078 + ADR-186 not yet
authored; ADR-186 first-write hook-blocked on citation pattern;
Fred-vs-owner-verdict tension on citation cure path surfaced unresolved.

### Criterion 5 — Observable next-window evidence — **BLOCKED ON NEXT SESSION**

The next team window applies the substrate and either (a) produces no
new substrate-stale-pointer instances OR (b) produces a new cure-shape
that the program absorbs as a new workstream.

*Current state*: M1 achieved + pause in force; cannot test until owner
unpauses + next team window opens. Companion plan
`current/post-m1-attestation-tidy-up.plan.md` cycles 1–13 land the
remaining doctrine + infrastructure substrate that determines whether
Criteria 2, 3, 4 close before Criterion 5 is testable.

### Roll-up

| Criterion | State | Evidence / Next |
|-----------|-------|-----------------|
| 1 — Safe-Pause held | **MET ✅** | Attestation `2849b623` 2026-05-24T20:09:10Z; all 5 gates terminal-state |
| 2 — WS-6 PDR-077 landed | **CARRY FORWARD** | Companion plan cycle 5 (preceded by cycle 1 capture-to-durable) |
| 3 — WS-8 ADR-or-deferral landed | **CARRY FORWARD** | Lanternlit lane absorbed R2.1 into companion plan cycle 8a; ADR-187 |
| 4 — WS-11 bundle landed | **CARRY FORWARD** | Companion plan cycles 6 (PDR-078) + 7 (ADR-186) + 8 (thin SKILL + reciprocal amendments) |
| 5 — Next-window evidence | **BLOCKED ON NEXT SESSION** | Untestable until owner unpauses + next team window opens |

Completion is observable, not ceremonial: the next team window runs
faster and produces less doctrine debt. If it does not, the program
has not completed and a follow-on cure-shape is required.

## Path Forward — the M1-focused sequence

This section answers the question owner posed in R1: "where we are
going, and the precise path between" current state and the next
milestone.

**M1 — Safe-Pause ACHIEVED 2026-05-24T20:09:10Z.** Phases 1, 2, and 3
of this section are CLOSED. Phase 4 (M2-PURSUIT) carries forward via
the companion plan
[`post-m1-attestation-tidy-up.plan.md`](post-m1-attestation-tidy-up.plan.md).
The original action tags (**M1-CRITICAL** / **M1-INCIDENTAL** /
**M2-PURSUIT**) are preserved below as audit trail of the path that
reached M1.

### Roles + triggers (added R1.3)

For the path to be fully specified, each action needs not only an
actor but also a **trigger** (who pings whom when) and a **stand-down
authoriser** (who can decide "this entry is stood down"). R1.3 names
these explicitly.

**M1 Gate Monitor**: **Director Seaworthy Navigating Beacon
(DISCHARGED 2026-05-24T20:09:10Z via attestation `2849b623`)**. The
duty: include M1 gate status (G1/G2/G3/G4/G5 MET / PENDING) in every
Director tick narrative. When all 5 gates MET, attestation broadcast
triggers (P3.E1). The duty transfers to incoming Director on rotation
per PDR-064 two-moments. If Director leaves before transfer, the
duty falls to whichever agent next holds Director authority.

**Verification primitive (R1.7 fold, ratified in R2)**. The M1 Gate
Monitor MUST verify gate state against actual artefacts, never against
this plan body's own enumeration:

| Gate class | Verification primitive |
|------------|------------------------|
| Quality-gate landing (e.g. Gate 1) | `gh pr checks <N>` + `gh pr view <N> --json state,mergeable,statusCheckRollup` |
| Commit landing (e.g. Gate 3/4) | `git log --oneline -<N>` + verify named SHA present on the relevant branch |
| Doctrine landing (e.g. file presence) | `test -f <path>` + `head -<N> <path>` for content verification |
| Queue entry terminal state (Gate 5) | Comms-event stream search for stand-down broadcasts + landing-broadcast confirmations |

**The failure mode this primitive cures**: substrate-pointer-read on
the plan body's gate enumeration itself. The plan is a snapshot; live
state is the artefacts. Reading the plan as authoritative is the same
failure mode WS-5 names, fired on the plan that names the pattern —
exact recursion-of-doctrine instance. Worked precedent: Director
Seaworthy 2026-05-24 ~16:30Z (post-bundle-land) read the plan's Gate 5
queue enumeration as live work-state and concluded *"M1 NOT achieved
bar merge"* across multiple turns without running `gh pr checks 108`;
owner correction *"forget ceremony, measure reality"* applied the
verification primitive; CI was GREEN; M1 was achievable. The
verification-primitive paragraph is the structural cure. See
§Emergent Observations E7 for the full worked-instance trace.

**Surfacing-to-owner duty**: **Director Seaworthy** is responsible
for surfacing owner-decision items (P1.C1 partition-cure verdict; E3
graduation direction; parallel-writer coordination per Gap 5) via
directed comms event referencing this plan + the specific decision
needed. If a decision item has been outstanding for >1 active team
session without owner response, Director escalates with explicit
"decision required by N to unblock path" framing.

**Stand-down authority per Gate 5 queue entry**:

| Queue entry | Stand-down authoriser |
|-------------|------------------------|
| WS-11 bundle | Lanternlit (author) |
| Queue-Cycle #5 | Director (no implementer assigned) |
| Queue-Cycle #6 | Owner (gated on partition-cure verdict; standing-down means parking WS-2 SPLIT) |
| PDR-077 | Charcoal (author) — if Charcoal silent past retirement threshold, Director |
| PR #108 cure | Director (claim is held; Director routes execution-or-rebalance) |
| Marshal hygiene cycle | Mistbound (active marshal) |
| Queue-Cycle #7 | Director (already deferred; stand-down means explicit "this stays deferred to next session") |

**Re-engagement triggers per silent-actor item**:

| Silent actor / item | Trigger |
|---------------------|---------|
| Scorched / PR #108 cure | Director ticks include Scorched heartbeat status. If silent for >10 min (per PDR-076 retirement threshold), Director directly surfaces "re-engage OR rebalance" via directed comms event to Scorched, with default action ("rebalance to follow-on implementer in N min if no signal"). |
| Charcoal / PDR-077 finalisation | Director ticks include Charcoal heartbeat status. Same 10-min threshold; Director directs "re-engage OR stand-down" with default action. |
| Owner / WS-2 partition-cure verdict | Director surfaces via directed comms event including: Ferny prestage pointer + Cascade §2/§5 boundary question + "this blocks M1 Gate 2" framing. Surfacing is one-shot; if no response within 1 active team session, Director escalates with named alternative ("park WS-2 SPLIT, accept single-PDR shape, remove open-decision marker"). |
| Owner / E3 graduation direction | Director surfaces only if E3 promotion trigger fires (2nd worked instance accumulates OR owner explicitly queries). Not a forcing function. |
| Owner / parallel-writer coordination (Gap 5) | Director surfaces once; if no response within 1 active team session, plan continues with current free-for-all multi-writer pattern and Gap 5 is captured as a deferred-cure pending future evidence. |

### Phase 1 — M1-CRITICAL items (the only must-do work for the next milestone) — **CLOSED 2026-05-24**

All P1.* items reached terminal state. Audit trail preserved below.

**P1.B1 — Scorched executes PR #108 R2 cure under Mistbound marshal — M1-CRITICAL → Gate 1**

- Status: **CLAIMED, AWAITING EXECUTION**. Scorched author claim
  `4e6e18b2` ACTIVE (opened 19:07:14Z, R2 mechanical Sonar cures on
  4 files in graph-ingest + sdks). Mistbound marshal claim
  `00375e07` ACTIVE (opened 19:33:07Z).
- Action: Scorched re-engages → executes the R2 mechanical Sonar
  cures per claim intent (S7735 ternary flip + S7763 export-from
  collapse + S7781×4 replaceAll + S7750 findLast) + commit-hygiene
  tranche per owner's tick #2 verdict ("commit hygiene tranche then
  push") → marshal-cycles via Mistbound → push.
- Owner direction: Seaworthy tick #2 19:28:47Z — "commit hygiene
  tranche then push". Direction stands.
- Prerequisite: Scorched re-engagement. **If Scorched does not
  re-engage within a Director-defined window, Director surfaces to
  Scorched first for re-engagement signal; if none, routes the claim
  to a follow-on implementer via claim-rebalance OR explicitly stands
  the cure down (handoff record + comms broadcast). The claim is owned
  end-to-end — stand-down is an explicit hand-off, not a default.**
- Unlocks: **Gate 1 MET** + EEF merge-path GREEN.

**P1.C1 — Ferny resumes Cycle #6 to author PDR-076a + 076b — M1-CRITICAL → Gate 2**

- Status: **OWNER-VERDICT RECEIVED 2026-05-24 (R1.5)**: SPLIT
  confirmed. Awaiting Ferny re-engagement.
- Action: Ferny re-engages → authors PDR-076a (identity tuple) +
  PDR-076b (body-file frontmatter) from the paste-ready blocks in
  `/tmp/ferny-ws2-partition-prestage-synthesis.md` → marshal-cycle
  via Mistbound → both child PDRs land.
- Prerequisite: Ferny re-engagement. Director Seaworthy monitors
  Ferny's heartbeat per §Roles + triggers; if silent past retirement
  threshold, Director directs re-engagement OR rebalances per claim
  auto-rebalance protocol.
- Unlocks: **Gate 2 MET** + landed PDR-076's open-decision marker is
  removed (or PDR-076 is archived if children fully supersede).

**P1.Gate5 — Queue closure (each entry lands OR explicitly stands down) — M1-CRITICAL → Gate 5**

- Status: 7 queue entries open (WS-11 bundle, Queue-Cycle #5,
  Queue-Cycle #6, PDR-077, PR #108 cure, Marshal hygiene cycle,
  Queue-Cycle #7). Each entry must reach a terminal state (landed OR
  explicit stand-down) for Gate 5 to close.
- Action: for each queue entry, the **named stand-down authoriser**
  (per §Roles + triggers table above) either lands or emits an
  explicit stand-down comms broadcast with a named resumption trigger.
  Stand-down records go to a handoff file so the next session
  inherits clean queue state, not ghost-queue.
- **Capture-to-durable substrate**: any queue entry whose evidence
  lives in `/tmp` (PDR-077 draft + R3 synthesis) MUST be captured to
  `.agent/state/collaboration/handoffs/` before stand-down or
  marshal-request. Owner of the capture: the agent who authored the
  `/tmp` content (Charcoal for PDR-077).
- **Minimum-cost M1 path**: stand-down is acceptable cure for every
  queue entry except Gate 1 (PR #108 cure must land or M1 cannot
  attest). Queue-Cycle #7 is already NON-BLOCKING (deferred to natural
  follow-on); Marshal hygiene cycle is in-flight as part of next
  tree-green window under Mistbound's marshal authority.
- Unlocks: **Gate 5 MET**.

### Phase 2 — M1-INCIDENTAL items (land-or-stand-down branching) — **CLOSED 2026-05-24**

All P2.* items reached terminal state via stand-down (companion plan carries forward). Audit trail preserved below.

Each item below closes a queue entry on Gate 5 either way. Landing
*also* feeds M2; stand-down is faster to M1. The branch is owner-
or-Director-routed per item.

**P2.A1 — Lanternlit Listening Dusk → WS-11 heartbeat doctrine bundle**

- M1 contribution: closes one Gate 5 queue entry (whether by landing
  OR stand-down).
- M2 contribution: landing feeds Completion Criterion 4.
- **E4 RESOLVED R1.5 (2026-05-24) via PDR/ADR portability distinction**:
  prerequisite cleared. LAND path is now unblocked.
- LAND path: author PDR-078 (SHA-free portable principle) + ADR-186
  (SHAs/UUIDs allowed as repo phenotype) + thin SKILL pointer +
  reciprocal §Related amendments to PDR-027/063/064 → round-2 reviewer
  fan-out → owner review → marshal-request to Mistbound.
- STAND-DOWN path (still available as cheaper M1 cure): emit explicit
  stand-down broadcast with "resume next session" trigger; archive
  SKILL §0.5 fat-draft as pending-graduations candidate.
- Recommendation: **LAND** — E4 is resolved, bundle shape ratified,
  reviewer convergence complete; the architecturally-excellent path
  is now achievable in-session.

**P2.A2 — Charcoal Brazing Kiln → WS-6 PDR-077 finalisation**

- M1 contribution: closes one Gate 5 queue entry.
- M2 contribution: landing feeds Completion Criterion 2.
- LAND path: Charcoal re-engages, absorbs 7 R3 SHOULD-ABSORB items in
  `/tmp/charcoal-pdr077-postresume-fanout-synthesis.md` + 1 Director-
  verdict item (claim-state immutability clause); marshal-cycles into
  the tree (3 review rounds already complete with final
  docs-adr-expert GO).
- STAND-DOWN path: emit explicit stand-down broadcast with
  "resume on Charcoal re-engagement OR next-session pickup" trigger;
  PDR-077 draft + R3 synthesis file remain in `/tmp` as evidence of
  prior work. **RISK on STAND-DOWN: `/tmp` substrate is session-local
  to the authoring machine; rotation may lose the R3 synthesis file.
  Capture R3 synthesis in a durable handoff record before standing
  down.**
- Prerequisite for LAND path: Charcoal re-engagement post-credit-pause.
- Recommendation: **LAND if Charcoal returns this session**; otherwise
  STAND-DOWN. Substrate evidence is strong (2 worked instances) but
  M1 does not require the doctrine landing.

**P2.D1 — Any implementer → Cycle #5 (Cycle #1 verdict-absorption)**

- M1 contribution: closes one Gate 5 queue entry.
- M2 contribution: none directly; substrate-quality work.
- LAND path: any-implementer picks up, executes compound cycle
  (Charcoal F2/F3/F5 + Betty CONDITION + 2 code-expert findings +
  META API-shape drift).
- STAND-DOWN path: stand-down broadcast with "resume on next idle-fill
  opportunity OR next-session pickup" trigger.
- Recommendation: **STAND-DOWN by default**; LAND only as genuine
  idle-fill if implementer truly idle and other work blocked.

### Phase 3 — M1 attestation + EEF pivot — **P3.E1 EXECUTED 2026-05-24T20:09:10Z**

**P3.E1 — Director (Seaworthy, as M1 Gate Monitor) → Safe-Pause Attestation broadcast** — **EXECUTED**. Broadcast event `2849b623-5026-4e9d-9938-7ebaffb727fd`. Gate-by-gate evidence captured in §M1 — Safe-Pause Milestone Criteria above. P3.E2 EEF pivot deferred to owner unpause.

- Trigger: all 5 M1 gates MET (Gates 3 + 4 already MET; Gates 1, 2,
  5 pending).
- **Detection mechanism**: Director Seaworthy holds the M1 Gate Monitor
  duty (per §Roles + triggers). Each Director tick narrative includes
  M1 gate status. When all 5 gates flip to MET in a single tick,
  attestation broadcast triggers immediately — same tick, not next.
- Action: Director broadcasts Safe-Pause Attestation with gate-by-gate
  evidence (commit SHAs for landed gates; owner-decision evidence for
  verdict gates; explicit-deferral records for stood-down items).
- Unlocks: **M1 reached.** Team pivots to EEF First Feature lane.

**P3.E2 — Team → EEF post-pivot execution**

See §Relationship to EEF First Feature Delivery for lane-by-lane
state and next-actions (WS4.5 unblocked, t2-zod-loader ready, WS2.3
parser-integration clean pickup, etc.).

### Phase 4 — M2-PURSUIT items — **CARRY FORWARD via companion plan**

M1 is achieved; Phase 4 carries forward. The canonical executable
surface for the M2-PURSUIT items is
[`post-m1-attestation-tidy-up.plan.md`](post-m1-attestation-tidy-up.plan.md)
(13-cycle linear sequence). The companion plan covers: PDR-076 SPLIT
children, PDR-077 R3-absorption, WS-11 bundle, comms-watch redesign
(§P5.W1 promoted), and test-debt + Sonar residue. WS-8 + WS-12 remain
AUTHOR-IN-FLIGHT in Lanternlit's lane (not in the companion plan;
tracked here as P4.C2 + P4.C3 below).

**P4.C2 — WS-8 ADR-or-deferral codification — M2-PURSUIT, AUTHOR-IN-FLIGHT → Criterion 3**

- Status: **AUTHOR-IN-FLIGHT** (Lanternlit, owner-directed R1.5
  2026-05-24 'Author it now'). Owner shape-verdict received via
  Seaworthy tick #2: ratify C2+C5+C4 with C2-deferred-until-platform-
  support.
- Action: Lanternlit drafts ADR codifying the shape + the C2-platform-
  deferred trigger ('when Anthropic platform supports binding self-mod
  authz'). Reviewer fan-out (assumptions-expert + docs-adr-expert at
  minimum). Owner review. Marshal-request to Mistbound.
- M1 impact: none — Lanternlit can author this in parallel with WS-11
  bundle and WS-12 PDR-079; all are author-in-flight queue items, not
  M1-blocking.

**P4.C3 — WS-12 PDR-079 PDR-vs-ADR portability distinction — M2-PURSUIT, AUTHOR-IN-FLIGHT (NEW R1.5)**

- Status: **AUTHOR-IN-FLIGHT** (Lanternlit, owner-directed R1.5
  2026-05-24).
- Action: Lanternlit authors PDR-079 codifying the owner-articulated
  distinction (PDRs portable, ADRs repo-bound; SHA-in-PDR is a
  misclassification signal; composition with PDR-066). Plus
  mechanical co-cure: scope `no-moving-targets-in-permanent-docs.md`
  rule to apply strictly to portable surfaces (PDRs + rules +
  patterns), NOT to ADRs. Reviewer fan-out (assumptions-expert +
  docs-adr-expert + architecture-expert-fred). Owner review.
  Marshal-request to Mistbound.
- M1 impact: none — parallel to M1 work.

**P4.A1-LAND / P4.A2-LAND** — only if Phase 2 LAND path was chosen
above; landing is M2-pursuit work that happens to also close a Gate 5
entry.

**P4.E3 — Next-window observable evidence — M2-PURSUIT → Criterion 5**

- Action: post-pivot, observe whether the next team session opens with
  zero new substrate-stale-pointer instances OR produces a new
  cure-shape the substrate absorbs.
- Cannot be tested until post-M1 + post-pivot.

### Dependency graph — M1 critical path explicit

```text
   M1-CRITICAL (must close):
   ──────────────────────────────────────────────────────────
   P1.B1 (PR #108 cure) ──────────────────> Gate 1 MET ──┐
   P1.C1 (Owner WS-2 verdict) ────────────> Gate 2 MET ──┤
   P1.Gate5 (queue stand-down OR land) ──> Gate 5 MET ──┤
                                                         ├──> P3.E1 (Safe-Pause Attestation) ──> M1 REACHED ──> P3.E2 (EEF pivot)
   Gate 3 (WS-5 LANDED 8a99ed35) ────────────────────────┤
   Gate 4 (WS-9 LANDED 43e09287) ────────────────────────┘

   M1-INCIDENTAL (helps Gate 5 close; land-or-stand-down):
   P2.A1 (WS-11 bundle) ─> Gate 5 queue entry close
   P2.A2 (PDR-077)      ─> Gate 5 queue entry close
   P2.D1 (Cycle #5)     ─> Gate 5 queue entry close

   M2-PURSUIT (DEFERRED until post-M1):
   P4.C2 (WS-8 codification) ──────────────> Criterion 3 (M2)
   P4.A1-LAND / P4.A2-LAND ────────────────> Criteria 4 / 2 (M2)
   P4.E3 (next-window evidence) ───────────> Criterion 5 (M2)
```

### What is NOT on the path

- **Authoring new PDRs / ADRs / patterns without ≥1 worked instance** —
  per Non-Goals; doctrine-inflation guard.
- **Re-litigating WS-11 bundle shape** — converged pre-pause; opening
  again would be substrate-pointer-read on my own decision.
- **Driving the EEF execution detail through this plan** — that lives
  in `threads/eef.next-session.md`.
- **Force-landing the WS-11 bundle without resolving the citation-cure
  tension** — would either re-trip the hook OR leave the rule violated.
- **PR #108 push without first executing the owner-directed hygiene
  tranche** — would push a noisy diff that confounds review.
- **Pursuing M2-PURSUIT items before M1 is reached** — crowds the
  critical path and risks M1 slipping. Defer is the correct stance.

## Post-M1 Cleanups — Friction-Cures Deferred Until M1 Attestation

Manual-step patterns in resume protocols + suboptimal infrastructure
shapes that surfaced **during** M1 Safe Pause execution but sit **off**
the M1 critical path. Each entry names a friction observed during M1
work and the structural cure that recur-proofs it for future agents.

**Promotion trigger for all entries**: M1 Safe Pause attestation
broadcast emitted (or explicit owner-direction overrides for specific
items).

### Entry criteria

An item belongs here when ALL of:

1. The work surfaced during M1 Safe Pause execution as a friction or
   manual step.
2. The work is NOT on the M1 critical path (would not contribute to
   Gate 1–5 verdicts).
3. There is a structural cure shape (not just a doc patch) that
   recur-proofs the friction.
4. The cure can be deferred until after M1 attestation without
   degrading M1 outcome.

If a friction surfaces that IS on the M1 critical path, route into the
appropriate workstream in §Path Forward instead.

### Distinction from §Emergent Observations

§Emergent Observations is for *substrate-doctrine candidates* (PDRs /
ADRs / patterns) requiring graduation evidence. §Post-M1 Cleanups is
for *infrastructure-mechanism cures* that land as code or CLI behaviour
changes. Test: does the cure land as code (Post-M1 Cleanups) or as
doctrine (Emergent Observations)?

### Meta-pattern

The recurring cure shape: **make the documentation generated by the
implementation** (per [`metacognition.md`](../../../directives/metacognition.md)
§ Cure Shape — Structural, Not Doc-Patch). Each entry below moves an
explicit manual step into implicit CLI / mechanism behaviour, reducing
resume-protocol overhead × team-size × time.

### P5.W1 — Comms-watch seen-state redesign — **PROMOTION-ELIGIBLE 2026-05-24** (M1 attestation fired)

**Executable form**: companion plan
[`post-m1-attestation-tidy-up.plan.md`](post-m1-attestation-tidy-up.plan.md)
cycles 9 (WS1 CLI auto-seed) + 10 (WS2 storage redesign) + 11 (WS3 cleanup).

**Problem (four dimensions)**:

1. **Wrong primitive** — UUID checklist vs timestamp watermark. Current
   shape enumerates every UUID ever seen (~1660 entries, unbounded
   growth); natural primitive is a single mtime watermark (O(1) per
   tick, O(1) re-seed).
2. **Committed seen-files create git churn**. Each agent's
   `.agent/state/collaboration/comms-seen/<agent>.json` grows
   monotonically and lives in git; closed-out agents leave stale files;
   non-trivial fraction of repo growth over months.
3. **Manual re-seed is fragile**. Every resume-protocol substrate bridge
   prescribes `ls .agent/state/collaboration/comms/ | sed 's/\.json$//' > <seen-file>`;
   forgetting = backflood; recur-prone (observed multiple times in
   single sessions).
4. **Action-to-impact mismatch**. Watcher's job is *"emit events newer
   than my position"*; natural state is *"the last position"*, not
   *"enumerate what's old to derive what's new"*.

**Structural cure (three workstreams, sequenced)**:

- **WS1 — CLI auto-seed** (small; sequenceable first). Add
  `--seed-from-now` flag + make missing/empty seen-file auto-seed by
  default. Resume-protocol substrate bridges DROP the re-seed step.
  Minimum shippable shape: WS1 alone eliminates the manual-step
  friction even if storage remains UUID-list.
- **WS2 — Storage redesign** (medium; depends on WS1). Change format
  to `{ last_seen_mtime: ISO, last_seen_filenames: string[] }` (single
  watermark + filename array for millisecond-tie defense). Move
  location to `${XDG_CACHE_HOME:-$HOME/.cache}/oak/practice/<session_id_prefix>/comms-watch.json`
  (per-session ephemeral). Detect format on read; legacy UUID-list
  re-written to new format on first tick.
- **WS3 — Cleanup** (small; depends on WS2; curator-pass class).
  Remove `.agent/state/collaboration/comms-seen/` directory from repo;
  drop legacy-location compat read; update [`start-right-team` SKILL §0](../../../skills/start-right-team/SKILL-CANONICAL.md)
  and [`comms-watch-mechanism.md`](../../../reference/comms-watch-mechanism.md)
  to remove re-seed instruction.

**In scope**: `agent-tools/src/collaboration-state/cli-comms-watch.ts`

- adjacent watch-loop files; `.agent/state/collaboration/comms-seen/`
directory (removed in WS3); SKILL §0 + `comms-watch-mechanism.md`
documentation surfaces (updated in WS3); tests under
`agent-tools/tests/collaboration-state/`.

**Out of scope**: comms event schema or storage shape (events
unchanged); inotify / FSEvents migration (polling stays); watcher
self-exclusion logic (unchanged); multi-machine state sync; per-event
emission format (unchanged).

**Acceptance signals**: no agent runs `ls ... | sed ... >` on resume;
state cost is O(1) per agent regardless of event count;
`.agent/state/collaboration/comms-seen/` removed; multi-platform support
maintained (Linux + macOS); backflood is structurally impossible (even
forgetting watcher arm step or starting with deleted seen-file does
not cause backflood — auto-seed catches both).

**Risks**: mid-migration two-format coexistence (low; bugs self-correct
after one tick); per-session ephemeral state lost on machine reboot
(low; auto-seed-on-missing IS the recovery path); cross-platform
cache-dir conventions (low; default `${XDG_CACHE_HOME:-$HOME/.cache}`
works on Linux + macOS); two concurrent watchers from same
session-id-prefix collide (low; path includes prefix; detect-and-error
on second open); removal of committed seen-files breaks external
consumer (low; grep repo before WS3).

**Promotion**: M1 Safe Pause attestation broadcast. Implementer-class
agent (Twilit-class — `agent-tools` workspace + CLI lane experience)
executes; reviewer dispatch code-expert + type-expert on WS1+WS2;
docs-adr-expert on WS3 for SKILL prose alignment.

**Captured**: 2026-05-24 metacognition pass during Director Window 2
(Seaworthy Navigating Beacon `6966d4`), surfaced from worked-instance
friction observation. The manual re-seed step has been forgotten
multiple times in single sessions.

### Adding new entries

Future cleanups surfaced during the remaining M1 push window can be
added here as P5.W2, P5.W3, etc. Each entry should follow the P5.W1
shape: problem framing (multiple dimensions if applicable), cure
shape (workstream decomposition), scope + non-goals, acceptance
signals, promotion trigger, capture pointer.

## Relationship to EEF First Feature Delivery (priority lane)

This program is *enabling infrastructure* for EEF. Specifically:

- **WS-7 (PR #108 clearance)** is on the EEF critical path — the
  graph-substrate work that delivers EEF first-feature gate-1a
  (`eef-explore-evidence-for-context`) cannot merge until PR #108 is
  GREEN. The original `pr-108-snagging.plan.md` cycles all landed
  (archived as complete); subsequent commits re-redded the gate, and
  WS-7 captures the *current* cure-cycle, not the original snagging
  cycles.
- **WS-1 / WS-2 / WS-3 / WS-4 / WS-5 / WS-6 / WS-10 / WS-11** are
  throughput infrastructure — they make multi-agent EEF work sustainable
  rather than producing a single high-cost team session followed by
  recovery windows.

### EEF lane state (per `threads/eef.next-session.md`, R1-refresh)

**Round 1 + Round 2 substrate floor: effectively COMPLETE** (2026-05-23
06:54Z closeout).

| Lane | Status | Evidence |
|------|--------|----------|
| WS4.1 graph-corpus-sdk scaffold | **LANDED** | `3241893d` 2026-05-23 07:47Z under Stormbound (Lunar's 14-file scaffold committed after credit-pause via ownership-override; consumer-ready) |
| WS4.4 GraphView interface + smoke-test | **LANDED** | `1fc5b491` + `bf7fa545` + `db5271af` (Foamy) |
| WS4.5 EefStrandsGraphView adapter | **UNBLOCKED** (was blocked on WS4.1) | Ready for author-claim |
| t1 EvidenceCorpus type substrate + re-exports | **LANDED** | `7d8f0b0c` + `5ec02aec` + `9425faa0` (Sparking) |
| t9 AGGREGATED_EEF_EVIDENCE_GUIDANCE constant | **LANDED** | `acd2a3f3` (SVW) |
| t10 eef-evidence-grounded-lesson-plan prompt | **LANDED** | `a2136557` + `11c05ced` (SVW + Sparking) |
| t12 citation-shape Zod types | **LANDED** | `0b7289e9` (Mistbound, 2026-05-22 16:51 BST) |
| t13a freshness check function | **LANDED** | `968e3cb7` + `745fe919` + `8f253280` (Sparking) |
| t14 telemetry seam pattern | **LANDED** | `72cd93f0` (Sparking) |
| t20 credits attribution | **LANDED** | `e1d76c54` (Sparking) |
| WS2.2 jsonld-compatible + Turtle parsers | **LANDED** | `f58bcb80` + `ce0abe26` + `361cae35` (Sparking) |
| WS2.3 source-path primitives | **LANDED** | `6cc7b339` + `c03ace9b` (Sparking) |
| t2-zod-loader | **READY** (was blocked on WS4.1) | Clean author-claim available |
| WS2.3 parser-integration | **CLEAN PICKUP** | Sparking's split-out cycle never authored (intent broadcast 2026-05-23 01:08Z) |
| t6a-explore-tool | **BLOCKED** on t2 + WS4.5 | — |
| ff3 / ff4 / ff5 / ff6 | **PENDING** | Delivery-contract items pending post-Round-2 state stabilisation |

### Critical-path implications

- **Some EEF work can already proceed in parallel** with substrate work
  — t2-zod-loader is ready, WS4.5 is unblocked, WS2.3 parser-integration
  is clean pickup. The "wait for Safe-Pause" framing is not strictly
  required for these lanes; the Safe-Pause gate exists to prevent
  *substrate stranding*, not to block EEF work entirely.
- **PR #108 GREEN is the merge-path blocker for shipping**; until it
  flips, none of the landed EEF work can merge to main. WS-7 is the
  critical-path item.
- **Lunar Illuminating Eclipse silent**: Lunar staged WS4.1 at 21:21Z
  2026-05-22 then went silent; Stormbound resumed the commit under
  ownership-override. No active rescue plan needed — work has landed.

See [`threads/eef.next-session.md`](../../../memory/operational/threads/eef.next-session.md)
for the EEF execution detail and lane-by-lane next-action.

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

## Emergent Observations — substrate candidates not yet workstreams

Observations surfaced during this session that have NOT been promoted
to workstream status. Each carries a graduation-target and a named
promotion trigger so the next agent reading this knows when to act.
Promotion criteria: ≥2 worked instances OR explicit owner direction
OR an inability-to-act-correctly without the codification.

### E1 — Owner-coherence-moment as a 5-component Director duty

*Evidence*: docs-adr-expert review of Mistbound's Cycle #4 hygiene
sweep (referenced as transcript `af121c028fdd5bbe0` in compaction
handoff §9) flagged **SUBSTANTIVE DRIFT**: the owner-coherence-moment
construct (5 components gating Director routing decisions) exists
*only* in comms / repo-continuity / napkin substrate, NOT in permanent
Practice surface. Operational construct without doctrinal home → next
session has to reconstruct the discipline from substrate rather than
read it as canonical.

*Graduation-target*: PDR-074 amendment OR new PDR naming
owner-coherence-moment as Director duty with N-component enumeration.

*Promotion trigger*: when the next Director window opens, the absence
of this codification will either (a) force the construct to be
reconstructed from substrate again (worked-instance #2 → promote) or
(b) be ignored, producing routing drift (worked-instance #2 → promote).
Either path lands the trigger.

### E2 — Substrate-pointer pattern v3 edge cases

*Evidence*: Wilma's SAFE-WITH-CONDITIONS verdict on pattern v2 named 3
*unexposed* edge cases: cross-channel temporal inversion (events on
broadcast vs directed channels arrive out of wall-clock order from a
reader's view); partial-state drain window (between read and act, the
underlying state can shift); subagent-chain propagation without source
verification (a subagent reads a sub-substrate and propagates the
inference up the chain).

*Graduation-target*: pattern v3 amendment OR a separate `tracked-
conditions` surface attached to pattern v2.

*Promotion trigger*: ≥1 worked-instance of any of the 3 edge cases
occurring in a future session. Wilma's verdict named them as
hypothetical-but-plausible; promotion needs an actual instance.

### E3 — Verification-discipline-correction as Director primitive

*Evidence*: Napkin entry from Scorched Director window (2026-05-23
~15:03Z): owner correction named the Director's actual operating
mode as **verification, not trust** — concrete-artefact asks (transcript
IDs, claim openings, file paths), NOT status confirmations. Single
strong worked-instance: Director propagating owner roster-correction
without artefact verification.

*Graduation-target*: rule at `.agent/rules/verify-dont-trust.md` OR
`start-right-team` SKILL §"Active per-agent check-in" amendment.

*Promotion trigger*: 2nd worked-instance of trust-propagation failure
mode (Director or any agent propagating owner / peer claims as
verified state without artefact verification).

### E4 — Citation-policy reconciliation — **RESOLVED 2026-05-24 (R1.5)**

*Resolution*: Owner R1.5 verdict reframed the question. The tension
was not "which citation style?" but "what are PDRs and ADRs
fundamentally?". Owner articulated PDRs and ADRs as **fundamentally
different types of thing**:

- **PDR** = portable practice doctrine (claim about how multi-agent
  practice works; applies to ANY repo with multi-agent collaboration;
  CANNOT contain SHAs, repo paths, branch names, plan filenames —
  anything that ties it to *this* git history).
- **ADR** = repo-specific architectural decision (choice about how
  *this* repo's substrate implements something; repo-bound by
  definition; SHAs and event-UUIDs welcome as appropriate evidence).

*SHA-in-PDR = misclassification signal*: when content wants a SHA in
a PDR, the SHA-bearing substance belongs in an ADR, not a PDR.

*Binding cure for the WS-11 bundle*:

- PDR-078 (liveness-heartbeat-contract): zero SHAs/UUIDs; pure
  portable principle.
- ADR-186 (comms-event-heartbeat-lifecycle-substrate): SHAs and
  event-UUIDs allowed as repo-specific evidence.

*Follow-on substrate (WS-12)*: codify the PDR-vs-ADR portability
distinction in PDR-079 (new) + scope the `no-moving-targets` rule to
apply strictly to portable surfaces (PDRs + rules + patterns), not to
repo-bound ADRs. See WS-12 in §Workstream Roll-up.

*Lessons captured into the plan*: substrate-pointer-read failure mode
named in WS-5 fired on the plan itself during R1 authoring (named in
R1.2 Refinement Log); now the analogous PDR/ADR-class failure mode is
codified.

### E5 — Gatekeeper-specialisation (multi-writer commit-marshal discipline)

*Evidence*: Memory entry `feedback_gatekeeper_specialisation`
(graduated 2026-05-22) named the observation that in multi-agent
windows, ONLY one agent runs full pre-commit gates; others queue
commit-intents and the gatekeeper validates the shared tree once per
round. No new worked-instance evidence accumulated this session.

*Graduation-target*: currently lives as a memory-feedback entry (NOT
a rule file at `.agent/rules/`). If a 3rd worked instance accumulates,
candidate for promotion to either a `.agent/rules/` entry OR a PDR if
it becomes a Practice Core surface.

*Promotion trigger*: 3rd worked-instance with novel coordination
shape, OR owner direction to elevate. Currently memory-feedback-shape;
no elevation pressure.

### E6 — Marshal-as-cycle-discipline 2nd instance evidence in flight

*Evidence*: Mistbound's 4-cycle marshal arc (`43e09287` / `8a99ed35`
/ `499d163b` / `ccc47de2`) landed by git author timestamps 17:03:45
BST → 17:17:45 BST = ~14 min including husky 90-task gate-chains
(~3.5 min/cycle). Mistbound's compaction handoff §4 stated 22 min;
git evidence shows 14 min. Either way: SECOND worked instance of
marshal-as-cycle-discipline (first: Ashen's 9-cycles-in-45-min)
EXCEEDS the original throughput in cycles-per-minute. PDR-077 trigger
fired.

*Graduation-target*: PDR-077 (Charcoal authoring; see WS-6).

*Promotion trigger*: ALREADY FIRED. PDR-077 draft in `/tmp` awaiting
Charcoal re-engagement. Tracked via WS-6, not a separate workstream.

### E7 — Substrate-pointer-read on the plan's own gate enumeration (recursion-of-doctrine, post-bundle)

*Evidence*: Director Seaworthy Navigating Beacon (`6966d4`) worked
instance, 2026-05-24 ~16:30Z post-bundle-land. After the M1-Pause
bundle `340752bb` landed, Director read the plan's §M1 Safe-Pause
Milestone Criteria + Gate 5 queue enumeration as live work-state and
concluded *"M1 NOT achieved bar merge"* across multiple turns. Owner
correction: *"most of those agents closed out a while back, I don't
trust that analysis. Make a concise list of the actual work that
remains and what impact that work is intended to bring about, and
compare that to the state of the actual repo: forget ceremony,
measure reality."* Director ran `gh pr checks 108` for the first
time, found ALL gates GREEN, inverted the analysis: M1 achievable bar
merge.

*Pattern*: this is exactly the substrate-pointer-read failure mode
WS-5 names — *the snapshot is not the live state* — fired on the plan
that names the pattern. **Recursion-of-doctrine instance**: WS-4
recursion-of-doctrine pattern (LANDED `c097bbb3`) firing on a plan
whose §Risks Risk #2 explicitly warns about the same failure mode on
this plan body. The doctrine warned of itself; the warning did not
prevent the instance.

*Graduation-target*: structural cure landed in this refinement R2
under §Roles + triggers → "**Verification primitive (R1.7 fold)**" —
the M1 Gate Monitor MUST verify gate state against actual artefacts
(`gh pr checks`, commit log, file presence, comms-events), NEVER
against the plan body's own enumeration. R1.7 was originally listed
as carry-forward item 6; folded into R2 because the cure shape was
clear and the worked instance evidence is in-band.

*Promotion trigger*: ALREADY FIRED in R2. Substrate cure is
in-tree as the verification-primitive paragraph above. Next-window
agents reading the M1 Gate Monitor section receive the cure
automatically; no further graduation needed unless cure proves
insufficient (next worked instance of same failure mode).

*Meta-meta-observation*: this Emergent Observation entry itself,
authored by the same Director who executed the failure mode, captures
the metacognitive recovery loop as worked evidence. The plan now
carries both the warning (Risk #2) and the cure (verification
primitive) plus a worked-instance trace (this entry) — three pieces
of substrate from one event.

## Plan Coordination — co-authoring model (sidebar)

**Adopted 2026-05-24 by owner direction.** Resolves R1.3 Gap 5
(parallel-writer coordination).

The plan body is held under a single primary-author claim (currently
`8374e240`, Lanternlit Listening Dusk). Other agents who need to
contribute substrate to the plan author do so via **sidebar files**,
NOT direct plan-body edits.

### Sidebar conventions

**Location**:
`.agent/plans/agentic-engineering-enhancements/current/sidebars/<contributor-prefix>-<topic-slug>.md`

Example: `sidebars/0e27cc-heartbeat-cli.md` for a Mistbound
contribution on the heartbeat CLI.

**File shape**:

- Frontmatter: contributor identity tuple (name, platform, model,
  session_id_prefix), created_at, last_updated_at, topic, target
  integration section in the plan (e.g., "WS-10 description" or
  "new emergent observation").
- Body: append-only by convention. Contributors add new sections at
  the bottom; they do NOT edit each other's prior sections.
- Plan-holder reviews sidebar contributions at refinement boundary
  (each Plan Refinement Log pass) and integrates the substance into
  the plan body. The sidebar file remains as audit trail of the
  pre-integration substance.

### When sidebar vs direct edit

- **Direct plan-body edit**: only by the plan-holder (current
  primary-author claim).
- **Sidebar contribution**: any other agent contributing substrate
  to the plan author. Includes proposed amendments, new emergent
  observations, new workstream candidates, refinement suggestions.

### Why this model

Per `feedback_peer_sidebar_beats_coordinator_helpers` (graduated
2026-05-22): peer-pair sidebars in shared append-only files produce
better design collaboration than hub-and-spoke coordination.
Plan-authoring is design work; sidebar is the architecturally-
correct shape. The model also closes the substrate-pointer-read
attack surface on the plan body: a reader sees a single coherent
artefact, with the sidebar files providing audit-trail of how
contributions arrived.

### Mistbound's R1.2 contribution

The "Ideas to be integrated into the plan" section that appeared in
the plan body during R1.2's editing window (Mistbound session
`0e27cc`, owner-directed) was a *retroactive* multi-writer event —
authored before this co-authoring model was adopted. R1.4 integrates
Mistbound's substance into the plan body (WS-10, see §Workstream
Roll-up for the integrated specification) and removes the in-body
"Ideas to be integrated" section. Future contributions from any
non-primary-author follow the sidebar model.

## Owner Ratification Status

### R0 (initial authoring, 2026-05-23)

This plan was **empirically ratified by Director Seaworthy Navigating
Beacon** through routing decisions made shortly after the plan landed:
WS-2 routed to Ferny (partition-cure analysis), WS-6 routed to Charcoal
(marshal-as-cycle-discipline doctrine home), WS-11 routed to Lanternlit
(heartbeat doctrine bundle). Director adopting the plan's
decomposition by name-routing workstreams is the strongest possible
ratification signal — stronger than verbal acknowledgement.

No prior owner re-direction altered the End Goal / Mechanism / Safe-
Pause Criteria framing.

### R1.1 + R1.2 (sub-refinements of R1, 2026-05-24)

R1.1 (M1/M2 milestone framing) and R1.2 (reviewer absorption pass) are
sub-refinements of R1's accuracy-restoration framing. They do not
introduce substantive new architectural decisions; they refine
*terminology + accuracy*. Owner ratification of R1 carries forward
unless owner queries the milestone framing (R1.1) or the reviewer-
absorption decisions (R1.2). Both sub-refinements are surfaced
in-band via the §Plan Refinement Log and via direct broadcast to
Director Seaworthy on next comms emission.

### R1 (current-state refresh, 2026-05-24)

This refinement was **owner-directed**: "please deeply update the plan
so that it reflects the current state of the repo accurately… we need
to know exactly where we are, where we are going, and the precise path
between the two… this is the foundation that all next steps are built
on".

R1 is an **accuracy restoration**, not a substantive doctrine change.
It refreshes status / SHA / dependency information against current
ground truth and adds two new sections (Path Forward, Emergent
Observations) without changing End Goal / Mechanism / Non-Goals.

R1 ratification will be surfaced to Director Seaworthy + owner via
directed comms-event for confirmation of:

> Refreshed plan body at
> `.agent/plans/agentic-engineering-enhancements/current/practice-infrastructure-hardening-program.plan.md`.
> All 8 claimed SHAs verified. WS-5 + WS-9 closed. WS-6 / WS-7 / WS-8
> / WS-11 statuses updated. New §Path Forward + §Emergent Observations
> sections added. Surface for confirmation that the refresh
> accurately reflects current state and that the Path Forward
> sequence is correct.

Owner / Director response will be absorbed via further refinement
entries in the Plan Refinement Log; the plan body remains the source
of truth, comms substrate is the audit trail.

## Plan-Body First-Principles Check

Per [`.agent/rules/plan-body-first-principles-check.md`](../../../rules/plan-body-first-principles-check.md):

- **Shape**: this is a roll-up program plan, not an executable TDD-cycle
  plan. The unit of landing is per-workstream, not per-cycle within
  this plan. Each workstream has its own atomic landing (commit) under
  its own discipline. In-flight authoring lanes (R1): WS-6 (PDR-077,
  Charcoal); WS-7 (PR #108 cure, unassigned); WS-8 (ADR-or-deferral
  codification, unassigned); WS-11 (heartbeat doctrine bundle,
  Lanternlit). Landed lanes (R1): WS-1, WS-2, WS-3, WS-4, WS-5, WS-9.
- **Landing path**: this plan body is itself the only landing this
  plan authors. WS-level landings are tracked here but executed under
  their own claims / authors. R1 refinement edits this plan body
  in-place; landing of the refinement goes via marshal-request to
  Mistbound after owner ratification.
- **Vendor-literal**: no vendor commands or API shapes prescribed by
  this plan. WS-7 references vendor surfaces (SonarCloud, CodeQL) but
  the original `pr-108-snagging.plan.md` execution plan has been
  archived as complete; the *current* cure-cycle (re-redded gates from
  subsequent commits) has no executable plan — it is queued for an
  implementer to author per owner direction.

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
  End Goal vs Milestones + Workstream Roll-up + M1 — Safe-Pause
  Milestone Criteria + Path Forward to determine current state and
  what to do next.
- **Session-close touch point**: any session that lands a workstream
  artefact updates the corresponding WS row in §Workstream Roll-up
  with the landing commit SHA. Multiple landings in one session may
  be batched into one refinement edit per the Plan Refinement Log.
- **Director-handover touch point**: incoming Director ratifies or
  refines End Goal / Intended Impact / Empirical Thesis / Mechanism /
  M1 + M2 Milestone Criteria; refinements land as amendment commits
  with a new Plan Refinement Log entry.
- **Owner-decision touch point**: outstanding owner decisions per R1.2
  refresh — WS-2 partition-cure verdict (Gate 2); WS-8 codification
  author assignment (Criterion 3); E4 citation-policy reconciliation
  (Path Forward A1 prerequisite); E3 verification-discipline-correction
  graduation by owner-direction (per E3 promotion trigger). The plan
  is surfaced to owner at each. **Director-decision touch points**
  (NOT owner-gated): Safe-Pause Attestation timing (Director Seaworthy
  broadcasts when M1 gates 1–5 all MET); WS-7 cure-claim execution
  monitoring (Director routes rebalance-or-stand-down if Scorched
  ages out).
- **Archive touch point**: when M2 — Completion Milestone holds, this
  plan moves to
  `.agent/plans/agentic-engineering-enhancements/archive/completed/`.
  At archive time: (a) §Workstream Roll-up + §Path Forward sections
  remain in the archived plan as historical record of how the program
  reached completion; (b) §Emergent Observations entries that have NOT
  graduated by archive time migrate to `.agent/memory/operational/pending-graduations.md`
  with their original promotion triggers preserved; (c) §Plan
  Refinement Log preserves the full R0 → R1 → R1.1 → R1.2 → … audit
  trail; (d) durable substance (the doctrine that the program codified)
  lives in the PDRs / ADRs / patterns referenced by each WS row, NOT
  in this plan body — the plan body is the *coordination substrate*
  for landing that doctrine, not the doctrine itself. Future readers
  looking for the doctrine read the PDRs / ADRs / patterns; readers
  looking for the *path that landed the doctrine* read the archived
  plan.
- **Refinement touch point**: when the plan drifts (a worked instance
  appears that the plan doesn't reflect; a status changes; a new
  workstream candidate emerges), the next agent who notices files a
  refinement entry in §Plan Refinement Log and edits the relevant
  sections. Refinement is normal; staleness is the failure mode.

## Risks

1. **Recursion-of-doctrine** — this plan itself could become another
   instance of the pattern it's trying to track. Mitigation: the plan
   tracks artefacts that already exist (LANDED / DRAFT-IN-FLIGHT /
   EMPIRICAL), not speculative future doctrine. WS-6, WS-8, WS-11 are
   the only workstreams authorising new substrate, all gated on
   existing worked-instance evidence or explicit owner direction.
   §Emergent Observations adds substrate candidates with explicit
   promotion triggers — the section itself doesn't graduate anything.
2. **Substrate-pointer-read on this plan** — future agents reading
   this plan in a snapshot moment may not realise WS rows can land
   between reads. Mitigation: every WS row carries a commit SHA when
   landed; absence of SHA means "not landed yet, check live state"; the
   Plan Refinement Log records when the snapshot was last refreshed.
3. **M1 attestation flake** — **MITIGATED 2026-05-24 (R2)**. Original
   risk: M1 gates are checkable but require the next agent to actually
   read them. Worked-instance evidence in R2 §Emergent Observations E7
   shows the risk fired in-session (Director read plan enumeration not
   live artefacts). Structural cure landed in R2 §Roles + triggers
   "Verification primitive (R1.7 fold)" — M1 Gate Monitor MUST verify
   gate state against actual artefacts. Risk re-classifies from
   detection-reliant to cure-reliant; re-fires only if verification
   primitive is not applied by next M1 Gate Monitor (a different,
   smaller failure mode).
4. **Citation-policy reconciliation (E4) blocking WS-11 indefinitely** —
   **RESOLVED 2026-05-24 (R1.5)** via PDR/ADR portability distinction
   (PDR-078 SHA-free + ADR-186 SHAs/UUIDs allowed). Original tension
   dissolved; WS-11 bundle authoring path is clear; carries forward to
   companion plan cycles 6–8.
5. **PR #108 cure-claim execution stall** — **RESOLVED 2026-05-24**
   via PR merge. PR #108 MERGED at `2026-05-24T20:06:12Z` via merge
   commit `2462952a957c69d4c614ddb95eb880c105839c1e`. Cure cycles
   landed in bundle `340752bb` + hygiene tail; original Scorched
   re-engagement risk superseded by owner-directed bundle-and-merge
   path. WS-7 closed.
6. **Plan refinement drift between current rev and next-rev** — this
   plan captures state at the latest entry in §Plan Refinement Log
   (currently R1.2, 2026-05-24). State will continue to shift under
   team activity. Risk: future agents read the snapshot as canonical
   without recognising it as a snapshot. Mitigation: the most-recent
   Plan Refinement Log header date is the read-date marker. Any agent
   detecting drift between the latest entry's claims and live state
   files a new refinement entry per §Plan Refinement Log discipline
   rather than acting on the stale snapshot. This is the substrate-
   pointer-read pattern (WS-5) applied to this plan body. R1.2 itself
   is an instance of this discipline working — docs-adr-expert + code-
   expert review caught state drift between R1's "no active cure-claim
   retained" claim and the actual active-claims state, producing R1.2's
   corrected WS-7 reading.

## Readiness Reviewers

Not invoking specialist reviewers on plan-author boundary for R1 —
this is a roll-up tracking plan describing existing substrate, not a
plan authorising new architectural work. Each WS authorises its own
reviewer set under its own discipline (e.g., WS-6's PDR-077 is going
through `docs-adr-expert` + Twilit ST tick-#1-named cure-gaps;
WS-7 had pre-pause 4-way fan-out under Scorched's window; WS-11
had pre-pause 5-reviewer convergence on bundle shape).

R1 refinement is **accuracy restoration**, not new architectural
authorisation. The 6-subagent ground-truth fan-out that grounded R1
counts as evidence-gathering, not authorisation review.

If owner directs reviewer dispatch on this plan body itself (e.g., on
the new §Path Forward dependency-ordering or the new §Emergent
Observations promotion-trigger framing), the expected set is
`assumptions-expert` (proportionality of the path-forward
sequencing + promotion-trigger shape) and Director Seaworthy as
routing arbiter.

R1.2 specifically: docs-adr-expert + code-expert reviewed and returned
GO-WITH-CONDITIONS. 15 + 6 findings absorbed across CRITICAL (2),
IMPORTANT (8), and NIT (5) severities. See §Plan Refinement Log R1.2
entry for the absorption list.
