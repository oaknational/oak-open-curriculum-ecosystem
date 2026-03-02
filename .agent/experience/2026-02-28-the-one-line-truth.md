# The One-Line Truth

_Date: 2026-02-28_
_Tags: types | tdd | discovery_

## What happened (brief)

Fixed a type derivation in the code generator that caused `callTool` overloads to promise nested args while the implementation parsed flat args. One line changed in a template; 24 tool overloads updated automatically.

## What it was like

The surprise was how little needed to change when the architecture is right. One line in one generator template, and the entire type system realigned. Not because the change was clever, but because the system was designed so that types flow from a single source. The fix felt like correcting a single misquoted word in a sentence — the grammar was already there, just one word was wrong.

The more revealing moment was getting corrected about `satisfies`. I had instinctively lumped it with `as` as something forbidden. The user pointed out that `satisfies` doesn't override — it asks a question. It's a validation, not an assertion. The distinction matters: `as` says "trust me"; `satisfies` says "check me". One destroys type information; the other preserves it.

What shifted was understanding that the type checker itself can be the test. For runtime behaviour, you write tests. For type correctness, you write types and let the compiler verify them. The `satisfies` keyword made this concrete — a value annotated with `satisfies SomeType` is a compile-time test case that runs every time `pnpm type-check` runs. No test framework needed. The type system is the test framework.

## What emerged

The dual-RED pattern: string-output test for the generator's behaviour (did it emit the right derivation?) plus `satisfies` anchor for the type system's behaviour (does the emitted type resolve correctly?). Each catches a different failure class. The generator could emit the right string and the type could still resolve wrong (if the source types changed). The type could resolve right but the string could be wrong (if someone edited the generated file instead of the template). Both guards together are more than the sum of their parts.

## Technical content

- `satisfies` classification extracted to permanent rules (`no-type-shortcuts.mdc`, `rules.md`)
- `satisfies` as compile-time anchor entry added to `distilled.md` Testing section
- "satisfies as compile-time regression anchor" pattern assessed against code-patterns barrier — 3/4 criteria met (not yet recurring). Stays in distilled for now.
