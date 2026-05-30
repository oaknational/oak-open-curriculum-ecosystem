---
name: "Extending Graph Support Tooling"
overview: "Home for candidate enhancements to the graph-delivery capability, discovered while building the EEF graph tooling. Each candidate is an explicit owner decision when it arises (build-now, or add here). This plan is NOT a deferral gate: it exists so removed-but-worth-keeping ideas (the type-only rank/explain/compare ops) and exploration findings have a durable home instead of becoming soft stubs or ambient follow-ons."
graph_layer: feature
graph_portfolio_index: "../../../graph-portfolio-index.md"
parent_plan: "../../../sector-engagement/eef/current/eef-graph-tool-completion.plan.md"
sibling_plans:
  - "../current/graph-query-layer.plan.md"
  - "../active/graph-stack.plan.md"
specialist_reviewer: "mcp-expert, architecture-expert-betty, assumptions-expert"
status: future
isProject: false
todos:
  - id: c1-corpus-analytical-ops
    content: "rank / explain / compare corpus-analytical operations. Removed (type-only, no runtime implementer) from EvidenceCorpus by the live EEF plan's D4 to honour no-soft-stubs. If exploration (the live plan's D7 round-trip) shows agents want composite-scored recommendations, single-strand expansion, or side-by-side comparison, design them fresh — NOT by un-stubbing. Note: rank must not become rank-and-cut (a list-op); ordering within a complete scoped subgraph is legitimate, slicing it is not."
    status: pending
  - id: c2-relevance-ordering
    content: "Relevance ordering within a scoped subgraph (distinct from membership selection). Candidate only if exploration shows agents struggle to prioritise across a broad full-node subgraph. Hard constraint: ordering annotates, it never truncates."
    status: pending
  - id: c3-focus-required-question
    content: "Should the explore tool require `focus`? A no-focus call yields a very broad selection (key-stage barely filters); resolve from real exploration data, not in the abstract."
    status: pending
  - id: c4-graded-disclosure-for-large-corpora
    content: "Graded role-based disclosure. NOT needed for EEF (whole corpus < agent ceiling, so full nodes always fit). Becomes live only for a future corpus that genuinely cannot fit full-node, and only built in the right layer (a shared projection applier in graph-core, per graph-view.ts), never as per-tool field-masking."
    status: pending
  - id: c5-additional-corpora-adapters
    content: "Further GraphView adapters (Threads, misconceptions, prerequisites) exercising the same delivery capability. Confirms the capability is genuinely reusable (the end-goal claim)."
    status: pending
  - id: c6-cross-corpus-and-prose
    content: "Cross-corpus surfaces and a prose-delivery tool — both genuinely-unknown candidates surfaced during the EEF work. Build only if exploration shows the need; otherwise they stay candidates here."
    status: pending
---

# Extending Graph Support Tooling

> **Status: future / candidate-buffer.** This plan holds enhancement candidates
> for the graph-delivery capability built by the live EEF plan
> (`../../../sector-engagement/eef/current/eef-graph-tool-completion.plan.md`).
> It is **not a deferral gate** (the EEF work has none): it is the durable home
> that lets the EEF work honour *no soft stubs* and *no ambient follow-ons*
> — removed-but-worth-keeping ideas and discovered enhancements land here as
> explicit candidates, each decided (build-now or keep-as-candidate) when it
> arises, by the owner.

## Why this plan exists

The live EEF plan deliberately scopes its complete capability to graph
**delivery** (the query surface + the thin delivery tool + the proven navigation
loop). Two pressures would otherwise reintroduce the failure modes the EEF work
exists to cure:

1. **Soft stubs.** The `EvidenceCorpus.rank / explain / compare` ops were
   type-only declarations standing in for future analytical operations. Keeping
   them as stubs is exactly the masked-hole anti-pattern. Removing them needs a
   home for the *idea* so the knowledge is preserved (not deleted into the void).
2. **Ambient follow-ons.** Exercising the tooling (the live plan's D7 round-trip)
   will surface real enhancement candidates. Without a named home, they become
   endless follow-on sessions — the drift the EEF work's bounded structure forbids.

This plan is that home. The candidates are in the frontmatter `todos`.

## How candidates are decided

Each candidate is resolved when it genuinely arises (typically at the live plan's
D7 round-trip, or when a new corpus/consumer appears), as a **fresh owner
decision**: build it now
as its own scoped piece of work, or keep it here as a candidate. No candidate is
"scheduled" by default — that would re-create the gate framing.

## Constraints (the corrected EEF doctrine)

- **No list-ops** ever (slice / cap / field-mask-for-budget / rank-and-cut). Any
  ordering or comparison enhancement annotates a complete subgraph; it never
  truncates one.
- **No soft stubs** — build a candidate, or leave it here as prose; never as a
  `NotImplementedYet` placeholder in the interface.
- **Smart graph, thin tool** — cross-cutting capabilities (e.g. a projection
  applier, were one ever needed) live in the graph layer, never as per-tool
  brains.
