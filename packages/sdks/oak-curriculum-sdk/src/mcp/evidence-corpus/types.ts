/**
 * Type substrate for the EEF evidence corpus surface (gate-1a delivery).
 *
 * Defines the composition wrapper that holds a `GraphView` and adds the
 * three corpus-layer operations: `rank` (composite-scored
 * recommendations), `explain` (single-strand expansion with
 * citations), and `compare` (side-by-side dimensional comparison).
 *
 * **Composition, not inheritance** (per `principles.md` §Code Design):
 * `EvidenceCorpus` *holds* a `GraphView`, it does not *become* one.
 * Consumers reach the graph operations via `corpus.view.<op>(...)`,
 * keeping the corpus/graph boundary structural rather than only prose.
 * Long-term architectural evidence beats the surface-ergonomic
 * shortcut of `extends GraphView`.
 *
 * **NotImplementedYet discriminator placement** (per type-expert
 * verdict on this cycle): the corpus-layer `NotImplementedYet` is
 * scoped to corpus operations (`rank | explain | compare`), distinct
 * from `graph-core`'s `NotImplementedYet` which is scoped to graph
 * operations (`summary`, `getNode`, `enumerateNodes`, `neighbours`,
 * `findByTag`). Both share the `kind: 'NotImplementedYet'` discriminant
 * value; TypeScript structural typing keeps the two narrowings
 * unambiguous because the `operation` literal unions are disjoint.
 * This preserves the dependency direction permanently enshrined in
 * `graph-core` (ADR-041) — corpus concerns never leak into the graph
 * substrate.
 *
 * **EefStrand skeleton** (per type-expert Option C verdict): the
 * concrete `EefStrand` interface here is a structural minimum
 * sufficient for the corpus generics. The authoritative `EefStrand`
 * type at gate-1a's data layer flows from the `t2-zod-loader` Zod
 * schema (`z.infer`) when that cycle lands. T2 will REPLACE this
 * skeleton (not bridge) per `principles.md` §"NEVER create
 * compatibility layers".
 *
 * **Gate-1a stub returns**: at gate-1a `WS4.5` (the `EefStrandsGraphView`
 * adapter) authors an `EvidenceCorpus` implementation directly whose
 * three corpus-level operations return a `NotImplementedYet` error
 * value via `Result.err`. No shared stub factory ships at t1 — per
 * `consolidate-at-third-consumer`, extracting a stub abstraction
 * before any consumer exists is YAGNI; WS4.5 authors the stub
 * returns inline in its own module and they delete cleanly when
 * real implementations land at gate-1b.
 *
 * @packageDocumentation
 */

import type { Result } from '@oaknational/result';
import type {
  GraphView,
  NodeFilter,
  NodeProjection,
  NodeNotFoundError,
} from '@oaknational/graph-core/graph-view';

/**
 * Corpus-layer not-implemented marker.
 *
 * Shares the `kind: 'NotImplementedYet'` discriminator string with
 * `graph-core/graph-view`'s `NotImplementedYet` interface; the
 * `operation` field's literal union is disjoint so narrowing remains
 * unambiguous.
 */
export interface NotImplementedYet {
  readonly kind: 'NotImplementedYet';
  readonly operation: 'rank' | 'explain' | 'compare';
}

/**
 * The set of dimensions consumers may request in a side-by-side
 * comparison. Derivable from the strand type at design time per the
 * `eef-toolkit.json` schema; widening to `string[]` would violate
 * `principles.md` §Compiler Time Types ("never widen types when a
 * literal exists").
 */
export type ComparisonDimension =
  | 'impact'
  | 'cost'
  | 'evidence_strength'
  | 'school_context'
  | 'implementation_requirements';

/**
 * Minimum-viable `EefStrand` skeleton for t1's generics.
 *
 * The fields here are the universal identifier surface of an EEF
 * strand as observed in `eef-toolkit.json` — sufficient for t1's
 * `NodeProjection<EefStrand>` / `NodeFilter<EefStrand>` generics.
 * The full strand shape (`headline.impact_months`,
 * `effectiveness.summary`, `tags`, etc.) lands at t2 via `z.infer`
 * over the Zod schema.
 *
 * @see The `t2-zod-loader` cycle replaces this skeleton with the
 *   `z.infer` of the Zod schema landed alongside the SDK data file.
 *   At that point this declaration is removed (not bridged) per
 *   `principles.md` §"NEVER create compatibility layers".
 */
