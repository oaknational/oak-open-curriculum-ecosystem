/**
 * Thread-progressions projection (G3 c1) — the module-load index over the
 * year-ordered thread→unit sequences of the one curriculum graph corpus.
 *
 * Sequence order is its own corpus section (`sequences`) because ordering
 * cannot ride the attribute-less `{source, type, target}` edges — this is the
 * ordered projection over the one-graph corpus data, its own real operation
 * (ADR-173 real-operations-only). The progression axis is the placement's
 * teaching YEAR: the bulk exports no authoritative within-thread unit
 * ordering (`unit.threads[].order` is the thread's display index), so
 * placements arrive year-ascending with year-less placements last and ties
 * broken by unitId — within one year the order is not curricular.
 *
 * This module builds the thread and unit node indexes plus the per-thread
 * sequence map once at module load — per-view selection over the corpus, the
 * settled substrate mechanism (the EEF and G2 precedent).
 */

import {
  graphCorpus,
  type GraphCorpusNodeId,
  type GraphCorpusSequence,
  type GraphCorpusThreadNode,
  type GraphCorpusUnitNode,
} from '@oaknational/sdk-codegen/graph-corpus';

import { mustGet } from './projection-helpers.js';

/** The module-load projection: thread/unit node indexes plus the sequence map. */
export interface CurriculumThreadProgressionsProjection {
  readonly threadsById: ReadonlyMap<GraphCorpusNodeId, GraphCorpusThreadNode>;
  readonly unitsById: ReadonlyMap<GraphCorpusNodeId, GraphCorpusUnitNode>;
  readonly sequencesByThreadId: ReadonlyMap<GraphCorpusNodeId, GraphCorpusSequence>;
}

/**
 * Builds the thread-progressions projection over the one graph corpus:
 * thread and unit node indexes plus the per-thread year-ordered sequence map.
 * Every sequence endpoint is integrity-checked against the node indexes at
 * build (the corpus's zero-dangling invariant, enforced loudly). Exported for
 * the startup-cost proof; runtime consumers use the view module's module-load
 * singleton.
 */
export function buildCurriculumThreadProgressionsProjection(): CurriculumThreadProgressionsProjection {
  const threadsById = new Map<GraphCorpusNodeId, GraphCorpusThreadNode>();
  const unitsById = new Map<GraphCorpusNodeId, GraphCorpusUnitNode>();
  for (const node of graphCorpus.nodes) {
    if (node.kind === 'thread') {
      threadsById.set(node.id, node);
    } else if (node.kind === 'unit') {
      unitsById.set(node.id, node);
    }
  }

  const sequencesByThreadId = new Map<GraphCorpusNodeId, GraphCorpusSequence>();
  for (const sequence of graphCorpus.sequences) {
    mustGet(threadsById, sequence.threadId);
    for (const placement of sequence.placements) {
      mustGet(unitsById, placement.unitId);
    }
    sequencesByThreadId.set(sequence.threadId, sequence);
  }

  return { threadsById, unitsById, sequencesByThreadId };
}
