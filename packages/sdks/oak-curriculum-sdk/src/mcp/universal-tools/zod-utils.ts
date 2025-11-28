/**
 * Zod schema utilities for MCP tool registration.
 *
 * These utilities help extract and work with Zod schemas from generated
 * tool descriptors. The MCP SDK's registerTool() expects a ZodRawShape
 * for parameter descriptions to flow through to the JSON Schema.
 */

import { z } from 'zod';

/**
 * Type guard for ZodObject.
 *
 * Uses instanceof check to safely determine if a Zod schema is a ZodObject,
 * which has a `.shape` property. This enables safe access to the shape for
 * MCP SDK registration without type assertions.
 *
 * @param schema - Zod schema to check
 * @returns True if schema is a ZodObject with accessible shape
 *
 * @example
 * ```typescript
 * if (isZodObject(descriptor.toolMcpFlatInputSchema)) {
 *   // TypeScript knows schema has .shape property
 *   return schema.shape;
 * }
 * ```
 */
export function isZodObject(schema: z.ZodTypeAny): schema is z.ZodObject<z.ZodRawShape> {
  return schema instanceof z.ZodObject;
}

/**
 * Safely extract the shape from a Zod schema if it's a ZodObject.
 *
 * All generated toolMcpFlatInputSchema values are ZodObjects, so this will
 * always return the shape for generated tools. Returns undefined for
 * non-object schemas or if the schema is undefined (e.g., in test mocks).
 *
 * The extracted shape can be passed directly to the MCP SDK's registerTool()
 * function, preserving parameter descriptions that were added via .describe()
 * calls in the generated schema.
 *
 * @param schema - Generated flat Zod schema, may be undefined in tests
 * @returns The ZodRawShape if schema is a ZodObject, undefined otherwise
 *
 * @example
 * ```typescript
 * const flatZodSchema = extractZodShape(descriptor.toolMcpFlatInputSchema);
 * if (flatZodSchema) {
 *   server.registerTool(name, flatZodSchema, handler);
 * }
 * ```
 */
export function extractZodShape(schema: z.ZodTypeAny | undefined): z.ZodRawShape | undefined {
  if (schema && isZodObject(schema)) {
    return schema.shape;
  }
  return undefined;
}