export interface EefStrand {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
}

/**
 * Identify a strand for an `explain` request. `TNode`-independent: a
 * strand is identified by `strand_id` only, and the response carries
 * the full node detail. `RankOptions` and `CompareOptions` carry
 * `TNode` because they accept node-shape parameters (predicates,
 * comparison sets); explain takes only an identifier.
 */
export interface ExplainOptions {
  readonly strand_id: string;
  readonly projection?: NodeProjection<EefStrand>;
}

/**
 * Strands and dimensions for a side-by-side comparison.
 *
 * Non-empty-two-minimum tuple on `strand_ids` makes "compare with
 * fewer than two strands" structurally impossible.
 */
export interface CompareOptions {
  readonly strand_ids: readonly [string, string, ...string[]];
  readonly dimensions: readonly ComparisonDimension[];
}

/**
 * Scoring weights and context vector for ranking. The full Zod schema
 * for context inputs lives alongside the scoring engine in `t5`; this
 * shape is the compile-time surface consumers commit to at the corpus
 * boundary.
 */
export interface RankOptions<TNode> {
  readonly filter?: NodeFilter<TNode>;
  readonly context: {
    readonly phase: 'primary' | 'secondary';
    readonly subject?: string;
    readonly focus?: 'closing_disadvantage_gap' | 'metacognition' | 'literacy' | 'numeracy';
    readonly max_cost?: 1 | 2 | 3 | 4 | 5;
    readonly min_evidence?: 1 | 2 | 3 | 4 | 5;
    readonly max_results?: number;
  };
}

/** A single ranked recommendation paired with its computed score. */
export interface RankedItem<TNode> {
  readonly node: TNode;
  readonly score: number;
}

/** Result payload from `rank`: an ordered list of ranked items. */
export interface RankedResults<TNode> {
  readonly items: readonly RankedItem<TNode>[];
}

/** Result payload from `explain`: one node plus structured commentary. */
export interface NodeExplanation<TNode> {
  readonly node: TNode;
  readonly commentary: string;
}

/** Result payload from `compare`: per-dimension comparison of the given strands. */
export interface ComparisonResult<TNode> {
  readonly strands: readonly TNode[];
  readonly dimensions: readonly ComparisonDimension[];
}

/**
 * Stub-only error type for `rank` at gate-1a. At gate-1b this expands
 * additively with real ranking-failure variants (e.g., insufficient
 * data for the requested context). Until then the only failure shape
 * the consumer can encounter is `NotImplementedYet`.
 */
export type RankError = NotImplementedYet;

/**
 * Stub-only error type for `compare` at gate-1a. At gate-1b this
 * expands additively (e.g., unknown strand id, dimension not yet
 * computable for that strand).
 */
export type CompareError = NotImplementedYet;

/**
 * The corpus wrapping interface.
 *
 * `view` exposes the underlying `GraphView` for direct graph
 * operations (subgraph, manifest, summary, etc.). The three corpus-
 * level operations are stubs at gate-1a (return
 * `Result.err(NotImplementedYet)`); they ship real implementations at
 * gate-1b.
 *
 * @typeParam TNode - The node value type the wrapped GraphView operates on.
 * @typeParam TEdgeType - String-literal-union of edge-type discriminants.
 */
export interface EvidenceCorpus<TNode, TEdgeType extends string> {
  readonly view: GraphView<TNode, TEdgeType>;
  rank(opts: RankOptions<TNode>): Result<RankedResults<TNode>, RankError>;
  explain(
    opts: ExplainOptions,
  ): Result<NodeExplanation<TNode>, NodeNotFoundError | NotImplementedYet>;
  compare(opts: CompareOptions): Result<ComparisonResult<TNode>, CompareError>;
}
