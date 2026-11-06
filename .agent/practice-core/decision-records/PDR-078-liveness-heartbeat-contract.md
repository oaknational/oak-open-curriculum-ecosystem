---
pdr_kind: contract
---

# PDR-078: Liveness-Heartbeat Contract

**Status**: Accepted (amended 2026-09-25 — §3 recovers a silent seat's
claims without PDR-063's five steps, which start only on the owner's call)
**Date**: 2026-05-24
**Adopted**: 2026-05-25
**Related**:
[PDR-027](PDR-027-threads-sessions-and-agent-identity.md)
(threads, sessions, and agent identity — the heartbeat subject
line carries the identity tuple this PDR's identity-rendering
discipline binds to);
[PDR-063](PDR-063-mid-cycle-retirement-protocol.md)
(mid-cycle retirement protocol — an owner-called handoff of a
heartbeat-emitting role uses its per-cycle handoff substrate; this
contract's retirement threshold detects a silent retirement);
[PDR-064](PDR-064-coordinator-handoff-two-moments.md)
(coordinator handoff two-moments — the coordinator-handoff grace
window is one of the named heartbeat-exemption classes; the
contract defers to PDR-064 for the boundary specification);
[PDR-079](PDR-079-pdr-vs-adr-portability-distinction.md)
(PDR-vs-ADR portability distinction — this PDR is authored under
PDR-079's portability rule: the contract is portable; the
repo-bound phenotype that operationalises it lives in a separate
ADR, named in the practice-index bridge rather than linked from
this body);
[PDR-133](PDR-133-liveness-classes-and-platform-declaration.md)
(liveness classes and the platform declaration — the class frame
this contract sits inside: this record is the depth treatment of
the `EMIT` class and additionally owns `PROGRESS`'s stall
diagnostic and the absence machinery PDR-133 §9 depends on; this
reciprocal pointer landed at PDR-133's ratification, 2026-07-25,
per its §Cascade);
the host repository's comms-event heartbeat lifecycle decision (the repo-bound phenotype
substrate that operationalises this contract in the current host repository — heartbeat
events bind to the comms-event substrate's `lifecycle` kind with
`event_type='heartbeat'`, rendering via the comms-event tag namespace's
`[HEARTBEAT]` token; named by its concept, never its identifier, per PDR-079's
PDR↔ADR cross-reference discipline as amended 2026-09-28).

## Context

Multi-agent operation under bounded per-agent context budgets
depends on the team being able to distinguish an agent that has
gone quiet from an agent that is actively working but not
broadcasting. Without a structural liveness signal, peers cannot
tell when a role has retired silently; coordination falls back to
out-of-band signals (owner intervention, manual roster sweeps)
that scale poorly and burn owner attention.

The cure is a portable liveness-heartbeat contract: every active
agent emits a periodic heartbeat event into the shared comms-event
substrate; peers and tooling consume heartbeats as the canonical
signal of "this agent is still active." Quietness past a named
threshold is itself a signal: the role is unobserved-live and the
team treats it as retired-pending-confirmation.

Two distinct failure modes shaped the contract:

1. **Heartbeat redundancy under busy work.** A role doing
   substantive work emits substantive events frequently. A cron
   heartbeat firing on top of substantive activity wastes
   substrate volume and noises the comms surface. The contract
   names a redundancy rule that suppresses the heartbeat when a
   substantive event from the same role has fired recently.
   (That clause — §2 — was retired 2026-08-02; the substrate
   economy it was written for is now carried reader-side.)

2. **Heartbeat blockage during legitimate quiet windows.** Some
   work shapes legitimately exceed the heartbeat cadence between
   substantive events — sub-agent dispatch waiting on
   verdict-synthesis, marshal-cycle contiguous-execution against
   the gate-chain, coordinator-handoff role-transition between
   the two moments. The contract names exemption classes so the
   threshold does not falsely retire a role that is legitimately
   quiet for a known reason.

