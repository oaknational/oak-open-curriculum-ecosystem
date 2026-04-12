/**
 * Core DTCG token tree types.
 *
 * Leaf module with zero dependencies — extracted to break the circular
 * dependency between `index.ts` and `contrast-resolve.ts`.
 *
 * @packageDocumentation
 */

/** Leaf node in a DTCG token tree (has `$value`). */
export interface DtcgTokenLeaf {
  readonly $type?: string;
  readonly $value: boolean | number | string;
  readonly $description?: string;
}

/** Recursive DTCG token tree structure (groups and leaves). */
export interface DtcgTokenTree {
  readonly $description?: string;
  readonly [key: string]: DtcgTokenLeaf | DtcgTokenTree | string | undefined;
}
