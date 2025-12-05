import type { Middleware } from 'openapi-fetch';
import {
  augmentResponseWithCanonicalUrl,
  augmentArrayResponseWithCanonicalUrl,
} from '../../response-augmentation.js';

/**
 * Creates middleware that augments API responses with canonical URLs.
 *
 * This middleware intercepts successful GET responses and adds
 * `canonicalUrl` fields based on content type and available context.
 *
 * The augmentation is idempotent - if a response already has a
 * `canonicalUrl` field, it will be preserved.
 *
 * @returns OpenAPI-Fetch middleware that augments responses.
 */
export function createResponseAugmentationMiddleware(): Middleware {
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
      const augmentedBody = augmentBody(body, path);

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

function augmentBody(body: unknown, path: string): unknown {
  if (Array.isArray(body)) {
    return augmentArrayResponseWithCanonicalUrl(body, path, 'get');
  }
  if (body && typeof body === 'object') {
    return augmentResponseWithCanonicalUrl(body, path, 'get');
  }
  return undefined;
}
