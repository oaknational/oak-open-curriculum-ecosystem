import { describe, it, expect } from 'vitest';
import { toRetrievalError } from './retrieval-error.js';

class StatusCodeError extends Error {
  readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

describe('toRetrievalError', () => {
  it('maps a regular Error to es_error with message', () => {
    const error = new Error('search phase execution exception');
    const result = toRetrievalError(error);

    expect(result).toStrictEqual({
      type: 'es_error',
      message: 'search phase execution exception',
      statusCode: undefined,
    });
  });

  it('maps an Error with statusCode property to es_error with status', () => {
    const error = new StatusCodeError('index_not_found_exception', 404);
    const result = toRetrievalError(error);

    expect(result).toStrictEqual({
      type: 'es_error',
      message: 'index_not_found_exception',
      statusCode: 404,
    });
  });

  it('maps an AbortError to timeout', () => {
    const error = new DOMException('The operation was aborted', 'AbortError');
    const result = toRetrievalError(error);

    expect(result).toStrictEqual({
      type: 'timeout',
      message: 'The operation was aborted',
    });
  });

  it('maps a TimeoutError to timeout', () => {
    const error = new Error('Request timed out');
    error.name = 'TimeoutError';
    const result = toRetrievalError(error);

    expect(result).toStrictEqual({
      type: 'timeout',
      message: 'Request timed out',
    });
  });

  it('maps an Error with 408 status code to timeout', () => {
    const error = new StatusCodeError('Request Timeout', 408);
    const result = toRetrievalError(error);

    expect(result).toStrictEqual({
      type: 'timeout',
      message: 'Request Timeout',
    });
  });

  it('maps a non-Error value to es_error with stringified message', () => {
    const result = toRetrievalError('string error');

    expect(result).toStrictEqual({
      type: 'es_error',
      message: 'string error',
      statusCode: undefined,
    });
  });
});
