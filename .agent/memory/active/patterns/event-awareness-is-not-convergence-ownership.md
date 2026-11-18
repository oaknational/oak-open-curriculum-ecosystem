---
name: "Event Awareness Is Not Convergence Ownership"
polarity: anti-pattern
use_this_when: "You are waiting on an external convergence loop (PR review rounds, CI, a deploy pipeline, a bot's async passes) with monitors or scheduled probes armed, and you are about to treat that awareness as owning the loop. Check whether your watch terminates only on the loop's genuine terminal states and whether anything can arrive while you sleep."
category: agent
layer: general
proven_in: "Two owner corrections, two seats, one arc: (1) PR #317 (2026-07-07) — six asynchronous bot rounds; the agent declared at each zero-unresolved MOMENT and idled on event monitors between rounds; the owner spotted every new arrival ('why has this become a loop operated by me?'); (2) PR #324/#325 (2026-07-08) — a second seat, having READ the first seat's graduated lesson at session open, still ran scheduled 8.5-minute nap-probes while bot rounds landed in the gaps, three rounds running. Cure deployed live on #330: a supervised watch terminating only on MERGED/CLOSED."
proven_date: 2026-07-08
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Monitors and scheduled probes satisfying the letter of cadence rules while the convergence obligation silently transfers to the human — every sleep is a blind window, and each green read is a moment treated as a state."
  stable: true
---

> **POLARITY: ANTI-PATTERN.** Awareness of arrivals is not ownership of the
> loop that must converge.

## The failure mode

An external process converges through asynchronous rounds on a clock you do
not control. The agent arms monitors or scheduled probes and treats the
armed state as diligence — the probe pattern FEELS disciplined (scheduled,
regular, documented), which is fluency wearing process clothes. But:

- every sleep between probes is a blind window sized exactly for an async
  arrival;
- each "converged now" read is a MOMENT treated as a state — it expires on
  the external clock;
- the cadence rules are satisfied while the convergence obligation silently
  transfers to whoever is actually watching — usually the owner.

The second worked instance proves vigilance and even *reading the lesson*
do not cure it: the structure (a watch that can sleep or exit early) is the
generator, not the attention level.

## The cure

Own the terminal condition, structurally:

- Run a watch whose exit conditions enumerate EVERY terminal state of the
  external loop (merged/closed; new-findings>0; failure), never only the
  happy path, and supervise it — re-arm on every non-terminal exit.
- The only claim you may broadcast is one no later event can un-make (for a
  PR: MERGED). Anything earlier is "ready", never "done".
- On any event, act immediately and fully (full harvest, one bundled
  response), then return to the watch.

The PR-specific canonical shape lives in `pr-lifecycle` Phases 5–6 (the
supervised terminal-condition watch). This pattern is the general form: it
applies to any external convergence loop with async arrivals.

Siblings: `fluency-is-a-failure-vector.md` (the probe cadence arrives as
felt diligence); `substrate-pointer-read-as-current-state.md` (the green
read as a decayed pointer).
