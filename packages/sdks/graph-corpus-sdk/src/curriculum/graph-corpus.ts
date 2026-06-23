/**
 * Curriculum graph corpus bridge — the typed corpus value and types re-exported
 * from `@oaknational/sdk-codegen/graph-corpus` for this SDK's consumers
 * (Decision B option (a) / G1a foundation).
 *
 * This module is the sole ingest point from the generated `graph-corpus`
 * dataset into the corpus SDK: it surfaces the corpus value and its types so
 * consumers depend on one stable subpath rather than reaching into the
 * generator package's `generated/` tree.
 *
 * The graph VIEW over this corpus — bounded anchored retrieval, the depth
 * default, and the module-load singleton — lives in the `prior-knowledge-view`
 * module. The corpus edges are oriented prerequisite
 * → dependent; the consumed traversal direction is predecessors (prior
 * knowledge), so the view constructs over reversed edges (G1b retired the
 * forward-only G1a construction bridge that previously lived here, per
 * replace-don't-bridge — there was no consumer for the forward direction).
 */

export { graphCorpus } from '@oaknational/sdk-codegen/graph-corpus';
export type {
  GraphCorpus,
  GraphCorpusEdge,
  GraphCorpusLessonNode,
  GraphCorpusMisconceptionNode,
  GraphCorpusNodeId,
  GraphCorpusSequence,
  GraphCorpusSequencePlacement,
  GraphCorpusThreadNode,
  GraphCorpusUnitNode,
} from '@oaknational/sdk-codegen/graph-corpus';
