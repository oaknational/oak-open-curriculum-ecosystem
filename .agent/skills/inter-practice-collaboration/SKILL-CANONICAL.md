---
name: inter-practice-collaboration
classification: active
description: >-
  Join a foreign Practice estate and exchange safely with zero prior knowledge
  of it — the runnable join ceremony for cross-estate work. Fires whenever a
  session's worktree repo and coordination home are different repos, or the
  session is about to write into, register presence in, or claim work in any
  sibling Practice estate's substrate; read-only estate looks are unceremonied,
  and a solo write into a QUIET sibling estate takes the lighter
  governance-only path. Enacts the inter-Practice collaboration protocol PDR.
---

# Inter-Practice Collaboration (the join ceremony)

**Governance**: the runnable enactment of
[PDR-125](../../practice-core/decision-records/PDR-125-inter-practice-collaboration-protocol.md)
(the inter-Practice collaboration protocol). The PDR is the portable
doctrine; this skill is what makes it fire — a cold read of this file
is enough to run the ceremony without the PDR open. Both travel on the
plasmid together.

## Fire condition

Any of:

- the session's worktree repo and its coordination home resolve to
  DIFFERENT repos (explicit flag or `PRACTICE_COORDINATION_HOME`
  differing from the worktree's own root);
- the session is about to write into any sibling Practice estate's
  substrate (comms, claims, boxes, memory, plans — anything; an
  exchange receipt is a write);
- the session is about to register presence or claim work in a
  sibling estate (coordination posture, guest seats, thread joins).

Read-only looks at a sibling estate — mining, verification sweeps,
estate-state checks that write and register nothing — do not fire
this skill (owner ruling 2026-07-08: the protocols are for
collaboration, an enhancement, never a blocker on reading files). The
moment a read-only session decides to write, register, or claim, the
ceremony fires before that first action.

**Quiet-estate solo writes take the lighter path** (owner
clarification 2026-07-08: the ceremony's object is AGENT
COMMUNICATION). When the sibling estate is QUIET — no live seats, no
registration, no claims to coordinate with — a solo write window
needs steps 1 AND 2 (write governance read; coordination home
declared with loud failure on a bad home — clause 2 binds everywhere)
plus the fresh-branch half of the home's write governance (its gates,
conventions, and a fresh branch off its latest main); the
communication steps (identity registration, watcher, adoption event)
are optional-but-welcome. Classify QUIET by reading
the home's live coordination surfaces (located per the write
governance read in step 1): its claims registry for open claims (any
unexpired claim is live regardless of heartbeats — heartbeat-exempt
seats exist), its comms stream tail for registrations,
heartbeat-tagged events, AND substantive events — each of the three
counted only when newer than the home's retirement window — (liveness
per the home's own liveness contract,
e.g. PDR-078: heartbeat OR substantive activity, honouring its
declared exemption windows — a comms heartbeat event counts exactly
like a watcher-file heartbeat), and its watcher
liveness files for heartbeats within the home's RETIREMENT threshold
— a seat is live until it has been silent (no heartbeat, no
substantive event) for that whole window, so a heartbeat older than
one cadence but inside the threshold still counts as live (all read
from the write governance in step 1). If all three surfaces
are silent, the home's ground-truth work surfaces show no git
activity newer than the retirement window (the fourth check, defined
with the consumer-absent note below), AND no observable exemption
window is open (a
coordinator-handoff grace window, a contiguous-execution window, a
verdict-synthesis window — the home's liveness contract names its
exemption classes), the estate is QUIET; if any surface or work
trace is live, or an exemption window is open, it is not. An exemption window counts as
open from its observable opening event until its named closing
boundary (per PDR-078: a handoff grace window until the incoming
acknowledgement lands OR, under PDR-064's authorised
forced-retirement path, the Step 5 retirement broadcast that returns
authority to the owner; a contiguous-execution window until its
cycle-boundary broadcast or abandonment; a verdict-synthesis window
until the sub-agent returns or the dispatch abandons) — age alone
does not expire a window whose boundary event has not yet appeared.
Because an opening event may therefore be older than any bounded
tail, the exemption check resolves opening/closing PAIRS from the
home's canonical event history (or its persisted exemption state
where it keeps one). The three liveness categories above are read by
TIME window — every event newer than the home's retirement threshold
— never by a fixed newest-N count (a busy estate can push a live
seat's latest event outside any fixed N while it is still inside the
threshold). Where the home's CLI caps a time-filtered read (this
repo's `comms list --since <threshold>` still applies its default
`--tail 20` AFTER the filter), raise the tail until the header's
shown count equals its post-threshold denominator — the header
exposes the truncation — and the
exemption scan needs the full history for unmatched openings.
PDR-078's fourth exemption — consumer-absent — is NOT a scannable
window and never enters this check as one: it is derived from the
home's CURRENT registry/conductor state with self-healing exits (a
consuming peer appears, the conductor goes async, the cast rotates).
Its seats can be nearly invisible on coordination surfaces — an
unclaimed solo session emits no heartbeats and need not hold a claim
— so the QUIET read must ALSO consult the home's ground-truth work
surfaces: git activity newer than the retirement window (commits on
live branches, working-tree or index movement where observable)
vetoes QUIET even when every coordination surface is silent. A truly
empty estate (no claims, no in-window comms or watcher activity, no
in-window git activity, no open bounded window) reads QUIET. Name
the residual honestly: a fully silent seat that is only reading or
reasoning leaves no observable trace (git evidence is coarse and
lagging), so QUIET is a best-effort read of observable surfaces,
never a proof of emptiness. The lighter path stays safe under that
residual because its writes land on a fresh branch off the home's
latest main under the home's own gates — never on any seat's working
surface — and the machinery binds at the first comms write, claim,
or registration, so a collision surfaces through the home's own
coordination the moment either side writes. The moment the session writes
comms, opens a claim, registers, or encounters live peers, every
step below binds in order (PDR-125 clause 3: the machinery binds at
the first comms write, claim, or registration).

