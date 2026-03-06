/**
 * Shared fixture builder for widget test data.
 *
 * Produces fixtures matching the exact shape delivered via
 * `window.openai.toolOutput` in the ChatGPT sandbox. All
 * fixture shapes flow from the SDK's search result types.
 *
 * @see ../../src/widget-script.ts - Widget getFullResults() logic
 * @see packages/sdks/oak-curriculum-sdk/src/mcp/universal-tool-shared.ts
 */

import type {
  SearchLessonsIndexDoc,
  SearchUnitsIndexDoc,
  SearchThreadIndexDoc,
  SearchSequenceIndexDoc,
  SearchSuggestionItem,
} from '@oaknational/sdk-codegen/search';

const OAK_CONTEXT_HINT =
  'This data comes from the Oak National Academy curriculum. ' +
  'Use it to provide accurate, curriculum-aligned educational information.';

export interface WrapperFields {
  readonly summary: string;
  readonly oakContextHint: string;
  readonly status?: string;
}

export function buildWrapper(summary?: string, status?: string): WrapperFields {
  const base = { summary: summary ?? 'Test fixture summary', oakContextHint: OAK_CONTEXT_HINT };
  if (status !== undefined) {
    return { ...base, status };
  }
  return base;
}

// ── Lesson scope ──

type RendererLessonFields = Pick<
  SearchLessonsIndexDoc,
  | 'lesson_title'
  | 'lesson_slug'
  | 'subject_slug'
  | 'subject_title'
  | 'key_stage'
  | 'key_stage_title'
  | 'lesson_url'
>;

interface SearchFixtureResult {
  readonly id: string;
  readonly rankScore: number;
  readonly lesson: RendererLessonFields;
  readonly highlights: readonly string[];
}

interface SearchFixtureData {
  readonly scope: string;
  readonly total: number;
  readonly took: number;
  readonly results: readonly SearchFixtureResult[];
}

export function buildSearchFixture(
  data: SearchFixtureData,
  summary?: string,
  status?: string,
): SearchFixtureData & WrapperFields {
  return { ...data, ...buildWrapper(summary, status) };
}

// ── Unit scope ──

type RendererUnitFields = Pick<
  SearchUnitsIndexDoc,
  | 'unit_title'
  | 'unit_slug'
  | 'subject_slug'
  | 'subject_title'
  | 'key_stage'
  | 'key_stage_title'
  | 'unit_url'
>;

interface UnitFixtureResult {
  readonly id: string;
  readonly rankScore: number;
  readonly unit: RendererUnitFields | null;
  readonly highlights: readonly string[];
}

interface UnitsFixtureData {
  readonly scope: 'units';
  readonly total: number;
  readonly took: number;
  readonly results: readonly UnitFixtureResult[];
}

export function buildUnitsSearchFixture(
  data: UnitsFixtureData,
  summary?: string,
  status?: string,
): UnitsFixtureData & WrapperFields {
  return { ...data, ...buildWrapper(summary, status) };
}

// ── Thread scope ──

/** Threads use `subject_slugs` (plural array), not `subject_slug`. */
type RendererThreadFields = Pick<
  SearchThreadIndexDoc,
  'thread_title' | 'thread_slug' | 'unit_count' | 'subject_slugs'
>;

interface ThreadFixtureResult {
  readonly id: string;
  readonly rankScore: number;
  readonly thread: RendererThreadFields;
  readonly highlights: readonly string[];
}

interface ThreadsFixtureData {
  readonly scope: 'threads';
  readonly total: number;
  readonly took: number;
  readonly results: readonly ThreadFixtureResult[];
}

export function buildThreadsSearchFixture(
  data: ThreadsFixtureData,
  summary?: string,
  status?: string,
): ThreadsFixtureData & WrapperFields {
  return { ...data, ...buildWrapper(summary, status) };
}

// ── Sequence scope ──

/** Sequences use `key_stages` (plural array) and have NO `highlights`. */
type RendererSequenceFields = Pick<
  SearchSequenceIndexDoc,
  | 'sequence_title'
  | 'sequence_slug'
  | 'subject_slug'
  | 'subject_title'
  | 'phase_slug'
  | 'phase_title'
  | 'sequence_url'
  | 'key_stages'
  | 'years'
>;

interface SequenceFixtureResult {
  readonly id: string;
  readonly rankScore: number;
  readonly sequence: RendererSequenceFields;
}

interface SequencesFixtureData {
  readonly scope: 'sequences';
  readonly total: number;
  readonly took: number;
  readonly results: readonly SequenceFixtureResult[];
}

export function buildSequencesSearchFixture(
  data: SequencesFixtureData,
  summary?: string,
  status?: string,
): SequencesFixtureData & WrapperFields {
  return { ...data, ...buildWrapper(summary, status) };
}

// ── Suggest ──

/** Suggest has NO `scope` or `results` properties. */
type RendererSuggestionFields = Pick<
  SearchSuggestionItem,
  'label' | 'scope' | 'url' | 'subject' | 'keyStage'
>;

interface SuggestFixtureData {
  readonly suggestions: readonly RendererSuggestionFields[];
  readonly cache: { readonly version: string; readonly ttlSeconds: number };
}

export function buildSuggestFixture(
  data: SuggestFixtureData,
  summary?: string,
  status?: string,
): SuggestFixtureData & WrapperFields {
  return { ...data, ...buildWrapper(summary, status) };
}

// ── Metadata ──

/**
 * Builds the metadata shape for `window.openai.toolResponseMetadata`.
 *
 * @param toolName - The MCP tool name (e.g. 'search')
 * @param annotationsTitle - Optional human-readable title
 */
export function buildWidgetMetadata(
  toolName: string,
  annotationsTitle?: string,
): { readonly toolName: string; readonly 'annotations/title'?: string } {
  if (annotationsTitle !== undefined) {
    return { toolName, 'annotations/title': annotationsTitle };
  }
  return { toolName };
}
