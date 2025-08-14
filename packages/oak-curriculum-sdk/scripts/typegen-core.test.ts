import { describe, it, expect } from 'vitest';
import type { OpenAPI3 } from 'openapi-typescript';
import { createFileMap, generatePathParametersContent } from './typegen-core';

describe('typegen-core', () => {
  describe('createFileMap', () => {
    it('should create a map of filenames to content', () => {
      const jsonSchema = '{"test": "value"}';
      const tsTypesContent = 'export type Test = string;';
      const pathParameterContent = 'export const PATHS = {};';

      const result = createFileMap(jsonSchema, tsTypesContent, pathParameterContent);

      expect(result).toHaveProperty('api-schema.json');
      expect(result).toHaveProperty('api-schema.ts');
      expect(result).toHaveProperty('api-paths-types.ts');
      expect(result).toHaveProperty('path-parameters.ts');

      expect(result['api-schema.json']).toBe(jsonSchema);
      expect(result['api-paths-types.ts']).toBe(tsTypesContent);
      expect(result['path-parameters.ts']).toBe(pathParameterContent);
    });

    it('should generate TypeScript schema content for api-schema.ts', () => {
      const jsonSchema = '{"openapi": "3.0.0"}';
      const tsTypesContent = 'types';
      const pathParameterContent = 'parameters';

      const result = createFileMap(jsonSchema, tsTypesContent, pathParameterContent);

      expect(result['api-schema.ts']).toContain('export const schema =');
      expect(result['api-schema.ts']).toContain(jsonSchema);
      expect(result['api-schema.ts']).toContain('as const');
    });
  });

  describe('generatePathParametersContent', () => {
    it('should combine all sections into a single string', () => {
      const schema: OpenAPI3 = {
        openapi: '3.0.0',
        info: { title: 'Test', version: '1.0.0' },
        paths: {
          '/test': {},
        },
      };

      const parameters = {
        keyStage: ['ks1', 'ks2'],
        subject: ['maths'],
      };

      const validCombinations = {
        NO_PARAMS: {
          '/test': { path: '/test', paramsKey: 'NO_PARAMS' },
        },
      };

      const result = generatePathParametersContent(schema, parameters, validCombinations);

      // Check for key sections
      expect(result).toContain('GENERATED FILE - DO NOT EDIT');
      expect(result).toContain('export const PATHS =');
      expect(result).toContain('export function isValidPath');
      expect(result).toContain('export const KEY_STAGES');
      expect(result).toContain('export const PATH_PARAMETERS');
      expect(result).toContain('export const VALID_PATHS_BY_PARAMETERS');
    });

    it('should join sections with newlines', () => {
      const schema: OpenAPI3 = {
        openapi: '3.0.0',
        info: { title: 'Test', version: '1.0.0' },
        paths: {},
      };

      const result = generatePathParametersContent(schema, {}, {});

      // Should have multiple sections separated by newlines
      const sections = result.split('\n\n');
      expect(sections.length).toBeGreaterThan(1);
    });
  });
});
