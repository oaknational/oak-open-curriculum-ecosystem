/**
 * Graph-corpus misconception node builder (G2): the settled content-hash
 * mint with keep-first dedup, fail-loud provenance, and id-sorted output.
 * Split from the unit/thread/lesson builders in `graph-corpus-nodes.ts` —
 * this module owns the dedup machinery the mint rule requires.
 */
import type { ExtractedMisconception } from '../extractors/index.js';

import {
  lessonNodeId,
  type GraphCorpusDroppedDuplicate,
  type GraphCorpusLessonNodeId,
  type GraphCorpusMisconceptionNode,
  type GraphCorpusMisconceptionNodeId,
} from './graph-corpus-types.js';
import { mintMisconceptionId, normaliseMisconceptionText } from './misconception-mint.js';

/** The misconception node set plus dedup provenance and edge endpoints. */
export interface MisconceptionBuild {
  readonly nodes: readonly GraphCorpusMisconceptionNode[];
  readonly droppedDuplicates: readonly GraphCorpusDroppedDuplicate[];
  readonly collapsedIdentical: number;
  readonly edgePairs: readonly (readonly [
    GraphCorpusLessonNodeId,
    GraphCorpusMisconceptionNodeId,
  ])[];
}

/** Mutable accumulator for the misconception keep-first dedup pass. */
interface MisconceptionAccumulator {
  readonly byId: Map<GraphCorpusMisconceptionNodeId, GraphCorpusMisconceptionNode>;
  readonly lessonSlugById: Map<GraphCorpusMisconceptionNodeId, string>;
  readonly droppedDuplicates: GraphCorpusDroppedDuplicate[];
  collapsedIdentical: number;
}

/**
 * Absorbs one occurrence: first sight mints the node; an identical
 * re-occurrence collapses idempotently; a same-text-different-response
 * occurrence keeps the first and records provenance (fail-loud).
 */
function absorbOccurrence(acc: MisconceptionAccumulator, entry: ExtractedMisconception): void {
  const id = mintMisconceptionId(entry.lessonSlug, entry.misconception);
  const existing = acc.byId.get(id);
  if (!existing) {
    acc.byId.set(id, {
      kind: 'misconception',
      id,
      misconception: entry.misconception,
      response: entry.response,
    });
    acc.lessonSlugById.set(id, entry.lessonSlug);
    return;
  }
  if (existing.response === entry.response) {
    acc.collapsedIdentical += 1;
    return;
  }
  acc.droppedDuplicates.push({
    lessonSlug: entry.lessonSlug,
    misconception: entry.misconception,
    keptResponse: existing.response,
    droppedResponse: entry.response,
    reason:
      'same normalised misconception text with a different response within one lesson; ' +
      'kept the first occurrence (keep-first rule, data-quality signal)',
  });
}

/** Occurrences ordered by (lessonSlug, normalised text, response) — keep-first is order-independent. */
function sortOccurrences(
  misconceptions: readonly ExtractedMisconception[],
): readonly ExtractedMisconception[] {
  return [...misconceptions].sort(
    (a, b) =>
      a.lessonSlug.localeCompare(b.lessonSlug) ||
      normaliseMisconceptionText(a.misconception).localeCompare(
        normaliseMisconceptionText(b.misconception),
      ) ||
      a.response.localeCompare(b.response),
  );
}

/**
 * Builds misconception nodes under the settled mint rule.
 *
 * Identical `(lessonSlug, normalised text)` occurrences mint the same id and
 * collapse to one node, idempotently (multi-placement lessons). A
 * same-text-different-response pair within one lesson keeps the first
 * occurrence and records provenance — never two nodes, never silence.
 * Output is id-sorted (lessonSlug-grouped, hash-ordered).
 */
export function buildMisconceptionNodes(
  misconceptions: readonly ExtractedMisconception[],
): MisconceptionBuild {
  const acc: MisconceptionAccumulator = {
    byId: new Map(),
    lessonSlugById: new Map(),
    droppedDuplicates: [],
    collapsedIdentical: 0,
  };
  for (const entry of sortOccurrences(misconceptions)) {
    if (entry.misconception.trim()) {
      absorbOccurrence(acc, entry);
    }
  }
  const nodes = [...acc.byId.values()].sort((a, b) => a.id.localeCompare(b.id));
  const edgePairs = nodes.map((node) => {
    const lessonSlug = acc.lessonSlugById.get(node.id);
    if (lessonSlug === undefined) {
      throw new Error(`misconception node ${node.id} has no recorded lesson scope`);
    }
    return [lessonNodeId(lessonSlug), node.id] as const;
  });
  return {
    nodes,
    droppedDuplicates: acc.droppedDuplicates,
    collapsedIdentical: acc.collapsedIdentical,
    edgePairs,
  };
}
