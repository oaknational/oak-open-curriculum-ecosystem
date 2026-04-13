import { describe, it, expect } from 'vitest';
import {
  generatePathParametersHeader,
  generatePathsConstant,
  generateRuntimeSchemaChecks,
} from './path-generators';

describe('Path Generators', () => {
  describe('generatePathParametersHeader', () => {
    it('should generate proper header with imports', () => {
      const result = generatePathParametersHeader();

      expect(result).toContain('GENERATED FILE - DO NOT EDIT');
      expect(result).toContain('import type { paths as Paths }');
      expect(result).toContain('import type { SchemaBase as Schema }');
      expect(result).toContain('import { schemaBase as schema }');
    });

    it('should include documentation comments', () => {
      const result = generatePathParametersHeader();

      expect(result).toContain('path parameters');
      expect(result).toContain('dynamically constructing API requests');
      expect(result).toContain('valid parameter combinations');
    });
  });

  describe('generatePathsConstant', () => {
    it('should generate PATHS object from schema', () => {
      const schema = {
        paths: {
          '/api/users': {},
          '/api/items/{id}': {},
          '/api/data': {},
        },
      };

      const result = generatePathsConstant(schema);

      expect(result).toContain('export const PATHS = {');
      expect(result).toContain("'/api/data': '/api/data'");
      expect(result).toContain("'/api/items/{id}': '/api/items/{id}'");
      expect(result).toContain("'/api/users': '/api/users'");
      expect(result).toContain('type ValidPath = keyof Paths;');
    });

    it('should sort paths alphabetically', () => {
      const schema = {
        paths: {
          '/zebra': {},
          '/apple': {},
          '/banana': {},
        },
      };

      const result = generatePathsConstant(schema);
      const lines = result.split('\n');
      const pathLines = lines.filter((l) => l.includes("': '"));

      expect(pathLines[0]).toContain("'/apple': '/apple'");
      expect(pathLines[1]).toContain("'/banana': '/banana'");
      expect(pathLines[2]).toContain("'/zebra': '/zebra'");
    });

    it('should handle empty paths', () => {
      const schema = { paths: {} };
      const result = generatePathsConstant(schema);

      expect(result).toContain('export const PATHS = {');
      expect(result).toContain('} as const');
    });

    it('should handle undefined paths', () => {
      const schema = {};
      const result = generatePathsConstant(schema);

      expect(result).toContain('export const PATHS = {');
      expect(result).toContain('} as const');
    });
  });

  describe('generateRuntimeSchemaChecks', () => {
    it('should export POSSIBLE_HTTP_METHODS as a static as-const tuple', () => {
      const result = generateRuntimeSchemaChecks();

      expect(result).toContain('POSSIBLE_HTTP_METHODS');
      expect(result).toContain('as const');
      expect(result).toContain('PossibleHttpMethod');
      expect(result).toContain('isPossibleHttpMethod');
    });

    it('should export API_HTTP_METHODS derived from schema.paths at runtime', () => {
      const result = generateRuntimeSchemaChecks();

      expect(result).toContain('API_HTTP_METHODS');
      expect(result).toContain('schema.paths');
      expect(result).toContain('ApiHttpMethod');
      expect(result).toContain('isApiHttpMethod');
    });

    it('should derive ApiHttpMethod via distributive MethodKeysOf', () => {
      const result = generateRuntimeSchemaChecks();

      expect(result).toContain('MethodKeysOf');
      expect(result).toContain('Extract<keyof T, PossibleHttpMethod>');
    });

    it('should export RawPaths, isValidPath, and apiPaths', () => {
      const result = generateRuntimeSchemaChecks();

      expect(result).toContain('type RawPaths = Schema["paths"]');
      expect(result).toContain('export function isValidPath(value: string): value is ValidPath');
      expect(result).toContain('export const apiPaths: RawPaths = schema.paths');
    });

    it('should use PossibleHttpMethod instead of hardcoded HttpMethodKeys', () => {
      const result = generateRuntimeSchemaChecks();

      expect(result).toContain('AllowedMethodsForPath');
      expect(result).toContain('PossibleHttpMethod');
      expect(result).not.toContain('HttpMethodKeys');
    });

    it('should generate JsonBody200 using direct Paths indexing for eager evaluation', () => {
      const result = generateRuntimeSchemaChecks();

      expect(result).toContain('export type JsonBody200');
      expect(result).toContain('Paths[P][M] extends');
      expect(result).toContain("responses: { 200: { content: { 'application/json': infer J } } }");
      expect(result).not.toContain('NormalizedResponsesFor');
      expect(result).not.toContain('Normalize200');
    });

    it('should generate ValidGetPath filtering paths with a get method', () => {
      const result = generateRuntimeSchemaChecks();

      expect(result).toContain('export type ValidGetPath');
      expect(result).toContain("'get' extends AllowedMethodsForPath<P>");
    });

    it('should generate GetResponseBody as an explicit union indexing Paths per GET path', () => {
      const schema = {
        paths: {
          '/lessons/{lesson}/summary': { get: {} },
          '/subjects': { get: {} },
        },
      };
      const result = generateRuntimeSchemaChecks(schema);

      expect(result).toContain('export type GetResponseBody =');
      expect(result).toContain(
        "| Paths['/lessons/{lesson}/summary']['get']['responses'][200]['content']['application/json']",
      );
      expect(result).toContain(
        "| Paths['/subjects']['get']['responses'][200]['content']['application/json']",
      );
    });

    it('should sort paths alphabetically in GetResponseBody union', () => {
      const schema = {
        paths: {
          '/zebra': { get: {} },
          '/alpha': { get: {} },
        },
      };
      const result = generateRuntimeSchemaChecks(schema);
      const alphaIndex = result.indexOf("'/alpha'");
      const zebraIndex = result.indexOf("'/zebra'");

      expect(alphaIndex).toBeLessThan(zebraIndex);
    });

    it('should generate GetObjectResponseBody excluding array response bodies', () => {
      const result = generateRuntimeSchemaChecks();

      expect(result).toContain('export type GetObjectResponseBody');
      expect(result).toContain('Exclude<GetResponseBody, readonly unknown[]>');
    });

    it('should generate GetArrayResponseBody extracting array response bodies', () => {
      const result = generateRuntimeSchemaChecks();

      expect(result).toContain('export type GetArrayResponseBody');
      expect(result).toContain('Extract<GetResponseBody, readonly unknown[]>');
    });

    it('should generate GetArrayResponseElement as the element type of array response bodies', () => {
      const result = generateRuntimeSchemaChecks();

      expect(result).toContain('export type GetArrayResponseElement');
      expect(result).toContain('GetArrayResponseBody extends readonly (infer E)[] ? E : never');
    });
  });
});