## The ceremony (ordered, each step gates the next)

1. **Read the home estate's write governance FIRST.** Before any write
   — liveness files included — read the host's naming and vocabulary
   doctrine (e.g. a donor-neutrality rule), its comms conventions, and
   its exchange paths. Guest writes are bound by the HOME's rules, not
   yours. Naming constraints are ASYMMETRIC by design: the home's
   vocabulary doctrine may forbid names the guest's own tree uses
   freely — learn the asymmetry from the home's rules, never assume
   symmetry. A session's cwd is a COORDINATE, not a boundary: estate
   governance binds writes and merges to each estate's gates, while
   authorship is unrestricted under this ceremony. The founding
   violation: a join event that named the host's Practice-donor repo
   directly, tripping the host's neutrality doctrine.
2. **Declare the coordination home.** One substrate owns the
   arrangement's coordination state. Resolution order: explicit CLI
   flag, then `PRACTICE_COORDINATION_HOME`, then git-native
   resolution. A declared home that is missing or holds no
   recognisable substrate is a loud stop — never fall back silently.
3. **Resolve identity with the HOME repo's own derivation** — never
   carry your native name across. Your `session_id_prefix` is the join
   key: it is the ONE identity coordinate shared across estates, and
   it identifies a SESSION (a successor session is a new prefix and —
   for DERIVED names — a new name everywhere; same-name-different-prefix
   is an anomaly to surface and VERIFY before accepting: a rare
   legitimate derived collision is possible — finite wordlists — and
   the `(agent_name, id)` key disambiguates; a DECLARED owner/operator
   override may legitimately recur across prefixes, with the override
   declaration as the exemption proof). For DERIVED names one seed
   therefore yields TWO display names (per-estate wordlists — a
   declared override may instead present one name everywhere); when relaying content across estates, sign
   BOTH identities in the body with the shared prefix, so each side's
   readers can resolve the author (worked instance 2026-07-08: seed
   55b041 rendered "Pelican calls Spray" on one estate and
   "Lacustrine Drifting Hull" on its peer).
