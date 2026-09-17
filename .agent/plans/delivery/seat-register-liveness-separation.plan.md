---
id: seat-register-liveness-separation
node_type: delivery
name: "Separate seat-holding from liveness in the coordination registry"
overview: >-
  Seats become register entries with no freshness TTL, changed only by
  protocol events; liveness stays evidence-based and decaying; glance
  surfaces read each fact from its own source.
status: ratified
ratified_by: "Jim Cresswell"
ratified_date: 2026-08-07
ratified_where: >-
  In-session owner word "Ratified, land the stamps", 2026-08-07
  (Director seat, Panther rides Midnight 7efb00); the diagnosis and
  design verdict were reached with the owner earlier the same session.
serves: coordination-substrate
impact_areas:
  - practice-and-estate
tickets:
  - MCP-528
depends_on: []
owner_gates: []
last_updated: 2026-08-07
---

# Separate seat-holding from liveness in the coordination registry

This plan is the repository knowledge home for the diagnosis and design
verdict reached with the owner on 2026-08-07; the ticket carries
schedule state and a pointer here.

## Goal

Two different facts stop sharing one decay-prone representation:

- **Seat-holding is a protocol fact.** It changes only at explicit
  events — a Moment-2 acknowledgement (PDR-064), a completed
  retirement, the owner's word — and carries the exactly-one-holder
  invariant: never zero, never two. It must not decay on a clock.
- **Activity is an evidence fact.** It decays continuously, is measured
  in windows (heartbeat classifications, claim freshness TTLs), and its
  consumers are routing, collision awareness, and retirement detection.

Today the registry stores both in one object — a claim row with a
freshness TTL — and the conflation produces three defects, each with a
dated worked instance:

1. **Authority display flickers on a bookkeeping timer.** The
   statusline's Director demark renders only on a fresh claim, so a
   sitting Director whose heartbeat lapses reads as no-Director — while
   the session's own render already proves this-session liveness
   (2026-08-07: the demark was absent for a seated Director whose
   adopted claim carried the predecessor's stale heartbeat; `claims
   adopt` rewrites ownership, deliberately not freshness).
2. **The staleness sweep can archive the seat record.** Authority — a
   fact only protocol events should change — is garbage-collected by a
   liveness mechanism. Predecessor wraps must hand-annotate "stale is
   the boundary, not abandonment" because the substrate cannot say it
   (2026-08-07 wrap; the 2026-08-06 archived-while-live misread is the
   same class from the other side).
3. **The vacant-seat anomaly erases its own evidence.** The estate's
   doctrine names the absent damping seat as a signal to surface
   (PDR-117, 2026-08-05 amendment). That alarm is the conjunction
   seat-held ∧ holder-dead; under the conflated model the stale claim
   fades or is swept, and the alarm condition reads as a quiet day.

The doctrine already states the distinction — PDR-117's takeover clause:
"registry-freshness ≠ comms-liveness — the two measure different
things" — but the data model never followed it.

## Mechanism

- **A seat is a register entry, not a claim.** A small `seats` register
  (sibling to `claims` in the collaboration state) holds one entry per
  singleton-authority seat (director; commit-warden when occupied):
  holder identity, role, the transition event id that seated them, and
  the timestamp of that event. No `freshness_seconds`, no
  `heartbeat_at`; the staleness sweep does not read this register.
- **Transitions are protocol acts only**: adopt/transfer (PDR-064
  Moment-2 with its readiness gate), close (completed retirement or
  owner word). Each transition records the event pointer, so the
  register is an audit chain, not a snapshot.
- **Exactly-one-holder is machine-checkable**: the validator refuses two
  live entries for one seat role, and a close without a named cause.
- **Liveness stays exactly where it is** — heartbeats, claim TTLs, the
  peer-liveness classifier — for the questions it answers well: is the
  holder *alive*, is a peer *retired*, is it safe to route.
- **Glance surfaces split their sources**: the statusline Director
  demark reads the seat register (the session's own render is the
  liveness proof for its own display); team-shape icons keep reading
  liveness. Same glyphs, honest sources.
- **The vacant-seat detector becomes possible**: seat register says who
  holds; liveness says the holder is gone; the conjunction emits the
  anomaly instead of erasing it. (Detector delivery may be its own
  slice; the separation is what makes it expressible.)
- **Migration**: the sitting Director's claim row keeps its work-claim
  role; its seat fact moves to the register at cutover. `claims adopt`
  output gains one hint line naming the follow-on act for adopted
  claims, so pickup freshness stops being tribal knowledge.

The substrate phenotype lands with an ADR in the ADR-182/183/199
lineage (authored in slice 1, where the schema becomes concrete).

## Acceptance criteria (each with a proof)

- **A seat entry survives the staleness sweep** — `repo-safe`: a sweep
  test seeds a seat entry older than every TTL and proves the sweep
  leaves it; the claims-sweep test suite names the exemption.
- **Exactly-one-holder is enforced** — `repo-safe`: validator tests
  refuse a second live entry for the same seat role and an unclosed
  transfer.
- **The demark reads the register** — `repo-safe`: statusline unit test
  renders the Director demark from a seat entry whose holder's claim is
  stale, and no demark when the register holds no seat for the session.
- **The anomaly is detectable** — `repo-safe`: a test proves
  seat-held ∧ holder-retired produces the anomaly signal on the
  detection surface chosen in slice 2.
- **The glance surface is true across a quiet stretch** — `owner-held`:
  the owner confirms the Director demark persists through a
  longer-than-TTL quiet window with no heartbeat theatre, recorded on
  the ticket.

## Todos

- [ ] Slice 1 (one PR, code+tests+ADR, ≤2 review rounds): the seats
      register — schema, transition acts on the collaboration-state CLI,
      sweep exemption, exactly-one-holder validation, migration of the
      current Director seat, the `claims adopt` hint line.
- [ ] Slice 2 (one PR, code+tests): statusline reads the register;
      vacant-seat conjunction detector on the agreed surface
      (peer-liveness output or a dedicated check).

## Out of scope

- Cross-machine seat visibility — the registry is machine-local by
  design (ADR-199/PDR-094); the seat register inherits that boundary,
  and cross-machine display is a separate concern with its own plan if
  ever wanted.
- Changing liveness windows, heartbeat cadences, or the comms heartbeat
  contract — this plan moves authority out of liveness, it does not
  redesign liveness.
- Multi-seat role vocabularies — the register covers singleton-authority
  seats; ordinary work claims stay claims.
