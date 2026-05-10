# ADR-175: External Evidence Corpus Freshness Governance

**Status**: Accepted
**Date**: 2026-05-10
**Related**:
[ADR-029](029-no-manual-api-data.md) — Oak API cardinal rule;
[ADR-030](030-sdk-single-source-truth.md) — SDK as source of truth for API
contracts;
[ADR-123](123-mcp-server-primitives-strategy.md) — MCP primitive governance;
[ADR-157](157-multi-source-open-education-integration.md) — multi-source open
education integration, Proposed;
[ADR-173](173-graph-stack-topology.md) — graph stack topology, Proposed.

## Context

The EEF Teaching and Learning Toolkit is the first planned external evidence
corpus that would become user-facing inside the Oak MCP surface. Unlike the Oak
Open Curriculum API, this corpus is not generated from the repository's
OpenAPI source of truth. It is a static evidence snapshot with its own upstream
update cadence, attribution requirements, and educational trust implications.

Plans already require freshness checks before promotion, but the durable ADR
layer did not name who owns external-corpus freshness, what metadata must exist,
or what happens when a corpus becomes stale. That makes freshness look like an
implementation todo instead of a trust boundary.

## Decision

External evidence corpora must have explicit freshness governance before they
ship to user-facing MCP tools, resources, prompts, search results, or graph
surfaces.

For every external evidence corpus:

- The corpus artefact must include machine-readable freshness metadata, at
  minimum `data_version` or equivalent upstream version, `last_updated`, source
  name, source URL, licence/attribution note, and snapshot acquisition date.
- The owning plan or permanent documentation must name the owner role
  responsible for refreshing or re-validating the corpus before ACTIVE
  promotion and before any release that materially changes corpus use.
- The initial default freshness threshold is **180 days** from `last_updated`
  unless a source-specific ADR or owner decision records a stricter threshold.
- A stale corpus blocks promotion from planning to implementation for new
  user-facing surfaces. For already-shipped surfaces, stale status must be
  visible to operators and reviewers and must trigger an explicit refresh,
  disable, or accepted-risk decision before release.
- Every user-facing primitive derived from an external evidence corpus must
  preserve source attribution through naming, metadata, or structured output so
  downstream clients can distinguish Oak-authored data from third-party
  evidence.

EEF is the first consumer of this ADR. This decision is intentionally limited
to external evidence corpora; it does not create a general data-governance
programme for every fixture or local test dataset.

## Consequences

### Positive

- EEF and future evidence corpora have a durable freshness and attribution
  boundary before implementation begins.
- ADR-157 can remain Proposed while this narrower trust decision is accepted.
- Plans can treat the 180-day threshold as a concrete promotion precondition
  without embedding that policy only in ephemeral plan text.

### Trade-offs

- Static external datasets cannot quietly drift into product surfaces; they
  require ownership and periodic re-validation.
- Teams must distinguish evidence-corpus freshness from ordinary fixture
  freshness and avoid applying this heavier policy to every small test artefact.

## Implementation Notes

Future EEF implementation work should:

- validate the snapshot metadata before promoting the plan to ACTIVE;
- fail or block promotion when `last_updated` is older than the accepted
  threshold unless the owner records an exception;
- cross-link MCP primitive updates from ADR-123 when EEF tools, resources, or
  prompts actually ship;
- update attribution and data-licence files only when the corpus becomes a
  shipped surface.
