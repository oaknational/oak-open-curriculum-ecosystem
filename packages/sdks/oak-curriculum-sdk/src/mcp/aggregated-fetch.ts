import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { formatError, formatToolResponse, toErrorMessage } from './universal-tool-shared.js';
import type { UniversalToolExecutorDependencies } from './universal-tool-shared.js';
import { McpParameterError, type ToolExecutionResult } from './execute-tool-call.js';
import { err } from '@oaknational/result';
import type { GenericToolInputJsonSchema } from './zod-input-schema.js';
import {
  generateCanonicalUrlWithContext,
  extractSlug,
  type ContentType,
} from '@oaknational/sdk-codegen/api-schema';
import { extractContextFromResponse } from '../response-augmentation.js';
import type { ResponseContext } from '../types/response-augmentation.js';
import {
  FETCH_PREREQUISITE_GUIDANCE,
  PRIMARY_ORIENTATION_TOOL_NAME,
} from './prerequisite-guidance.js';

import { SCOPES_SUPPORTED } from './scopes-supported.js';

/**
 * Fetch tool definition with full MCP metadata.
 *
 * Includes MCP annotations for behaviour hints and MCP Apps standard
 * _meta fields for widget URI routing (ADR-141).
 */
export const FETCH_TOOL_DEF = {
  description: `Fetch curriculum resource by canonical identifier.

${FETCH_PREREQUISITE_GUIDANCE}

Use this when you need to:
- Get lesson details (learning objectives, keywords, misconceptions)
- Get unit information (lessons list, subject context)
- Get subject or sequence overview
- Retrieve thread progression data

Do NOT use for:
- Finding content when you don't have the ID (use 'search')
- Understanding ID formats (use '${PRIMARY_ORIENTATION_TOOL_NAME}' first)

Use format "type:slug" (e.g., "lesson:add-fractions-with-the-same-denominator", "unit:comparing-fractions").`,
  securitySchemes: [{ type: 'oauth2', scopes: [...SCOPES_SUPPORTED] }] as const,
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
    title: 'Fetch Curriculum Resource',
  },
  _meta: undefined,
} as const;

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
        'Canonical identifier in format "type:slug" (e.g., "lesson:add-fractions-with-the-same-denominator", "unit:comparing-fractions", "subject:maths", "sequence:maths-primary", "thread:number-multiplication-and-division")',
      examples: [
        'lesson:adding-fractions-with-the-same-denominator',
        'unit:comparing-fractions',
        'subject:maths',
        'sequence:maths-primary',
        'thread:number-multiplication-and-division',
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
      .string({ error: 'fetch requires an "id" string' })
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

  // Extract context from the API response and pass to canonical URL generation.
  // Units and subjects require context (sequenceSlug derived from subjectSlug/phaseSlug,
  // keyStages for subjects) to generate the correct canonical URL.
  let context: ResponseContext;
  try {
    context = extractContextFromResponse(result.value.data, type);
  } catch {
    context = {};
  }

  let canonicalUrl: string | null;
  try {
    canonicalUrl = generateCanonicalUrlWithContext(type, args.id, context);
  } catch {
    canonicalUrl = null;
  }
  const summary = buildFetchSummary(type, slug, canonicalUrl);

  return formatToolResponse({
    summary,
    data: {
      id: args.id,
      type,
      canonicalUrl,
      httpStatus: result.value.status,
      data: result.value.data,
    },
    status: 'success',
    timestamp: Date.now(),
    toolName: 'fetch',
    annotationsTitle: 'Fetch Curriculum Resource',
  });
}

/**
 * Builds a human-readable summary of the fetch result.
 */
function buildFetchSummary(type: ContentType, slug: string, canonicalUrl: string | null): string {
  const typeName = type.charAt(0).toUpperCase() + type.slice(1);
  const urlPart = canonicalUrl ? ` (${canonicalUrl})` : '';
  return `Fetched ${typeName}: ${slug}${urlPart}`;
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
): Promise<ToolExecutionResult> {
  switch (type) {
    case 'lesson': {
      return deps.executeMcpTool('get-lessons-summary', {
        lesson: slug,
      });
    }
    case 'unit': {
      return deps.executeMcpTool('get-units-summary', {
        unit: slug,
      });
    }
    case 'subject': {
      return deps.executeMcpTool('get-subject-detail', {
        subject: slug,
      });
    }
    case 'sequence': {
      return deps.executeMcpTool('get-sequences-units', {
        sequence: slug,
      });
    }
    case 'thread': {
      return deps.executeMcpTool('get-threads-units', {
        thread: slug,
      });
    }
  }
  return err(new McpParameterError('fetch', `Unsupported content type: ${String(type)}`));
}
