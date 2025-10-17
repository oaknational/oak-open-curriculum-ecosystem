import type { CallToolResult, TextContent } from '@modelcontextprotocol/sdk/types.js';
import { z, type ZodTypeAny } from 'zod';
import {
  toolNames,
  isToolName,
  type ToolName,
  getToolFromToolName,
} from '../types/generated/api-schema/mcp-tools/index.js';
import type { GenericToolInputJsonSchema } from './zod-input-schema.js';
import type { ToolExecutionResult } from './execute-tool-call.js';
import { typeSafeEntries } from '../types/helpers/type-helpers.js';
import {
  generateCanonicalUrlWithContext,
  extractSlug,
  type ContentType,
} from '../types/generated/api-schema/routing/url-helpers.js';

type SpecialToolName = 'search' | 'fetch';

interface SearchObjectArgs {
  readonly query?: string;
  readonly q?: string;
  readonly keyStage?: 'ks1' | 'ks2' | 'ks3' | 'ks4';
  readonly subject?:
    | 'art'
    | 'citizenship'
    | 'computing'
    | 'cooking-nutrition'
    | 'design-technology'
    | 'english'
    | 'french'
    | 'geography'
    | 'german'
    | 'history'
    | 'maths'
    | 'music'
    | 'physical-education'
    | 'religious-education'
    | 'rshe-pshe'
    | 'science'
    | 'spanish';
  readonly unit?: string;
}

type SearchArgs = string | SearchObjectArgs;
type FetchArgs = string | { readonly id: string };

interface SpecialToolArgsMap {
  readonly search: SearchArgs;
  readonly fetch: FetchArgs;
}

interface SpecialToolDefinition<TSchema extends ZodTypeAny> {
  readonly description: string;
  readonly inputSchema: GenericToolInputJsonSchema;
  readonly schema: TSchema;
}

const SEARCH_TOOL_INPUT_SCHEMA: GenericToolInputJsonSchema = {
  type: 'object',
  properties: {
    query: { type: 'string' },
    q: { type: 'string' },
    keyStage: { type: 'string', enum: ['ks1', 'ks2', 'ks3', 'ks4'] },
    subject: {
      type: 'string',
      enum: [
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
      ],
    },
    unit: { type: 'string' },
  },
  additionalProperties: false,
} as const;

const FETCH_TOOL_INPUT_SCHEMA: GenericToolInputJsonSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
  },
  required: ['id'],
  additionalProperties: false,
} as const;

const searchArgsSchema = z.union([
  z
    .string({
      required_error: 'search requires a query string',
      invalid_type_error: 'search requires a query string',
    })
    .min(1, 'search requires a non-empty query string'),
  z
    .object({
      query: z.string().optional(),
      q: z.string().optional(),
      keyStage: z.enum(['ks1', 'ks2', 'ks3', 'ks4']).optional(),
      subject: z
        .enum([
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
        ])
        .optional(),
      unit: z.string().optional(),
    })
    .strict(),
]);

const fetchArgsSchema = z.union([
  z
    .string({
      required_error: 'fetch requires an id',
      invalid_type_error: 'fetch requires an id string',
    })
    .min(1, 'fetch requires a non-empty id'),
  z
    .object({
      id: z
        .string({
          required_error: 'fetch requires an id string',
        })
        .min(1, 'fetch requires a non-empty id'),
    })
    .strict(),
]);

const SPECIAL_TOOL_DEFS: Record<
  SpecialToolName,
  SpecialToolDefinition<typeof searchArgsSchema | typeof fetchArgsSchema>
> = {
  search: {
    description:
      'Search across lessons and transcripts. Args: { query: string; keyStage?; subject?; unit? } or a string query.',
    inputSchema: SEARCH_TOOL_INPUT_SCHEMA,
    schema: searchArgsSchema,
  },
  fetch: {
    description:
      'Fetch a lesson, unit, subject, sequence, or thread by canonical id. Args: { id: string } or string id.',
    inputSchema: FETCH_TOOL_INPUT_SCHEMA,
    schema: fetchArgsSchema,
  },
};

const SPECIAL_TOOL_NAMES: readonly SpecialToolName[] = ['search', 'fetch'] as const;

export type UniversalToolName = SpecialToolName | ToolName;

export interface UniversalToolListEntry {
  readonly name: UniversalToolName;
  readonly description?: string;
  readonly inputSchema: GenericToolInputJsonSchema;
}

export interface UniversalToolExecutorDependencies {
  readonly executeMcpTool: (name: ToolName, args: unknown) => Promise<ToolExecutionResult>;
}

interface ToolMetadata {
  readonly schema: ZodTypeAny;
  readonly inputSchema: GenericToolInputJsonSchema;
  readonly description?: string;
  readonly describeToolArgs?: () => string;
  readonly outputJsonSchema: unknown;
}

