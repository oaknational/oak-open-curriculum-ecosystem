import { describe, it, expect } from 'vitest';
import type { OperationObject } from 'openapi3-ts/oas31';
import { emitIndex } from './emit-index.js';

describe('emitIndex (invoke wrapper emission)', () => {
  it('includes typed outputSchema wiring on the descriptor', () => {
    const toolName = 'get-lessons-transcript';
    const path = '/lessons/{lesson}/transcript';
    const method = 'GET';
    const operation: OperationObject = { responses: {} };
    const code = emitIndex(toolName, path, method, operation);

    expect(code).toContain('const responseDescriptor = getDescriptorSchemaForEndpoint');
    expect(code).toContain("import type { ToolDescriptor } from '../definitions';");
    expect(code).toContain('toolOutputJsonSchema: responseDescriptor.json');
    expect(code).not.toContain('outputSchema: responseDescriptor.json');
    expect(code).toContain('zodOutputSchema: responseDescriptor.zod');
  });
});
