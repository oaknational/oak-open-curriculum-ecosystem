import { z } from 'zod';
import { typeSafeEntries } from '../types/helpers/type-helpers.js';

interface JsonSchemaPropertyString {
  readonly type: 'string';
  readonly enum?: readonly unknown[];
  readonly description?: string;
  readonly default?: unknown;
}
interface JsonSchemaPropertyNumber {
  readonly type: 'number';
  readonly enum?: readonly unknown[];
  readonly description?: string;
  readonly default?: unknown;
}
interface JsonSchemaPropertyBoolean {
  readonly type: 'boolean';
  readonly enum?: readonly unknown[];
  readonly description?: string;
  readonly default?: unknown;
}
interface JsonSchemaPropertyArray {
  readonly type: 'array';
  readonly items: JsonSchemaProperty;
  readonly description?: string;
  readonly default?: unknown;
}
interface JsonSchemaPropertyObject {
  readonly type: 'object';
  readonly properties?: Readonly<Record<string, JsonSchemaProperty>>;
  readonly required?: readonly string[];
  readonly additionalProperties?: boolean;
  readonly description?: string;
  readonly default?: unknown;
}
type JsonSchemaProperty =
  | JsonSchemaPropertyString
  | JsonSchemaPropertyNumber
  | JsonSchemaPropertyBoolean
  | JsonSchemaPropertyArray
  | JsonSchemaPropertyObject;

export interface GenericToolInputJsonSchema {
  readonly type: 'object';
  readonly properties?: Readonly<Record<string, JsonSchemaProperty>>;
  readonly required?: readonly string[];
  readonly additionalProperties?: boolean;
}

// Backwards-compatible alias used by generated files
export type ToolInputJsonSchema = GenericToolInputJsonSchema;

function isNonEmptyStringArray(arr: readonly string[]): arr is [string, ...string[]] {
  return arr.length > 0;
}

function buildEnumStringSchema(values: readonly unknown[]): z.ZodTypeAny {
  const allowed = values.map((v) => String(v));
  // Use z.enum() for proper JSON Schema conversion (produces "enum" array instead of just "type": "string")
  if (isNonEmptyStringArray(allowed)) {
    return z.enum(allowed);
  }
  return z.string().refine((v) => allowed.includes(v), { message: 'Invalid enum value' });
}

function buildEnumNumberSchema(values: readonly unknown[]): z.ZodTypeAny {
  const allowed = values.filter((v) => typeof v === 'number');
  return z.number().refine((v) => allowed.includes(v), { message: 'Invalid enum value' });
}

function buildArraySchema(prop: JsonSchemaPropertyArray): z.ZodTypeAny {
  return z.array(zodForProperty(prop.items));
}

function buildObjectSchema(prop: JsonSchemaPropertyObject): z.ZodTypeAny {
  const required = new Set(prop.required ?? []);
  const properties = prop.properties ?? {};
  const shape: z.ZodRawShape = {};
  for (const [key, property] of typeSafeEntries(properties)) {
    const base = zodForProperty(property);
    shape[key] = required.has(key) ? base : base.optional();
  }
  const objectSchema = z.object(shape);
  return prop.additionalProperties === false ? objectSchema.strict() : objectSchema;
}

function withDescription(schema: z.ZodTypeAny, description: string | undefined): z.ZodTypeAny {
  return description ? schema.describe(description) : schema;
}

function zodBaseForProperty(prop: JsonSchemaProperty): z.ZodTypeAny {
  switch (prop.type) {
    case 'string':
      return Array.isArray(prop.enum) ? buildEnumStringSchema(prop.enum) : z.string();
    case 'number':
      return Array.isArray(prop.enum) ? buildEnumNumberSchema(prop.enum) : z.number();
    case 'boolean':
      return z.boolean();
    case 'array':
      return buildArraySchema(prop);
    case 'object':
      return buildObjectSchema(prop);
    default:
      return z.any();
  }
}

function zodForProperty(prop: JsonSchemaProperty): z.ZodTypeAny {
  return withDescription(zodBaseForProperty(prop), prop.description);
}

/**
 * Build a Zod raw shape from the generated JSON schema for tool inputs.
 * This is suitable for McpServer.registerTool's inputSchema field.
 */
export function zodRawShapeFromToolInputJsonSchema(
  schema: GenericToolInputJsonSchema,
): z.ZodRawShape {
  const shape: z.ZodRawShape = {};
  const required = new Set(schema.required ?? []);
  const props = schema.properties ?? {};
  for (const [key, prop] of typeSafeEntries(props)) {
    const base = zodForProperty(prop);
    shape[key] = required.has(key) ? base : base.optional();
  }
  return shape;
}

/**
 * Build a strict Zod object from the generated JSON schema for tool inputs.
 */
export function zodFromToolInputJsonSchema(schema: GenericToolInputJsonSchema): z.ZodTypeAny {
  const shape = zodRawShapeFromToolInputJsonSchema(schema);
  return z.object(shape).strict();
}
