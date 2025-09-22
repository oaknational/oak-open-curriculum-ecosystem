/**
 * GENERATED FILE - DO NOT EDIT
 *
 * Synonym maps for canonicalising MCP tool arguments.
 */

function normaliseSynonymKey(value: string): string {
  return value.trim().toLowerCase();
}

export const SUBJECT_CANONICALS = ['art', 'citizenship', 'computing', 'cooking-nutrition', 'design-technology', 'english', 'french', 'geography', 'german', 'history', 'maths', 'music', 'physical-education', 'religious-education', 'rshe-pshe', 'science', 'spanish'] as const;
export type SubjectCanonical = typeof SUBJECT_CANONICALS[number];

const SUBJECT_SYNONYM_MAP = new Map<string, SubjectCanonical>([
  ['art', 'art'],
  ['arts', 'art'],
  ['citizenship', 'citizenship'],
  ['citizenship education', 'citizenship'],
  ['civics', 'citizenship'],
  ['computer science', 'computing'],
  ['computing', 'computing'],
  ['cooking', 'cooking-nutrition'],
  ['cooking-nutrition', 'cooking-nutrition'],
  ['cs', 'computing'],
  ['d&t', 'design-technology'],
  ['design and technology', 'design-technology'],
  ['design technology', 'design-technology'],
  ['design-technology', 'design-technology'],
  ['dt', 'design-technology'],
  ['english', 'english'],
  ['english language', 'english'],
  ['english literature', 'english'],
  ['fine art', 'art'],
  ['food and nutrition', 'cooking-nutrition'],
  ['food tech', 'cooking-nutrition'],
  ['food technology', 'cooking-nutrition'],
  ['french', 'french'],
  ['french language', 'french'],
  ['general science', 'science'],
  ['geo', 'geography'],
  ['geography', 'geography'],
  ['german', 'german'],
  ['german language', 'german'],
  ['historical studies', 'history'],
  ['history', 'history'],
  ['ict', 'computing'],
  ['math', 'maths'],
  ['math.', 'maths'],
  ['mathematics', 'maths'],
  ['maths', 'maths'],
  ['music', 'music'],
  ['music education', 'music'],
  ['p.e.', 'physical-education'],
  ['pe', 'physical-education'],
  ['personal social health and economic education', 'rshe-pshe'],
  ['physical education', 'physical-education'],
  ['physical-education', 'physical-education'],
  ['pshe', 'rshe-pshe'],
  ['pshe education', 'rshe-pshe'],
  ['r.e.', 'religious-education'],
  ['re', 'religious-education'],
  ['relationships and sex education', 'rshe-pshe'],
  ['religion', 'religious-education'],
  ['religious studies', 'religious-education'],
  ['religious-education', 'religious-education'],
  ['rshe', 'rshe-pshe'],
  ['rshe education', 'rshe-pshe'],
  ['rshe-pshe', 'rshe-pshe'],
  ['sci', 'science'],
  ['science', 'science'],
  ['spanish', 'spanish'],
  ['spanish language', 'spanish'],
  ['visual arts', 'art'],
]);

export function standardiseSubject(value: string): SubjectCanonical | undefined {
  const key = normaliseSynonymKey(value);
  return SUBJECT_SYNONYM_MAP.get(key);
}

export function describeSubjectAllowed(): string {
  return SUBJECT_CANONICALS.join(', ');
}

export const KEY_STAGE_CANONICALS = ['ks1', 'ks2', 'ks3', 'ks4'] as const;
export type KeyStageCanonical = typeof KEY_STAGE_CANONICALS[number];

const KEY_STAGE_SYNONYM_MAP = new Map<string, KeyStageCanonical>([
  ['gcse', 'ks4'],
  ['key stage 1', 'ks1'],
  ['key stage 2', 'ks2'],
  ['key stage 3', 'ks3'],
  ['key stage 4', 'ks4'],
  ['key stage four', 'ks4'],
  ['key stage one', 'ks1'],
  ['key stage three', 'ks3'],
  ['key stage two', 'ks2'],
  ['key-stage-1', 'ks1'],
  ['key-stage-2', 'ks2'],
  ['key-stage-3', 'ks3'],
  ['key-stage-4', 'ks4'],
  ['ks 1', 'ks1'],
  ['ks 2', 'ks2'],
  ['ks 3', 'ks3'],
  ['ks 4', 'ks4'],
  ['ks-2', 'ks2'],
  ['ks1', 'ks1'],
  ['ks2', 'ks2'],
  ['ks3', 'ks3'],
  ['ks4', 'ks4'],
  ['primary', 'ks1'],
  ['secondary', 'ks3'],
]);

export function standardiseKeyStage(value: string): KeyStageCanonical | undefined {
  const key = normaliseSynonymKey(value);
  return KEY_STAGE_SYNONYM_MAP.get(key);
}

export function describeKeyStageAllowed(): string {
  return KEY_STAGE_CANONICALS.join(', ');
}
