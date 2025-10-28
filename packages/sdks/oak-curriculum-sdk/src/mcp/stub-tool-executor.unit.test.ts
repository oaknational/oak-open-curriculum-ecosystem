import { describe, expect, it } from 'vitest';
import type { SchemaObject } from 'openapi3-ts/oas31';

import { isValidationFailure, validateCurriculumResponse } from '../validation/index.js';
import {
  getToolFromToolName,
  type ToolName,
} from '../types/generated/api-schema/mcp-tools/generated/data/index.js';
import { createStubToolExecutionAdapter, listAvailableStubTools } from './stub-tool-executor.js';
import { sampleSchemaObject } from '../../type-gen/typegen/mcp-tools/schema-sample-core.js';

async function executeAndValidate(toolName: ToolName): Promise<void> {
  const executeStubTool = createStubToolExecutionAdapter();
  const descriptor = getToolFromToolName(toolName);
  const rawArgs = sampleSchemaObject(descriptor.toolInputJsonSchema as SchemaObject, () => {
    throw new Error('Unexpected $ref in tool input schema');
  });
  const parsedArgs = descriptor.toolZodSchema.parse(rawArgs);
  const result = await executeStubTool(toolName, parsedArgs);

  if (result.error) {
    throw new Error(`Stub execution failed for ${toolName}: ${result.error.message}`);
  }

  const validation = validateCurriculumResponse(
    descriptor.path,
    descriptor.method.toLowerCase() as 'get',
    200,
    result.data,
  );

  if (isValidationFailure(validation)) {
    const message = validation.firstMessage ?? 'unknown validation error';
    throw new Error(`Stub payload failed validation for ${toolName}: ${message}`);
  }
}

describe('createStubToolExecutionAdapter', () => {
  it('produces schema-compliant payloads for every generated stub tool', async () => {
    const available = listAvailableStubTools();
    expect(available.length).toBeGreaterThan(0);

    for (const toolName of available) {
      await executeAndValidate(toolName);
    }
  });

  it('returns parameter validation errors when arguments do not match the schema', async () => {
    const executeStubTool = createStubToolExecutionAdapter();
    const result = await executeStubTool('get-key-stages-subject-lessons', {
      params: { path: { keyStage: 123, subject: true } },
    });

    expect(result.error).toBeDefined();
    expect(result.error?.message).toContain('Invalid request parameters');
  });
});
