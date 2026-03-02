/**
 * Unit tests for the generated `classifyHttpError` function.
 *
 * These tests verify the GENERATED output from `generate-error-types.ts`.
 * If a test fails, the fix belongs in the generator template, not the
 * generated file.
 *
 * @see generate-error-types.ts - the generator template (source of truth)
 * @see ../../../src/types/generated/api-schema/error-types/sdk-error-types.ts - generated output
 */
import { describe, expect, it } from 'vitest';

import {
  classifyHttpError,
  classifyException,
  formatSdkError,
  isRecoverableError,
} from '../../../src/types/generated/api-schema/error-types/sdk-error-types.js';

describe('classifyHttpError', () => {
  it('classifies 404 as not_found', () => {
    const result = classifyHttpError(404, 'some-lesson', 'lesson', 'Not Found');

    expect(result).toEqual({
      kind: 'not_found',
      resource: 'some-lesson',
      resourceType: 'lesson',
    });
  });

  it('classifies 451 as legally_restricted for transcript resources', () => {
    const result = classifyHttpError(
      451,
      'greetings-and-introductions',
      'transcript',
      'Transcript not available',
    );

    expect(result).toEqual({
      kind: 'legally_restricted',
      resource: 'greetings-and-introductions',
      resourceType: 'transcript',
    });
  });

  it('classifies 451 as legally_restricted regardless of resource type', () => {
    const result = classifyHttpError(451, 'pythagoras-theorem', 'lesson', 'Unavailable');

    expect(result).toEqual({
      kind: 'legally_restricted',
      resource: 'pythagoras-theorem',
      resourceType: 'lesson',
    });
  });

  it('classifies 429 as rate_limited', () => {
    const result = classifyHttpError(429, 'some-lesson', 'lesson', 'Too many requests');

    expect(result).toEqual({
      kind: 'rate_limited',
      resource: 'some-lesson',
      retryAfterMs: 60_000,
    });
  });

  it('classifies 500 as server_error', () => {
    const result = classifyHttpError(500, 'some-lesson', 'lesson', 'Internal Server Error');

    expect(result).toEqual({
      kind: 'server_error',
      status: 500,
      resource: 'some-lesson',
      message: 'Internal Server Error',
    });
  });

  it('classifies 502 as server_error', () => {
    const result = classifyHttpError(502, 'some-lesson', 'lesson', 'Bad Gateway');

    expect(result).toEqual({
      kind: 'server_error',
      status: 502,
      resource: 'some-lesson',
      message: 'Bad Gateway',
    });
  });

  it('classifies 503 as server_error', () => {
    const result = classifyHttpError(503, 'some-lesson', 'lesson', 'Service Unavailable');

    expect(result).toEqual({
      kind: 'server_error',
      status: 503,
      resource: 'some-lesson',
      message: 'Service Unavailable',
    });
  });

  it('classifies 504 as server_error', () => {
    const result = classifyHttpError(504, 'some-lesson', 'lesson', 'Gateway Timeout');

    expect(result).toEqual({
      kind: 'server_error',
      status: 504,
      resource: 'some-lesson',
      message: 'Gateway Timeout',
    });
  });

  it('classifies unknown status codes as network_error', () => {
    const result = classifyHttpError(418, 'some-lesson', 'lesson', "I'm a teapot");

    expect(result.kind).toBe('network_error');
  });

  it('does not conflate 404 and 451', () => {
    const notFound = classifyHttpError(404, 'slug', 'lesson', 'Not Found');
    const restricted = classifyHttpError(451, 'slug', 'lesson', 'Unavailable For Legal Reasons');

    expect(notFound.kind).not.toBe(restricted.kind);
  });
});

describe('classifyException', () => {
  it('parses 451 from error message and classifies as legally_restricted', () => {
    const error = new Error('SDK request failed: 451 Unavailable For Legal Reasons');
    const result = classifyException(error, 'some-lesson', 'transcript');

    expect(result).toEqual({
      kind: 'legally_restricted',
      resource: 'some-lesson',
      resourceType: 'transcript',
    });
  });

  it('returns network_error for non-Error values', () => {
    const result = classifyException('connection refused', 'some-lesson', 'lesson');

    expect(result.kind).toBe('network_error');
  });

  it('returns network_error for errors without a status code', () => {
    const error = new Error('Connection timed out');
    const result = classifyException(error, 'some-lesson', 'lesson');

    expect(result.kind).toBe('network_error');
  });
});

describe('isRecoverableError', () => {
  it('treats legally_restricted as recoverable', () => {
    const error = classifyHttpError(451, 'some-lesson', 'transcript', 'Unavailable');

    expect(isRecoverableError(error)).toBe(true);
  });

  it('treats not_found as recoverable', () => {
    const error = classifyHttpError(404, 'some-lesson', 'lesson', 'Not Found');

    expect(isRecoverableError(error)).toBe(true);
  });

  it('treats server_error as recoverable', () => {
    const error = classifyHttpError(500, 'some-lesson', 'lesson', 'Internal Server Error');

    expect(isRecoverableError(error)).toBe(true);
  });

  it('treats network_error as not recoverable', () => {
    const error = classifyHttpError(418, 'some-lesson', 'lesson', 'Teapot');

    expect(isRecoverableError(error)).toBe(false);
  });
});

describe('formatSdkError', () => {
  it('formats legally_restricted errors distinctly from not_found', () => {
    const restricted = classifyHttpError(451, 'greetings', 'transcript', 'Unavailable');
    const notFound = classifyHttpError(404, 'greetings', 'transcript', 'Not Found');

    const restrictedMsg = formatSdkError(restricted);
    const notFoundMsg = formatSdkError(notFound);

    expect(restrictedMsg).toContain('legally restricted');
    expect(restrictedMsg).toContain('greetings');
    expect(notFoundMsg).toContain('not found');
    expect(notFoundMsg).toContain('greetings');
    expect(restrictedMsg).not.toBe(notFoundMsg);
  });
});
