interface ParameterDefinition {
  readonly name: string;
  readonly schema: string;
}

interface EndpointDefinition {
  readonly method: string;
  readonly path: string;
  readonly parameters?: readonly ParameterDefinition[];
}

function isParameterDefinition(value: unknown): value is ParameterDefinition {
  if (!value || typeof value !== 'object' || !('name' in value) || !('schema' in value)) {
    return false;
  }
  return typeof value.name === 'string' && typeof value.schema === 'string';
}

function isEndpointDefinition(value: unknown): value is EndpointDefinition {
  if (
    !value ||
    typeof value !== 'object' ||
    !('method' in value) ||
    !('path' in value) ||
    !('parameters' in value)
  ) {
    return false;
  }
  return (
    typeof value.method === 'string' &&
    typeof value.path === 'string' &&
    (value.parameters === undefined ||
      (Array.isArray(value.parameters) && value.parameters.every(isParameterDefinition)))
  );
}

function indentMultiline(value: string, spaces: number): string {
  const indent = ' '.repeat(spaces);
  return value
    .split('\n')
    .map((line, index) => (index === 0 ? line : indent + line))
    .join('\n');
}

function buildParameterSchemaExpression(
  parameters: readonly ParameterDefinition[] | undefined,
): string {
  if (!parameters || parameters.length === 0) {
    return 'z.object({})';
  }
  const properties = parameters
    .map((param) => {
      const propertyName = JSON.stringify(param.name);
      const schemaExpression = indentMultiline(param.schema, 6);
      return `    ${propertyName}: ${schemaExpression},`;
    })
    .join('\n');
  return `z.object({\n${properties}\n  })`;
}

export function emitRequestValidatorMap(rawEndpoints: readonly unknown[]): string {
  if (!Array.isArray(rawEndpoints)) {
    throw new TypeError('Expected an array of endpoint definitions.');
  }

  const endpoints = rawEndpoints.map((endpoint, index) => {
    if (!isEndpointDefinition(endpoint)) {
      throw new TypeError(`Invalid endpoint definition at index ${String(index)}.`);
    }
    return endpoint;
  });

  const header = `/**
 * GENERATED FILE - DO NOT EDIT
 *
 * Request parameter schemas derived from the OpenAPI specification.
 */
import { z } from 'zod';
import type { ApiHttpMethod, ValidPath } from '../path-parameters.js';

export const REQUEST_PARAMETER_SCHEMAS = {
`;

  const entries = endpoints
    .map((endpoint) => {
      const key = `${endpoint.method.toUpperCase()}:${endpoint.path}`;
      const schemaExpression = buildParameterSchemaExpression(endpoint.parameters);
      return `  ${JSON.stringify(key)}: ${schemaExpression},`;
    })
    .join('\n');

  const footer = `
} as const;

export type RequestParameterSchemas = typeof REQUEST_PARAMETER_SCHEMAS;
export type RequestParameterKey = keyof RequestParameterSchemas;

function isRequestParameterKey(key: string): key is RequestParameterKey {
  return key in REQUEST_PARAMETER_SCHEMAS;
}

export function getRequestParameterSchema(
  method: ApiHttpMethod,
  path: ValidPath,
): RequestParameterSchemas[RequestParameterKey] | undefined {
  const key = method.toUpperCase() + ':' + path;
  if (!isRequestParameterKey(key)) {
    return undefined;
  }
  return REQUEST_PARAMETER_SCHEMAS[key];
}
`;

  return header + entries + footer;
}
