import type {
  SearchLessonResult,
  SearchSequenceResult,
  SearchUnitResult,
} from '@oaknational/oak-curriculum-sdk';
import type { SearchResultItem } from './SearchResults.schemas';

function isLessonResult(rec: SearchResultItem): rec is SearchLessonResult {
  return 'lesson' in rec;
}

function isUnitResult(rec: SearchResultItem): rec is SearchUnitResult {
  return 'unit' in rec;
}

function isSequenceResult(rec: SearchResultItem): rec is SearchSequenceResult {
  return 'sequence' in rec;
}

type Resolver<T> = (item: SearchResultItem) => T | null;

const TITLE_RESOLVERS: Resolver<string>[] = [
  (item) => (isLessonResult(item) ? (item.lesson?.lesson_title ?? null) : null),
  (item) => (isUnitResult(item) ? (item.unit?.unit_title ?? null) : null),
  (item) => (isSequenceResult(item) ? (item.sequence?.sequence_title ?? null) : null),
];

const SUBJECT_RESOLVERS: Resolver<string>[] = [
  (item) => (isLessonResult(item) ? (item.lesson?.subject_slug ?? null) : null),
  (item) => (isUnitResult(item) ? (item.unit?.subject_slug ?? null) : null),
  (item) => (isSequenceResult(item) ? (item.sequence?.subject_slug ?? null) : null),
];

const KEY_STAGE_RESOLVERS: Resolver<string>[] = [
  (item) => (isLessonResult(item) ? (item.lesson?.key_stage ?? null) : null),
  (item) => (isUnitResult(item) ? (item.unit?.key_stage ?? null) : null),
];

function resolveValue(
  item: SearchResultItem,
  resolvers: Resolver<string>[],
  fallback: () => string,
): string {
  for (const resolve of resolvers) {
    const value = resolve(item);
    if (value) {
      return value;
    }
  }
  return fallback();
}

export function extractTitle(rec: SearchResultItem): string {
  return resolveValue(rec, TITLE_RESOLVERS, () => rec.id);
}

export function extractSubject(rec: SearchResultItem): string {
  return resolveValue(rec, SUBJECT_RESOLVERS, () => '');
}

export function extractKeyStage(rec: SearchResultItem): string {
  return resolveValue(rec, KEY_STAGE_RESOLVERS, () => '');
}

export function extractHighlights(rec: SearchResultItem): string[] {
  return Array.isArray(rec.highlights) ? rec.highlights : [];
}
