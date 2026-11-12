---
classification: situational
description: Data arriving from an external boundary (JSON.parse, API responses, file reads, SSE, WebSocket) is unknown; validate immediately to the exact expected shape (Zod, exhaustive guard, or SDK types) and never widen — as Record<string, unknown> is widening, not validation.
trigger: surface:boundary-data — TypeScript and authored content where external data enters
globs:
  - "**/*.ts"
  - "**/*.tsx"
  - "**/content/**/*.json"
---

# Strict Validation at External Boundaries

Operationalises [`principles.md` §Compiler Time Types and Runtime Validation](../directives/principles.md) and [`validation-strategy.md`](../directives/validation-strategy.md).

When data arrives from an external boundary (JSON.parse, API responses, file reads, SSE parsing, WebSocket messages), it is `unknown`. Validate immediately to the **exact known expected shape** using strict, complete validation (Zod schema, exhaustive type guard, or official SDK types). From that point on, use the validated type only. Never widen.

`as Record<string, unknown>` is widening, not narrowing — it is forbidden at boundaries just as it is everywhere else. A `typeof === 'object'` check followed by `as Record<string, unknown>` is a type assertion, not validation. It loses all type information.

The correct pattern:

1. Data arrives as `unknown`
2. Validate to the exact interface (e.g. `z.object({ result: z.object({ tools: z.array(...) }) })`)
3. Use the validated, fully-typed result from then on
4. If the shape is genuinely open-ended, that is a design problem to fix, not a type problem to work around

An admission predicate binds every axis it reasons about. Where kind is an
admission axis, an allowlist entry is a (name, kind) pair, never the name
alone: a transient-file allowlist that exempted by basename before kind
handling let a symlink wearing a transient name ride out of the symlink
refusals, and a place-only design-token admission did the same in the same
sitting (2026-08-19). An allowlist that deliberately admits along one axis (a
string-only token allowlist; OCE's path-only stale-invocation allowlist) binds that one axis and
invents no other. Validate each axis the decision depends on, at the boundary the value crosses.
A lookup table keyed by input text is an admission predicate as well: an object-literal flag
table admitted inherited names until it was held as a `Map`, so that `toString` or `__proto__`
is an unknown flag (OCE pull request 304, 2026-09-29; one instance).

Owner ruling (2026-07-28): **"Strict, all the time, everywhere"** — every
boundary the repository owns (authored content and configuration it reads,
environment values, fetched data, tool inputs and outputs, hook and CLI
inputs) carries a schema and is validated to it at entry, with realistic
examples drawn from real data. The founding instances: in OCE every MCP tool
carries input and output schemas (the graph tools first; the dated tolerance
from the same ruling, hand-authored runtime checks staying for now under the
V1 deadline, is an exception with a named revisit on OCE's tracker, never
doctrine); in jimcresswell.net the entity model's validation in its site
library.

See [`validation-strategy.md`](../directives/validation-strategy.md)
§Compile-time types and §Runtime validation at the boundary.

A boundary reader parses the shape and a judge applies the policy; a reader that rejects a value the
policy should judge hides the news. Blazar lifts Corona's review of the rollout reader found
"Parsing and judging are fused: the reader rejects values that rule 8 should judge" and that "The
seat is told the shape is unknown when the real news is that the policy loosened" (the seat's review
of 2026-09-24, event 636018d5).
