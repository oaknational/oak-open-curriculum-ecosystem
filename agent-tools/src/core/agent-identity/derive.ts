import { digestSeedForRouting, readUInt32BigEndian } from './hash.js';
import {
  IDENTITY_WORD_GROUPS,
  type IdentityAdjective,
  type IdentityGroup,
  type IdentityNoun,
  type IdentityVerb,
} from './wordlists.js';

/**
 * Result produced when a seed is routed through the approved wordlists.
 */
export interface DerivedIdentityResult {
  /** Discriminant for derived identity results. */
  readonly kind: 'derived';
  /** The selected themed word group. */
  readonly group: IdentityGroup;
  /** The selected adjective slot. */
  readonly adjective: IdentityAdjective;
  /** The selected verb slot. */
  readonly verb: IdentityVerb;
  /** The selected noun slot. */
  readonly noun: IdentityNoun;
  /** Human-readable display form, for example "Lunar Orbiting Comet". */
  readonly displayName: string;
  /** Lowercase kebab-case slug form, for example "lunar-orbiting-comet". */
  readonly slug: string;
  /** SHA-256 digest of the normalised seed. */
  readonly seedDigest: string;
}

/**
 * Result produced when an explicit operator override bypasses derivation.
 */
export interface OverrideIdentityResult {
  /** Discriminant for override identity results. */
  readonly kind: 'override';
  /** Human-readable override display form after whitespace normalisation. */
  readonly displayName: string;
  /** Lowercase kebab-case slug form derived from the override display name. */
  readonly slug: string;
  /** SHA-256 digest of the normalised seed for audit traceability. */
  readonly seedDigest: string;
  /** The normalised override value that bypassed wordlist derivation. */
  readonly override: string;
}

/**
 * Identity derivation result.
 */
export type IdentityResult = DerivedIdentityResult | OverrideIdentityResult;

/**
 * Options for deterministic agent identity derivation.
 */
export interface DeriveIdentityOptions {
  /**
   * Explicit operator override.
   *
   * @remarks
   * Overrides are represented as their own result variant so callers never
   * receive fake `group`, `adjective`, `verb`, or `noun` values.
   */
  readonly override?: string;
}

/**
 * Derive a deterministic agent identity from a stable seed.
 *
 * @param seed - Stable seed, usually provided by an agent harness session id.
 * @param options - Optional override controls.
 * @returns Derived or override identity result.
 *
 * @example
 * ```ts
 * const identity = deriveIdentity("session-123");
 * if (identity.kind === "derived") {
 *   console.log(identity.displayName);
 * }
 * ```
 *
 * @example
 * ```ts
 * const identity = deriveIdentity("session-123", {
 *   override: "Frolicking Toast",
 * });
 * console.log(identity.displayName); // "Frolicking Toast"
 * ```
 */
export function deriveIdentity(seed: string, options: DeriveIdentityOptions = {}): IdentityResult {
  const normalisedSeed = normaliseSeed(seed);
  const digest = digestSeedForRouting(normalisedSeed);

  if (options.override !== undefined) {
    return deriveOverrideIdentity(normalisedSeed, digest.hex, options.override);
  }

  const group = selectByDigest(IDENTITY_WORD_GROUPS, digest.bytes, 0);
  const adjective = selectByDigest(group.adjectives, digest.bytes, 4);
  const verb = selectByDigest(group.verbs, digest.bytes, 8);
  const noun = selectByDigest(group.nouns, digest.bytes, 12);
  const displayName = [adjective, verb, noun].map(capitalise).join(' ');

  return {
    kind: 'derived',
    group: group.group,
    adjective,
    verb,
    noun,
    displayName,
    slug: [adjective, verb, noun].join('-'),
    seedDigest: digest.hex,
  };
}

function deriveOverrideIdentity(
  _seed: string,
  seedDigest: string,
  overrideValue: string,
): OverrideIdentityResult {
  const override = normaliseOverride(overrideValue);
  return {
    kind: 'override',
    displayName: override,
    slug: slugifyDisplayName(override),
    seedDigest,
    override,
  };
}

function normaliseSeed(seed: string): string {
  const normalisedSeed = seed.trim();
  if (normalisedSeed.length === 0) {
    throw new Error('seed must be a non-empty string');
  }
  return normalisedSeed;
}

function normaliseOverride(overrideValue: string): string {
  const override = overrideValue.trim().replace(/\s+/gu, ' ');
  if (override.length === 0) {
    throw new Error('override must be a non-empty string');
  }
  if (slugifyDisplayName(override).length === 0) {
    throw new Error('override must contain at least one ASCII letter or digit');
  }
  return override;
}

function selectByDigest<TValue>(
  values: readonly TValue[],
  digestBytes: readonly number[],
  byteOffset: number,
): TValue {
  const index = readUInt32BigEndian(digestBytes, byteOffset) % values.length;
  const value = values[index];
  if (value === undefined) {
    throw new Error(`identity wordlist selection failed at index ${index.toString()}`);
  }
  return value;
}

function capitalise(value: string): string {
  const first = value[0];
  if (first === undefined) {
    return value;
  }
  return `${first.toUpperCase()}${value.slice(1)}`;
}

function slugifyDisplayName(displayName: string): string {
  return displayName
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, '-')
    .replace(/^-+|-+$/gu, '');
}
