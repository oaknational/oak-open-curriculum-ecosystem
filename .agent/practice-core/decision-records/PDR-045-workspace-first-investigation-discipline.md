---
pdr_kind: governance
---

# PDR-045: Workspace-First Investigation Discipline

**Status**: Accepted
**Date**: 2026-05-04
**Related**:
[PDR-007](PDR-007-promoting-pdrs-and-patterns-to-first-class-core.md)
(governance vs engineering routing — workspace-first investigation is
governance about how agents investigate, not an engineering pattern);
[PDR-012](PDR-012-review-findings-routing-discipline.md)
(review-findings routing — investigation findings produced under this
discipline follow the same routing as any other finding);
[PDR-015](PDR-015-reviewer-authority-and-dispatch.md)
(reviewer authority — reviewers also exhaust workspace inventory
before reaching for external tooling or new code);
[PDR-018](PDR-018-planning-discipline.md)
(planning discipline — workspace-first applies before plan authorship,
not only at execution time);
[PDR-033](PDR-033-vendor-doc-review-for-unknown-unknowns.md)
(vendor-doc review — the vendor-platform variant of workspace-first
where the "workspace" is the vendor's documentation rather than the
local repo);
[PDR-031](PDR-031-build-vs-buy-attestation.md)
(build-vs-buy attestation — workspace-first surfaces the build-vs-buy
question by checking what already exists locally before proposing
new code).

## Context

Agents investigating problems, sizing workstreams, or proposing
infrastructure routinely default to one of three escape hatches
*before* exhausting the inventory of artefacts and capabilities
already present in the workspace they are working in. Each of the
three escape hatches is a category of action with a higher cost,
higher latency, or higher risk than the workspace-first alternative,
and each predictably produces work the agent did not need to do.

Three structurally similar failure modes have been observed,
spanning diagnostic work, planning work, and review work:

**Failure mode 1 — diagnostic failure investigation reaches for
remote tooling when the owner has a local artefact.** When a
remote-tooling response is incomplete, truncated, or rate-limited,
the default move is to retry the remote tool with bigger limits,
different filters, or different endpoints. The owner has frequently
already downloaded the complete artefact (a build log, a test-run
summary, a trace dump, a coverage report) into a workspace
directory. The local artefact is a single read away; retrying the
remote tool burns a round trip, may further truncate, and produces
a degraded copy of the same data. The cost of looking in the
workspace first is one `find` or `grep`; the cost of reaching for
the remote tool first is the round trip plus the risk that the
result is incomplete.

**Failure mode 2 — infrastructure proposals propose new code when
the existing workspace already has the contract.** When the next
step requires a validation pipeline, a schema contract, a config
loader, a logger, an env-shape narrower, or any other piece of
shared engineering infrastructure, the default move is to propose
authoring new code in the active workspace. The repo's other
workspaces — typically under `core/`, `libs/`, or equivalent
shared-package directories — frequently already implement the
exact contract being proposed. Adding parallel infrastructure
creates duplicate sources of truth, multiplies the surface that
future migrations must touch, and dilutes the test coverage that
already exists for the shared package. The cost of surveying
shared packages first is a directory walk; the cost of authoring
parallel infrastructure is the new code, the new tests, the new
review surface, and the migration debt that follows.

**Failure mode 3 — investigation trusts a stale brief instead of
checking live state.** A brief — handover notes, a session
prompt, a previous-session summary, an issue description — names
the failing checks, the open questions, or the active blockers as
they were *at the time the brief was written*. By the time the
brief is read, live state has moved (gates have changed colour,
issues have been closed or opened, another agent has progressed a
parallel lane). The default move is to act on the brief's
enumeration; the workspace-first move is to query the live system
(the issue tracker's API, the CI provider's API, the in-tree
state files) before treating the brief's enumeration as
authoritative. The brief is a snapshot of a previously-true state;
live state is the only state that drives correct next actions.

The three failure modes share one structural property: **they all
substitute an external, expensive, or stale source for an internal,
cheap, fresh source already present in the workspace**. The cure is
the same shape across all three: exhaust the workspace inventory
first, then reach outward only when the workspace genuinely cannot
answer the question.

A fourth instance of the same shape recurs in cross-system
observability work (aligning local HEAD against deployment SHA
against trace-system release tag before making any cross-system
claim) and in vendor-platform planning (vendor-doc review before
proposing implementation; PDR-033 codifies the vendor-platform
variant). The pattern generalises beyond the three named failure
modes; PDR-033 is the vendor-platform-specific case of this PDR's
broader rule.

## Decision

**Before reaching for external tooling, before authoring new shared
infrastructure, and before treating any brief's enumeration as
authoritative, the agent MUST exhaust the workspace's existing
inventory.**

The discipline applies in three concrete moves, each tied to one of
the three failure modes:

### Move 1 — Workspace artefact search before remote tooling retry

When a remote tool returns truncated, incomplete, or rate-limited
output, the next move is *not* to retry the same tool with adjusted
parameters. It is:

