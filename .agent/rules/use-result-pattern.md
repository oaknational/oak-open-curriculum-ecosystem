# Use Result Pattern

Use `Result<T, E>` for error handling. Never throw exceptions. Errors are part of the type signature; the compiler ensures all cases are handled. Handle all cases explicitly.

See `docs/architecture/architectural-decisions/088-result-pattern-for-error-handling.md` for the full ADR.
