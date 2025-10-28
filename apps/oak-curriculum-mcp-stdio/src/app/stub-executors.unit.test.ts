import { describe, it, beforeEach, afterEach } from 'vitest';
import { resolveToolExecutors } from './stub-executors.js';
import {
  validateCurriculumResponse,
  isValidationFailure,
  type ToolName,
  type paths,
  type ToolExecutionResult,
} from '@oaknational/oak-curriculum-sdk';

type ValidPath = keyof paths;

async function expectSchemaCompliantExecution(
  toolName: ToolName,
  args: unknown,
  request: { path: ValidPath; method: 'get' },
): Promise<void> {
  const executors = resolveToolExecutors();
  if (!executors.executeMcpTool) {
    throw new Error('executeMcpTool is not defined');
  }
  const execution = await executors.executeMcpTool(toolName, args);
  if ('error' in execution && execution.error) {
    throw new Error(`Stub execution for ${toolName} failed: ${execution.error.message}`);
  }
  assertSuccessfulExecution(execution);
  const { status, data: payload } = execution as {
    status: number | string;
    data: unknown;
  };
  if (typeof status !== 'number') {
    throw new Error(`Stub execution for ${toolName} produced a non-numeric status: ${status}`);
  }
  const validation = validateCurriculumResponse(request.path, request.method, status, payload);
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

type SuccessfulExecution = Extract<ToolExecutionResult, { status: number | string; data: unknown }>;

function assertSuccessfulExecution(
  execution: ToolExecutionResult,
): asserts execution is SuccessfulExecution {
  if (!('status' in execution) || !('data' in execution)) {
    throw new Error('Execution did not return a successful payload');
  }
}
