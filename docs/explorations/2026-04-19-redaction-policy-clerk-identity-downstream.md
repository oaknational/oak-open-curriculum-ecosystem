---
title: Redaction Policy — Clerk Identity Downstream of the Barrier
date: 2026-04-19
status: active
informs:
  - 'docs/architecture/architectural-decisions/160-non-bypassable-redaction-barrier-as-principle.md'
  - '.agent/plans/observability/future/second-backend-evaluation.plan.md'
  - 'docs/explorations/2026-04-19-data-warehouse-selection.md'
  - 'docs/explorations/2026-04-18-sentry-vs-posthog-capability-matrix.md'
constraints:
  - ADR-160 (non-bypassable redaction barrier — closure principle)
  - ADR-162 (observability-first; vendor independence)
  - ADR-143 (coherent structured fan-out)
  - GDPR (Art. 6 lawful basis; Art. 28 processor)
  - Oak-organisational privacy posture (cross-product, all products use Clerk)
---

# Redaction Policy — Clerk Identity Downstream of the Barrier

**Status**: Stub. Authored 2026-04-19 in response to the owner-confirmed
context that all Oak products use Clerk for auth, the MCP server's
users are all logged-in via Clerk, and a consistent identifier may
therefore be available across Oak observability sinks subject to
policy ruling.

Informs the redaction-policy posture for
[ADR-160](../architecture/architectural-decisions/160-non-bypassable-redaction-barrier-as-principle.md)
when an identifying user context is structurally available, and
unblocks the identified-events question for the warehouse and (later)
PostHog sinks named in
[`future/second-backend-evaluation.plan.md`](../../.agent/plans/observability/future/second-backend-evaluation.plan.md).

---

## 1. Problem statement

The MCP server's request handler today carries a Clerk-issued user ID
into Sentry's per-request scope via
`apps/oak-curriculum-mcp-streamable-http/src/mcp-handler.ts`'s
`observability.setUser({ id: userId })` call (verified 2026-04-19 by
Round 2 reviewer audit on
[Exploration 1](./2026-04-18-sentry-vs-posthog-capability-matrix.md)).
That identifier is opaque, stable across sessions, and consistent
across Oak products (per owner statement 2026-04-19).

[ADR-160](../architecture/architectural-decisions/160-non-bypassable-redaction-barrier-as-principle.md)
is a _closure-property_ principle: every fan-out path applies the
shared redaction policy before any sink. It is not a categorical
prohibition on identified data — that misreading was caught and
corrected during Round 1 review of Exploration 1. What ADR-160
_requires_ is that whatever the redaction policy permits, it permits
**uniformly across all sinks** via the closure rule.

The exploration's question: **what does the redaction policy permit
when the identifier is an opaque, cross-product Clerk user ID?**
Three positions are coherent:

1. **Anonymous-only**: drop the Clerk ID at the barrier; emit only
   `session_id` (per-request, ephemeral, non-correlatable). Status
   quo posture for the _event-data envelope_; Sentry per-request
   scope still receives `user.id` separately.
