# Strict Validation at External Boundaries

Operationalises [ADR-032 (External Boundary Validation)](../../docs/architecture/architectural-decisions/032-external-boundary-validation.md), [ADR-055 (Zod Version Boundaries)](../../docs/architecture/architectural-decisions/055-zod-version-boundaries.md), and [ADR-153 (Constant-Type-Predicate Pattern)](../../docs/architecture/architectural-decisions/153-constant-type-predicate-pattern.md).

When data arrives from an external boundary (JSON.parse, API responses, file reads, SSE parsing, WebSocket messages), it is `unknown`. Validate immediately to the **exact known expected shape** using strict, complete validation (Zod schema, exhaustive type guard, or official SDK types). From that point on, use the validated type only. Never widen.

`as Record<string, unknown>` is widening, not narrowing — it is forbidden at boundaries just as it is everywhere else. A `typeof === 'object'` check followed by `as Record<string, unknown>` is a type assertion, not validation. It loses all type information.

The correct pattern:

1. Data arrives as `unknown`
2. Validate to the exact interface (e.g. `z.object({ result: z.object({ tools: z.array(...) }) })`)
3. Use the validated, fully-typed result from then on
4. If the shape is genuinely open-ended, that is a design problem to fix, not a type problem to work around

Owner ruling on tool surfaces (2026-07-28): **"Strict, all the time,
everywhere"** — every MCP tool carries proper input AND output schemas, with
realistic examples drawn from real data (graph tools were the founding
instance). The dated tolerance from the same ruling — hand-authored runtime
checks staying for now under the V1 deadline — is an exception with a named
revisit (MCP-319 carries the schema follow-up), never doctrine.

See `docs/governance/typescript-practice.md` §Compiler-time Types and
Runtime Validation.
