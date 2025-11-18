import { env } from './env';
import { generateObject, zodSchema } from 'ai';
import { z } from 'zod';
import { createOpenAI } from '@ai-sdk/openai';
import { isKeyStage, isSubject } from '../adapters/sdk-guards';
import {
  QueryParserRequestSchema,
  QueryParserResponseSchema,
  QUERY_PARSER_INTENT_ENUM,
  type QueryParserIntent,
  type QueryParserResponse,
} from '../types/oak';

export async function parseQuery(query: string): Promise<QueryParserResponse> {
  const e = env();
  const openai = createOpenAI({ apiKey: e.OPENAI_API_KEY });
  const request = QueryParserRequestSchema.parse({ query });

  interface Generation {
    intent: QueryParserIntent;
    text: QueryParserResponse['text'];
    subject?: string;
    keyStage?: string;
    minLessons?: QueryParserResponse['minLessons'];
  }

  const GenerationSchema = z
    .object({
      intent: z.enum(QUERY_PARSER_INTENT_ENUM),
      text: z.string().default(''),
      subject: z.string().optional(),
      keyStage: z.string().optional(),
      minLessons: z.number().int().min(0).optional(),
    })
    .strict();

  const { object: rawObject } = await generateObject({
    model: openai('gpt-4o-mini'),
    temperature: 0,
    prompt: [
      'You convert teacher queries into parameters for a curriculum search engine.',
      'Return intent=lessons|units, optional subject and keyStage (ks1-ks4), optional minLessons, and the topical text for search.',
      "Be conservative with subject/keyStage unless strongly implied. For phrases like 'KS4 geography', set both.",
      `\nUser query: ${request.query}`,
    ].join('\n'),
    schema: zodSchema(GenerationSchema),
    output: 'object',
  });

  const provisional: Generation = GenerationSchema.parse(rawObject);

  const sanitized: QueryParserResponse = {
    intent: provisional.intent,
    text: provisional.text,
    subject:
      provisional.subject && isSubject(provisional.subject) ? provisional.subject : undefined,
    keyStage:
      provisional.keyStage && isKeyStage(provisional.keyStage) ? provisional.keyStage : undefined,
    minLessons: provisional.minLessons,
  };

  return QueryParserResponseSchema.parse(sanitized);
}
