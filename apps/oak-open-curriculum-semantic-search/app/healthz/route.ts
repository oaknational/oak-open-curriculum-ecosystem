import { NextResponse } from 'next/server';
import { esClient } from '../../src/lib/es-client';
import { env, llmEnabled } from '../../src/lib/env';
import { createOakClient } from '@oaknational/oak-curriculum-sdk';

interface HealthStatus {
  es: 'ok' | 'down' | 'error' | 'unknown';
  sdk: 'ok' | 'error' | 'unknown';
  llm: 'enabled' | 'disabled';
}

interface HealthDetails {
  esError?: string;
  sdkError?: unknown;
  fatal?: string;
}

function toMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  try {
    return typeof error === 'string' ? error : JSON.stringify(error);
  } catch {
    return 'Unknown error';
  }
}

async function checkEs(): Promise<Pick<HealthStatus, 'es'> & Pick<HealthDetails, 'esError'>> {
  try {
    const pingOk = await esClient().ping();
    return { es: pingOk ? 'ok' : 'down' };
  } catch (e) {
    return { es: 'error', esError: toMessage(e) };
  }
}

async function checkSdk(
  apiKey: string,
): Promise<{ sdk: 'ok' } | { sdk: 'error'; sdkError: unknown }> {
  try {
    const sdk = createOakClient(apiKey);
    const res = await sdk.GET('/key-stages');
    if (res.data) return { sdk: 'ok' };
    return { sdk: 'error', sdkError: 'No data' };
  } catch (e) {
    return { sdk: 'error', sdkError: toMessage(e) };
  }
}

export async function GET(): Promise<Response> {
  const status: HealthStatus = { es: 'unknown', sdk: 'unknown', llm: 'disabled' };
  const details: HealthDetails = {};
  let http = 200;

  try {
    const e = env();

    const es = await checkEs();
    status.es = es.es;
    if (es.esError) {
      details.esError = es.esError;
      http = 503;
    }

    const sdk = await checkSdk(e.OAK_EFFECTIVE_KEY);
    status.sdk = sdk.sdk;
    if (sdk.sdk === 'error') {
      details.sdkError = sdk.sdkError;
      http = 503;
    }

    status.llm = llmEnabled() ? 'enabled' : 'disabled';
  } catch (e) {
    http = 500;
    details.fatal = toMessage(e);
  }

  return NextResponse.json({ status, details }, { status: http });
}
