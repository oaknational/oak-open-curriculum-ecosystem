---
title: Vendor-Independence Conformance Test Shape — Proving ADR-162's Clause Programmatically
date: 2026-04-18
status: active
---

# Vendor-Independence Conformance Test Shape

**Status**: Stub. Informs the MVP scope of
[`current/multi-sink-vendor-independence-conformance.plan.md`](../../.agent/plans/observability/current/multi-sink-vendor-independence-conformance.plan.md).
Full analysis authored when that plan's WS1 RED opens, or earlier if
an exploration 1 / exploration 2 finding accelerates it.

---

## 1. Problem statement

[ADR-162](../architecture/architectural-decisions/162-observability-first.md)
names vendor-independence as a first-class principle:

> Emissions are produced in provider-neutral shapes (OTel-compliant
> where applicable) and routed through adapters. Consumers couple to
> `@oaknational/observability` and `@oaknational/observability-events`,
> never directly to vendor SDKs. Minimum functionality (structured
> stdout/err via `@oaknational/logger`) persists in the absence of
> any third-party backend. Adding, replacing, or removing a vendor
> adapter MUST NOT require changes in consumer code.

The principle is not self-enforcing. The conformance-test surface is
what makes it **testable** rather than aspirational.

The design question: **what shape of test programmatically proves the
clause holds?** Options exist on a spectrum from strict (binary
emission-shape equivalence across sinks) to loose (structural field
survival with tolerable shape drift). The spectrum-point that is
right for Oak's MVP is the subject of this exploration.

---

## 2. Scope (for full analysis when authored)

- The conformance test's execution model: does it run the real
  emission path with real sinks (integration-shape)? Does it
  stub sinks and assert on what would have been emitted (unit-shape)?
- The assertion shape: per-field equivalence, structural equivalence,
  or round-trip-through-schema.
- Test execution environment: `SENTRY_MODE=off` required for at least
  one assertion; other modes (`fixture`, `sentry`) for coverage of
  the enabled path.
- Test location: which workspace owns it, how consuming workspaces
  compose into it.
- Integration with the existing ADR-160 barrier-conformance test
  (`packages/libs/sentry-node/src/runtime-redaction-barrier.unit.test.ts`)
  — the pattern is an established reference.

---

## 3. Research questions

1. Is the test "structural event information persists when
   `SENTRY_MODE=off`" enough, or does it need to assert on specific
   fields (for example, proving `tool_invoked` round-trips through
   `stdout` JSON with full field fidelity)?
2. Should the test run against all seven MVP events of the
   [events workspace](../../.agent/plans/observability/current/observability-events-workspace.plan.md)
   as a single pass, or one per event?
3. What is the right balance between the test being
   **implementation-locked** (tied to current Sentry SDK shape, brittle
   to SDK updates) and **behaviour-anchored** (proves the invariant
   without caring about the current SDK internals)?
4. Does the test need to exercise the actual transport path
   (e.g. stdout sink writing to real stdout), or is capturing the
   pre-sink event payload sufficient?
5. For a hypothetical second vendor adapter (PostHog; see exploration
   1), what minimal contract must the adapter satisfy to pass the
   conformance test — what is the "adapter surface" the test
   implicitly defines?
6. How does the test interact with
   [ADR-161](../architecture/architectural-decisions/161-network-free-pr-check-ci-boundary.md)
   — must all conformance checks be network-free?

---

## 4. Informs

- [`current/multi-sink-vendor-independence-conformance.plan.md`](../../.agent/plans/observability/current/multi-sink-vendor-independence-conformance.plan.md)
  — the plan this exploration scopes; specifies RED test shape and
  GREEN implementation target.
- [ADR-162 § Enforcement Mechanism #4](../architecture/architectural-decisions/162-observability-first.md)
  — the vendor-independence test this exploration defines.
- [Exploration 1](./2026-04-18-sentry-vs-posthog-capability-matrix.md) —
  the second-vendor comparison that would exercise the adapter surface.

---

## 5. Promotion trigger for full authorship

The exploration is authored in full when **any one of** the following
fires:

- WS1 RED of
  [`multi-sink-vendor-independence-conformance.plan.md`](../../.agent/plans/observability/current/multi-sink-vendor-independence-conformance.plan.md)
  opens.
- Exploration 1 (Sentry vs PostHog) identifies PostHog as a named
  second vendor and the adapter-contract shape becomes
  decision-relevant.
- A Sentry SDK update breaks the current implicit adapter assumptions
  in a way that reveals the test would have caught it.

---

## 6. References

- [ADR-162](../architecture/architectural-decisions/162-observability-first.md) —
  the vendor-independence clause.
- [ADR-143](../architecture/architectural-decisions/143-coherent-structured-fan-out-for-observability.md) —
  the fan-out model the adapter composes into.
- [ADR-160](../architecture/architectural-decisions/160-non-bypassable-redaction-barrier-as-principle.md) —
  existing conformance-test pattern reference.
- [ADR-161](../architecture/architectural-decisions/161-network-free-pr-check-ci-boundary.md) —
  CI-boundary constraint.
- [`packages/libs/sentry-node/src/runtime-redaction-barrier.unit.test.ts`](../../packages/libs/sentry-node/src/runtime-redaction-barrier.unit.test.ts) —
  the existing conformance-test reference implementation.
- [Exploration 1](./2026-04-18-sentry-vs-posthog-capability-matrix.md) —
  second-vendor comparison.
- [`current/multi-sink-vendor-independence-conformance.plan.md`](../../.agent/plans/observability/current/multi-sink-vendor-independence-conformance.plan.md) —
  the plan this exploration blocks.
