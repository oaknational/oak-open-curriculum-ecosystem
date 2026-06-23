---
name: "Team-Autonomy Primitive Decisions — Exploration"
overview: >-
  Exploration plan (NOT decision-complete; frames two open team-autonomy design
  questions and their candidate options, decides neither) for two PDR-074-family
  primitives that are QUESTIONS, not doctrine: how a team self-elects a first-out
  closeout owner, and how a Director detects-and-cures its own routing blockages.
  Both were captured in the pending-graduations register but are mis-typed there —
  the register homes lessons awaiting a graduate/reject call, whereas these need a
  dedicated owner-walked decision SESSION with the options laid out. This plan is
  that home. It explicitly does NOT pre-decide either question and does NOT mint
  doctrine: the owner steered team-autonomy away from premature crystallisation
  into a protocol or menu, so the session's job is to explore the options against
  real multi-agent evidence and decide shape (or record that a question's
  deciding evidence does not yet exist, naming the gate that re-opens it).
  References the collaboration-plan estate rather than fragmenting it.
status: exploration
thread: agent-collaboration-research
date: 2026-06-16
related:
  - "../../../practice-core/decision-records/PDR-074-director-value-is-mind-coherence-per-owner-attention.md (the Candidate home for the Director-value model these primitives extend)"
  - "../../../practice-core/decision-records/PDR-072-autonomic-learning.md (P6c idle-misclassification is upstream of autonomic learning)"
  - "n-agent-collaboration-experiments.plan.md (the observe-during-real-work discipline that gathers the evidence these decisions need)"
  - "team-opener-generalisation-exploration.plan.md (sibling exploration on the same thread; the exploration-plan shape this follows)"
  - "multi-agent-collaboration-protocol.plan.md (the portable protocol estate these primitives would extend)"
  - "../../../skills/start-right-team/SKILL-CANONICAL.md (the team-bootstrap SKILL; Q1's candidate home is its Closeout Contract)"
todos:
  - id: q1-closeout-self-election
    content: >-
      DECIDE Q1 (first-out closeout-owner self-election). Walk the four candidate
      shapes against real team-session evidence; pick a shape (or composition), or
      record that the deciding evidence is not yet sufficient and name the gate
      that re-opens it (e.g. a second team-session that stalls at wind-down).
      Acceptance: a start-right-team Closeout Contract amendment OR a recorded
      decision naming that gate.
    status: pending
  - id: q2-director-routing-blockage
    content: >-
      DECIDE Q2 (Director routing-blockage detection and cure, P6). Decide whether
      the protocol is authored now, on the first autonomous-cure instance, or
      reshaped; if authored, derive thresholds from the Seaworthy + Velvet sessions.
      Acceptance: a P6 PDR (Proposed) OR a recorded decision that the
      first-autonomous-cure gate is the trigger.
    status: pending
---

# Team-Autonomy Primitive Decisions — Exploration

## Why this plan exists (the homing lesson)

These two items lived in the pending-graduations register, where every entry is
decision-debt awaiting a **graduate / reject / duplicate** call. They fit none of
those, because they are not settled lessons (answers) — they are **open design
questions** with candidate options that need a decision *session*. Forcing them
to graduate would mint unproven doctrine the owner steered away from; rejecting
would lose unique substance. The correct home for an actionable open question is
an exploration plan that frames it and schedules its resolution — which is what
this plan does. The register entries are drained into it.

**Standing constraint (owner steer):** team-autonomy substance does NOT
crystallise into a fixed protocol or menu ahead of the evidence. This plan
explores and decides; it does not pre-decide. A session may legitimately conclude
that a question's deciding evidence does not yet exist — for Q2 that gate is the
first autonomous-cure instance (below) — which is a named-gate decision, not an
open-ended deferral. See PDR-100 and `feedback_owner_action_is_not_a_cure`.

## Q1 — First-out closeout-owner self-election

