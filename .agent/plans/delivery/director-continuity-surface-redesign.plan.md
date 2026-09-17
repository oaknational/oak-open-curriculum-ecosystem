---
id: director-continuity-surface-redesign
node_type: delivery
name: "Director continuity-surface redesign"
overview: >-
  Re-found the Director's continuity surface: every binding owner word homed
  durably with traceable authority, the volatile handoff section reduced to one
  live pointer-biased block, Director journalling moved to a thread record, and
  the accretion generator structurally cured.
status: sketch
ratified_by: null
ratified_date: null
ratified_where: null
serves: coordination-substrate
impact_areas:
  - practice-and-estate
tickets: []
depends_on: []
owner_gates: []
last_updated: 2026-08-13
---

# Director continuity-surface redesign

## Problem (the frame, not a solution)

`director-handoff.md` §CURRENT HANDOFF STATE was designed as a volatile
snapshot refreshed at each handoff. In practice it accreted for four weeks
(daily commits since 2026-07-14; 174 stacked banners across 11 Director
tenures; 1,631 lines against a declared 320-line hard budget) because it was
silently doing three jobs at once:

1. **successor snapshot** (its design intent — refresh semantics);
2. **sitting-seat journal** (compaction freeze/resume blocks — append
   semantics; the Director is the one lane with no thread record, so this
   file absorbed the job);
3. **first-capture of owner rulings** (binding words landed inline in
   whichever block was open; ~90 catalogued, with no forcing function homing
   them durably — which made superseded blocks load-bearing and undrainable).

Harm: successors inherit unverifiable authority (two stale board readings
bit the sitting Director on 2026-08-13 alone), owner words risk loss, and
the knowledge-preservation rule correctly blocks mechanical cleanup — so the
debt compounds. The generator, not the instance, is the defect: a surface
that accepts at-occurrence appends acquired no drain ritual at birth.

## Goal

A successor takes the Director seat from: the durable brief (unchanged), ONE
live pointer-biased snapshot block, a Director thread record carrying the
journal, and a rulings ledger proving every binding word is homed. Nothing
in the historical blocks is lost; every ruling's authority (whose word,
dated, competent for the claim) is classified and traceable.

## Mechanism

The owner-directed composite design (in-session word, 2026-08-13 evening,
Director session e98f17: "go with your recommendations, make sure knowledge
is conserved at all times, and properly homed"):

- **Split by job.** The brief keeps role doctrine (PDR-117 pointer). The
  snapshot keeps ONLY what cannot be derived from live surfaces (owner
  gates, posture words, board pointers) and points at everything that can
  (claims registry, comms, plans, thread records) — a stored map is a
  lookalike for live state, so the less it asserts, the less it can lie.
- **Journal to a thread record.** `threads/estate-coordination.next-session.md`
  becomes the Director lane's journal (the thread name the Director claim
  already carries), under the same conventions every other lane follows.
- **Rulings ledger, ledger-not-home.** Rulings continue to home in their
  proper durable surfaces (rules, PDRs, directives, per-user memory, plan
  gates, tickets); the ledger is the capture-to-homing tracking surface — a
  row per ruling with authority class and disposition — proving none was
  dropped. Every row gets a recorded decision (disposition-ledger
  discipline).
- **Additive before subtractive.** Home the unhomed and build the new
  surfaces first; only then relocate historical blocks, byte-conserved, to
  the operational archive. Every intermediate landed state is correct.
- **Cure the generator.** A validator makes append-drift observable
  (exactly one live block, within budget), and the doctrine candidate —
  every append-accepting surface acquires its drain ritual at birth; a
  ruling lands in its durable home at occurrence with a ledger row — routes
  through `new-rule-vs-pdr-clause`, which owns that process.

Evidence inputs: the read-only rulings inventory (~90 rulings: ≈44
confirmed homed, ≈22 plausible, 6 unhomed, ≈18 expired/superseded) and the
12-leg verification fleet (owner-authorised) re-verifying every plausible
home first-hand, sweeping the unhomed rows, and tracing the authority of the
inherited board and assumptions register A1–A15.

## Acceptance criteria (each with a proof)

1. **Every catalogued ruling has a ledger disposition** — homed (pointer
   cited), homed-by-this-plan (commit cited), expired/superseded (dated),
   or owner-carded exception. Proof: `repo-safe` — the ledger file's rows
   reconciled against the inventory; zero rows without disposition.
2. **The six unhomed rulings are homed or owner-carded.** Proof:
   `repo-safe` — each row cites its landing commit or card.
3. **`director-handoff.md` carries exactly one live state block and returns
   within its declared fitness budget**, with historical blocks relocated
   byte-conserved. Proof: `repo-safe` — `cmp`-verified extraction against
   the archive file; the fitness report green on the surface.
4. **The Director thread record exists and carries the live journal**, and
   both `repo-continuity.md` and the brief point at it. Proof: `repo-safe`
   — the record present with the seat chain and live board; link check
   green.
5. **Append-drift is mechanically observable.** Proof: `repo-safe` — the
   validator red on a fixture with a second live block or over-budget
   section, green on the redesigned file (test cited in the validator PR).
6. **The redesigned surface reads right at the next succession.** Proof:
   `owner-held` — the owner's confirming glance at the next Director
   pickup, recorded on this plan's thread.

## Todos (each a single-story slice, default round budget)

- S1: Create `threads/estate-coordination.next-session.md` (journal home)
  seeded with the tenure chain, the live board, assumptions register
  A1–A15, and this seat's adoption record. Docs commit on the coordination
  branch.
- S2: Author the rulings ledger seeded from the inventory plus fleet
  verdicts, every row carrying authority class and disposition.
- S3: Home the unhomed (fleet-informed): each to its named home class; the
  owed ticket recording lands on its ticket; doctrine-grade items route via
  `new-rule-vs-pdr-clause`; anything owner-only becomes a card.
- S4: Rebuild §CURRENT HANDOFF STATE as the single live pointer-biased
  block; relocate historical blocks to the operational archive,
  byte-conserved; update the repo-continuity pointer.
- S5: Validator slice (code, own lane PR with tests and review): one live
  block, size budget, red-first fixtures.
- S6: Knowledge conservation of this arc itself: napkin capture of the
  design lessons and play seeds; consolidation-surface routing.

## Out of scope

- Rewriting the Director brief's role doctrine — PDR-117 owns it; the brief
  only gains the thread-record pointer.
- Re-litigating rulings already verified homed — the ledger records them;
  their homes govern.
- The estate-wide authority audit beyond the Director inheritance — each
  lane questions its own inheritance at its own seat (owner instruction
  2026-08-13 fired per-seat).
- The deferred ADR-200 graph cathedral — this plan changes markdown
  surfaces and one validator only.
