# ADR-171: Observability Configuration — Orthogonal Sinks and Fixtures Axes

**Status**: Accepted
**Date**: 2026-05-10
**Related**:
[ADR-116](116-resolve-env-pipeline-architecture.md) — environment
resolution pipeline; the typed list this ADR introduces lands as a
schema field on the resolved env;
[ADR-143](143-coherent-structured-fan-out-for-observability.md) —
coherent structured fan-out for observability; the sink model evolves
with this ADR's `OBSERVABILITY_SINKS` typed list;
[ADR-162](162-observability-first.md) — observability-first; the
orthogonal-axes shape is the configuration form ADR-162's lifecycle
commitment requires;
[ADR-163](163-sentry-release-identifier-and-vercel-production-attribution.md)
— Sentry release identifier; build-time scope is preserved (orthogonal
to the runtime sink/fixture axes).

## Context

The repo's observability configuration evolved organically: a single
`SENTRY_MODE` env governing both _which sinks emit_ (Sentry, console,
log file) and _whether the run is using fixture state_ (deterministic
test fixtures vs live data). The two concerns were entangled; changing
sink set required reasoning about fixture mode and vice versa.

ADR-143 introduced the coherent structured fan-out and named multiple
sinks. ADR-162 (Observability-First) committed Oak to long-lived
observability surface decisions. Each future sink and each future
capability that emits would interact with whatever sink-and-fixture
configuration shape was canonical.

The 2026-04-18 observability-first direction-setting session and the
follow-on planning surfaced the _orthogonal axes shape_ as a reusable
architectural decision per PDR-019 (ADR scope by reusability):

- **`OBSERVABILITY_SINKS` typed list** — which sinks the runtime
  emits to. Each sink is a value in a typed enum; the env declares
  the full set as a list, not a mode.
- **`OBSERVABILITY_FIXTURES` orthogonal boolean** — whether the
  runtime is operating in fixture (deterministic test) mode. This
  is a tee orthogonal to the sink set, not a mutually-exclusive
  alternative.

The two axes compose: each combination of (sinks, fixtures) is a valid
runtime configuration. A run can target Sentry + console with fixtures
(deterministic snapshot for review); Sentry + log-file without
fixtures (production); console-only with fixtures (local CI gate);
and so on. The previous `SENTRY_MODE` could not express any of those
combinations cleanly.

## Decision

Adopt the orthogonal-axes shape as the canonical observability
configuration model:

1. **`OBSERVABILITY_SINKS`** — a typed list (Zod-validated) of the
   sinks the runtime emits to. Each value is a member of a closed
   enum (current set: `sentry`, `console`, `log-file`; future sinks
   add new enum members). The env field declares the _set_ directly.

2. **`OBSERVABILITY_FIXTURES`** — a boolean independent of the sink
   set. When `true`, the runtime sources telemetry payloads from
   deterministic fixtures (used by E2E tests, smoke harnesses, and
   review snapshots). When `false`, the runtime sources from live
   data.

3. **`SENTRY_MODE` is retired as a primary concern** at the
   resolved-env layer. Consuming runtimes that have not yet migrated
   continue to honour their existing `SENTRY_MODE` for
   backwards-compatibility through a transitional bridge in
   `@oaknational/env-resolution`; the bridge is deleted once every
   consumer has migrated to the orthogonal axes.

4. **Build-time scope is preserved**. The Sentry release identifier
   and build-time attribution (per ADR-163) are _not_ runtime sink
   concerns and remain on their own scope. The orthogonality applies
   only at the runtime emission layer.

5. **Future sinks and capabilities use the typed list, not new
   modes**. A new sink (e.g. PostHog, GCP logging) is added by
   extending the `OBSERVABILITY_SINKS` enum and the underlying sink
   registry per ADR-143. No new mode env is introduced.

## Scope

Applies to every workspace that emits observability data through the
shared Oak telemetry plumbing: `apps/oak-curriculum-mcp-streamable-http`,
`apps/oak-search-cli`, `apps/oak-curriculum-search-cli`, future widgets,
future MCP services, and any new emitter that lands during the
observability foundation rollout.

Out of scope: the build-time release-identifier surface (ADR-163), the
non-bypassable redaction barrier (ADR-160), and the deeper observability-
first axis-coverage commitment (ADR-162) — those remain as separate
concerns this ADR composes with.

## Rationale

The `SENTRY_MODE`-style configuration is _closed_ — every new combination
of sink set and fixture mode requires inventing a new mode value. Two
sinks × two fixture states = four modes; three sinks = eight; and modes
explode under future sink additions.

The orthogonal-axes shape is _open_ — a new sink adds one enum member
and inherits the fixture orthogonality automatically. Each combination
is expressible without proliferating mode values.

The shape is also more _legible_: an operator reading the env can answer
"which sinks am I emitting to?" and "am I in fixture mode?" by reading
two clearly-named fields, rather than decoding a single mode token.

The sink-set typed-list shape has precedent at ADR-143's structured
fan-out (the sink registry is already a set, not a mode); this ADR
makes that shape the configuration boundary, not just the runtime
boundary.

## Consequences

**Required**:

- The shared env-resolution package (`@oaknational/env-resolution`)
  exposes `OBSERVABILITY_SINKS` (typed list) and `OBSERVABILITY_FIXTURES`
  (boolean) as the canonical fields.
- ADR-143 amends to record the typed-list-as-config shape (the runtime
  registry was already set-shaped; the env now matches).
- ADR-116 amends to record the new env field shapes in the resolution
  pipeline.
- ADR-162 amends to cite this ADR as the configuration shape its
  lifecycle commitment requires.
- ADR-163 amends to clarify that build-time scope is preserved and
  remains orthogonal to the runtime axes.
- Consuming runtimes migrate from `SENTRY_MODE` to the orthogonal
  axes incrementally. The transitional bridge in env-resolution is
  the migration path; it is removed once every consumer has migrated.

**Forbidden**:

- New observability config envs that conflate sink-set and fixture
  orthogonality back into a single mode.
- Treating fixture mode as implied by sink set (or vice versa). The
  axes are independent.

**Costs**:

- Migration cost across consuming runtimes (each app's env schema
  and wiring must update). The cost is amortised across all future
  sink additions, which would otherwise pay it incrementally with
  every new mode.

## Source

This ADR graduates the substance of the
`pending-graduations.md` entry _"observability multi-sink + fixtures
plan WS8.6 — orthogonal axes shape"_ (captured 2026-05-02; ADR-number
resolved 2026-05-03 to ADR-171; deferred under fabricated `vaporware-
gated(WS8.6/WS8.7-execution)` vocabulary across multiple sessions until
owner reframe in the `knowledge graduation` session 2026-05-10). The
substance is decision-shape and stable; plan execution is the
_application_ of the decision, not its source.
