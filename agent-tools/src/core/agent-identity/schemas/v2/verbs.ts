/**
 * Shared middle-column verb pool for the v2 noun-verb-noun naming schema.
 *
 * @remarks
 * Theme-neutral by design: the middle column is the low-salience slot, so one
 * shared pool serves every theme. Third-person singular present tense makes
 * each name read as a micro-sentence ("Comet rides Night"); the 4-7 character
 * budget keeps the middle word visually light between the title-cased edge
 * nouns. Registered v2 material is digest-pinned at assembly: edits after
 * activation require a new schema version.
 */
export const V2_SHARED_VERBS = [
  'rides',
  'hunts',
  'weaves',
  'mends',
  'guards',
  'herds',
  'stirs',
  'calls',
  'tracks',
  'holds',
  'lifts',
  'turns',
  'spins',
  'wakes',
  'seeks',
  'binds',
] as const;
