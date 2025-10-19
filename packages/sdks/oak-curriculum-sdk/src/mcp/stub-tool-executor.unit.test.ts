import { describe, it, expect } from 'vitest';

import {
  createStubToolExecutor,
  getToolFromToolName,
  toolNames,
  validateCurriculumResponse,
  isValidationFailure,
} from '@oaknational/oak-curriculum-sdk';

describe('createStubToolExecutor', () => {
  it('returns schema-compliant responses for every tool', async () => {
    const executeStub = createStubToolExecutor();

    for (const toolName of toolNames) {
      const descriptor = getToolFromToolName(toolName);
      const result = await executeStub(toolName, {});

      expect(result.error).toBeUndefined();

      const validation = validateCurriculumResponse(
        descriptor.path,
        descriptor.method,
        200,
        result.data,
      );

      if (isValidationFailure(validation)) {
        throw new Error(
          `Stub response for ${toolName} failed validation: ${validation.firstMessage ?? 'unknown error'}`,
        );
      }
    }
  });
});
