import { describe, expect, it } from 'vitest';
import type { ResponseMapEntry } from './build-response-map.js';
import { emitResponseValidators } from './emit-response-validators.js';

describe('emitResponseValidators (descriptor helpers)', () => {
  it('embeds JSON schema literals and uses concatenation for descriptor keys', () => {
    const entries: readonly ResponseMapEntry[] = [
      {
        operationId: 'listLessons',
        status: '200',
        componentName: 'LessonsResponse',
        zodIdentifier: 'LessonsResponse',
        jsonSchema: { type: 'object', title: 'LessonsResponse' },
        path: '/lessons',
        colonPath: '/lessons',
        method: 'get',
        source: 'component',
      },
    ];

    const generated = emitResponseValidators(entries);

    expect(generated).toContain(`jsonSchema: {"type":"object","title":"LessonsResponse"}`);
    expect(generated).toContain(`const key = operationId + ':' + '200';`);
    expect(generated).not.toContain('${operationId}:200');
    expect(generated).toContain('return { zod, json };');
  });

  it('emits a frozen descriptor map keyed by operation and status', () => {
    const entries: readonly ResponseMapEntry[] = [
      {
        operationId: 'alphaOperation',
        status: '200',
        componentName: 'AlphaResponse',
        zodIdentifier: 'AlphaResponse',
        jsonSchema: { type: 'object', title: 'AlphaResponse' },
        path: '/alpha',
        colonPath: '/alpha',
        method: 'get',
        source: 'component',
      },
      {
        operationId: 'alphaOperation',
        status: '404',
        componentName: 'AlphaError',
        zodIdentifier: 'AlphaError',
        jsonSchema: { type: 'object', title: 'AlphaError' },
        path: '/alpha',
        colonPath: '/alpha',
        method: 'get',
        source: 'component',
      },
      {
        operationId: '*',
        status: '500',
        componentName: 'ServerError',
        zodIdentifier: 'ServerError',
        jsonSchema: { type: 'object', title: 'ServerError' },
        path: '*',
        colonPath: '*',
        method: '*',
        source: 'component',
      },
      {
        operationId: 'betaOperation',
        status: '200',
        componentName: 'BetaResponse',
        zodIdentifier: 'BetaResponse',
        jsonSchema: { type: 'object', title: 'BetaResponse' },
        path: '/beta',
        colonPath: '/beta',
        method: 'get',
        source: 'component',
      },
    ];

    const generated = emitResponseValidators(entries);

    expect(generated).toContain('const RESPONSE_DESCRIPTORS_BY_OPERATION_ID = Object.freeze({');
    expect(generated).toContain(
      "'alphaOperation': Object.freeze({\n    200: Object.freeze({\n      zod: RESPONSE_SCHEMA_BY_OPERATION_ID_AND_STATUS['alphaOperation:200'].schema,\n      json: RESPONSE_SCHEMA_BY_OPERATION_ID_AND_STATUS['alphaOperation:200'].jsonSchema,\n    }),",
    );
    expect(generated).toContain(
      "    404: Object.freeze({\n      zod: RESPONSE_SCHEMA_BY_OPERATION_ID_AND_STATUS['alphaOperation:404'].schema,\n      json: RESPONSE_SCHEMA_BY_OPERATION_ID_AND_STATUS['alphaOperation:404'].jsonSchema,\n    }),",
    );
    expect(generated).toContain(
      "    500: Object.freeze({\n      zod: RESPONSE_SCHEMA_BY_OPERATION_ID_AND_STATUS['*:500'].schema,\n      json: RESPONSE_SCHEMA_BY_OPERATION_ID_AND_STATUS['*:500'].jsonSchema,\n    }),",
    );
    expect(generated).toContain("'betaOperation': Object.freeze({\n    200: Object.freeze({");
    expect(generated).toContain(
      'export function getResponseDescriptorsByOperationId(operationId: OperationId):',
    );
    expect(generated).toContain(
      "throw new TypeError('No response descriptors for operationId: ' + String(operationId));",
    );
  });
});