## Decision

The Liveness-Heartbeat Contract has seven named clauses. Clauses 5,
6, and 7 were added by later amendments; see §Revision history.

### 1. Emit-side: cadence

Every actively-seated role emits a heartbeat event at a default
cadence not exceeding four minutes. The cadence is per-role, not
per-agent — a single agent holding multiple roles emits one
heartbeat per role per cadence window, with the role named in the
event metadata.

The heartbeat event:

- Carries the emitter's identity tuple (agent name + canonical
  identifier) in the event subject.
- Carries a one-line posture summary in the event body
  (current intent, active claim identifier where applicable,
  branch state where applicable).
- Is tagged with the canonical heartbeat tag so consumers can
  filter heartbeats from substantive events at the namespace
  layer.

### 2. Emit-side: cron-redundancy rule — RETIRED 2026-08-02

RETIRED by owner-carded disposition (2026-08-02, applying the
latest-schema-only/enacted-truth review of accepted-but-unenacted
obligations). The clause required suppressing a scheduled heartbeat
when the same role-identity had authored a substantive comms event
within the cadence window. In fourteen weeks of operation it was
never enacted: the operational rule (`liveness-heartbeat-cron`)
prescribes unconditional emission on both liveness surfaces every
tick, no suppression predicate exists in tooling, and this clause's
own falsifiability axis described exactly that inconsistency.
Doctrine now follows the enacted truth: emit every tick;
substrate volume is cheap and reader-side filtering
(heartbeat-excluded watchers paired with the freshness poll)
carries the economy instead. A suppression predicate would add a
failure mode to a liveness-critical path to save substrate that
readers already filter. Retirement changes no category boundary:
§5's substantive-vs-heartbeat distinction stands on its own, and
the former text remains above for the record.

### 3. Observe-side: retirement threshold

A role that has emitted no event (heartbeat or substantive) for
a threshold-class window exceeding ten minutes is treated by
peers as **retired-pending-confirmation**. The team's next move
is silent-seat recovery: any open claim is disposed per the host
liveness rule's per-claim disposition (a claim carrying a handoff
record goes to the agent it names; one without is orphan-class and
routed). PDR-063's five steps do not run, because no live seat is
there to run them. The role-class authority transfers per its own
role-transition shape (per
PDR-064 for coordinator class; per the marshal cycle-discipline
PDR for marshal class; ad hoc otherwise).

The threshold is a soft signal, not an immediate retirement
decision. Owner direction overrides; peer judgement may extend
the window when a role is known to be in a long-execution
exemption phase (see Exemptions below).

### 4. Exemptions

Three **threshold-suspension** exemptions suspend the threshold
without suspending the cadence rule:

- **Coordinator-handoff grace window** — between the
  pre-positioning event and the active-acknowledgement event
  (per PDR-064), the outgoing coordinator's heartbeat is paused
  by design. The threshold extends to cover the window's
  expected duration; peers do not retire the outgoing role
  before active-acknowledgement transfers authority.
- **Marshal-cycle contiguous-execution** — a marshal seat
  executing a cycle (stage, gate-chain, commit, broadcast) holds
  contiguous focus that the cadence may exceed. The threshold
  defers until the marshal emits the cycle-boundary tree-green
  broadcast or the cycle abandons.
- **Sub-agent dispatch verdict-synthesis** — an agent waiting
  on a sub-agent reviewer's verdict synthesis cannot
  meaningfully emit substantive events until the verdict
  returns. The threshold defers until the sub-agent returns or
  the dispatching agent abandons the dispatch.

These three exemption windows MUST be observable on the
comms-event substrate before the threshold fires — the outgoing
pre-positioning event for the coordinator-grace exemption; the
marshal-request event for the marshal-cycle exemption; the
sub-agent dispatch event for the verdict-synthesis exemption.
Without an observable opening event, the exemption does not
apply and the threshold fires normally.

