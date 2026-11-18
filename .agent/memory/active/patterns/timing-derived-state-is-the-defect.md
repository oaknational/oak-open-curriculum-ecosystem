---
name: timing-derived-state-is-the-defect
polarity: anti-pattern
category: code
layer: general
use_this_when: "About to accept a design whose correctness depends on ordering, a small window, or one event arriving before another: a shared resource under fixed names, a state written from an event's timing, a validation that holds only because of step order, or a review argument that says 'usually' or 'the window is small'."
proven_in: >-
  Owner ruling 2026-08-17 on the round-1b relay filename race (about twenty
  seats racing three fixed scratchpad filenames; seven of twenty-eight spawns
  executed a foreign prompt; cured by per-seat directories); the 2026-08-18
  review round (a claims-file intent pointer whose dangling state was made
  unconstructible by deleting the pointer; an intent-id boundary validation
  that had been refused only by write-validator step order); the 2026-08-19
  design afternoon (effect-versus-fixup and focus-versus-default-action races
  cured by a render-time previous-state latch and declarative focus
  continuity). Conserved in .agent/memory/active/archive/napkin-2026-09-02.md
  and the 2026-08-19 fold-carry in distilled.md.
proven_date: 2026-08-19
related_pattern: timing-artefact-read-as-state
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: >-
    A correctness argument that rests on timing — "the window is small",
    "usually", an ordering assumption — ships a defect that passes locally
    and fires under load, on a slow runner, at scale, or the day the
    ordering changes.
  stable: true
---

> **POLARITY: ANTI-PATTERN.** This entry names a *failure mode to avoid*,
> not a shape to repeat.
>
> See [`patterns/README.md` § Polarity](README.md#polarity-required-every-pattern)
> for the polarity discipline.

## The failure shape

**State, or correctness, is DERIVED from timing.** The design works when
events arrive in the order the author pictured, and the author's argument
for it contains a probability. The owner's principle (2026-08-17, verbatim):
"nothing we do should ever, ever rely on timing or races, we build things
so they WORK" — "an important principle of fleet mechanics, and also in
general". Four recurring sub-shapes:

- **The shared resource under fixed names.** Concurrent seats or processes
  write the same paths; the race is "unlikely" until the fleet is twenty
  wide, when a quarter of the runs execute a foreign input.
- **State written from an event's timing.** A layout effect versus a fixup,
  a focus handler versus the element's default action, a script-opened panel
  versus the native toggle: the value depends on which handler ran first,
  and the local run happens to order them kindly.
- **Correctness by step order.** A validation holds only because the
  validator runs before the writer, or a pointer is safe only because its
  target is written first; reorder the steps and the guard is gone with no
  test failing.
- **The dangling reference kept alive by discipline.** A pointer that could
  dangle is protected by everyone remembering to update it, rather than by
  a shape in which it cannot dangle.

The tell in review is the vocabulary: "the window is small", "usually",
"by the time X runs", "as long as Y happens first".

## The cure

Make the order structural, or remove the need for one:

- **Eliminate the shared resource rather than shrinking its window** —
  per-seat directories, per-intent files, one writer per path.
- **Make the invalid state unconstructible** — delete the pointer whose
  dangling state was the bug; validate at the boundary the value crosses,
  not at a step that happens to precede the write.
- **Latch, do not schedule** — a render-time previous-state latch carries
  the fact the effect was racing for; declarative focus continuity
  (`summary:not(:focus)` keeps the focused node rendered) needs no script
  at all.
- **The mover-has-moved guard** — express a transition as "the mover has
  moved" instead of "enough time has passed": the seam's previous-state
  latch and the declarative focus guard are one shape.
- **Verify a disposition at the guard site.** A rationale quoted from an
  adjacent surface (a claims-advisory doctrine, for a queue guard's
  mechanical refusal) is refuted by the guard itself; read the guard.

## Falsifier

A case where the structural cure costs more over the system's life than
the race's measured harm — that would argue for a bounded, measured window
with an in-band detector that makes cross-contamination visible when it
happens, never for a bare probability argument. The merge bot's quiet
window is that bounded shape, not a structural cure: the pr-lifecycle
contract names it a proxy for review-run-boundary visibility that agents
lack, sized longer than the measured async lag and anchored on the latest
review binding; the head pin beside it is the structural part (a different
revision cannot merge), and an owner word issued from direct visibility of
the run boundary supersedes the proxy.
