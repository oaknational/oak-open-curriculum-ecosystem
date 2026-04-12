/**
 * DTCG token tree colour resolution for contrast validation.
 *
 * @remarks
 * Walks a merged DTCG token tree and resolves all colour token references
 * to final hex values. Single-pass resolution is guaranteed by the tier
 * hierarchy (palette → semantic → component) when the tree is walked in
 * insertion order.
 *
 * @packageDocumentation
 */
import type { DtcgTokenTree } from './dtcg-types.js';

/**
 * Anchored DTCG token reference pattern — matches a full-string reference.
 *
 * @remarks
 * The inner pattern `[a-z0-9-]+(?:\.[a-z0-9-]+)*` is shared with
 * `TOKEN_REFERENCE_PATTERN` in `index.ts` (global search variant). Both
 * must be updated together if the DTCG reference syntax changes.
 */
const REFERENCE_PATTERN = /^\{([a-z0-9-]+(?:\.[a-z0-9-]+)*)\}$/iu;

/** Store a resolved hex value, following references through the accumulator. */
function resolveColourLeaf(resolved: Map<string, string>, dotPath: string, rawValue: string): void {
  const refMatch = rawValue.match(REFERENCE_PATTERN);

  if (refMatch) {
    const resolvedHex = resolved.get(refMatch[1]);

    if (resolvedHex !== undefined) {
      resolved.set(dotPath, resolvedHex);
    }
  } else {
    resolved.set(dotPath, rawValue);
  }
}

/**
 * Narrow a token tree node to a colour token leaf with a string `$value`.
 *
 * @remarks
 * The predicate proves every property it asserts: object-ness, `$type`
 * literal, `$value` existence, and `$value` string-ness. This eliminates
 * redundant narrowing at call sites.
 */
function isColourTokenLeaf(
  node: DtcgTokenTree[string],
): node is { readonly $type: 'color'; readonly $value: string } {
  return (
    typeof node === 'object' &&
    node !== null &&
    '$value' in node &&
    '$type' in node &&
    node.$type === 'color' &&
    typeof node.$value === 'string'
  );
}

/** Process a single child node during the tree walk. */
function visitChild(
  child: DtcgTokenTree[string],
  childPath: readonly string[],
  resolved: Map<string, string>,
): void {
  if (typeof child !== 'object' || child === null) {
    return;
  }

  if (isColourTokenLeaf(child)) {
    resolveColourLeaf(resolved, childPath.join('.'), child.$value);
    return;
  }

  if (!('$value' in child)) {
    walkColourTokens(child, childPath, resolved);
  }
}

/** Recursively walk a DTCG token tree, resolving colour leaves. */
function walkColourTokens(
  node: DtcgTokenTree,
  pathSegments: readonly string[],
  resolved: Map<string, string>,
): void {
  for (const key in node) {
    if (!Object.hasOwn(node, key) || key.startsWith('$')) {
      continue;
    }

    visitChild(node[key], [...pathSegments, key], resolved);
  }
}

/**
 * Resolve all colour tokens in a merged DTCG token tree to final hex values.
 *
 * @remarks
 * The tier hierarchy (palette → semantic → component) guarantees single-pass
 * resolution when the tree is walked in insertion order.
 *
 * @param tokenTree - A merged token tree containing palette, semantic, and
 *   optionally component tiers
 * @returns Map from dot-separated token path to resolved hex colour string
 */
export function resolveTokenTreeToHex(tokenTree: DtcgTokenTree): ReadonlyMap<string, string> {
  const resolved = new Map<string, string>();

  walkColourTokens(tokenTree, [], resolved);

  return resolved;
}