4. **Register on the home stream**: the first comms write declares the
   FULL identity block (the home identity contract, e.g. PDR-027) —
   the home identity name, the canonical `id` disambiguator (the
   routing key is the `(agent_name, id)` PAIR — the UUID alone is
   not a usable routing target), `platform` and `model` as EXPLICIT
   fields (never left for readers to infer — platform vocabulary
   diverges across estates and the identity layer pins one value),
   the prefix join key, and `seed_source` — plus native-repo
   alias(es), the worktree repo-reference (origin + branch — never a
   machine-local checkout path in tracked content), and coordination
   posture (observer / implementer / exchange seat). The shared wire
   schema's REQUIRED minimum stays the four fields (name, platform,
   model, prefix); `id` and `seed_source` ride as the home identity
   contract requires. An owner-assigned or operator-overridden
   `agent_name` outranks the home derivation and is declared AS an
   override in the same registration (PDR-125 clause 5); the prefix
   join key binds unchanged. ALL pre-positioned successor details —
   the identity tuple AND the seating, timing, and commissioned scope
   — are hypotheses (PDR-125 clause 5): peers verify the successor's
   OWN registration at the successor's team-start and assume nothing
   carries over from a predecessor's handoff event.
5. **Arm the home watcher WITH HOME TOOLING**, heartbeat-filtered by
   default. A watcher is a writer: its heartbeat and seen files are
   writes into the home substrate, so the home's CLI — never your
   native repo's — runs it. Assert watcher liveness with the home's
   own assertion command before opening any claim.
6. **Post an adoption event** naming what you are picking up (lane,
   claim, boundary) so the home team sees the pickup; open claims in
   the home's repo-qualified area form.
7. **Exchange by the two-layer handshake.** Box files carry
   SELF-CONTAINED concept payloads (no SHAs, no dereferences, no
   moving targets); the paired comms event carries the time-bound
   layer (provenance pins, identity, sequencing, the box path).
   When a ported artefact is a DETECTOR (a validator, a conformance
   twin, a gate), its first live run on the receiving estate is a
   detector test: porting ports the authoring estate's lexical
   assumptions (quote style, path shapes), and the first run is the
   cheapest place to catch them — cure divergences in BOTH estates'
   copies in the same window (worked instance 2026-07-07: a
   conformance twin's usage-spec anchor assumed double-quoted CLI
   help; this estate single-quotes).
   **Every shared-machinery improvement carries a per-item twin
   disposition** recorded where the innovation lands (PDR-125
   clause 6): `twinned-in-window` (both estates in one window,
   diff-proven), `already-present-verify-parity`,
   `their-lane-owns-coordinate`, or `impossible-with-named-reason` —
   an improvement with no disposition is drift waiting for the next
   exchange turn.
   Lifecycle threads on the comms stream: delivered → acknowledged →
   integrated or rejected — every bundle receipted both ways.
   **Normalise on receipt**: integrate inbound material in the
   RECEIVING repo's format (markdown conventions, heading shapes,
   gate-satisfying style), declaring the normalisation in the
   integrating commit body — concepts travel, never bytes.
   **Corrections are new events** threading to their antecedent;
   never rewrite an exchange artefact or lifecycle event in place.
8. **Verify, never trust** (the host's adversarial-verification
   doctrine applies to peers too): every peer assertion is a pointer
   to verify first-hand; a peer's "not found" is a claim about their
   search; version or schema mismatches are typed refusals to
   surface, never best-effort parses.

## Leaving

Close claims you opened, stand the watcher down cleanly (a
final-heartbeat-end event, so the home team reads intent rather than
silence), and leave a closeout event naming what remains and where the
lane resumes. An orphaned guest watcher emits false liveness into a
foreign estate — supervise it (`--supervisor-pid` or the home's
equivalent) so it dies with your session.

## Worked instances

- **2026-07-05 — the first live bidirectional exchange**: one session
  with a per-estate name on each of two estates, a second repo as
  coordination home, bundles delivered and receipted both ways in one
  window. Six friction classes surfaced doing it manually; each became
  a protocol clause.
- **2026-07-06 — the standing relationship**: the exchange lane a
  first-class continuing arrangement on this estate — controlling plan
  `agent-tooling/current/inter-practice-collaboration-protocol.plan.md`
  and the `agentic-engineering-enhancements` thread record carry it.

## Platform Adapters

The generated Claude Code adapter lives at
`.claude/skills/oak-inter-practice-collaboration/SKILL.md`.
Regenerate with
`pnpm skills:generate` and verify with `pnpm skills:check`.
