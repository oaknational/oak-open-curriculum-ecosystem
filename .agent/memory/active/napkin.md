# Napkin

Active session observations. Distilled entries live at
[`distilled.md`](distilled.md). Pattern library is at
[`patterns/`](patterns/README.md). Cross-session pending graduations
live in the register at
[`../operational/repo-continuity.md § Deep consolidation status`](../operational/repo-continuity.md#deep-consolidation-status).

---

**Rotation**: 2026-04-25 (Jiggly Pebble consolidation, after WS0 of
the multi-agent collaboration protocol landed at `63c66c88`).
Outgoing napkin (1422 lines, sessions 2026-04-22 through 2026-04-25,
including the WS0 landing session and the parallel observability-
thread agent's pushed-handoff entry) archived to
`archive/napkin-2026-04-25.md`.

Distillation merged into `distilled.md`:

- **Multi-agent collaboration** section pointing at the new
  `agent-collaboration.md` directive, the embryo log at
  `.agent/state/collaboration/log.md`, and the two foundational
  tripwire rules (`dont-break-build-without-fix-plan`,
  `respect-active-agent-claims`).
- **Reviewer phasing** — adversarial structural reviewers (Wilma)
  catch boundary / threat-model / lifecycle; pre-landing reviewers
  (`docs-adr`, `assumptions`) catch citation-level and observability
  gaps. Sequence the two distinct phases.
- **ADR/PDR citation discipline** — verify filename and substance
  against the live decision-record file before citing; plan-body
  glosses are shorthand, not authoritative.

Pattern candidates retained in the pending-graduations register at
`repo-continuity.md § Deep consolidation status`:

- *the-frame-was-the-fix* — **graduated 2026-04-25** to
  [`.agent/memory/active/patterns/the-frame-was-the-fix.md`](../patterns/the-frame-was-the-fix.md)
  after cross-experience scans across two consolidate-docs runs
  reached the same conclusion (six original instances + a
  frame-held variant from the WS0 landing session; eight instances
  total).
- *advisory-not-enforced for agent-participating systems* (WS0
  landing provided same-day operational evidence; trigger remains
  "second cross-system instance").
- *operational-seed-per-workstream for protocol plans*.
- *discussion-before-absorption gate per adversarial-review output*
  (sibling to PDR-015 assumption-challenge gate).
- *tripwire-rules-need-observable-artefacts* (new this rotation,
  surfaced by `assumptions-reviewer` on `respect-active-agent-claims`
  during WS0 landing).
- *parallel-track-pre-commit-gate-coupling* — **graduated 2026-04-25**
  to [`.agent/memory/collaboration/parallel-track-pre-commit-gate-coupling.md`](../collaboration/parallel-track-pre-commit-gate-coupling.md)
  as the founding entry of the new collaboration-patterns memory
  class (WS2 of the multi-agent collaboration protocol). Three
  instances (Frodo prettier 2026-04-24, Pippin auto-staging
  2026-04-24, Jazzy knip 2026-04-25) preserved in the archived
  napkin.

Prior rotations: 2026-04-22 (sessions 2026-04-22 through 2026-04-24,
archived to `archive/napkin-2026-04-22b.md`); 2026-04-22 (sessions
2026-04-19 through 2026-04-21, archived to `archive/napkin-2026-04-22.md`).

---

## 2026-04-25 — Fresh Prince — WS1 landing and owner-directed pause

**Surprise: the protocol applied to itself, bidirectionally, in the
landing session.** WS1 of the multi-agent-collaboration-protocol was
implemented while the WS0 surfaces were live. I declared intent in the
embryo log at session-start, ran four reviewers in parallel during
implementation, and the parallel Jiggly Pebble session (observability
thread, PR-87 quality-finding analysis) appended their own embryo-log
entry mid-session declaring explicit non-overlap with WS1 surfaces.
The protocol's first bidirectional coordination event happened during
the very landing commit that promoted the embryo log to a structured
registry. Not surprising as design *ambition*; surprising as observed
*reality* without any further iteration. The "knowledge and
communication, not mechanical refusals" frame held in production for
two independent sessions on the same day.

**Surprise: the assumptions-reviewer caught my own rule violating the
register's named pattern.** The pending-graduations register has a
candidate `tripwire-rules-need-observable-artefacts` (originally
captured 2026-04-25 by `assumptions-reviewer` on
`respect-active-agent-claims` during WS0 landing). My WS1 rule draft
had an unobservable no-overlap branch — an agent who skipped
consultation and just registered a claim was post-hoc indistinguishable
from one who consulted and found no overlap. This is the **third
instance** of the same pattern. I absorbed the finding by mandating a
`notes` artefact on no-overlap claims (or an embryo-log entry on
fast-path). Promotes the pattern from candidate to ADR/PDR-ready —
captured in 6b below.

**Surprise: owner-directed pause is itself a load-bearing planning
move.** Mid-session, owner directed pause of WS3/WS4/WS5 on evidence
gate, which I'd been quietly deprioritising as "the next thing." The
pause is the *correct* move (WS5 IS the evidence harvest; landing WS3
without overlap-conversation evidence would freeze schema decisions
prematurely). The reflexive "next workstream is next" assumption was
suppressing the simpler answer: stop and let evidence accumulate.
Captures the practice's first question — *could it be simpler without
compromising quality?* — at the **workstream-sequencing** level, not
just within a single workstream.

**Correction: long URLs in markdown reference-link declarations
flagged as prose-line-width violations.** Bit me three times during
WS1 (ADR-150 link target; protocol-plan link in two operational
files). The fitness validator's `kind: 'prose'` classifier
(`scripts/validate-practice-fitness.mjs:185-221`) recognises
frontmatter, code-fences, and tables, but not markdown reference-link
declarations (`[label]: url`). Workaround during WS1: shortest-possible
alias keys (`[p]:` rather than `[protocol-plan]:`) so the URL fits
under 100 chars. Long-term either: (a) rename ADRs to shorter slugs,
or (b) upgrade the validator to recognise `^\[[\w-]+\]:` as a
non-prose line kind. Captured for graduation register.

**Correction: structured pause needs five surfaces, not three.** The
pause itself was clean (one commit, all gates first try) but required
touching: (1) source plan YAML todos + body Status section, (2)
thread next-session record, (3) repo-continuity Active Threads, (4)
roadmap Adjacent entry, (5) current-plans README. Five surfaces per
pause is high — there's a structural pattern here worth capturing
(see 6b candidates).

**What worked: parallel reviewer dispatch caught complementary
issues.** Fred caught state-vs-memory boundary correctness; config
caught the schema additive-only / `additionalProperties: false`
internal contradiction; assumptions caught the unobservable tripwire
branch and the missing `freshness_seconds` rationale; docs-adr caught
the step-7e anchor parity gap and the ADR-150 plain-text reference.
Four lenses, four orthogonal finding sets. The investment in
parallel-dispatching paid off — sequential dispatch would have been
~4× slower and produced the same set.

## 2026-04-25 — Fresh Prince — register-promotion pass and the protocol's first multi-turn dance

**Surprise: the protocol's first multi-turn coordination dance under
real concurrent load.** Keen Dahl was working PR-87 Phase 0 on the
observability thread while I was running the register-promotion pass
on the agentic-engineering-enhancements thread. We both claimed
`repo-continuity.md`, `active-claims.json`, `log.md`. **Three back-and-
forth turns** via the structured registry plus embryo log: my
overlap-ping → Keen Dahl narrowed their claim and added a heartbeat →
both commits landed cleanly with additive merges. The `heartbeat_at`
field saw its first real use in production coordination, not just
self-application. The protocol passed under conditions it was
designed for — concurrent agents, shared surfaces, no orchestrator —
without anyone needing to retreat to mechanical refusal or owner
escalation.

**Surprise: instance-count-as-trigger is the wrong measure for
owner-correction graduations.** The user explicitly named this:
"multiple occurrences is not the right measure, we need to evaluate
them and choose if and how to promote." Three of the four
owner-correction items had no second instance, but on substance one
was already-graduated (direct-answer in user-collaboration), one had
clear small landing site (fitness-compression in consolidate-docs §
9), and one generalised cleanly to a PDR-018 amendment (plan-placement).
The trigger condition format itself ("second instance, or owner
direction") creates an asymmetric gate where instance-count gates
forever even when substance is ready and owner-direction gates
trivially. Worth recording: **owner-direction-triggered candidates
should be evaluated on substance at consolidation, not held
indefinitely waiting for an unlikely second instance.**

**Correction: I added a register entry for `tripwire-rules-need-
observable-artefacts` as a NEW row instead of updating the existing
1-instance entry to 3 instances + `due`.** The duplicate sat in the
register through one commit before the metacognition step caught it.
Lesson: **before adding a register entry, check for an existing
entry on the same candidate and update-in-place rather than appending
a sibling.** Captured in the metacognition observation that the
register accumulates without cross-cutting review.

**What worked: PDR-003 care-and-consult under self-direction.** Three
Practice Core PDR amendments landed in one commit. PDR-003 says
"owner approves each amendment before editing Core surfaces" — the
owner pre-approved the substance ("yes to promoting everything that
is ready") and I drafted-and-landed in the same turn. The drafts
faithfully captured the substance the owner approved. The discipline
worked because the substance had been precisely surfaced before
approval, not handed over as "do whatever you think is best."

**What worked: the consolidate-docs cross-experience scan caught a
register-hygiene problem.** Without the metacognition pass before
listing the register, I would have presented 17 entries entry-by-
entry and missed the duplicate, the stale-graduated, and the two
mergeable siblings. The cross-cutting view turns 17 decisions into
~5 decisions plus housekeeping.

<!-- New session entries appended below this line. -->
