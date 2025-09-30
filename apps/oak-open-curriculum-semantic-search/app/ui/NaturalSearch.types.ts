import type { SearchNaturalLanguageRequest } from '../../src/types/oak';

export type NaturalBody = SearchNaturalLanguageRequest;

export type NaturalScopeChoice = 'auto' | NonNullable<NaturalBody['scope']>;