A fourth exemption, added 2026-06-15, is **categorically
different**: it suspends heartbeat **emission itself** (§1), not
merely the threshold, because it fires on *consumer-absence*
rather than a quiet work-window.

- **Consumer-absent (no observing peer)** — the heartbeat's sole
  consumer is *async* retirement-detection by peers (silence
  drives claim auto-rebalance). When no such consumer exists, the
  emission has no reader and is suspended. Two observable shapes
  qualify: a **solo session** (the active-claims registry shows no
  other participant who would consume the signal), and a
  **live-conductor session** where retirement is detected directly
  by an owner or coordinator from ground-truth surfaces (git, the
  registry, `gh`) rather than from the heartbeat stream. The
  exemption is self-healing: the moment a consuming peer appears,
  or the conductor goes async, or the cast rotates, the consumer
  reappears and emission resumes on cadence. The threshold (§3) is
  moot under this exemption because there is no peer applying it.

The consumer-absent exemption is observable on the *same*
substrate-as-canonical-truth basis as the three above: the
opening fact is the active-claims / comms registry showing no
consuming peer (solo, or a live conductor with no async peers).
It must not be claimed to defend a missed heartbeat once a
consuming peer is present — presence of a consumer re-arms both
emission and threshold. This exemption generalises the variable
the n=2 mode (PDR-082) first scoped from *team-size* to
*consumer-presence*: n=2 owner-visible mode is the special case
where chat-visibility makes the async-detection consumer absent.

A fifth exemption, added 2026-09-06, is a **declared-state** class:
it suspends both emission and the threshold for a seat the owner
has stood down by word, and it is distinguished from silence by
its opening event.

- **Owner-word stand-down (paused seat)** — a seat the owner has
  paused by word (an overnight stand-down, a declared sleep, a
  "stop all processes" at a compaction boundary) stops its
  heartbeat and its watcher BY INTENT, emits a final heartbeat-end
  event naming the owner's word and the stand-down, and RETAINS
  its claim (with a handoff record attached when work is in
  flight). For every peer reading the stream, staleness past that
  event is the declared state, not a retirement signal: the
  threshold does not fire on it, no peer adopts the claim, and the
  seat resumes only at the owner's next word, re-arming its watcher
  and then its heartbeat before its first act. In a paused team the
  coordinator stands down last and resumes first. The opening event
  is the heartbeat-end that names the owner's word; without it the
  exemption does not apply and the threshold fires normally. A host
  whose machine readers (the liveness classifier, the stale-claim
  sweep) do not yet read the opening event will archive the
  retained claim at its freshness expiry; that sweep is loss-free
  when the handoff record carries the work and the resuming seat
  re-opens from the archived row, and the host names the gap as a
  tooling item until the paused state is machine-readable. Graduated on five instances between
  2026-08-17 (an overnight cold-pause of three seats, coordinator
  last) and 2026-09-06 (compaction-boundary stand-downs at owner
  word), with a declared week-sleep and an owner-word pause of a
  second seat between; the host liveness rule carries the
  operational form, the instance list and the seat-state
  vocabulary.

### 5. Substrate category: heartbeats are liveness infrastructure

Heartbeat events are categorically **liveness-signal
infrastructure**, not a delivery substrate for inter-agent
content. The category is invariant and stands on its own: it
held while the cron-redundancy rule (§2) governed the cadence
relationship between heartbeats and substantive events, and it
holds unchanged now that clause is retired (2026-08-02) and
heartbeats emit on cadence regardless.

Two consequences flow from the category invariant:

- **Substantive content does not become a heartbeat by
  tagging.** An agent with a query, decision, sidebar request,
  acknowledgement, or any peer-directed content MUST emit it
  via the appropriate event class (broadcast, directed,
  acknowledgement). Re-tagging such an event as a heartbeat to
  satisfy cadence is forbidden; the cadence-scheduled heartbeat
  fires on its own tick regardless, so the tag-overload pattern
  serves no liveness purpose and corrupts both surfaces.
