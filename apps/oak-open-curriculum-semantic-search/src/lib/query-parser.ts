import { z } from 'zod';
import { env } from './env';
import { generateObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { isKeyStage, isSubject } from '../adapters/sdk-guards';
import type { KeyStage, SearchSubjectSlug as Subject } from '../types/oak';
import { LESSONS_SCOPE, UNITS_SCOPE } from './search-scopes';

const PARSED_INTENT_SCOPES = [UNITS_SCOPE, LESSONS_SCOPE] as const;

/** Structured output schema for parsed teacher queries. */
export const ParsedQuerySchema = z.object({
  intent: z.enum(PARSED_INTENT_SCOPES).describe('Whether the user wants units or lessons.'),
  text: z.string().describe('Topical text suitable for semantic search.').default(''),
  subject: z.string().optional(),
  keyStage: z.string().optional(),
  minLessons: z.number().int().min(0).optional(),
});

export type ParsedQueryRaw = z.infer<typeof ParsedQuerySchema>;
export interface ParsedQuery {
  intent: (typeof PARSED_INTENT_SCOPES)[number];
  text: string;
  subject?: Subject;
  keyStage?: KeyStage;
  minLessons?: number;
}

export async function parseQuery(q: string): Promise<ParsedQuery> {
  const e = env();
  const openai = createOpenAI({ apiKey: e.OPENAI_API_KEY });
  const { object } = await generateObject({
    model: openai('gpt-4o-mini'),
    temperature: 0,
    prompt: [
      'You convert teacher queries into parameters for a curriculum search engine.',
      'Return intent=lessons|units, optional subject and keyStage (ks1-ks4), optional minLessons, and the topical text for search.',
      "Be conservative with subject/keyStage unless strongly implied. For phrases like 'KS4 geography', set both.",
      `\nUser query: ${q}`,
    ].join('\n'),
    schema: ParsedQuerySchema,
  });

  // Validate subject/keyStage with SDK guards; drop invalid values.
  const clean: ParsedQuery = {
    intent: object.intent,
    text: object.text,
    subject: object.subject && isSubject(object.subject) ? object.subject : undefined,
    keyStage: object.keyStage && isKeyStage(object.keyStage) ? object.keyStage : undefined,
    minLessons: object.minLessons,
  };
  return clean;
}
