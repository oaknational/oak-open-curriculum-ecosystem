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
    expect(code).toContain('toolOutputJsonSchema: primaryResponseDescriptor.json');
  });

  it('throws UndocumentedResponseError instead of TypeError for undocumented statuses', () => {
    const operation: OperationObject = {
      responses: {
        '200': { description: 'ok' },
        '404': { description: 'not found' },
      },
    };
    const code = emitIndex(
      'get-lessons-transcript',
      '/lessons/{lesson}/transcript',
      'GET',
      'op-undoc',
      operation,
    );

    expect(code).toContain('throw new UndocumentedResponseError(');
    expect(code).not.toContain('throw new TypeError(`Undocumented response status');
  });

  it('extracts response body before throwing for undocumented statuses', () => {
    const operation: OperationObject = {
      responses: { '200': { description: 'ok' } },
    };
    const code = emitIndex('get-subjects', '/subjects', 'GET', 'op-body', operation);

    const undocumentedBlock = code.slice(
      code.indexOf('if (!descriptorForStatus)'),
      code.indexOf('const payload'),
    );
    expect(undocumentedBlock).toContain('response.error');
    expect(undocumentedBlock).toContain('response.data');
  });

  it('emits STATUS_DISCRIMINANTS const map instead of toStatusDiscriminant function', () => {
    const operation: OperationObject = {
      responses: {
        '200': { description: 'ok' },
        '404': { description: 'not found' },
      },
    };
    const code = emitIndex(
      'get-lessons-transcript',
      '/lessons/{lesson}/transcript',
      'GET',
      'op-1',
      operation,
    );

    expect(code).toContain("const STATUS_DISCRIMINANTS = { '200': 200, '404': 404 } as const;");
    expect(code).not.toContain('function toStatusDiscriminant');
    expect(code).not.toContain('as StatusDiscriminant<T>');
    expect(code).toContain('STATUS_DISCRIMINANTS[statusKey]');
  });

  it('emits STATUS_DISCRIMINANTS for single-status tools', () => {
    const operation: OperationObject = {
      responses: { '200': { description: 'ok' } },
    };
    const code = emitIndex('get-subjects', '/subjects', 'GET', 'op-2', operation);

    expect(code).toContain("const STATUS_DISCRIMINANTS = { '200': 200 } as const;");
  });

  it('does not emit any type assertions in invoke (payload returned as unknown)', () => {
    const operation: OperationObject = {
      responses: { '200': { description: 'ok' } },
    };
    const code = emitIndex('get-subjects', '/subjects', 'GET', 'op-3', operation);

    const invokeBody = code.slice(code.indexOf('invoke:'), code.indexOf('toolZodSchema,'));
    expect(invokeBody).not.toMatch(/\bas\b(?!\s+const)/);
    expect(code).toContain('return payload;');
    expect(code).not.toContain('return payload as');
  });

  it('emits zero non-const type assertions anywhere in output', () => {
    const operation: OperationObject = {
      responses: {
        '200': { description: 'ok' },
        '404': { description: 'not found' },
      },
    };
    const code = emitIndex(
      'get-lessons-transcript',
      '/lessons/{lesson}/transcript',
      'GET',
      'op-4',
      operation,
    );

    const nonConstAs = code.match(/\bas\b(?!\s+const)/g);
    expect(nonConstAs).toBeNull();
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
    expect(code).toContain("{ type: 'oauth2', scopes: ['email'] }");

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

  it('includes PREREQUISITE guidance in description for protected tools', () => {
    const toolName = 'get-lessons-summary'; // Not in PUBLIC_TOOLS - requires auth
    const path = '/lessons/{lesson}/summary';
    const method = 'GET';
    const operation: OperationObject = {
      summary: 'Lesson summary',
      description: 'This endpoint returns a summary for a given lesson.',
      responses: { '200': { description: 'ok' } },
    };

    const code = emitIndex(toolName, path, method, 'getLessonsSummary', operation);

    expect(code).toContain('PREREQUISITE');
    expect(code).toContain('Lesson summary');
    expect(code).toContain('This tool returns a summary');
  });

  it('does NOT include PREREQUISITE guidance for noauth tools', () => {
    const toolName = 'get-changelog'; // In PUBLIC_TOOLS - noauth
    const path = '/changelog';
    const method = 'GET';
    const operation: OperationObject = {
      summary: 'API Changelog',
      description: 'History of significant changes to the API.',
      responses: { '200': { description: 'ok' } },
    };

    const code = emitIndex(toolName, path, method, 'getChangelog', operation);

    // Verify prerequisite is NOT included
    expect(code).not.toContain('PREREQUISITE');
    // Verify original description is preserved
    expect(code).toContain('API Changelog');
    expect(code).toContain('History of significant changes');
  });

  it('does NOT include PREREQUISITE guidance for get-rate-limit', () => {
    const toolName = 'get-rate-limit'; // In PUBLIC_TOOLS - noauth
    const path = '/rate-limit';
    const method = 'GET';
    const operation: OperationObject = {
      summary: 'Rate limit status',
      description: 'Check your current rate limit status.',
      responses: { '200': { description: 'ok' } },
    };

    const code = emitIndex(toolName, path, method, 'getRateLimit', operation);

    expect(code).not.toContain('PREREQUISITE');
    expect(code).toContain('Rate limit status');
  });

  it('emits requiresDomainContext: true for protected tools', () => {
    const toolName = 'get-lessons'; // Not in PUBLIC_TOOLS - requires auth
    const path = '/lessons';
    const method = 'GET';
    const operation: OperationObject = {
      responses: { '200': { description: 'ok' } },
    };

    const code = emitIndex(toolName, path, method, 'getLessons', operation);

    // Protected tools need domain context (get-curriculum-model)
    expect(code).toContain('requiresDomainContext: true');
  });

  it('emits requiresDomainContext: false for noauth tools', () => {
    const toolName = 'get-changelog'; // In PUBLIC_TOOLS - noauth
    const path = '/changelog';
    const method = 'GET';
    const operation: OperationObject = {
      responses: { '200': { description: 'ok' } },
    };

    const code = emitIndex(toolName, path, method, 'getChangelog', operation);

    // Utility tools (noauth) don't need domain context
    expect(code).toContain('requiresDomainContext: false');
  });
});
