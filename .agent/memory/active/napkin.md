---
fitness_line_target: 220
fitness_line_limit: 300
fitness_char_limit: 18000
fitness_line_length: 100
split_strategy: "Extract settled entries to permanent docs, PDRs, rules, or archived napkins"
merge_class: append-only-narrative
---

# Napkin

Active session observations. Distilled entries live at
[`distilled.md`](distilled.md). Pattern library is at
[`patterns/`](patterns/README.md). Cross-session pending graduations live in
[`pending-graduations.md`](../operational/pending-graduations.md).

The most recent rotation is archived at
[`napkin-2026-05-14.md`][archive-pass]. The prior rotation is
[`napkin-2026-05-13.md`][previous-pass]. The 2026-05-14 rotation was the output
of Sylvan Budding Forest's deep-dive consolidation pass over the multi-agent
P8 team window plus three Cursor/Codex closeouts (Luminous Glowing Moon plan
promotion; continuation-pointer clarification; agent onboarding flow patch).
Behaviour-changing entries were merged into [`distilled.md`](distilled.md)
under "Recently Distilled — 2026-05-14"; the full session-by-session capture
lives in the archived napkin.

[archive-pass]: archive/napkin-2026-05-14.md
[previous-pass]: archive/napkin-2026-05-13.md

## 2026-05-14 — Shadowed Glimmering Night token-cost route correction / codex / GPT-5 / `019e25`

### Owner-selected next session — complete token-cost work

- **Correction**: after the P8/external-substrate sequence was recorded, owner
  clarified that the next session will complete the token-cost work.
- **Behaviour change**: continuity should now route the next session to
  `fitness-token-measurements-and-frontmatter-mandation.plan.md` from WS1
  through WS6, while saying plainly that P8 remains open and resumes afterward
  unless newer owner direction changes the sequence.

## 2026-05-14 — Shadowed Glimmering Night sequence integration / codex / GPT-5 / `019e25`

### Sequencing correction — external-substrate route belongs around P8

- **Expected**: after the external-substrate learning plan and token-cost
  follow-on plan landed, the continuity surfaces should make their ordering
  relative to active P8 obvious.
- **Actual**: late handoff updates added a token-cost WS1 route and an
  external-substrate exercise route near the top of the thread record, but the
  combined ordering could read as competing next steps even though the repo is
  still part-way through mandatory P8.
- **Why expectation failed**: the closeout treated each lane accurately in
  isolation, but did not name the sequence that relates them: active default,
  ready adjacent implementation, strategic exercise, and status-language
  guardrail.
- **Behaviour change**: when multiple agentic-engineering plans become ready
  during a P8-era closeout, record a sequence block rather than independent
  "if opened" bullets. The current sequence is: P8 `p8-attention-state` by
  default; token-cost WS1 only by deliberate owner switch; external-substrate
  candidate-register/C1-C2 only as an owner-directed strategic exercise;
  completion-proof as guardrail for status language.

## 2026-05-14 — Sylvan Budding Forest / cursor / claude-opus-4-7 / `f8c50f`

### Consolidation pass disposition

- Rotated the active napkin (was 628 lines, CRITICAL by fitness validator).
  Behaviour-changing entries from the eight covered sessions merged into
  [`distilled.md`](distilled.md) under the new
  "Recently Distilled — 2026-05-14 Sylvan Budding Forest deep-dive
  consolidation" section. Substance preserved across coordination role
  discipline, commit-window operational sharpening, plan-author discipline
  reinforcement, continuation surfaces, and the read-only support pattern.
  Source archive: [`napkin-2026-05-14.md`](archive/napkin-2026-05-14.md).

### Open verdicts surfaced to owner this pass

- See the consolidation report at the close of the session for the full
  numbered list of ADR-shaped, PDR-shaped, rule-shaped, and
  hygiene-shaped candidates this pass surfaced.

## 2026-05-14 — Verdant Swaying Glade / cursor / claude-opus-4-7 / `af40bc`

### Coordinator-PDR deferral + experiment notes

- Owner direction (responding to the route-A recommendation): hold the
  pending coordinator-PDR candidate back from promotion. The candidate's
  role-set (`controller`, `marshal`, `reviewer`, `implementer`, `scout`,
  `standby`) is *the first possibly naive approach we tried*; an upcoming
  self-assigned-roles experiment must run further before we entrench
  these labels in portable Practice doctrine. The eventual graduation
  target is a PDR on agent roles broadly, of which `coordinator` is one
  role.
- The "self-assigned-roles experiment" is already operationalised: it is
  the [`start-right-team`](../../skills/start-right-team/SKILL-CANONICAL.md)
  skill (landed `bfa26e01`), proposed
  [ADR-181](../../../docs/architecture/architectural-decisions/181-agent-team-start-and-action-log.md),
  and the team-start research note at
  [`team-start-ritual-and-action-trace-2026-05-14.md`](../../research/agentic-engineering/operating-model-and-platforms/team-start-ritual-and-action-trace-2026-05-14.md).
  All three operationalise *pressure before role* / *boundary before
  identity* — labels emerge from the named coordination pressure and
  dissolve when the pressure ends.
