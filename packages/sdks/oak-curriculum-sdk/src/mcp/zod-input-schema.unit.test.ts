import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import {
  zodRawShapeFromToolInputJsonSchema,
  type GenericToolInputJsonSchema,
} from './zod-input-schema.js';

/**
 * Tests specifying the behaviour of zodRawShapeFromToolInputJsonSchema.
 *
 * These tests ensure that:
 * 1. Descriptions are preserved through the JSON Schema → Zod → JSON Schema round-trip
 * 2. Enum values are properly converted using z.enum() for correct JSON Schema output
 *
 * This is critical for aggregated tools (search, fetch) whose metadata must reach MCP clients.
 */
describe('zodRawShapeFromToolInputJsonSchema', () => {
  describe('description preservation', () => {
    it('preserves description through round-trip conversion', () => {
      const inputSchema: GenericToolInputJsonSchema = {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Search query string',
          },
        },
      };

      const zodShape = zodRawShapeFromToolInputJsonSchema(inputSchema);
      const roundTripSchema = z.toJSONSchema(z.object(zodShape));

      // Verify description survives: JSON Schema → Zod → JSON Schema
      expect(roundTripSchema).toMatchObject({
        properties: {
          query: {
            description: 'Search query string',
          },
        },
      });
    });

    it('handles properties without descriptions', () => {
      const inputSchema: GenericToolInputJsonSchema = {
        type: 'object',
        properties: {
          limit: {
            type: 'number',
          },
        },
      };

      const zodShape = zodRawShapeFromToolInputJsonSchema(inputSchema);
      const roundTripSchema = z.toJSONSchema(z.object(zodShape));

      expect(roundTripSchema).toMatchObject({
        properties: {
          limit: {
            type: 'number',
          },
        },
      });
    });
  });

  describe('enum preservation', () => {
    it('converts string enum to z.enum() for proper JSON Schema output', () => {
      const inputSchema: GenericToolInputJsonSchema = {
        type: 'object',
        properties: {
          keyStage: {
            type: 'string',
            enum: ['ks1', 'ks2', 'ks3', 'ks4'],
          },
        },
      };

      const zodShape = zodRawShapeFromToolInputJsonSchema(inputSchema);
      const roundTripSchema = z.toJSONSchema(z.object(zodShape));

      // Verify enum array appears in output (not just "type": "string")
      expect(roundTripSchema).toMatchObject({
        properties: {
          keyStage: {
            enum: ['ks1', 'ks2', 'ks3', 'ks4'],
          },
        },
      });
    });

    it('preserves both enum and description together', () => {
      const inputSchema: GenericToolInputJsonSchema = {
        type: 'object',
        properties: {
          keyStage: {
            type: 'string',
            enum: ['ks1', 'ks2', 'ks3', 'ks4'],
            description: 'Filter by key stage',
          },
        },
      };

      const zodShape = zodRawShapeFromToolInputJsonSchema(inputSchema);
      const roundTripSchema = z.toJSONSchema(z.object(zodShape));

      expect(roundTripSchema).toMatchObject({
        properties: {
          keyStage: {
            enum: ['ks1', 'ks2', 'ks3', 'ks4'],
            description: 'Filter by key stage',
          },
        },
      });
    });
  });

  describe('required fields', () => {
    it('marks required fields correctly', () => {
      const inputSchema: GenericToolInputJsonSchema = {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Resource identifier',
          },
          optional: {
            type: 'string',
          },
        },
        required: ['id'],
      };

      const zodShape = zodRawShapeFromToolInputJsonSchema(inputSchema);
      const roundTripSchema = z.toJSONSchema(z.object(zodShape));

      expect(roundTripSchema).toMatchObject({
        required: ['id'],
      });
    });
  });
});
