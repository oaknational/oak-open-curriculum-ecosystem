import { describe, it, expect } from 'vitest';
import type { OperationObject } from 'openapi3-ts/oas31';
import { literalName, collectDocumentedStatuses, compareStatuses } from './emit-index-helpers.js';

/**
 * Unit tests for emit-index helper functions.
 *
 * These pure functions are extracted from emit-index.ts for modularity.
 * Each function is tested in isolation without mocks.
 */

describe('literalName', () => {
  it('converts kebab-case to camelCase', () => {
    expect(literalName('get-lessons-summary')).toBe('getLessonsSummary');
  });

  it('handles single word tool names', () => {
    expect(literalName('get')).toBe('get');
  });

  it('handles multiple hyphens', () => {
    expect(literalName('get-key-stages-subject-units')).toBe('getKeyStagesSubjectUnits');
  });

  it('returns empty string unchanged', () => {
    expect(literalName('')).toBe('');
  });

  it('handles underscores as separators', () => {
    expect(literalName('get_lessons_summary')).toBe('getLessonsSummary');
  });
});

describe('collectDocumentedStatuses', () => {
  it('extracts status codes from responses', () => {
    const operation: OperationObject = {
      responses: {
        '200': { description: 'OK' },
        '404': { description: 'Not found' },
      },
    };
    expect(collectDocumentedStatuses(operation)).toEqual(['200', '404']);
  });

  it('returns ["200"] when no responses defined', () => {
    const operation: OperationObject = {};
    expect(collectDocumentedStatuses(operation)).toEqual(['200']);
  });

  it('sorts status codes numerically', () => {
    const operation: OperationObject = {
      responses: {
        '404': { description: 'Not found' },
        '200': { description: 'OK' },
        '500': { description: 'Error' },
      },
    };
    expect(collectDocumentedStatuses(operation)).toEqual(['200', '404', '500']);
  });

  it('places numeric codes before wildcard codes', () => {
    const operation: OperationObject = {
      responses: {
        '2XX': { description: 'Success range' },
        '200': { description: 'OK' },
        default: { description: 'Default' },
      },
    };
    const result = collectDocumentedStatuses(operation);
    expect(result[0]).toBe('200');
  });
});

describe('compareStatuses', () => {
  it('sorts numeric codes in ascending order', () => {
    expect(compareStatuses('200', '404')).toBeLessThan(0);
    expect(compareStatuses('500', '200')).toBeGreaterThan(0);
    expect(compareStatuses('200', '200')).toBe(0);
  });

  it('places numeric codes before non-numeric', () => {
    expect(compareStatuses('200', 'default')).toBeLessThan(0);
    expect(compareStatuses('default', '200')).toBeGreaterThan(0);
  });

  it('sorts non-numeric codes alphabetically', () => {
    expect(compareStatuses('2XX', 'default')).toBeLessThan(0);
    expect(compareStatuses('default', '2XX')).toBeGreaterThan(0);
  });
});

