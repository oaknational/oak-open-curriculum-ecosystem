# Replace, Don't Bridge

Operationalises [`principles.md` §Architectural Excellence Over
Expediency](../directives/principles.md#architectural-excellence-over-expediency),
[`principles.md` §Code Design and Architectural Principles](../directives/principles.md#code-design-and-architectural-principles),
[`principles.md` §Refactoring](../directives/principles.md#refactoring),
and the active tripwire doctrine in
[`passive-guidance-loses-to-artefact-gravity.md`](../memory/active/patterns/passive-guidance-loses-to-artefact-gravity.md).

This rule exists because "no compatibility layers" is easy to agree
with abstractly and easy to rationalise away under delivery pressure.
The rationalisation vocabulary is stable: "temporary", "different
purposes", "migration path", "we can delete it later", "this just
keeps the old script reachable". Once that framing is accepted, the
bridge becomes architecture and new code starts depending on it.

## Rule

When replacing a contract, boundary, command surface, runtime path,
configuration model, naming scheme, or module shape:

1. Define the target canonical shape first.
2. Move the real logic to that canonical owner.
3. Update every caller to the canonical shape.
4. Delete the superseded path in the same change.
5. If steps 2-4 cannot land together cleanly, stop and rescope. Do
   not land a bridge.

The governing question is never "how do we keep both paths working?"
It is "what is the single canonical path, and how do we move everyone
onto it now?"

## Forbidden

- Compatibility wrappers, shims, proxy modules, adapter layers, or
  re-export barrels whose job is to let old code call new code or new
  code tolerate old contracts.
- Pass-through helpers that preserve legacy scripts or legacy runtime
  entrypoints behind a new product surface instead of migrating the
  underlying logic.
- Dual-path execution such as `if (new) else legacy`, tolerant
  parser/validator branches that accept both old and new shapes, or
  fallback configuration paths that keep superseded behaviour alive.
- Parallel file or symbol families such as `*.v2.ts`,
  `*-legacy.ts`, `*-compat.ts`, `*-old.ts`, `*-new.ts`, or
  `*-correct.ts` where git history should carry the evolution.
- TODO comments, removal-condition comments, or follow-up plan notes
  used to justify landing both old and new paths together.
- Partial renames that leave two names for one concept. One concept =
  one name, everywhere.

## Required First-Principles Check

Before landing any change that preserves both the old and the new
shape, answer all three questions:

1. What is the single canonical owner of this behaviour?
2. Which callers still depend on the old shape?
3. Why are those callers not being updated in this change?

If the answer to question 3 is schedule pressure, uncertainty,
"too many call sites", or "safer for now", the correct response is
to narrow scope or stop. Those are reasons to avoid the change, not
reasons to introduce a bridge.

## Legitimate Uses of "Bridge"

This rule targets compatibility bridges between a superseded contract
and its replacement.

It does **not** ban domain concepts whose real job is to bridge two
live systems or protocol layers as part of the intended architecture,
for example MCP host integration or schema-to-runtime translation.
Those are legitimate only when they are themselves the canonical
boundary, not when they are disguising old/new coexistence.

## What to Do Instead

- Move shared logic into an importable canonical module and call it
  directly from the owning surface.
- Rename in place and update all call sites, logs, docs, tests, and
  TSDoc in the same change.
- Delete dead code immediately once callers move.
- If the migration is too large for one safe change, cut a smaller
  correct slice. Do not land an intermediate compatibility layer.
- If you genuinely think the architecture requires both paths, pause
  and get an architecture or assumptions review before writing code.

## Why This Rule Is Strict

The repo already says "never create compatibility layers" in
`principles.md`. Repeated failures still happened because the doctrine
was passive at the point of decision. This rule is the tripwire: it
turns a broad principle into an explicit stop condition on the exact
failure shape.

## Related

- [`principles.md`](../directives/principles.md) — source doctrine
- [`apply-architectural-principles.md`](apply-architectural-principles.md)
  — broad architectural rule layer
- [`workaround-debt-compounds-through-rationalisation.md`](../memory/active/patterns/workaround-debt-compounds-through-rationalisation.md)
  — failure mode this rule counters
- [`passive-guidance-loses-to-artefact-gravity.md`](../memory/active/patterns/passive-guidance-loses-to-artefact-gravity.md)
  — why this had to become an always-applied rule
