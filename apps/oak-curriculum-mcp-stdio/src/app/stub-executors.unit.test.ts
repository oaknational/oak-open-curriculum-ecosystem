import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { resolveToolExecutors } from './stub-executors.js';
import {
  validateCurriculumResponse,
  isValidationFailure,
  type ToolName,
} from '@oaknational/oak-curriculum-sdk';

function extractPayload(result: unknown): unknown {
  if (typeof result !== 'object' || result === null) {
    return result;
  }
  if ('data' in result && result.data !== undefined) {
    return extractPayload(result.data);
  }
  return result;
}

async function expectSchemaCompliantExecution(
  toolName: ToolName,
  args: unknown,
  request: { path: string; method: 'get' },
): Promise<void> {
  const executors = resolveToolExecutors();
  if (!executors.executeMcpTool) {
    throw new Error('executeMcpTool is not defined');
  }
  const execution = await executors.executeMcpTool(toolName, args);
  expect(execution.error).toBeUndefined();
  const payload = extractPayload(execution.data);
  const validation = validateCurriculumResponse(request.path, request.method, 200, payload);
  if (isValidationFailure(validation)) {
    throw new Error(
      `Stub execution for ${toolName} failed schema validation: ${validation.firstMessage ?? 'unknown test error'}`,
    );
  }
}

describe('resolveToolExecutors', () => {
  const originalValue = process.env.OAK_CURRICULUM_MCP_USE_STUB_TOOLS;

  beforeEach(() => {
    process.env.OAK_CURRICULUM_MCP_USE_STUB_TOOLS = 'true';
  });

  afterEach(() => {
    process.env.OAK_CURRICULUM_MCP_USE_STUB_TOOLS = originalValue;
  });

  it('produces schema-compliant key stage data', async () => {
    await expectSchemaCompliantExecution(
      'get-key-stages',
      { params: {} },
      { path: '/key-stages', method: 'get' },
    );
  });

  it('produces schema-compliant lesson search data', async () => {
    await expectSchemaCompliantExecution(
      'get-search-lessons',
      { params: { query: { q: 'fractions' } } },
      { path: '/search/lessons', method: 'get' },
    );
  });

  it('produces schema-compliant transcript search data', async () => {
    await expectSchemaCompliantExecution(
      'get-search-transcripts',
      { params: { query: { q: 'fractions' } } },
      { path: '/search/transcripts', method: 'get' },
    );
  });

  it('produces schema-compliant sequence unit data', async () => {
    await expectSchemaCompliantExecution(
      'get-sequences-units',
      { params: { path: { sequence: 'english-primary' } } },
      { path: '/sequences/{sequence}/units', method: 'get' },
    );
  });

  it('produces schema-compliant key stage subject lessons data', async () => {
    await expectSchemaCompliantExecution(
      'get-key-stages-subject-lessons',
      {
        params: { path: { keyStage: 'ks1', subject: 'english' } },
      },
      { path: '/key-stages/{keyStage}/subject/{subject}/lessons', method: 'get' },
    );
  });
});
