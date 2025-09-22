import {
  describeKeyStageAllowed,
  describeSubjectAllowed,
  standardiseKeyStage,
  standardiseSubject,
} from '../types/generated/api-schema/mcp-tools/synonyms.js';
import { isPlainObject, typeSafeFromEntries } from '../types/helpers.js';

type Result<T> = { ok: true; value: T } | { ok: false; message: string };

export type NormaliseResult = Result<unknown>;

export function normaliseMcpArgs(value: unknown): NormaliseResult {
  if (Array.isArray(value)) {
    return normaliseArray(value);
  }
  if (isPlainObject(value)) {
    return normaliseObject(value);
  }
  return { ok: true, value };
}

function normaliseArray(values: readonly unknown[]): NormaliseResult {
  const next: unknown[] = [];
  for (const item of values) {
    const normalised = normaliseMcpArgs(item);
    if (!normalised.ok) {
      return normalised;
    }
    next.push(normalised.value);
  }
  return { ok: true, value: next };
}

function normaliseObject(value: object): NormaliseResult {
  const entries: [string, unknown][] = [];
  for (const key in value) {
    if (!Object.prototype.hasOwnProperty.call(value, key)) {
      continue;
    }
    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    const raw: unknown = descriptor?.value;
    const normalised = normaliseEntry(key, raw);
    if (!normalised.ok) {
      return normalised;
    }
    entries.push([key, normalised.value]);
  }

  return { ok: true, value: typeSafeFromEntries(entries) };
}

function normaliseEntry(key: string, raw: unknown): NormaliseResult {
  if (typeof raw === 'string') {
    return normaliseStringByKey(key, raw);
  }

  if (Array.isArray(raw) || isPlainObject(raw)) {
    return normaliseMcpArgs(raw);
  }

  return { ok: true, value: raw };
}

const SUBJECT_FIELD_NAMES = new Set(['subject', 'subjectSlug']);
const KEY_STAGE_FIELD_NAMES = new Set(['keyStage', 'keyStageSlug']);

function normaliseStringByKey(key: string, raw: string): Result<string> {
  const trimmed = raw.trim();
  if (trimmed.length === 0) {
    return { ok: true, value: trimmed };
  }

  if (SUBJECT_FIELD_NAMES.has(key)) {
    return toSubjectCanonical(trimmed);
  }

  if (KEY_STAGE_FIELD_NAMES.has(key)) {
    return toKeyStageCanonical(trimmed);
  }

  return { ok: true, value: trimmed };
}

function toSubjectCanonical(value: string): Result<string> {
  const canonical = standardiseSubject(value);
  if (canonical) {
    return { ok: true, value: canonical };
  }
  return {
    ok: false,
    message: `Unknown subject "${value}". Allowed subjects: ${describeSubjectAllowed()}`,
  };
}

function toKeyStageCanonical(value: string): Result<string> {
  const canonical = standardiseKeyStage(value);
  if (canonical) {
    return { ok: true, value: canonical };
  }
  return {
    ok: false,
    message: `Unknown key stage "${value}". Allowed key stages: ${describeKeyStageAllowed()}`,
  };
}
