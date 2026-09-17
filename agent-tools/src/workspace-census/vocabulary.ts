/**
 * The census's closed column vocabularies, fixed at authoring time so no
 * taxonomy is invented mid-census. Governing record:
 * `.agent/plans/delivery/workspace-classification-census.plan.md`.
 */

/**
 * The declared code-extension set for subject-source (iii). The plan
 * requires `.ts`/`.tsx`/`.js`/`.mjs`/`.cts`/`.mts`/`.sh` at minimum;
 * `.cjs` and `.jsx` are included so a CommonJS or JSX-only surface
 * cannot hide from the predicate.
 */
export const CODE_EXTENSIONS = [
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.mjs',
  '.cjs',
  '.cts',
  '.mts',
  '.sh',
] as const;

export const CLASSIFICATIONS = ['generic-foundation', 'mixed', 'oak-leaf'] as const;
export type Classification = (typeof CLASSIFICATIONS)[number];

/** The surface-isolation brief's own leakage taxonomy, as closed slugs. */
export const LEAKAGE_TYPES = [
  'names',
  'defaults',
  'emitted-surfaces',
  'telemetry-namespaces',
  'ownership-metadata',
  'domain-assumptions',
] as const;
export type LeakageType = (typeof LEAKAGE_TYPES)[number];

export const LEAKAGE_DEPTHS = ['docs-level', 'source-embedded-docs', 'runtime-emitted'] as const;
export type LeakageDepth = (typeof LEAKAGE_DEPTHS)[number];

export const TRANCHES = ['1', '2', '3', '4', '5', '6', 'none-assigned'] as const;
export type Tranche = (typeof TRANCHES)[number];

export const LICENCES = ['code-mit', 'content-ogl', 'brand-reserved'] as const;
export type Licence = (typeof LICENCES)[number];

export const EVIDENCE_KINDS = [
  'static-structure',
  'emitted-surface',
  'consumer-topology',
  'doctrine-record',
] as const;
export type EvidenceKind = (typeof EVIDENCE_KINDS)[number];

/** Membership test against a closed vocabulary, assertion-free. */
export function isInVocabulary<T extends string>(
  vocabulary: readonly T[],
  value: string,
): value is T {
  const entries: readonly string[] = vocabulary;
  return entries.includes(value);
}
