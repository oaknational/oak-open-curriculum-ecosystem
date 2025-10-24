/**
 * Temporary schema enhancement that documents legitimate 404 responses until the upstream
 * OpenAPI schema is updated. Each entry must cite an upstream tracking reference so the
 * decorator can be removed as soon as the source contract closes the gap.
 *
 * @see .agent/plans/upstream-api-metadata-wishlist.md item #4
 */
import type {
  MediaTypeObject,
  OpenAPIObject,
  OperationObject,
  PathItemObject,
  PathsObject,
  ResponseObject,
} from 'openapi3-ts/oas31';
import { assertResponseStatusSlotAvailable } from './schema-status-guard.js';

type HttpMethod = 'delete' | 'get' | 'head' | 'options' | 'patch' | 'post' | 'put' | 'trace';

interface Legitimate404Descriptor {
  readonly method: HttpMethod;
  readonly path: string;
  readonly reason: string;
  readonly upstreamReference: string;
  readonly example: {
    readonly statusCode: number;
    readonly message: string;
    readonly error: string;
  };
}

const transcript404Descriptor: Legitimate404Descriptor = {
  method: 'get',
  path: '/lessons/{lesson}/transcript',
  reason:
    'Lessons without accompanying video content legitimately return HTTP 404 so callers can distinguish "no transcript available" from invalid lesson slugs.',
  upstreamReference: '.agent/plans/upstream-api-metadata-wishlist.md item #4',
  example: {
    statusCode: 404,
    message: 'Transcript not available for this lesson',
    error: 'Not Found',
  },
};

/**
 * Central list of endpoints where the API currently returns a legitimate 404 but the
 * upstream OpenAPI schema has not yet documented it. Each entry MUST reference an
 * upstream tracking issue so we can remove the temporary decorator as soon as the schema
 * is updated.
 */
export const ENDPOINTS_WITH_LEGITIMATE_404S: readonly Legitimate404Descriptor[] = [
  transcript404Descriptor,
] as const;

/**
 * Adds temporary 404 response documentation for known endpoints where the API legitimately
 * returns 404 but the upstream schema has not yet been updated. The decorator fails fast if
 * the upstream schema starts documenting the response so that the configuration can be
 * removed promptly.
 */
export function add404ResponsesWhereExpected(
  schema: OpenAPIObject,
  overrides: readonly Legitimate404Descriptor[] = ENDPOINTS_WITH_LEGITIMATE_404S,
): OpenAPIObject {
  if (!hasPaths(schema)) {
    throw new Error('OpenAPI schema is missing paths object; cannot decorate responses.');
  }
  const decorated = structuredClone(schema);
  if (!hasPaths(decorated)) {
    throw new Error('OpenAPI schema is missing paths object; cannot decorate responses.');
  }

  for (const descriptor of overrides) {
    if (!Object.hasOwn(decorated.paths, descriptor.path)) {
      throw new Error(
        `Configured legitimate 404 endpoint ${descriptor.method.toUpperCase()} ${descriptor.path} was not found in the schema.`,
      );
    }
    if (!Object.hasOwn(schema.paths, descriptor.path)) {
      throw new Error(
        `Configured legitimate 404 endpoint ${descriptor.method.toUpperCase()} ${descriptor.path} was not found in the schema.`,
      );
    }

    const guardContext = {
      decorator: 'add404ResponsesWhereExpected',
      method: descriptor.method,
      path: descriptor.path,
      statusCode: '404',
      upstreamReference: descriptor.upstreamReference,
    };

    const originalOperation = readOperation(schema.paths[descriptor.path], descriptor);
    assertResponseStatusSlotAvailable(originalOperation, guardContext);

    const pathItem = decorated.paths[descriptor.path];
    const operation = readOperation(pathItem, descriptor);
    assertResponseStatusSlotAvailable(operation, guardContext);
    const responses = operation.responses ?? {};
    const media: MediaTypeObject = {
      schema: {
        type: 'object',
        description: 'Standard Oak API error envelope emitted for legitimate 404 responses.',
        required: ['statusCode', 'message', 'error'],
        properties: {
          statusCode: {
            type: 'integer',
            example: descriptor.example.statusCode,
            description: 'HTTP status code indicating the type of error.',
          },
          message: {
            type: 'string',
            example: descriptor.example.message,
            description: 'Human-readable message describing why the resource is unavailable.',
          },
          error: {
            type: 'string',
            example: descriptor.example.error,
            description: 'Short error label returned by the API.',
          },
        },
      },
      example: descriptor.example,
    };

    const response: ResponseObject = {
      description: [
        'Temporary: Documented locally until the upstream schema captures this legitimate 404 response.',
        descriptor.reason,
        `Tracking: ${descriptor.upstreamReference}`,
      ].join('\n\n'),
      content: {
        'application/json': media,
      },
    };

    operation.responses = { ...responses, '404': response };
  }

  return decorated;
}

function readOperation(
  pathItem: PathItemObject,
  descriptor: Legitimate404Descriptor,
): OperationObject {
  const candidate = pathItem[descriptor.method];
  if (!candidate) {
    throw new Error(
      `Configured legitimate 404 endpoint ${descriptor.method.toUpperCase()} ${descriptor.path} has no operation in the schema.`,
    );
  }
  return candidate;
}

function hasPaths(schema: OpenAPIObject): schema is OpenAPIObject & { paths: PathsObject } {
  return !!schema.paths && typeof schema.paths === 'object';
}
