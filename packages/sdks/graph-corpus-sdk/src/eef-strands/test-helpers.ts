/**
 * Test helpers for the EEF strands module: the leaf walk the markdown
 * projection's tests use to prove the product contract stated in
 * `./eef-strand-markdown-sections.ts` — every rendered line is corpus text or
 * a fixed structural label — from the other side: every corpus value outside
 * a declared omission set appears in the rendering. The walk derives its
 * expectations from the corpus itself rather than pinning copies of it.
 */
import { typeSafeEntries } from '@oaknational/type-helpers';

/** The value shapes the fixed `as const` corpus is built from. */
export type CorpusValue =
  | string
  | number
  | boolean
  | null
  | readonly CorpusValue[]
  | { readonly [key: string]: CorpusValue };

function isCorpusArray(value: CorpusValue): value is readonly CorpusValue[] {
  return Array.isArray(value);
}

/**
 * Every string and number leaf reachable from `value`, as strings, skipping
 * the subtrees under any key in `omittedKeys`.
 *
 * @param value - The corpus subtree to walk.
 * @param omittedKeys - Keys whose subtrees are not walked.
 * @returns The leaf values in walk order.
 */
export function leafValues(
  value: CorpusValue,
  omittedKeys: ReadonlySet<string>,
): readonly string[] {
  if (typeof value === 'string' || typeof value === 'number') {
    return [String(value)];
  }
  if (typeof value === 'boolean' || value === null) {
    return [];
  }
  if (isCorpusArray(value)) {
    return value.flatMap((item) => leafValues(item, omittedKeys));
  }
  return typeSafeEntries(value).flatMap(([key, item]) =>
    omittedKeys.has(key) ? [] : leafValues(item, omittedKeys),
  );
}
