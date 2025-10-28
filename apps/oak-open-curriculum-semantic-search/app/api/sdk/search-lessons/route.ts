import { type NextRequest, NextResponse } from 'next/server';
import { env } from '../../../../src/lib/env';
import {
  createOakPathBasedClient,
  validateRequest,
  isValidationSuccess,
} from '@oaknational/oak-curriculum-sdk';
import type { KeyStage, Subject } from '@oaknational/oak-curriculum-sdk';
import { isKeyStage, isSubject } from '../../../../src/adapters/sdk-guards';

interface LessonsQuery {
  readonly q: string;
  readonly keyStage?: KeyStage;
  readonly subject?: Subject;
  readonly unit?: string;
  readonly limit: number;
  readonly offset: number;
}

interface LessonsParseFailure {
  readonly status: number;
  readonly body: unknown;
}

type LessonsParseResult = { ok: true; query: LessonsQuery } | ({ ok: false } & LessonsParseFailure);

export async function POST(req: NextRequest): Promise<Response> {
  const parsed = parseLessonsRequest(await req.json());
  if (!parsed.ok) {
    return NextResponse.json(parsed.body, { status: parsed.status });
  }

  const client = createOakPathBasedClient(env().OAK_EFFECTIVE_KEY);
  const response = await client['/search/lessons'].GET({
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

function parseLessonsRequest(raw: unknown): LessonsParseResult {
  const validation = validateRequest('/search/lessons', 'get', raw);
  if (!isValidationSuccess(validation)) {
    return { ok: false, status: 400, body: { error: validation.issues } };
  }

  const payload = ensureObject(validation.value, 'Search lessons request must be an object');
  const prompt = readString(payload, 'q');
  if (!prompt || prompt.trim().length === 0) {
    return { ok: false, status: 400, body: { error: 'Query must be a non-empty string' } };
  }

  return {
    ok: true,
    query: {
      q: prompt,
      keyStage: pickKeyStage(payload),
      subject: pickSubject(payload),
      unit: pickUnit(payload),
      limit: normaliseLimit(readInteger(payload, 'limit')),
      offset: normaliseOffset(readInteger(payload, 'offset')),
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

function readInteger(source: object, key: PropertyKey): number | undefined {
  const value = readOwnProperty(source, key);
  if (typeof value !== 'number' || !Number.isInteger(value)) {
    return undefined;
  }
  return value;
}

function pickKeyStage(value: object): KeyStage | undefined {
  const candidate = readString(value, 'keyStage');
  return candidate && isKeyStage(candidate) ? candidate : undefined;
}

function pickSubject(value: object): Subject | undefined {
  const candidate = readString(value, 'subject');
  return candidate && isSubject(candidate) ? candidate : undefined;
}

function pickUnit(value: object): string | undefined {
  const candidate = readString(value, 'unit');
  return candidate && candidate.length > 0 ? candidate : undefined;
}

function normaliseLimit(value: number | undefined): number {
  if (typeof value === 'number' && value >= 1 && value <= 100) {
    return value;
  }
  return 20;
}

function normaliseOffset(value: number | undefined): number {
  if (typeof value === 'number' && value >= 0) {
    return value;
  }
  return 0;
}
