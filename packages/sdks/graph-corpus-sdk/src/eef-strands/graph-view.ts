/**
 * `EefStrandsGraphView` — the gate-1a EEF evidence-corpus adapter (WS4.5).
 *
 * Implements the polymorphic {@link GraphView} contract from
 * `@oaknational/graph-core` over the EEF Teaching and Learning Toolkit
 * strands. This is the first concrete `GraphView` adapter; it sets the
 * adapter implementation pattern for the Threads (WS4.2) and other
 * corpora that follow. The pure graph model, validation, and traversal
 * live in `./eef-graph-model.ts`; this class is the thin contract surface
 * that composes them.
 *
 * **Operation scope at gate-1a (graph-stack Inc.1d)**: two operations
 * ship live — `manifest()` (graph-level truth-telling produced at
 * construction) and `subgraph()` (a bounded breadth-first traversal over
 * `related_strand` edges). The remaining five fallible operations
 * (`summary`, `getNode`, `enumerateNodes`, `neighbours`, `findByTag`)
 * return `Result.err(NotImplementedYet)` with the operation name; their
 * real implementations land at Inc.3. The widened error unions are
 * additive and backward-compatible when that happens. The stubs omit the
 * interface's parameters deliberately — a stub uses none of them, and a
 * narrower implementation still satisfies the `GraphView` signature; the
 * parameters return when the real logic lands at Inc.3.
 *
 * **Edge model**: a single edge type, `related_strand`, derived from each
 * strand's optional `related_strands` array (strand id → strand id). The
 * corpus's `related_guidance_reports` are NOT modelled as graph edges:
 * their targets are external report URLs, not strand nodes, so they
 * belong in the citation envelope at the tool boundary (gate-1a t6a), not
 * in the strand subgraph. A second edge type can be added additively if a
 * future requirement makes guidance reports first-class nodes.
 *
 * **Construction is fallible** per the {@link GraphView} implementor
 * contract ("an adapter constructor MUST fail when its backing data is
 * unavailable"). {@link EefStrandsGraphView.create} validates two
 * graph-level invariants the Zod loader (t2, shape-level) cannot express:
 * strand-id uniqueness and `related_strand` referential integrity.
 *
 * **Projection is accepted but not yet applied**. The {@link GraphView}
 * signature mandates an optional `projection`, but a runtime projection
 * applier is a cross-cutting concern every adapter needs and none yet
 * has — implementing it here, before a second consumer exists, would be
 * premature per `consolidate-at-third-consumer`. `subgraph` therefore
 * returns full nodes and the parameter is reserved; the shared applier
 * lands in `graph-core` when the second adapter needs it.
 */

import { ok, err, type Result } from '@oaknational/result';
import type {
  GraphView,
  GraphManifest,
  GraphSummary,
  GraphSummaryError,
  SubgraphResult,
  SubgraphError,
  NodeProjection,
  NodeNotFoundError,
  NotImplementedYet,
  EnumerateNodesResult,
  EnumerateNodesError,
  NeighbourResult,
  FindByTagError,
} from '@oaknational/graph-core/graph-view';

import type { EefStrand } from './strand-schema.js';
import {
  buildGraphIndex,
  traverseSubgraph,
  validateSubgraphRequest,
  RELATED_STRAND,
  type EefGraphIndex,
  type EefStrandEdgeType,
  type EefStrandsGraphViewConstructionError,
} from './eef-graph-model.js';

export type { EefStrandEdgeType, EefStrandsGraphViewConstructionError };

/**
 * Manifest metadata supplied at construction. The adapter cannot
 * fabricate these values; the t2 Zod loader derives them from the corpus
 * `meta` block (`data_version`, `last_updated`) and a computed schema
 * hash. Unit tests inject literals.
 */
export interface EefStrandsManifestMeta {
  readonly version: string;
  readonly lastUpdated: string;
  readonly schemaHash: string;
}

/** Construction input: the strand nodes plus the manifest metadata. */
export interface EefStrandsGraphViewInput {
  readonly strands: readonly EefStrand[];
  readonly meta: EefStrandsManifestMeta;
}