- **Heartbeat events do not carry substantive payloads.** The
  one-line posture summary named in §1 binds mechanically to
  current state (active claim identifier, current intent label,
  branch state). It is read by tooling computing the
  retirement threshold (§3) and by peers confirming a role is
  observed-live. It is not a free-form delivery channel for
  peer-directed content; if substantive content arises, the
  agent emits the appropriate event class and the scheduled
  heartbeat continues on cadence alongside it.

The category is portable: any host implementing this contract
applies the same invariant on its own comms-event substrate,
independent of the canonical heartbeat tag-token the
repo-bound phenotype ADR chooses.

### 6. Observe-side: heartbeat-only stall diagnostic

A role that continues emitting heartbeat events but emits no
substantive event for two consecutive cadence windows is not
retired-pending-confirmation; it is
alive-but-stalled-pending-coordination. Heartbeats prove the
scheduler/liveness loop, not main-loop attention or lane progress.

The observer move is:

- send a direct ping naming the missing substantive progress and
  expected reply window, defaulting to one heartbeat cadence;
- if no reply lands, broadcast takeover or route-adjustment intent
  with rationale;
- only then act on lane takeover or reroute, respecting owner
  direction and active claims.

An owner-reroute broadcast or other narrative event resets this
diagnostic because it proves main-loop attention and changes the
peer's interpretation of silence.

### 7. Emit-side: loop hygiene

The scheduling loop that emits heartbeats follows four hygiene rules,
each graduated from a worked failure:

- **Posture derives from current state at emit time, never baked at
  arm time.** A loop armed with a fixed lane/branch/intent label
  misreports for as long as it runs after the underlying state moves;
  re-derive every posture field per tick, and re-label explicitly at
  every lane or role transition (worked twice: a lane renamed under a
  running loop; a coordinator loop emitting a stale branch name for
  hours after its holder had moved).
- **One timestamp per tick.** Deriving "now" more than once in a tick
  races clock boundaries — a substrate correctly rejected an event
  whose created-at sat in the future of its sibling field. Derive the
  timestamp once and pass it to every field that needs it.
- **Stop the loop FIRST, then emit the end-of-heartbeat event.** The
  reverse order lets a scheduled tick fire after the end event and
  contradict it.
- **Capture stderr on the loop's failure path.** A loop that swallows
  stderr surfaces its own failures as an undiagnosable bare failure
  line; the failure line must carry the underlying error text.

## Mechanism

The contract operates on the existing comms-event substrate
without introducing a new event schema. The repo-bound
phenotype ADR (named in the practice-index bridge) chooses the
specific event kind, discriminator field, and render-token
shape for heartbeat events. The emit-side cadence is enforced
by per-host scheduling (cron, timer, scheduled-task primitive
— host-local choice); the observe-side threshold is enforced
by per-host watcher tooling that tails the comms-event stream
and applies the threshold window per identity-row.

The contract names the boundary discipline (cadence, threshold,
exemptions) and the substrate-shape invariants
(comms-event stream + identity tuple + a host-chosen canonical
heartbeat discriminator). The host-specific implementation
(which event kind, which discriminator field, which scheduler,
which watcher, how the threshold is rendered to peers, which
CLI surfaces emit and consume heartbeats) lives in a repo-bound
phenotype ADR recorded in the practice-index bridge, not in
this PDR body.

## Cascade

This PDR carries downstream amendments at the implementation
side, not at the contract side:

- The repo-bound phenotype ADR (named in the practice-index
  bridge) records the host's choice of scheduler, watcher,
  event schema, and CLI integration. The ADR is the repo-bound
  counterpart to this portable contract; the contract is
  unchanged when the host substrate evolves.
