---
id: design-lane-review-debt-closure
node_type: delivery
name: 'Design-lane review-debt closure: DDR corpus cured and validated, records true, open PRs dispositioned'
overview: 'Close the design lane''s review debt in four slices: cure and land the DDR seed corpus (PR #814), enforce its edge schema with a day-1 validator, true the completion plan''s stale review record on main, and disposition the three stale open design PRs (#787 merge, #806 close-with-adjudication, #737 cure-and-re-request).'
status: ratified
ratified_by: 'Jim Cresswell'
ratified_date: 2026-08-07
ratified_where: 'Owner approval of the session plan (design-lane session 8a4280, 2026-08-07: "please plan 1,2,3" then plan-mode approval), followed by "Please bring the plan into the repo"; PR #814 carries slice 1'
serves: design-system-as-configured-framework
impact_areas:
  - design-system
  - practice-and-estate
tickets:
  - MCP-527
depends_on: []
owner_gates: []
last_updated: 2026-08-07
---

# Design-lane review-debt closure

## Goal

Every piece of design-lane review debt closed and every design record true,
leaving the lane at its sealed two-act payload (the combined cure window and
the capability-floor rewrite, which open at the owner's work-word and are NOT
this plan's scope) with nothing queued behind it. Done means: PR #814 merged
with its 17-finding cure round and a LAND re-review; the DDR edge schema
enforced by a validator from day 1 (owner ruling 2026-08-07); the completion
plan's review record on main stating the true round-2 state; and zero
design-lane PRs in an unowned or silently-stale state.

## Problem

The gap: four kinds of review debt accumulated across the 2026-08-02..07
design arc. Who it harms: any reader of main's records (the completion plan
understates its own review state by one completed round); the owner's review
queue (a structurally dead rescue PR awaits his disposition); the DDR corpus
(17 verified findings; a declared schema with no enforcement); and the lane
itself (three stale PRs blur what is actually in flight). Mechanism: records
and PRs froze at moments the estate then moved past — the same
stale-intersection generator the round-2 review named.

## Slices

Authoritative slice detail — checks, wiring, evidence, and the recorded
over-reach rejections — was approved in the session plan and is summarised
here; the PR bodies carry per-slice verification evidence at landing.

### Slice 1 — PR #814 cure rounds (round 1 landed; round 2 pending)

All 17 round-1 docs-adr-expert findings cured as seven classes at
`a261ae42d` (status-grades-authority rule; volatile-state sweep;
reference-direction cures; means-detail returned to execution homes;
source-accuracy fixes; curated-but-sound mermaid convention; docs-home
reachability). Re-review round 2 returned REVISE with 12 findings,
conserved on the PR thread with the delegated decisions recorded (drop
`constrains`, DDR-008 gaining its two `depends_on` edges; the SSOT
pointer-inversion lands in the same PR). Remaining: cure round 2,
docs-adr-expert re-review (opus) returns LAND, merge at settled.

### Slice 2 — DDR edge-schema validator (code PR, after #814 merges)

`agent-tools/src/validators/ddr-graph/` mirroring the plan-schema split
(entry + `ddr-schema.ts` + `ddr-graph-helpers.ts` +
`ddr-projection-helpers.ts`, colocated unit tests): fail-closed per file;
closed discovery with filename grammar; case-exact `DDR-\d{3}` ids resolved
by string compare; every DDR-shaped token in any edge list resolves; no
self-edges, duplicates, or id collisions; contiguous numbering; `depends_on`
and supersession digraphs acyclic; status↔edge coupling with atomic-flip
semantics; live records never depend on superseded ones; README index
recomputed-and-diffed; mermaid soundness never equality. String-compare id
resolution is deliberate: `fs.exists` probes lie on APFS's case-insensitive
default. Rejected as over-reach at approval, recorded so the builder does not
re-litigate them: mermaid full-equality; requiring all edge keys;
slug-from-title derivation; strict existence for prose refs; date
monotonicity/future-date checks; a separate "superseder must be ratified"
rule. Deterministic and clock-free throughout; an empty corpus is a failure,
never a pass. Wiring: agent-tools
script + new last leg of `docs-validators:check` + knip entry + red-proof
tests. Coupled edits: `docs/design` into reference-direction
`POLICED_ROOTS` AND `REPO_DOCTRINE_PREFIXES`.

### Slice 3 — True the completion plan's review record (docs PR, independent)

One-file edit to the delivery plan `design-system-completion`'s §Review
record: the scoped re-run RAN 2026-08-06 (run `wf_bd16152b-ee8`, 9 real
findings — 6 material, 3 minor; slope 20 → 9 stops the loop); Director
adjudication `a729c466` mandates one combined window, never a round 3;
PR #785 merged before the window opened; the round's durable record authors
with the window. Staleness cure only — no cures, no window work.

### Slice 4 — Disposition the three open design PRs (operations)

- **#787**: empty-commit re-fire so the required `run-quality-gates` check
  reports on the head, then REST merge-commit at the BOT's hand at settled —
  never squash, never the owner-credential ruleset bypass.
- **#806**: close with written adjudication (substance landed via
  #710/#715; 4/5 target paths deleted from main pre-rescue), naming the two
  rescued test behaviours with no equivalent on main
  (session-choice-beats-stale-persisted precedence; the motion setter's
  applied-value assertion) — minted as a thin Linear pointer for porting
  into the `oak-design-react` suites. Branch preserved.
- **#737**: one cure commit truing the two stale frontmatter fields in the
  capability-coverage investigation (the push re-fires CI and auto-dismisses
  the stale review), PR-body re-pin, then re-request the human reviewer.

## Sequencing

Slice 1 → merge → Slice 2. Slices 3 and 4 interleave freely (#787, #806,
PR #737 in cost order). Bot identity throughout; small-PR discipline; the repo
is the record and tickets stay thin pointers.

## Review record

- Session plan approved by the owner 2026-08-07 (plan mode, design-lane
  session 8a4280), built on three grounded agent reports: validator-machinery
  exploration, three-PR state exploration, and a 20-finding design
  stress-test of the validator (its six over-reach rejections are recorded
  in Slice 2's shape).
