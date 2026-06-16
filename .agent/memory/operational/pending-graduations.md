---
fitness_line_target: 1100
fitness_line_limit: 1467
fitness_char_limit: 200000
fitness_line_length: 100
fitness_item_count: required
fitness_item_count_target: 0
fitness_item_count_soft: 2
fitness_item_count_hard: 3
fitness_item_dwell_target: 2
fitness_item_dwell_soft: 4
fitness_item_dwell_hard: 7
lifecycle_model: >-
  canonical pending-graduations register — every live item is decision-debt
  (status pending/due/overdue) until it is graduated, rejected, or marked
  duplicate. Provenance and adaptation are the safety net for a wrong call.
access_pattern: >-
  consolidation-pass-only — read at consolidations and drain sessions; not
  loaded every session by every agent
drain_strategy: >-
  Drain by DECIDING: graduate or reject each item, recording the disposition in
  its permanent home, to PDRs/ADRs/rules/permanent docs. The decision-debt count
  falls only through a recorded terminal disposition — never by deleting an
  undecided item and never by raising a limit. Do not split, shard, or hide
  buffer depth.
fitness_rationale: >-
  The primary health signal for this buffer is the decision-debt count
  (fitness_item_count, target 0) — a flow-rate reading of whether graduation is
  keeping pace with capture. The line and character limits are a secondary
  structural signal: drain-cadence back-pressure for a consolidation-pass-only
  buffer, not a size cap. Recalibrated 2026-06-08: line hard 2200 -> 1467, target
  1500 -> 1100, so line-critical (hard x 1.5, the global ADR-144 ratio) lands at
  ~2200. Both signals are reported and acted on, never chased: substance is never
  trimmed to clear a zone (knowledge-preservation), and the register is drained
  down by deciding items, not by tombstone-removal. Prior note: recalibrated
  2026-05-27 to collapse legacy pseudo-shards back into this one canonical
  register; fitness is routing evidence, not permission to create sidecar buffer
  files.
merge_class: mostly-append-register
fitness_content_role: drainable-buffer
---

# Pending Graduations

This is the canonical pending-graduations register. Do not create dated,
windowed, backlog, split, or shard-like pending-graduation files. New capture and
unresolved pending-graduation decisions belong here until they graduate, are
rejected, or become duplicate — every live item is decision-debt to decide.

**Every live item is decision-debt** (status pending/due/overdue), drained by
graduation or rejection; provenance and adaptation are the safety net for a
wrong call.

The two live items below are owner-pinned **do-not-mint** team-autonomy
primitives (the PDR-074 Candidate family). Their substance is unique and not
conserved elsewhere, and the owner steered team-autonomy away from
crystallisation into a protocol or menu. They are therefore genuine decision-debt
with future triggers: decide by **graduating** only if the owner re-opens
crystallisation, or by **rejecting** only once the substance is conserved
elsewhere (for example in the team-autonomy generative-resource work). Minting
either now would be the hollow-doctrine failure the drain guards against — see
PDR-100 and the napkin "do NOT mint PDR-074 P5/P6" caution.

## Team Autonomy Gates

### Autonomy substrate gap: first-out-closeout-owner self-election protocol

`[captured: 2026-05-23 | source:
napkin+comms-log+owner-direction | target:
doc-amend:.agent/skills/start-right-team/SKILL-CANONICAL.md | trigger: candidate | size: M | status:
overdue]`

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

---

### 2026-05-23 — Autonomy primitive P6: routing-blockage detection and cure

`[captured: 2026-05-23 | source: pattern-emergence | target:
pdr:P6-director-routing-blockage-detection | trigger: second-instance | size: L | status:
overdue]`

Substance summary: a structural protocol that fires *without* requiring owner intervention when a
Director session exhibits one or more of the failure modes Seaworthy→next handoff §6.7 names —
hoarding implementer work, mis-classifying idle agents, over-ceremonious bundling. The protocol
detects each via observable signals and cures each via routing actions the Director or peer agents
can take inside the existing comms substrate.

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

- Builds on PDR-074 (Director value as mind-coherence-per-owner-attention); §observable-property-6
  (Director-surface protection enforced inversely) is the substrate P6 operationalises.
- Builds on PDR-072 (autonomic learning); P6c's idle-misclassification cure is upstream of PDR-072's
  autonomic-learning shape applied to broad-awareness.
- Standing memory: `feedback_owner_action_is_not_a_cure` is the durable doctrine P6 discharges. Each
  owner intervention cured a missing primitive; P6 codifies the substrate so the primitives are held
  structurally.
- Substrate dependency: P6c requires the comms-watch self-exclusion-only cure to be stable
  (Bundle 3 plus Bundle 5 doc-completion); without correct broad-awareness,
  idle-misclassification cannot be
  reliably detected.
