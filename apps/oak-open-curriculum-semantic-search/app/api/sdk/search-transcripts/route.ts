/* eslint-disable @typescript-eslint/no-restricted-types -- REFACTOR */
import { type NextRequest, NextResponse } from 'next/server';
import { env } from '../../../../src/lib/env';
import {
  createOakPathBasedClient,
  validateRequest,
  isValidationSuccess,
} from '@oaknational/oak-curriculum-sdk';
import type { KeyStage, Subject, OakApiPathBasedClient } from '@oaknational/oak-curriculum-sdk';
import { isKeyStage, isSubject } from '../../../../src/adapters/sdk-guards';

interface TranscriptQuery {
  readonly q: string;
  readonly keyStage?: KeyStage;
  readonly subject?: Subject;
}

type TranscriptParseResult =
  | { ok: true; query: TranscriptQuery }
  | { ok: false; status: number; body: unknown };

/**
 * Dependencies for the search transcripts handler.
 * Accepts the SDK client factory as a parameter for testability per ADR-078.
 */
export interface SearchTranscriptsDependencies {
  readonly createClient: (apiKey: string) => OakApiPathBasedClient;
  readonly apiKey: string;
}

/**
 * Default dependencies using the real SDK client.
 * Production code uses this; tests inject simple fakes.
 */
export function createDefaultDependencies(): SearchTranscriptsDependencies {
  return {
    createClient: createOakPathBasedClient,
    apiKey: env().OAK_EFFECTIVE_KEY,
  };
}

/**
 * Core handler logic that accepts dependencies as parameters.
 * This is the testable unit - tests pass simple fakes, no mocking required.
 */
export async function handleSearchTranscripts(
  req: NextRequest,
  deps: SearchTranscriptsDependencies,
): Promise<Response> {
  const parsed = parseTranscriptRequest(await req.json());
  if (!parsed.ok) {
    return NextResponse.json(parsed.body, { status: parsed.status });
  }

  const client = deps.createClient(deps.apiKey);
  const response = await client['/search/transcripts'].GET({
    params: {
      query: parsed.query,
    },
  });

  if (!response.response.ok) {
    return NextResponse.json(
      { error: response.response.statusText },
      { status: response.response.status },
    );
  }
  return NextResponse.json(response.data ?? []);
}

/**
 * Next.js route handler - thin wrapper that creates default dependencies.
 * Tests should use handleSearchTranscripts directly with injected fakes.
 */
export async function POST(req: NextRequest): Promise<Response> {
  return handleSearchTranscripts(req, createDefaultDependencies());
}

function parseTranscriptRequest(raw: unknown): TranscriptParseResult {
  const validation = validateRequest('/search/transcripts', 'get', raw);
  if (!isValidationSuccess(validation)) {
    return { ok: false, status: 400, body: { error: validation.issues } };
  }

  const payload = ensureObject(validation.value, 'Search transcripts request must be an object');
  const query = readString(payload, 'q');
  if (!query || query.trim().length === 0) {
    return { ok: false, status: 400, body: { error: 'Query must be a non-empty string' } };
  }

  return {
    ok: true,
    query: {
      q: query,
      keyStage: pickKeyStage(payload),
      subject: pickSubject(payload),
    },
  };
}

function ensureObject(value: unknown, errorMessage: string): object {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(errorMessage);
  }
  return value;
}

function readOwnProperty(source: object, key: PropertyKey): unknown {
  const descriptor = Object.getOwnPropertyDescriptor(source, key);
  return descriptor?.value;
}

function readString(source: object, key: PropertyKey): string | undefined {
  const value = readOwnProperty(source, key);
  return typeof value === 'string' ? value : undefined;
}

function pickKeyStage(value: object): KeyStage | undefined {
  const candidate = readString(value, 'keyStage');
  return candidate && isKeyStage(candidate) ? candidate : undefined;
}

function pickSubject(value: object): Subject | undefined {
  const candidate = readString(value, 'subject');
  return candidate && isSubject(candidate) ? candidate : undefined;
}
