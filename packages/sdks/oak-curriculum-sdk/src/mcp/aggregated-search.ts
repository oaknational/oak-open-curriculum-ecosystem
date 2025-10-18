import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import {
  formatData,
  formatError,
  toErrorMessage,
  extractExecutionData,
} from './universal-tool-shared.js';
import type { UniversalToolExecutorDependencies } from './universal-tool-shared.js';
import type { GenericToolInputJsonSchema } from './zod-input-schema.js';

export const KEY_STAGES = ['ks1', 'ks2', 'ks3', 'ks4'] as const;
export const SUBJECT_SLUGS = [
  'art',
  'citizenship',
  'computing',
  'cooking-nutrition',
  'design-technology',
  'english',
  'french',
  'geography',
  'german',
  'history',
  'maths',
  'music',
  'physical-education',
  'religious-education',
  'rshe-pshe',
  'science',
  'spanish',
] as const;

export const SEARCH_INPUT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    query: { type: 'string' },
    q: { type: 'string' },
    keyStage: { type: 'string', enum: [...KEY_STAGES] },
    subject: { type: 'string', enum: [...SUBJECT_SLUGS] },
    unit: { type: 'string' },
  },
} as const satisfies GenericToolInputJsonSchema;

export type SearchKeyStage = (typeof KEY_STAGES)[number];
export type SearchSubject = (typeof SUBJECT_SLUGS)[number];

export interface SearchArgs {
  readonly q: string;
  readonly keyStage?: SearchKeyStage;
  readonly subject?: SearchSubject;
  readonly unit?: string;
}

const SEARCH_QUERY_ERROR_MESSAGE = 'search requires a non-empty query string ("query" or "q")';

const SearchStringSchema = z.string().trim().min(1, { message: SEARCH_QUERY_ERROR_MESSAGE });

const SearchObjectShape = z
  .object({
    query: z
      .string({ invalid_type_error: SEARCH_QUERY_ERROR_MESSAGE })
      .trim()
      .min(1, { message: SEARCH_QUERY_ERROR_MESSAGE })
      .optional(),
    q: z
      .string({ invalid_type_error: SEARCH_QUERY_ERROR_MESSAGE })
      .trim()
      .min(1, { message: SEARCH_QUERY_ERROR_MESSAGE })
      .optional(),
    keyStage: z
      .string({ invalid_type_error: 'keyStage must be one of ks1, ks2, ks3, ks4' })
      .optional(),
    subject: z.string({ invalid_type_error: 'subject must be a string' }).optional(),
    unit: z.string({ invalid_type_error: 'unit must be a string' }).optional(),
  })
  .strict();

type SearchObjectInput = z.infer<typeof SearchObjectShape>;

const KEY_STAGE_SET = new Set<string>(KEY_STAGES);
const SUBJECT_SLUG_SET = new Set<string>(SUBJECT_SLUGS);

function isSearchKeyStage(value: string): value is SearchKeyStage {
  return KEY_STAGE_SET.has(value);
}

function isSearchSubject(value: string): value is SearchSubject {
  return SUBJECT_SLUG_SET.has(value);
}

function normaliseKeyStage(
  value: string | undefined,
): { ok: true; value?: SearchKeyStage } | { ok: false; message: string } {
  if (value === undefined) {
    return { ok: true, value: undefined };
  }
  if (!isSearchKeyStage(value)) {
    return { ok: false, message: 'keyStage must be one of ks1, ks2, ks3, ks4' };
  }
  return { ok: true, value };
}

function normaliseSubject(
  value: string | undefined,
): { ok: true; value?: SearchSubject } | { ok: false; message: string } {
  if (value === undefined) {
    return { ok: true, value: undefined };
  }
  if (!isSearchSubject(value)) {
    return { ok: false, message: 'subject must be a recognised subject slug' };
  }
  return { ok: true, value };
}

function normaliseUnit(value: string | undefined): string | undefined {
  if (!value) {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function mapSearchObject(
  value: SearchObjectInput,
): { ok: true; value: SearchArgs } | { ok: false; message: string } {
  const query = value.q ?? value.query;
  if (query === undefined) {
    return { ok: false, message: SEARCH_QUERY_ERROR_MESSAGE };
  }

  const keyStageOutcome = normaliseKeyStage(value.keyStage);
  if (!keyStageOutcome.ok) {
    return keyStageOutcome;
  }

  const subjectOutcome = normaliseSubject(value.subject);
  if (!subjectOutcome.ok) {
    return subjectOutcome;
  }

  const unit = normaliseUnit(value.unit);

  return {
    ok: true,
    value: {
      q: query,
      keyStage: keyStageOutcome.value,
      subject: subjectOutcome.value,
      unit,
    },
  };
}

const SearchArgsSchema = z.union([SearchStringSchema, SearchObjectShape]);

export function validateSearchArgs(
  input: unknown,
): { ok: true; value: SearchArgs } | { ok: false; message: string } {
  if (typeof input !== 'string' && (typeof input !== 'object' || input === null)) {
    return { ok: false, message: 'search expects a string or object input' };
  }

  const result = SearchArgsSchema.safeParse(input);
  if (!result.success) {
    const firstIssue = result.error.issues[0];
    return { ok: false, message: firstIssue.message };
  }

  if (typeof result.data === 'string') {
    return { ok: true, value: { q: result.data } };
  }

  return mapSearchObject(result.data);
}

export async function runSearchTool(
  args: SearchArgs,
  deps: UniversalToolExecutorDependencies,
): Promise<CallToolResult> {
  const lessonsArgs = {
    params: {
      query: {
        q: args.q,
        ...(args.keyStage !== undefined ? { keyStage: args.keyStage } : {}),
        ...(args.subject !== undefined ? { subject: args.subject } : {}),
        ...(args.unit !== undefined ? { unit: args.unit } : {}),
      },
    },
  };
  const transcriptsArgs = {
    params: {
      query: {
        q: args.q,
      },
    },
  };

  const lessonsResult = await deps.executeMcpTool('get-search-lessons', lessonsArgs);
  const transcriptsResult = await deps.executeMcpTool('get-search-transcripts', transcriptsArgs);

  const lessonsData = extractExecutionData(lessonsResult);
  if (!lessonsData.ok) {
    return formatError(toErrorMessage(lessonsData.error));
  }
  const transcriptsData = extractExecutionData(transcriptsResult);
  if (!transcriptsData.ok) {
    return formatError(toErrorMessage(transcriptsData.error));
  }

  return formatData({
    q: args.q,
    keyStage: args.keyStage,
    subject: args.subject,
    unit: args.unit,
    lessons: lessonsData.data,
    transcripts: transcriptsData.data,
  });
}
