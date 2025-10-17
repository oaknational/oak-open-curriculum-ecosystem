function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

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
  if (!isRecord(value)) {
    return false;
  }
  const { name, schema } = value;
  return typeof name === 'string' && typeof schema === 'string';
}

function isEndpointDefinition(value: unknown): value is EndpointDefinition {
  if (!isRecord(value)) {
    return false;
  }
  const { method, path, parameters } = value;
  if (typeof method !== 'string' || typeof path !== 'string') {
    return false;
  }
  if (parameters === undefined) {
    return true;
  }
  if (!Array.isArray(parameters)) {
    return false;
  }
  return parameters.every(isParameterDefinition);
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
      throw new TypeError(`Invalid endpoint definition at index ${index}.`);
    }
    return endpoint;
  });

  const header = `/**
 * GENERATED FILE - DO NOT EDIT
 *
 * Request parameter schemas derived from the OpenAPI specification.
 */
import { z } from 'zod';
import type { AllowedMethods, ValidPath } from '../path-parameters.js';

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

export function getRequestParameterSchema(
  method: AllowedMethods,
  path: ValidPath,
): RequestParameterSchemas[RequestParameterKey] | undefined {
  const key = method.toUpperCase() + ':' + path;
  return REQUEST_PARAMETER_SCHEMAS[key as RequestParameterKey];
}
`;

  return header + entries + footer;
}
