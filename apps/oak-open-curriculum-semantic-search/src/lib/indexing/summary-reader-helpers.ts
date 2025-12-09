/**
 * Summary reader helpers for extracting data from lesson and unit summaries.
 *
 * @module summary-reader-helpers
 */

import {
  ensureRecord,
  safeString,
  readUnknownField,
  requireStringField,
} from './extraction-primitives';

export interface UnitSummaryIdentifiers {
  readonly unitSlug: string;
  readonly unitTitle: string;
  readonly canonicalUrl: string;
}

/** Resolves unit summary identifiers. */
export function resolveUnitSummaryIdentifiers(summary: unknown): UnitSummaryIdentifiers {
  const record = ensureRecord(summary, 'unit summary');
  const unitSlug = requireStringField(record, 'unitSlug', 'unit summary slug');
  const unitTitle = requireStringField(record, 'unitTitle', `unit summary ${unitSlug} title`);
  const canonicalUrl = requireStringField(
    record,
    'canonicalUrl',
    `canonical URL for unit ${unitSlug}`,
  );
  return { unitSlug, unitTitle, canonicalUrl };
}

export interface LessonSummaryIdentifiers {
  readonly unitSlug: string;
  readonly unitTitle: string;
  readonly canonicalUrl: string;
}

/** Resolves lesson summary identifiers. */
export function resolveLessonSummaryIdentifiers(summary: unknown): LessonSummaryIdentifiers {
  const record = ensureRecord(summary, 'lesson summary');
  const unitSlug = requireStringField(record, 'unitSlug', 'lesson summary unit slug');
  const unitTitle = requireStringField(
    record,
    'unitTitle',
    `lesson summary ${unitSlug} unit title`,
  );
  const canonicalUrl = requireStringField(
    record,
    'canonicalUrl',
    `canonical URL for lesson in unit ${unitSlug}`,
  );
  return { unitSlug, unitTitle, canonicalUrl };
}

/** Reads a value from unit summary. */
export function readUnitSummaryValue(summary: unknown, key: string): unknown {
  return readUnknownField(ensureRecord(summary, 'unit summary'), key);
}

/** Reads a value from lesson summary. */
export function readLessonSummaryValue(summary: unknown, key: string): unknown {
  return readUnknownField(ensureRecord(summary, 'lesson summary'), key);
}

/** Reads string from unit summary. */
export function readUnitSummaryString(summary: unknown, key: string): string | undefined {
  return safeString(readUnitSummaryValue(summary, key));
}

/** Requires string from unit summary. */
export function expectUnitSummaryString(summary: unknown, key: string, context: string): string {
  const value = readUnitSummaryString(summary, key);
  if (!value) {
    throw new Error(`Missing ${context}`);
  }
  return value;
}

/** Reads string from lesson summary. */
export function readLessonSummaryString(summary: unknown, key: string): string | undefined {
  return safeString(readLessonSummaryValue(summary, key));
}

/** Requires string from lesson summary. */
export function expectLessonSummaryString(summary: unknown, key: string, context: string): string {
  const value = readLessonSummaryString(summary, key);
  if (!value) {
    throw new Error(`Missing ${context}`);
  }
  return value;
}
