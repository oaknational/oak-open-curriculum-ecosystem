import { z } from 'zod';

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
type JsonSchemaProperty =
  | JsonSchemaPropertyString
  | JsonSchemaPropertyNumber
  | JsonSchemaPropertyBoolean
  | JsonSchemaPropertyArray;

export type JsonSchemaToZodSchema<TSchema extends ToolInputJsonSchema> = z.ZodTypeAny;

export interface GenericToolInputJsonSchema {
  readonly type: 'object';
  readonly properties?: Readonly<Record<string, JsonSchemaProperty>>;
  readonly required?: readonly string[];
  readonly additionalProperties?: boolean;
}

// Backwards-compatible alias used by generated files
export type ToolInputJsonSchema = GenericToolInputJsonSchema;

function buildEnumStringSchema(values: readonly unknown[]): z.ZodTypeAny {
  const allowed = values.map((v) => String(v));
  return z.string().refine((v) => allowed.includes(v), { message: 'Invalid enum value' });
}

function buildEnumNumberSchema(values: readonly unknown[]): z.ZodTypeAny {
  const allowed = values.filter((v) => typeof v === 'number');
  return z.number().refine((v) => allowed.includes(v), { message: 'Invalid enum value' });
}

function buildArraySchema(prop: JsonSchemaPropertyArray): z.ZodTypeAny {
  return z.array(zodForProperty(prop.items));
}

function zodForProperty(prop: JsonSchemaProperty): z.ZodTypeAny {
  switch (prop.type) {
    case 'string': {
      return Array.isArray(prop.enum) ? buildEnumStringSchema(prop.enum) : z.string();
    }
    case 'number': {
      return Array.isArray(prop.enum) ? buildEnumNumberSchema(prop.enum) : z.number();
    }
    case 'boolean':
      return z.boolean();
    case 'array':
      return buildArraySchema(prop);
    default:
      return z.any();
  }
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
  for (const [key, prop] of Object.entries(props)) {
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
