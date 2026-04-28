---
name: "Joint Agent Decision Protocol"
overview: "Implemented agent-to-agent decision protocol that goes beyond signalling: discuss, decide jointly, assign who records the decision, assign who acts on it, and close the loop. Sits alongside WS3B sidebar/escalation; addresses the phase-transition observation that 3+ agents whose threads occasionally touch break the existing async-only signalling surfaces."
isProject: false
---

# Joint Agent Decision Protocol

**Status**: IMPLEMENTED 2026-04-26 as part of the owner-approved
coordination architecture consolidation pass.
**Promotion signal**: Owner confirmed sidebars, escalation, and joint
agent decisions were already proven necessary; implementation proceeded.
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

## Implemented Direction

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

A `joint_decision` entry is not a settled commitment until the required
decider acknowledgement or owner decision is recorded. Proposed
decisions use explicit wall-clock `ack_due_at` timestamps; the workflow
default is `created_at + 24 hours`. Session-count TTLs remain out of
scope until a session-counter primitive exists.

### 2. Role-assignment vocabulary

Extend `agent-collaboration.md` with a small fixed vocabulary:

| Role | Meaning |
|---|---|
| `discusser` | Participates in pre-decision exchange; not bound to any post-decision action. |
| `decider` | Has formal say in the joint_decision. At least one decider is required; the owner may be the decider. |
| `recorder` | Owns updating the named durable artefact (plan, ADR, rule, doc, schema, etc.) to reflect the decision. |
| `actor` | Owns implementing the decision in code/config/state. |

A single agent may hold multiple roles for one decision. Each role is
explicitly assigned by name; "we'll figure it out" is not allowed.

### 3. Session-handoff close discipline

`.agent/commands/session-handoff.md` step 8 (collaboration lifecycle
close) gains a new sub-step: **for every joint_decision the exiting
agent holds an unfulfilled `recorder` or `actor` role on**, either
complete the action this session, or post a `role_handoff` decision
thread entry naming the agent or owner who takes over. The implemented
schema represents this as `joint_decision_state: "role_handoff"` with
`handoff_to` and either evidence or a durable `next_action` reference.

This prevents the "I assumed you were doing it" failure mode.

### 4. Consolidate-docs § 7e extension

The collaboration-state audit gains a sixth report:

> **Joint-decision snapshot**: enumerate joint_decision entries by status
> (`proposed`, `decided`, `recorder_pending`, `actor_pending`,
> `role_handoff`, `complete`, `abandoned`). Items with overdue
> `ack_due_at`, missing acknowledgement, missing completion evidence, or
> malformed role handoff surface as findings. Action: surface to owner,
> do not auto-resolve.

### 5. Sidebar integration

WS3B's sidebar mechanism is the natural discussion surface. A sidebar may
resolve by pointing to a `joint_decision`; joint commitments themselves
live in `joint_decision` and `joint_decision_acknowledgement` entries.
Sidebars that expire without `sidebar_resolution` surface as stale
coordination obligations during consolidation.

---

## Implementation Result

The owner explicitly confirmed that sidebars, escalation, and joint-agent
decisions were already proven necessary. This plan therefore landed in
the same coordination pass as WS3B rather than waiting for another
promotion gate. The implementation remains advisory and does not add
mechanical refusal semantics.

---

## Prerequisites

1. WS3A claim-history + decision-thread schemas landed (✅).
2. WS3B sidebar promotion gate satisfied (✅ as of 2026-04-26 — see
   [`multi-agent-collaboration-sidebar-and-escalation.plan.md`](../current/multi-agent-collaboration-sidebar-and-escalation.plan.md)).
   This plan and WS3B may land in either order; this plan reads cleaner
   if WS3B lands first because the sidebar is the canonical discussion
   surface.
3. `intent-to-commit-and-session-counter.plan.md` remains a separate
   future defence at the commit window. It was deliberately not bundled
   into this pass.

---

## Lifecycle Triggers

> See [Lifecycle Triggers component](../../templates/components/lifecycle-triggers.md)

This was multi-session, Practice-domain, schema-changing work touching:

- `conversation.schema.json` (extension to v1.1.0 or v2.0.0)
- `agent-collaboration.md` directive (role vocabulary)
- `session-handoff.md` command (role-handoff sub-step)
- `consolidate-docs.md` § 7e (joint-decision snapshot)
- `register-active-areas-at-session-open.md` rule (role-awareness at
  session-open)

Plan execution registered an active claim covering the conversation
schema, directive, command, rule, and collaboration state surfaces.

---

## Reviewer Scheduling (phase-aligned)

The implementation plan was reviewed by `assumptions-reviewer` before
landing. Future refinements should follow the standard three-phase
rhythm:

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
| **Acknowledgement requirement creates async deadlocks** — agent A proposes, agent B never sees it (different sessions, different platforms), proposal expires, no decision is made. | Use explicit wall-clock `ack_due_at`; overdue acknowledgements surface at consolidate-docs § 7e and prompt owner attention. Owner remains the final tiebreaker. |
| **Self-application paradox** — the protocol's first landing requires agreement between agents who don't yet have the protocol. | Initial landing is single-agent (the implementing agent owns recorder + actor); joint_decision is exercised on the next inter-agent coordination event after landing. |
| **Sidebar dependency** — if WS3B never lands, joint_decision lacks its canonical discussion surface. | Resolved by landing WS3B sidebars in the same implementation pass. |
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

Implementation updated the operational surfaces required for this pass:

1. `.agent/memory/operational/collaboration-state-conventions.md` — add
   the joint-decision lifecycle and role-vocabulary guidance.
2. `.agent/skills/start-right-quick/shared/start-right.md` and
   `.agent/skills/start-right-thorough/shared/start-right-thorough.md`
   — add joint-decision read at session-open ("are there any decisions
   I'm a recorder/actor on?").
3. `.agent/commands/session-handoff.md` — role-handoff sub-step under § 8.
4. `.agent/commands/consolidate-docs.md` — § 7e joint-decision snapshot.
5. `.agent/directives/agent-collaboration.md` — role vocabulary and
   channel guidance.

Practice Core / ADR propagation is a consolidation candidate, not part of
this implementation pass, unless the owner asks for a Practice Core
release.

---

## Design Decisions Landed

1. **Two new entry kinds vs one with a `participants` field**: landed as
   two kinds
   (`joint_decision` + `joint_decision_acknowledgement`).
2. **Role vocabulary granularity**: landed four roles:
   `discusser`, `decider`, `recorder`, `actor`.
3. **Acknowledgement timeout**: landed explicit wall-clock `ack_due_at`
   with workflow default `created_at + 24 hours`; no session-count TTL.
4. **Sidebar integration timing**: landed alongside WS3B.
5. **Owner-as-decider**: landed owner as a valid `decider`.

---

## Self-Application Test

The implementation pass installs examples, fixtures, and workflow
reporting. The first real inter-agent `joint_decision` recorded on this
branch should complete the full lifecycle: proposal -> acknowledgement(s)
-> decided -> recorded (durable artefact updated by named recorder) ->
acted (work landed by named actor) -> loop closed. Reference the
joint_decision ID in both the recorded artefact and the actor's commit
message when that first real event occurs.

This mirrors the WS1 self-application pilot
([`a5d33519`](../../../state/collaboration/closed-claims.archive.json))
and the intent_to_commit self-application test, while keeping
intent-to-commit out of this pass.

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
