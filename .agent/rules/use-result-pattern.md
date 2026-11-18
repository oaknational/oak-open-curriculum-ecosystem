---
classification: situational
description: Use Result<T, E> for error handling. Never throw exceptions.
trigger: surface:source-authoring
globs:
  - "**/*.{ts,tsx,mts}"
---

# Use Result Pattern

Use `Result<T, E>` for error handling. Never throw exceptions. Errors are part of the type signature, and the compiler rejects a read of `value` or `error` until `ok` is checked; handling the failure is the caller's job. Handle all cases explicitly.

Where a vendor's contract makes our code throw or reject, the owner's ruling of 2026-06-19
holds (one instance, OCE's JSON-LD document loader): "We can't ever control how third parties
handle errors, and we should not try. Either wrap our call to the vendor appropriately, or — if
we don't need the callback — simplify by deleting it. Simplification beats
fixing-through-added-complexity."

When a constructed error **must** leave a boundary (e.g. at a trust
edge, a library surface that cannot return `Result`, or inside a
`catch` block re-expressing a caught error), attach `{ cause }` so
the causal chain is preserved. ESLint core's built-in
[`preserve-caught-error`](https://eslint.org/docs/latest/rules/preserve-caught-error)
rule (ESLint 9.35.0+, with `requireCatchParameter: true`) is the mechanical
check for this. The rule catches missing cause,
cause-mismatch against a different variable, destructured-parameter
loss, and variable shadowing. Legitimate pass-through cases use the
standard `// eslint-disable-next-line preserve-caught-error --
<reason>` comment (composes with the estate's ESLint plugin's
`no-eslint-disable` rule, which requires a reason).

The `Result` type and its helpers live in the estate's result package
(jimcresswell.net: `@engraph/result` in `tooling/result/`; OCE: the package its
ADR-088 records); see its README. Enforcement: a `no-throw-statement` rule
exists in the estate's ESLint plugin; in jimcresswell.net it is switched off by
owner ruling (2026-09-12), and until the owner re-enables it reviewers carry
this rule there.
