import { type NextRequest, NextResponse } from 'next/server';
import { env } from '../../../../src/lib/env';
import {
  createOakPathBasedClient,
  validateRequest,
  isValidationSuccess,
} from '@oaknational/oak-curriculum-sdk';
import type { KeyStage, Subject } from '@oaknational/oak-curriculum-sdk';
import { isKeyStage, isSubject } from '../../../../src/adapters/sdk-guards';

interface TranscriptQuery {
  readonly q: string;
  readonly keyStage?: KeyStage;
  readonly subject?: Subject;
}

type TranscriptParseResult =
  | { ok: true; query: TranscriptQuery }
  | { ok: false; status: number; body: unknown };

export async function POST(req: NextRequest): Promise<Response> {
  const parsed = parseTranscriptRequest(await req.json());
  if (!parsed.ok) {
    return NextResponse.json(parsed.body, { status: parsed.status });
  }

  const client = createOakPathBasedClient(env().OAK_EFFECTIVE_KEY);
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
