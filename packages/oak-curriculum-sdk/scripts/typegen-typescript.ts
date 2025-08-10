/**
 * TypeScript generation functions
 *
 * Pure functions for transforming OpenAPI schemas to TypeScript
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
 * Transform OpenAPI schema to TypeScript interfaces
 */
export function transformSchemaToTypeScript(schema: OpenAPI3): string {
  const interfaces: string[] = [];

  if (schema.components?.schemas) {
    for (const [name, schemaObj] of Object.entries(schema.components.schemas)) {
      const safeName = sanitizeName(name);
      if (schemaObj.type === 'object' && schemaObj.properties) {
        interfaces.push(generateInterface(safeName, schemaObj));
      } else if (schemaObj.type === 'string' && schemaObj.enum) {
        interfaces.push(generateEnum(safeName, schemaObj.enum));
      }
    }
  }

  return interfaces.join('\n\n');
}

function generateInterface(name: string, schema: OpenAPISchema): string {
  const lines: string[] = [];
  lines.push(`export interface ${name} {`);

  const required = schema.required ?? [];

  if (schema.properties) {
    for (const [propName, propSchema] of Object.entries(schema.properties)) {
      const isRequired = required.includes(propName);
      const optionalMarker = isRequired ? '' : '?';
      const type = getTypeScriptType(propSchema);
      lines.push(`  ${propName}${optionalMarker}: ${type};`);
    }
  }

  lines.push('}');
  return lines.join('\n');
}

function generateEnum(name: string, values: string[]): string {
  return `export type ${name} = ${values.map((v) => `'${v}'`).join(' | ')};`;
}

function getTypeScriptPrimitive(type: string): string | null {
  switch (type) {
    case 'string':
      return 'string';
    case 'integer':
    case 'number':
      return 'number';
    case 'boolean':
      return 'boolean';
    default:
      return null;
  }
}

function getTypeScriptArray(schema: OpenAPISchema): string {
  if (schema.items) {
    const itemType = getTypeScriptType(schema.items);
    // Handle complex types that need parentheses
    if (itemType.includes('{') || itemType.includes('|')) {
      return `(${itemType})[]`;
    }
    return `${itemType}[]`;
  }
  return 'unknown[]';
}

function getTypeScriptObject(schema: OpenAPISchema): string {
  if (!schema.properties) {
    return 'Record<string, unknown>';
  }

  const props: string[] = [];
  const required = schema.required ?? [];

  for (const [propName, propSchema] of Object.entries(schema.properties)) {
    const isRequired = required.includes(propName);
    const optionalMarker = isRequired ? '' : '?';
    const type = getTypeScriptType(propSchema);
    props.push(`${propName}${optionalMarker}: ${type}`);
  }

  return `{\n    ${props.join(';\n    ')};\n  }`;
}

export function getTypeScriptType(schema: OpenAPISchema): string {
  if (!schema.type) {
    return 'unknown';
  }

  // Check primitive types first
  const primitive = getTypeScriptPrimitive(schema.type);
  if (primitive) {
    return primitive;
  }

  // Handle complex types
  if (schema.type === 'array') {
    return getTypeScriptArray(schema);
  }

  if (schema.type === 'object') {
    return getTypeScriptObject(schema);
  }

  return 'unknown';
}
