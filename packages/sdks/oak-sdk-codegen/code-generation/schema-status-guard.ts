import type { OperationObject } from 'openapi3-ts/oas31';

export interface ResponseStatusGuardContext {
  readonly decorator: string;
  readonly method: string;
  readonly path: string;
  readonly statusCode: string;
  readonly upstreamReference?: string;
}

/**
 * Ensures a decorator never overwrites an existing response status for a given operation.
 * Guards against both upstream schema collisions and duplicate decorations within the pipeline.
 */
export function assertResponseStatusSlotAvailable(
  operation: OperationObject,
  context: ResponseStatusGuardContext,
): void {
  const responses = operation.responses ?? {};
  if (!Object.hasOwn(responses, context.statusCode)) {
    return;
  }

  const segments = [
    `Cannot add HTTP ${context.statusCode} response via ${context.decorator} for ${context.method.toUpperCase()} ${context.path}.`,
    'The schema already defines this status code; remove the temporary decorator or coordinate the upstream schema update.',
  ];

  if (context.upstreamReference) {
    segments.push(`Upstream tracking reference: ${context.upstreamReference}`);
  }

  throw new Error(segments.join(' '));
}
