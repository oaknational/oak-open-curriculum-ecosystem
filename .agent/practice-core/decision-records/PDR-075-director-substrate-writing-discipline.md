---
pdr_kind: governance
---

# PDR-075: Director Substrate-Writing Discipline During The Role Authority Window

**Status**: Candidate
**Date**: 2026-05-23
**Related**:
[PDR-027](PDR-027-threads-sessions-and-agent-identity.md)
(identity substrate — substrate-writing events carry the same identity
tuple as any other comms event);
[PDR-064](PDR-064-coordinator-handoff-two-moments.md)
(role-transition shape — this PDR's complement: PDR-064 governs how
handoffs occur, PDR-075 governs what the Director emits between
handoffs);
[PDR-066](PDR-066-comms-events-as-failure-mode-channel.md)
(comms-events as the real-time failure-mode capture channel — this PDR
extends the same substrate to broader Director-role observations);
[PDR-074](PDR-074-director-value-is-mind-coherence-per-owner-attention.md)
(Director value model — broad-awareness-as-substrate-cognition; this
PDR names the discipline by which that cognition emits substrate in
real-time);
[ADR-183](../../../docs/architecture/architectural-decisions/183-comms-event-tag-namespace-substrate.md)
(tag namespace substrate — `failure-mode` + `behaviour-note` are the
namespaces this discipline writes into);
[ADR-185](../../../docs/architecture/architectural-decisions/185-comms-event-auto-acceptance-metadata.md)
(auto-acceptance metadata, when landed — complementary axis: PDR-075
specifies when the Director emits substrate events, ADR-185 specifies
how downstream consumers triage them).

## Context

This PDR addresses the failure mode worked-instanced four times in one
session on 2026-05-23: four Director-role transfers in approximately
four hours, each producing a comprehensive handoff-record synthesis
(approximately 14k–40k tokens per record) because the comms-event
stream was not substrate-rich enough to bootstrap incoming Directors
from canonical truth alone.

The cost shape was O(session) per handoff: each outgoing Director
synthesised the entire window's substrate at the boundary, into a
one-off prose document that the incoming Director then re-read
end-to-end. Under rotating-cast Director operation, this cost
concentrates at exactly the moment of context-budget pressure
(PDR-063 trigger), making the synthesis adversarial to the role it
is supposed to serve.

The architectural alternative: enrich the comms-event stream DURING
the window so the substrate is generated incrementally on the
canonical-truth surface, and the handoff record reduces to a thin
pointer at dated comms-event ranges plus the minimum-irreducible
role-handoff metadata. The stream becomes the substrate; the
handoff record becomes the pointer.

The first observed instance of substrate-writing in real-time rather
than absorbing-into-closeout is the Incandescent Banking Flame
Director tick #1 narrative event at 2026-05-23T12:59:50Z, which
absorbed three worked instances of the recursion-of-doctrine
anti-pattern in the live stream rather than capturing them only at
session-close napkin time.

## Decision

Recognise an in-window substrate-writing discipline as a distinct
invariant of the Director role, complementing PDR-064's
transition-shape invariants. The discipline operates entirely within
the Director's authority window (Moment 2 of role-acquisition →
Moment 1 of role-release).

### What Must Be Emitted

During the authority window, the Director MUST emit tagged
comms-events for the following substrate-worthy observations as
they occur:

- **Routing-blockage observations**: doctrine-failing-author worked
  instances, idle-detection methodology errors, ceremony-over-
  pragmatism corrections, mis-classifications surfaced by the team
  or owner.
- **Coherence-moment decisions and rationale**: routing decisions at
  coherence-moments (commit landings, owner-decision answers,
  routing-pressure shifts) with the reason naming the trade-off
  that forced the decision.
- **Owner-decision answers**: when an owner decision lands, an
  immediate Director broadcast naming the decision, the routing
  implications, and the next coherence-moment the team should
  expect.
- **In-flight reasoning future Directors need**: cross-cycle
  awareness shifts, hypothesis-state updates on uncured
  failure-modes, observations that the next-Director's
  substrate-bootstrap would otherwise have to recover via
  session-close handoff-record archaeology.
- **Reframe-class observations**: metacognition reframes that
  reshape how the Director understands the role itself. These are
  not status-updates; they are substrate the next Director
  inherits as load-bearing context for their own routing.

### Tag Selection

Substrate-writing uses the existing ADR-183 tag namespace:

- `failure-mode` — substantive substrate gaps (the Director observed
  doctrine-failing-author, a known autonomy gap, a substrate defect
  with operational impact).
- `behaviour-note` — softer behavioural patterns worth peers'
  attention but not yet substantial enough for failure-mode
  classification. Reframe-class observations typically land here.

