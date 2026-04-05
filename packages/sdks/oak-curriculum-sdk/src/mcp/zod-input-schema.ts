import { z } from 'zod';
import { typeSafeEntries, typeSafeFromEntries } from '../types/helpers/type-helpers.js';

interface JsonSchemaPropertyString {
  readonly type: 'string';
  readonly enum?: readonly unknown[];
  readonly description?: string;
  readonly default?: unknown;
  readonly examples?: readonly unknown[];
}
interface JsonSchemaPropertyNumber {
  readonly type: 'number' | 'integer';
  readonly minimum?: number;
  readonly maximum?: number;
  readonly enum?: readonly unknown[];
  readonly description?: string;
  readonly default?: unknown;
  readonly examples?: readonly unknown[];
}
interface JsonSchemaPropertyBoolean {
  readonly type: 'boolean';
  readonly enum?: readonly unknown[];
  readonly description?: string;
  readonly default?: unknown;
  readonly examples?: readonly unknown[];
}
interface JsonSchemaPropertyArray {
  readonly type: 'array';
  readonly items: JsonSchemaProperty;
  readonly description?: string;
  readonly default?: unknown;
  readonly examples?: readonly unknown[];
}
interface JsonSchemaPropertyObject {
  readonly type: 'object';
  readonly properties?: Readonly<Record<string, JsonSchemaProperty>>;
  readonly required?: readonly string[];
  readonly additionalProperties?: boolean;
  readonly description?: string;
  readonly default?: unknown;
  readonly examples?: readonly unknown[];
}
interface JsonSchemaPropertyAnyOf {
  readonly anyOf: readonly JsonSchemaProperty[];
}
type JsonSchemaProperty =
  | JsonSchemaPropertyString
  | JsonSchemaPropertyNumber
  | JsonSchemaPropertyBoolean
  | JsonSchemaPropertyArray
  | JsonSchemaPropertyObject
  | JsonSchemaPropertyAnyOf;

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

function buildEnumStringSchema(values: readonly unknown[]): z.ZodType {
  const allowed = values.map((v) => String(v));
  // Use z.enum() for proper JSON Schema conversion (produces "enum" array instead of just "type": "string")
  if (isNonEmptyStringArray(allowed)) {
    return z.enum(allowed);
  }
  return z.string().refine((v) => allowed.includes(v), { message: 'Invalid enum value' });
}

function buildEnumNumberSchema(values: readonly unknown[]): z.ZodType {
  const allowed = values.filter((v) => typeof v === 'number');
  return z.number().refine((v) => allowed.includes(v), { message: 'Invalid enum value' });
}

function buildArraySchema(prop: JsonSchemaPropertyArray): z.ZodType {
  return z.array(zodForProperty(prop.items));
}

function buildObjectSchema(prop: JsonSchemaPropertyObject): z.ZodType {
  const required = new Set(prop.required ?? []);
  const properties = prop.properties ?? {};
  const entries = typeSafeEntries(properties).map(([key, property]) => {
    const base = zodForProperty(property);
    return [key, required.has(key) ? base : base.optional()] as const;
  });
  const shape = typeSafeFromEntries(entries);
  const objectSchema = z.object(shape);
  return prop.additionalProperties === false ? objectSchema.strict() : objectSchema;
}

function buildAnyOfSchema(prop: JsonSchemaPropertyAnyOf): z.ZodType {
  const [firstProperty, ...restProperties] = prop.anyOf;
  if (!firstProperty) {
    return z.never();
  }

  let schema = zodForProperty(firstProperty);
  for (const property of restProperties) {
    schema = schema.or(zodForProperty(property));
  }
  return schema;
}

function withDescription(schema: z.ZodType, description: string | undefined): z.ZodType {
  return description ? schema.describe(description) : schema;
}

function getPropertyDescription(prop: JsonSchemaProperty): string | undefined {
  if ('description' in prop) {
    return prop.description;
  }
  return undefined;
}

function zodBaseForTypedProperty(
  prop:
    | JsonSchemaPropertyString
    | JsonSchemaPropertyNumber
    | JsonSchemaPropertyBoolean
    | JsonSchemaPropertyArray
    | JsonSchemaPropertyObject,
): z.ZodType {
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

function zodBaseForProperty(prop: JsonSchemaProperty): z.ZodType {
  if ('anyOf' in prop) {
    return buildAnyOfSchema(prop);
  }
  return zodBaseForTypedProperty(prop);
}

function zodForProperty(prop: JsonSchemaProperty): z.ZodType {
  return withDescription(zodBaseForProperty(prop), getPropertyDescription(prop));
}

/**
 * Build a Zod raw shape from the generated JSON schema for tool inputs.
 * This is suitable for McpServer.registerTool's inputSchema field.
 */
export function zodRawShapeFromToolInputJsonSchema(
  schema: GenericToolInputJsonSchema,
): z.ZodRawShape {
  const required = new Set(schema.required ?? []);
  const props = schema.properties ?? {};
  const entries = typeSafeEntries(props).map(([key, prop]) => {
    const base = zodForProperty(prop);
    return [key, required.has(key) ? base : base.optional()] as const;
  });
  return typeSafeFromEntries(entries);
}

/**
 * Build a strict Zod object from the generated JSON schema for tool inputs.
 */
export function zodFromToolInputJsonSchema(schema: GenericToolInputJsonSchema): z.ZodType {
  const shape = zodRawShapeFromToolInputJsonSchema(schema);
  return z.object(shape).strict();
}
