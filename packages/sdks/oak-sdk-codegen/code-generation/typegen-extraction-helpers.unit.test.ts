import { describe, it, expect, vi } from 'vitest';
import {
  initializePathParameters,
  processOperationParameters,
  extractValidParameters,
} from './typegen-extraction-helpers';
import type { ExtractionContext } from './typegen/extraction-types.js';
import type { OpenAPIObject } from 'openapi3-ts/oas31';
import {
  createFakePathItemObject,
  createFakeOperationObject,
  createFakeParameterObject,
} from './test-fakes.js';

// Helper to create a minimal valid OpenAPI object
function createMockOpenAPIObject(): OpenAPIObject {
  return {
    openapi: '3.0.0',
    info: {
      title: 'Test API',
      version: '1.0.0',
    },
    paths: {},
  };
}

describe('typegen-extraction-helpers', () => {
  describe('initializePathParameters', () => {
    it('should initialize empty sets for each parameter name', () => {
      const context: ExtractionContext = {
        root: createMockOpenAPIObject(),
        pathParameters: {},
        validCombinations: {},
      };
      const parameterNames = ['id', 'slug'];

      initializePathParameters(parameterNames, context);

      expect(context.pathParameters.id).toBeInstanceOf(Set);
      expect(context.pathParameters.slug).toBeInstanceOf(Set);
      expect(context.pathParameters.id.size).toBe(0);
      expect(context.pathParameters.slug.size).toBe(0);
    });

    it('should not overwrite existing sets', () => {
      const existingSet = new Set(['value1']);
      const context: ExtractionContext = {
        root: createMockOpenAPIObject(),
        pathParameters: { id: existingSet },
        validCombinations: {},
      };
      const parameterNames = ['id', 'slug'];

      initializePathParameters(parameterNames, context);

      expect(context.pathParameters.id).toBe(existingSet);
      expect(context.pathParameters.id.has('value1')).toBe(true);
      expect(context.pathParameters.slug).toBeInstanceOf(Set);
    });
  });

  describe('extractValidParameters', () => {
    it('should filter out invalid parameters', () => {
      const params: unknown[] = [
        { name: 'valid', in: 'path' },
        null,
        undefined,
        { name: 'query', in: 'query' },
        'invalid',
      ];

      const result = extractValidParameters(params);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ name: 'valid', in: 'path' });
      expect(result[1]).toEqual({ name: 'query', in: 'query' });
    });

    it('should return empty array for undefined input', () => {
      const result = extractValidParameters(undefined);
      expect(result).toEqual([]);
    });

    it('should return empty array for empty input', () => {
      const result = extractValidParameters([]);
      expect(result).toEqual([]);
    });
  });

  describe('processOperationParameters', () => {
    it('should process parameters from all operations in path item', () => {
      const mockProcessParameterList = vi.fn();
      const pathItem = createFakePathItemObject({
        get: createFakeOperationObject({
          parameters: [createFakeParameterObject({ name: 'id', in: 'path' })],
        }),
        post: createFakeOperationObject({
          parameters: [createFakeParameterObject({ name: 'filter', in: 'query' })],
        }),
      });
      const context: ExtractionContext = {
        root: createMockOpenAPIObject(),
        pathParameters: {},
        validCombinations: {},
      };

      processOperationParameters(pathItem, context, mockProcessParameterList);

      expect(mockProcessParameterList).toHaveBeenCalledTimes(2);
      expect(mockProcessParameterList).toHaveBeenCalledWith([{ name: 'id', in: 'path' }], context);
      expect(mockProcessParameterList).toHaveBeenCalledWith(
        [{ name: 'filter', in: 'query' }],
        context,
      );
    });

    it('should handle operations without parameters', () => {
      const mockProcessParameterList = vi.fn();
      const pathItem = createFakePathItemObject({
        get: {
          responses: {},
        },
        post: {
          parameters: undefined,
          responses: {},
        },
      });
      const context: ExtractionContext = {
        root: createMockOpenAPIObject(),
        pathParameters: {},
        validCombinations: {},
      };

      processOperationParameters(pathItem, context, mockProcessParameterList);

      expect(mockProcessParameterList).toHaveBeenCalledTimes(2);
      expect(mockProcessParameterList).toHaveBeenCalledWith([], context);
    });
  });
});
