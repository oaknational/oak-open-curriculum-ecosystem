/**
 * Unit tests for auth log context schema.
 *
 * Validates the Zod schema that defines the shape of auth error log context
 * emitted by product code in `tool-handler-with-auth.ts`.
 */

import { describe, it, expect } from 'vitest';
import { authLogContextSchema } from './auth-log-context.js';

describe('authLogContextSchema', () => {
  it('accepts a valid auth error log context', () => {
    const context = {
      toolName: 'oak_getLesson',
      errorType: 'UNAUTHORIZED',
      description: 'Token expired',
    };
    const result = authLogContextSchema.safeParse(context);
    expect(result.success).toBe(true);
  });

  it('rejects context missing toolName', () => {
    const context = {
      errorType: 'UNAUTHORIZED',
      description: 'Token expired',
    };
    const result = authLogContextSchema.safeParse(context);
    expect(result.success).toBe(false);
  });

  it('rejects context missing errorType', () => {
    const context = {
      toolName: 'oak_getLesson',
      description: 'Token expired',
    };
    const result = authLogContextSchema.safeParse(context);
    expect(result.success).toBe(false);
  });

  it('rejects context missing description', () => {
    const context = {
      toolName: 'oak_getLesson',
      errorType: 'UNAUTHORIZED',
    };
    const result = authLogContextSchema.safeParse(context);
    expect(result.success).toBe(false);
  });
});
