# Falsification Criteria for the N-Agent Collaboration Hypothesis

**Companion to**: [`hypothesis.md`](hypothesis.md)

For each primitive, three observations are named:

- **Falsifies** — observation that, if reproduced, invalidates the
  primitive's claim. Refute it; replace or remove.
- **Weakens** — observation that motivates an amendment but not removal.
  Capture in napkin; route to an amendment cycle.
- **Strengthens** — observation that adds evidence. Move the primitive
  closer to graduation candidacy.

A primitive that has accumulated multiple strengthening observations
across multiple sessions and pairings, with zero falsifying observations,
is a graduation candidate. A primitive that has accumulated multiple
falsifying observations is removed from `hypothesis.md` and the
replacement (if any) is named.

---

## P1 — Modes, not roles

**Claim**: agents occupy *functions* for *units of work*, not territorial
roles. Mode transitions are recorded in the comms log.

- **Falsifies**: at N≥3, an agent refuses to enter a needed mode (e.g.,
  declines to switch from Orchestrator to Executor when work shape
  demands it), AND the refusal blocks progress. Indicates territorial
  roles are operating despite the mode framing. **Also falsifies (added
  2026-05-14)**: across N≥3 multi-agent sessions on the same thread,
  one or more role labels (e.g., `controller`, `marshal`, `reviewer`,
  `scout`, `standby`, `consolidator`) consistently re-emerge despite the
  pressure shape changing — evidence the labels are stable enough to be
  territorial rather than transient. If this happens, the
  [coordinator-PDR candidate in pending-graduations.md](../../memory/operational/pending-graduations.md)
  becomes promotable on its own evidence (with the persistent labels
  named explicitly), but P1's claim that all coordination is mode-not-role
  is falsified for those labels.
- **Weakens**: mode transitions occur but are systematically not
  recorded in the comms log. Suggests the mode model is correct but the
  recording discipline is unsupported (needs an explicit transition
  event type). **Also weakens (added 2026-05-14)**: a role label proposed
  for transient use during one session is reused by a different agent in
  a later session on the same thread without explicit re-justification
  from live pressure — calcification by inheritance rather than by
  pressure recurrence. The mode model still holds, but the
  pressure-to-label mapping needs an explicit per-session derivation
  ritual to prevent silent label propagation.
- **Strengthens**: an agent fluidly moves through three or more modes in
  a single session, with each transition surfaced via comms event, and
  the peer agent reads the transition correctly without coordination
  cost. **Also strengthens (added 2026-05-14)**: across the
  [`start-right-team`](../../skills/start-right-team/SKILL-CANONICAL.md)
  experiment at N≥3 multi-agent sessions, role labels chosen by agents
  emerge from the named coordination pressure each time, dissolve when
  the pressure ends, and **vary across sessions on the same thread when
  the work shape changes** — i.e. labels are downstream of pressure, not
  upstream. This strengthening pattern is the evidence base that would
  let the coordinator-PDR candidate graduate as a *pressure-to-role
  mapping protocol* PDR rather than as a fixed-role-set PDR.

