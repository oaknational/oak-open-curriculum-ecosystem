---
name: "EEF Tool Exact-Value Metric Filter Inputs"
overview: "Owner-deferred (2026-06-03, D3 review-then-ratify session) enhancement to get-eef-evidence: exact-value filter inputs over the graph-projected raw headline metric domains (impactMonths, costRating, costLabel, evidenceStrengthRating, evidenceStrengthLabel). Deferred from the D3 v1 contract because strands are small (1-5.5KB), the impact/cost leverage lens is agent-side reasoning over returned headline facts, and exact-match filtering had no v1 consumer. Sequenced after D7 proves the axis/strand value path; ratified against observed agent usage, not speculation."
type: seed
status: future
thread: eef
related_plans:
  - "../current/eef-graph-tool-completion.plan.md"
  - "../current/eef-d3-mcp-contract.md"
isProject: false
todos:
  - id: gather-usage-evidence
    content: "After EEF D7 lands green, gather the promotion evidence: observed agent usage of get-eef-evidence showing real calls where the agent fetched an axis/strand envelope solely to filter members by an exact headline metric value agent-side. That observed pattern is the consumer the v1 contract lacked; without it this enhancement stays parked (PDR-058: a contract carries only what a real consumer uses)."
    status: pending
    depends_on: []
  - id: ratify-and-specify
    content: "On evidence, ratify and specify the five filter inputs against the D3 contract's standing rules: exact corpus values only (no bucket labels, threshold cut-offs, ranking weights, or comparator semantics — the D3 boundary rule binds this enhancement explicitly); each field's schema composes the nullable VALUE type with field-level optionality as two orthogonal concerns (impactMonths carries corpus null on 4 strands; cost_rating's observed domain is {1, 2, 3, 5} — a literal union, never a range); bind eefHeadlineMetricSubset into the D4-ratified graph-native view as the input-domain subset; extend eefToolInputSchemaSource and the at-least-one-selector rule; land schema + handler + tests as one atomic change."
    status: pending
    depends_on: [gather-usage-evidence]
---

# EEF Tool Exact-Value Metric Filter Inputs (seed)

## Why this plan exists

The D3 contract
([`eef-d3-mcp-contract.md`](../current/eef-d3-mcp-contract.md)) ships
`get-eef-evidence` v1 with strand-id and observed-axis selectors only. The
owner deferred the exact-value headline-metric filters out of v1 at the D3
review-then-ratify session (2026-06-03) so the enhancement is decided on
observed usage rather than speculation:

- Individual strands are 1–5.5KB (median 2KB); the largest axis-filtered
  envelope is trivially manageable, so the agent already receives every
  headline metric it could filter by.
- The impact/cost leverage lens ("high-impact for low effort") is
  contract-defined as agent-side reasoning over returned facts — exact-value
  matching appeared in no D1 value scenario.
- Decision 6 / PDR-058: every surface needs a real consumer; v1 had none for
  metric filters.

This seed exists so the deferral is a named, definite, sequenced enhancement —
not a lost idea.

## What it carries (settled facts, recorded at deferral time)

- The five candidate fields: `impactMonths`, `costRating`, `costLabel`,
  `evidenceStrengthRating`, `evidenceStrengthLabel` — each an exact value from
  the graph-projected raw headline metric domains (D2's
  `HeadlineImpactMonths` / `HeadlineCostRating` / `HeadlineCostLabel` /
  `HeadlineEvidenceStrengthRating` / `HeadlineEvidenceStrengthLabel`, which
  remain live D2 projections regardless of this deferral).
- The D4-bound subset name reserved for this enhancement:
  `eefHeadlineMetricSubset` (moved here from the D3 v1 handoff set).
- Standing rules that bind on landing: exact corpus values only — no buckets,
  thresholds, weights, or comparators; value-nullability and field-optionality
  compose as orthogonal Zod concerns (`impact_months` carries corpus `null` on
  4 strands); `cost_rating`'s observed domain is the literal union
  `{1, 2, 3, 5}` (the gap is corpus truth, never smoothed to a range).

## Promotion trigger

EEF D7 lands green AND observed agent usage shows the exact-match pattern the
v1 contract lacked. Both are observable; neither is a date.