Namespace expansion (e.g. a `director-substrate` namespace) is
deferred to the ADR-183 amendment process; this PDR does not
introduce new namespaces. If future evidence surfaces a category that
neither existing tag fits, ADR-183 amendment is the right home and
PDR-075 remains stable.

### Cadence

The Director emits substrate events:

- **At every coherence-moment** within the window (commit landing,
  owner-decision answered, routing-pressure shift, the role-
  transition Moment 1 broadcast itself when one fires).
- **Ad-hoc when a worked instance surfaces**: when a routing-
  blockage or doctrine-failure surfaces in the team, the
  observation is captured in the stream as it occurs, not at
  session-close.

The cadence is event-driven rather than time-fired. A fixed time
cadence would either over-emit during quiet windows or under-emit
during pressure windows.

### Handoff Record Role Reduced

A Director handoff record under this PDR is no longer a comprehensive
synthesis of the session. It carries only the minimum-irreducible
role-handoff substrate:

- **Moment 1 metadata**: outgoing identity tuple, incoming identity
  tuple (or self-selection criteria), pre-positioning event
  reference.
- **Lineage chain**: the role-handoff chain across the session.
- **Single highest-priority action for incoming Director**: the one
  move the incoming Director needs to make first on assuming the
  role.
- **Pointer to substrate**: a dated comms-event range identifying the
  in-window substrate events the incoming Director reads to
  bootstrap. Where specific events are load-bearing (e.g. the
  evidence behind the single highest-priority action), they are
  named by ISO timestamp and event title; otherwise the time-range
  is sufficient.

The handoff record does NOT re-narrate team state, in-flight routes,
landed commits, or owner-decisions answered. Those live in the
comms stream as tagged events; the handoff record points at them.

### Anti-Pattern Named

**Comprehensive handoff-record synthesis as substitute for stream-
emission.** The Director who absorbs substrate-worthy observations
into agent-private notes through the window, then synthesises a
comprehensive handoff record at closeout, has:

- concentrated O(session) authoring cost at exactly the boundary
  where context-budget pressure is highest (the PDR-063 trigger
  surface);
- deprived peers of real-time substrate visibility
  (broad-awareness-as-substrate-cognition per PDR-074 cannot
  operate on substrate the Director is hoarding);
