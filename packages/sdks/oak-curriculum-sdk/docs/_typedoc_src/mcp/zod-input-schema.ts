import { z } from 'zod';
import { typeSafeEntries } from '../types/helpers.js';

interface McpBaseToolInputSchemaBase {
  readonly type: 'object';
  readonly required?: string[];
}

type Primitive = 'string' | 'number' | 'boolean';
interface ArrayProperty {
  type: 'array';
  items: { type: Primitive };
}
interface StringProperty {
  type: 'string';
  enum?: readonly unknown[];
  description?: string;
  default?: unknown;
}
interface NumberProperty {
  type: 'number';
  enum?: readonly unknown[];
  description?: string;
  default?: unknown;
}
interface BooleanProperty {
  type: 'boolean';
  enum?: readonly unknown[];
  description?: string;
  default?: unknown;
}
type PropertySchema =
  | StringProperty
  | NumberProperty
  | BooleanProperty
  | (ArrayProperty & { description?: string; default?: unknown });

export type GenericToolInputJsonSchema = McpBaseToolInputSchemaBase & {
  [key: string]: unknown;
  // Narrower helper type for local schema-to-zod conversion when present
  readonly properties?: Readonly<Record<string, PropertySchema>>;
};

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

function buildArraySchema(prop: ArrayProperty): z.ZodTypeAny {
  const itemType = prop.items.type;
  if (itemType === 'string') {
    return z.array(z.string());
  }
  if (itemType === 'number') {
    return z.array(z.number());
  }
  return z.array(z.boolean());
}

function zodForProperty(prop: PropertySchema): z.ZodTypeAny {
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
      return buildArraySchema({ type: 'array', items: prop.items });
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
