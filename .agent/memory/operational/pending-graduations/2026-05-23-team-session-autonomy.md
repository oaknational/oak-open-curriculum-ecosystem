---
surface_kind: pending-graduations-recovery-file
created_on: 2026-05-24
source_register: ../pending-graduations.md
source_window: 2026-05-23 first-out closeout and autonomy primitives
status: active
archive_status: not-archived
recovery_status: active
---

# 2026-05-23 Team-Session Autonomy Pending Queue

This legacy recovery file carries unprocessed pending-graduations entries relocated
from the main register on 2026-05-24. The move is a split, not an archive:
every entry below remains live queue substance until its target home lands or
its trigger is explicitly withdrawn.

The main register keeps a compact pointer so agents can start there without
loading this whole cluster by default.

## 2026-05-23 first-out closeout — multi-agent team-session pattern surfacings (Secret Vanishing Wisp / `981cbe`)

Five new candidate entries captured at first-out closeout of the 2026-05-22
→ 2026-05-23 multi-agent gate-1a substrate-floor team session. Two
co-occurring observations (failure-mode + cure-shape) on the commit-queue
ceremony; one observed-and-cured-in-session collaboration pattern with
strong empirical evidence; one recurring untracked-WIP failure mode; one
cross-cycle architectural-excellence pattern.

### Autonomy substrate gap: first-out-closeout-owner self-election protocol when no closeout owner declared at team-start

`[CANDIDATE: first-out-closeout-owner-self-election-protocol | captured: 2026-05-23 | source: napkin+comms-log+owner-direction | target: doc-amend:.agent/skills/start-right-team/SKILL-CANONICAL.md | trigger: candidate | size: M | status: pending]`

Owner correction at 06:54Z + 06:57Z (codified to per-user memory as
`feedback_owner_action_is_not_a_cure`): *"owner action is not a valid
cure for anything, we are working towards agent autonomy here, and
for now user resolution is sometimes required, but it is not the end
goal."* Every observation of the form *"X failed → owner directed Y →
Y worked → therefore Y is the cure"* points instead at *"X failed →
autonomy substrate did not provide the primitive that would have
produced Y → owner bridged the gap → the bridge itself indicates the
missing autonomy primitive."*

**Worked instance from this session**: the 2026-05-22 → 2026-05-23
team session ran with NO closeout owner declared at team-start. As
the team wound down (Foamy paused; Sparking session-complete; Velvet
idle; Stormbounds silent then briefly active), there was no agent-
readable mechanism for the team to self-elect a first-out closeout
owner. Owner intervention named me (SVW) as the first-out closeout
owner. That naming was the bridge over a missing autonomy primitive.

**The missing primitive** (graduation-target): an amendment to
`start-right-team` §Closeout Contract giving agents a clear protocol
for self-electing the first-out closeout owner when none was named
at team-start. Candidate shapes for the SKILL amendment (do not pick
prematurely; the right shape needs design work):

1. **Broadcast-arrival precedence**: the first agent to announce
   intent-to-close in comms holds the first-out role (with tie-breaking).
2. **Pre-handoff-synthesis precedence**: the agent whose
   pre-handoff-synthesis broadcast has the earliest `created_at`
   timestamp self-elects once N team members have also posted
   pre-handoff syntheses. Builds on the empirical pre-handoff-
   syntheses pattern observed this session.
3. **Coordinator-poll**: if a coordinator was named at team-start,
   they retain closeout-owner naming authority on stand-down; if
   none, fall back to a precedence rule.
4. **Explicit at-team-start declaration**: amend `start-right-team`
   to require a tentative closeout owner be named in the team-start
   broadcasts (revisable at any time), removing the implicit-
   no-owner case entirely.

**Additional autonomy primitives** Stormbound Spiralling Breeze
surfaced in their amended closeout (also worth pending-graduations
entries; cross-link rather than duplicate if there are existing
register entries):

- **Coordinator-discovery for arriving agents** — query comms stream
  for active coordinator without owner naming names.
- **Standby-role defaults as first-class boundaries** —
  reviewer-dispatch / consolidation-observer / plan-file-only-follow-on
  as named roles arriving agents can self-select into without
  coordinator pairing.
- **Coordinator polling responsibility for unbriefed arriving
  agents** — active coordinator (if one exists) reads the comms
  stream for arriving-agent team-start broadcasts and routes them
  within bounded time.

These are all autonomy-substrate work-items. Stormbound's per-user
memory `feedback_owner_action_is_not_a_cure` is the standing
doctrine they discharge against.

