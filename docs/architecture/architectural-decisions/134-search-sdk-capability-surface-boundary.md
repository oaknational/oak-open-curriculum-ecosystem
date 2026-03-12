# ADR-134: Search SDK Capability Surface Boundary

## Status

Accepted

## Date

2026-03-11

## Context

The Search CLI/SDK boundary diagnosis identified three structural problems:

1. The Search SDK root entrypoint exposes both read and privileged admin lifecycle
   capabilities through a single surface.
2. Internal SDK concerns can leak across the app boundary through re-exports,
   weakening encapsulation.
3. Canonical retrieval and query-preprocessing semantics have drift risk when
   duplicated or bypassed outside the SDK ownership boundary.

The owner constraints for this area are explicit:

- Admin functions should be semi-separate from default consumer flows.
- Most consumers should be read-only by default.
- Future experimentation should be supported without reintroducing parallel
  canonical implementations.

## Decision

### 1. Capability-tiered Search SDK public surfaces

The Search SDK public API is split into explicit capability surfaces:

- `@oaknational/oak-search-sdk/read` for default retrieval consumption.
- `@oaknational/oak-search-sdk/admin` for privileged lifecycle/write operations.

The default root entrypoint must not transitively expose admin/write or internal
symbols.

### 2. Boundary ownership and import policy

- `oak-search-sdk` owns canonical retrieval and preprocessing semantics.
- `oak-search-cli` owns command orchestration, runtime policy, and operator UX.
- App code must not import SDK internal modules or deep implementation paths.
- Non-admin CLI modules must not import admin SDK surfaces.

These constraints are enforced by package surface design and lint fitness rules.

### 3. Experiments policy

Experiments are supported as a deliberate extension path, but no speculative
public experiments surface is introduced without a real consumer.

When the first experiment consumer is approved, a follow-on ADR must define:

- the experiment capability surface,
- blast-radius controls (read-default credentials, explicit elevated mode for writes),
- graduation path into canonical SDK semantics.

### 4. Enforcement and verification

Boundary compliance is a blocking quality concern and must be encoded in lint
configuration and rule tests:

- violating imports fail lint as errors,
- positive and negative fixtures prove each boundary class,
- boundary drift blocks merges.

## Consequences

### Positive

- Read-only consumption becomes the default and easiest integration path.
- Privileged admin capability is explicit and reviewable at import boundaries.
- Internal SDK concerns remain encapsulated and harder to misuse.
- Boundary violations are caught statically rather than discovered during incidents.
- Canonical search semantics remain owned by the SDK, reducing drift.

### Negative

- Migration effort is required to move existing imports and tighten package exports.
- Additional lint rule complexity and fixtures must be maintained.
- Some utility modules may need refactoring to keep read/admin boundaries clean.

### Neutral

- This ADR defines boundary policy; implementation sequencing remains in the
  active semantic-search execution plans.

## Related

- ADR-030: SDK as Single Source of Truth
- ADR-041: Workspace Structure Option A
- ADR-078: Dependency Injection for Testability
- ADR-108: SDK Workspace Decomposition
- ADR-130: Zero-Downtime Blue/Green Elasticsearch Index Swapping
- ADR-133: CLI Resource Lifecycle Management
