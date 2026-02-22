/**
 * Fixture builders for browse and explore widget test data.
 *
 * Browse fixtures use SDK `SequenceFacet` types.
 * Explore fixtures use SDK search index document types
 * to catch schema drift at build time.
 *
 * @see ./fixture-builder.ts - Search and suggest fixture builders
 */

import type {
  SearchLessonsIndexDoc,
  SearchUnitsIndexDoc,
  SearchThreadIndexDoc,
  SequenceFacet,
} from '@oaknational/curriculum-sdk/public/search';

import { type WrapperFields, buildWrapper } from './fixture-builder.js';

// ── Browse ──

interface BrowseFixtureData {
  readonly facets: { readonly sequences: readonly SequenceFacet[] };
  readonly filters: { readonly subject?: string };
}

export function buildBrowseFixture(
  data: BrowseFixtureData,
  summary?: string,
  status?: string,
): BrowseFixtureData & WrapperFields {
  return { ...data, ...buildWrapper(summary, status) };
}

// ── Explore ──

interface ExploreScopeOk<T> {
  readonly ok: true;
  readonly data: {
    readonly scope: string;
    readonly total: number;
    readonly took: number;
    readonly results: readonly T[];
  };
}

interface ExploreScopeErr {
  readonly ok: false;
  readonly error: string;
}

type ExploreHit<T> = {
  readonly id: string;
  readonly rankScore: number;
  readonly highlights: readonly string[];
} & T;

type LessonHit = ExploreHit<{
  readonly lesson: Pick<
    SearchLessonsIndexDoc,
    'lesson_title' | 'lesson_slug' | 'subject_slug' | 'key_stage' | 'lesson_url'
  >;
}>;

type UnitHit = ExploreHit<{
  readonly unit: Pick<
    SearchUnitsIndexDoc,
    'unit_title' | 'unit_slug' | 'subject_slug' | 'key_stage' | 'unit_url'
  >;
}>;

type ThreadHit = ExploreHit<{
  readonly thread: Pick<
    SearchThreadIndexDoc,
    'thread_title' | 'thread_slug' | 'subject_slugs' | 'unit_count' | 'thread_url'
  >;
}>;

interface ExploreFixtureData {
  readonly topic: string;
  readonly lessons: ExploreScopeOk<LessonHit> | ExploreScopeErr;
  readonly units: ExploreScopeOk<UnitHit> | ExploreScopeErr;
  readonly threads: ExploreScopeOk<ThreadHit> | ExploreScopeErr;
  readonly totals: {
    readonly lessonTotal: number;
    readonly unitTotal: number;
    readonly threadTotal: number;
  };
}

export function buildExploreFixture(
  data: ExploreFixtureData,
  summary?: string,
  status?: string,
): ExploreFixtureData & WrapperFields {
  return { ...data, ...buildWrapper(summary, status) };
}
