# ADR-160: Non-Bypassable Redaction Barrier as Principle

**Status**: Proposed
**Date**: 2026-04-17
**Supersedes in part**: [ADR-143 §6](143-coherent-structured-fan-out-for-observability.md#6-shared-redaction-barrier)
(the enumerated list of hook types; the rest of ADR-143 remains in force)
**Related**: [ADR-078](078-dependency-injection-for-testability.md) — DI for
testability, the seam the redactor is injected through;
[ADR-143](143-coherent-structured-fan-out-for-observability.md) — parent
observability architecture;
[`packages/libs/sentry-node/src/runtime-redaction.ts`](../../../packages/libs/sentry-node/src/runtime-redaction.ts) — implementation.

## Context

ADR-143 §6 establishes that the shared telemetry redaction policy is
applied before any sink receives data, and it enumerates five hook
types that the policy must cover: `beforeSend`,
`beforeSendTransaction`, `beforeSendSpan`, `beforeSendLog`, and
breadcrumb filtering.

The enumerated form of §6 is a footgun. The Sentry Observability
Maximisation work (see
[`sentry-observability-maximisation-mcp.plan.md`](../../../.agent/plans/architecture-and-infrastructure/active/sentry-observability-maximisation-mcp.plan.md))
introduces a new fan-out path, `beforeSendMetric`, for Sentry's
dedicated metrics pipeline. A future lane introduces
`captureFeedback` — another fan-out the original list does not
anticipate. The MCP App browser widget (L-12) will introduce a
browser-side variant of the redaction pathway via `@sentry/browser`'s
`beforeSend` / `beforeSendTransaction` hooks. The Search CLI branch
mirrors the server side and may add its own fan-out paths
(Elasticsearch instrumentation events; future ingest-log fan-out).

Each time a new fan-out path is added, the enumerated list in
§6 has to be amended, and in the meantime the list reads as
canonical. A contributor reading §6 as exhaustive may reasonably
conclude that a new fan-out path is "outside the redaction barrier
by default until §6 is updated." That is the wrong default. The
**intent** of ADR-143 §6 is that **any** fan-out path is inside
the barrier; the enumeration is incidental to the intent.

Additionally, during review of the maximisation plan, sentry-reviewer
pointed out that the existing hook contracts are **not uniform**:

- `beforeSend` and `beforeSendTransaction` may be `async`
  (`Promise<Event | null>` return).
- `beforeSendLog`, `beforeSendMetric`, and breadcrumb filtering are
  **synchronous** and single-argument.
- `beforeSendSpan` can **mutate** the span but cannot drop it
  (no `| null` return in the typed signature).

An enumerated list hides these contract differences; a principle must
name them so a future implementer does not assume uniformity where
none exists.

## Decision

Redefine §6 as a **principle with a closure property and a test
gate**, superseding the enumerated list in ADR-143 §6. The rest of
ADR-143 (sink model, `OtelLogRecord` currency, workspace scope, etc.)
remains in force.

### The Principle

> **Every fan-out path that carries telemetry data to a destination
> beyond `@oaknational/logger`'s stdout sink MUST apply the shared
> redaction policy before the destination receives the data. No
> fan-out path may bypass the redactor, regardless of hook shape,
> runtime (Node / browser), or vendor (Sentry / future telemetry
> backends).**

### The Closure Property

For the principle to remain enforceable rather than aspirational, the
following closure property must hold:

1. **Every adapter that introduces a new fan-out path** MUST add the
   redactor application to that path in the same change set.
2. **The redactor is applied first**; any consumer-supplied
   post-redaction hook (for example, the MCP app's
   `sanitise-mcp-events.ts`) sees only post-redaction payloads and
   can never access pre-redaction data.
3. **A test in each consuming workspace** asserts that a known-PII
   payload fed through the new fan-out path emerges redacted at the
   destination (fixture-mode assertion is sufficient).

### Known Hook Contract Non-Uniformity

Implementers of new fan-out paths must match the shape of the hook
they are wiring:

| Hook                    | Return shape                                                        | Synchrony     | Can drop?                                       |
| ----------------------- | ------------------------------------------------------------------- | ------------- | ----------------------------------------------- |
| `beforeSend`            | `Event \| PromiseLike<Event \| null> \| null`                       | async or sync | Yes (`null`)                                    |
| `beforeSendTransaction` | `TransactionEvent \| PromiseLike<TransactionEvent \| null> \| null` | async or sync | Yes (`null`)                                    |
| `beforeSendSpan`        | `SpanJSON` (typed)                                                  | sync          | **No** — the typed return does not admit `null` |
| `beforeSendLog`         | `Log \| null`                                                       | sync          | Yes (`null`)                                    |
| `beforeSendMetric`      | `Metric \| null`                                                    | sync          | Yes (`null`)                                    |
| `beforeBreadcrumb`      | `Breadcrumb \| null`                                                | sync          | Yes (`null`)                                    |

The redactor must match each contract exactly. A synchronous shared
redactor is adequate today; if a future fan-out requires async
redaction (for example, an external classification service),
introducing async breaks the synchronous contracts. Such a change
requires an ADR amendment, not an in-place refactor.

### Runtime Extension: Browser Side (L-12)

The MCP App browser widget will introduce `@sentry/browser` hooks
alongside the existing `@sentry/node` ones. The shared redactor
lives in `packages/libs/sentry-node/src/runtime-redaction.ts`, which
is Node-only (depends on `@sentry/node` types). Satisfying this ADR
for the browser side requires extracting a pure,
runtime-agnostic redactor core into a browser-safe package (for
example `@oaknational/telemetry-redaction-core`). Both the Node
adapter and the browser adapter compose it. Failure to extract
the core would force the widget to re-implement the redaction policy,
violating this ADR's single-source-of-truth invariant.

## Test Gate

A structural test (or a workspace-specific conformance test per lane
that adds a fan-out) MUST verify the closure property. The minimum
acceptable gate:

1. For each registered fan-out hook, assert that the adapter's
   composed options include the redactor in that position.
2. For each fan-out, a fixture-mode test feeds a payload containing
   a known redactable value (e.g. `[REDACTED]` boundary text or a
   known email-like string per the redaction policy) and asserts
   the value emerges redacted at the fixture capture.

When a new fan-out path is added without a corresponding gate update,
lint / type-check / test-review catches the omission. This is the
enforce-edge of the redaction doctrine.

## Consequences

### Positive

- **Future fan-out paths are inside the barrier by default.** No ADR
  amendment is required to add a new hook, only a conformance test
  and the redactor invocation.
- **The browser side has a clear doctrine** for when the shared
  redactor is extracted into a runtime-agnostic core.
- **Contract non-uniformity is documented**, so the next implementer
  does not assume async-or-sync or can-drop where they cannot.
- **The redactor is recognised as a closure**, not an enumeration.
  This matches how ADRs generalise elsewhere in this repo (e.g.
  ADR-088's `Result<T, E>` as a pattern, not a per-call rule).

### Negative / trade-offs

- **More implementer responsibility**. Adding a fan-out path now
  requires both the redactor invocation and the conformance test —
  not just a registry entry.
- **Browser-side runtime-agnostic extraction is new work**. The
  existing redactor is coupled to Node types; L-12's prerequisite
  is a package split.

## Alternatives Considered

1. **Amend ADR-143 §6 in place to extend the enumeration.** Rejected
   per the repo's ADR convention (successor ADRs rather than
   in-place amendments for normative changes) and because
   enumeration is a recurring footgun class, not a one-time omission.
2. **Keep the enumeration and add a prose note in §6 saying "future
   fan-outs extend this list."** Rejected: the list still reads as
   canonical on first scan; readers routinely treat enumerations as
   exhaustive regardless of disclaimers.
3. **Leave §6 untouched and note the extension in the maximisation
   plan only.** Rejected: the plan is ephemeral; the doctrine is
   durable. Graduating it to an ADR is the correct tier per
   `patterns/adr-by-reusability-not-diff-size.md`.

## Relationship to ADR-143

ADR-143 §6 (the enumerated list) is **superseded in part** by this
ADR. The rest of ADR-143 (sink model, shared redaction invariant at
the level of principle, `OtelLogRecord` currency, workspace scope,
out-of-scope clauses) remains in force. ADR-143 should carry a note
at the top of §6 pointing here.

## Open Questions

- Whether the runtime-agnostic redactor core warrants its own
  package (`@oaknational/telemetry-redaction-core`) or an internal
  submodule of `@oaknational/observability`. Settled at L-12 planning
  time.
- Whether the conformance test belongs in each consuming workspace
  or is centralised in the adapter. Current preference: in each
  consuming workspace, because the "destination" is consumer-specific
  — the test asserts what the consumer sees, not what the adapter
  emits.

## Enforcement

- **Code review** on any adapter-surface change that adds a hook
  type.
- **Workspace conformance tests** as described above.
- **`packages/libs/sentry-node/README.md`** will carry a "Redaction
  barrier" section citing this ADR as the authoritative doctrine.
- **Cross-referenced from**
  [`sentry-observability-maximisation-mcp.plan.md`](../../../.agent/plans/architecture-and-infrastructure/active/sentry-observability-maximisation-mcp.plan.md)
  (L-0 authors this ADR; L-1 / L-4b / L-9 / L-12 are the first
  conformance targets).
