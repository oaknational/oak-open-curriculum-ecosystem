/**
 * Anchor resolution shared by the curriculum views.
 *
 * @remarks
 * Every anchored view resolves caller slugs against its projection's known
 * node ids with the same contract: set semantics (duplicates collapse,
 * first-occurrence order kept), unknown slugs reported verbatim — never an
 * error, so a fully-unknown anchor list flows into a well-formed empty
 * result on the view's normal path.
 */
import { type GraphCorpusNodeId } from '@oaknational/sdk-codegen/graph-corpus';

/** An anchor resolution report: known slugs as node ids, unknown slugs verbatim. */
export interface ResolvedAnchors<TId extends GraphCorpusNodeId> {
  readonly resolved: readonly TId[];
  readonly unknown: readonly string[];
}

/** Resolves anchor slugs to known node ids with set semantics; unknown slugs are reported, not errors. */
export function resolveAnchors<TId extends GraphCorpusNodeId>(
  slugs: readonly string[],
  toNodeId: (slug: string) => TId,
  known: ReadonlyMap<GraphCorpusNodeId, unknown>,
): ResolvedAnchors<TId> {
  const resolved: TId[] = [];
  const unknown: string[] = [];
  const seenResolved = new Set<TId>();
  const seenUnknown = new Set<string>();
  for (const slug of slugs) {
    const nodeId = toNodeId(slug);
    if (known.has(nodeId)) {
      if (!seenResolved.has(nodeId)) {
        seenResolved.add(nodeId);
        resolved.push(nodeId);
      }
    } else if (!seenUnknown.has(slug)) {
      seenUnknown.add(slug);
      unknown.push(slug);
    }
  }
  return { resolved, unknown };
}