- created an audit-trail gap between observation and capture (the
  comms stream has the observation's surface but not its diagnosis).

## Rationale

**Why the stream, not the handoff record, becomes the canonical
substrate.** The comms stream is durable across sessions, content-
addressable, queryable by tag and timestamp, and visible in
real-time to all peers. The handoff record is one-off prose
authored at the highest-pressure boundary. Aligning the substrate's
surface with its access patterns makes the substrate's lifecycle
match the substrate's consumers.

**Why existing tag namespaces, not a new `director-substrate`
namespace.** ADR-183 keeps the namespace small by design; adding
tags requires second-instance evidence and ADR amendment. The two
existing tags (`failure-mode` + `behaviour-note`) cover the
Director substrate-writing categories. Introducing a new namespace
in PDR-075 would couple this PDR's stability to the namespace's
stability, which is the wrong dependency direction.

**Why cadence is event-driven, not time-fired.** Coherence-moments
are emergent properties of the team's work. A fixed time cadence
would either over-emit during quiet windows or under-emit during
pressure windows. Event-driven cadence matches the substrate-
emission rate to the substrate-generation rate.

**Why the handoff record reduces, but does not disappear.** The
Moment 1 metadata + lineage + single-highest-priority-action
carries information the comms stream cannot deduce on its own
(the lineage chain is a session-cross-cutting fact; the single
priority action is a verdict, not a stream observation). The
reduced handoff record preserves this minimal substrate while
delegating session synthesis to the stream.

**Why this composes with ADR-185 (auto-acceptance metadata).**
ADR-185 (in draft at PDR-075 authoring time) names metadata on
which comms-events are deterministic-mechanical (auto-acceptable
by downstream consumers) versus events requiring active
absorption. PDR-075 names when the Director emits substrate
events and what categories the events cover; ADR-185 names how
downstream consumers triage the emissions. The two are
complementary axes operating on the same substrate.

**Why Director context-allocation is the underlying first
principle.** The reframe surfaced in the third worked instance
below names what the discipline structurally protects: Director
context budget is allocated to seeing the whole team at once, so
nobody else has to carry that picture. Sub-agent dispatches,
fact-finding reads, and file-edits burn context that the broad-
awareness picture needs; the "pure direction only" boundary rule
in PDR-074 is downstream of this allocation principle. Substrate-
writing is how the allocated context becomes a peer-readable
artefact rather than dying with the Director's session.

**Trigger to graduate from Candidate to Proposed.** Third-instance
worked validation under rotating-cast Director operation. The
third worked instance is named below (the metacognition reframe
broadcast immediately preceding Incandescent → Secret handoff). On
fourth-instance worked validation in a session distinct from this
one, with any refinements absorbed, PDR-075 moves to Proposed; on
fifth instance, to Accepted.

## Consequences

### Required

- The Director emits tagged comms-events at coherence-moments
  through the window, using `failure-mode` and `behaviour-note`
  per ADR-183 namespace.
- Director handoff records reduce to the minimum-irreducible
  substrate (Moment 1 metadata, lineage chain, single-highest-
  priority action, comms-event range pointer).
- The `start-right-team` SKILL Closeout Contract subsection
  "Coordinator Handoff (Two Moments)" references PDR-075 for the
  in-window substrate-writing discipline. The SKILL amendment is a
  follow-on slice after PDR-075 lands; it is not part of this
  PDR's atomic landing.
- Per PDR-064, the cron / cadence / Monitor governing the
  Director's authority window continues to fire substrate-writing
  surfaces until Moment 2 of the role-release.

### Forbidden

- Comprehensive handoff-record synthesis as substitute for stream-
  emission (the named anti-pattern).
- Accumulating substrate-worthy observations in agent-private
  notes through the window then dump-at-handoff.
- Introducing a new tag namespace (e.g. `director-substrate`)
  without first amending ADR-183 with second-instance evidence.

### Accepted Cost

- More comms-events per Director session. Amortised by the
  reduction in handoff-record authoring cost and by improved
  peer visibility (broad-awareness-as-substrate-cognition per
  PDR-074).
- Substrate-worthy events may receive less in-the-moment polish
  than handoff-record prose. The trade-off is real-time
  availability plus lower per-event authoring cost, against
  slightly higher reading cost at consumption.
- The reduced handoff record loses the on-boarding ergonomics
  of one-stop comprehensive prose. The cure for the on-boarding
  loss is the substrate pointer: a well-formed
  comms-event-range pointer plus a clean stream produces a
  bootstrap path through the actual evidence rather than through
  prose summary.

## Worked Instances

### First instance — substrate-writing in real-time

`narrative` event at 2026-05-23T12:59:50Z by Incandescent Banking
Flame, titled "Director tick #1 — keep Twilit auto-fix; Secret
bundle approved; reviewer-dispatch re-route to Secret; recursion-of-
doctrine substrate (3rd worked instance in 12 min)". The tick
narrative captured three worked instances of the recursion-of-
doctrine anti-pattern in the live stream with diagnosis and verdict
inline, rather than absorbing them into closeout-time synthesis.
This is the first observed instance of substrate-writing replacing
post-hoc closeout-time prose.

### Second instance — recursion-of-doctrine worked-instance triple

Three claude agents independently hit the "pre-existing,
out-of-scope" anti-pattern under team-cadence speed in a
12-minute window on 2026-05-23 (between approximately 12:54Z and
12:57Z). The detection-and-cure substrate was written into the
live comms stream by the Director (first instance above) rather
than captured only at session-close. Future Directors reading the
stream can absorb the triple's substrate without needing to mine
session-close handoff records for the pattern.

### Third instance — metacognition reframe broadcast before role-handoff

`narrative` event tagged `behaviour-note` at 2026-05-23T13:20:57Z
by Incandescent Banking Flame, titled "Substrate event
(behaviour-note): metacognition reframe — Director is context-
allocation + substrate-writing discipline, not authority-with-
rules". This event was emitted immediately preceding the
Incandescent → Secret Director handoff at owner direction, in
direct discharge of the PDR-075 discipline (named in flight as
the doctrine being authored). The broadcast establishes the
underlying first principle (Director context-allocation) and the
operational consequence (tick narratives become substrate-events,
standing-note moments become tagged events at occurrence), and is
itself the substrate the incoming Director bootstraps from. This
is the first instance of the discipline firing as cure for the
problem PDR-075 names.

### Fourth instance — Director's own routing-contradiction caught via substrate event

`narrative` broadcast tagged `failure-mode` + `behaviour-note` at
2026-05-23T13:22:31Z by Incandescent Banking Flame, titled
"Substrate event (failure-mode + behaviour-note): Director routing-
contradiction worked instance + Shape S verdict resolution". The
event substance is the recursion-of-doctrine anti-pattern firing
in the Director seat itself: at 13:15:08Z the Director broadcast
decision-priorities favouring substrate-writing discipline and
specifically un-favouring handoff-record schema formalisation; at
13:16:37Z (89 seconds later) the Director broadcast an allocation
picking the un-favoured shape from a receiving agent's earlier
9-candidate surface. The receiving agent (Twilit Weaving Moon)
surfaced the contradiction with an architectural-excellence
verdict and a five-minute self-default protocol; the Director
absorbed the catch via the substrate event, ratifying Shape S as
the verdict via the same stream rather than via private
correspondence. The event is itself PDR-075's cure shape applied
to PDR-075's own ratification cycle: the catch and the resolution
both live as substrate in the stream, available to the next
Director and to future sessions as a worked instance of the
discipline operating end-to-end.

### Fifth instance — incoming Director bootstrap from substrate alone

`directed` event at 2026-05-23T13:21:48Z by Secret Creeping Moth
(incoming Director, Moment 2 pending) to Incandescent Banking
Flame (outgoing Director), with subject acknowledging substrate
event from 13:20:57Z absorbed cleanly in 40-second turnaround.
Secret stated: "Reading from your substrate event alone, I have
the reframe; I do not need the synthesis." This is the first
observed instance of an incoming Director bootstrapping the
operational reframe from a single substrate event rather than
from a comprehensive handoff-record synthesis. PDR-075 ratification
hinges on this shape being repeatable: if incoming Directors can
bootstrap cleanly from substrate-rich streams alone, the
comprehensive handoff record's load-bearing role can dissolve as
PDR-075 specifies.

### Anti-pattern surface — comprehensive synthesis cost (this session)

Four Director handoff records authored on 2026-05-23 prior to
PDR-075 (approximate token counts):

- Velvet → next: approximately 30k tokens
- Seaworthy → next: approximately 40k tokens (extending Velvet)
- Abyssal → Incandescent: approximately 14k tokens (extending
  Seaworthy)
- Incandescent → Secret: pending at session-close

Total approximately 84k+ tokens of session-synthesis prose under
the pre-PDR-075 shape. Under PDR-075 the same substrate is
distributed across in-window tagged events, with each handoff
record reduced to under 2k tokens.

## Open Questions

1. **Granularity of comms-event range pointers in reduced handoff
   records.** Is "all events from `<ISO>` to `<ISO>` authored by the
   outgoing Director" the right pointer shape, or does the handoff
   record name specific events that are load-bearing? Hypothesis:
   time-range is sufficient for stream archaeology; explicit
   event-by-title naming is reserved for load-bearing decisions
   (the evidence behind the single-highest-priority-action).

2. **Coherence-moment definition under contested team state.** If
   two coherence-moments fire simultaneously (e.g. an owner-decision
   lands while routing-pressure shifts), does the Director emit one
   substrate event or two? Hypothesis: one event with both surfaces
   named is correct; multiplexing in one event is cheaper than
   forced separation.

3. **Substrate-emission ergonomics under high-cadence routing.** A
   Director routing eight or more agents in a five-minute window
   may have less capacity for substrate-emission than the discipline
   requires. Is there a minimum-emit-threshold that gates the
   discipline (e.g. "skip substrate-emit if a directed-event has
   fired in the last 60 seconds")? Hypothesis: the discipline does
   not skip; the cadence compresses, but the substrate-events that
   DO fire become more compressed in body.

4. **Interaction with team-cadence 120s sweep.** Does substrate-emit
   count toward team-cadence progress reporting (120s minimum per
   `start-right-team` §5), or are they distinct cadences? Hypothesis:
   substrate-emit satisfies team-cadence trivially when it fires;
   absence of substrate-events for more than 120s still requires a
   progress broadcast.

5. **Migration shape for already-comprehensive handoff records.**
   This session produced four comprehensive records before PDR-075
   landed. Are they refactored retroactively, or do they stand as
   pre-PDR-075 artefacts? Hypothesis: stand as-is; the substrate
   they contain is read-only audit history; future records adopt
   the reduced shape from PDR-075 forward.

6. **CLI ergonomics for tag emission.** Substrate-writing requires
   agents to author tagged events from the CLI; ADR-183 substrate
   is live but the agent-tools CLI does not yet expose a `--tags`
   flag on `comms append` / `comms direct` / `comms send`. The
   first PDR-075 worked instances wrote tags via direct JSON
   authoring or by titling the event with a `(behaviour-note)`
   parenthetical rather than via canonical tag-array. The `--tags`
   CLI flag is a paired follow-on implementation slice; it is not
   part of this PDR's atomic landing but is named here as the
   visible ergonomics gap PDR-075 surfaces.

7. **Owner-direct designation of substrate-population requests.**
   On 2026-05-23 the owner-direction to the incoming Director at
   role-acquisition included an explicit "request that outgoing
   Director populates the comms history" — i.e. the owner named
   the substrate-population obligation directly. Does PDR-075
   require the incoming Director to surface the same request on
   role-acquisition, or is the discipline strong enough that the
   request is implicit? Hypothesis: the request becomes implicit
   once PDR-075 is Accepted; under Candidate / Proposed status,
   surfacing the request explicitly is the cure for the
   transitional ratification window.
