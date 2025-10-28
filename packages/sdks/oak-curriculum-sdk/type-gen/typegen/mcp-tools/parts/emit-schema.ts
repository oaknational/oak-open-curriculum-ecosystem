import type { OperationObject } from 'openapi3-ts/oas31';
import { buildInputSchemaObject, buildZodObject } from './emit-input-schema.js';
import { emitErrorDescription } from './emit-error-description.js';
import type { ParamMetadata, ParamMetadataMap } from './param-metadata.js';

function hasEntries(meta: ParamMetadataMap): boolean {
  return Object.keys(meta).length > 0;
}

function literalUnion(meta: ParamMetadata): string | undefined {
  if (!Array.isArray(meta.allowedValues) || meta.allowedValues.length === 0) {
    return undefined;
  }
  return meta.allowedValues
    .map((value) => {
      if (typeof value === 'string') {
        return `'${value}'`;
      }
      if (typeof value === 'number' || typeof value === 'boolean') {
        return String(value);
      }
      return undefined;
    })
    .filter((value): value is string => value !== undefined)
    .join(' | ');
}

function primitiveType(meta: ParamMetadata): string {
  switch (meta.typePrimitive) {
    case 'string':
      return 'string';
    case 'number':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'string[]':
      return 'readonly string[]';
    case 'number[]':
      return 'readonly number[]';
    case 'boolean[]':
      return 'readonly boolean[]';
    default:
      return 'unknown';
  }
}

function typeFor(meta: ParamMetadata): string {
  return literalUnion(meta) ?? primitiveType(meta);
}

function describeParam(meta: ParamMetadata): string | undefined {
  const fragments: string[] = [];
  if (meta.description) {
    fragments.push(meta.description);
  }
  if (Array.isArray(meta.allowedValues) && meta.allowedValues.length > 0) {
    fragments.push(`Allowed values: ${meta.allowedValues.join(', ')}`);
  }
  if (meta.default !== undefined) {
    fragments.push(`Default: ${JSON.stringify(meta.default)}`);
  }
  if (fragments.length === 0) {
    return undefined;
  }
  return fragments.join(' ');
}

function buildInterface(
  meta: ParamMetadataMap,
  interfaceName: string,
  description: string,
): string | undefined {
  if (!hasEntries(meta)) {
    return undefined;
  }
  const lines: string[] = [];
  lines.push('/**');
  lines.push(` * ${description}`);
  lines.push(' */');
  lines.push(`export interface ${interfaceName} {`);
  for (const [name, metadata] of Object.entries(meta)) {
    const optional = metadata.required ? '' : '?';
    const summary = describeParam(metadata);
    if (summary) {
      lines.push(`  /** ${summary} */`);
    }
    lines.push(`  readonly ${name}${optional}: ${typeFor(metadata)};`);
  }
  lines.push('}');
  return lines.join('\n');
}

function buildHeaderBlock(
  pathParamMetadata: ParamMetadataMap,
  queryParamMetadata: ParamMetadataMap,
): string {
  const sections: string[] = [];
  const pathInterface = buildInterface(
    pathParamMetadata,
    'ToolPathParams',
    'Path parameters derived from the OpenAPI schema.',
  );
  const queryInterface = buildInterface(
    queryParamMetadata,
    'ToolQueryParams',
    'Query parameters derived from the OpenAPI schema.',
  );
  if (pathInterface) {
    sections.push(pathInterface);
  }
  if (queryInterface) {
    sections.push(queryInterface);
  }

  if (pathInterface || queryInterface) {
    sections.push('export interface ToolParams {');
    if (pathInterface) {
      sections.push('  readonly path: ToolPathParams;');
    }
    if (queryInterface) {
      const isQueryRequired = Object.values(queryParamMetadata).some((meta) => meta.required);
      sections.push(`  readonly query${isQueryRequired ? '' : '?'}: ToolQueryParams;`);
    }
    sections.push('}');
    sections.push('');
    sections.push('export interface ToolArgs { readonly params: ToolParams; }');
  } else {
    sections.push('export interface ToolParams { readonly __noParams?: never; }');
    sections.push('');
    sections.push('export interface ToolArgs { readonly params: ToolParams; }');
  }
  sections.push('');
  return sections.join('\n');
}

function inputSchemaBlock(
  pathParamMetadata: ParamMetadataMap,
  queryParamMetadata: ParamMetadataMap,
): { jsonLiteral: string; zodLiteral: string } {
  const schemaObject = buildInputSchemaObject(pathParamMetadata, queryParamMetadata);
  const propertiesLiteral = JSON.stringify(schemaObject.properties);
  const requiredKeys = schemaObject.required ?? [];
  const requiredPart = requiredKeys.length > 0 ? `, required: ${JSON.stringify(requiredKeys)}` : '';
  const jsonLiteral = `export const toolInputJsonSchema = { type: 'object' as const, properties: ${propertiesLiteral} as const, additionalProperties: false as const${requiredPart} };`;
  const zodLiteral = `export const toolZodSchema = ${buildZodObject(pathParamMetadata, queryParamMetadata)};`;
  return { jsonLiteral, zodLiteral };
}

export function emitSchema(
  operation: OperationObject,
  pathParamMetadata: ParamMetadataMap,
  queryParamMetadata: ParamMetadataMap,
): string {
  void operation;
  const lines: string[] = [];
  lines.push(buildHeaderBlock(pathParamMetadata, queryParamMetadata));
  const { jsonLiteral, zodLiteral } = inputSchemaBlock(pathParamMetadata, queryParamMetadata);
  lines.push(jsonLiteral);
  lines.push(zodLiteral);
  lines.push('export type ToolInputSchema = z.infer<typeof toolZodSchema>;');
  lines.push(emitErrorDescription(pathParamMetadata, queryParamMetadata));
  return lines.join('\n');
}
