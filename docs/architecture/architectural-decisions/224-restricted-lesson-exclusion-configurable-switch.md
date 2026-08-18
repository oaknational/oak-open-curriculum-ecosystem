# ADR-224: Restricted-lesson exclusion is a documented, configurable switch

**Status**: Accepted (index-family consistency amendment ratified 2026-08-13; corpus-boundary consequence recorded 2026-08-13)  
**Date**: 2026-08-12  
**Related**: ADR-093 (Bulk-First Ingestion Strategy), ADR-089 (Index-Everything Principle), ADR-140 (Search Ingestion / SDK Boundary), MCP-204 (restriction concept in search), MCP-590 (lesson-search Bucket 1)

## Context

Restricted lessons — those upstream flags `restricted: true`, whose usage
licence does not permit serving — have been excluded from every generated and
served search surface since the MCP-204 ruling (owner-directed, 2026-07-27,
"we filter what goes in"). That exclusion was implemented as a hardcoded,
unconditional filter (`excludeRestrictedLessons` in `@oaknational/sdk-codegen`),
applied at two generation call sites: the Elasticsearch ingest boundary
(`apps/oak-search-cli`) and the vocab-gen pipeline.

The exclusion is a product decision, not a technical constraint, and MCP-204
always named it revisitable post-submission (e.g. index-all + filter-at-query).
A hardcoded filter makes revisiting a code edit, and leaves the current policy
implicit rather than stated. The owner ruled (2026-08-12): keep restricted
lessons out for now, but make the choice a documented, configurable switch.

## Decision

The restricted-exclusion policy is one switch — a parameter on the SDK filter —
not a hardcoded filter and not a new config system.

- `excludeRestrictedLessons(files, { includeRestricted })` takes an options
  object; `includeRestricted` defaults to `false` (exclude), reproducing the
  standing behaviour byte-for-byte. When `true`, the files pass through
  unchanged and the excluded count is zero.
- The switch is threaded, without inversion, through both exclusion call sites
  and surfaced as a documented `--include-restricted` flag on the
  `admin versioned-ingest` and `admin stage` commands (mirroring `--bulk-dir` /
  `--subject-filter`). The vocab-gen pipeline reads it from
  `PipelineConfig.includeRestricted`.
- Lifecycle doc-count verification (`verifyDocCounts`) checks each index
  against a minimum threshold (`--min-doc-count`, default 1), not an expected
  total derived from the bulk data — it is switch-agnostic by construction,
  so there is no third policy edit to keep in step.

The policy is recorded here, in this ADR, not in the stale `INGESTION-GUIDE.md`
runbook (which documents a superseded `es:ingest` interface).

## Consequences

- The current choice (exclude) is stated, not implicit, and the revisit path
  is named: retiring the canonical predicate `isRestrictedInclusionBarred`
  (sdk-codegen restricted-lesson filter) — which both boundary enforcers
  delegate to: `enforceRestrictedInclusionBoundary` (oak-search-sdk,
  index-producing runs) and `enforceRestrictedInclusionCorpusBoundary`
  (vocab-gen, the corpus-producing run) — at the labelled-serving follow-on
  plus the owner's word opens the already plumbed switch at each boundary
  together: `--include-restricted` on the admin lifecycle commands, and
  `PipelineConfig.includeRestricted` for vocab-gen (whose CLI exposes no
  flag) — no re-plumbing of the filter or its call sites, and no way for one
  boundary to open without the other.
- **Including restricted lessons is not free.** `includeRestricted` only
  removes the exclusion at the generation boundary; it does NOT mark the
  retained lessons as restricted in the produced documents. Serving restricted
  lessons correctly additionally requires threading the `restricted` flag
  through the lesson-document builder so included lessons are labelled in
  results (and downstream consumers honour it). That work is named, not built
  here (MCP-590 Bucket 1, Out of scope). Until then the switch is policy
  plumbing: the parameter exists, is threaded, and is proven by the SDK
  filter and ingest-plumbing tests, while index-producing and corpus-producing
  runs hold it closed.
- **Index families stay consistent — the lifecycle enforces it.** Primary and
  sandbox indexes carry the same source data — index-family consistency is
  required (owner ruling 2026-08-13). `stage` and `versioned-ingest`
  REJECT `includeRestricted` on every target with a
  `validation_error` naming this ADR. The CLI runs the same exported predicate
  (`enforceRestrictedInclusionBoundary`) as a pre-flight check before
  bulk-data verification and lease acquisition, with the service call as the
  backstop for every SDK consumer. Because no lifecycle path can produce a
  restricted-carrying index, `promote` and `rollback` are transitively safe
  without their own checks. The guard's removal condition is the
  labelled-serving follow-on above plus the owner's word.
- **The committed vocab corpus is guarded at its own boundary.** `runPipeline`
  (vocab-gen) rejects `includeRestricted` before reading any bulk data via
  `enforceRestrictedInclusionCorpusBoundary`, with an error naming this ADR:
  the generated corpus is committed to the repository and exported to MCP
  tools via the graph-corpus subpath, so the exclusion policy binds the
  corpus-producing boundary as it binds index-producing runs. Both boundary
  enforcers delegate the bar to its canonical owner,
  `isRestrictedInclusionBarred` in the restricted-lesson filter
  (consolidate-at-second-consumer), and map it into their local error shapes.
- No behaviour change at the default: existing ingests and codegen runs exclude
  exactly as before.
