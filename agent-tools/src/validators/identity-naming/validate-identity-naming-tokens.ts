/**
 * The forbidden-token vocabulary and scanning half of the identity-naming
 * validator: WHAT is forbidden and HOW occurrences are found and counted.
 *
 * @remarks
 * Part of the PDS identity-replacement enforcement (plan
 * `public-digital-service-identity`, owner-ratified 2026-08-03): the outgoing
 * counter-identity's name — and its initialism — must not occur in any
 * git-tracked file, contents or paths. The census/ratchet contract that
 * consumes these counts lives in the sibling module
 * `validate-identity-naming-census.ts`; this module owns only the token
 * vocabulary and the pure scanning primitives.
 *
 * The forbidden tokens are built by string construction so this gate never
 * contains its own target as a literal (`.agent/directives/principles.md`
 * §"Never weaken a gate to solve a testing problem" names string construction
 * as the sanctioned mechanism). The outgoing-name leg matches
 * case-insensitively — which also catches the demonym and possessive forms as
 * substrings — using the non-locale `toLowerCase` (the token is pure ASCII;
 * locale-sensitive folding is a correctness trap). The initialism leg matches
 * CASE-SENSITIVELY (upper and lower forms exactly), so mixed-case base64
 * payloads in captured studio HTML can never false-positive.
 *
 * @packageDocumentation
 */

/**
 * The outgoing identity's name, string-constructed (never a literal — see the
 * module remarks). Lowercase canonical form for the case-insensitive leg.
 */
const OUTGOING_NAME: string = ['free', 'donia'].join('');

/**
 * The outgoing initialism, upper form, string-constructed. Matched
 * case-sensitively; mixed-case sequences (base64 payloads) never match.
 */
const OUTGOING_INITIALISM_UPPER: string = ['FD', 'SE'].join('');

/** The outgoing initialism, lower form, string-constructed (case-sensitive). */
const OUTGOING_INITIALISM_LOWER: string = ['fd', 'se'].join('');

/** Per-case-variant occurrence counts for one file and kind. */
export interface VariantCounts {
  /** Case-insensitive occurrences of the outgoing name (all casings pooled). */
  readonly name: number;
  /** Case-sensitive occurrences of the upper initialism. */
  readonly initialismUpper: number;
  /** Case-sensitive occurrences of the lower initialism. */
  readonly initialismLower: number;
}

/** A live occurrence, reported for navigation (never part of the contract). */
export interface TokenHit {
  readonly file: string;
  readonly kind: 'content' | 'path';
  readonly line: number;
  readonly column: number;
  readonly variant: 'name' | 'initialism-upper' | 'initialism-lower';
}

/** Count non-overlapping occurrences of `needle` in `haystack` (case-sensitive). */
function countOccurrences(haystack: string, needle: string): number {
  let count = 0;
  let index = haystack.indexOf(needle);
  while (index !== -1) {
    count += 1;
    index = haystack.indexOf(needle, index + needle.length);
  }
  return count;
}

/**
 * Count every forbidden-token occurrence in one text.
 *
 * @remarks
 * The name leg lowercases with the non-locale `toLowerCase` (the token is pure
 * ASCII; locale-sensitive folding is a correctness trap). The initialism legs
 * are exact-case.
 */
export function countVariants(text: string): VariantCounts {
  return {
    name: countOccurrences(text.toLowerCase(), OUTGOING_NAME),
    initialismUpper: countOccurrences(text, OUTGOING_INITIALISM_UPPER),
    initialismLower: countOccurrences(text, OUTGOING_INITIALISM_LOWER),
  };
}

/** True when any variant count is non-zero. */
export function hasAnyCount(counts: VariantCounts): boolean {
  return counts.name > 0 || counts.initialismUpper > 0 || counts.initialismLower > 0;
}

/**
 * Locate every occurrence in one file's content, for the navigation report.
 * Line/column are 1-indexed. Never part of the ratchet contract — the
 * contract is count-based precisely so unrelated line drift cannot break it;
 * these positions exist so a human can jump straight to each occurrence.
 */
export function findContentHits(file: string, content: string): TokenHit[] {
  const hits: TokenHit[] = [];
  content.split('\n').forEach((line, lineIndex) => {
    // Columns come from the lowercased line, so a code point whose lowercase
    // form has a different length (e.g. U+0130) shifts the name leg's column
    // relative to the original. Tolerated: these positions are navigation
    // only, never contract.
    const lower = line.toLowerCase();
    let index = lower.indexOf(OUTGOING_NAME);
    while (index !== -1) {
      hits.push({ file, kind: 'content', line: lineIndex + 1, column: index + 1, variant: 'name' });
      index = lower.indexOf(OUTGOING_NAME, index + OUTGOING_NAME.length);
    }
    for (const [needle, variant] of [
      [OUTGOING_INITIALISM_UPPER, 'initialism-upper'],
      [OUTGOING_INITIALISM_LOWER, 'initialism-lower'],
    ] as const) {
      let at = line.indexOf(needle);
      while (at !== -1) {
        hits.push({ file, kind: 'content', line: lineIndex + 1, column: at + 1, variant });
        at = line.indexOf(needle, at + needle.length);
      }
    }
  });
  return hits;
}
