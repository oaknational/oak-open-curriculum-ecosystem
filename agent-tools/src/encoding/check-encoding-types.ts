/**
 * Shared types and severity model for the repository encoding scanner.
 *
 * @packageDocumentation
 */

/** Severity tiers for an encoding finding. */
export type EncodingSeverity = 'critical' | 'notable' | 'informational';

/** Category of an encoding finding. */
export type EncodingCategory =
  | 'invalid-utf8'
  | 'utf8-bom'
  | 'utf16-utf32-bom'
  | 'bidi-control'
  | 'c0-control'
  | 'c1-control'
  | 'replacement-char'
  | 'zero-width'
  | 'unusual-space'
  | 'non-nfc'
  | 'typographic';

/** Severity of each finding category. */
export const SEVERITY_BY_CATEGORY: Readonly<Record<EncodingCategory, EncodingSeverity>> = {
  'invalid-utf8': 'critical',
  'utf8-bom': 'critical',
  'utf16-utf32-bom': 'critical',
  'bidi-control': 'critical',
  'c0-control': 'critical',
  'c1-control': 'critical',
  'replacement-char': 'critical',
  'zero-width': 'notable',
  'unusual-space': 'notable',
  'non-nfc': 'notable',
  typographic: 'informational',
};

/** Severity tiers from most to least severe; used for `--fail-on` thresholds. */
export const SEVERITY_ORDER: readonly EncodingSeverity[] = ['critical', 'notable', 'informational'];

/** Classification of a single codepoint, or `null` when it is unremarkable. */
export interface CodepointClass {
  readonly category: EncodingCategory;
  readonly name: string;
}

/** Where a strict UTF-8 decode first fails. */
export interface InvalidUtf8 {
  /** Byte offset of the first invalid byte. */
  readonly bytePosition: number;
  /** Hex dump of up to four bytes from {@link bytePosition}. */
  readonly badBytes: string;
}

/** Kind of byte-order mark detected at the start of a buffer. */
export type BomKind = 'utf8' | 'utf16-utf32';

/** One non-standard codepoint occurrence within a file. */
export interface CodepointFinding {
  readonly category: EncodingCategory;
  /** `U+XXXX` form. */
  readonly codepoint: string;
  readonly name: string;
  readonly line: number;
  readonly column: number;
}

/** The full encoding report for one file. */
export interface FileEncodingReport {
  readonly path: string;
  readonly isBinary: boolean;
  readonly bom: BomKind | null;
  readonly invalidUtf8: InvalidUtf8 | null;
  /** True when valid UTF-8 text is not in Normalization Form C. */
  readonly notNfc: boolean;
  readonly findings: readonly CodepointFinding[];
}
