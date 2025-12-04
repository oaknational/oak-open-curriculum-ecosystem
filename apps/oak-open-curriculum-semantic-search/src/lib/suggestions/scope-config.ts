import type { estypes } from '@elastic/elasticsearch';
import {
  isSearchLessonsIndexDoc,
  isSearchSequenceIndexDoc,
  isSearchUnitRollupDoc,
} from '../../types/oak';
import type {
  SearchLessonsIndexDoc,
  SearchUnitRollupDoc,
  SearchSequenceIndexDoc,
  KeyStage,
  SearchSubjectSlug,
  SearchScope,
} from '../../types/oak';
import { resolveCurrentSearchIndexName } from '../search-index-target';
import type { SuggestQuery, SuggestionContext, SuggestionItem } from './types';

/** Internal representation of a mapped suggestion hit. */
export interface SuggestionHit {
  id: string;
  item: SuggestionItem;
}

/** Scope-specific configuration for building suggestion queries. */
export interface ScopeConfig<TDoc> {
  index: string;
  completionField: string;
  boolPrefixFields: readonly string[];
  sourceFields: readonly string[];
  buildCompletionContexts(query: SuggestQuery): Record<string, string[]> | undefined;
  buildFilters(query: SuggestQuery): estypes.QueryDslQueryContainer[];
  isDoc(value: unknown): value is TDoc;
  toSuggestion(doc: TDoc, id: string): SuggestionHit | null;
}

const scopeConfigBuilders = {
  lessons: () => ({
    index: resolveCurrentSearchIndexName('lessons'),
    completionField: 'title_suggest',
    boolPrefixFields: ['lesson_title.sa', 'lesson_title.sa._2gram', 'lesson_title.sa._3gram'],
    sourceFields: ['lesson_title', 'lesson_url', 'subject_slug', 'key_stage', 'title_suggest'],
    buildCompletionContexts: (query) => buildSubjectContexts(query.subject, query.keyStage),
    buildFilters: (query) => buildFilters(query.subject, query.keyStage),
    isDoc: isSearchLessonsIndexDoc,
    toSuggestion: (doc, id) =>
      createSuggestionHit({
        id,
        scope: 'lessons',
        label: doc.lesson_title,
        url: doc.lesson_url,
        subject: doc.subject_slug,
        keyStage: doc.key_stage,
        contexts: {},
      }),
  }),
  units: () => ({
    index: resolveCurrentSearchIndexName('unit_rollup'),
    completionField: 'title_suggest',
    boolPrefixFields: ['unit_title.sa', 'unit_title.sa._2gram', 'unit_title.sa._3gram'],
    sourceFields: [
      'unit_title',
      'unit_url',
      'subject_slug',
      'key_stage',
      'title_suggest',
      'sequence_ids',
    ],
    buildCompletionContexts: (query) => buildSubjectContexts(query.subject, query.keyStage),
    buildFilters: (query) => buildFilters(query.subject, query.keyStage),
    isDoc: isSearchUnitRollupDoc,
    toSuggestion: (doc, id) =>
      createSuggestionHit({
        id,
        scope: 'units',
        label: doc.unit_title,
        url: doc.unit_url,
        subject: doc.subject_slug,
        keyStage: doc.key_stage,
        contexts: sequenceContext(doc.sequence_ids),
      }),
  }),
  sequences: () => ({
    index: resolveCurrentSearchIndexName('sequences'),
    completionField: 'title_suggest',
    boolPrefixFields: ['sequence_title.sa', 'sequence_title.sa._2gram', 'sequence_title.sa._3gram'],
    sourceFields: ['sequence_title', 'sequence_url', 'subject_slug', 'phase_slug', 'title_suggest'],
    buildCompletionContexts: (query) => buildSequenceContexts(query.subject, query.phaseSlug),
    buildFilters: (query) => buildSequenceFilters(query.subject, query.phaseSlug),
    isDoc: isSearchSequenceIndexDoc,
    toSuggestion: (doc, id) =>
      createSuggestionHit({
        id,
        scope: 'sequences',
        label: doc.sequence_title,
        url: doc.sequence_url,
        subject: doc.subject_slug,
        contexts: phaseContext(doc.phase_slug),
      }),
  }),
} as const satisfies {
  lessons: () => ScopeConfig<SearchLessonsIndexDoc>;
  units: () => ScopeConfig<SearchUnitRollupDoc>;
  sequences: () => ScopeConfig<SearchSequenceIndexDoc>;
};
export function getScopeConfig(scope: 'lessons'): ScopeConfig<SearchLessonsIndexDoc>;
export function getScopeConfig(scope: 'units'): ScopeConfig<SearchUnitRollupDoc>;
export function getScopeConfig(scope: 'sequences'): ScopeConfig<SearchSequenceIndexDoc>;
export function getScopeConfig(scope: SearchScope): ScopeConfig<unknown> {
  switch (scope) {
    case 'lessons':
      return scopeConfigBuilders.lessons();
    case 'units':
      return scopeConfigBuilders.units();
    case 'sequences':
      return scopeConfigBuilders.sequences();
    default: {
      const unexpectedScope: never = scope;
      throw new Error(`Unsupported suggestion scope: ${unexpectedScope}`);
    }
  }
}

