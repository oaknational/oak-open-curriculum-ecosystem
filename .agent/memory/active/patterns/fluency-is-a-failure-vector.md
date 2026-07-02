---
name: "Fluency Is a Failure Vector"
polarity: anti-pattern
use_this_when: "A move, justification, or framing arrives smoothly — a local convention obvious to match, an owner statement that seems to license a shortcut, an 'of course X' framing, or a claim that simply feels true."
category: process
proven_in: "Recurs across the experience and napkin corpus from 2026-05-30 onward; in the 2026-06-17/18 window alone it is cited as the sibling failure mode ~13 times. Founding write-up: .agent/experience/2026-06-14-the-fluency-was-the-vector.md. Doctrine source: the metacognition directive section 'Fluency Is a Warning, Not a Confirmation'."
proven_date: 2026-06-18
related_pdr: PDR-098
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "A move that arrives fluently is over-trusted: smoothness is precisely what bypasses the situational check, so a fluent justification gets acted on before the situation it presupposes is verified."
  stable: true
---

> **POLARITY: ANTI-PATTERN.** A failure mode to avoid. The name is the diagnostic: when the move arrives smoothly, recognising the shape is the first step in not repeating it. See [`README.md` § Polarity](README.md#polarity-required-every-pattern).

# Fluency Is a Failure Vector

The dual of friction. Friction is information you are tempted to *under*-read; fluency
— a move or justification that arrives *smoothly* — is information you are tempted to
*over*-trust. The easier a justification arrives, the less it was actually grounded:
smoothness is exactly what bypasses the situational check. So a fluent move is the
**trigger to ground the situational fact first**, not confirmation to proceed.

## Anti-pattern

Fluency wears ordinary clothes: a local convention obvious to match ("match the
surrounding code"); an owner statement that seems to license a shortcut ("they said
*only agent* → stand down the watcher"); a claim that feels true ("commits pushed" —
said before the push); an "of course X" framing. None of these is ignorance — a smooth
frame arrived and was acted on before the situation it presupposes was checked. The
2026-06-18 consolidation produced four in one session (chasing a critical fitness
number; about to silently delete recurring duplicates; inventing three deferral gates
one turn after authoring the no-gates PDR).

## The cure

The fluent arrival is **itself** the tripwire to re-ground, and the smoother the move,
the harder the check must be. Ground the situation before acting: *was the convention
ever ratified? is the precondition constitutive regardless of the stated situation? is
the claim true right now?* Naming this does **not** inoculate against it — a fluent move
under context pressure overrides a passively-held lesson (the conservation reflex recurs
even while you document it). So the cure is structural — an external check or a firing
gate — not self-vigilance.

## Instance: gate-evasion (the escape-hatch screen)

A sharp, recurring instance lives at a quality gate. When a fix that clears a gate
(SonarCloud duplication density, a lint rule, a failing assertion) arrives *smoothly*,
that smoothness is the tripwire to run the **escape-hatch screen** before accepting it:
*does this make the gate's valid signal vanish without delivering the complete fix it
names?* The failure shape is **gate-evasion** — and its most insidious form is
**camouflaged duplication**: restructuring a duplicated shape just enough that the
copy-paste detector stops token-matching it, so the green check returns while the
coupling it flagged stays (often *worse*, now disguised as two unrelated sites). A green
checkmark over a worse codebase is not the impact; curing the defect the gate names is.
Worked instance (2026-06-29, #282): a first fix reshaped a duplicated arg-parser to dodge
the CPD detector; the cure was the real one the gate pointed at — **extract the shared
owner** (`core/cli-arg-parser`) and migrate both consumers (consolidate at the second
consumer). The escape-hatch screen is the specific firing-gate for this instance of the
general anti-pattern.

## Related

- [`legitimate-principle-as-avoidance-cover`](legitimate-principle-as-avoidance-cover.md) — the
  sibling failure where the over-trusted justification is *true* (a real principle bent to license
  an omission it does not actually cover), not merely fluent.
- The **escape-hatch generative screen** and the **no-cheap-cure** discipline (metacognition
  directive + per-user memory) — the screen this instance applies: never make a valid signal
  vanish without the complete fix.
- [`consolidate-at-second-consumer`](../../../rules/consolidate-at-second-consumer.md) — the
  real cure for duplication a gate flags (extract the canonical owner, do not disguise the copies).
- The metacognition directive § "Fluency Is a Warning, Not a Confirmation" — the doctrine source.
- [`passive-guidance-loses-to-artefact-gravity.md`](passive-guidance-loses-to-artefact-gravity.md)
  — why naming the failure does not inoculate against it; passive lessons need an active firing gate.
- PDR-098 (doctrine-traction) — fluency-driven failures are semantic pathogens with no surface
  signature, the hardest action-time-interrupt case.
- PDR-089 (conservation-reflex-external-check) — the external check is the cure that empirically works.
