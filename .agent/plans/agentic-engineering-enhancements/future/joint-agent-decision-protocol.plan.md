---
name: "Joint Agent Decision Protocol"
overview: "Add an agent-to-agent decision protocol that goes beyond signalling: discuss → decide jointly → assign who records the decision → assign who acts on it → close the loop. Sits alongside WS3B sidebar/escalation; addresses the phase-transition observation that 3+ agents whose threads occasionally touch break the existing async-only signalling surfaces."
isProject: false
---

# Joint Agent Decision Protocol — Strategic Plan

**Status**: 🟡 NOT STARTED (future / strategic intent)
**Promotion signal**: 🟠 EVIDENCE THRESHOLD MET (2026-04-26 owner direction
and observed phase transition; promote when implementation capacity opens)
**Domain**: Agentic Engineering Enhancements
**Parent**: [Multi-Agent Collaboration Protocol](../current/multi-agent-collaboration-protocol.plan.md) — extends WS3 family
**Related**:
[`multi-agent-collaboration-sidebar-and-escalation.plan.md`](../current/multi-agent-collaboration-sidebar-and-escalation.plan.md)
(WS3B sidebar — provides the discussion surface this plan builds decision
semantics on top of);
[`multi-agent-collaboration-decision-thread-and-claim-history.plan.md`](../archive/completed/multi-agent-collaboration-decision-thread-and-claim-history.plan.md)
(WS3A — async decision threads, the substrate kind list);
[`intent-to-commit-and-session-counter.plan.md`](intent-to-commit-and-session-counter.plan.md)
(commit-window queue; complementary defence against the same clash
taxonomy);
[`agent-collaboration.md`](../../../directives/agent-collaboration.md);
[`PDR-027`](../../../practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md)
(identity).

---

## Phase Transition Observation (2026-04-26)

Owner observation, recorded as the founding evidence for this plan:

> **The system as a whole seems to be able to handle two agents on
> well-separated threads reasonably well, but three agents whose threads
> occasionally touch has caused multiple clashes. This is a clear phase
> transition point.**

The 2026-04-26 session on `feat/otel_sentry_enhancements` carried three
agent identities with overlapping touch areas:

- **Sturdy Otter** (claude-code / claude-opus-4-7-1m) — WS3A/WS4A backlog
  cleanup, 12 commits
- **Codex** (codex / GPT-5) — concurrent learning-before-fitness
  doctrine consolidation, 30+ files in WIP, multiple commits
- **Frolicking Toast** (claude-code / claude-opus-4-7-1m) — L-IMM
  observability execution, 4+ commits to sentry-node and observability
  surfaces

In a 90-minute window the three agents produced **three lock-contention
events** (15:36, 15:43, 15:59), and the WS3A/WS4A cleanup batch surfaced
a small taxonomy of three commit-time clash types — A substitution, B
disappearance, C accretion — recorded as evidence in
[`intent-to-commit-and-session-counter.plan.md`](intent-to-commit-and-session-counter.plan.md).

The same async-only WS3A surfaces (shared communication log + claims
registry + decision threads) that were sufficient for two-thread parallel
work proved insufficient at three threads. The coordination overhead
crossed a threshold where signalling alone — "I am here, in this region,
working on this" — no longer prevented collisions; agents needed to
**discuss**, **decide jointly**, and **agree on follow-through** to
serialise their work without losing intent.

This is a phase transition: the same mechanism that scales smoothly from
1→2 agents breaks at 2→3 agents-on-touching-threads. The protocol must
add a new dimension to scale further.

---

## Problem and Intent

The WS3A surfaces install **signalling**:

- Shared log: "I noticed X" / "I'm about to do Y"
- Active claims: "I'm working on these areas now"
- Closed claims: "I finished, here's the closure evidence"
- Decision threads: "I'm requesting a decision; here's the reasoning"

These are **one-directional discovery surfaces**. They tell other agents
what the writer thinks. They do not produce **bilateral commitments**.

When three or more agents' threads touch, signalling alone produces:

1. **Latent disagreement**: agent A signals one direction, agent B signals
   another, neither sees the other in time, both proceed. A clash lands.
2. **Orphaned decisions**: a decision thread records a decision, but who
   records the durable artefact? Who implements? Who closes the loop? The
   thread name says "decision" but no protocol assigns role.
3. **Repeated re-derivation**: each clash forces fresh re-derivation
   because no joint commitment was made. Lessons captured in one agent's
   napkin don't bind another agent's behaviour.

