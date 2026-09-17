/**
 * Which specimen a token gets — the single decision that turns a list of
 * names into a page you can look at.
 *
 * A specimen is a real element with ONE standard property bound to the
 * token, so choosing a kind is choosing which property. Choosing wrong is
 * not a cosmetic slip: `inline-size: var(--quiz-pad)` where the token holds
 * a two-value padding renders a bar of the wrong length, silently and
 * confidently. So the last rule is `plain` — no specimen, value only — and
 * anything this table cannot place with confidence lands there rather than
 * being guessed at.
 *
 * The rules are a table rather than a chain of branches because the ORDER is
 * the interesting part and a table shows it: `$type` answers colour outright,
 * the name families answer the composites the export's literal-only `$type`
 * heuristic cannot type, and the remaining dimensions become measuring bars.
 */

/** How a token is shown APPLIED. The names are kebab-case because they are
 *  also class suffixes — `tok-paint--font-size` — so this union and the
 *  stylesheet cannot drift into two spellings of one kind. */
export type SpecimenKind =
  | 'colour'
  | 'shadow'
  | 'filter'
  | 'radius'
  | 'border'
  | 'length'
  | 'font'
  | 'family'
  | 'weight'
  | 'font-size'
  | 'leading'
  | 'tracking'
  | 'plain';

/** Kinds whose painted property RESOLVES something the custom property
 *  itself does not. A custom property's computed value is the token stream
 *  after `var()` substitution, so `light-dark()`, `color-mix()` and the
 *  shadow composites read back as expressions; the standard property that
 *  consumes them reports a used value. Everywhere else the custom property
 *  is already exact and a second read would add nothing. */
export const RESOLVED_PROPERTY: Partial<Record<SpecimenKind, string>> = {
  colour: 'background-color',
  shadow: 'box-shadow',
  filter: 'filter',
};

interface KindRule {
  readonly kind: SpecimenKind;
  readonly matches: (name: string, type: string | null) => boolean;
}

const KIND_RULES: readonly KindRule[] = [
  { kind: 'colour', matches: (_name, type) => type === 'color' },
  {
    kind: 'shadow',
    matches: (name) =>
      name.startsWith('--shadow-') || name === '--focus-ring' || name === '--focus-ring-inverted',
  },
  { kind: 'filter', matches: (name) => name.startsWith('--filter-') },
  { kind: 'radius', matches: (name) => name.startsWith('--radius-') || name.endsWith('-radius') },
  { kind: 'border', matches: (name) => name.startsWith('--border-solid-') },
  // The type ramp's composites are font shorthands; its `-min`/`-max`/
  // `-leading` slots are the unitless parts a brand tunes the curve with,
  // and belong with the numbers rather than with the type.
  {
    kind: 'font',
    matches: (name) => name.startsWith('--type-') && !/-(?:min|max|leading)$/.test(name),
  },
  {
    kind: 'family',
    matches: (name) =>
      name === '--font-sans' || name === '--font-mono' || name === '--font-display',
  },
  { kind: 'weight', matches: (_name, type) => type === 'fontWeight' },
  { kind: 'font-size', matches: (name) => name.startsWith('--font-size-') },
  { kind: 'leading', matches: (name) => name.startsWith('--leading-') },
  { kind: 'tracking', matches: (name) => name.startsWith('--tracking-') },
  { kind: 'length', matches: (_name, type) => type === 'dimension' },
];

/** The first rule that places this token, or `plain` when none does. */
export function specimenKind(name: string, type: string | null): SpecimenKind {
  return KIND_RULES.find((rule) => rule.matches(name, type))?.kind ?? 'plain';
}
