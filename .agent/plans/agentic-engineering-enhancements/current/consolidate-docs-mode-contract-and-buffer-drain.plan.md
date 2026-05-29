---
name: "Consolidate Docs Mode Contract And Buffer Drain"
overview: >
  Repair oak-consolidate-docs so setting a goal against the skill gives agents
  enough contract, defaults, and closeout evidence to perform either session
  completion consolidation or a dedicated knowledge-curation pass without
  treating fitness numbers as the work.
todos:
  - id: ws1-mode-contract
    content: "Add the two-mode contract to the consolidate-docs skill: session completion and dedicated knowledge curation."
    status: completed
  - id: ws2-curation-defaults
    content: "Define dedicated-curation defaults: documentation should be routed toward healthy-to-soft by substance-preserving homing, while drainable buffers are processed item by item until empty."
    status: completed
  - id: ws3-buffer-disposition-ledger
    content: "Require a disposition ledger for every drained buffer item, and forbid archive-only closure of unprocessed content."
    status: completed
  - id: ws4-closeout-proof
    content: "Add closeout proof requirements that distinguish fitness evidence from knowledge-curation completion evidence."
    status: completed
  - id: ws5-validation
    content: "Validate the revised skill against the archive-before-processing failure mode and update examples or tests where useful."
    status: completed
isProject: false
---

# Consolidate Docs Mode Contract And Buffer Drain

## Status

Implemented 2026-05-27. `oak-consolidate-docs` now carries the missing mode
contract, dedicated-curation defaults, buffer disposition ledger requirement,
archive-before-processing failure check, and closeout proof contract.

## End Goal

Setting a goal that invokes `oak-consolidate-docs` is enough for an agent to do
the intended work without owner re-explanation.

The skill should support two explicit uses:

- **Session completion consolidation**: a bounded closeout pass that captures
  fresh learning, routes obvious substance to durable homes, and leaves any
  unresolved buffers live with honest next actions.
- **Dedicated knowledge curation**: a knowledge-preserving pass whose default is
  to bring documentation surfaces to a healthy-to-soft state where substance
  permits, and to process drainable buffers carefully until they are empty.

For dedicated curation, "empty" is valid only after every buffer item has a
recorded disposition. It is not a numerical target and cannot be satisfied by
moving unprocessed content into archive.

## Mechanism

Make the skill carry the missing operating contract:

1. Name the mode at start and bind different completion criteria to each mode.
2. Treat fitness as a routing signal, not the definition of success.
3. Define a drainable-buffer item protocol: read, understand, route, record
   disposition, then archive only if archive is the correct downstream home.
4. Require closeout evidence that proves item-level curation, not just lower
   line counts or softer fitness output.

## Means

### WS1: Mode Contract

Amend `.agent/skills/consolidate-docs/SKILL-CANONICAL.md` and the wrapper skill
at `.agents/skills/oak-consolidate-docs/SKILL.md` if needed.

The skill should require agents to declare one of:

- `session-completion`
- `dedicated-knowledge-curation`

If the owner only says "consolidate docs" during closeout, default to
`session-completion`. If the owner sets a curation goal, mentions buffers, or
asks for a curation pass, default to `dedicated-knowledge-curation`.

### WS2: Dedicated-Curation Defaults

Add explicit defaults for dedicated curation:

- documentation/reference surfaces: aim for healthy-to-soft by routing,
  splitting, sharpening, or creating durable homes;
- drainable buffers: process item by item until empty unless an owner-gated
  item must remain live with a named blocker;
- hard or critical fitness on documentation is a routing alarm, not permission
  to dilute substance.

This preserves the user's intended distinction: documentation may settle
between normal and soft, while buffers should drain to empty through curation.

### WS3: Buffer Disposition Ledger

Require a ledger for every buffer item touched during dedicated curation. Each
item must end in exactly one disposition:

- `graduated`: durable home created or updated, with path evidence;
- `duplicate`: already represented in a durable home, with path evidence;
- `owner-gated`: cannot proceed without owner decision, with the question and
  live holding location;
- `stale-withdrawn`: no longer valid, with reason;
- `carried-forward`: still valid but not drainable in this pass, with trigger
  and next action.

Archive is allowed only after the item has one of these dispositions. Archive
must not be the first processing step.

### WS4: Closeout Proof

Add a closeout block to the skill:

- mode used;
- fitness before and after;
- buffer item count before and after;
- disposition ledger pointer;
- durable homes changed;
- unresolved live items and blockers;
- explicit verdict: `complete`, `partial slice landed`, or `pending`.

In session-completion mode, a truthful `partial slice landed` is acceptable. In
dedicated-curation mode, `complete` requires documentation to be at the agreed
healthy-to-soft target and drainable buffers to be empty by ledger evidence.

### WS5: Validation

Validate against the specific failure mode this plan is meant to prevent:

- an agent must not be able to claim dedicated-curation completion from fitness
  output alone;
- an archive-only buffer drain must fail the skill's own checklist;
- a session-completion pass must not imply that all curation buffers were
  drained.

Use lightweight doc validation unless the implementation adds a parser,
validator, or example fixture that deserves a test.

## Acceptance Criteria

- The skill names both modes and their defaults.
- Dedicated-curation mode says documentation targets healthy-to-soft by
  substance-preserving routing, not by trimming.
- Dedicated-curation mode says drainable buffers are processed until empty, and
  defines empty as ledger-backed item disposition.
- The skill forbids archiving unprocessed buffer content as a way to lower
  pressure.
- Closeout proof separates fitness evidence from curation-completion evidence.
- The revised skill includes the archive-before-processing failure mode as an
  explicit anti-example or checklist failure.

## Non-Goals

- Do not drain the current live buffers as part of this plan-writing task.
- Do not change fitness thresholds unless the implementation discovers the
  thresholds themselves are wrong.
- Do not turn session-completion consolidation into a mandatory full curation
  pass.
- Do not add heavy automation before the skill contract is clear.

## Validation

Planned validation for the implementation:

- `pnpm practice:fitness:informational`
- markdown or format checks covering the touched skill and plan files
- any targeted test added for a new validator or example fixture

## Metacognition Notes

The inherited shape was "make consolidation pass fitness." The first-principles
shape is "preserve and route knowledge." This plan changes the skill so the
agent's goal, mode, evidence, and closeout verdict all point at knowledge
curation first, with fitness serving as a diagnostic signal.
