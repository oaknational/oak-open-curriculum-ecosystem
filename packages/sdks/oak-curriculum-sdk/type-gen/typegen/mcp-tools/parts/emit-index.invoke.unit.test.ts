import { describe, it, expect } from 'vitest';
import type { OperationObject } from 'openapi3-ts/oas31';
import { emitIndex } from './emit-index.js';

describe('emitIndex (invoke wrapper emission)', () => {
  it('wires multi-status handling and validation scaffolding', () => {
    const toolName = 'get-lessons-transcript';
    const path = '/lessons/{lesson}/transcript';
    const method = 'GET';
    const operation: OperationObject = {
      responses: {
        '200': { description: 'ok' },
        '404': { description: 'not found' },
      },
    };
    const code = emitIndex(toolName, path, method, 'operation-123', operation);

    expect(code).toContain(
      'const responseDescriptors = getResponseDescriptorsByOperationId(operationId);',
    );
    expect(code).toContain("const documentedStatuses = ['200', '404'] as const;");
    expect(code).toContain('const resolveDescriptorForStatus = (status: number) => {');
    expect(code).toContain('const status = response.response.status;');
    expect(code).toContain(
      'Undocumented response status ${String(status)} for operation-123. Documented statuses: 200, 404',
    );
    expect(code).toContain('toolOutputJsonSchema: primaryResponseDescriptor.json');
    expect(code).toContain(
      'attemptedStatuses.push({ status: toStatusDiscriminant(statusKey) as DocumentedStatusDiscriminant, issues: result.error.issues })',
    );
  });

  it('emits securitySchemes field for protected tools', () => {
    const toolName = 'get-lessons'; // Not in PUBLIC_TOOLS
    const path = '/lessons';
    const method = 'GET';
    const operation: OperationObject = {
      responses: { '200': { description: 'ok' } },
    };

    const code = emitIndex(toolName, path, method, 'getLessons', operation);

    // Verify securitySchemes field is present
    expect(code).toContain('securitySchemes:');

    // Verify OAuth2 scheme
    expect(code).toContain("{ type: 'oauth2', scopes: ['openid', 'email'] }");

    // Verify field ordering (after documentedStatuses)
    expect(code).toMatch(/documentedStatuses,[\s\S]*securitySchemes:/);
  });

  it('emits noauth scheme for PUBLIC_TOOLS', () => {
    const toolName = 'get-changelog'; // In PUBLIC_TOOLS
    const path = '/changelog';
    const method = 'GET';
    const operation: OperationObject = {
      responses: { '200': { description: 'ok' } },
    };

    const code = emitIndex(toolName, path, method, 'getChangelog', operation);

    expect(code).toContain('securitySchemes:');
    expect(code).toContain("{ type: 'noauth' }");
    expect(code).not.toContain("type: 'oauth2'");
  });
});
