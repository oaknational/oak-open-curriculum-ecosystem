# ADR-140: Search Ingestion SDK Boundary

## Status

Accepted

## Date

2026-03-24

## Related

- [ADR-088: Result Pattern for Error Handling](088-result-pattern-for-error-handling.md)
- [ADR-093: Bulk-First Ingestion Strategy](093-bulk-first-ingestion-strategy.md)
- [ADR-108: SDK Workspace Decomposition](108-sdk-workspace-decomposition.md)
- [ADR-130: Zero-Downtime Blue/Green Elasticsearch Index Swapping](130-blue-green-index-swapping.md)
- [ADR-133: CLI Resource Lifecycle Management](133-cli-resource-lifecycle-management.md)
- [ADR-134: Search SDK Capability Surface Boundary](134-search-sdk-capability-surface-boundary.md)
- [ADR-139: Sequence Semantic Contract and Ownership](139-sequence-semantic-contract-and-ownership.md)

## Context

Oak-specific ingestion runtime still lives inside `apps/oak-search-cli`, even
though another internal host now needs a supported way to bootstrap and operate
Oak search inside its own existing Elasticsearch Serverless project.

That creates three problems:

1. It violates the thin-app rule because reusable domain logic remains in an
   app workspace.
2. The obvious move target, `@oaknational/oak-search-sdk`, is forbidden by
   [ADR-108](108-sdk-workspace-decomposition.md), which keeps the
   Elasticsearch-focused search SDK independent from
   `@oaknational/curriculum-sdk`.
3. The current plan carries settled boundary doctrine that should live in
   permanent architecture documentation rather than only in an active plan.

The repository therefore needs one permanent source of truth for:

1. where Oak-specific ingestion runtime belongs,
2. which lifecycle and operator capabilities remain in
   `@oaknational/oak-search-sdk/admin`,
3. how thin CLI ownership changes,
4. which operational safety invariants the extracted architecture must preserve,
5. how the package is distributed before and after eventual public release.

## Decision

### 1. Create a dedicated ingestion SDK workspace

Create a new SDK workspace at:

- `packages/sdks/oak-search-ingestion-sdk/`

with package identity:

- `@oaknational/oak-search-ingestion-sdk`

This package is the Oak-specific ingestion composition layer. It may depend on:

- `@oaknational/sdk-codegen` for generated bulk/search artefacts,
- `@oaknational/curriculum-sdk` for Oak API access and supplementation inputs,
- `@oaknational/oak-search-sdk/admin` for Elasticsearch-native lifecycle and
  admin primitives,
- shared support packages for logging, `Result`, and supporting types.

### 2. Ownership is split by responsibility, not convenience

- `@oaknational/oak-search-sdk/read` remains the canonical retrieval surface.
- `@oaknational/oak-search-sdk/admin` remains the canonical owner of
  Elasticsearch-native lifecycle/admin primitives including alias setup,
  promote/rollback, alias validation, lease handling, orphan cleanup, and
  version deletion.
- `@oaknational/oak-search-ingestion-sdk` owns Oak-specific ingestion runtime:
  bulk acquisition, API supplementation orchestration, document production,
  upload orchestration, and supported host composition for mutating ingest
  flows.
- `apps/oak-search-cli` owns env/config resolution, command parsing, runtime
  policy, operator UX, output formatting, and exit codes. It must become a thin
  shell over the two SDKs.

`stage` and `versioned-ingest` are composed capabilities: the ingestion SDK
provides the Oak-specific ingest runtime, while `@oaknational/oak-search-sdk`
retains lifecycle primitives and safety checks.

### 3. The public surface starts intentionally narrow

The initial stable surface is deliberately small:

- one high-level ingestion service or factory for supported host composition,
- one lifecycle-compatible adapter surface, if needed, to satisfy
  `IndexLifecycleDeps["runVersionedIngest"]`,
- explicit `Result<...>`-returning methods that preserve cause chains.

The following remain package-private unless a later ADR proves direct external
consumption is necessary:

- bulk loaders and snapshot validators,
- Oak API supplementation helpers,
- document builders and phase modules,
- bulk upload coordinators,
- retry, pacing, and backpressure helpers.

The package must not re-export, shadow, or duplicate existing
`@oaknational/oak-search-sdk/read` or `@oaknational/oak-search-sdk/admin`
capabilities.

### 4. Operational safety invariants remain part of the contract

The extracted architecture must preserve these invariants:

1. The supported path bootstraps Oak search inside an existing Elasticsearch
   Serverless project; it does not provision the project itself.
2. Mutating lifecycle flows must preserve lease safety. Hosts must not bypass
   lifecycle leasing.
3. Promote/rollback/ingest flows must preserve metadata/alias coherence checks
   before mutation.
4. Validation semantics stay explicit:
   - `validate-aliases` proves alias topology only,
   - `admin count` proves live parent-document counts only,
   - staged versions require stage evidence plus field-readback audit before
     promotion.
5. ELSER/backpressure behaviour must preserve the current retry, pacing, and
   item-level failure guarantees unless a later ADR replaces them.
6. Adoption guidance must make the blue/green double-storage capacity
   precondition explicit.
7. Supported non-CLI hosts must use the package-supplied high-level ingestion
   surface for mutating flows; ad hoc composition of raw lifecycle primitives is
   unsupported.

### 5. Distribution is private first and future-public-ready

- The package is distributed privately first, for example via GitHub Packages.
- The exported surface is treated as semver-governed from the start.
- The package must be able to become public later without a second boundary
  rewrite.

### 6. This ADR is authoritative immediately

This ADR supersedes any narrower ownership interpretation that leaves
Oak-specific ingestion runtime in `apps/oak-search-cli` as the intended
long-term home.

Current CLI-local ingestion code is transitional technical debt until the
extraction plan completes. The implementation may lag briefly, but future plan,
lint, and package-boundary work must converge toward this ADR rather than
reasserting CLI-local ownership.

## Consequences

### Positive

- The thin-app rule is restored without violating [ADR-108](108-sdk-workspace-decomposition.md).
- Internal consumers get a supported ingestion path without importing CLI
  internals.
- `@oaknational/oak-search-sdk` stays Elasticsearch-focused and does not absorb
  Oak API coupling.

### Negative

- A new workspace, import policy, tests, and publish/build configuration are
  required.
- Some operator capabilities now span two SDKs, so ownership must stay explicit
  in docs and lint rules.
- The intentionally narrow API may defer convenience exports until they are
  proven necessary.

### Neutral

- The CLI remains the canonical operator entry point, but only as a thin shell.
- Public npm release is not part of this decision, only future readiness for
  it.
