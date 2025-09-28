import { z } from 'zod';
import { SearchFacetsSchema as SdkSearchFacetsSchema } from '../../src/types/oak';

export type SearchScope = 'units' | 'lessons' | 'sequences';
export type SearchScopeWithAll = SearchScope | 'all';

export interface StructuredBody {
  scope: SearchScopeWithAll;
  text: string;
  subject?: string;
  keyStage?: string;
  minLessons?: number;
  size?: number;
  includeFacets?: boolean;
  phaseSlug?: string;
}

export const SearchRequest = z.object({
  scope: z.enum(['units', 'lessons', 'sequences', 'all']),
  text: z.string(),
  subject: z.string().optional(),
  keyStage: z.string().optional(),
  minLessons: z.number().int().positive().optional(),
  size: z.number().int().positive().optional(),
  phaseSlug: z.string().optional(),
  includeFacets: z.boolean().optional(),
});

const SuggestionContextSchema = z
  .object({
    sequenceId: z.string().optional(),
    phaseSlug: z.string().optional(),
  })
  .catchall(z.unknown());

export const SuggestionItemSchema = z
  .object({
    label: z.string(),
    scope: z.enum(['lessons', 'units', 'sequences']),
    url: z.string(),
    subject: z.string().optional(),
    keyStage: z.string().optional(),
    contexts: SuggestionContextSchema.default({}),
  })
  .catchall(z.unknown());

export const DEFAULT_SUGGESTION_CACHE = {
  version: 'fixture-v1',
  ttlSeconds: 300,
} as const;

const SuggestionCacheSchema = z.object({
  version: z.string(),
  ttlSeconds: z.number().int().nonnegative(),
});

const FacetsSchema = z
  .union([z.null(), z.undefined(), z.unknown()])
  .transform((value, ctx) => {
    if (value == null) {
      return null;
    }
    const parsed = SdkSearchFacetsSchema.safeParse(value);
    if (!parsed.success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: parsed.error.message,
      });
      return z.NEVER;
    }
    return parsed.data;
  })
  .default(null);

export const SuggestionResponseSchema = z
  .object({
    suggestions: z.array(SuggestionItemSchema).default([]),
    cache: SuggestionCacheSchema,
  })
  .catchall(z.unknown());

export const HybridResponseSchema = z
  .object({
    scope: z.enum(['lessons', 'units', 'sequences']),
    results: z.array(z.unknown()).default([]),
    total: z.number().int().nonnegative(),
    took: z.number().int().nonnegative(),
    timedOut: z.boolean(),
    aggregations: z.record(z.string(), z.unknown()).default({}),
    facets: FacetsSchema,
    suggestionCache: SuggestionCacheSchema.default(DEFAULT_SUGGESTION_CACHE),
  })
  .catchall(z.unknown());

export type HybridResponse = z.infer<typeof HybridResponseSchema>;
export type SuggestionItem = z.infer<typeof SuggestionItemSchema>;
export type SuggestionResponse = z.infer<typeof SuggestionResponseSchema>;
export type SuggestionCache = z.infer<typeof SuggestionCacheSchema>;

export const MultiScopeBucketSchema = z.object({
  scope: z.enum(['lessons', 'units', 'sequences']),
  result: HybridResponseSchema,
});

export const MultiScopeHybridResponseSchema = z
  .object({
    scope: z.literal('all'),
    buckets: z.array(MultiScopeBucketSchema),
    suggestions: z.array(SuggestionItemSchema).optional(),
    suggestionCache: SuggestionCacheSchema.default(DEFAULT_SUGGESTION_CACHE),
  })
  .catchall(z.unknown());

export type MultiScopeHybridResponse = z.infer<typeof MultiScopeHybridResponseSchema>;
export type MultiScopeBucket = z.infer<typeof MultiScopeBucketSchema>;

export function buildBody(input: z.infer<typeof SearchRequest>): StructuredBody {
  return {
    scope: input.scope,
    text: input.text,
    subject: input.subject || undefined,
    keyStage: input.keyStage || undefined,
    minLessons: input.minLessons,
    size: input.size,
    includeFacets: input.includeFacets ?? true,
    phaseSlug: input.phaseSlug || undefined,
  };
}

export function baseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL;
  if (fromEnv) {
    return fromEnv;
  }
  const fromVercel = process.env.VERCEL_URL;
  if (fromVercel) {
    return `https://${fromVercel}`;
  }
  if (fromVercel) {
    return `https://${fromVercel}`;
  }
  return 'http://localhost:3000';
}

export function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