- Host SKILL surfaces (the start-right surfaces, the
  closeout-contract surfaces) reference this contract by PDR
  identifier when prescribing heartbeat emission and retirement
  threshold handling. The SKILL surfaces are not themselves
  amended by this PDR; the citation is a forward-pointing
  reference each SKILL absorbs in its own landing cycle.

## Notes

### Identity rendering on heartbeat subjects

A heartbeat event's subject line carries the emitting role's
identity tuple (agent name plus canonical identifier per
PDR-027 + PDR-076a). The identity tuple is the routing-key for
peers consuming heartbeats; the subject-line rendering is the
chat-readable short form. Two roles held by the same agent
emit two distinct heartbeats per window.

### Exemption observability discipline

Each exemption fires against an opening event already present
in the substrate. This is the substrate-as-canonical-truth
discipline applied to the heartbeat surface: exemptions cannot
be claimed retroactively to defend a missed heartbeat; the
opening event must precede the heartbeat-miss.

### Threshold tolerance

Ten minutes is a default. Per-host adjustment is permitted when
the host's overall work-shape mix has a different
substantive-event base rate, but the rule shape (cadence,
threshold, exemption discipline) is portable. The default is
calibrated against multi-agent windows where most work emits a
substantive event in less than ten minutes; if the host's work
shape diverges, the threshold widens proportionately.

### Forward-extensible exemption list

The named exemptions are the observed-class set (three
threshold-suspension classes; one emit-side consumer-absent
class; one declared-state owner-word stand-down class, graduated
2026-09-06). New exemption classes graduate from worked-instance
evidence via the host's pending-graduations discipline; the
contract is updated as exemption classes graduate, not pre-empted
with hypothetical classes. The consumer-absent class graduated
2026-06-15 on two instances — the PR-115 n=2 owner-visible session
(PDR-082 §Context) and a Director session whose heartbeat cron ran
a whole owner-present window with zero observed consumers (every
stall/retirement judgement used ground-truth reads, not peers'
heartbeats; both implementer lanes ran heartbeat-cron-free and
closed clean) — closing the gate the value-contingency rule and
`liveness-heartbeat-cron` had held open as "a working hypothesis on
PDR-082's second-instance path."

## Consequences

### Enables

- A portable liveness signal that any host adopting this
  contract can implement against its own scheduler, watcher,
  and event-stream substrate.
- A non-noisy heartbeat surface: heartbeats emit on cadence and
  reader-side filtering (heartbeat-excluded watchers paired with
  the freshness poll) keeps the substantive surface clean;
  unobserved quiet retires.
- A bounded threshold mechanism that peers can apply
  consistently without per-role disambiguation: every role
  that opens an exemption-class window emits the opening event;
  every role outside an exemption is subject to the threshold.

### Forbids

- Heartbeat emission without identity-tuple rendering on the
  subject line.
- Retroactive exemption claims (claiming an exemption after a
  threshold-firing has already begun without a substrate
  opening event).
- Substituting a non-comms-event substrate for the canonical
  heartbeat surface (separate log files, side channels,
  out-of-band claims). Liveness lives on the comms-event stream
  per PDR-066.
- Tagging a substantive comms event (broadcast, directed,
  acknowledgement) with the canonical heartbeat tag to satisfy
  cadence. Per §5, heartbeat substrate is liveness
  infrastructure; substantive events never become heartbeats by
  tag (§2's suppression coupling is retired — heartbeats emit on
  cadence regardless).
- Embedding substantive payloads (peer queries, decision
  prompts, sidebar requests, escalation triggers) in heartbeat
  event bodies. Per §5, the heartbeat body binds mechanically
  to current state; substantive content emits via the
  appropriate event class (the on-cadence heartbeat simply
  continues alongside it).
- Treating heartbeat presence alone as proof that the role is
  actively processing its coordinated lane when no substantive
  event has landed for two or more cadence windows. Per §6, that
  state is alive-but-stalled-pending-coordination and needs a
  direct ping before takeover or route adjustment.

### Accepted Costs

