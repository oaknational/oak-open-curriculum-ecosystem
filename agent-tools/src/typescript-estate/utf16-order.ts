/**
 * Compare JavaScript strings by their native UTF-16 code-unit order.
 *
 * This deliberately performs no locale collation, Unicode normalisation, or
 * scalar-value decoding. It is the repository review contract's canonical
 * ordering primitive for paths, identifiers, and emitted string fields.
 */
export function compareUtf16(left: string, right: string): -1 | 0 | 1 {
  if (left < right) {
    return -1;
  }
  return left > right ? 1 : 0;
}
