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
import {
  generateCanonicalUrlWithContext,
  extractSlug,
  type ContentType,
} from '../types/generated/api-schema/routing/url-helpers.js';

/**
 * JSON Schema for the fetch aggregated tool.
 *
 * Includes parameter descriptions and examples that will be visible to MCP clients.
 * These help AI agents understand expected formats for canonical identifiers.
 */
export const FETCH_INPUT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    id: {
      type: 'string',
      description:
        'Canonical identifier in format "type:slug" (e.g., "lesson:maths-lesson", "unit:fractions", "subject:science", "sequence:ks2-science", "thread:algebra")',
      examples: [
        'lesson:adding-fractions-with-the-same-denominator',
        'unit:fractions',
        'subject:maths',
        'sequence:english-primary',
        'thread:algebra',
      ],
    },
  },
  required: ['id'],
} as const satisfies GenericToolInputJsonSchema;

export interface FetchArgs {
  readonly id: string;
}

const FetchStringSchema = z
  .string()
  .trim()
  .min(1, { message: 'fetch requires an "id" string' })
  .transform<FetchArgs>((id) => ({ id }));

const FetchObjectSchema = z
  .object({
    id: z
      .string({ invalid_type_error: 'fetch requires an "id" string' })
      .trim()
      .min(1, { message: 'fetch requires an "id" string' }),
  })
  .strict()
  .transform<FetchArgs>((value) => ({ id: value.id }));

const FetchArgsSchema = z.union([FetchStringSchema, FetchObjectSchema]);

export function validateFetchArgs(
  input: unknown,
): { ok: true; value: FetchArgs } | { ok: false; message: string } {
  if (typeof input !== 'string' && (typeof input !== 'object' || input === null)) {
    return { ok: false, message: 'fetch expects a string or object input' };
  }

  const result = FetchArgsSchema.safeParse(input);
  if (!result.success) {
    const firstIssue = result.error.issues[0];
    return { ok: false, message: firstIssue.message };
  }

  return { ok: true, value: result.data };
}

export async function runFetchTool(
  args: FetchArgs,
  deps: UniversalToolExecutorDependencies,
): Promise<CallToolResult> {
  const type = detectTypeFromId(args.id);
  if (!type) {
    return formatError(`Unsupported id prefix in ${args.id}`);
  }
  const slug = extractSlug(args.id);

  const result = await executeFetchByType(type, slug, deps);
  if (!result.ok) {
    return formatError(toErrorMessage(result.error));
  }
  const canonicalUrl = generateCanonicalUrlWithContext(type, args.id);
  return formatData({
    status: result.status,
    data: {
      id: args.id,
      type,
      canonicalUrl,
      data: result.data,
    },
  });
}

function detectTypeFromId(id: string): ContentType | undefined {
  if (id.startsWith('lesson:')) {
    return 'lesson';
  }
  if (id.startsWith('unit:')) {
    return 'unit';
  }
  if (id.startsWith('subject:')) {
    return 'subject';
  }
  if (id.startsWith('sequence:')) {
    return 'sequence';
  }
  if (id.startsWith('thread:')) {
    return 'thread';
  }
  return undefined;
}

async function executeFetchByType(
  type: ContentType,
  slug: string,
  deps: UniversalToolExecutorDependencies,
): Promise<{ ok: true; status: number | string; data: unknown } | { ok: false; error: unknown }> {
  switch (type) {
    case 'lesson': {
      return extractExecutionData(
        await deps.executeMcpTool('get-lessons-summary', {
          lesson: slug,
        }),
      );
    }
    case 'unit': {
      return extractExecutionData(
        await deps.executeMcpTool('get-units-summary', {
          unit: slug,
        }),
      );
    }
    case 'subject': {
      return extractExecutionData(
        await deps.executeMcpTool('get-subject-detail', {
          subject: slug,
        }),
      );
    }
    case 'sequence': {
      return extractExecutionData(
        await deps.executeMcpTool('get-sequences-units', {
          sequence: slug,
        }),
      );
    }
    case 'thread': {
      return extractExecutionData(
        await deps.executeMcpTool('get-threads-units', {
          threadSlug: slug,
        }),
      );
    }
    default:
      return { ok: false, error: new TypeError(`Unsupported content type: ${String(type)}`) };
  }
}
