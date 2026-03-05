# Fail Fast With Helpful Errors

Fail fast with helpful error messages. Never fail silently. Never ignore errors. Detect problems early (validate at entry points, not deep in the call stack), fail immediately (don't continue with invalid state), be specific (error messages must explain what went wrong and why), and guide resolution (indicate how to fix the problem).

Anti-patterns: swallowing exceptions with empty catch blocks, logging errors but continuing execution, returning `null`/`undefined` to indicate failure, generic "An error occurred" messages.

See `.agent/directives/rules.md` §Fail FAST for the full policy.
