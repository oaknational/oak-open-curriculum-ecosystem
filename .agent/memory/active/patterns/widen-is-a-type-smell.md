---
related_pattern: reviewer-widening-is-always-wrong
name: "\"Widen\" Is a Type Smell — Discriminate Model-Wrong From Correct-and-Violated"
polarity: anti-pattern
use_this_when: "About to widen a list, type, union, or allowlist to make a case pass (or an owner/reviewer flags a 'widen') — the reach for a wider shape is usually hiding a type problem."
category: code
proven_in: ".agent/agent-tools reference-direction validator — 2026-06-19 owner correction (Drake lifts Obsidian)."
proven_date: 2026-06-19
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Widening a type/list/union to absorb a failing case, which masks a wrong model (the type does not match reality) or smuggles a genuine violation past a correct invariant."
  stable: true
---

> **POLARITY: ANTI-PATTERN.** The failure mode is reaching for a wider shape to
> pass a case. The cure is the discrimination below.
> See [`README.md` § Polarity](README.md#polarity-required-every-pattern).

# "Widen" Is a Type Smell — Discriminate Model-Wrong From Correct-and-Violated

## Principle

Widening a list, type, union, or allowlist to make a stubborn case pass usually
hides a type problem. The owner's standing wariness: *"I'm always slightly wary
of 'widen', it so often hides an improper solution to a type problem."* The
reach for "just make the type accept this too" is the tell.

Before widening, **discriminate** between two situations the reflex conflates:

- **The model is WRONG** — the type/list does not match reality; a value it
  rejects genuinely belongs. The fix is to **correct the model** (which may look
  like widening but is actually making the type *right*). This is legitimate.
- **The model is CORRECT-and-VIOLATED** — the case genuinely violates a correct
  invariant. Widening to absorb it **rejects** the invariant. The fix is to
  reject the widen and fix the case (or refuse it), never to weaken the type.

## Worked instance — 2026-06-19 (Drake lifts Obsidian)

A proposal to "widen the reference-direction validator to flag backticked paths"
to catch one stray reference. **Rejected on type grounds:** the validator's type
is *resolvable dependency*; a backtick is a *concept-name* — a different type the
de-link convention treats as safe. Flagging backticks conflates the two types →
~1030 false positives → gate-bricking. The model was CORRECT-and-VIOLATED; the
widen would have weakened it.

The contrast that proves the discrimination is not anti-widening dogma: adding
`.agent/analysis/` to the validator's *ephemeral* set in the same session was
**not** a widen-hack — analysis docs *are* ephemeral and were mis-typed as
`other`. That change CORRECTED the model. Same surface, opposite verdict, decided
by the discrimination, not by a blanket "never widen."

## The cure

Before widening a list / type / union / allowlist: ask *is the model wrong (fix
it) or correct-and-violated (reject the widen)?* If you cannot say which, you do
not yet understand the type well enough to change it.

## Related

- [`reviewer-widening-is-always-wrong`](reviewer-widening-is-always-wrong.md) —
  the reviewer-recommendation instance of this smell (a reviewer proposes the
  widen citing a valid rule); this entry is the general self-applied discipline.
- [`boundary-narrowing-for-schema-types`](boundary-narrowing-for-schema-types.md)
  — the positive dual: narrow at the boundary instead of widening the type.
- [`fluency-is-a-failure-vector`](fluency-is-a-failure-vector.md) — "just widen
  it" arrives fluently as the obvious fix.