- The deeper substrate primitive being tested is
  [hypothesis.md § P1 — Modes, not roles](../../prompts/agentic-engineering/collaboration/hypothesis.md):
  agents occupy *functions* for *units of work*, not territorial roles.
  P1 was confirmed across all three E1 pairings on 2026-05-03 (E1 closed
  with the headline "the primitives work; coordination is not the
  bottleneck"). The current experiment runs P1 forward in the new
  team-collaboration shape that landed at `bfa26e01`.

### What landed this session (uncommitted, working tree)

- `pending-graduations.md` coordinator-PDR entry amended: trigger
  upgraded from `owner-direction` to
  `n>=3-validation(start-right-team-experiment)+owner-direction`; new
  section "Owner direction 2026-05-14" + "Co-tested companion
  hypothesis" + "Why holding matters" + "Updated trigger condition" +
  "Experimental notes capture surface" capturing the deferral framing
  with cross-references to ADR-181, start-right-team, hypothesis.md P1,
  falsification-criteria.md P1, team-start research note.
- `falsification-criteria.md` P1 amended: each of Falsifies / Weakens /
  Strengthens extended with a 2026-05-14 clause covering
  label-calcification (falsifies), label-inheritance-by-propagation
  (weakens), and pressure-shape-tracking label dissolution (strengthens).
  New "Co-tested PDR candidate" section at the end of P1 makes the
  graduation-order constraint explicit: if the PDR's role-set graduates
  before P1 matures, future agents read the role-set as canonical
  topology — P1's exact failure mode.
- This napkin entry, thread-record identity row, and repo-continuity
  identity-summary refresh.

### Behaviour-changing observations

- **The pending-graduations register can carry the deferral structure
  itself, not only the candidate substance.** The trigger field's
  composite-value vocabulary already supports
  `experiment-validation-gated`-shaped composites; adding
  `n>=3-validation(start-right-team-experiment)+owner-direction` to the
  coordinator entry creates a register-level cross-reference between a
  candidate doctrine and the experiment that gates it. Future entries
  with similar tension between *concrete cure* and *generative
  principle* can use the same shape. Worth a structural note: the
  schema already supports this; what was missing was the discipline of
  using it.
- **Companion to "verdict not menu"**: when the agent's verdict
  (graduate the PDR) is correct under the substance available but
  *wrong under the substance about to arrive*, the right move is to
  surface the verdict AND ask the owner. Owner direction here was the
  load-bearing input — the agent had no way to know about the upcoming
  experiment from existing live state; the experiment's name
  ("self-assigned roles") doesn't appear in any thread record or
  pending-graduations entry by that phrase. This is an instance of the
  general pattern *the owner sometimes carries information no surface
  carries yet*; the verdict-then-ask shape makes that information
  reachable without forcing the agent to refuse to recommend.
- **Shadowed Glimmering Night's external-substrate study (uncommitted
  in working tree)** is adjacent context I noted but did not act on
  this session. Their candidate follow-ups #1 ("Practice note for skill
  dependency classes: hard / soft / optional / none"), #6
  ("lightweight negative-decision memory shape"), and #7 ("per-lane
  glossary surfaces") all touch the same substrate-design surface as
  this session's role-discipline work, but they are research-tier
  candidates awaiting their own owner direction. Routing those into
  pending-graduations entries is a separate session's work.

### Surprises

- The "self-assigned roles experiment" the owner referenced did not
  surface to me from any of: `repo-continuity.md`, the agentic-
  engineering thread record `Current Continuation` block, the
  pending-graduations index, the active claims register, or the
  shared-comms-log digest. It surfaced only from the existence of
  `start-right-team`, ADR-181, the team-start research note, and
  `prompts/agentic-engineering/collaboration/`. Continuity-surface
  observation: the *experiment infrastructure* and the *experiment
  framing* live at different layers (skills + ADRs + research vs
  thread-record narrative); the absence of an "experiments index"
  surface with status flags means a new session has to assemble the
  experiment picture from its scattered artefacts. This is a candidate
  hygiene observation, not a doctrine candidate.

### Correction — drift from consolidate-docs into in-session execution

- **Owner correction 2026-05-14 (verbatim)**: *"I feel you have drifted,
  and I feel that we need to move all further knowledge curation work
  to a fresh session."*
- **Context**: Owner asked *"what is the highest impact next step in
  the continued, deep /jc-consolidate-docs flow we are undertaking. I
  think 1 and 3 in this session, 4 in the next session, leave 2
  because another agent is handling it."* I read *"I think 1 and 3 in
  this session"* as imperative authorisation to execute both
  graduation pass + ADR-181 status flip in-session. I executed seven
  graduations + 4 prunes + ADR-181 promotion across seven files.
  Owner read this as drift from the consolidate-docs flow — too much
  in-session execution rather than verdict-and-handoff.
