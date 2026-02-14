import { describe, expect, it } from 'vitest';

import { getToolFromToolName } from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import { validateOutput, type ToolExecutionSuccessEnvelope } from './validation.js';

const descriptor = getToolFromToolName('get-lessons-transcript');

describe('validateOutput (integration)', () => {
  it('accepts successful 200 results from executeToolCall', () => {
    const result = validateOutput(descriptor, {
      status: 200,
      data: {
        transcript: 'Lesson transcript',
        vtt: 'https://cdn.example.com/transcript.vtt',
      },
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      throw new Error('Expected validation to succeed for 200 response');
    }
    expect(result.result.status).toBe(200);
    expect(result.result.data).toEqual({
      transcript: 'Lesson transcript',
      vtt: 'https://cdn.example.com/transcript.vtt',
    });
  });

  it('treats legitimate 404 responses as valid results', () => {
    const result = validateOutput(descriptor, {
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
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      throw new Error('Expected validation to succeed for 404 response');
    }
    expect(result.result.status).toBe(404);
    expect(result.result.data).toEqual({
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

  it('fails fast for undocumented statuses with informative messaging', () => {
    const undocumented = {
      status: 418,
      data: { message: 'short and stout' },
    } as unknown as ToolExecutionSuccessEnvelope<'get-lessons-transcript'>;

    const result = validateOutput(descriptor, undocumented);

    expect(result.ok).toBe(false);
    if (result.ok) {
      throw new Error('Expected validation to fail for undocumented status');
    }
    expect(result.message).toContain('Undocumented response status 418');
    expect(result.message).toContain('200, 404');
  });
});