2. **Identified, single-sink**: permit `user_id` to flow into Sentry
   per-request scope (today's reality) but not into the event-data
   envelope a second-sink adapter would emit. The closure rule
   becomes "redact `user_id` from event-data envelope; preserve in
   Sentry scope only." This is a **doctrine fork**: it makes the
   redaction policy non-uniform across sinks, which the ADR-160
   closure principle does not by itself authorise. Adopting this
   position cleanly likely requires either an ADR-160 amendment or a
   companion ADR introducing the per-sink projection concept; the
   ruling exploration must name the doctrine work needed if this
   position is chosen.
3. **Identified, all sinks**: permit `user_id` to flow into the
   event-data envelope across all sinks (Sentry, warehouse, PostHog,
   any future sink), governed by a single closure rule. Requires
   policy ruling on lawful basis (GDPR Art. 6), data-subject rights
   wiring (deletion propagation across sinks), and BAA scoping where
   applicable. This is the position most cleanly supported by
   ADR-160's existing closure principle without doctrine extension.

---

## 2. Scope (for full analysis when authored)

- Lawful basis under GDPR Art. 6 for processing the Clerk identifier
  in observability event data, per sink.
- Data-subject rights propagation: how a user-deletion request
  reaches each sink.
- Cross-product identity reuse implications: the same Clerk ID
  appears in other Oak product analytics; consistency rules.
- Sink-by-sink BAA / DPA / processor-agreement scoping.
- Differential identity envelopes: would the policy plausibly permit
  `user_id` in some sinks (warehouse for cross-source joins) but
  not others (PostHog event capture)? If so, the redaction policy
  itself becomes non-uniform across sinks (a _per-sink projection_).
  This is a doctrine fork that goes beyond ADR-160's existing
  closure principle and would require either ADR-160 amendment or a
  companion ADR; this exploration must name the doctrine work if a
  non-uniform policy is the recommended ruling.
- Pseudonymisation alternatives: hashing the Clerk ID per-sink,
  per-purpose; one-way derivations that satisfy join needs without
  exposing the raw ID.
- Audit and observability of the redaction itself: how do we
  _prove_ the policy is being applied per sink, per ADR-160's
  closure rule.

---

## 3. Research questions

1. What is Oak's organisational privacy posture for the Clerk ID
   downstream of observability emission, in writing? (Owner / DPO
   ruling.)
2. Does the existing Sentry-side `setUser({ id: userId })` flow have
   an explicit lawful-basis recording, or is it implicit? Naming the
   implicit basis is itself a useful exploration output.
3. If the policy permits identified events at all sinks, what
   pseudonymisation pattern (if any) sits between the Clerk ID at the
   request handler and the per-sink redaction-policy projection?
4. How does the chosen posture interact with the warehouse-selection
   decision ([companion exploration](./2026-04-19-data-warehouse-selection.md))
   — does any candidate warehouse foreclose any of the three
   positions above?
5. How does the chosen posture interact with the PostHog candidate
   ([Exploration 1](./2026-04-18-sentry-vs-posthog-capability-matrix.md))
   — anonymous-events PostHog is the slice available today by
   derivation; does the policy ruling unblock identified-events
   PostHog?
6. What ADR-160 amendment, if any, is needed to record the ruling
   — or is the ruling captured in a separate redaction-policy
   document that ADR-160 references?

---

## 4. Informs

- [ADR-160 Non-Bypassable Redaction Barrier](../architecture/architectural-decisions/160-non-bypassable-redaction-barrier-as-principle.md)
  — the policy ruling either lands as a History entry on ADR-160 or
  as a separate redaction-policy document referenced from ADR-160.
- [`future/second-backend-evaluation.plan.md`](../../.agent/plans/observability/future/second-backend-evaluation.plan.md)
  — the warehouse and PostHog adapters' identity envelopes depend on
  this ruling.
- [Companion exploration: data warehouse selection](./2026-04-19-data-warehouse-selection.md)
  — warehouse adapter consumes the ruling.
- [Exploration 1 (Sentry vs PostHog)](./2026-04-18-sentry-vs-posthog-capability-matrix.md)
  — the "anonymous-events PostHog" derivation in §6 of that overlay
  rests on the current redaction-policy posture; this exploration
  may unsettle that.

---

## 5. Promotion trigger for full authorship

The exploration is authored in full when **any one of** the following
fires:

- The warehouse-adapter plan promotes (the warehouse needs a ruling
  before its first ingest).
- A data-scientist or product-owner question is raised that
  requires cross-sink user-level joins, and the answer would
  materially change with an identified-events posture.
- A new Oak product begins emitting Clerk-keyed events to a
  shared sink and a cross-product policy is needed.
- A privacy / compliance review surfaces a specific question about
  the existing Sentry-side `setUser` flow.

---

## 6. References

- [ADR-160 Non-Bypassable Redaction Barrier](../architecture/architectural-decisions/160-non-bypassable-redaction-barrier-as-principle.md)
  — closure principle; the binding rule for any sink, identified or
  anonymous.
- [ADR-162 Observability-First](../architecture/architectural-decisions/162-observability-first.md)
  — five-axis principle; vendor independence.
- [ADR-143 Coherent Structured Fan-Out](../architecture/architectural-decisions/143-coherent-structured-fan-out-for-observability.md)
  — the architectural shape redaction governs.
- [Exploration 1 (Sentry vs PostHog)](./2026-04-18-sentry-vs-posthog-capability-matrix.md)
  §4 Q6 + §5 Risks and unknowns + §6.1 — the identity-model
  precondition this exploration addresses.
- [Companion exploration: data warehouse selection](./2026-04-19-data-warehouse-selection.md)
  — warehouse-adapter consumer of this ruling.
- [`apps/oak-curriculum-mcp-streamable-http/src/mcp-handler.ts`](../../apps/oak-curriculum-mcp-streamable-http/src/mcp-handler.ts)
  — current `observability.setUser({ id: userId })` call site.
- [`future/second-backend-evaluation.plan.md`](../../.agent/plans/observability/future/second-backend-evaluation.plan.md)
  — three-sink strategic brief; consumer of the ruling.
