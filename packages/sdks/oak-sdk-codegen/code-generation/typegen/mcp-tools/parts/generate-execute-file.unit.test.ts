/**
 * Unit tests for generate-execute-file
 *
 * Verifies the generated invokeToolByName unwraps InvokeResult from
 * descriptor.invoke() and uses the actual HTTP status for error detection.
 */

import { describe, it, expect } from 'vitest';
import { generateExecuteFile } from './generate-execute-file.js';

describe('generateExecuteFile', () => {
  const toolNames = ['get-subjects', 'get-lessons-transcript', 'get-keywords'];
  const paginatedToolNames = new Set(['get-keywords']);

  it('unwraps invokeResult from descriptor.invoke()', () => {
    const code = generateExecuteFile(toolNames, paginatedToolNames);

    expect(code).toContain('const invokeResult = await descriptor.invoke(client, nestedArgs);');
    expect(code).not.toContain('const output = await descriptor.invoke(client, nestedArgs);');
  });

  it('validates invokeResult.payload not raw output', () => {
    const code = generateExecuteFile(toolNames, paginatedToolNames);

    expect(code).toContain('descriptor.validateOutput(invokeResult.payload)');
    expect(code).not.toContain('descriptor.validateOutput(output)');
  });

  it('throws TypeError for documented error statuses (httpStatus >= 400)', () => {
    const code = generateExecuteFile(toolNames, paginatedToolNames);

    expect(code).toContain('if (invokeResult.httpStatus >= 400)');
    expect(code).toContain('DOCUMENTED_ERROR_PREFIX');
    expect(code).toContain('httpStatus: invokeResult.httpStatus');
    expect(code).toContain('payload: invokeResult.payload');
  });

  it('returns validation.status for success responses', () => {
    const code = generateExecuteFile(toolNames, paginatedToolNames);

    expect(code).toContain('return { status: validation.status, data: validation.data };');
  });

  it('threads the pagination echo only through paginated tool wrappers', () => {
    const code = generateExecuteFile(toolNames, paginatedToolNames);

    const paginatedWrapper = code.slice(
      code.indexOf('async function invokeGetKeywordsTool'),
      code.indexOf('async function invokeGetLessonsTranscriptTool'),
    );
    const plainWrapper = code.slice(
      code.indexOf('async function invokeGetSubjectsTool'),
      code.indexOf('async function invokeToolByName'),
    );
    expect(paginatedWrapper).toContain(
      'return { status: validation.status, data: validation.data, pagination: invokeResult.pagination };',
    );
    expect(plainWrapper).toContain('return { status: validation.status, data: validation.data };');
    expect(plainWrapper).not.toContain('pagination');
  });

  it('preserves invokeResult.payload in output validation error cause', () => {
    const code = generateExecuteFile(toolNames, paginatedToolNames);

    expect(code).toContain('raw: invokeResult.payload');
  });

  it('uses Node ESM-compatible MCP SDK specifiers in generated imports', () => {
    const code = generateExecuteFile(toolNames, paginatedToolNames);

    expect(code).toContain(
      "import { CallToolRequestSchema, type CallToolRequest } from '@modelcontextprotocol/sdk/types.js';",
    );
  });
});