const toolMetadata: ReadonlyMap<UniversalToolName, ToolMetadata> = (() => {
  const entries = new Map<UniversalToolName, ToolMetadata>();

  for (const name of SPECIAL_TOOL_NAMES) {
    const def = SPECIAL_TOOL_DEFS[name];
    entries.set(name, {
      schema: def.schema,
      inputSchema: def.inputSchema,
      description: def.description,
      describeToolArgs: undefined,
      outputJsonSchema: undefined,
    });
  }

  toolNames.forEach((toolName) => {
    const descriptor = getToolFromToolName(toolName);
    entries.set(toolName, {
      schema: descriptor.toolZodSchema,
      inputSchema: descriptor.inputSchema,
      description: descriptor.description,
      describeToolArgs: descriptor.describeToolArgs,
      outputJsonSchema: descriptor.toolOutputJsonSchema,
    });
  });

  return entries;
})();

function formatError(message: string): CallToolResult {
  const content: TextContent = { type: 'text', text: message };
  return { content: [content], isError: true };
}

function formatData(data: unknown): CallToolResult {
  const normalised = serialiseArg(data);
  const content: TextContent = { type: 'text', text: JSON.stringify(normalised) };
  return { content: [content] };
}

function formatUnknownTool(value: unknown): CallToolResult {
  if (typeof value === 'string') {
    return formatError(`Unknown tool: ${value}`);
  }
  return formatError('Unknown tool');
}

function toErrorMessage(value: unknown): string {
  if (value instanceof Error) {
    const { message } = value;
    if (message.length === 0) {
      return 'Unknown error';
    }
    return message;
  }
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return value.toString();
  }
  return 'Unknown error';
}

function validateArgs(
  name: UniversalToolName,
  args: unknown,
):
  | { ok: true; value: unknown; metadata: ToolMetadata }
  | {
      ok: false;
      message: string;
    } {
  const metadata = toolMetadata.get(name);
  if (!metadata) {
    return { ok: false, message: `Unknown tool: ${name}` };
  }
  const safeResult = metadata.schema.safeParse(args);
  if (safeResult.success) {
    return { ok: true, value: safeResult.data, metadata };
  }
  const describe = metadata.describeToolArgs;
  const fallbackMessage = safeResult.error.issues.map((issue) => issue.message).join('; ');
  return {
    ok: false,
    message: describe ? describe() : fallbackMessage,
  };
}

function serialiseArg(value: unknown): unknown {
  if (typeof value === 'bigint') {
    return value.toString();
  }
  if (Array.isArray(value)) {
    return value.map(serialiseArg);
  }
  if (typeof value === 'object' && value !== null) {
    const entries = typeSafeEntries(value);
    // eslint-disable-next-line @typescript-eslint/no-restricted-types -- it really is unknown here
    const accumulator: Record<string, unknown> = {};
    for (const [key, nested] of entries) {
      accumulator[String(key)] = serialiseArg(nested);
    }
    return accumulator;
  }
  return value;
}

export function listUniversalTools(): readonly UniversalToolListEntry[] {
  const entries: UniversalToolListEntry[] = [];
  for (const [name, metadata] of toolMetadata.entries()) {
    entries.push({
      name,
      description: metadata.description,
      inputSchema: metadata.inputSchema,
    });
  }
  return entries;
}

function isSpecialToolName(value: unknown): value is SpecialToolName {
  return value === 'search' || value === 'fetch';
}

export function isUniversalToolName(value: unknown): value is UniversalToolName {
  if (typeof value !== 'string') {
    return false;
  }
  return isSpecialToolName(value) || isToolName(value);
}

async function runSearchTool(
  args: SpecialToolArgsMap['search'],
  deps: UniversalToolExecutorDependencies,
): Promise<CallToolResult> {
  const { q, keyStage, subject, unit } = normaliseSearchArgs(args);
  const lessonsResult = await deps.executeMcpTool('get-search-lessons' as ToolName, {
    q,
    keyStage,
    subject,
    unit,
  });
  const transcriptsResult = await deps.executeMcpTool('get-search-transcripts' as ToolName, {
    q,
  });

  const lessonsData = extractExecutionData(lessonsResult);
  if (!lessonsData.ok) {
    return formatError(toErrorMessage(lessonsData.error));
  }
  const transcriptsData = extractExecutionData(transcriptsResult);
  if (!transcriptsData.ok) {
    return formatError(toErrorMessage(transcriptsData.error));
  }

  return formatData({
    q,
    keyStage,
    subject,
    unit,
    lessons: lessonsData.data,
    transcripts: transcriptsData.data,
  });
}