- Substrate volume from periodic heartbeats. Bounded by the
  cadence itself (one event per role per window, §1) and absorbed
  by reader-side filtering; observed cost is acceptable against
  the liveness signal it provides.
- Per-host implementation work: scheduler + watcher + filter on
  the canonical heartbeat tag. The host phenotype ADR records
  the chosen implementation.

## Falsifiability

This contract is falsifiable on seven axes:

- (Axis retired with §2, 2026-08-02 — it measured suppression
  consistency for a clause that never reached tooling; its firing
  condition was the standing state, which is what retired the
  clause. A role actively working yet read as retired now
  indicates an observe-side or emitter defect, covered below.)
- A role legitimately quiet under a named exemption whose
  threshold fires anyway — direct evidence the exemption-
  observability discipline is breaking down (opening events
  not being emitted or not being read).
- Substrate-volume cost from heartbeats consistently dominating
  the substantive-event volume over a long observation window —
  evidence the cadence is mis-calibrated and the rule shape
  needs adjustment.
- A heartbeat surface populated with substantive content
  (peer-directed queries, decision prompts, sidebar requests)
  or substantive events repeatedly tagged as heartbeats —
  direct evidence the substrate-category invariant (§5) is
  not holding.
- A role emitting heartbeat-only output for two or more cadence
  windows while peers wait indefinitely or continue treating the
  original lane as actively owned — direct evidence the
  heartbeat-only stall diagnostic (§6) is missing or not being
  applied.
- A session that suspends heartbeats under the consumer-absent
  exemption (§4) while an async peer is in fact consuming them —
  e.g. a peer's claim auto-rebalance misfires because the suspended
  role looked retired — direct evidence the consumer-absence opening
  fact was misread (a consuming peer was present) and the exemption
  was claimed when emission was still load-bearing.
- A seat paused at owner word (a heartbeat-end naming the word,
  claim retained) whose claim a peer adopts, or whose silence a
  peer reads as retirement, before the owner's resume word —
  the peer-reader clause of the fifth exemption failing; or a
  paused seat's claim swept by the host's machine readers with
  no handoff record to re-open from — the loss-free claim
  failing (added 2026-09-06).

The contract succeeds when liveness is structurally observable
without owner intervention, exemption classes apply cleanly to
the work shapes they were named for, and heartbeat volume stays
secondary to substantive event volume in normal operation.

Positive worked instance: after the A1 typed-origin heartbeat
gate landed in the 2026-05-26 n=2 enforcement bundle, both
Feathered Winging Cliff and Torrid Firing Spark emitted typed
state-argument heartbeats through the repo phenotype during the
session. The operating cure confirms the portable boundary this
contract names: heartbeat posture is mechanically derived state,
not free-form content.

## Owner direction (source-of-record)

The heartbeat-cadence rules emerged from multi-agent windows
where role-retirement (at the time, often on a context reading)
produced silent-failure observations: roles whose identity authority
persisted in claim state past the role's effective retirement,
peers acting on stale role-status, owner intervention required
to surface the retirement and re-route work. The contract
codifies the structural cure: liveness as a first-class signal,
threshold as the retirement boundary, exemptions as the named
extensions to the threshold for work-shapes that legitimately
exceed cadence.

Owner critique recorded against the heartbeat surface during
multi-agent operation: heartbeats accumulating substantive
content payloads, and substantive broadcasts being tagged as
heartbeats to keep cadence, conflated the liveness-signal
substrate with the inter-agent delivery substrate. §5 (added by
the 2026-05-25 amendment) codifies the category invariant the
critique surfaced: the cure is structural separation of
substrate categories, not a per-instance reminder discipline.

The 2026-05-26 n=2 enforcement-bundle closeout surfaced the
inverse failure mode: Feathered Winging Cliff continued emitting
heartbeats while no substantive event landed on the coordinated
lane, no reply landed to Torrid Firing Spark's direct ping, and
Torrid took over after broadcasting the rationale. §6 codifies
the discriminator and peer move: heartbeat-only output means the
role is observed-live, but may still be stalled or invisibly
rerouted.

