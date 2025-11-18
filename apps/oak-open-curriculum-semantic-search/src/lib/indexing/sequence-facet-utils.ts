export type UnknownObject = Readonly<Record<string, unknown>>;

export function isUnknownObject(value: unknown): value is UnknownObject {
  return typeof value === 'object' && value !== null;
}

export function safeArray(value: unknown): readonly unknown[] {
  return Array.isArray(value) ? value : [];
}

export function safeString(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

export function ensureSequenceRecord(value: unknown, context: string): UnknownObject {
  if (!isUnknownObject(value)) {
    throw new Error(`Invalid ${context}: expected an object`);
  }
  return value;
}

export function requireSequenceString(record: UnknownObject, key: string, context: string): string {
  const value = safeString(record[key]);
  if (!value) {
    throw new Error(`Missing ${context}`);
  }
  return value;
}

export function readSequenceValue(record: UnknownObject, key: string): unknown {
  return record[key];
}

export interface SequenceKeyStageEntryRecord {
  readonly keyStageSlug: string;
  readonly keyStageTitle?: string;
}

export function isSequenceKeyStageEntryRecord(
  value: unknown,
): value is SequenceKeyStageEntryRecord {
  if (!isUnknownObject(value)) {
    return false;
  }
  const slug = safeString(value.keyStageSlug);
  if (!slug) {
    return false;
  }
  const title = value.keyStageTitle;
  return typeof title === 'string' || typeof title === 'undefined';
}

export function findKeyStageEntry(
  sequence: UnknownObject,
  keyStage: string,
): SequenceKeyStageEntryRecord | undefined {
  const keyStagesValue = readSequenceValue(sequence, 'keyStages');
  const entries = Array.isArray(keyStagesValue) ? keyStagesValue : [];
  for (const candidate of entries) {
    if (isSequenceKeyStageEntryRecord(candidate) && candidate.keyStageSlug === keyStage) {
      return candidate;
    }
  }
  return undefined;
}

export function normaliseSequenceYears(sequence: UnknownObject): string[] {
  const yearsValue = readSequenceValue(sequence, 'years');
  if (!Array.isArray(yearsValue)) {
    return [];
  }
  const unique = new Set<string>();
  for (const year of yearsValue) {
    unique.add(String(year));
  }
  return Array.from(unique).sort();
}
