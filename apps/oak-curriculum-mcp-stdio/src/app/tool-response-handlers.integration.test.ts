import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { CallToolResult, TextContent } from '@modelcontextprotocol/sdk/types.js';
import type { ToolResult } from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import { typeSafeGet } from '@oaknational/type-helpers';

import { createToolResponseHandlers } from './tool-response-handlers.js';

const logger = {
  info: vi.fn<(message: string) => void>(),
  error: vi.fn<(message: string) => void>(),
};

interface SerialisedResult {
  readonly status: number | string;
  readonly data: unknown;
}

function isUnknownRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function getOwn(value: Record<string, unknown>, key: string): unknown {
  if (!Object.prototype.hasOwnProperty.call(value, key)) {
    return undefined;
  }
  return typeSafeGet(value, key);
}

function isSerialisedResult(value: unknown): value is SerialisedResult {
  if (!isUnknownRecord(value)) {
    return false;
  }
  const status = getOwn(value, 'status');
  return (
    (typeof status === 'number' || typeof status === 'string') &&
    getOwn(value, 'data') !== undefined
  );
}

const context = {
  name: 'get-lessons-transcript',
  description: 'Fetch a lesson transcript',
  inputSchemaRaw: { type: 'object' },
  inputSchemaZod: { kind: 'zod-object' },
  outputSchemaRaw: { type: 'object' },
  outputSchemaZod: { kind: 'zod-object' },
} as const;

function parseContent(result: CallToolResult): SerialisedResult {
  const textEntry = result.content.find((entry): entry is TextContent => entry.type === 'text');
  if (!textEntry || typeof textEntry.text !== 'string') {
    throw new Error('Expected tool response to include textual content');
  }
  const parsed: unknown = JSON.parse(textEntry.text);
  if (!isSerialisedResult(parsed)) {
    throw new Error('Tool response serialisation missing status metadata');
  }
  return parsed;
}

describe('createToolResponseHandlers (integration)', () => {
  beforeEach(() => {
    logger.info.mockClear();
    logger.error.mockClear();
  });

  it('includes status metadata when formatting successful tool results', () => {
    const handlers = createToolResponseHandlers(logger, context);

    const transcript404: ToolResult<'get-lessons-transcript'> = {
      status: 404,
      data: {
        message: 'Transcript not available for this query',
        code: 'NOT_FOUND',
        data: {
          code: 'NOT_FOUND',
          httpStatus: 404,
          path: 'getLessonTranscript.getLessonTranscript',
          zodError: null,
        },
      },
    };

    const response = handlers.handleSuccess(transcript404);

    expect(response.isError).toBeUndefined();
    const serialised = parseContent(response);
    expect(serialised.status).toBe(404);
    expect(serialised.data).toEqual({
      message: 'Transcript not available for this query',
      code: 'NOT_FOUND',
      data: {
        code: 'NOT_FOUND',
        httpStatus: 404,
        path: 'getLessonTranscript.getLessonTranscript',
        zodError: null,
      },
    });
  });

  it('preserves status metadata for successful 200 responses', () => {
    const handlers = createToolResponseHandlers(logger, context);

    const transcript200: ToolResult<'get-lessons-transcript'> = {
      status: 200,
      data: {
        transcript: 'Lesson transcript',
        vtt: 'https://cdn.example.com/transcript.vtt',
      },
    };

    const response = handlers.handleSuccess(transcript200);

    expect(response.isError).toBeUndefined();
    const serialised = parseContent(response);
    expect(serialised.status).toBe(200);
    expect(serialised.data).toEqual({
      transcript: 'Lesson transcript',
      vtt: 'https://cdn.example.com/transcript.vtt',
    });
  });

  it('only marks validation failures as errors', () => {
    const handlers = createToolResponseHandlers(logger, context);
    const transcript404: ToolResult<'get-lessons-transcript'> = {
      status: 404,
      data: {
        message: 'Transcript not available for this query',
        code: 'NOT_FOUND',
        data: {
          code: 'NOT_FOUND',
          httpStatus: 404,
          path: 'getLessonTranscript.getLessonTranscript',
          zodError: null,
        },
      },
    };

    const validationFailure = handlers.handleValidationError(
      { params: {} },
      transcript404,
      'Response does not match schema',
    );

    expect(validationFailure.isError).toBe(true);
    expect(logger.error).toHaveBeenCalled();
  });
});
