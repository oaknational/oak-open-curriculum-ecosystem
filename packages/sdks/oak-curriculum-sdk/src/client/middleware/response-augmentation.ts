import type { Middleware } from 'openapi-fetch';
import {
  augmentResponseWithCanonicalUrl,
  augmentArrayResponseWithCanonicalUrl,
} from '../../response-augmentation.js';
import {
  UnifiedLogger,
  buildResourceAttributes,
  logLevelToSeverityNumber,
} from '@oaknational/logger';
import type { Logger } from '@oaknational/logger';
import { createNodeStdoutSink } from '@oaknational/logger/node';

interface MiddlewareOptions {
  readonly logger?: Logger;
}

/**
 * Creates middleware that augments API responses with canonical URLs.
 *
 * This middleware intercepts successful GET responses and adds
 * `canonicalUrl` fields based on content type and available context.
 *
 * The augmentation is idempotent - if a response already has a
 * `canonicalUrl` field, it will be preserved.
 *
 * @param options - Optional configuration. Provide a `logger` for
 *   dependency injection; defaults to a WARN-level UnifiedLogger.
 * @returns OpenAPI-Fetch middleware that augments responses.
 */
export function createResponseAugmentationMiddleware(options?: MiddlewareOptions): Middleware {
  const log = options?.logger ?? createDefaultLogger();
  return {
    async onResponse({ request, response }) {
      if (!shouldAugmentResponse(request, response)) {
        return response;
      }

      const body = await safeParseJson(response.clone());
      if (body === undefined) {
        return response;
      }

      const path = extractApiPath(request.url);
      const augmentedBody = augmentBody(body, path, log);

      if (augmentedBody === undefined) {
        return response;
      }

      return new Response(JSON.stringify(augmentedBody), {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      });
    },
  };
}

function shouldAugmentResponse(request: Request, response: Response): boolean {
  if (request.method.toLowerCase() !== 'get' || !response.ok) {
    return false;
  }
  const contentType = response.headers.get('content-type');
  return contentType?.includes('application/json') ?? false;
}

async function safeParseJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return undefined;
  }
}

function extractApiPath(url: string): string {
  const parsed = new URL(url);
  return parsed.pathname.replace(/^\/api\/v\d+/, '');
}

function createDefaultLogger(): Logger {
  return new UnifiedLogger({
    minSeverity: logLevelToSeverityNumber('WARN'),
    resourceAttributes: buildResourceAttributes(
      process.env,
      'response-augmentation-middleware',
      process.env.npm_package_version ?? '0.0.0',
    ),
    context: {},
    stdoutSink: createNodeStdoutSink(),
    fileSink: null,
  });
}

/**
 * Augments a parsed response body with canonical URLs.
 *
 * Error containment: canonical URL decoration is supplementary and
 * must never kill the API call. If augmentation fails, the
 * unaugmented response is returned and the failure is logged.
 *
 * @see ADR-034 — system boundaries and type assertions
 */
function augmentBody(body: unknown, path: string, log: Logger): unknown {
  try {
    if (Array.isArray(body)) {
      return augmentArrayResponseWithCanonicalUrl(body, path, 'get');
    }
    if (body && typeof body === 'object') {
      return augmentResponseWithCanonicalUrl(body, path, 'get');
    }
    return undefined;
  } catch (error: unknown) {
    try {
      log.warn(
        `Response augmentation failed for ${path}: ${error instanceof Error ? error.message : String(error)}`,
      );
    } catch {
      /* Logger failure must not propagate — augmentation is best-effort */
    }
    return undefined;
  }
}
