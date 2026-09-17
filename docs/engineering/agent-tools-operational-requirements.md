# Agent-tools operational requirements — performance, bandwidth, latency

Commissioned by the owner 2026-08-06 ("we need performance and
bandwidth and latency requirements for agent tools") in the same hour
as the ratified seam-defect reflection
(`.agent/reports/agentic-engineering/agent-tools-seam-defects-reflection-2026-08-06.md`),
whose defect corpus is this document's grounding evidence. Status:
v1, binding on NEW front-door agent-tools commands at adoption and on
the open PR #790 cure round; existing commands get a conformance sweep
as a named follow-up (pointer, not scheduled here).

Every requirement is testable and names its proof class. Measured
values carry their measurement date and are re-measurable; limits
derive from measurements, never from defaults.

## Bandwidth and volume

- **R1 — No silent finite buffers on uncontrolled output.** Any
  subprocess whose output volume the tool does not control MUST be
  consumed via streaming, or via an explicit buffer sized per R2 that
  FAILS LOUD on overflow with the measured context in the error.
  Grounding: the repository's own pre-push gate chain emitted
  1,852,962 bytes on a green run (measured 2026-08-06, turbo leg only
  — a lower bound) against Node `spawnSync`'s 1 MiB default; the
  result was ENOBUFS, SIGTERM, and a push that silently never landed.
  Proof: a test drives ≥2× the recorded measured corpus through the
  capture path.
- **R2 — Limits derive from measured baselines with margin.** Where a
  limit must exist, it derives from a measured baseline recorded
  alongside the requirement (value, date, measurement command) with at
  least 4× margin, and the measurement is repeatable. A default
  inherited from a runtime or library is not a limit choice — it is an
  unexamined seam.

## Latency

- **R3 — Every command declares its latency class.** In `--help`:
  `interactive` (target < 10 s end-to-end), `bounded-run` (declared
  budget, itself ≤ the consumed credential's lifetime per R5), or
  `watch` (unbounded lifetime, bounded per-tick work with a declared
  per-step deadline). Grounding: the comms-watch drain evidence —
  short step deadlines so wedges die cheap; the merge command's
  budget-bounded-by-token-hour shape.
- **R4 — Silence horizons are declared.** Any command that can be
  healthily output-silent for more than 60 s MUST declare its maximum
  healthy silence in `--help` and emit progress at or before that
  horizon. Silence is never the success signal; a monitor must be able
  to distinguish "working" from "dead" using declared facts.

## Budgets and credentials

- **R5 — Credential-lifetime budgets bind every iteration.** An
  operation consuming a minted credential bounds its total runtime by
  the credential's ACTUAL expiry (read from the mint response, never an
  assumed TTL), with the margin check applied on every iteration
  INCLUDING THE FIRST. Grounding: the first-poll deadline bypass
  (`poll > 1 &&`) reproduced on PR #790 — a token already inside its
  margin could still act on the first reading.

## Performance under degradation

- **R6 — Degradation is loud.** When a performance-sensitive derived
  operation loses its optimization precondition, it refuses or warns —
  never silently degrades. Grounding: a bare-URL remote turned the
  pre-push scan's incremental range into a 5,009-commit full-history
  superset with zero signal (correct results, silently unbounded
  cost).
- **R7 — Remote-poll floors and guards.** Remote-API poll loops:
  cadence ≥ 30 s; per-pass batch bounds; per-step deadlines;
  supervisor-pid self-exit plus a timeout backstop. These are the
  proven comms-watch conventions generalized; a new watch command
  inherits them by construction, never re-derives them.

## Verification register

- **R8 — Live-fire acceptance.** Every front-door command lands with
  at least one acceptance leg that executes the REAL command against
  the REAL repository (no faked boundary) within safe bounds at
  landing time. Grounding: seven static/simulated examination
  instruments passed a push command that could not push; one live
  execution found it in minutes. Simulation certifies the model; only
  execution certifies the seam.
- **R9 — External-contract closure.** Where an adjacent system owns an
  oracle or a documented contract (git's `check-ref-format`, git's
  credential-resolution chain, an API's failure semantics, a runtime's
  buffer defaults), the tool queries the oracle at time of use or
  enumerates the contract's full set in a reviewable table in the
  source. A hand-derived subset ("the lookalike") is a defect even
  while its tests are green. Grounding: four git-rejected ref shapes
  accepted by a hand grammar; an env-scrub that missed the askpass
  fallbacks; post-PUT gateway semantics initially modeled as
  merge-failure.
