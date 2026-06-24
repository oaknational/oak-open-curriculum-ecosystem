---
pdr_kind: governance
---

# PDR-115: Name Openly-Licensed External Sources Plainly; Keep Proprietary Sources Private

**Status**: Accepted
**Date**: 2026-06-23
**Related**:
[PDR-009](PDR-009-canonical-first-cross-platform-architecture.md) (cross-platform portability —
external substrate studies inform the Practice and must travel cleanly). Distinct from the
always-applied `plan-body-first-principles-check` vendor-literal clause, which governs
vendor-token drift in plan prose, not source attribution (named here without a downward link,
per PDR-105 reference-direction).

## Context

The Practice studies external substrates (other repos' skills, agent frameworks, prompt corpora)
to learn from them. An early study (`mattpocock/skills`) was source-neutralised by design — its
source kept anonymous. The owner determined (2026-06-22) that for an **openly-licensed public
repo** (MIT in that case) the anonymity "never had a real purpose" and directed dropping it. That
decision was scoped to one source; a second substrate study ("ponytail") already exists, and each
future study faces the same naming decision afresh.

Without a settled convention, every external-substrate study re-litigates whether to name its
source.

## Decision

**Name openly-licensed external sources plainly, with attribution. Keep genuinely
proprietary or unlicensed sources private.**

- An openly-licensed public source (MIT, Apache-2.0, CC-BY, and similar) is named directly in
  the study, with its licence and a link/attribution. There is no value in anonymising what is
  already public and licence-permitted; anonymity only obscures provenance.
- A genuinely proprietary, unlicensed, or access-restricted source stays private — describe what
  was learned in source-neutral terms without naming or quoting the source in a way the licence
  or access terms forbid.

When the licence status is unclear, treat the source as proprietary (name privately) until the
open licence is confirmed.

## Consequences

- External-substrate studies of open sources carry plain attribution; readers can trace and
  re-examine the source.
- The decision is made once per source by its licence, not re-litigated per study.
- This is distinct from the `plan-body-first-principles-check` vendor-literal clause, which
  governs vendor-token drift inside plan prose — not source attribution.

## Enables

Settles open question Q-004. Future external-substrate studies apply the licence test directly;
the substrate-learning plan and the research records under
`.agent/research/agentic-engineering/operating-model-and-platforms/` cite this PDR rather than
re-deriving the naming call.
