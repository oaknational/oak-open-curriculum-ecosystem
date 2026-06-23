---
name: "A Fidelity Audit Is Not a Currency Audit"
polarity: anti-pattern
use_this_when: "Verifying a claim that rests on an inherited surface (a record, a thread note, a prior session's framing) before relying on it."
category: process
proven_in: "2026-06-17 strategy/plan-estate session (Tempest spins Spire): a claim that faithfully matched its source record still rested on a stale framing; the owner's 'are you working from the latest understanding?' forced the deeper check the fidelity audit had passed over."
proven_date: 2026-06-18
related_pdr: PDR-013
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Verifying 'does the artefact say what the record claims?' is currency-blind — a claim grounded faithfully in a surface that is no longer the live authority passes the audit and is then relied on as current."
  stable: true
---

> **POLARITY: ANTI-PATTERN.** A failure mode to avoid. See [`README.md` § Polarity](README.md#polarity-required-every-pattern).

# A Fidelity Audit Is Not a Currency Audit

Two different checks get conflated when verifying an inherited claim. **Fidelity**: does
the artefact actually say what the record claims it says? **Currency**: is that framing
still the live authority, or has it been superseded? A claim can pass the fidelity audit
perfectly and still be wrong, because the surface it faithfully quotes is stale.

## Anti-pattern

Confirming a claim by checking it against its cited source, finding an exact match, and
relying on it — without asking whether that source is still the current authority. The
match produces false confidence: the verification was real but currency-blind. The owner's
"are you working from the latest understanding?" is the cue that the missing axis is currency.

## The cure

When verifying an inherited surface, run **both** axes: ground the claim against the
artefact (fidelity) **and** confirm the framing is still live in the current authorities
(currency) before relying on it. A surface is a pointer whose freshness was last guaranteed
when it was written; treat it as a hypothesis until the current-authority check passes.

## Related

- PDR-013 (grounding-and-framing discipline) — fidelity is the grounding half; this adds the
  currency half.
- [`substrate-pointer-read-as-current-state.md`](substrate-pointer-read-as-current-state.md) —
  the multi-agent state-staleness sibling (a *value* drifting); this is the *framing* drifting.
- [`fluency-is-a-failure-vector.md`](fluency-is-a-failure-vector.md) — "the source matches, so the
  claim holds" is the fluent move that skips the currency check.