function buildSubjectContexts(
  subject?: SearchSubjectSlug,
  keyStage?: KeyStage,
): Record<string, string[]> | undefined {
  const contexts: Record<string, string[]> = {};
  if (subject) {
    contexts.subject = [subject];
  }
  if (keyStage) {
    contexts.key_stage = [keyStage];
  }
  // eslint-disable-next-line no-restricted-properties -- REFACTOR
  return Object.keys(contexts).length > 0 ? contexts : undefined;
}

function buildSequenceContexts(
  subject?: SearchSubjectSlug,
  phaseSlug?: string,
): Record<string, string[]> | undefined {
  const contexts: Record<string, string[]> = {};
  if (subject) {
    contexts.subject = [subject];
  }
  if (phaseSlug) {
    contexts.phase = [phaseSlug];
  }
  // eslint-disable-next-line no-restricted-properties -- REFACTOR
  return Object.keys(contexts).length > 0 ? contexts : undefined;
}

function buildFilters(
  subject?: SearchSubjectSlug,
  keyStage?: KeyStage,
): estypes.QueryDslQueryContainer[] {
  const filters: estypes.QueryDslQueryContainer[] = [];
  if (subject) {
    filters.push({ term: { subject_slug: subject } });
  }
  if (keyStage) {
    filters.push({ term: { key_stage: keyStage } });
  }
  return filters;
}

function buildSequenceFilters(
  subject?: SearchSubjectSlug,
  phaseSlug?: string,
): estypes.QueryDslQueryContainer[] {
  const filters: estypes.QueryDslQueryContainer[] = [];
  if (subject) {
    filters.push({ term: { subject_slug: subject } });
  }
  if (phaseSlug) {
    filters.push({ term: { phase_slug: phaseSlug } });
  }
  return filters;
}

function sequenceContext(sequenceIds: string[] | undefined): SuggestionContext {
  if (Array.isArray(sequenceIds) && sequenceIds.length > 0) {
    return { sequenceId: sequenceIds[0] };
  }
  return {};
}

function phaseContext(phaseSlug: string | undefined): SuggestionContext {
  if (phaseSlug && phaseSlug.length > 0) {
    return { phaseSlug };
  }
  return {};
}

function createSuggestionHit(params: {
  id: string;
  scope: SearchScope;
  label: string;
  url: string;
  subject?: SearchSubjectSlug;
  keyStage?: KeyStage;
  contexts: SuggestionContext;
}): SuggestionHit | null {
  if (!params.label || !params.url) {
    return null;
  }
  const item: SuggestionItem = {
    label: params.label,
    scope: params.scope,
    url: params.url,
    contexts: params.contexts,
  };
  if (params.subject) {
    item.subject = params.subject;
  }
  if (params.keyStage) {
    item.keyStage = params.keyStage;
  }
  return { id: params.id, item };
}
