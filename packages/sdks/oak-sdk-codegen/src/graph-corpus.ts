/**
 * Subpath barrel: `@oaknational/sdk-codegen/graph-corpus`
 *
 * The one bulk curriculum graph corpus (Decision A): unit, thread, lesson,
 * misconception, and keyword nodes carrying kind-qualified ids
 * (`unit:<unitSlug>`, `misconception:<lessonSlug>#<hash16>`,
 * `keyword:<normalised-term>`, …) with `prerequisiteFor` edges plus the
 * thread→unit→lesson→\{misconception, keyword\} chain edges, emitted by the
 * vocab-gen pipeline as a single identity space and surfaced for bounded
 * query views (e.g. `graph-corpus-sdk` constructs its per-view selections
 * over it).
 *
 * The runtime corpus is a large generated structure (loaded from `data.json`)
 * excluded from the lint TypeScript program; this barrel is the single import
 * surface for both the corpus value and its types, so consumers depend on one
 * stable subpath rather than reaching into `generated/`.
 *
 * Re-exports resolve to the graph-corpus generated module directly, not the
 * aggregate `generated/vocab` barrel: importing the aggregate would eagerly
 * load every legacy vocab dataset's `data.json` (misconception, vocabulary,
 * nc-coverage, prior-knowledge, thread-progression) just to reach `graphCorpus`.
 */

export { graphCorpus } from './generated/vocab/graph-corpus/index.js';
export type {
  GraphCorpus,
  GraphCorpusNode,
  GraphCorpusUnitNode,
  GraphCorpusThreadNode,
  GraphCorpusLessonNode,
  GraphCorpusMisconceptionNode,
  GraphCorpusKeywordNode,
  GraphCorpusEdge,
  GraphCorpusEdgeType,
  GraphCorpusNodeId,
  GraphCorpusUnitNodeId,
  GraphCorpusThreadNodeId,
  GraphCorpusLessonNodeId,
  GraphCorpusMisconceptionNodeId,
  GraphCorpusKeywordNodeId,
  GraphCorpusStats,
  GraphCorpusDroppedEdge,
  GraphCorpusDroppedDuplicate,
  GraphCorpusSequence,
  GraphCorpusSequencePlacement,
  GraphCorpusUnitLessonRun,
} from './generated/vocab/graph-corpus/index.js';
