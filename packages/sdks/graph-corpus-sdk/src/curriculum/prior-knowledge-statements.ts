/**
 * Prior-knowledge statements — anchored retrieval of each unit's STATED
 * prior knowledge over the curriculum graph corpus.
 *
 * "Prior knowledge of unit X" here is what Oak records on the unit itself:
 * the flat `priorKnowledge` statements (free-text propositions about what
 * pupils are assumed to know or have experienced), carried on every corpus
 * unit node. No traversal is involved — the statements are unit fields, not
 * edges — so retrieval is anchor resolution plus field projection, and the
 * result is infallible for any input (unknown slugs are reported, never
 * errored).
 *
 * This supersedes the subgraph traversal as the tool's serving path: the
 * corpus's `prerequisiteFor` edges encode thread adjacency on the year axis
 * (see `graph-corpus-edges.ts` — same-year ordering is stated-arbitrary),
 * not epistemic prerequisites, so the stated statements are the honest
 * prior-knowledge surface. Thread membership (`threadSlugs`) stays on each
 * returned node for ordering context via the thread-progressions view.
 */

import {
  graphCorpus,
  type GraphCorpusNodeId,
  type GraphCorpusUnitNode,
  type GraphCorpusUnitNodeId,
} from '@oaknational/sdk-codegen/graph-corpus';
import { resolveAnchors } from './anchor-resolution.js';
import { mustGet } from './projection-helpers.js';

/**
 * The stated prior knowledge for a set of anchor units.
 *
 * `units` carry each anchor's `priorKnowledge` statements (exact duplicates
 * collapsed) and `threadSlugs`, in resolved-anchor order. `resolvedAnchors`
 * are the anchor ids found in the corpus; `unknownAnchors` are the input
 * slugs with no matching unit (reported, not an error).
 */
export interface PriorKnowledgeStatements {
  readonly units: readonly GraphCorpusUnitNode[];
  readonly resolvedAnchors: readonly GraphCorpusUnitNodeId[];
  readonly unknownAnchors: readonly string[];
}

/** Maps a bare unit slug to its kind-qualified corpus node id (`unit:<slug>`). */
function toUnitNodeId(unitSlug: string): GraphCorpusUnitNodeId {
  return `unit:${unitSlug}`;
}

/** The corpus's unit nodes by id, built once at module load (the view precedent). */
const unitNodesById: ReadonlyMap<GraphCorpusNodeId, GraphCorpusUnitNode> = new Map(
  graphCorpus.nodes
    .filter((node): node is GraphCorpusUnitNode => node.kind === 'unit')
    .map((node) => [node.id, node]),
);

/**
 * Returns the stated prior knowledge for the given anchor unit slugs.
 *
 * Anchors are resolved with the shared set semantics (duplicates collapse,
 * first-occurrence order kept); unknown slugs are reported in
 * `unknownAnchors` rather than failing the call. An empty anchor list — or
 * one whose slugs all miss the corpus — returns a well-formed empty result.
 *
 * @param unitSlugs - Anchor unit slugs (corpus keys, not free text).
 * @returns The anchor units with their stated prior-knowledge statements.
 */
export function priorKnowledgeStatements(unitSlugs: readonly string[]): PriorKnowledgeStatements {
  const { resolved, unknown } = resolveAnchors(unitSlugs, toUnitNodeId, unitNodesById);
  // Collapse exact-duplicate statements (the corpus repeats some verbatim);
  // set semantics keep first-occurrence order. Other fields are the node's own.
  const units = resolved.map((id) => {
    const node = mustGet(unitNodesById, id);
    return { ...node, priorKnowledge: [...new Set(node.priorKnowledge)] };
  });
  return { units, resolvedAnchors: resolved, unknownAnchors: unknown };
}