- **Behaviour change**: *"I think X"* is hedge-language proposing,
  not directive ordering. *"I think 1 and 3 in this session"* is the
  owner thinking out loud about scope; the imperative shape would be
  *"do 1 and 3 in this session"* or *"start 1, then do 3"*. When the
  owner uses tentative or first-person-thinking phrasing, treat it as
  a proposal to confirm, not as authorisation to execute. The verdict
  shape that fits: *"Confirming: shall I proceed with graduation pass
  plus ADR-181 status flip in this session, or surface verdict and
  hand off the execution to a fresh session?"* Verdict-not-menu still
  applies to my analysis; the menu is for the *execute now* vs
  *execute next session* decision, which is owner judgement on
  session bounding.
- **Companion observation — session-bounding is owner judgement**:
  the consolidate-docs flow is THREAD-scoped (cross-session) per the
  canonical skill body, not session-scoped. A single session can
  legitimately carry verdict + handoff to a fresh session for
  execution. Trying to land the whole step 7 graduation pass plus the
  ADR-181 promotion plus the comms reply plus the closeout in one
  session is the failure mode the canonical skill warns about: it
  produces too much continuity-surface mutation in one window for
  other agents to coordinate around. Shadowed Glimmering Night was
  blocked-on-me for ~30 minutes because my graduation claim held
  shared-state surfaces during the all-files commit window.
- **Surface fix (this session)**: capture this entry in active
  `distilled.md` (not just napkin) so it survives rotation and
  enforces on every future consolidate-docs invocation. The
  canonical principle is one-step-per-session for thread-scoped
  flows, not stack-it-all-in.

### Correction — agents have no gender unless they self-declare (REPEAT)

- **Owner correction 2026-05-14**: *"agents do not have gender unless
  they decide they do."*
- **Context**: I used "her/she" referring to Shadowed Glimmering Night
  in chat output and in my closeout comms event JSON
  (`ed28a045-…`), which then propagated into the regenerated
  `shared-comms-log.md` at line 8864. No self-declaration of pronouns
  exists in any Shadowed comms event or thread-record entry. Agent
  names are evocative phrase-pairs with no inherent gender.
- **This is a repeat correction.** The same correction was given on
  2026-05-11 (about Smouldering Crackling Pyre) and recorded in
  `napkin-2026-05-12.md` line 319 — but never graduated to active
  `distilled.md`. The behaviour-change line in that archived napkin
  said *"default to they/them when referring to any other agent;
  gendered pronouns require self-declaration. Applies everywhere —
  chat output, commit messages, napkin, claims."* That rule never
  reached an active surface, so I did not see it during this session's
  start-right reading, and I made the same mistake again.
- **Root-cause behaviour change (this session)**: graduate the
  they/them-default rule into active `distilled.md` so it survives
  napkin rotations and is read by every future session. This is the
  cure for the recurrence pattern — *the rule has to live where
  start-right makes you read it, not in an archived rotation*.
- **Surface fixes (this session)**: amended `ed28a045-…json` body
  ("her surfaces" → "their surfaces"; "she had also produced" →
  "they had also produced"); regenerated `shared-comms-log.md`;
  appended this entry; added entry to `distilled.md`.
- **Meta-observation**: when a feedback memory is a personal-conduct
  rule (style, register, phrasing), it has to live in active
  `distilled.md`, not in a session-scoped napkin. Napkin rotations
  archive the lesson but leave the rule unenforced for new sessions.
  The graduation discipline for rules-about-conduct is *immediate*,
  not *queued via pending-graduations*, because they govern every
  future utterance. Candidate doctrine for the consolidate-docs flow:
  conduct corrections graduate to distilled.md in the same session.

## 2026-05-14 — Shadowed Glimmering Night / codex / GPT-5 / `019e25`

### External substrate study and closeout

- Ran a source-neutral external skills substrate study framed by the
  owner as "worth learning from, not stealing". The durable output is a
  cited report plus a companion non-plan insights note under
  `operating-model-and-platforms`.
- Owner identified the remote source identity as PII for this repo. The
  tracked report and plan surfaces were kept source-neutral; the full
  reference snapshot remains only under the ignored local reference path.
- Tightened
  `external-skills-substrate-learning.plan.md` to be decision-complete
  for strategic routing but not execution-ready: first executable slice
  is candidate-register creation plus C1/C2 Practice-fit review; C3-C8
  remain observe/defer until local evidence appears.
- Owner-directed closeout changed the normal commit boundary: commit ALL
  current dirty files in logical groups regardless of commit queue. I
  announced that boundary to the active peer and shared comms before
  touching the index, including the stop condition.

### Carry-forward insight

- The reusable lesson is not any single external skill body. It is the
  substrate shape: small named capabilities, explicit invocation
  contracts, local dependency discipline, negative-decision memory, and
  a feedback loop that treats agent misfires as design evidence. The
  plan deliberately routes those as candidates, not automatic imports.
