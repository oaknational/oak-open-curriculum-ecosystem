---
name: "A Throw That Only Narrows a Too-Wide Return Type → Strengthen the Type, Not Route to Result"
polarity: pattern
use_this_when: "Migrating a throw to a Result type (or auditing error handling) and the throw exists only to narrow a too-wide upstream return type — its error arm would be permanently unreachable."
category: code
proven_in: "redactTelemetryValue overload — observability redactText + logger redactStringValue, 2026-06-19 (Siren mends Rudder)."
proven_date: 2026-06-19
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Routing a type-narrowing-artifact throw through Result, which bolts a permanently-unreachable error arm onto the function and cascades that arm to every caller."
  stable: true
---

> **POLARITY: PATTERN.** A shape to repeat: strengthen the upstream type so the
> guard is provably dead, then delete it.
> See [`README.md` § Polarity](README.md#polarity-required-every-pattern).

# A Throw That Only Narrows a Too-Wide Return Type → Strengthen the Type

## Principle

Not every `throw` is a recoverable error worth a `Result`. A throw that exists
**only to narrow a too-wide upstream return type** — e.g. a function typed
`JsonValue → JsonValue` whose string branch always returns a string, with a
`throw` guarding the "impossible" non-string case — is a *type-narrowing
artifact*, not an error path.

Routing such a throw through `Result`:

- bolts a **permanently-unreachable `err` arm** onto the function, and
- **cascades** that unreachable arm to every caller, who must now handle an error
  that can never occur.

The correct fix is to **strengthen the upstream type** — add a `string → string`
overload (or otherwise tighten the signature) — after which the guard is
**provably dead** and deletes cleanly: no `Result`, no cascade, behaviour
identical. This is *"would it be simpler if the system changed?"* in miniature:
fix the type that was too wide rather than propagate machinery around it.

## Worked instance — 2026-06-19 (Siren mends Rudder)

`redactTelemetryValue` was typed `JsonValue → JsonValue`; its string branch
always returned a string, guarded by a throw. Adding one `string → string`
overload made the guard provably dead at two call sites — observability
`redactText` and logger `redactStringValue` — both of which deleted the throw
cleanly with identical behaviour, and unlocked a third (express-middleware).
One overload, three throws removed, zero `Result` cascade.

## How to tell it apart

A throw is a narrowing artifact (not an error) when **all** hold: the value it
rejects cannot occur given the real upstream behaviour; the rejection exists to
satisfy a too-wide signature, not to handle input; and tightening the signature
makes the compiler prove the branch dead. If instead the value *can* occur at
runtime (untrusted input, vendor callback, genuine invariant), it is a real error
— route it through `Result` (or honour the vendor contract at the boundary).

## Related

- [`fix-at-source-not-consumer`](fix-at-source-not-consumer.md) — strengthen the
  producer's type rather than work around it at each consumer.
- [`boundary-narrowing-for-schema-types`](boundary-narrowing-for-schema-types.md)
  — the narrowing technique at a schema boundary.
- ADR-088 (exception policy) — the migration context: keep throws for genuine
  invariants/exhaustiveness; this pattern removes the *false* throws first.
