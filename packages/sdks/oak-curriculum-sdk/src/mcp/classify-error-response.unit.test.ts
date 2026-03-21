/**
 * Unit tests for error classification pure functions.
 *
 * These test the classification logic in isolation, covering edge cases
 * that the integration-level executeToolCall tests do not reach.
 */

import { describe, it, expect } from 'vitest';
import {
  classifyDocumentedErrorResponse,
  classifyUndocumentedResponse,
} from './classify-error-response.js';
import { UndocumentedResponseError } from '@oaknational/sdk-codegen/mcp-tools';
import { McpToolError } from './error-types.js';

describe('classifyDocumentedErrorResponse', () => {
  const toolName = 'get-lessons-transcript' as const;

  it('classifies 401 as AUTHENTICATION_REQUIRED with upstream message', () => {
    const result = classifyDocumentedErrorResponse(
      401,
      { message: 'Token invalid', code: 'UNAUTHORIZED' },
      toolName,
    );

    expect(result).toBeInstanceOf(McpToolError);
    expect(result.code).toBe('AUTHENTICATION_REQUIRED');
    expect(result.message).toBe('Token invalid');
  });

  it('classifies 401 with fallback message when payload has no message', () => {
    const result = classifyDocumentedErrorResponse(401, {}, toolName);

    expect(result.code).toBe('AUTHENTICATION_REQUIRED');
    expect(result.message).toBe('Authentication required');
  });

  it('classifies 404 as RESOURCE_NOT_FOUND with upstream message', () => {
    const result = classifyDocumentedErrorResponse(
      404,
      { message: 'Lesson not found', code: 'NOT_FOUND' },
      toolName,
    );

    expect(result.code).toBe('RESOURCE_NOT_FOUND');
    expect(result.message).toBe('Lesson not found');
  });

  it('classifies 404 with fallback message when payload has no message', () => {
    const result = classifyDocumentedErrorResponse(404, null, toolName);

    expect(result.code).toBe('RESOURCE_NOT_FOUND');
    expect(result.message).toBe('Resource not found');
  });

  it('classifies 400 with blocked data.cause as CONTENT_NOT_AVAILABLE', () => {
    const payload = {
      message: 'Lesson not available',
      data: { cause: 'Error: subject and unit are blocked for assets' },
      code: 'BAD_REQUEST',
    };
    const result = classifyDocumentedErrorResponse(400, payload, toolName);

    expect(result.code).toBe('CONTENT_NOT_AVAILABLE');
    expect(result.message).toContain('copyright restrictions');
  });

  it('classifies 400 without blocked cause as UPSTREAM_API_ERROR', () => {
    const result = classifyDocumentedErrorResponse(
      400,
      { message: 'Invalid request', code: 'BAD_REQUEST' },
      toolName,
    );

    expect(result.code).toBe('UPSTREAM_API_ERROR');
    expect(result.message).toBe('Invalid request');
  });

  it('classifies unknown 4xx (e.g. 422) as UPSTREAM_API_ERROR', () => {
    const result = classifyDocumentedErrorResponse(
      422,
      { message: 'Unprocessable', code: 'ERROR' },
      toolName,
    );

    expect(result.code).toBe('UPSTREAM_API_ERROR');
    expect(result.message).toBe('Unprocessable');
  });

  it('classifies unknown 4xx with no message using status in fallback', () => {
    const result = classifyDocumentedErrorResponse(429, undefined, toolName);

    expect(result.code).toBe('UPSTREAM_API_ERROR');
    expect(result.message).toBe('Upstream API error (429)');
  });

  it('does not classify as content-blocked when data.cause is a number', () => {
    const payload = { message: 'Error', data: { cause: 42 }, code: 'BAD_REQUEST' };
    const result = classifyDocumentedErrorResponse(400, payload, toolName);

    expect(result.code).toBe('UPSTREAM_API_ERROR');
  });

  it('does not classify as content-blocked when data is null', () => {
    const payload = { message: 'Error', data: null, code: 'BAD_REQUEST' };
    const result = classifyDocumentedErrorResponse(400, payload, toolName);

    expect(result.code).toBe('UPSTREAM_API_ERROR');
  });

  it('preserves toolName on all classifications', () => {
    const r401 = classifyDocumentedErrorResponse(401, {}, toolName);
    const r404 = classifyDocumentedErrorResponse(404, {}, toolName);
    const r400 = classifyDocumentedErrorResponse(400, {}, toolName);

    expect(r401.toolName).toBe(toolName);
    expect(r404.toolName).toBe(toolName);
    expect(r400.toolName).toBe(toolName);
  });
});

describe('classifyUndocumentedResponse', () => {
  const toolName = 'get-rate-limit' as const;

  it('classifies 5xx as UPSTREAM_SERVER_ERROR', () => {
    const error = new UndocumentedResponseError(502, 'op-1', ['200'], { message: 'Bad gateway' });
    const result = classifyUndocumentedResponse(error, toolName);

    expect(result).toBeInstanceOf(McpToolError);
    expect(result.code).toBe('UPSTREAM_SERVER_ERROR');
    expect(result.message).toContain('Bad gateway');
  });

  it('classifies 4xx with blocked body as CONTENT_NOT_AVAILABLE', () => {
    const body = {
      message: 'Lesson not available',
      data: { cause: 'Error: subject and unit are blocked for assets' },
    };
    const error = new UndocumentedResponseError(418, 'op-2', ['200'], body);
    const result = classifyUndocumentedResponse(error, toolName);

    expect(result.code).toBe('CONTENT_NOT_AVAILABLE');
  });

  it('classifies 4xx without blocked body as UPSTREAM_API_ERROR', () => {
    const error = new UndocumentedResponseError(418, 'op-3', ['200'], { message: 'Teapot' });
    const result = classifyUndocumentedResponse(error, toolName);

    expect(result.code).toBe('UPSTREAM_API_ERROR');
    expect(result.message).toContain('Teapot');
  });

  it('uses status in message when no upstream message available', () => {
    const error = new UndocumentedResponseError(503, 'op-4', ['200'], undefined);
    const result = classifyUndocumentedResponse(error, toolName);

    expect(result.code).toBe('UPSTREAM_SERVER_ERROR');
    expect(result.message).toContain('503');
  });
});
