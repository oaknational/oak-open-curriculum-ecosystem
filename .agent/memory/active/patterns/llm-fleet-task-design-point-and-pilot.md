---
name: LLM Fleet Task Design — Workers Point, Dispatcher Copies; Pilot Before Dispatch
polarity: pattern
use_this_when: Designing a fleet/workflow task whose workers must produce verbatim-anchored output verified against pinned bytes, or whose judgment procedure sits behind an existing canary/ground-truth key
category: agent
layer: general
proven_in: .agent/memory/active/archive/napkin-2026-07-20.md (2026-07-15 reader-sample batch; 2026-07-16 canary pilot + 18-agent re-assessment)
proven_date: 2026-07-16
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Burning a corpus-scale token budget to discover that worker copy-fidelity or a self-invented judgment procedure fails its own acceptance gate — a failure a cheap known-answer pilot would have caught first"
  stable: true
---

> **POLARITY: PATTERN.** Two composing task-design moves for LLM fleets.
>
> See [`patterns/README.md` § Polarity](README.md#polarity-required-every-pattern).

## Move 1 — Workers POINT, the dispatcher COPIES

In any fleet where verbatim-anchored output is verified against pinned
bytes, the worker contract is locate-only: a line anchor plus a trimmed
confirming quote. The dispatcher derives the verbatim bytes
deterministically from the pinned window (strictly more verbatim than any
worker copy) and verifies trimmed-equality at the anchor. Calibration teeth
stay with planted canaries.

Evidence (one wave, same workers): small-model readers caught 3/3
marker-free canary plants exactly, while 17/30 windows failed four-step byte
verification on ONE class — line numbers drifting ±1 and leading whitespace
stripped when reproducing quotes. Small models CATCH but cannot COPY;
byte-fidelity belongs to deterministic code.

## Move 2 — Run the cheapest known-answer pilot before corpus dispatch

For any self-invented LLM decision procedure sitting behind an existing
canary/ground-truth key: run the procedure against JUST the known-answer
subset before any full-corpus dispatch, and treat "the pipe is tested" as a
claim about plumbing, never about judgment content. A verified pipe (unit
tests, gates green) says nothing about whether the decision procedure meets
its own acceptance gate.

Evidence: a map-stage pilot over the 8 canary files cost ~100k tokens and
scored 1/8 clean — where the fluent default (full dispatch, check the gate
at the end) would have spent a large share of a 6M-token budget to learn the
same verdict. The pilot's measured per-invocation costs also re-grounded the
spend arithmetic, independently HALTing the dispatch (the founding estimate
was ~3.3× under the measured cost).

## Pilot hygiene (defects the worked instance's re-assessment found)

- Pin and RECORD the tree SHA the fleet reads; harness-verify per-file
  presence/readability pre-dispatch (deterministic, not agent-reported) — a
  stale checkout silently confounded one root-cause claim.
- Give the output schema a channel for zero-results and missing-file states;
  require per-file instance counts including zeroes, or coverage gaps are
  unobservable.
- Replay deterministic stages over already-paid-for pilot data before
  buying more evidence — a zero-cost join replay converted three eyeballed
  claims into measured ones and found two new defects.
