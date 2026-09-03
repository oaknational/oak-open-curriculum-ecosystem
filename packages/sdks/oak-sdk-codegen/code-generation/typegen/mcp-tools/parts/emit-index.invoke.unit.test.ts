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

  it('does not emit any type assertions in invoke', () => {
    const operation: OperationObject = {
      responses: { '200': { description: 'ok' } },
    };
    const code = emitIndex('get-subjects', '/subjects', 'GET', 'op-3', operation);

    const invokeBody = code.slice(code.indexOf('invoke:'), code.indexOf('toolZodSchema,'));
    expect(invokeBody).not.toMatch(/\bas\b(?!\s+const)/);
  });

  it('invoke returns InvokeResult with httpStatus and payload', () => {
    const operation: OperationObject = {
      responses: { '200': { description: 'ok' } },
    };
    const code = emitIndex('get-subjects', '/subjects', 'GET', 'op-invoke-result', operation);

    expect(code).toContain('return { httpStatus: status, payload };');
    expect(code).not.toContain('return payload;');
  });

  it('non-paginated operations carry no pagination echo', () => {
    const operation: OperationObject = {
      responses: { '200': { description: 'ok' } },
    };
    const code = emitIndex('get-subjects', '/subjects', 'GET', 'op-plain-list', operation);

    expect(code).not.toContain('derivePaginationFromLinkHeader');
    expect(code).not.toContain('pagination');
  });

  it('paginated operations derive the pagination echo from the Link header', () => {
    const operation: OperationObject = {
      responses: { '200': { description: 'ok' } },
    };
    const code = emitIndex('get-keywords', '/keywords', 'GET', 'op-paginated', operation, true);

    expect(code).toContain(
      "const pagination = derivePaginationFromLinkHeader(response.response.headers.get('link'));",
    );
    expect(code).toContain('return { httpStatus: status, payload, pagination };');
    expect(code).not.toContain('return { httpStatus: status, payload };');
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
    const toolName = 'get-rate-limit'; // In PUBLIC_TOOLS
    const path = '/rate-limit';
    const method = 'GET';
    const operation: OperationObject = {
      responses: { '200': { description: 'ok' } },
    };

    const code = emitIndex(toolName, path, method, 'getRateLimit', operation);

    expect(code).toContain('securitySchemes:');
    expect(code).toContain("{ type: 'noauth' }");
    expect(code).not.toContain("type: 'oauth2'");
  });

  it('never emits prerequisite guidance in any description (MCP-300: instructions field owns orientation)', () => {
    // One protected and one public tool: the removed guidance was auth-gated,
    // so both sides of that old distinction must emit clean.
    const protectedCode = emitIndex(
      'get-lessons-summary', // Not in PUBLIC_TOOLS - requires auth
      '/lessons/{lesson}/summary',
      'GET',
      'getLessonsSummary',
      {
        summary: 'Lesson summary',
        description: 'This endpoint returns a summary for a given lesson.',
        responses: { '200': { description: 'ok' } },
      },
    );
    const publicCode = emitIndex('get-rate-limit', '/rate-limit', 'GET', 'getRateLimit', {
      summary: 'Rate limit status',
      description: 'Current rate-limit window for the authenticated principal.',
      responses: { '200': { description: 'ok' } },
    });

    for (const code of [protectedCode, publicCode]) {
      expect(code).not.toMatch(/prerequisite:/i);
      expect(code).not.toMatch(/you must call/i);
    }
    expect(protectedCode).toContain('Lesson summary');
    expect(protectedCode).toContain('This tool returns a summary');
    expect(publicCode).toContain('Rate limit status');
    expect(publicCode).toContain('Current rate-limit window');
  });

  it('emits requiresDomainContext: true for protected tools', () => {
    const toolName = 'get-lessons'; // Not in PUBLIC_TOOLS - requires auth
    const path = '/lessons';
    const method = 'GET';
    const operation: OperationObject = {
      responses: { '200': { description: 'ok' } },
    };

    const code = emitIndex(toolName, path, method, 'getLessons', operation);

    // Emitted to satisfy the descriptor contract; no runtime consumer
    // reads the field (retirement tracked as MCP-375).
    expect(code).toContain('requiresDomainContext: true');
  });

  it('emits requiresDomainContext: false for noauth tools', () => {
    const toolName = 'get-rate-limit'; // In PUBLIC_TOOLS - noauth
    const path = '/rate-limit';
    const method = 'GET';
    const operation: OperationObject = {
      responses: { '200': { description: 'ok' } },
    };

    const code = emitIndex(toolName, path, method, 'getRateLimit', operation);

    // Emitted to satisfy the descriptor contract; no runtime consumer
    // reads the field (retirement tracked as MCP-375).
    expect(code).toContain('requiresDomainContext: false');
  });
});
