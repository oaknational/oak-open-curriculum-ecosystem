import { z } from 'zod';
import { STRUCTURED_FIXTURE_OUTAGE_MESSAGE } from './content/structured-search-messages';

const ErrorPayloadSchema = z
  .object({
    message: z.string().optional(),
    error: z.string().optional(),
  })
  .catchall(z.unknown());

/**
 * Error type carrying structured metadata about structured-search HTTP failures.
 */
export class StructuredSearchRequestError extends Error {
  readonly statusCode: number | null;

  readonly code: string | null;

  constructor(params: { message: string; statusCode?: number; code?: string }) {
    super(params.message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = 'StructuredSearchRequestError';
    this.statusCode = typeof params.statusCode === 'number' ? params.statusCode : null;
    this.code = typeof params.code === 'string' ? params.code : null;
  }
}

export function formatStructuredSearchError(error: unknown): string {
  if (error instanceof StructuredSearchRequestError) {
    if (error.statusCode === 503) {
      return STRUCTURED_FIXTURE_OUTAGE_MESSAGE;
    }
    if (typeof error.statusCode === 'number') {
      return `Search failed (${error.statusCode}). Try again later.`;
    }
    return error.message.length > 0 ? error.message : 'Search failed. Try again later.';
  }

  if (error instanceof Error && typeof error.message === 'string' && error.message.length > 0) {
    return error.message;
  }

  return 'Search failed. Try again later.';
}

export function createStructuredSearchError(
  response: Response,
  body: unknown,
): StructuredSearchRequestError {
  const payload = parseErrorPayload(body);
  const message = readString(payload?.message);
  const code = readString(payload?.error);
  const fallback =
    response.status === 503
      ? 'Fixture mode requested an error response for structured search.'
      : 'Search failed';

  return new StructuredSearchRequestError({
    message: message ?? fallback,
    statusCode: response.status,
    code: code ?? undefined,
  });
}

function parseErrorPayload(value: unknown): { message?: string; error?: string } | null {
  const parsed = ErrorPayloadSchema.safeParse(value);
  if (!parsed.success) {
    return null;
  }
  return parsed.data;
}

function readString(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}
