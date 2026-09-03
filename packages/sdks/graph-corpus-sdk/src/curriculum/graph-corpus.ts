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
 * The bounded anchored views over this corpus live in sibling modules
 * (`prior-knowledge-statements`, `misconception-view`,
 * `thread-progressions-view`, `keyword-view`). The corpus retains its
 * `prerequisiteFor` edges, but no view reads them: MCP-671 deleted the
 * depth-bounded predecessor view because those edges are synthesised from
 * thread adjacency, not a prerequisite relation the curriculum data records
 * (see ADR-195's MCP-671 amendment).
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
