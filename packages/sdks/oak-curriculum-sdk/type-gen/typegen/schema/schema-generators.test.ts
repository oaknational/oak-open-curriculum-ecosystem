import type { OpenAPIObject } from 'openapi3-ts/oas31';
import { describe, it, expect } from 'vitest';
import { generateJsonContent, generateTsSchemaContent } from './schema-generators';
import { minimalSchema, schemaWithGetEndpoint, parseAsOpenAPIObject } from '../../test-fixtures';

describe('Schema Generators', () => {
  describe('generateJsonContent', () => {
    it('should generate formatted JSON string from schema', () => {
      const schema: OpenAPIObject = minimalSchema;

      const result = generateJsonContent(schema);
      const parsed: OpenAPIObject = parseAsOpenAPIObject(result);

      expect(parsed).toEqual(schema);
      expect(result).toContain('"openapi": "3.0.0"');
      expect(result).toContain('  '); // Check for indentation
    });

    it('should handle complex nested structures', () => {
      const schema: OpenAPIObject = schemaWithGetEndpoint;

      const result = generateJsonContent(schema);
      const parsed: OpenAPIObject = parseAsOpenAPIObject(result);
      const item = parsed.paths?.['/users'];
      // Ensure it's not a ReferenceObject before accessing path methods
      expect(item && !('$ref' in item)).toBe(true);
      if (!item || '$ref' in item) {
        throw new Error('Expected PathItemObject for /users');
      }

      const getOp = item.get;
      // Ensure GET is an OperationObject (not a ReferenceObject)
      expect(getOp && !('$ref' in getOp)).toBe(true);
      if (!getOp || '$ref' in getOp) {
        throw new Error('Expected OperationObject for GET /users');
      }
      expect(getOp.operationId).toBe('getUsers');
    });
  });

  describe('generateTsSchemaContent', () => {
    it('should generate TypeScript schema export', () => {
      const jsonSchema = '{"test": "value"}';
      const result = generateTsSchemaContent(jsonSchema);

      expect(result).toContain('export const schema = {"test": "value"} as const;');
      expect(result).toContain('export type Schema = typeof schema;');
      expect(result).toContain('API schema');
    });

    it('should include proper JSDoc comments', () => {
      const jsonSchema = '{}';
      const result = generateTsSchemaContent(jsonSchema);

      expect(result).toContain('/**');
      expect(result).toContain('* The API schema.');
      expect(result).toContain('* This is a runtime object');
    });

    it('should use const assertion for type safety', () => {
      const jsonSchema = '{"nested": {"value": 123}}';
      const result = generateTsSchemaContent(jsonSchema);

      expect(result).toContain('as const');
      expect(result).toContain('typeof schema');
    });
  });
});
