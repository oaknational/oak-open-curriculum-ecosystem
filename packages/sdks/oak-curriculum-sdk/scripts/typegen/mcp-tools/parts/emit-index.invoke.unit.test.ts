import { describe, it, expect } from 'vitest';
import type { OperationObject } from 'openapi-typescript';
import { emitIndex } from './emit-index.js';

describe('emitIndex (invoke wrapper emission)', () => {
  it('includes an invoke(client, unknown) wrapper', () => {
    const toolName = 'oak-get-lessons-transcript';
    const path = '/lessons/{lesson}/transcript';
    const method = 'GET';
    const operation: OperationObject = { responses: {} };
    const code = emitIndex(toolName, path, method, operation, ['lesson'], []);
    expect(code).toContain('const invoke = async (client: OakApiPathBasedClient');
    expect(code).toContain('return executor(client)(_params);');
  });
});
