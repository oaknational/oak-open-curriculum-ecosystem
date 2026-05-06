import { AERIAL_IDENTITY_WORD_GROUP } from './wordlists-aerial.js';
import { BOTANICAL_IDENTITY_WORD_GROUP } from './wordlists-botanical.js';
import { CELESTIAL_IDENTITY_WORD_GROUP } from './wordlists-celestial.js';
import { EMBER_IDENTITY_WORD_GROUP } from './wordlists-ember.js';
import { MARITIME_IDENTITY_WORD_GROUP } from './wordlists-maritime.js';
import { NOCTURNAL_IDENTITY_WORD_GROUP } from './wordlists-nocturnal.js';

/**
 * Approved vocabulary group used by the identity derivation hash router.
 */
interface IdentityWordGroup {
  /** Stable group key emitted in derived identity results. */
  readonly group: string;
  /** Adjective slot candidates for this group. */
  readonly adjectives: readonly string[];
  /** Verb slot candidates for this group. */
  readonly verbs: readonly string[];
  /** Noun slot candidates for this group. */
  readonly nouns: readonly string[];
}

/**
 * Owner-approved themed word groups for deterministic agent names.
 *
 * @remarks
 * The groups are deliberately themed so generated identities read as coherent
 * names rather than unrelated random tokens.
 */
export const IDENTITY_WORD_GROUPS = [
  CELESTIAL_IDENTITY_WORD_GROUP,
  MARITIME_IDENTITY_WORD_GROUP,
  BOTANICAL_IDENTITY_WORD_GROUP,
  EMBER_IDENTITY_WORD_GROUP,
  AERIAL_IDENTITY_WORD_GROUP,
  NOCTURNAL_IDENTITY_WORD_GROUP,
] as const satisfies readonly IdentityWordGroup[];

export type IdentityGroup = (typeof IDENTITY_WORD_GROUPS)[number]['group'];

export type IdentityAdjective = (typeof IDENTITY_WORD_GROUPS)[number]['adjectives'][number];

export type IdentityVerb = (typeof IDENTITY_WORD_GROUPS)[number]['verbs'][number];

export type IdentityNoun = (typeof IDENTITY_WORD_GROUPS)[number]['nouns'][number];