async function runFetchTool(
  args: SpecialToolArgsMap['fetch'],
  deps: UniversalToolExecutorDependencies,
): Promise<CallToolResult> {
  const id = normaliseFetchId(args);
  const type = detectTypeFromId(id);
  if (!type) {
    return formatError(`Unsupported id prefix in ${id}`);
  }
  const slug = extractSlug(id);
  const execution = await executeFetchByType(type, slug, deps);
  if (!execution.ok) {
    return formatError(toErrorMessage(execution.error));
  }
  const canonicalUrl = generateCanonicalUrlWithContext(type, id);
  return formatData({ id, type, canonicalUrl, data: execution.data });
}

async function runMcpTool(
  name: ToolName,
  value: unknown,
  deps: UniversalToolExecutorDependencies,
): Promise<CallToolResult> {
  try {
    const execution = await deps.executeMcpTool(name, value);
    if ('error' in execution && execution.error) {
      return formatError(toErrorMessage(execution.error));
    }
    return formatData(execution.data);
  } catch (error) {
    return formatError(toErrorMessage(error));
  }
}

export function createUniversalToolExecutor(
  deps: UniversalToolExecutorDependencies,
): (name: UniversalToolName, args: unknown) => Promise<CallToolResult> {
  return async (name: UniversalToolName, args: unknown): Promise<CallToolResult> => {
    if (!isUniversalToolName(name)) {
      return formatUnknownTool(name);
    }

    const input = args === undefined ? {} : args;
    const validation = validateArgs(name, input);
    if (!validation.ok) {
      return formatError(validation.message);
    }

    if (isSpecialToolName(name)) {
      if (name === 'search') {
        return runSearchTool(validation.value as SpecialToolArgsMap['search'], deps);
      }
      return runFetchTool(validation.value as SpecialToolArgsMap['fetch'], deps);
    }

    return runMcpTool(name, validation.value, deps);
  };
}

type ExecutionDataResult =
  | { readonly ok: true; readonly data: unknown }
  | { readonly ok: false; readonly error: unknown };

function extractExecutionData(result: ToolExecutionResult): ExecutionDataResult {
  if ('error' in result && result.error) {
    return { ok: false, error: result.error };
  }
  return { ok: true, data: result.data };
}

async function executeFetchByType(
  type: ContentType,
  slug: string,
  deps: UniversalToolExecutorDependencies,
): Promise<ExecutionDataResult> {
  switch (type) {
    case 'lesson':
      return extractExecutionData(
        await deps.executeMcpTool('get-lessons-summary' as ToolName, { lesson: slug }),
      );
    case 'unit':
      return extractExecutionData(
        await deps.executeMcpTool('get-units-summary' as ToolName, { unit: slug }),
      );
    case 'subject':
      return extractExecutionData(
        await deps.executeMcpTool('get-subject-detail' as ToolName, { subject: slug }),
      );
    case 'sequence':
      return extractExecutionData(
        await deps.executeMcpTool('get-sequences-units' as ToolName, { sequence: slug }),
      );
    case 'thread':
      return extractExecutionData(
        await deps.executeMcpTool('get-threads-units' as ToolName, { threadSlug: slug }),
      );
    default:
      return { ok: false, error: new TypeError(`Unsupported content type: ${String(type)}`) };
  }
}

function normaliseSearchArgs(args: SpecialToolArgsMap['search']): {
  readonly q: string;
  readonly keyStage?: string;
  readonly subject?: string;
  readonly unit?: string;
} {
  if (typeof args === 'string') {
    const trimmed = args.trim();
    if (trimmed.length === 0) {
      throw new TypeError('search requires a non-empty query string ("query" or "q")');
    }
    return { q: trimmed };
  }

  const query = typeof args.query === 'string' ? args.query.trim() : undefined;
  const q = typeof args.q === 'string' ? args.q.trim() : undefined;
  const chosen = query && query.length > 0 ? query : q && q.length > 0 ? q : undefined;
  if (!chosen) {
    throw new TypeError('search requires a non-empty query string ("query" or "q")');
  }

  return {
    q: chosen,
    keyStage: typeof args.keyStage === 'string' ? args.keyStage : undefined,
    subject: typeof args.subject === 'string' ? args.subject : undefined,
    unit: typeof args.unit === 'string' ? args.unit : undefined,
  };
}

function normaliseFetchId(args: SpecialToolArgsMap['fetch']): string {
  const candidate =
    typeof args === 'string' ? args : typeof args.id === 'string' ? args.id : undefined;
  if (!candidate) {
    throw new TypeError('fetch requires an "id" string');
  }
  const trimmed = candidate.trim();
  if (trimmed.length === 0) {
    throw new TypeError('fetch requires an "id" string');
  }
  return trimmed;
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
