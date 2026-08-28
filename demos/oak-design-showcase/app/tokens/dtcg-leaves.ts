/**
 * Reading the DTCG format: turning a parsed token tree into the flat list of
 * tokens it declares.
 *
 * The trees arrive as `unknown` because they arrive from outside — a
 * published package's JSON, regenerated upstream on its own schedule. So
 * this module NARROWS rather than asserts: a node counts as a token only
 * when it carries a `$value` of a shape this catalogue can render, and a
 * node that does not simply contributes nothing. A blank swatch on a
 * reference page is a lie about the design system; an absent row is only an
 * absence.
 */
import { typeSafeEntries } from '@oaknational/type-helpers';

/**
 * A DTCG node is either a token — a leaf carrying `$value` — or a group
 * whose entries are more nodes.
 *
 * `$value` may be a NUMBER as well as a string, and this is not
 * hypothetical: the nine fluid-heading curve parts
 * (`type.heading-N-min/max/leading`) are unitless JSON numbers. Accepting
 * strings alone silently dropped exactly those nine — the ones an identity
 * tunes its heading curve with, so the very tokens a per-identity column
 * exists to show.
 */
interface DtcgTokenNode {
  readonly $value: string | number;
  readonly $type?: string;
}

interface DtcgGroupNode {
  readonly [segment: string]: DtcgNode;
}

type DtcgNode = DtcgTokenNode | DtcgGroupNode;

export interface DtcgLeaf {
  readonly path: string;
  readonly value: string;
  readonly type: string | null;
}

/** Anything object-shaped is a DTCG node; which of the two kinds it is, the
 *  predicate below decides. */
function isDtcgNode(value: unknown): value is DtcgNode {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** A node is a TOKEN when `$value` is a string or a number. Narrowing here
 *  rather than reading the property inline is what lets the group branch
 *  iterate a type whose entries really are child nodes. */
function isTokenNode(node: DtcgNode): node is DtcgTokenNode {
  const value = node['$value'];
  return typeof value === 'string' || typeof value === 'number';
}

/** Every token leaf in a tree, depth-first in the order the tree declares
 *  them — which is the order the page shows them in. */
export function dtcgLeaves(node: unknown, path: readonly string[] = []): DtcgLeaf[] {
  if (!isDtcgNode(node)) {
    return [];
  }
  if (isTokenNode(node)) {
    const type = node['$type'];
    return [
      {
        path: path.join('.'),
        value: String(node['$value']),
        type: typeof type === 'string' ? type : null,
      },
    ];
  }
  return typeSafeEntries(node).flatMap(([key, child]) =>
    key.startsWith('$') ? [] : dtcgLeaves(child, [...path, key]),
  );
}
