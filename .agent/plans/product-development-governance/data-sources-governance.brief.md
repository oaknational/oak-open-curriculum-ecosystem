# Data-Sources Governance — Work Brief

*Short brief for the `data-sources-governance` lane. Author: Cedar lifts Canopy, 2026-06-27.
Full first-hand grounding is in the thread record (`data-sources-governance.next-session.md`, on
main); ADR-157 is the source enumeration — do not re-derive.*

## Goal

Author `docs/governance/DATA-SOURCES.md` — a register of the data sources the **MCP server and
semantic-search apps surface**, with, per source: **adoption date, suitability-review criteria,
last-reviewed, and removal criteria**. Owner-confirmed.

## Why it matters

ADR-157 / ADR-152 enumerate the sources, licensing, and attribution but deliberately do **not**
define review/removal criteria — that governance gap is exactly what this register fills. It is
the surface the **explain** lens points to for the cross-functional governance audience
(leadership / compliance / education / product), and it is the second half of the WS-B explain
ship-gate (the surface points to a real register).

## Lane shape

- **Ship-independent PR off `main`** — NOT folded into WS-B (it is cross-cutting governance, with
  its own review lens). Merge commits are re-enabled (2026-06-27).
- **Worktree:** `oak-data-sources`  **Branch:** `docs/data-sources-governance` — currently **38
  behind main and missing its own thread record. Rebase main FIRST** (the grounding + plans estate
  live on main; #242's `safe-path` SSOT is now on main too).
- **Owner-assigned to Cedar.**

## The two halves

- **Factual half (straightforward)** — source inventory, adoption dates, licensing, attribution,
  from ADR-157 + `LICENCE-DATA.md` + `ATTRIBUTION.md`. The four sources: Oak Open Curriculum API
  (OGL v3.0; `oakapi-` / `bulk-`), Oak Curriculum Ontology (`onto-`), EEF Teaching & Learning
  Toolkit (`eef-`; attribution REQUIRED), Oak semantic search (`oaksearch-`). **Each source entry
  links to the original external source (where possible) and to whatever in-repo representation
  exists** — that may be a cached copy of the data, or a cached schema/spec rather than the data
  (e.g. the Oak Open Curriculum API data is not cached, but its OpenAPI spec is — link that), or no
  in-repo link where none exists. Owner direction 2026-06-27.
- **Policy half** — suitability-review, last-reviewed cadence, and removal criteria are new
  governance policy. The session recommends **short, simple** criteria grounded in the apps'
  purpose and Oak's pillars, each with a one-line rationale (owner direction 2026-06-27: keep them
  short and simple). The owner reviews them in the finished document; do not pre-settle them.

## Firewall

`explain` POINTS to this register; it never bakes review dates (the volatility firewall). The
register itself is the home for the dates and the review/removal policy.

## Steps

1. Rebase `docs/data-sources-governance` onto main (gets the thread record, plans estate, #242).
2. Author the register: factual half from the grounding; policy half as concrete proposed criteria.
3. docs-adr-expert review in real time → quality gates.
4. Open a ship-independent PR off main; flag the merge-ordering pact to any concurrent lane.
