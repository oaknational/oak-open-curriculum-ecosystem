/* eslint-disable max-statements, max-lines-per-function, complexity */
import { NextResponse, type NextRequest } from 'next/server';
import {
  resolveFixtureModeFromRequest,
  applyFixtureModeCookie,
  type FixtureMode,
} from '../../../lib/fixture-mode';
import { buildAdminStreamFixture, createStreamResponse } from '../../../lib/admin-fixtures';
import { runSetup, verifyConnection } from '../../../../src/lib/elasticsearch/setup/index';

export const runtime = 'nodejs';

function missingElasticEnv(): string[] {
  return ['ELASTICSEARCH_URL', 'ELASTICSEARCH_API_KEY'].filter((key) => {
    const value = process.env[key];
    return typeof value !== 'string' || value.trim().length === 0;
  });
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

function buildSetupResponse(persist: FixtureMode | undefined): NextResponse {
  const esUrl = process.env.ELASTICSEARCH_URL;
  const esKey = process.env.ELASTICSEARCH_API_KEY;

  if (!esUrl || !esKey) {
    return respondWithMissingEnv(['ELASTICSEARCH_URL', 'ELASTICSEARCH_API_KEY'], persist);
  }

  const config = { elasticsearchUrl: esUrl, elasticsearchApiKey: esKey, verbose: false };

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const encoder = new TextEncoder();
      const write = (text: string) => controller.enqueue(encoder.encode(text));

      try {
        write('Verifying Elasticsearch connection...\n');
        const connection = await verifyConnection(config);

        if (!connection.connected) {
          write(`Connection failed: ${connection.error ?? 'Unknown error'}\n`);
          write('[done] exit code 1\n');
          controller.close();
          return;
        }

        write(`Connected to ${connection.clusterName} (v${connection.version})\n\n`);
        write('Running setup...\n');

        const result = await runSetup(config);

        write(`\nSynonyms: ${result.synonymCount} entries\n`);
        for (const idx of result.indexResults) {
          const status =
            idx.status === 'created'
              ? '✓ created'
              : idx.status === 'exists'
                ? '○ exists'
                : `✗ error: ${idx.error ?? 'Unknown error'}`;
          write(`  ${idx.indexName}: ${status}\n`);
        }

        const errors = result.indexResults.filter((r) => r.status === 'error').length;
        write(`\n[done] exit code ${errors > 0 ? 1 : 0}\n`);
        controller.close();
      } catch (err) {
        write(`\n[error] ${safeErrorText(err)}\n`);
        write('[done] exit code 1\n');
        controller.close();
      }
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

  return buildSetupResponse(persist);
}
