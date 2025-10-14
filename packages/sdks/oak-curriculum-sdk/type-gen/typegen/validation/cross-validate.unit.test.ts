import { describe, it, expect } from 'vitest';
import type { OpenAPIObject } from 'openapi3-ts/oas31';
import { crossValidateResponseMap, crossValidatePaths } from './cross-validate.js';

describe('cross-validate', () => {
  const base: OpenAPIObject = {
    openapi: '3.0.0',
    info: { title: 't', version: '1' },
    paths: {
      '/things/{id}': {
        get: {
          operationId: 'getThings-getThing',
          responses: {
            200: {
              description: 'ok',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Thing' },
                },
              },
            },
          },
        },
      },
    },
    components: { schemas: {} },
  };

  it('validates reversible path transforms and allowed methods', () => {
    expect(() => {
      crossValidatePaths(base);
    }).not.toThrow();
  });

  it('validates response map completeness', () => {
    const ok = [
      {
        operationId: 'getThings-getThing',
        status: '200',
        componentName: 'Thing',
      },
    ] as const;
    expect(() => {
      crossValidateResponseMap(base, ok);
    }).not.toThrow();

    const missing = [] as const;
    expect(() => {
      crossValidateResponseMap(base, missing);
    }).toThrow();
  });

  it('fails when response map contains extra unexpected entries', () => {
    const extra = [
      {
        operationId: 'nonExistent-op',
        status: '200',
        componentName: 'Nope',
      },
    ] as const;
    expect(() => {
      crossValidateResponseMap(base, extra);
    }).toThrow();
  });

  it('error message includes Missing/Extra summaries for easier debugging', () => {
    const missing: readonly never[] = [] as const;
    // Construct a set with one extra (not present in schema)
    const extra = [
      {
        operationId: 'nonExistent-op',
        status: '404',
        componentName: 'NotFound',
      },
    ] as const;
    try {
      crossValidateResponseMap(base, extra);
      expect(false).toBe(true); // should not reach
    } catch (e) {
      const msg = String(e);
      expect(msg.includes('Response map cross‑validation failed.')).toBe(true);
      expect(msg.includes('Extra')).toBe(true);
      // Now trigger missing by providing empty entries where base expects one
      try {
        crossValidateResponseMap(base, missing);
        expect(false).toBe(true);
      } catch (e2) {
        const msg2 = String(e2);
        expect(msg2.includes('Missing')).toBe(true);
      }
    }
  });
});
