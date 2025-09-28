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
    it('should generate runtime schema check functions', () => {
      const result = generateRuntimeSchemaChecks();

      expect(result).toContain('type RawPaths = Schema["paths"]');
      expect(result).toContain('export function isValidPath(value: string): value is ValidPath');
      expect(result).toContain('export const apiPaths: RawPaths = schema.paths');
      expect(result).toContain('type AllowedMethods = keyof (RawPaths[keyof RawPaths])');
      expect(result).toContain('export const allowedMethods: AllowedMethods[]');
      expect(result).toContain('export function isAllowedMethod');
      expect(result).toContain('export type PathReturnTypes');
    });

    it('should include type guards implementation', () => {
      const result = generateRuntimeSchemaChecks();

      expect(result).toContain('return paths.includes(value)');
      expect(result).toContain('return methods.includes(maybeMethod)');
    });

    it('should handle method extraction logic', () => {
      const result = generateRuntimeSchemaChecks();

      expect(result).toContain('allowedMethodsSet = new Set<AllowedMethods>()');
      expect(result).toContain('for (const path in schema.paths)');
      expect(result).toContain('if (!isValidPath(path))');
      expect(result).toContain('throw new TypeError');
    });

    it('should generate PathReturnTypes and JsonBody200 helpers', () => {
      const result = generateRuntimeSchemaChecks();

      expect(result).toContain('[P in ValidPath]');
      expect(result).toContain('export type PathReturnTypes');
      expect(result).toContain('export type JsonBody200');
    });
  });
});
