# Use Result Pattern

Use `Result<T, E>` for error handling. Never throw exceptions. Errors are part of the type signature; the compiler ensures all cases are handled. Handle all cases explicitly.

When a constructed error **must** leave a boundary (e.g. at a trust
edge, a library surface that cannot return `Result`, or inside a
`catch` block re-expressing a caught error), attach `{ cause }` so
the causal chain is preserved. In `apps/**/src/**` and
`packages/sdks/**/src/**`, this is compile-time-enforced by ESLint
core's built-in [`preserve-caught-error`](https://eslint.org/docs/latest/rules/preserve-caught-error)
rule at `error` severity (added to ESLint 9.35.0; enabled with
`requireCatchParameter: true`). The rule catches missing cause,
cause-mismatch against a different variable, destructured-parameter
loss, and variable shadowing. Legitimate pass-through cases use the
standard `// eslint-disable-next-line preserve-caught-error --
<reason>` comment (composes with `@oaknational/no-eslint-disable`,
which requires a reason).

See `docs/architecture/architectural-decisions/088-result-pattern-for-error-handling.md` for the full ADR.
