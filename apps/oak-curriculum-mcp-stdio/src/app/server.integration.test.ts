import { describe, expect, it } from 'vitest';

import { getToolFromToolName } from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import { validateOutput } from './validation.js';
import { createFakeToolExecutionSuccessEnvelope } from '../test-helpers/fakes.js';

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

  it('treats documented error responses as valid results', () => {
    // Error schemas (400/401/404) share the same shape: { message, code, issues? }.
    // The validator iterates statuses in order and picks the first matching schema,
    // so a valid error body with status 400 matches the 400 schema first.
    // Distinguishing between error statuses by body shape alone is a known gap
    // tracked in the error-response classification plan.
    const result = validateOutput(descriptor, {
      status: 400,
      data: {
        message: 'Invalid lesson slug format',
        code: 'BAD_REQUEST',
      },
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      throw new Error('Expected validation to succeed for documented error response');
    }
    expect(result.result.status).toBe(400);
    expect(result.result.data).toEqual({
      message: 'Invalid lesson slug format',
      code: 'BAD_REQUEST',
    });
  });

  it('fails fast for undocumented statuses with informative messaging', () => {
    const undocumented = createFakeToolExecutionSuccessEnvelope<'get-lessons-transcript'>(418, {
      message: 'short and stout',
    });

    const result = validateOutput(descriptor, undocumented);

    expect(result.ok).toBe(false);
    if (result.ok) {
      throw new Error('Expected validation to fail for undocumented status');
    }
    expect(result.message).toContain('Undocumented response status 418');
    expect(result.message).toContain('200, 400, 401, 404');
  });
});