1. Search the workspace for an owner-deposited local copy of the
   artefact. Common deposit locations are workspace directories
   matching the artefact's category (e.g. log directories,
   test-run output directories, coverage directories, trace-dump
   directories) — search by filename pattern and by directory
   convention.
2. If a local copy exists and is recent enough for the question
   being asked, read it directly.
3. Only if no local copy exists, or the local copy is stale, retry
   the remote tool with adjusted parameters.

### Move 2 — Shared-package survey before parallel infrastructure

When the work calls for shared engineering infrastructure (a
validator, a schema, a config loader, a logger, a path resolver,
a constant-type predicate), the next move is *not* to author the
new infrastructure in the active workspace. It is:

1. Survey the repo's shared-package directories (`core/`, `libs/`,
   `shared/`, or equivalent) for existing packages whose stated
   contract covers the need.
2. Read each candidate package's README and exported surface to
   confirm the contract match (or rule it out with a one-sentence
   reason — that sentence is the decline-rationale that prevents
   future re-discovery).
3. If an existing package matches, extend it (an additional export,
   an additional schema variant, an additional adapter) rather
   than authoring parallel infrastructure.
4. Only if no existing package can be extended without breaking
   its contract, author new infrastructure — and place the new
   infrastructure in a shared package, not in the calling
   workspace, unless its substance is genuinely workspace-local.

### Move 3 — Live-state check before acting on a brief's enumeration

When a brief enumerates failing checks, open issues, or active
blockers, the next move is *not* to act on the enumeration as
written. It is:

1. Query the live system that owns the enumerated state (the
   issue tracker's API, the CI provider's API, the test-run
   surface, the in-tree state files) for the current snapshot.
2. Cross-check the brief's enumeration against the live snapshot.
3. Treat any item present in the live snapshot but absent from the
   brief as still-active (briefs omit by snapshot age, not by
   resolution); treat any item absent from the live snapshot but
   present in the brief as already-resolved (verify before
   discarding).
4. Act on the cross-checked, live-grounded enumeration, not on the
   brief.

### Composition with adjacent disciplines

These three moves compose with adjacent disciplines:

- **Cross-system observability claims**: when investigating one
  system's behaviour, align all relevant artefacts before making
  cross-system claims (local commit, deployment commit, release
  metadata across each integrated system). This is Move 1 applied
  across multiple sources rather than a single source.
- **Vendor-platform planning**: PDR-033's vendor-doc review is the
  vendor-platform variant of Move 2 — the "workspace" is the
  vendor's documentation, the "shared package" is the vendor's
  first-party offering, and the discipline is identical (survey
  before authoring parallel implementation).

## Consequences

### Positive

- Round-trip latency, retry chains, and rate-limit consumption all
  fall measurably when Move 1 is applied. Local-artefact reads are
  always cheaper than remote-tool retries.
- Parallel infrastructure proposals fall when Move 2 is applied,
  consolidating engineering substance in the shared packages
  designed to hold it. Migration debt does not accumulate.
- Brief-induced stale-action errors fall when Move 3 is applied.
  Agents act on the live state, not on the snapshot of the live
  state at the time the brief was written.
- The three moves together generalise into the broader principle —
  *internal cheap fresh source before external expensive stale
  source* — which extends to PDR-033 (vendor-doc review) and to
  the cross-system observability move.

### Negative

- The three moves add a check step to investigation, planning,
  and reading-of-briefs. The cost of the check step is small
  (seconds per occurrence) but real, and authors who feel they
  "already know" must remember to apply it as a checklist item,
  not as an intuition.
- The discipline interacts with parallel-agent dispatch: when
  multiple agents are working on related artefacts, "workspace
  inventory" is a moving target. Move 3 (live-state check)
  partially addresses this, but a parallel-agent context still
  requires a final pre-action freshness query.

### Neutral

- The shared-package directories that hold the infrastructure
  Move 2 surveys do not need to be uniformly named across repos.
  Each repo's shared-package layout is host-local; the discipline
  of surveying it before authoring parallel code is invariant.

## Adopter Scope

**Genotype** (per PDR-019). This PDR applies across every Practice-
bearing repo that has workspaces, broker tooling between agents
and external systems, and a brief-driven session-handoff pattern.
Specific shared-package directory names, specific log-file
conventions, specific issue-tracker APIs, and specific brief
formats vary per repo; the three-moves discipline is invariant.

## Notes

- The three failure modes were captured across multiple sessions
  in the host's per-session capture surfaces. The single-shape /
  single-fix recognition emerged at consolidation time, not in
  any single session. PDR-014 cross-session-pattern-emergence is
  the routing path that surfaced the structural commonality.
- PDR-033 (vendor-doc review) is the vendor-platform-specific
  expression of Move 2 plus the vendor-specialist-reviewer
  amplification. PDR-033 was authored before the broader
  three-moves shape was recognised; the relationship is that
  PDR-033 is one named instance of this PDR's general discipline.
- The discipline composes naturally with PDR-018 (planning
  discipline) at plan-time: every plan targeting investigation,
  infrastructure, or brief-driven action carries the workspace-
  first checks as part of its grounding section.
