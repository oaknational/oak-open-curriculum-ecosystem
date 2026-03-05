import { describe, expect, it } from 'vitest';

import { createStubToolExecutionAdapter } from './stub-tool-executor.js';

describe('createStubToolExecutionAdapter', () => {
  it('successfully executes tools with no required parameters', async () => {
    const executeStubTool = createStubToolExecutionAdapter();

    // Test a simple tool that requires no params
    const result = await executeStubTool('get-key-stages', {});

    expect(result.ok).toBe(true);
    if (!result.ok) {
      throw new Error('Expected successful result');
    }
    expect(result.value.data).toBeDefined();
    expect(result.value.status).toBe(200);
  });

  it('successfully executes tools with required parameters when valid args provided', async () => {
    const executeStubTool = createStubToolExecutionAdapter();

    // Test with valid flat args
    const result = await executeStubTool('get-lessons-transcript', {
      lesson: 'test-lesson-slug',
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      throw new Error('Expected successful result');
    }
    expect(result.value.data).toBeDefined();
    expect(result.value.status).toBe(200);
  });

  it('returns parameter validation errors when arguments do not match the schema', async () => {
    const executeStubTool = createStubToolExecutionAdapter();

    // Use flat format with invalid types to trigger validation error
    const result = await executeStubTool('get-key-stages-subject-lessons', {
      keyStage: 123,
      subject: true,
    });

    expect(result.ok).toBe(false);
    if (result.ok) {
      throw new Error('Expected parameter validation error');
    }
    expect(result.error.message).toContain('Invalid request parameters');
  });

  it('returns parameter validation errors when required parameters are missing', async () => {
    const executeStubTool = createStubToolExecutionAdapter();

    // Test with missing required params
    const result = await executeStubTool('get-lessons-transcript', {});

    expect(result.ok).toBe(false);
    if (result.ok) {
      throw new Error('Expected parameter validation error');
    }
    expect(result.error.message).toContain('Invalid request parameters');
  });

  it('accepts optional params objects for generated tools', async () => {
    const executeStubTool = createStubToolExecutionAdapter();

    const result = await executeStubTool('get-subjects', { params: {} });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      throw new Error('Expected successful result');
    }
    expect(Array.isArray(result.value.data)).toBe(true);
    expect(result.value.status).toBe(200);
  });
});
