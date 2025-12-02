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

    // Verify prerequisite is included in description
    expect(code).toContain('PREREQUISITE');
    expect(code).toContain('get-ontology');
    // Verify original description is preserved
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
    expect(code).not.toContain('get-ontology');
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

    // Protected tools need domain context (get-ontology, get-help)
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
