import { digestSeedForRouting, readUInt32BigEndian } from './hash.js';
import {
  ACTIVE_NAMING_SCHEMA_ID,
  NAMING_SCHEMAS,
  type NamingSchema,
  type NamingSchemaId,
} from './schema-registry.js';

/**
 * Result produced when a seed is routed through a registered naming schema.
 */
export interface DerivedIdentityResult {
  /** Discriminant for derived identity results. */
  readonly kind: 'derived';
  /** Naming-schema era that produced this name. */
  readonly namingSchemaVersion: NamingSchemaId;
  /** The selected themed word group key. */
  readonly group: string;
  /** Selected words in column order, lowercase. */
  readonly words: readonly string[];
  /** Human-readable display form rendered per the schema's column casing. */
  readonly displayName: string;
  /** Lowercase kebab-case slug form, for example "harrier-weaves-stratosphere". */
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
  /** Name provenance marker: overrides bypass every registered schema. */
  readonly namingSchemaVersion: 'override';
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
   * receive fake schema-derived word values.
   */
  readonly override?: string;
  /**
   * Registered naming schema to derive under.
   *
   * @remarks
   * Defaults to the active schema. Passing a historical schema id lets
   * callers re-derive the name a seed produced under an earlier era.
   */
  readonly schemaId?: NamingSchemaId;
}

/**
 * Derive a deterministic agent identity from a stable seed.
 *
 * @param seed - Stable seed, usually provided by an agent harness session id.
 * @param options - Optional override and schema-selection controls.
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
    return deriveOverrideIdentity(digest.hex, options.override);
  }

  const schema = NAMING_SCHEMAS[options.schemaId ?? ACTIVE_NAMING_SCHEMA_ID];
  const group = selectByDigest(schema.groups, digest.bytes, 0);
  const selections = schema.columnCasing.map((casing, columnIndex) => {
    const word = selectColumnWord(group, columnIndex, digest.bytes);
    return {
      word,
      rendered: casing === 'title' ? capitalise(word) : word,
    };
  });
  const words = selections.map((selection) => selection.word);

  return {
    kind: 'derived',
    namingSchemaVersion: schema.id,
    group: group.group,
    words,
    displayName: selections.map((selection) => selection.rendered).join(' '),
    slug: words.join('-'),
    seedDigest: digest.hex,
  };
}

function deriveOverrideIdentity(seedDigest: string, overrideValue: string): OverrideIdentityResult {
  const override = normaliseOverride(overrideValue);
  return {
    kind: 'override',
    namingSchemaVersion: 'override',
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
  const override = overrideValue.trim().replaceAll(/\s+/gu, ' ');
  if (override.length === 0) {
    throw new Error('override must be a non-empty string');
  }
  if (slugifyDisplayName(override).length === 0) {
    throw new Error('override must contain at least one ASCII letter or digit');
  }
  return override;
}

function selectColumnWord(
  group: NamingSchema['groups'][number],
  columnIndex: number,
  digestBytes: readonly number[],
): string {
  const column = group.columns[columnIndex];
  if (column === undefined) {
    throw new Error(
      `naming schema group "${group.group}" has no column at index ${columnIndex.toString()}`,
    );
  }
  return selectByDigest(column, digestBytes, 4 * (columnIndex + 1));
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
    .replaceAll(/[^a-z0-9]+/gu, '-')
    .replaceAll(/^-+|-+$/gu, '');
}
