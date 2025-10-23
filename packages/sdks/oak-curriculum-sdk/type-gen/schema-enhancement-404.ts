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

interface CollisionSummary {
  readonly method: HttpMethod;
  readonly path: string;
  readonly upstreamReference: string;
}

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
  const collisions = collectCollisions(schema, overrides);
  if (collisions.length > 0) {
    throw new Error(formatCollisionMessage(collisions));
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

    const pathItem = decorated.paths[descriptor.path];
    const operation = readOperation(pathItem, descriptor);
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

function collectCollisions(
  schema: OpenAPIObject,
  descriptors: readonly Legitimate404Descriptor[],
): CollisionSummary[] {
  if (!hasPaths(schema)) {
    return [];
  }
  const collisions: CollisionSummary[] = [];
  for (const descriptor of descriptors) {
    if (!Object.hasOwn(schema.paths, descriptor.path)) {
      continue;
    }
    const pathItem = schema.paths[descriptor.path];
    const operation = readOperation(pathItem, descriptor);
    if (operation.responses && Object.hasOwn(operation.responses, '404')) {
      collisions.push({
        method: descriptor.method,
        path: descriptor.path,
        upstreamReference: descriptor.upstreamReference,
      });
    }
  }
  return collisions;
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

function formatCollisionMessage(collisions: readonly CollisionSummary[]): string {
  const intro =
    '🎉 Schema enhancement cleanup required!\n\nThe upstream API schema already documents 404 responses for endpoints configured in add404ResponsesWhereExpected:';
  const bulletList = collisions
    .map(
      (collision) =>
        `• ${collision.method.toUpperCase()} ${collision.path} (tracked via ${collision.upstreamReference})`,
    )
    .join('\n');
  const guidance =
    '\n\nPlease remove the matching entries from ENDPOINTS_WITH_LEGITIMATE_404S in schema-enhancement-404.ts and delete the temporary decorator.';
  return `${intro}\n${bulletList}${guidance}`;
}

function hasPaths(schema: OpenAPIObject): schema is OpenAPIObject & { paths: PathsObject } {
  return !!schema.paths && typeof schema.paths === 'object';
}