**The question.** When a multi-agent team winds down with no closeout owner named
at team-start, how does the team self-elect the agent who does the shared,
not-agent-specific housekeeping (close claims, refresh continuity, run the final
gate)? Worked instance: the 2026-05-22→23 team stalled at wind-down with no
agent-readable self-election mechanism, and the owner had to name the agent — a
bridge over a missing autonomy primitive (`feedback_owner_action_is_not_a_cure`).

**Candidate shapes (decide among / compose; do not pre-pick):**

1. **Broadcast-arrival precedence** — the first agent to announce intent-to-close
   in comms holds the first-out role (needs a tie-break rule).
2. **Pre-handoff-synthesis precedence** — the agent whose pre-handoff-synthesis
   broadcast has the earliest `created_at` self-elects once N members have also
   posted syntheses.
3. **Coordinator-poll** — a coordinator named at team-start retains closeout-owner
   naming authority on stand-down; otherwise fall back to a precedence rule.
4. **Explicit at-team-start declaration** — `start-right-team` requires a tentative
   closeout owner be named in the team-start broadcasts (revisable), removing the
   implicit-no-owner case entirely.

**Adjacent primitives surfaced alongside (Stormbound Spiralling Breeze):**
coordinator-discovery for arriving agents; standby-role defaults as first-class
boundaries (reviewer-dispatch / consolidation-observer / plan-file-only-follow-on);
coordinator polling responsibility for unbriefed arriving agents. The session
decides whether these are in-scope or a separate question.

**Candidate home if decided:** a `start-right-team` Closeout Contract amendment.

## Q2 — Director routing-blockage detection and cure (P6)

**The question.** Can a Director-class agent detect and cure its own
routing-blockage failure modes — hoarding implementer work, over-ceremonious
bundling, mis-classifying idle agents — *without* owner intervention, and if so
what protocol holds it? Three sub-primitives:

- **P6a — hoarding-detection**: ≥N implementer-class artefacts authored by the
  Director within window D while ≥M implementers idle → surface; cure via
  self/peer-ratification against PDR-074 ratification question Q6.
- **P6b — ceremony-over-pragmatism**: bundle-ceremony overhead across window W
  exceeds routing-unblock benefit by ratio R → surface; cure via a
  Director-authorised one-action ceremony-bypass.
- **P6c — idle-misclassification**: likely covered upstream by the comms-watch
  self-exclusion cure; confirm whether it is redundant post-cure.

**Evidence state (load-bearing):** the promotion gate — *one autonomous P6 cure* —
is **UNMET**. Two instances exist (Seaworthy 2026-05-23 11:30Z; the second
mega-commit emergency-unblock 12:36Z), but both were owner-cured, not
team-autonomously cured; the session that authored P6 demonstrated its motivating
failure twice without P6 firing once. The Velvet 10:48Z window is the
counter-example bounding over-eager detection. Thresholds (N, D, M, W, R) must be
derived empirically from the Seaworthy + Velvet sessions, not guessed.

**Adjacent gap (do not fold into P6):** the gitleaks-historical-scan blockage
(HUSKY=0 portion of the second wide-sweep) is a distinct substrate gap; capture
separately if a second instance lands.

**Candidate home if decided:** a P6 PDR (Proposed) — the substance is too large
for a rule. Cross-references PDR-074, PDR-072, `feedback_owner_action_is_not_a_cure`.

## Foundation alignment

- [PDR-100](../../../practice-core/decision-records/PDR-100-decision-debt-as-a-first-class-pillar.md)
  — decision-debt as a first-class pillar; an actionable open question routes to a
  plan, not to register decision-debt. This plan is the worked instance of that homing.
- [`principles.md`](../../../directives/principles.md) — knowledge-preservation:
  the register substance is conserved here in full before the register drained it.
- `feedback_owner_action_is_not_a_cure` — every owner bridge marks a missing
  autonomy primitive; both questions discharge against it.

## Lifecycle

Exploration status. Resolution is an owner-walked decision session per question
(or one session covering both, since they share the PDR-074 family). Evidence is
gathered through real multi-agent sessions per `n-agent-collaboration-experiments`.
On decision, each question's acceptance artefact lands (a `start-right-team`
amendment for Q1; a P6 PDR for Q2) and this plan archives per ADR-117.
