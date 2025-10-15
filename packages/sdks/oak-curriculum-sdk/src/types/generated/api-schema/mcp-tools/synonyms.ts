/**
 * GENERATED FILE - DO NOT EDIT
 *
 * Synonym maps for canonicalising MCP tool arguments.
 */

function normaliseSynonymKey(value: string): string {
  return value.trim().toLowerCase();
}

export const SUBJECT_CANONICALS = [] as const;
export type SubjectCanonical = typeof SUBJECT_CANONICALS[number];

const SUBJECT_SYNONYM_MAP = new Map<string, SubjectCanonical>([

]);

export function standardiseSubject(value: string): SubjectCanonical | undefined {
  const key = normaliseSynonymKey(value);
  SUBJECT_SYNONYM_MAP.get(key);
}

export function describeSubjectAllowed(): string {
  return SUBJECT_CANONICALS.join(', ');
}

export const KEY_STAGE_CANONICALS = [] as const;
export type KeyStageCanonical = typeof KEY_STAGE_CANONICALS[number];

const KEY_STAGE_SYNONYM_MAP = new Map<string, KeyStageCanonical>([

]);

export function standardiseKeyStage(value: string): KeyStageCanonical | undefined {
  const key = normaliseSynonymKey(value);
  KEY_STAGE_SYNONYM_MAP.get(key);
}

export function describeKeyStageAllowed(): string {
  return KEY_STAGE_CANONICALS.join(', ');
}