**Co-tested PDR candidate** (added 2026-05-14): the pending
[coordinator-role-as-allocator-not-gatekeeper PDR candidate](../../memory/operational/pending-graduations.md#entries)
in the graduations register is held back from promotion until P1
falsification criteria above produce stable evidence. Both the PDR
candidate and P1 are claims about the same substrate phenomenon — how
agents coordinate work without territorial role assignment — but the
PDR candidate names a *concrete role-set* and P1 names a *generative
principle*. Graduation order matters: if the PDR's role-set graduates
before P1 matures, future agents read the role-set as canonical
topology (P1's failure mode); if P1 matures first, the PDR can graduate
in whichever shape the evidence supports. Capture observations during
multi-agent sessions in `napkin.md` tagged with the affected primitive
and the role labels actually used.

## P2 — Identity-without-negotiation

**Claim**: PDR-027 deterministic identity from session seed; no
name-collision protocol needed.

- **Falsifies**: two concurrent sessions resolve to the same `agent_name`
  AND `session_id_prefix`, producing genuine ambiguity in the comms log
  or claims registry.
- **Weakens**: human readers (owner, future agents) cannot distinguish
  agents by `agent_name` alone (e.g., two "Misty"s a week apart) and
  must always cite `session_id_prefix` to disambiguate.
- **Strengthens**: N≥3 sessions across multiple platform pairings
  produce zero identity collisions and zero negotiation overhead.

## P3 — Active-claims registry as discovery primitive

**Claim**: overlap detection via shared JSON registry; advisory rather
than mechanical refusal.

- **Falsifies**: at N≥4, "knowledge and communication, not mechanical
  refusals" produces chronic deadlock OR duplicate-work, AND the
  resolution requires owner intervention. Indicates a tie-breaker is
  required for the registry to function at scale.
- **Weakens**: agents systematically over-claim or under-claim, OR the
  `area_kind` taxonomy proves insufficient for the actual workspace
  shape encountered. Amendment to the schema or claim-shape doctrine.
- **Strengthens**: N≥3 sessions show overlap detected and resolved via
  comms log without owner intervention; the advisory model holds.

## P4 — Atomic-isolated task offers

**Claim**: scope + acceptance + output format and path + word/scope cap +
overflow protocol is the minimum viable shape.

- **Falsifies**: a class of work *cannot* be decomposed into
  atomic-isolated units (e.g., open-ended exploratory research that
  needs run-and-redirect cadence), AND no decomposition trick recovers
  it. Indicates the primitive does not generalise across work shapes.
- **Weakens**: atomic-isolated tasks succeed but the overflow protocol
  is rarely invoked (suggesting it is over-cautious) or is invoked
  without the receiving agent being able to recover (suggesting the
  semantics are underspecified).
- **Strengthens**: N≥3 sessions show task decomposition working across
  multiple work shapes (research, design, implementation, review) with
  the same minimum-viable offer template.

## P5 — Comms log with directional context

**Claim**: `audience` and `in_response_to` extension fields give events
routing context, not just chronology.

- **Falsifies**: at N≥3, agents systematically miss events targeted at
  them OR systematically read events not targeted at them, indicating
  the audience semantics do not scale to per-agent filtering.
- **Weakens**: the rendered log becomes unreadable at moderate volume
  (e.g., 50+ events per session) because audience and in_response_to
  are dropped on render. Renderer change required (already named as
  cure (vii)).
- **Strengthens**: at N≥3, conversation threads via `in_response_to`
  chains remain navigable, and audience-targeted events reach the
  intended recipient without owner mediation.

## P6 — Failure-shaped ceremonies

**Claim**: every load-bearing discipline maps to a specific observed
failure; the list evolves as new failures are captured and old ones
graduate to schema or tooling.

- **Falsifies**: new failure modes emerge faster than ceremonies can be
  derived — the protocol enters whack-a-mole. Indicates the
  failure-shaped approach is not generative; a different design method
  is needed.
- **Weakens**: ceremonies accumulate without graduating out (e.g.,
  cures (i)–(x) sit in pending-graduations indefinitely). The
  evolution loop is broken; the ceremony list grows to a size that
  cannot be honoured.
- **Strengthens**: at least one cure graduates to schema, tooling, or
  permanent rule per N=3+ session, and the ceremony list shrinks
  proportionally as it grows.

## P7 — Bootstrap fast-path

**Claim**: degenerate boundary condition for N=1 (or "first agent in"
before peers join). Single comms-event note + proceed.

- **Falsifies**: the first-in agent's bootstrap-fast-path actions
  produce inconsistent state when the peer joins (e.g., events
  posted before peer arrival cannot be reconciled with peer-posted
  events). Indicates the join-after-bootstrap reconciliation is
  non-trivial and the fast-path is unsafe.
- **Weakens**: the fast-path works but produces noise the peer must
  filter (e.g., session-open events that are no longer relevant when
  the peer arrives). Filter or rotation discipline needed.
- **Strengthens**: the first-in agent proceeds, the peer joins later,
  and the merged state is internally consistent without manual
  reconciliation.

## P8 — Verification ceremony

**Claim**: counter to the "skim is indistinguishable from a read"
failure mode; the receiving agent posts specific verified facts from
each linked artefact before first edit.

- **Falsifies**: agents post the verification ceremony but the facts
  cited are paraphrases of titles or generic summaries, not specific
  content, AND the agent subsequently makes a mistake the cited fact
  should have prevented. Indicates the ceremony is performative, not
  load-bearing.
- **Weakens**: the ceremony adds significant time-to-first-edit
  without measurably reducing failure rate. Cost-benefit re-evaluation
  needed.
- **Strengthens**: an agent's verification ceremony catches an
  outdated artefact reference OR surfaces a question that prevents a
  downstream failure.

## P9 — Pending-graduations register

**Claim**: explicit mechanism for the hypothesis itself to evolve.
Cures captured here graduate to permanent doctrine only after empirical
validation at N≥3.

- **Falsifies**: cures graduate from the register without empirical
  validation (e.g., based on owner direction alone, without
  multi-session evidence), AND the graduated doctrine fails when
  exercised at scale. Indicates the register is a one-way valve for
  ideas rather than a hypothesis-evolution mechanism.
- **Weakens**: the register grows without throughput — cures pile up
  and consolidation never reaches them. Indicates the graduation
  mechanism is operating below the rate cures are captured.
- **Strengthens**: at consolidate-docs, at least one cure graduates
  per pass with clear evidence-based rationale; the register
  oscillates between captured and graduated rather than monotonically
  growing.

## P10 — Cheap self-correction

**Claim**: protocol failures are routine and reversible because no
commits land mid-task.

- **Falsifies**: a protocol failure produces a state that cannot be
  reversed without owner intervention OR without losing work; the
  self-correction property does not hold in the failure mode.
- **Weakens**: self-correction is possible but expensive — multiple
  comms events, working-tree gymnastics, rollback ceremony that
  consumes a meaningful fraction of session time.
- **Strengthens**: a protocol failure is corrected in under one minute
  with no loss of work, and the peer's acknowledgement is collegial
  rather than corrective.

## P11 — Housekeeping ownership at session-close

**Captured**: 2026-05-03 (Woodland Sprouting Glade + Prismatic
Illuminating Eclipse parallel session; owner-stated experiment
observation).

**Claim**: at session-close some housekeeping is *agent-specific*
(own observations in napkin, identity-row last_session refresh, claim
close, subjective experience file) and can ONLY be done by the
originating agent. Other housekeeping is *not agent-specific* (refresh
repo-continuity.md, refresh pending-graduations register, sweep
platform entry points, commit prior-session leftover continuity files,
run consolidation gate) and needs explicit ownership to avoid the
"everyone assumes someone else owns it" failure mode. The cure shape:
when an Orchestrator role is assigned, the Orchestrator owns shared /
not-agent-specific housekeeping; when no Orchestrator is assigned,
the **last-to-leave** rule applies (final committing agent picks up
shared housekeeping). Agent-specific housekeeping remains the
originating agent's responsibility regardless.

- **Falsifies**: multiple parallel sessions stall on housekeeping in
  shared surfaces — everyone treats shared = orchestrator's = "not
  mine"; the rule produces the same accumulation it was meant to
  prevent. OR prior-session leftover files persist across multiple
  sessions despite the rule being in force.
- **Weakens**: the rule produces friction by asking the Orchestrator
  to absorb context they don't have for prior-session edits;
  Orchestrator becomes a bottleneck rather than a clearing-house;
  no-Orchestrator sessions are unclear which agent counts as
  last-to-leave.
- **Strengthens**: a session-close handoff completes with no
  leftover-modified-files state crossing the session boundary AND the
  Orchestrator (or last-to-leave) explicitly owned the shared
  housekeeping; new agents joining the thread find continuity surfaces
  fresh without needing to investigate stale state.

**Recording**: append `[E1]` napkin entry naming explicit P11
observations: who owned shared housekeeping this session, whether any
leftover-modified-files state crossed the session boundary, and any
friction the rule produced. P11 is candidate; not yet
graduation-ripe; first instance witnessed in this session's handoff.

---

## Falsification process

When an agent observes a falsifying or weakening event:

1. Capture the observation in `.agent/memory/active/napkin.md` per the
   structured surprise format (expected / observed / why surprising /
   generator / cure shape).
2. Amend the relevant primitive in this file with a citation to the
   napkin entry, dated.
3. If falsifying: draft a replacement primitive (or argue for removal)
   and post a comms event proposing the change.
4. If weakening: draft an amendment to the primitive and post a comms
   event proposing the change.
5. The amendment is approved at the next consolidate-docs § graduation
   scan, OR via owner direction within the session if the failure is
   blocking.

A strengthening observation requires no immediate action; observations
accumulate until the primitive becomes a graduation candidate (multiple
sessions, multiple pairings, zero falsifying observations).

## Open falsification questions

These are aspects of primitives the criteria above do not yet cover and
should be addressed before the next experiment if possible:

- What counts as "evidence" — is one anecdotal observation enough to
  falsify, or do we require multiple instances? Current default:
  treat single observations as weakening evidence; require two to
  three instances across distinct sessions to falsify.
- Who decides — the agent who observed, the owner, both? Current
  default: agent captures and proposes; owner approves graduation or
  removal.
- What is the rollback for a falsified primitive that has already
  graduated to ADR/PDR? Currently undefined; needs explicit handling
  before the first graduation event.

End. Amendments to falsification criteria themselves are also captured
here; the criteria evolve with the primitives.
