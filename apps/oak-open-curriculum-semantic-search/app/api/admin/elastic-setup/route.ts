import { NextResponse, type NextRequest } from 'next/server';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import {
  resolveFixtureModeFromRequest,
  applyFixtureModeCookie,
  type FixtureMode,
} from '../../../lib/fixture-mode';
import { buildAdminStreamFixture, createStreamResponse } from '../../../lib/admin-fixtures';

export const runtime = 'nodejs';

function makeEnv(): NodeJS.ProcessEnv {
  return {
    ...process.env,
    ELASTICSEARCH_URL: process.env.ELASTICSEARCH_URL,
    ELASTICSEARCH_API_KEY: process.env.ELASTICSEARCH_API_KEY,
  };
}

function missingElasticEnv(): string[] {
  return ['ELASTICSEARCH_URL', 'ELASTICSEARCH_API_KEY'].filter((key) => {
    const value = process.env[key];
    return typeof value !== 'string' || value.trim().length === 0;
  });
}

function toUint8(buffer: Buffer): Uint8Array {
  return new Uint8Array(buffer);
}

function safeErrorText(err: unknown): string {
  if (err instanceof Error) {
    return err.message;
  }
  if (typeof err === 'string') {
    return err;
  }
  try {
    return JSON.stringify(err);
  } catch {
    return 'Unknown error';
  }
}

function withPersist(response: NextResponse, persist: FixtureMode | undefined): NextResponse {
  applyFixtureModeCookie(response, persist);
  return response;
}

function respondWithFixture(mode: FixtureMode, persist: FixtureMode | undefined): NextResponse {
  const fixture = buildAdminStreamFixture('elastic-setup', mode);
  return withPersist(createStreamResponse(fixture), persist);
}

function respondWithMissingEnv(missing: string[], persist: FixtureMode | undefined): NextResponse {
  const message = `Missing required environment variables: ${missing.join(', ')}`;
  const response = new NextResponse(message, {
    status: 400,
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
  return withPersist(response, persist);
}

function buildScriptResponse(persist: FixtureMode | undefined): NextResponse {
  const scriptPath = fileURLToPath(new URL('../../../../scripts/setup.sh', import.meta.url));
  const cwd = path.dirname(scriptPath);
  const env = makeEnv();

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const proc = spawn('bash', [scriptPath], { cwd, env });

      proc.stdout.on('data', (chunk: Buffer) => {
        controller.enqueue(toUint8(chunk));
      });
      proc.stderr.on('data', (chunk: Buffer) => {
        controller.enqueue(toUint8(chunk));
      });
      proc.on('error', (err) => {
        const msg = Buffer.from(`\n[error] ${safeErrorText(err)}\n`);
        controller.enqueue(new Uint8Array(msg));
      });
      proc.on('close', (code) => {
        const codeText: string = code === null ? 'null' : String(code);
        const msg = Buffer.from(`\n[done] exit code ${codeText}\n`);
        controller.enqueue(new Uint8Array(msg));
        controller.close();
      });
    },
  });

  const response = new NextResponse(stream, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
  return withPersist(response, persist);
}

export async function POST(request: NextRequest): Promise<Response> {
  const { mode, persist } = resolveFixtureModeFromRequest(request);

  if (mode !== 'live') {
    return respondWithFixture(mode, persist);
  }

  const missing = missingElasticEnv();
  if (missing.length > 0) {
    return respondWithMissingEnv(missing, persist);
  }

  return buildScriptResponse(persist);
}
