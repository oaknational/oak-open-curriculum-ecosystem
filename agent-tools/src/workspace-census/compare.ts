/**
 * Deterministic UTF-16 code-unit ordering for the census's
 * byte-authoritative artefacts. `localeCompare` collates via the host's
 * ICU/locale configuration, so two machines can render byte-different
 * (reordered) artefacts from identical inputs — spurious drift once
 * parity is byte-exact.
 */
export function compareStrings(a: string, b: string): number {
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
}
