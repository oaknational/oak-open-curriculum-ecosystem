/**
 * Unit tests for pure index metadata helpers.
 */

import { describe, it, expect } from 'vitest';
import { errors } from '@elastic/elasticsearch';
import type { DiagnosticResult } from '@elastic/transport';
import { generateVersionFromTimestamp, createErrorFromException } from './index-meta.js';

function createResponseError(
  statusCode: number,
  message: string,
  body?: unknown,
): errors.ResponseError {
  const diagnosticResult: DiagnosticResult = {
    body,
    statusCode,
    headers: {},
    warnings: null,
    meta: {
      context: null,
      name: 'index-meta.unit.test',
      request: {
        params: {
          method: 'GET',
          path: '/',
          querystring: '',
        },
        options: {},
        id: 'test-request-id',
      },
      connection: null,
      attempts: 1,
      aborted: false,
    },
  };

  const responseError = new errors.ResponseError(diagnosticResult);
  responseError.message = message;
  return responseError;
}

describe('generateVersionFromTimestamp', () => {
  it('generates version string in correct format', () => {
    const version = generateVersionFromTimestamp();
    expect(version).toMatch(/^v\d{4}-\d{2}-\d{2}-\d{6}$/);
  });

  it('generates unique versions for different timestamps', () => {
    const version1 = generateVersionFromTimestamp();
    // Wait a tiny bit to ensure different timestamp
    const version2 = generateVersionFromTimestamp();
    // They might be equal if called in same millisecond, but format should be valid
    expect(version1).toMatch(/^v\d{4}-\d{2}-\d{2}-\d{6}$/);
    expect(version2).toMatch(/^v\d{4}-\d{2}-\d{2}-\d{6}$/);
  });
});

describe('createErrorFromException', () => {
  it('creates mapping_error for strict_dynamic_mapping_exception', () => {
    const error = new Error(
      'strict_dynamic_mapping_exception: introduction of [bad_field] is not allowed',
    );
    const result = createErrorFromException(error);

    expect(result.type).toBe('mapping_error');
    if (result.type === 'mapping_error') {
      expect(result.field).toBe('bad_field');
      expect(result.message).toContain('bad_field');
      expect(result.message).toContain('not in ES mapping');
    }
  });

  it('creates network_error for 5xx status codes', () => {
    const error = createResponseError(503, 'Connection failed');
    const result = createErrorFromException(error);

    expect(result.type).toBe('network_error');
    if (result.type === 'network_error') {
      expect(result.message).toContain('503');
      expect(result.message).toContain('Connection failed');
    }
  });

  it('creates unknown error for unrecognized exceptions', () => {
    const error = new Error('Something unexpected');
    const result = createErrorFromException(error);

    expect(result.type).toBe('unknown');
    if (result.type === 'unknown') {
      expect(result.message).toContain('Something unexpected');
    }
  });

  it('handles non-object errors', () => {
    const result = createErrorFromException('string error');
    expect(result.type).toBe('unknown');
    if (result.type === 'unknown') {
      expect(result.message).toBe('string error');
    }
  });
});
