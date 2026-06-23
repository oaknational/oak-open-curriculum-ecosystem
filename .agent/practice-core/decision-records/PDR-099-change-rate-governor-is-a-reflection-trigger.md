---
pdr_kind: governance
---

# PDR-099: A Self-Modifying Practice's Change-Rate Governor Is a Reflection-Trigger

**Status**: Accepted
**Date**: 2026-06-15
**Related**:
ADR-131 §The Self-Referential Property
(the Practice governs its own change-process; rules about rule-creation are
subject to the same loop);
ADR-144 §Loop Health
(a fitness signal prompts a short reflection, not a mechanical response; "was the
limit set incorrectly?" is the empirical-calibration question);
[PDR-038](PDR-038-stated-principles-require-structural-enforcement.md)
(stated principles require structural enforcement — the discipline this governor
paces);
the `consolidate-docs` SKILL (the repo-tier instance: its
`> N Core amendments → pause-and-stabilise` count).

## Context

A self-modifying Practice needs a governor on the rate at which it changes its own
core (PDRs, the trinity, always-applied rules). The repo's instance is
`consolidate-docs`'s "`> 3` Core amendments in a pass → pause and stabilise" count.
Two distinct objects were conflated under that single number, and the conflation
produced a failure mode (observed and owner-corrected during the 2026-06-15
consolidation arc):

- a **rate limit** — a ceiling on how many Core changes are safe per unit of
  validation. A rate limit *can* be too conservative: it can defer
  well-evidenced, owner-directed graduations purely to stay under a guessed number.
- a **reflection-trigger** — a prompt to pause and ask whether validation is
  keeping pace with structural change. A reflection-trigger is *never* too
  conservative, because reflecting is cheap.

Treating the count as a near-veto (a rate limit) let an untuned guess override
ripe graduations. The worked instance: recommending "only graduate item X to stay
under the threshold" — letting the guessed cap defer well-evidenced owner-directed
Core work.

## Decision

**A self-modifying Practice's change-rate governor is a reflection-trigger, not a
rate cap. Its threshold is tuned by observed stabilisation, never set as a guessed
fixed ceiling.**

1. **The count PROMPTS the reflection; the reflection's ANSWER governs the pause.**
   When the change count crosses the threshold, run the short reflection — *is
   validation keeping pace with the structural change? is there any evidence of
   instability (Core changes from recent sessions being reverted, churned, or
   re-litigated)?* The pause-and-stabilise decision follows from that answer, not
   from the count itself. A crossed count with a clean reflection (validation is
   keeping pace; no instability) does not force a pause.

2. **The absorbable rate scales with validation capacity.** How many Core changes
   are safe per pass depends on how much validation the changes will receive
   (sessions and agents applying the Core afterwards). Under heavy usage the early
   guessed threshold is plausibly too low; under light usage it may be about right.
   A single fixed number cannot be correct across both.

3. **Tune empirically; do not guess a new number.** The honest calibration is the
   feedback loop, not a fresh guess: observe whether Core changes made under a
   given cadence STABILISE (survive and get applied in subsequent sessions) or get
   REVERTED / churned. Stabilisation says the cadence is safe — the prompt
   threshold can rise. Reversion / churn says the cadence outran validation — it
   should fall. Core-change validation is slow (it needs subsequent sessions to
   exercise the change), so a higher rate is never *obviously* safe without that
   evidence — which is exactly why the governor is a reflection-trigger, not a
   number to optimise.

## Scope of this acceptance

**Ratified** (deductive, and already operative at the repo tier): items 1 and 2 —
the count prompts the reflection (it does not decide), and the absorbable rate
scales with validation capacity. These follow from the definitions plus the
already-ratified ADR-144 signal-prompts-reflection shape, and the repo-tier reframe
is already committed in the `consolidate-docs` SKILL.

**Held as a falsifiable hypothesis, not a ratified finding**: item 3's specific
causal claim that *observed stabilisation-vs-reversion tracks the change cadence*.
The empirical-calibration COMMITMENT is accepted (calibrate by evidence, never by
re-guessing a number); but stabilisation-vs-reversion being the right tracking
signal has zero recorded instances behind it — it is exactly the §Falsifiability
hypothesis below. Do not read item 3 as validated: it is the accepted method plus an
as-yet-untested choice of signal.

## Reconciliation

- **ADR-131 §Self-Referential.** The Practice's own governance applies to itself;
  this governor is that self-applicability turned on the Practice's *change rate*.
  The reflection-trigger is the loop governing how fast the loop may rewrite itself.
- **ADR-144 §Loop Health.** A fitness signal reaching a zone prompts a short
  post-mortem reflection (why didn't earlier zones fire? *was the limit set
  incorrectly?* is the file a symptom of a missing graduation?), not a mechanical
  response. This PDR is the same shape applied to the change-RATE signal: the count
  is a zone-crossing that prompts a reflection, and "was the limit set incorrectly?"
  is precisely the empirical-calibration question — answered by observed
  stabilisation, not by re-guessing.

## Consequences

### Enables

- Owner-directed, well-evidenced Core graduations are not deferred merely to stay
  under a guessed count; the reflection (not the number) decides.
- The governor self-corrects: its threshold moves toward the true absorbable rate
  as stabilisation evidence accumulates, instead of staying frozen at the first
  guess.

### Forbids

- Treating the change count as a near-veto / hard cap on Core changes in a pass.
  The count prompts; it does not decide.
- "Re-tuning" by picking a new fixed number from intuition. Re-tuning is reading
  the stabilisation-vs-reversion evidence, not guessing again.
- Using the governor to defer a graduation whose evidence and owner direction are
  both present, on the sole ground of the count. (The reflection may still pause
  for a real instability signal — that is the governor working, not a cap.)

### Accepted cost

- The reflection has a per-pass cost (the short "is validation keeping pace?"
  check). It is cheap relative to the cost of either churned Core (rate too fast)
  or deferred ripe doctrine (cap too conservative).

## Falsifiability

The doctrine is falsified if a *fixed cap* is shown to govern Core-change health
better than the reflection-trigger — e.g. if reflection-gated passes consistently
produce churned/reverted Core that a simple count ceiling would have prevented.
The empirical-tuning claim is falsified if observed stabilisation-vs-reversion
turns out not to track the change cadence at all (the rate is uncorrelated with
Core-change durability), in which case the governor needs a different signal than
stabilisation. Positive confirmation is the ordinary case: graduations made under
a reflection-clean pass that stabilise across subsequent sessions.
