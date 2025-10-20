import { describe, it, expect } from 'vitest';
import type { CallToolResult, TextContent } from '@modelcontextprotocol/sdk/types.js';

import { isValidationFailure, validateCurriculumResponse } from '../validation/index.js';
import {
  getToolFromToolName,
  isToolName,
} from '../types/generated/api-schema/mcp-tools/generated/data/index.js';
import { typeSafeEntries } from '../types/helpers/type-helpers.js';
import {
  createStubToolExecutor,
  stubbedToolResponses,
  type StubbedToolName,
} from '../types/generated/api-schema/mcp-tools/generated/stubs/index.js';

type TextualCallToolResult = Pick<CallToolResult, 'content' | 'isError'>;

function assertCallToolResult(result: unknown): asserts result is TextualCallToolResult {
  if (typeof result !== 'object' || result === null) {
    throw new TypeError('CallToolResult must be an object');
  }
  const candidate = result as { content?: unknown };
  if (!Array.isArray(candidate.content)) {
    throw new TypeError('CallToolResult content must be an array');
  }
}

function assertTextContent(content: unknown): asserts content is TextContent {
  if (typeof content !== 'object' || content === null) {
    throw new TypeError('Content entry must be an object');
  }
  const candidate = content as { type?: unknown; text?: unknown };
  if (candidate.type !== 'text' || typeof candidate.text !== 'string') {
    throw new TypeError('Expected text content in CallToolResult');
  }
}

function parseCallToolResult(result: unknown): unknown {
  assertCallToolResult(result);
  if (result.content.length === 0) {
    throw new TypeError('CallToolResult content must include at least one entry');
  }
  const [first] = result.content;
  assertTextContent(first);
  return JSON.parse(first.text);
}

function toLowerHttpMethod(method: string): 'get' | 'post' | 'put' | 'delete' | 'patch' {
  const lowered = method.toLowerCase();
  if (
    lowered !== 'get' &&
    lowered !== 'post' &&
    lowered !== 'put' &&
    lowered !== 'delete' &&
    lowered !== 'patch'
  ) {
    throw new TypeError(`Unsupported HTTP method for stub executor: ${method}`);
  }
  return lowered;
}

describe('generated stub tool executor', () => {
  it('returns schema-compliant payloads for every stubbed tool', async () => {
    const executeStubTool = createStubToolExecutor();

    for (const [name] of typeSafeEntries<Record<StubbedToolName, () => unknown>>(
      stubbedToolResponses,
    )) {
      if (!isToolName(name)) {
        throw new TypeError('Unexpected stub name: ' + String(name));
      }
      const descriptor = getToolFromToolName(name);
      const result = await executeStubTool(name);

      expect(result.isError).not.toBe(true);
      const payload = parseCallToolResult(result);
      const validation = validateCurriculumResponse(
        descriptor.path,
        toLowerHttpMethod(descriptor.method),
        200,
        payload,
      );

      if (isValidationFailure(validation)) {
        const message = validation.firstMessage ?? 'unknown error';
        throw new Error(`Stub payload failed validation for ${name}: ${message}`);
      }
    }
  });
});