/**
 * `GraphView` adapter over the EEF Teaching and Learning Toolkit strands.
 *
 * Construct via the fallible {@link EefStrandsGraphView.create} factory;
 * the constructor is private so an instance can only exist once its
 * backing data has passed the graph-level integrity checks.
 */
export class EefStrandsGraphView implements GraphView<EefStrand, EefStrandEdgeType> {
  readonly #index: EefGraphIndex;
  readonly #meta: EefStrandsManifestMeta;

  private constructor(index: EefGraphIndex, meta: EefStrandsManifestMeta) {
    this.#index = index;
    this.#meta = meta;
  }

  /**
   * Build an adapter, validating strand-id uniqueness and
   * `related_strand` referential integrity. Returns `err` on the first
   * violation rather than exposing a degraded view.
   *
   * The success type is the `GraphView` interface, not the concrete
   * class: consumers compose against the polymorphic contract (ADR-179),
   * never the adapter's internal shape. Returning the interface also
   * keeps the Inc.3 stub signatures (which currently omit their unused
   * parameters) invisible to callers, so a caller cannot bind to a
   * narrower concrete signature that changes when the stubs gain their
   * real parameters at Inc.3.
   */
  static create(
    input: EefStrandsGraphViewInput,
  ): Result<GraphView<EefStrand, EefStrandEdgeType>, EefStrandsGraphViewConstructionError> {
    const index = buildGraphIndex(input.strands);
    if (!index.ok) {
      return index;
    }
    return ok(new EefStrandsGraphView(index.value, input.meta));
  }

  /**
   * Graph-level metadata, produced once at construction time. Non-fallible
   * per the {@link GraphView} contract — the load step is the failure
   * boundary, not the per-call boundary.
   */
  manifest(): GraphManifest {
    return {
      nodeCount: this.#index.orderedIds.length,
      edgeTypes: this.#index.edgeCount > 0 ? [RELATED_STRAND] : [],
      edgeCount: this.#index.edgeCount,
      version: this.#meta.version,
      lastUpdated: this.#meta.lastUpdated,
      schemaHash: this.#meta.schemaHash,
      sparseRelationsByNodeId: this.#index.sparseRelationsByNodeId,
    };
  }

  /**
   * Bounded breadth-first traversal over `related_strand` edges from the
   * given roots. Fails with `SubgraphRootNotFound` if any root id is
   * unknown, and `SubgraphDepthExceeded` if `depth` is negative or above
   * the limit. `depth` 0 returns the roots with no edges. `projection` is
   * reserved (see class docstring); full nodes are returned.
   */
  subgraph(opts: {
    readonly rootIds: readonly string[];
    readonly depth: number;
    readonly projection?: NodeProjection<EefStrand>;
  }): Result<SubgraphResult<EefStrand>, SubgraphError> {
    const invalid = validateSubgraphRequest(this.#index.nodesById, opts.rootIds, opts.depth);
    if (invalid !== undefined) {
      return err(invalid);
    }
    return ok(traverseSubgraph(this.#index.nodesById, opts.rootIds, opts.depth));
  }

  /** Inc.3 stub — see class docstring. */
  summary(): Result<GraphSummary, GraphSummaryError> {
    return err({ kind: 'NotImplementedYet', operation: 'summary' });
  }

  /** Inc.3 stub — see class docstring. */
  getNode(): Result<EefStrand, NodeNotFoundError | NotImplementedYet> {
    return err({ kind: 'NotImplementedYet', operation: 'getNode' });
  }

  /** Inc.3 stub — see class docstring. */
  enumerateNodes(): Result<
    EnumerateNodesResult<EefStrand>,
    EnumerateNodesError | NotImplementedYet
  > {
    return err({ kind: 'NotImplementedYet', operation: 'enumerateNodes' });
  }

  /** Inc.3 stub — see class docstring. */
  neighbours(): Result<NeighbourResult<EefStrand>, NodeNotFoundError | NotImplementedYet> {
    return err({ kind: 'NotImplementedYet', operation: 'neighbours' });
  }

  /** Inc.3 stub — see class docstring. */
  findByTag(): Result<readonly EefStrand[], FindByTagError> {
    return err({ kind: 'NotImplementedYet', operation: 'findByTag' });
  }
}