The intent of this plan is to install a **joint-decision protocol** with
four explicit phases — **discuss → decide → record → act** — and explicit
role assignment at each phase. The protocol is advisory like all other
WS3 surfaces (per the WS3A doctrine "knowledge and communication, not
mechanical refusals"), but it produces durable bilateral artefacts that
both agents can cite when their actions diverge from the agreed plan.

---

## Proposed Direction (high-level)

Detailed design happens at promotion time; this section sketches the
shape so a future implementer can pick it up without re-deriving.

### 1. Decision-thread schema extension

WS3A's `conversation.schema.json` already has entry kinds: `message`,
`claim_update`, `decision_request`, `decision`, `resolution`, `evidence`.
Extend with two new kinds:

- `joint_decision`: a decision recorded with **two or more participating
  agent IDs**, naming the agreed action, **the recording owner** (which
  agent updates which durable artefact), and **the acting owner** (which
  agent does the work).
- `joint_decision_acknowledgement`: a peer-acknowledgement entry from
  each named participant confirming they accept their assigned role.

A `joint_decision` entry is not durable until at least one
`joint_decision_acknowledgement` from each named participant is
recorded. Until then it is a `joint_decision_proposal` (status field).
Decisions without acknowledgements expire under the standard
decision-thread staleness audit.

### 2. Role-assignment vocabulary

Extend `agent-collaboration.md` with a small fixed vocabulary:

| Role | Meaning |
|---|---|
| `discusser` | Participates in pre-decision exchange; not bound to any post-decision action. |
| `decider` | Has formal say in the joint_decision. Joint = ≥ 2 deciders. |
| `recorder` | Owns updating the named durable artefact (plan, ADR, rule, doc, schema, etc.) to reflect the decision. |
| `actor` | Owns implementing the decision in code/config/state. |

A single agent may hold multiple roles for one decision. Each role is
explicitly assigned by name; "we'll figure it out" is not allowed.

### 3. Session-handoff close discipline

`.agent/commands/session-handoff.md` step 8 (collaboration lifecycle
close) gains a new sub-step: **for every joint_decision the exiting
agent holds an unfulfilled `recorder` or `actor` role on**, either
complete the action this session, or post a `role_handoff` decision
thread entry naming the agent or owner who takes over.

This prevents the "I assumed you were doing it" failure mode.

### 4. Consolidate-docs § 7e extension

The collaboration-state audit gains a sixth report:

> **Joint-decision snapshot**: enumerate joint_decision entries by status
> (`proposal`, `decided`, `recorder_pending`, `actor_pending`, `complete`,
> `abandoned`). Items with `recorder_pending` or `actor_pending` older
> than 3 sessions surface as `[joint-decision-stalled]`. Action: surface
> to owner, do not auto-resolve.

### 5. Sidebar integration (depends on WS3B)

WS3B's sidebar mechanism is the natural discussion surface. When a
sidebar resolves with a `joint_decision`, the resolution entry MUST
name recorder and actor. Sidebars that close without role assignment are
flagged at consolidation as incomplete.

If WS3B remains paused, this plan can install a degenerate version using
only async decision threads — slower discussion, but the
decide/record/act protocol still applies.

---

## Promotion Trigger

Promote from `future/` → `current/` when **any** of:

1. Owner explicitly directs promotion. (As of 2026-04-26 the owner has
   said "this is sufficient evidence to justify the further agent
   collaboration work" — close to but not quite an explicit promotion
   instruction. Treat as evidence-met, not yet promoted.)
2. A second three-agent-touching session is observed (e.g. another
   ~90-minute window where 3+ identities edit overlapping surfaces and
   produce ≥ 2 clashes of any clash type A/B/C).
3. WS3B sidebar lands and the first real sidebar-resolved decision lacks
   a recorder/actor assignment, producing a follow-up clash.
4. A decision thread reaches `decision` kind without being acted on
   within 3 sessions, and the inaction is observably caused by ambiguous
   role assignment rather than by deliberate deferral.

Threshold reasoning: this protocol is heavier than WS3B alone, and
should not land speculatively. The phase-transition observation justifies
the future plan; an additional concrete instance justifies promotion to
`current/` for execution.

---

## Prerequisites

1. WS3A claim-history + decision-thread schemas landed (✅).
2. WS3B sidebar promotion gate satisfied (✅ as of 2026-04-26 — see
   [`multi-agent-collaboration-sidebar-and-escalation.plan.md`](../current/multi-agent-collaboration-sidebar-and-escalation.plan.md)).
   This plan and WS3B may land in either order; this plan reads cleaner
   if WS3B lands first because the sidebar is the canonical discussion
   surface.
3. `intent-to-commit-and-session-counter.plan.md` landed: complementary
   defence at the commit window. Joint-decision is the discussion-level
   defence; intent-to-commit is the commit-level defence. They protect
   against the same clash taxonomy at different layers.

---

## Lifecycle Triggers

> See [Lifecycle Triggers component](../../templates/components/lifecycle-triggers.md)

When promoted, this is multi-session, Practice-domain, schema-changing
work touching:

- `conversation.schema.json` (extension to v1.1.0 or v2.0.0)
- `agent-collaboration.md` directive (role vocabulary)
- `session-handoff.md` command (role-handoff sub-step)
- `consolidate-docs.md` § 7e (joint-decision snapshot)
- `register-active-areas-at-session-open.md` rule (role-awareness at
  session-open)

Plan execution registers an active claim covering the conversation
schema, directive, command, rule, and any rule-adapter mirrors;
self-applies the protocol (the implementing agent records joint_decision
entries with peers as the implementation lands); closes own claim with
`closure.kind: "explicit"` evidencing the decision-thread artefacts.

---

## Reviewer Scheduling (phase-aligned)

When promoted, follow the standard three-phase rhythm:

### Plan-phase (PRE-ExitPlanMode in `current/`) — challenges solution-class

- `assumptions-reviewer` — proportionality (do we genuinely need a
  fifth-and-sixth WS3A entry kind? is signalling really insufficient?
  is the role vocabulary too rigid?); blocking-legitimacy (the protocol
  is advisory; ensure no path makes it a refusal mechanism); two-agent
  vs three-agent assumption (does the phase-transition framing hold up
  under scrutiny?).
- `architecture-reviewer-betty` — cohesion/coupling: where does
  joint-decision live (decision threads, sidebar, both)? Does role
  assignment couple too tightly to identity?

### Mid-cycle (DURING execution) — challenges solution-execution

- `architecture-reviewer-wilma` — adversarial failure modes: what
  happens when a recorder forgets? When two agents claim recorder for
  the same decision? When the actor's session ends mid-action?
- `test-reviewer` — RED fixtures for the new entry kinds, the
  acknowledgement requirement, the role-handoff path.

### Close (POST-execution) — verifies coherence

- `docs-adr-reviewer` — directive, command, and consolidation surfaces
  align with the schema.
- `release-readiness-reviewer` — protocol is observable, advisory, and
  does not block other agents under any path.

---

## Risk and Tradeoffs

| Risk | Mitigation |
|---|---|
| **Protocol becomes mandatory bureaucracy** — every overlap requires a joint_decision and the cost outweighs the value. | Trigger language: joint_decision is for **bilateral commitments**, not unilateral signals. The shared log and decision threads remain the primary surfaces; joint_decision is reserved for "we both have to follow through". |
| **Role-assignment too rigid** — the four-role vocabulary can't model nuanced collaborations. | Default vocabulary is small and additive; future extensions can add roles via schema bump. The acceptance test is "does this cover the phase-transition cases observed 2026-04-26?" not "does this cover every possible coordination shape?". |
| **Acknowledgement requirement creates async deadlocks** — agent A proposes, agent B never sees it (different sessions, different platforms), proposal expires, no decision is made. | TTL-based proposal expiry (reuse intent_to_commit's session-counter primitive); proposal expiry surfaces at consolidate-docs § 7e and prompts owner attention. Owner remains the final tiebreaker. |
| **Self-application paradox** — the protocol's first landing requires agreement between agents who don't yet have the protocol. | Initial landing is single-agent (the implementing agent owns recorder + actor); joint_decision is exercised on the next inter-agent coordination event after landing. |
| **Sidebar dependency** — if WS3B never lands, joint_decision lacks its canonical discussion surface. | Plan supports degenerate async-only execution. WS3B is preferred but not required; a `joint_decision_proposal` entry on a decision thread is a valid pre-discussion artefact. |
| **Two agents on well-separated threads pay the cost** — the protocol is justified by the 3-agent phase transition; smaller setups don't need it. | Only fire `joint_decision` on **bilateral commitments**; ordinary single-agent work does not invoke this protocol. The cost only applies when the value applies. |

---

## Non-Goals

- **No mechanical refusal**. The protocol is advisory; agents may proceed
  unilaterally and accept the consequences.
- **No replacement for owner direction**. Owner is the final tiebreaker;
  joint_decision is for peer-binding, not peer-binding-as-substitute-for-owner.
- **No platform-native chat as canonical surface**. Repo-owned
  Markdown/JSON state remains the canonical record.
- **No retroactive coverage**. Existing decisions in the WS3A archive are
  not re-classified.
- **No automatic consolidation absorption**. consolidate-docs surfaces
  joint-decision state; it does not auto-resolve.
- **No N>3 design speculation**. The phase transition observed was 2→3.
  Further phase transitions (3→4, 4→N) are out of scope until evidence
  warrants them.

---

## Documentation Propagation

When promoted, update propagation surfaces:

1. `docs/architecture/architectural-decisions/119-agentic-engineering-practice.md`
   — extend artefact taxonomy with joint-decision.
2. `.agent/practice-core/practice.md` — Collaboration State surface
   names existing channels; add joint-decision when implementation lands.
3. `.agent/practice-core/CHANGELOG.md` — record schema extension and
   protocol installation.
4. `.agent/practice-core/decision-records/PDR-024-vital-integration-surfaces.md`
   — collaboration-state row extends to cover joint-decision artefacts.
5. `.agent/memory/operational/collaboration-state-conventions.md` — add
   the joint-decision lifecycle and role-vocabulary guidance.
6. `.agent/skills/start-right-quick/shared/start-right.md` and
   `.agent/skills/start-right-thorough/shared/start-right-thorough.md`
   — add joint-decision read at session-open ("are there any decisions
   I'm a recorder/actor on?").
7. `.agent/commands/session-handoff.md` — role-handoff sub-step under § 8.
8. `.agent/commands/consolidate-docs.md` — § 7e joint-decision snapshot.
9. `.agent/directives/agent-collaboration.md` — role vocabulary section.

---

## Open Design Questions

Deferred to plan-phase reviewer dispatch when promoted:

1. **Two new entry kinds vs one with a `participants` field**: cleaner
   schema vs more flexible. Default in this plan: two kinds
   (`joint_decision` + `joint_decision_acknowledgement`).
2. **Role vocabulary granularity**: 4 roles (discusser/decider/recorder/
   actor) vs 2 (decider + executor combining recorder+actor). Default: 4.
3. **Acknowledgement timeout**: does a proposal without acknowledgement
   in N sessions auto-decay, or stay live indefinitely? Default: TTL
   matches `intent_to_commit.ttl_sessions` (3 sessions).
4. **Sidebar integration timing**: land joint-decision before, after,
   or alongside WS3B sidebar? Default: prefer WS3B first, but allow
   degenerate async-only joint-decision.
5. **Owner-as-decider**: can the owner be a `decider` on a
   joint_decision, or only as the final tiebreaker after peer agreement
   fails? Default: owner can be a decider; useful when owner is in the
   conversation.

---

## Self-Application Test

When implemented, the very first joint_decision recorded on this branch
or any future branch MUST involve at least two agents and complete the
full lifecycle: proposal → acknowledgement(s) → decided → recorded
(durable artefact updated by named recorder) → acted (work landed by
named actor) → loop closed. Reference the joint_decision ID in both
the recorded artefact and the actor's commit message.

This mirrors the WS1 self-application pilot
([`a5d33519`](../../../state/collaboration/closed-claims.archive.json))
and the intent_to_commit self-application test.

---

## Connection to Three-Agent Phase Transition

This plan exists because the WS3A async-only signalling surfaces, while
sufficient for 1→2-agent collaboration on separated threads, exhibited
visible failure modes once a third agent's thread occasionally touched
the others'. The clashes were not failures of intent but failures of
**bilateral commitment**: two agents independently doing the locally-
correct thing produced globally-incorrect outcomes because neither had
agreed with the other on who would do what.

Joint-decision is the protocol that makes "we agreed" durable, with
explicit role assignment so "who follows through" is not ambiguous.

This is the natural next layer above signalling and above sidebar
discussion: **commit jointly, with role assignment, observable follow-
through, and structured stale-detection**.

---

## Dependencies

**Blocking**: WS3A landed (✅). WS3B sidebar lands (in progress, gate
satisfied 2026-04-26).

**Related plans**:

- [WS3B Sidebar and Escalation](../current/multi-agent-collaboration-sidebar-and-escalation.plan.md)
  — sibling; sidebar is the canonical discussion surface this plan
  builds joint-decision semantics on top of.
- [intent-to-commit + session counter](intent-to-commit-and-session-counter.plan.md)
  — complementary; commit-window defence to this plan's
  discussion-window defence. Both target the same clash taxonomy at
  different layers.
- [Multi-Agent Collaboration Protocol parent](../current/multi-agent-collaboration-protocol.plan.md)
  — parent; this is an evidence-driven extension of WS3.

---

## Promotion Checklist

When promoted to `current/`:

- [ ] Move file from `future/` to `current/`; rename if scope tightens.
- [ ] Add Phase 0 owner gates (role-vocabulary granularity, sidebar
      integration timing) — resolve via `assumptions-reviewer` +
      `architecture-reviewer-betty` dispatch before WS1.
- [ ] Add WS1 RED fixtures for the schema extension and
      acknowledgement-required path.
- [ ] Update parent
      [`multi-agent-collaboration-protocol.plan.md`](../current/multi-agent-collaboration-protocol.plan.md)
      to reference this child as a WS3 family extension.
- [ ] Update collection
      [`README.md`](../current/README.md) and
      [`roadmap.md`](../roadmap.md) with the lane entry.
- [ ] Move this plan's listing in the [`future/README.md`](README.md)
      to "Promoted to `current/` <date>" form.
