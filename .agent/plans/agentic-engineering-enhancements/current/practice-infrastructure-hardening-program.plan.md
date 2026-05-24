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

**Last Updated**: 2026-05-24 (refinement R1.1 — M1/M2 milestone framing)
**Status**: SEQUENCE-LIVE — racing toward **M1 — Safe-Pause Milestone**.
M1 gates 3 + 4 MET; gates 1, 2, 5 PENDING. M1 reachable when WS-7 cure
lands + WS-2 partition-cure verdict surfaces + queue items (WS-11
bundle, PDR-077, Cycle #5/#6) each land-or-stand-down. M2 (Completion)
is open-ended; M2-pursuit work deferred until M1 reached.
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

The mechanism by which the End Goal is reached. **Not the End Goal
itself** — the thesis is the testable claim that the proposed cures
produce the named impact.

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
- **Mistbound Hiding Threshold**: 4 cycles in a 22-min marshal window
  (2026-05-23 16:02:22Z – 16:18:11Z), including husky 90-task gate-
  chains. Second worked instance; thesis confirmation evidence.
  PDR-077 candidate trigger fires on this 2nd instance.

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
- **§Safe-Pause Criteria** — the M1 gates (renamed for terminology
  clarity).
- **§Completion Criteria** — the M2 gates.
- **§Path Forward** — sequenced for M1 first.

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
| WS-2 | PDR-076 v2 Agent identity tuple + body-file frontmatter | **LANDED** `db4d8b3a`; **OWNER-VERDICT-RECEIVED 2026-05-24: SPLIT confirmed** — Ferny authors PDR-076a (identity tuple) + PDR-076b (body-file frontmatter) via Cycle #6; Cascade §2 body-file-adjacency overlap with §5 cured by partition | PDR-076a + PDR-076b both land via Cycle #6 marshal-cycle |
| WS-3 | ADR-185 v2 comms-event auto-acceptance metadata | **LANDED** `5320d6b0` | Renderer wiring (separate executable plan) |
| WS-4 | Recursion-of-doctrine pattern | **LANDED** `c097bbb3` | PDR promotion on 2nd cross-session instance |
| WS-5 | substrate-pointer-read-as-current-state pattern v2 | **LANDED** `8a99ed35` (Mistbound Cycle #2) — 6 instances D1–D6 absorbed; Wilma SAFE-WITH-CONDITIONS verdict folded | (closed) — 3 unexposed edge cases tracked as v3 candidates in pending-graduations |
| WS-6 | Marshal-as-cycle-discipline (PDR-077) | **DRAFT-IN-FLIGHT, REVIEW-CONVERGED** — Charcoal authored draft in `/tmp` at 16:14:10Z; **3 review rounds complete** (R1 docs-adr-expert; R2 3-way assumptions+wilma+betty; R3 3-way re-engagements + final docs-adr-expert GO on marshal-request with citation-discipline clean); 7 R3 SHOULD-ABSORB items + 1 Director-verdict item pending Charcoal re-engagement → marshal-request. Review-trail in `/tmp/charcoal-pdr077-postresume-fanout-synthesis.md` (session-local; not durable substrate). **2nd worked instance now in evidence** (Mistbound 4-commits ~14 min by git author timestamps; handoff §4 stated 22 min). | PDR-077 lands with role definition + cycle protocol + gate-singleton invariant + throughput observation + standing-duty intersection + PDR-063/PDR-064 cross-references |
| WS-7 | PR #108 SonarCloud + CodeQL clearance | **PENDING (CLAIMED, AWAITING EXECUTION)** — PR #108 OPEN/MERGEABLE; CodeQL PASSING; SonarCloud + run-quality-gates FAILING. Scorched author claim `4e6e18b2` ACTIVE (R2 mechanical Sonar cures on 4 files in graph-ingest + sdks, claimed 19:07:14Z); Mistbound marshal claim `00375e07` ACTIVE (claimed 19:33:07Z). Owner-directed 'hygiene-then-push' verdict not yet executed; awaiting Scorched re-engagement | PR #108 SonarCloud + run-quality-gates flip GREEN and merge becomes possible |
| WS-8 | Claude self-modification authz cure-shape ratification | **AUTHOR-IN-FLIGHT** (Lanternlit, owner-directed 2026-05-24 'Author it now') — Shape verdict: C2-near-term + C5-long-term + C4-fallback with C2-deferred-until-platform-support. Authoring NOW: ADR codifying the shape + the C2-platform-deferred trigger | ADR drafted + reviewer-converged + marshal-landed |
| WS-9 | Twilit ST FM-2 P2 plan-Wilma verdict + cure | **LANDED** `43e09287` (Mistbound Cycle #1) — watcher-staleness consumer + CollaborationAgentId schema dedupe; knip RED→GREEN | (closed) |
| WS-10 | Heartbeat contract durable mechanism | **NOT-M1-GATED, PENDING** — INTERIM live (`narrative` comms event with `tags: ["heartbeat"]` per ADR-183). Durable substrate = 3 sub-components: (a) `last_heartbeat_at` schema field; (b) `pnpm agent-tools:heartbeat` CLI wrapper (shape spec'd by Mistbound R1.4 contribution — see WS-10 frontmatter for full shape); (c) lifecycle.event_type='heartbeat' per pending ADR-186. Per-beat `--lane` + `--focus` MUST come from agent each call, NOT be cached (silent-staleness anti-pattern). | Schema field + CLI wrapper + claim auto-rebalance protocol shipped |
| WS-11 | Heartbeat doctrine bundle (PDR-078 + ADR-186 + thin SKILL) | **PENDING (BUNDLE-SHAPE-RATIFIED, E4 RESOLVED)** — Lanternlit; 5-reviewer convergence on RE-SHAPE; E4 RESOLVED via PDR/ADR portability distinction (R1.5 2026-05-24): PDR-078 SHA-free portable principle; ADR-186 SHAs/UUIDs allowed as repo-bound phenotype. Authoring ready. | PDR-078 (SHA-free) + ADR-186 (SHAs OK) + thin SKILL + reciprocal §Related amendments authored + round-2 reviewer convergence + owner ratification + marshal-landed |

| WS-12 | PDR-079 PDR-vs-ADR portability distinction (NEW R1.5) | **AUTHOR-IN-FLIGHT** — Lanternlit (owner-directed 2026-05-24). New PDR codifying owner-articulated portability constraint (PDRs portable, no SHAs; ADRs repo-bound, SHAs allowed; SHA-in-PDR = misclassification signal). Co-cure: scope `no-moving-targets` rule strictly to portable surfaces (PDRs + rules + patterns), not ADRs. | PDR-079 + rule scope-update authored + reviewer-converged + marshal-landed |

**Post-WS commits since `ccc47de2`** (recorded for branch hygiene, not
WS-changing; newest-first ordering matches `git log`): `5fedf9a4`
(ink-testing-library TUI test refactor) ← HEAD; `82afc0a8`
(reduceRefreshState controller wire); `62def8d3` (reduceRefreshState
pure unit tests). Current branch HEAD: `5fedf9a4`.

## M1 — Safe-Pause Milestone Criteria

**M1 is the near-term target.** When all 5 gates hold, the **Safe-Pause
Attestation** broadcasts and the team pivots focus to EEF First Feature
delivery. M1 means: pivot-ready, no stranded work, EEF-merge-blocking
substrate cleared.

Each gate carries a current MET / PENDING marker.

### Gate 1 — WS-7 GREEN — **PENDING (CLAIMED, AWAITING EXECUTION)**

PR #108 quality gate clears. PR #108 is the substrate-blocker for the
EEF merge path; pausing with it still red strands all EEF graph-substrate
work behind a closed merge gate.

*Current state*: PR #108 OPEN, MERGEABLE. CodeQL PASSING. SonarCloud
and run-quality-gates FAILING. **ACTIVE CLAIMS HELD**: Scorched
Tempering Kiln author claim `4e6e18b2` (opened 2026-05-23 19:07:14Z,
R2 mechanical Sonar cures on 4 files: `eef-evidence-grounded-lesson-plan-messages.ts`,
`graph-corpus-sdk/src/index.ts`, `graph-ingest/src/source-path/index.ts`,
`graph-ingest/src/turtle/index.ts`); Mistbound Hiding Threshold marshal
claim `00375e07` (opened 19:33:07Z). The work IS owned end-to-end.
Owner-directed via Seaworthy tick #2 19:28:47Z: "commit hygiene tranche
then push" — verdict not yet executed.

*What closes it*: Scorched re-engages → executes the R2 cure (S7735
ternary flip + S7763 export-from collapse + S7781×4 replaceAll + S7750
findLast per claim intent) + commit-hygiene tranche → marshal-cycles
via Mistbound → push → gates flip GREEN.

### Gate 2 — WS-2 SPLIT children land — **PENDING (OWNER-VERDICT RECEIVED, AWAITING FERNY EXECUTION)**

Owner verdicted SPLIT (R1.5 2026-05-24): PDR-076a (identity tuple) +
PDR-076b (body-file frontmatter) both land via Cycle #6.

*Current state*: Owner verdict received and recorded R1.5
(2026-05-24). Ferny's partition prestage at
`/tmp/ferny-ws2-partition-prestage-synthesis.md` is 3-way-fan-out-
converged with paste-ready blocks for both child PDRs. Cascade §2
body-file-adjacency overlap with §5 cured by partition shape. Cycle #6
unblocked; awaiting Ferny re-engagement to author both child PDRs.

*What closes it*: Ferny resumes Cycle #6 → authors PDR-076a + PDR-076b
from prestage blocks → marshal-cycle via Mistbound → both land →
landed PDR-076 v2's open-decision marker is removed (or PDR-076 is
archived if SPLIT children fully supersede). **Stand-down authority**:
Owner (if WS-2 SPLIT itself is to be parked, which is now contrary to
the verdict; full stand-down requires owner re-direction).

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

### Gate 5 — All marshal-queued cure-bundles land or stand down — **PARTIALLY MET, PENDING**

*Current queue state* (per Mistbound's compaction handoff §8 +
post-handoff observation):

- **Mistbound's 4-cycle marshal arc** (`43e09287` / `8a99ed35` /
  `499d163b` / `ccc47de2`): **LANDED**. Closed.
- **WS-11 heartbeat doctrine bundle** (Lanternlit): **IN-FLIGHT** —
  PDR-078 + ADR-186 + thin SKILL bundle not yet authored; uncommitted
  SKILL §0.5 fat-draft in working tree (Director-gated). Bundle shape
  ratified by 5-reviewer convergence; Fred-vs-owner-verdict tension on
  citation cure path unresolved.
- **Queue-Cycle #5** (Cycle #1 verdict-absorption compound: Charcoal
  F2/F3/F5 + Betty CONDITION + 2 code-expert findings + META API-shape
  drift): awaiting any-implementer pickup (hat-switch dissolved per
  Twilit ST tick #3 fred citation).
- **Queue-Cycle #6** (WS-2 SPLIT): **BLOCKED-ON-OWNER-VERDICT** (see
  Gate 2).
- **PDR-077** (Charcoal's WS-6 doctrine home): **DRAFT-IN-FLIGHT,
  REVIEW-CONVERGED** — draft in `/tmp`; 3 review rounds complete
  (final docs-adr-expert GO with citation-discipline clean); 7 R3
  SHOULD-ABSORB items + 1 Director-verdict item pending Charcoal
  re-engagement → marshal-request.
- **PR #108 cure** (WS-7): **CLAIMED, AWAITING EXECUTION** — Scorched
  author claim `4e6e18b2` + Mistbound marshal claim `00375e07` both
  active; awaiting Scorched re-engagement.
- **Marshal hygiene cycle** (per Mistbound handoff §8 6th queue
  entry — was missing from R1 enumeration): **PENDING** — accumulated
  working-tree state from second-wave reviewer dispatch + credit-pause
  peer activity + R1+R1.1+R1.2 plan edits + comms-seen files + comms
  events + memory drift. Marshal performs hygiene cycle on next
  tree-green window per `feedback_marshal_queues_comms_and_memory_state`
  standing duty.
- **Queue-Cycle #7** (C-12 dedupe follow-up — pre-existing duplicate
  private `agentIdSchema` in two files): NON-BLOCKING; deferred to
  natural follow-on cycle.

Note on Cycle terminology: "Mistbound Cycle #N" refers to commits
landed in Mistbound's marshal arc (the 4-cycle arc above);
"Queue-Cycle #N" refers to pending items in this queue. Disambiguated
in R1.2 to avoid overload.

*What closes it*: each queue entry either lands (marshal cycle) or is
explicitly stood down (handoff record + comms broadcast) so the next
session does not inherit ghost-queue. Owner direction can also stand
items down explicitly (e.g., "park PDR-077 until next session" with
named trigger).

### Roll-up

| Gate | State | Evidence |
|------|-------|----------|
| 1 — WS-7 GREEN | **PENDING (CLAIMED)** | PR #108 gates still red; Scorched `4e6e18b2` + Mistbound `00375e07` claims active; awaiting execution |
| 2 — WS-2 owner-decision | **PENDING (BLOCKED)** | Partition-cure shape needs owner sight |
| 3 — WS-5 pattern landed | **MET ✅** | `8a99ed35` |
| 4 — WS-9 verdict + cure | **MET ✅** | `43e09287` + Wilma verdict |
| 5 — Queued bundles closed | **PARTIALLY MET** | Mistbound arc landed; WS-11 + Cycle #5 + Cycle #6 + PDR-077 + WS-7 cure all in-flight or blocked |

Each gate is a strand. Cutting any of them mid-flight produces recovery
cost in the next session. Holding all five is the bar for "safe pivot
to EEF without leaving knot-ends".

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

### Criterion 5 — Observable next-window evidence — **NOT YET TESTED**

The next team window applies the substrate and either (a) produces no
new substrate-stale-pointer instances OR (b) produces a new cure-shape
that the program absorbs as a new workstream.

*Current state*: requires team to return post-Safe-Pause-pivot. Cannot
be tested until Safe-Pause holds and the next session opens.

### Roll-up

| Criterion | State | Evidence / Next |
|-----------|-------|-----------------|
| 1 — Safe-Pause held | **PENDING** | 2 of 5 gates MET |
| 2 — WS-6 PDR-077 landed | **DRAFT-IN-FLIGHT** | Awaiting Charcoal re-engagement |
| 3 — WS-8 ADR-or-deferral landed | **CODIFICATION-PENDING** | Owner shape-verdict received; author unassigned |
| 4 — WS-11 bundle landed | **PENDING** | Bundle shape ratified; authoring blocked on citation-cure tension |
| 5 — Next-window evidence | **NOT YET TESTED** | Requires post-pivot session |

Completion is observable, not ceremonial: the next team window runs
faster and produces less doctrine debt. If it does not, the program
has not completed and a follow-on cure-shape is required.

## Path Forward — the M1-focused sequence

This section answers the question owner posed in R1: "where we are
going, and the precise path between" current state and the next
milestone.

**The next milestone is M1 — Safe-Pause.** M2-pursuit work is
deferred until M1 holds. Every action in this section is tagged
**M1-CRITICAL** (must close to reach M1), **M1-INCIDENTAL** (closes a
queue entry on Gate 5; stand-down is acceptable cure), or
**M2-PURSUIT** (does not feed M1; deferred unless owner directs
otherwise).

### Phase 1 — M1-CRITICAL items (the only must-do work for the next milestone)

**P1.B1 — Fresh PR #108 cure-claim — M1-CRITICAL → Gate 1**

- Status: UNASSIGNED. Scorched's pre-pause R2 retained-claim path
  lapsed; no active claim. PR #108 SonarCloud + run-quality-gates
  RED.
- Action: any-implementer opens new claim on PR #108 cure path;
  executes R2 mechanical Sonar findings cure; commit-hygiene tranche
  per owner's tick #2 verdict ("commit hygiene tranche then push");
  push.
- Owner direction: Seaworthy tick #2 19:28:47Z — "commit hygiene
  tranche then push". Direction stands.
- Prerequisite: implementer with capacity. Candidates: Scorched
  re-engagement; any other implementer per hat-switch-dissolved
  direction. **If no implementer is assignable this session, the item
  must be explicitly stood down (handoff record + comms broadcast) so
  the next session does not inherit ghost-queue.**
- Unlocks: **Gate 1 MET** + EEF merge-path GREEN.

**P1.C1 — Owner WS-2 partition-cure verdict — M1-CRITICAL → Gate 2**

- Status: owner-decision-gated; cannot be done by team alone.
- Action: owner reads Ferny's `/tmp/ferny-ws2-partition-prestage-synthesis.md`
  partition-cure section; verdicts on the §Cascade item 2 vs item 5
  body-file-adjacency boundary; either ratifies single-PDR shape (and
  the open-decision marker on landed PDR-076 is removed) OR confirms
  SPLIT direction.
- Prerequisite: owner attention to Ferny's prestage.
- Unlocks: **Gate 2 MET** + (if SPLIT) Ferny resumes Cycle #6 →
  PDR-076a + PDR-076b authored and landed.

**P1.Gate5 — Queue closure (each entry lands OR explicitly stands down) — M1-CRITICAL → Gate 5**

- Status: 5 queue entries open (WS-11 bundle, PDR-077, Cycle #5,
  Cycle #6, PR #108 cure). Each entry must reach a terminal state
  (landed OR explicit stand-down) for Gate 5 to close.
- Action: for each queue entry, the responsible agent either lands or
  emits an explicit stand-down comms broadcast with a named resumption
  trigger. Stand-down records go to a handoff file so the next session
  inherits clean queue state, not ghost-queue.
- **Minimum-cost M1 path: stand-down is acceptable cure for every
  queue entry except Gate 1 (PR #108 cure must land or M1 cannot
  attest).**
- Unlocks: **Gate 5 MET**.

### Phase 2 — M1-INCIDENTAL items (land-or-stand-down branching)

Each item below closes a queue entry on Gate 5 either way. Landing
*also* feeds M2; stand-down is faster to M1. The branch is owner-
or-Director-routed per item.

**P2.A1 — Lanternlit Listening Dusk → WS-11 heartbeat doctrine bundle**

- M1 contribution: closes one Gate 5 queue entry (whether by landing
  OR stand-down).
- M2 contribution: landing feeds Completion Criterion 4.
- LAND path (heavier): resolve E4 citation tension → author PDR-078 +
  ADR-186 + thin SKILL + reciprocal §Related amendments → round-2
  reviewer fan-out → owner review → marshal-request to Mistbound.
- STAND-DOWN path (cheaper for M1): emit explicit stand-down broadcast
  with "resume on E4 resolution + next-session pickup" trigger; archive
  SKILL §0.5 fat-draft as pending-graduations candidate.
- **Prerequisite for LAND path: E4 citation-policy reconciliation
  must resolve first** (see §Emergent Observations).
- Recommendation: **STAND-DOWN if E4 doesn't resolve quickly**; the
  cheapest M1 path. Landing is preferable only if E4 resolves cheaply
  and the team has capacity.

**P2.A2 — Charcoal Brazing Kiln → WS-6 PDR-077 finalisation**

- M1 contribution: closes one Gate 5 queue entry.
- M2 contribution: landing feeds Completion Criterion 2.
- LAND path: Charcoal re-engages, absorbs docs-adr-expert review +
  Twilit ST tick #1 must-cure gaps, marshal-cycles into the tree.
- STAND-DOWN path: emit explicit stand-down broadcast with
  "resume on Charcoal re-engagement OR next-session pickup" trigger;
  PDR-077 draft remains in `/tmp` as evidence of prior work.
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

### Phase 3 — M1 attestation + EEF pivot

**P3.E1 — Director (Seaworthy) → Safe-Pause Attestation broadcast**

- Trigger: all 5 M1 gates MET (Gates 3 + 4 already MET; Gates 1, 2,
  5 pending).
- Action: Director broadcasts Safe-Pause Attestation with gate-by-gate
  evidence (commit SHAs for landed gates; owner-decision evidence for
  verdict gates; explicit-deferral records for stood-down items).
- Unlocks: **M1 reached.** Team pivots to EEF First Feature lane.

**P3.E2 — Team → EEF post-pivot execution**

See §Relationship to EEF First Feature Delivery for lane-by-lane
state and next-actions (WS4.5 unblocked, t2-zod-loader ready, WS2.3
parser-integration clean pickup, etc.).

### Phase 4 — M2-PURSUIT items (DEFERRED until post-M1 unless owner directs otherwise)

These items do NOT feed M1. They feed M2 (Completion Milestone) only.
**Do not let them crowd into the M1 critical path.**

**P4.C2 — WS-8 ADR-or-deferral codification — M2-PURSUIT → Criterion 3**

- Status: owner shape-verdict received (ratify C2+C5+C4 with
  C2-deferred-until-platform-support). Codification not yet authored.
- Action: assign author for ADR-or-deferral record. Author drafts.
  Reviewer fan-out. Marshal-request.
- Defer rationale: codification can land post-M1 without stranding any
  work; the owner verdict is already recorded in comms substrate
  (Seaworthy tick #2). The codification turns substrate-record into
  durable doctrine but is not blocking EEF pivot.

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
| t12 citation-shape Zod types | **LANDED** | rolled into `3241893d` umbrella |
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

### E4 — Citation-policy reconciliation between owner verdict and architectural verdict

*Evidence*: Q3 (ADR-186 hook-blocker citation cure) generated
contradicting verdicts within hours:

- Owner verdict via Seaworthy tick #2 (2026-05-23 19:28:47Z):
  "revise citation style to use event-ids".
- Architecture-expert-fred post-pause verdict: "descriptive citation
  only; permanent → ephemeral forbidden per `.agent/rules/no-moving-targets-in-permanent-docs.md`
  §Citation Directionality. The hook is correctly tuned. A registry
  or auto-acceptance-metadata structural alternative re-introduces
  the forbidden direction behind an abstraction. Use the
  `(historical reference)` escape-hatch for the few places audit-trail
  citation has substantive value."

*Substantive question*: does the project want
(a) descriptive-only,
(b) full event-UUID-with-hyphens (which evade the hook regex but
violate the rule's substantive doctrine per Fred), or
(c) a hybrid (descriptive default + `(historical reference)` marker for
audit-cite-warranted spots)?

*Graduation-target*: explicit reconciliation either by owner amending
the rule, or by recording the resolution in an ADR / rule update so
future bundle authoring has a single source of truth.

*Promotion trigger*: this question MUST resolve before WS-11 bundle
authoring can resume. Once resolved, the resolution either ratifies
the rule as-is (and Fred's verdict stands) or amends it (in which case
the rule needs an update). Either path closes E4 inline; this
observation is a *pre-condition* for WS-11 progress, not a
follow-on graduation.

### E5 — Gatekeeper-specialisation (multi-writer commit-marshal discipline)

*Evidence*: Memory entry `feedback_gatekeeper_specialisation`
(graduated 2026-05-22) named the observation that in multi-agent
windows, ONLY one agent runs full pre-commit gates; others queue
commit-intents and the gatekeeper validates the shared tree once per
round. No new worked-instance evidence accumulated this session.

*Graduation-target*: already in feedback memory; may need PDR if it
becomes a Practice Core surface (vs current feedback-rule-shape).

*Promotion trigger*: 3rd worked-instance with novel coordination
shape, OR owner direction to elevate. Currently rule-shape; no
elevation pressure.

### E6 — Marshal-as-cycle-discipline 2nd instance evidence in flight

*Evidence*: Mistbound's 4-cycle marshal arc (`43e09287` / `8a99ed35`
/ `499d163b` / `ccc47de2`) landed 16:02:22Z → 16:18:11Z (22 minutes
including husky 90-task gate-chains, ~5.5 min/cycle). This is the
SECOND worked instance of marshal-as-cycle-discipline (first: Ashen's
9-cycles-in-45-min) and EXCEEDS the original throughput in
cycles-per-minute. PDR-077 trigger fired.

*Graduation-target*: PDR-077 (Charcoal authoring; see WS-6).

*Promotion trigger*: ALREADY FIRED. PDR-077 draft in `/tmp` awaiting
Charcoal re-engagement. Tracked via WS-6, not a separate workstream.

## Ideas to be integrated into the plan

Candidate ideas surfaced during execution but not yet absorbed into a
workstream, milestone, or emergent-observation. Each entry names the
shape and the load-bearing constraint that must survive integration; the
integration decision (which workstream / milestone / new section) is
deferred to the next plan-refinement pass.

### Heartbeat convenience command (`pnpm agent-tools:heartbeat`)

*Source*: Mistbound session 0e27cc, 2026-05-24 owner direction following
multiple hand-rolled heartbeat loops across this session (Mistbound,
Scorched, Fronded, Ferny, Charcoal) all reimplementing the same
boilerplate, plus my own loop emitting `heartbeat-FAIL` for hours due to
CLI flag drift (`--kind` / `--tags` not accepted on `comms append`).

*Shape*: a single CLI that absorbs the static portion of the heartbeat
contract:

- identity tuple resolution from `PRACTICE_AGENT_SESSION_ID_*`
- subject template (`Heartbeat: <agent_name> (<prefix>) — <lane>`)
- body prefix (`active; <focus>`)
- tag wiring (`["heartbeat"]`)
- `comms append` plumbing (`--now`, `--created-at`, `--active`, dirs)

Indicative invocation:

```bash
pnpm agent-tools:heartbeat --lane marshal --focus "R2 cycle: queueing intent"
```

*Load-bearing constraint that must survive integration*: the per-beat
`lane` + `focus` strings MUST come from the agent on each invocation,
NOT be cached at cron startup. A cron loop that hardcodes a single focus
string at startup and keeps repeating it degrades into "agent technically
alive but reporting stale state" — worse than no heartbeat because it
gives false confidence in the substrate stream. This is the same failure
mode as substrate-pointer-read-as-current-state. The CLI removes the
boilerplate burden but the agent retains responsibility for cadence
(platform-specific background-task primitive) and per-beat content.

*What this idea does NOT solve*: silent staleness if the agent invokes
the same `--focus` repeatedly without updating. That is a discipline
issue, not a tooling one — the convenience just stops the static
boilerplate from being hand-rolled (and mis-flagged).

*Candidate integration sites*: WS-3 (agent-tools CLI surface hardening)
or a new dedicated workstream under the Practice Infrastructure
umbrella. Decision deferred to next refinement pass.

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
- **Owner-decision touch point**: outstanding owner decisions per R1
  refresh — WS-2 partition-cure verdict (Gate 2), WS-8 codification
  author assignment (Criterion 3), E4 citation-policy reconciliation
  (Path Forward A1 prerequisite), Safe-Pause GO. The plan is
  surfaced to owner at each.
- **Archive touch point**: when Completion gate holds, this plan
  moves to `archive/completed/` and its substance is mined to the
  permanent doctrine homes (PDRs / ADRs / patterns) referenced above.
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
3. **M1 attestation flake** — M1 (Safe-Pause) gates are checkable but
   require the next agent to actually read them. Mitigation: Lifecycle
   Trigger at session-open points all `agentic-engineering-enhancements`
   sessions at the Workstream Roll-up + M1 Criteria + Path Forward
   sections. R1 added per-gate MET / PENDING markers so the read is
   single-glance. R1.1 added explicit M1/M2 priority asymmetry so the
   reader cannot confuse M2-pursuit work with M1-blocking work.
4. **Citation-policy reconciliation (E4) blocking WS-11 indefinitely** —
   the Fred-vs-owner-verdict tension on ADR-186 cure path must resolve
   before WS-11 bundle authoring can resume. If left unresolved, WS-11
   stalls indefinitely, blocking Completion Criterion 4 + contributing
   to Safe-Pause Gate 5 staying open. Mitigation: surface tension to
   Seaworthy + owner explicitly as part of Path Forward A1
   prerequisite; do not silently choose one verdict.
5. **PR #108 cure-claim void** — WS-7's cure-claim path has lapsed
   (Scorched's R2 retained-claim is no longer in active-claims); no
   implementer is currently committed to executing the owner-directed
   hygiene-then-push. Risk: Gate 1 remains PENDING indefinitely while
   the team waits for self-organisation. Mitigation: surface the void
   to Director Seaworthy with explicit "assign or stand-down" framing;
   if no implementer is assignable this session, explicitly stand the
   item down and record in handoff so the next session opens with
   clean queue, not ghost-queue.
6. **Plan refinement drift between R1 and next-rev** — this plan
   captures state at R1 (2026-05-24). State will continue to shift
   under team activity. Risk: future agents read R1 as canonical
   without recognising it as a snapshot. Mitigation: the Plan
   Refinement Log header date is the read-date marker. Any agent
   detecting drift between R1's claims and live state files a new R2
   entry rather than acting on the stale snapshot. This is the
   substrate-pointer-read pattern (WS-5) applied to this plan body.

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

If owner directs reviewer dispatch on this plan body itself, the
expected set is `assumptions-expert` (proportionality of the
program-plan shape and Safe-Pause criteria) and the incoming Director
(Seaworthy) as routing arbiter.
