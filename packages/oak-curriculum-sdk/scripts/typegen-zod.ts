/**
 * Zod generation functions
 *
 * Pure functions for transforming OpenAPI schemas to Zod validators
 */

import type { OpenAPI3, OpenAPISchema } from '../src/types/openapi';

/**
 * Sanitize schema name to be a valid TypeScript identifier
 */
function sanitizeName(name: string): string {
  // Replace dots and other special characters with underscores
  return name.replace(/[^a-zA-Z0-9_]/g, '_');
}

/**
 * Transform OpenAPI schema to Zod validators
 */
export function transformSchemaToZod(schema: OpenAPI3): string {
  const schemas: string[] = [];
  schemas.push("import { z } from 'zod';");
  schemas.push('');

  if (schema.components?.schemas) {
    for (const [name, schemaObj] of Object.entries(schema.components.schemas)) {
      const safeName = sanitizeName(name);
      if (schemaObj.type === 'object' && schemaObj.properties) {
        schemas.push(generateZodObject(safeName, schemaObj));
      } else if (schemaObj.type === 'string' && schemaObj.enum) {
        schemas.push(generateZodEnum(safeName, schemaObj.enum));
      }
    }
  }

  return schemas.join('\n\n');
}

function generateZodObject(name: string, schema: OpenAPISchema): string {
  const lines: string[] = [];
  lines.push(`export const ${name}Schema = z.object({`);

  const required = schema.required ?? [];

  if (schema.properties) {
    for (const [propName, propSchema] of Object.entries(schema.properties)) {
      const isRequired = required.includes(propName);
      const zodType = getZodType(propSchema, !isRequired);
      lines.push(`  ${propName}: ${zodType},`);
    }
  }

  lines.push('});');
  lines.push('');
  lines.push(`export type ${name} = z.infer<typeof ${name}Schema>;`);

  return lines.join('\n');
}

function generateZodEnum(name: string, values: string[]): string {
  const lines: string[] = [];
  const enumValues = values.map((v) => `'${v}'`).join(', ');
  lines.push(`export const ${name}Schema = z.enum([${enumValues}]);`);
  lines.push(`export type ${name} = z.infer<typeof ${name}Schema>;`);
  return lines.join('\n');
}

function getZodPrimitive(type: string): string | null {
  switch (type) {
    case 'string':
      return 'z.string()';
    case 'integer':
      return 'z.number().int()';
    case 'number':
      return 'z.number()';
    case 'boolean':
      return 'z.boolean()';
    default:
      return null;
  }
}

function getZodArray(schema: OpenAPISchema): string {
  if (schema.items) {
    const itemType = getZodType(schema.items, false);
    return `z.array(${itemType})`;
  }
  return 'z.array(z.unknown())';
}

function getZodObject(schema: OpenAPISchema): string {
  if (!schema.properties) {
    return 'z.record(z.unknown())';
  }

  const props: string[] = [];
  const required = schema.required ?? [];

  for (const [propName, propSchema] of Object.entries(schema.properties)) {
    const isRequired = required.includes(propName);
    const type = getZodType(propSchema, !isRequired);
    props.push(`    ${propName}: ${type},`);
  }

  return `z.object({\n${props.join('\n')}\n  })`;
}

function applyZodModifiers(baseType: string, schema: OpenAPISchema, isOptional: boolean): string {
  let result = baseType;

  // Handle nullable
  if (schema.nullable) {
    result = `${result}.nullable()`;
  }

  // Handle optional
  if (isOptional) {
    result = `${result}.optional()`;
  }

  return result;
}

export function getZodType(schema: OpenAPISchema, isOptional: boolean): string {
  let baseType: string;

  if (!schema.type) {
    baseType = 'z.unknown()';
  } else {
    // Check primitive types first
    const primitive = getZodPrimitive(schema.type);
    if (primitive) {
      baseType = primitive;
    } else if (schema.type === 'array') {
      baseType = getZodArray(schema);
    } else if (schema.type === 'object') {
      baseType = getZodObject(schema);
    } else {
      baseType = 'z.unknown()';
    }
  }

  return applyZodModifiers(baseType, schema, isOptional);
}