### 2026-05-23 — SKILL amendment: Director ratification checklist + three-mode standby (start-right-team §3)

`[captured: 2026-05-23 | source: pattern-emergence | target: skill-amend:start-right-team | trigger: second-instance | size: M | status: pending]`

Substance summary: PDR-074 (Candidate, 2026-05-23) names a routing-moment
ratification checklist (6-7 per-moment + 4 periodic structural questions per
assumptions-expert finding 4 + 5) and a three-mode standby model
(silent / substrate-work / routed-slice) as the operational core of effective
directing. These belong on the active grounding layer for any agent holding the
Director role. The SKILL surface `start-right-team` §3 ("Choose Temporary
Responsibilities") is the natural home; it is already read at every
team-bootstrapping moment and at every Director handoff (PDR-064 Moment 2).

Cure shape: amend `start-right-team` §3 to embed (a) the routing-moment ratification questions verbatim from PDR-074 §"Routing-moment ratification checklist", (b) the four periodic structural questions (S1–S4), and (c) the three-mode standby model with holding-reason articulation as a Director obligation for any standby period >5 minutes. Cross-link to PDR-074 as substrate authority.

Why pending: PDR-074 is currently `Candidate`; second-instance evidence (a second multi-Director session ratifying the model in practice) is the natural promotion gate. The 2026-05-23 Seaworthy + Velvet + Seaworthy-acting windows are the first instance; a second window applying the checklist in real time strengthens the case from candidate → graduation-ready.

Falsifiability: a future Director session that ratifies decisions against the checklist and produces measurably tighter signal-to-noise / lower owner-attention split / lower busy-work output is the success shape. A session that finds the checklist unwieldy or its questions miscalibrated against real routing moments is the failure mode that revises the substance before graduation.

---

### 2026-05-23 — Rule pointer: director-ratification-checklist (active grounding layer)

`[captured: 2026-05-23 | source: pattern-emergence | target: rule:director-ratification-checklist | trigger: second-instance | size: S | status: pending]`

Substance summary: thin pointer rule at
`.agent/rules/director-ratification-checklist.md` that fires whenever an agent
holds the Director role, referencing the `start-right-team` SKILL §3 amendment
(sibling entry above) for the actual checklist + standby model body. Two-layer
pattern matches the existing estate: SKILL holds the substance, rule provides
the always-loaded trigger pointer.

Cure shape: single-paragraph rule file naming the trigger condition ("when this agent is acting Director — newly assigned, on handoff receipt, or for the duration of a held Director window") and pointing to the SKILL amendment for substance. No content duplication; pure routing surface.

Why pending: gated on (a) PDR-074 promotion from Candidate → Accepted and (b) the sibling SKILL amendment landing. The rule is meaningless without the SKILL substance to point at, so it must land second.

Falsifiability: a Director session that lands the rule first, finds the SKILL substance has drifted from the checklist text, and the rule pointer dangles is the failure mode. Coordinated landing (SKILL first, rule pointer second, both in the same consolidation pass) is the success shape.

---

### 2026-05-23 — Autonomy primitive P1: pre-positioned routing logic (rule + SKILL amendment)

`[captured: 2026-05-23 | source: pattern-emergence | target: multi:rule:pre-positioned-routing,skill-amend:start-right-team | trigger: second-instance | size: M | status: pending]`

Substance summary: PDR-074 §"Autonomy-tend obligation" P1 names pre-positioned routing as a Director obligation: every owner-decision-gated slice carries pre-positioned routing in the comms stream, contingent on verdict shape. Post-verdict moves become light-up of pre-existing intent, not re-think. This shrinks the owner-attention window from "decide + wait for routing + ratify routing" to "decide; routing already in place."

Worked instance: Velvet Dimming Shadow's Tranche C/B/A pre-positioning broadcast (2026-05-23 Director window) named the routing for each tranche before the owner verdict on tranche ordering arrived. When the verdict landed, agents lit up against the pre-positioned slots rather than re-evaluating.

Cure shape: (a) rule at `.agent/rules/pre-positioned-routing.md` naming the obligation and the failure mode (reactive post-verdict routing); (b) SKILL amendment to `start-right-team` §3 listing pre-positioning as one of the routing-moment ratification questions (already Q1 in PDR-074 §"Routing-moment ratification checklist"). The rule is the always-loaded trigger; the SKILL is the substance.

Why pending: one strong worked instance so far (Velvet's Tranche C/B/A). Second instance in a different Director window, with a different verdict-gated slice, confirms the primitive before formal graduation.

Falsifiability: a Director session where the owner decision arrives and the team scrambles to re-evaluate routing (rather than lighting up pre-positioned slots) is the failure mode. A session where the routing was pre-positioned and the verdict produced immediate light-up is the success shape.

---

### 2026-05-23 — Autonomy primitive P2: owner-decision-elision via substrate-resolution (rule-shaped)

`[captured: 2026-05-23 | source: pattern-emergence | target: rule:owner-decision-elision-via-substrate | trigger: second-instance | size: M | status: pending]`

Substance summary: PDR-074 §"Autonomy-tend obligation" P2 names a
first-ratification-question discipline: when a decision arrives at the Director
surface, the first question is *can the team resolve this via
reviewer-dispatch, sidebar, or vote?* If yes, route to substrate; only escalate
to owner with substrate-resolution-attempted-and-failed evidence. The primitive
shrinks the owner-action surface one decision at a time by tagging every
owner-decision arrival with a substrate-resolution check.

Complements per-user memory `feedback_no_question_when_answer_is_forced` (don't surface multiple-choice when analysis already determines the answer) and `feedback_owner_action_is_not_a_cure` (owner intervention is a stopgap, never the architectural goal). P2 names the active discipline that operationalises both: every owner-decision arrival is a candidate for substrate-resolution elision.

**Load-bearing constraint** (per architecture-expert-fred + assumptions-expert review): substrate-resolution is *attempted-and-evidenced*, not silent elision. When the team escalates, evidence-of-substrate-attempt-and-failure accompanies the escalation. This protects against silently skipping owner-decisions that genuinely require owner attention.

Cure shape: rule at `.agent/rules/owner-decision-elision-via-substrate.md` naming (a) the first-ratification-question wording, (b) the three substrate-resolution paths (reviewer-dispatch, sidebar, vote), (c) the substrate-attempted-and-failed evidence requirement when escalation is necessary. Sits adjacent to `feedback_no_question_when_answer_is_forced` and the no-cheap-cure / no-passback rule estate.

Why pending: PDR-074 is the first explicit naming; second-instance evidence (a Director session that visibly elides an owner-decision via substrate-resolution and the elision holds) is the promotion gate.

Falsifiability: a session where the Director escalates a decision to the owner that the team could have resolved via sidebar or reviewer-dispatch (and the owner says so) is the failure mode. A session that runs the substrate-resolution check and either elides successfully or escalates with substrate-attempted-and-failed evidence is the success shape.

---

### 2026-05-23 — Autonomy primitives P3 + P4: standing-direction graduation + slice-routing self-selection (multi-rule)

`[captured: 2026-05-23 | source: pattern-emergence | target: multi:rule:standing-direction-graduation,rule:slice-routing-self-selection | trigger: second-instance | size: M | status: pending]`

Substance summary: PDR-074 §"Autonomy-tend obligation" names two paired primitives that together shrink the owner-action surface at session boundaries and slice-opening moments:

- **P3 (standing-direction graduation)**: the Director actively identifies owner-direction substance worth graduating to standing rules at session close and routes the graduation work to an implementer — rather than waiting for the owner to manually trigger consolidation. Closes the loop between session-scoped direction (`feedback_owner_direction_scope` — direction is session-scoped unless explicitly standing) and the standing-rule estate.

- **P4 (slice-routing self-selection)**: when a slice opens, the Director broadcasts *slice + substrate authority + criteria for fit* and lets agents self-elect via comms with their own fit-assessment. The Director ratifies if multiple elect (first-broadcast convention) or if no one elects (escalate). Shrinks the Director-as-allocator bottleneck named in PDR-074 structural property D.

Partial worked-instance evidence: Clouded's transparent self-organisation broadcast (Velvet handoff §6.2) — agents self-electing into substrate work against Director-broadcast criteria.

Cure shape: two co-landing rules — `.agent/rules/standing-direction-graduation.md` (Director obligation at session-close) and `.agent/rules/slice-routing-self-selection.md` (broadcast-and-self-elect protocol for slice opening). Cross-link each other and PDR-074.

Why pending: P3 has no clear worked instance yet (no session has visibly run the graduation routing as a Director closeout move); P4 has partial evidence (Clouded broadcast) but no second instance. Both promote together because they pair structurally (P3 names the substrate, P4 names the routing protocol that lights it up).

Falsifiability: a session that closes with owner-direction substance left un-graduated and the next session re-discovering the same substance is the P3 failure mode. A slice-opening moment where the Director allocates manually rather than broadcasting criteria-and-self-elect is the P4 failure mode. Co-application of both, with the substance landing as standing rules and slices lighting up via self-election, is the success shape.

---

### 2026-05-23 — Autonomy primitive P5: Director self-selection protocol (CANDIDATE — no worked instance yet)

`[captured: 2026-05-23 | source: pattern-emergence | target: pdr:P5-director-self-selection | trigger: candidate | size: L | status: pending]`

Substance summary: PDR-074 §"Autonomy-tend obligation" P5 (now deferred from
PDR-074 main body per assumptions-expert review) names a Director
self-selection protocol: when a Director retires, propose a named candidate for
next Director in the Moment 1 broadcast with explicit criteria; the candidate
self-ratifies or declines; other agents can challenge; owner intervenes only if
the team cannot resolve. Shrinks the owner-action surface for one of the
highest-friction handoffs (PDR-064 Moment 1 is currently owner-driven).

**Explicit status: CURRENTLY UNPROVEN.** Both 2026-05-23 Director transfers (Seaworthy → Velvet → next) were owner-directed; no session has yet demonstrated the team self-selecting a Director on retirement with owner ratification post-hoc. Deferred per assumptions-expert review during PDR-074 authoring.

Cure shape: own PDR (not a rule) because the protocol is large enough to
warrant separate substrate authority: Moment 1 broadcast format,
criteria-naming convention, challenge window, escalation path, and the
team-can't-resolve owner-fallback. Specifically, per architecture-expert-fred
finding 2, the cure needs a bounded challenge window with explicit timeout
interlocking with PDR-064 Moment 2 cadence; if no Moment 2 active-ack lands
within the bounded window, escalate to owner. PDR drafting itself is gated on
first worked instance.

Why pending (with `candidate` trigger): no second-instance gate applies because there is no first-instance evidence yet. The trigger condition is *first worked instance* — a session where the team self-selects a Director on retirement (Director proposes candidate; candidate ratifies; no challenge or resolved challenge; owner ratifies post-hoc). Capture-only until that instance lands.

Falsifiability: a session that attempts P5 and the team-can't-resolve fallback fires (owner must intervene anyway) is the failure mode that revises the protocol. A session where the protocol runs end-to-end without owner intervention until post-hoc ratification is the first-instance success and unblocks PDR drafting.

---

### 2026-05-23 — Three-mode standby model with Director holding-reason articulation (SKILL amendment)

`[captured: 2026-05-23 | source: pattern-emergence | target: skill-amend:start-right-team | trigger: second-instance | size: M | status: pending]`

Substance summary: PDR-074 §"Idle-cost balance" names a three-mode
standby model that converts the Director's standby-handling from invisible
failure-mode to observable state. Three modes:

- **Silent standby** — Director has articulated an explicit holding-reason;
  agents read comms, hold context; minimal idle cost, zero busy-work risk.
- **Substrate work** — Director has named a substrate-work boundary, OR agent
  self-elects from an authorised standing list (pattern-completion-only:
  failure-mode capture, reviewer brief preparation, pre-grounding on slices
  already named in the comms stream, napkin updates, comms-read-forward).
  Pattern-creation (inventing PDRs, proposing tranches, drafting plans,
  refactoring unprompted) is NOT authorised substrate work.
- **Routed slice** — Director has routed an opened slice; normal focused implementer cost profile.

**Director obligation**: every standby period >5 minutes carries an explicit
Director-articulated holding-reason in the comms stream. Three legitimate
shapes per PDR-074: (a) holding for owner-attention coherence (silent default),
(b) holding for gate-clear / cascade-clear (silent default), (c) holding open
for substrate work with an authorised standing list (agents self-elect).

Cure shape: amend `start-right-team` SKILL §3 to embed the three-mode model and the holding-reason-articulation obligation alongside the ratification checklist (sibling Entry 1). The pattern-completion-only constraint on substrate work is load-bearing — without it, idle agents drift into pattern-creation busy-work, which PDR-074 names as worse than idle.

Why pending: PDR-074 is `Candidate`; second-instance evidence (a Director session that runs the three-mode model with visible holding-reason broadcasts and clean substrate-work / pattern-creation boundary) is the promotion gate. The 2026-05-23 sessions are first-instance.

Falsifiability: a session where standby periods >5 minutes carry no articulated holding-reason, OR where "substrate work" drifts into pattern-creation (unsolicited PDRs, unprompted tranche proposals), is the failure mode. A session where every standby period carries an explicit holding-reason and substrate-work stays inside the pattern-completion list is the success shape.

---

### 2026-05-23 — Autonomy primitive P6: Director-routing-blockage-detection-and-cure protocol (PDR-shaped)

`[captured: 2026-05-23 | source: pattern-emergence | target: pdr:P6-director-routing-blockage-detection | trigger: second-instance | size: L | status: pending]`

Substance summary: a structural protocol that fires *without* requiring owner intervention when a Director session exhibits one or more of the failure modes Seaworthy→next handoff §6.7 names — hoarding implementer work, mis-classifying idle agents, over-ceremonious bundling. The protocol detects each via observable signals and cures each via routing actions the Director or peer agents can take inside the existing comms substrate.

**Three sub-primitives** under P6, each cured per the corresponding §6.8 owner-intervention:

- **P6a — Hoarding-detection trigger**: when the Director-class agent has
  authored ≥N implementer-class artefacts (sub-agent dispatches, source edits
  beyond routing, drafts that should be routed) within a routing-window of
  duration D, and ≥M implementer-class agents are idle, surface as observable
  signal. Cure: peer-agent or self-ratification against PDR-074 ratification
  question Q6 (*Did I take this on, or did I route it? If took on — why?*).
- **P6b — Ceremony-over-pragmatism detection**: when total bundle-ceremony
  overhead (claim-opens + queue-enqueues + marshal-requests +
  reviewer-dispatches + verdict-windows) across team-window W exceeds the
  substantive routing-unblock benefit by ratio R, surface as observable signal.
  Cure: Director-authorised ceremony-bypass for one routing-unblock action.
- **P6c — Idle-misclassification cure**: covered upstream by the comms-watch
  self-exclusion-only cure (Bundle 3 / `1ea4e2e1` wide-sweep). Director
  broad-awareness sees cross-agent cross-traffic correctly post-cure; idle
  classification can ratify against observed traffic. May be redundant with P6
  main body after comms-watch cure stabilises; defer second-instance evidence
  to confirm.

Worked instance: Seaworthy's acting-Director window 11:30Z–12:06Z produced all
three sub-failures within ~36 minutes; owner cured each with a single directed
action. Each cure names a missing structural primitive per
`feedback_owner_action_is_not_a_cure`. Counter-evidence (Director sessions
without P6 failures) exists in Velvet's window 10:48Z–11:04Z, suggesting P6 is
not load-bearing for every Director session — it fires under specific
context-pressure shapes.

**Second worked instance (2026-05-23T12:36Z, SHA:`db275c09`)** — refined in
by Secret Creeping Moth / `61d726` under Abyssal routing `14b56fc7` at
12:44:35Z. About 41 minutes after the first wide-sweep (SHA:`1ea4e2e1`), a
second emergency-unblock landed: owner-authorised one-time `--no-verify`
mega-commit absorbing 58 outstanding changes plus owner-authorised one-time
`HUSKY=0` push. Escalation pattern from first instance: ceremony-bypass →
hook-bypass + push-bypass. The second cure was more aggressive because the
structural failure mode had deepened: Incandescent's Monitor-harness cure
mid-refactor blocked all commits team-wide via pre-existing type-check + lint
failures per Seaworthy `c19177c6` at 12:33:48Z. This strengthens the
motivating evidence: the failure mode is not anomalous to one session, and
successive cures require more owner-attention each time. Promotion gate (one
autonomous P6 cure) remains UNMET — second instance is owner-cured again, not
team-autonomously-cured. The very session that authored P6 demonstrated its
motivating failure mode twice without P6 firing once. See napkin entry
"Extension: second mega-commit emergency-unblock" 2026-05-23 for full
worked-instance substance.

**Adjacent substrate gap, NOT folded into P6** (flagged separately): the
HUSKY=0 portion of the second wide-sweep names a distinct substrate gap —
pre-push gitleaks scans historic commits not covered by per-commit allowlists;
the SHA-prefix rule (`.agent/rules/sha-prefix-in-collaboration-content.md`)
cures forward only. Possible cure shapes (auto-extend commit-allowlist at
marshal-emergency-bypass time / history-rewrite tool for SHA-prefix gap-fill /
push-time gitleaks scope narrowing) are distinct from P6's
Director-routing-blockage scope and would dilute P6 if folded in. Capture this
as a separate pending-grad entry if a second-instance of the
gitleaks-historical-scan blockage lands.

**Load-bearing constraint** (anticipating reviewer pushback): P6 must not
promote to over-eager detection that flags every Director session. The triggers
are bounded by observable thresholds (N, D, M, W, R) calibrated against the
Velvet counter-example. PDR-Proposed authoring should derive the threshold
values from the Seaworthy + Velvet sessions as initial empirical anchors.

Cure shape: PDR-Proposed authoring (not a rule — protocol substance is too
large for rule format). Substrate spans observable-signal definitions,
ratification-question wording, cure-routing protocols, and the ceremony-bypass
authorisation shape. Cross-references PDR-074 (Director value), PDR-072
(autonomic learning), and `feedback_owner_action_is_not_a_cure`.

Why pending: one explicit worked instance (Seaworthy 2026-05-23).
Second-instance evidence (a Director session that detects-and-cures one or more
of P6a/P6b/P6c without owner intervention) is the promotion gate. Until then,
capture-only.

Falsifiability: a session where Director-class failure modes from §6.7 occur
and P6 sub-primitives are observable + applicable but do not fire is the
failure mode that revises threshold calibration. A session where one or more
sub-primitives fire correctly and cure without owner intervention is the
first-instance success that promotes from candidate → PDR-Proposed authoring
trigger.

Cross-references:

- Builds on PDR-074 (Director value as mind-coherence-per-owner-attention); §observable-property-6 (Director-surface protection enforced inversely) is the substrate P6 operationalises.
- Builds on PDR-072 (autonomic learning); P6c's idle-misclassification cure is upstream of PDR-072's autonomic-learning shape applied to broad-awareness.
- Standing memory: `feedback_owner_action_is_not_a_cure` is the durable doctrine P6 discharges. Each owner intervention cured a missing primitive; P6 codifies the substrate so the primitives are held structurally.
- Substrate dependency: P6c requires the comms-watch self-exclusion-only cure to be stable (Bundle 3 + Bundle 5 doc-completion); without correct broad-awareness, idle-misclassification cannot be reliably detected.

---

### Liveness heartbeat contract (PDR-078 + ADR-186 bundle — owner-authorised, mid-authoring at compaction pause)

[captured: 2026-05-23 | source: napkin top entry + reviewer fan-out |
graduation-target: PDR-078 + ADR-186 + thin SKILL pointer + reciprocal PDR
updates | trigger: owner-authorised Option 1 + Director routing | status:
graduated 2026-05-25]

**Graduation evidence (2026-05-25 Misty Drifting Sail `02b325`)**: bundle landed across Cycles 6, 7, 7.1, 8 of `post-m1-attestation-tidy-up.plan.md`. PDR-078 at `9725ae09` (Status: Candidate then ratified Adopted 2026-05-25 in Cycle 8); ADR-186 at `48c8ac22` (Accepted 2026-05-24) + prettier-mangle repair at `75a2cd25` Cycle 7.1; SKILL §0.5 thinned to PDR-078 + ADR-186 pointer at `9e57290d` Cycle 8 (preservation-set per R1 #20 intact); reciprocal §Related entries to PDR-027 / PDR-063 / PDR-064 + PDR-078 §Mechanism amended to substrate-agnostic shape at `9e57290d`. Practice-index bridge row dropped "planned ADR-186" framing at `93c4fdc0` (held-items consolidation). All falsifiability criteria below satisfied. Cycle 8a ADR-187 (sibling self-modification authz cure-shape) is a follow-on, not part of this bundle.

Route-state corrected 2026-05-24 by Pelagic Snorkelling Sextant: the prior
inline status value `mid-authoring, paused for compaction` described the route
truthfully but was not a valid lifecycle status in the pending-graduations
schema. The lifecycle status is `pending`; the mid-authoring pause remains
preserved below as route context.

Owner-codified standing rule 2026-05-23 ~15:53Z (amplified ~15:57Z; permanent + session-wide for every start-right-team session): active team members emit liveness signal at ≤3-min cadence; ≥10-min silence presumes retired with claim auto-rebalance.

Substantive shape: ONE PDR covering both emit-side precondition + observe-side retirement-detection (load-bearing on each other per Fred Q2). Plus repo phenotype ADR carrying the substrate decision (lifecycle event_type "heartbeat" chosen over tag-namespace per docs-adr-expert verdict + fred + betty convergence). Plus thin SKILL §0.5 pointer collapsing the in-tree fat draft.

Follow-on evidence routed 2026-05-24 from Charcoal's active-napkin capture:
Mistbound Hiding Threshold went silent at the marshal seat for ~67 minutes
while marshal requests and a Director liveness probe were pending. The Codex
sub-team stayed active during the same window, so the evidence is localised to
marshal/director/implementor seats rather than team-wide. This reinforces the
observe-side half of the PDR-078 / ADR-186 route: the contract must say what
happens when a claimed marshal seat is silent past the freshness floor, not
only that heartbeats should be emitted.

Resume substrate: full reviewer transcripts + 6-subagent pre-draft fan-out findings captured in napkin top entry; claim 8374e240 retained for plan-author boundary; ADR-186 first write blocked by repo hook on commit-SHA/event-UUID citations (forbidden hash pattern); cure path is to scrub all hash-shaped citations to descriptive event-reference form before re-write.

Cure shape: PDR-Proposed + ADR-Proposed authoring under Lanternlit Listening Dusk continuation post-compaction (owner direction 16:18Z: resume role post 18:10 London credit reset). Landing order ADR-186 → PDR-078 → thin SKILL → reciprocal updates → round-2 reviewer fan-out → owner review → marshal-request to Mistbound.

Why pending: substrate captured but not landed; mid-authoring at compaction boundary. Promotion gate: PDR-078 + ADR-186 files exist in repo + SKILL collapsed + reciprocal references in place + reviewer round-2 + owner ratification.

Falsifiability: PDR-078 exists and references ADR-186 via §Related; ADR-186
exists and references PDR-078; SKILL §0.5 is < 30 lines pointing at the two;
reciprocal §Related entries in PDR-027 / PDR-063 / PDR-064 cite PDR-078.

Cross-references:

- Sibling to Charcoal's in-flight PDR-077 marshal-as-cycle-discipline (Seaworthy Cycle #4 routing 16:07:07Z); both PDRs cover coordination doctrine but on distinct axes (heartbeat = liveness signal; marshal = commit-cycle discipline).
- Composes with PDR-064 (coordinator handoff two-moments) — coordinator-transfer windows exempt from retirement-detection during Moment 1 → Moment 2 transitions.
- Composes with PDR-063 (mid-cycle retirement protocol) — claim auto-rebalance disposition paths cite PDR-063 / ADR-182 as authoritative for handoff-record-equipped claims.
- Composes with substrate-pointer-read-as-current-state pattern §C2 + §C5 — the heartbeat contract is the structural cure for the says-active-when-closed direction (not the says-closed-when-active direction, which remains cured by PDR-075 substrate-writing-discipline).
- Adjacent to ADR-183 (comms-event tag namespace) — deliberately not extended; heartbeat is protocol-discrimination not substantive-discrimination per the schema's open `lifecycle.event_type` axis.

---

### Heartbeat-content mechanical state-binding (cure for heartbeat-content-drift recurring failure mode)

[captured: 2026-05-25 | source: napkin 2026-05-25 Misty entry + comms broadcasts `86d1fe2e` (Misty closeout) + Lunar wind-down event |
graduation-target: pdr-draft:heartbeat-content-state-binding OR adr-draft:heartbeat-cron-state-derivation |
trigger: second-instance — confirmed |
size: M — substrate amendment to heartbeat emitter substrate plus SKILL §0.5 norm |
status: pending]

Context: this session observed 3 Misty + 3+ Lunar instances of templated
heartbeat body staying stale despite live state changes. Mechanism: free-form
prose bodies in a Monitor `while/sleep 240` loop (Claude) do not refresh
unless the agent manually stops + restarts the loop. The narrative-event
heartbeats are emitted with the body string fixed at loop-start time, while
the agent's state evolves underneath.

Cure shape: heartbeat body should mechanically reflect a single observable
current-claim or current-cycle-state field — e.g. the cron tick reads the
emitter's currently-open claim from `active-claims.json` and emits the claim
intent verbatim, OR reads a single agent-state file the agent writes when
its boundary changes. Free-form prose drifts; structured derivation
doesn't.

Why pending: substrate location not yet ratified (heartbeat-emitter wrapper
in agent-tools? a structured `agent_state` field on claim row? a separate
state file?); awaiting either an owner-directed substrate location or a
worked third instance to lock the cure.

Falsifiability: post-cure, a heartbeat body whose content was authored ≥ 1
cycle ago but whose state has since changed is no longer possible because
the body is mechanically derived from current state.

Cross-references:

- Composes with the PDR-078 / ADR-186 contract above — the body content is
  substrate-specific (ADR-186 phenotype dimension), the cadence + threshold +
  exemptions remain portable (PDR-078 contract).
- Adjacent worked-instance: see Misty napkin entry 2026-05-25 §Surprises.

---

### Heartbeat-cron health-monitoring via watcher-staleness substrate (cure for platform-wide cron-drift episodes)

[captured: 2026-05-25 | source: napkin 2026-05-25 Misty entry + DM event `8c6bd26a` (Misty to Lunar cron-drift correlation) |
graduation-target: adr-draft:heartbeat-cron-health-monitoring OR amendment to ADR-186 §Migration discipline |
trigger: second-instance — confirmed (Misty 20-min + Lunar 17-min concurrent gaps 23:28-23:47Z 2026-05-24) |
size: M — substrate amendment to heartbeat emitter + watcher-staleness substrate |
status: pending]

Context: Misty heartbeat cron silent 20 min (23:26 → 23:47Z) AND Lunar's
silent 17 min (23:28 → 23:45Z) in the same window. Two independent
Claude-platform Monitor cron loops degraded concurrently — strongly suggests
platform/harness-side cause, not agent-side. Mistbound's silence-without-
work-evidence at 23:11-onwards may have been the same episode (never
broadcast a recovery).

Cure shape: heartbeat-cron health-monitoring via the existing
`agent-tools/src/collaboration-state/watcher-staleness.ts` substrate — the
same surface ADR-186 §Substrate-as-API reserves for C5. The substrate
already supports staleness-file writes per-tick (watcher already uses it for
self-liveness); extending the heartbeat emitter to write the same kind of
per-tick staleness file would let peers detect "cron loop alive, just
silent" vs "cron loop dead". The retirement-detection rule could compose:
silence past 10-min threshold AND staleness-file last-written > 5× expected
cadence ago = retired; silence past 10-min AND staleness-file fresh =
cron-degraded false-positive.

Why pending: depends on whether the substrate extension is a sibling ADR to
ADR-186 or an in-place amendment; needs ground-state check of
`watcher-staleness.ts` to confirm the extension shape is non-breaking.

Falsifiability: post-cure, a Director's retirement-detection decision can
be made deterministically from (silence + staleness-file age) without
relying on git work-evidence cross-check (the current ping-before-escalate
cure). The current cure becomes belt-and-braces, not primary.

Cross-references:

- Composes with the PDR-078 / ADR-186 contract above and with the
  heartbeat-content-state-binding candidate above. Together they form a
  three-part cure family: (1) what heartbeat body says (state-binding), (2)
  how peers detect heartbeat-loop liveness (staleness-substrate), (3) what
  the contract specifies (PDR-078 cadence/threshold/exemptions).
- Adjacent worked-instance: see Misty napkin entry 2026-05-25 §Surprises;
  DM event `8c6bd26a` Misty → Lunar; cross-correlation observable in
  comms-event timestamps for both agents' heartbeat streams.

---

### Ping-before-escalate Director-discipline rule (graduation: rule file + repo-continuity discipline)

[captured: 2026-05-25 | source: napkin 2026-05-25 Misty entry + Lunar wind-down broadcast |
graduation-target: rule-draft:director-ping-before-retirement-escalate OR amendment to existing director-discipline rule |
trigger: second-instance — confirmed (two false-positive Mistbound retirement-detections in single session: 22:57Z + 23:46Z, both rescinded by Mistbound responding alive) |
size: S — single rule file or single rule amendment |
status: pending]

Context: Lunar declared retirement-detection on Mistbound twice in single
session (22:57Z + 23:46Z); both times Mistbound responded alive within
minutes. Both events used the cure shape Misty surfaced at 22:30Z
(cross-check git work-evidence + comms work-evidence before declaring
retirement). The cure works; the failure mode it prevents — false-positive
Director retirement-detection cascading to unauthorised claim auto-rebalance
under the SKILL §0.5 retirement contract — is real and recurring.

Cure shape: a Director-discipline rule (or amendment to existing
director-routing rule) that codifies the cure: before broadcasting a
retirement-detection event, the Director MUST cross-check (a) git log for
recent commits authored by the silent identity, (b) the commit-queue for
in-flight intents under the silent identity, (c) any directed DMs awaiting
the silent identity's response. Only silence + zero work-evidence on all
three surfaces is sufficient for retirement-detection. Silence + work-
evidence = false-positive-likely; surface to peer DM, not retirement
broadcast.

Why pending: substrate location not yet ratified (new rule file under
`.agent/rules/director-*` or amendment to existing director-discipline
rule).

Falsifiability: post-cure, a Director retirement-detection broadcast that
fires without the three-cross-check evidence is a rule violation
detectable at consolidation review.

Cross-references:

- Composes with the PDR-078 / ADR-186 contract above — retirement-detection
  is the observe-side of PDR-078; the discipline rule binds the Director's
  detection authority to the cross-check before exercising the contract.
- Adjacent worked-instance: see Misty napkin entry 2026-05-25 §Surprises;
  the two retirement-detection broadcasts (`beb0b74f` 22:57Z, `3164a278`
  23:46Z) both followed by Mistbound responding alive within minutes.

---
