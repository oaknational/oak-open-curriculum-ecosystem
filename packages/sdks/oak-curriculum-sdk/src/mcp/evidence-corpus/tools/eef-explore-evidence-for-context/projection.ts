/**
 * Node projection for `eef-explore-evidence-for-context` (gate-1a t6a).
 *
 * Projects a full {@link EefStrand} to the tight shape emitted in the
 * response's `data.nodes`. Full strands cost ~16k tokens for the whole corpus;
 * the projected shape is the token-budget mechanism (selection narrows for
 * relevance, projection caps raw size — together they keep the whole
 * `CallToolResult` under 10k).
 *
 * **Why projection happens here, not in `subgraph`.** The `GraphView.subgraph`
 * signature carries a reserved `projection` param, but the explore tool cannot
 * use it: `buildCitations` reads each strand's full `headline`
 * (`evidence_strength_rating`, `impact_months`) to build the structural caveat
 * tuple, so citations must be built from the FULL nodes. Projection is
 * therefore applied at the emission boundary — after citations — to the nodes
 * destined for `data.nodes`. The reserved `subgraph` projection param and its
 * eventual shared applier (graph-core, at the second adapter) are unchanged.
 *
 * **What is dropped, and why it is still honest.** The projected node carries
 * what the model selects ON: the EEF headline summary, what the approach is
 * (`definition.short`), the evidence signal (impact / cost / evidence
 * strength), tags, and the relevant priorities. The heavier prose
 * (`definition.full`, `effectiveness`, `behind_the_average`, `implementation`,
 * `update_history`) AND the `key_findings` bullets are dropped — selection
 * needs breadth and selectability, not depth; the per-strand findings are a
 * gate-1b `explain` concern. Measurement is decisive here: with the mandatory
 * dual-emit and the citation envelope, keeping `key_findings` made even a
 * modest result set exceed the 10k output budget. `eef_url` and the evidence
 * caveats live in the citation envelope (correlated by `id`), not here.
 */

import { type EefStrand, type EefPriority } from '@oaknational/graph-corpus-sdk/eef-strands';

/** The projected headline — impact, cost, evidence strength, and the summary. */
export interface ProjectedEefHeadline {
  readonly impact_months: number | null;
  readonly cost_label: string;
  readonly evidence_strength_label: string;
  readonly headline_summary: string;
}

/** The tight strand shape emitted in `data.nodes`. */
export interface ProjectedEefStrand {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly headline: ProjectedEefHeadline;
  readonly definition_short: string;
  readonly tags: readonly string[];
  readonly most_relevant_priorities?: readonly EefPriority[];
}

/**
 * Project a full strand to the tight emission shape. Pure; the optional
 * `most_relevant_priorities` is included only when the strand carries
 * `school_context_relevance` (the 17 of 30 with it).
 *
 * @param strand - A full corpus strand from the subgraph result.
 */
export function projectExploreNode(strand: EefStrand): ProjectedEefStrand {
  const priorities = strand.school_context_relevance?.most_relevant_priorities;
  return {
    id: strand.id,
    name: strand.name,
    slug: strand.slug,
    headline: {
      impact_months: strand.headline.impact_months,
      cost_label: strand.headline.cost_label,
      evidence_strength_label: strand.headline.evidence_strength_label,
      headline_summary: strand.headline.headline_summary,
    },
    definition_short: strand.definition.short,
    tags: strand.tags,
    ...(priorities === undefined ? {} : { most_relevant_priorities: priorities }),
  };
}
