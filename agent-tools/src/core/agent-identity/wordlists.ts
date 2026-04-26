/**
 * Wordlist data for deterministic agent identity derivation.
 *
 * @remarks
 * The groups are deliberately themed so generated identities read as coherent
 * names rather than unrelated random tokens. The initial vocabulary was
 * owner-approved during Phase 0 of the agent identity derivation plan.
 */

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
 */
export const IDENTITY_WORD_GROUPS = [
  {
    group: 'celestial',
    adjectives: [
      'celestial',
      'cosmic',
      'stellar',
      'lunar',
      'solar',
      'ethereal',
      'nebulous',
      'galactic',
      'twilit',
      'dawnlit',
      'starlit',
      'moonlit',
      'sunlit',
      'gilded',
      'radiant',
      'luminous',
      'prismatic',
      'glittering',
      'iridescent',
      'opalescent',
    ],
    verbs: [
      'drifting',
      'orbiting',
      'soaring',
      'gliding',
      'ascending',
      'glowing',
      'illuminating',
      'eclipsing',
      'transiting',
      'waning',
      'waxing',
      'dancing',
      'weaving',
      'threading',
      'scattering',
      'cascading',
      'beaming',
      'shimmering',
      'twinkling',
      'glimmering',
    ],
    nouns: [
      'nebula',
      'comet',
      'quasar',
      'galaxy',
      'supernova',
      'asteroid',
      'meteor',
      'planet',
      'star',
      'moon',
      'sun',
      'eclipse',
      'satellite',
      'constellation',
      'orbit',
      'twilight',
      'dawn',
      'dusk',
      'aurora',
      'prism',
    ],
  },
  {
    group: 'maritime',
    adjectives: [
      'oceanic',
      'tidal',
      'coastal',
      'briny',
      'deep',
      'abyssal',
      'pelagic',
      'salty',
      'foamy',
      'misty',
      'squally',
      'stormy',
      'glassy',
      'choppy',
      'pearly',
      'riverine',
      'lacustrine',
      'estuarine',
      'seaworthy',
      'breezy',
    ],
    verbs: [
      'sailing',
      'navigating',
      'charting',
      'plumbing',
      'fathoming',
      'surfing',
      'cresting',
      'rolling',
      'lapping',
      'washing',
      'ebbing',
      'flowing',
      'anchoring',
      'mooring',
      'berthing',
      'fishing',
      'diving',
      'snorkelling',
      'swimming',
      'drifting',
    ],
    nouns: [
      'harbor',
      'lighthouse',
      'anchor',
      'sail',
      'mast',
      'prow',
      'stern',
      'hull',
      'rudder',
      'compass',
      'sextant',
      'beacon',
      'jetty',
      'pier',
      'dock',
      'lagoon',
      'atoll',
      'reef',
      'archipelago',
      'fjord',
    ],
  },
  {
    group: 'botanical',
    adjectives: [
      'verdant',
      'lush',
      'mossy',
      'leafy',
      'ferny',
      'sylvan',
      'woodland',
      'arboreal',
      'evergreen',
      'deciduous',
      'fragrant',
      'dewy',
      'shaded',
      'wooded',
      'blooming',
      'fruited',
      'fronded',
      'gnarled',
      'twigged',
      'vining',
    ],
    verbs: [
      'growing',
      'sprouting',
      'blossoming',
      'branching',
      'flowering',
      'ripening',
      'swaying',
      'rustling',
      'whispering',
      'bending',
      'climbing',
      'twining',
      'creeping',
      'spreading',
      'sheltering',
      'shedding',
      'regrowing',
      'budding',
      'fruiting',
      'foraging',
    ],
    nouns: [
      'grove',
      'copse',
      'glade',
      'meadow',
      'thicket',
      'canopy',
      'sapling',
      'fern',
      'moss',
      'bark',
      'leaf',
      'branch',
      'root',
      'blossom',
      'petal',
      'stamen',
      'seed',
      'pollen',
      'dew',
      'forest',
    ],
  },
] as const satisfies readonly IdentityWordGroup[];

export type IdentityGroup = (typeof IDENTITY_WORD_GROUPS)[number]['group'];

export type IdentityAdjective = (typeof IDENTITY_WORD_GROUPS)[number]['adjectives'][number];

export type IdentityVerb = (typeof IDENTITY_WORD_GROUPS)[number]['verbs'][number];

export type IdentityNoun = (typeof IDENTITY_WORD_GROUPS)[number]['nouns'][number];
