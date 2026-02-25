import { describe, it, expect } from 'vitest';
import type { OpenAPIObject } from 'openapi3-ts/oas31';
import {
  createFileMap,
  generatePathParametersContent,
  postProcessTypesSource,
} from './codegen-core';

describe('codegen-core', () => {
  describe('createFileMap', () => {
    it('should create a map of filenames to content', () => {
      const sourceSchema: OpenAPIObject = {
        openapi: '3.0.0',
        info: { title: 'Test', version: '1.0.0' },
        paths: {},
      };
      const tsTypesContent = 'export type Test = string;';
      const pathParameterContent = 'export const PATHS = {};';
      const pathUtilsContent = 'export const DUMMY = 1;';

      const result = createFileMap(
        sourceSchema,
        sourceSchema,
        tsTypesContent,
        pathParameterContent,
        pathUtilsContent,
        'export const RESPONSE_MAP = new Map();',
        'export const REQUEST_PARAMETER_SCHEMAS = {};',
      );

      expect(result).toHaveProperty('api-schema-original.json');
      expect(result).toHaveProperty('api-schema-sdk.json');
      expect(result).toHaveProperty('api-schema-base.ts');
      expect(result).toHaveProperty('api-paths-types.ts');
      expect(result).toHaveProperty('path-parameters.ts');

      expect(typeof result['api-schema-original.json']).toBe('string');
      expect(typeof result['api-schema-sdk.json']).toBe('string');
      expect(result['api-paths-types.ts']).toBe(tsTypesContent);
      expect(result['path-parameters.ts']).toBe(pathParameterContent);
    });

    it('should include client-types.ts with OakApiPathBasedClient type alias', () => {
      const sourceSchema: OpenAPIObject = {
        openapi: '3.0.0',
        info: { title: 'Test', version: '1.0.0' },
        paths: {},
      };

      const result = createFileMap(
        sourceSchema,
        sourceSchema,
        'export type Test = string;',
        'export const PATHS = {};',
        'export const DUMMY = 1;',
        'export const RESPONSE_MAP = new Map();',
        'export const REQUEST_PARAMETER_SCHEMAS = {};',
      );

      expect(result).toHaveProperty('client-types.ts');
      expect(result['client-types.ts']).toContain('GENERATED FILE - DO NOT EDIT');
      expect(result['client-types.ts']).toContain(
        "import type { PathBasedClient } from 'openapi-fetch'",
      );
      expect(result['client-types.ts']).toContain(
        "import type { paths } from './api-paths-types.js'",
      );
      expect(result['client-types.ts']).toContain(
        'export type OakApiPathBasedClient = PathBasedClient<paths>',
      );
    });

    it('should generate TypeScript schema content for api-schema-base.ts', () => {
      const sourceSchema: OpenAPIObject = {
        openapi: '3.0.0',
        info: { title: 'Test', version: '1.0.0' },
        paths: {},
      };
      // Not used now that createFileMap accepts both base and sdk schemas directly
      const tsTypesContent = 'types';
      const pathParameterContent = 'parameters';
      const pathUtilsContent = 'utils';

      const result = createFileMap(
        sourceSchema,
        sourceSchema,
        tsTypesContent,
        pathParameterContent,
        pathUtilsContent,
        'export const RESPONSE_MAP = new Map();',
        'export const REQUEST_PARAMETER_SCHEMAS = {};',
      );

      expect(result['api-schema-base.ts']).toContain('export const schemaBase =');
      expect(result['api-schema-base.ts']).toContain('as const');
      expect(result['api-schema-base.ts']).toContain('export type SchemaBase = typeof schemaBase');
    });
  });

  describe('generatePathParametersContent', () => {
    it('should combine all sections into a single string', () => {
      const schema: OpenAPIObject = {
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
      const schema: OpenAPIObject = {
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

  describe('postProcessTypesSource', () => {
    it('should escape braces inside doc comments', () => {
      const input = ['/** @example { "transcript": "Hello" } */', 'export type Foo = string;'].join(
        '\n',
      );

      const result = postProcessTypesSource(input);
      expect(result).toContain('\\{ "transcript": "Hello" \\}');
    });

    it('should preserve valid TSDoc inline tags like {@link} and {@inheritDoc}', () => {
      const input = [
        '/** See {@link SomeType} and {@inheritDoc OtherType} */',
        'export type Bar = number;',
      ].join('\n');

      const result = postProcessTypesSource(input);
      expect(result).toContain('{@link SomeType}');
      expect(result).toContain('{@inheritDoc OtherType}');
    });

    it('should escape angle brackets in doc comments', () => {
      const input = ['/** Returns Record<string, unknown> */', 'export type Baz = object;'].join(
        '\n',
      );

      const result = postProcessTypesSource(input);
      expect(result).toContain('\\<');
      expect(result).toContain('\\>');
    });

    it('should not escape braces outside doc comments', () => {
      const input = 'const x = { a: 1 };';
      const result = postProcessTypesSource(input);
      expect(result).toBe(input);
    });
  });
});