## Revision history

- 2026-09-06 — Added a fifth, declared-state exemption class to §4
  ("Owner-word stand-down / paused seat"), graduated from the host
  liveness rule's §Exemptions on five instances, and updated the
  §"Forward-extensible exemption list" note. The class is distinguished
  from silence by its opening event (the heartbeat-end naming the owner's
  word) and from consumer-absence by suspending the threshold as well as
  emission while the claim is retained. Cadence (§1), threshold (§3), and
  the substrate-category invariant (§5) unchanged.
- 2026-06-15 — Added a fourth, emit-side exemption class to §4
  ("Consumer-absent / no observing peer"), updated the
  §"Forward-extensible exemption list" note to record its graduation on
  two instances, and added a sixth falsifiability axis. This graduates the
  consumer-presence generalisation that `collaboration-is-value-contingent`
  and `liveness-heartbeat-cron` had held open as "a working hypothesis on
  PDR-082's second-instance path"; the contract is now the home of the
  exemption rather than a standalone rule pre-empting it. Owner-approved at
  the 2026-06-15 dedicated consolidation walk. Cadence (§1), redundancy
  (§2), threshold (§3), and the substrate-category invariant (§5) unchanged.
- 2026-06-12 — Added clause §7 ("Emit-side: loop hygiene"), the portable
  facet of a host rule amendment that graduated 2026-06-11 (relabel at
  lane transitions, stop-loop-then-emit-end ordering, one timestamp per
  tick, stderr-captured failure lines), plus a fifth worked rule instance
  from a coordinator loop emitting a stale branch name (2026-06-12).
  Owner-approved at the 2026-06-11 register walk. Emit-side cadence (§1),
  redundancy (§2), and the substrate-category invariant (§5) unchanged.
- 2026-05-26 — Added clause §6 ("Observe-side:
  heartbeat-only stall diagnostic"), one corresponding entry
  under §Consequences §Forbids, a fifth falsifiability axis, and
  a §Owner direction paragraph recording the Feathered/Torrid
  worked instance. The amendment distinguishes scheduler
  liveness from main-loop attention without weakening the
  retirement threshold in §3.
- 2026-05-25 — Added clause §5 ("Substrate category: heartbeats
  are liveness infrastructure") inside §Decision, two
  corresponding entries under §Consequences §Forbids, a
  fourth falsifiability axis, and a §Owner direction paragraph
  recording the substrate-category critique. The amendment lands
  WS4 item #1 of the n=2/coordination-efficiency program
  (`heartbeats-are-infrastructure` per Fred's framing during the
  plan-authoring session — clause-inside-PDR, not new rule).
  Substance preserved verbatim across the amendment surfaces:
  the new category invariant elaborates the cron-redundancy rule
  in §2 without contradicting it.

### 2026-08-02 — §2 cron-redundancy rule retired (owner-carded)

The emit-side suppression clause is retired: never enacted in
fourteen weeks (unconditional dual-surface emission is the working
phenotype; no suppression predicate exists in tooling), and its own
falsifiability axis described the standing inconsistency. Doctrine
follows the enacted truth — emit every tick; reader-side filtering
(heartbeat-excluded watchers + the freshness poll) carries the
substrate economy. The §5 category invariant is untouched; two
§Forbids bullets and one falsifiability axis are re-pointed in the
same amendment. Disposition ratified by owner card 2026-08-02 in the
five-item doctrine pass (Director session 52841f).

A propagation sweep the same day aligned the residual readers that
still described the suppression relationship as operative: §Context
carries a dated bracket on the framing that named the clause, and
§5's category prose, §Mechanism's boundary-discipline list, §Enables,
and §Accepted Costs now state the emit-every-tick behaviour and the
reader-side economy that carries it.
