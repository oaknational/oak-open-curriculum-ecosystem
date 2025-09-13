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

function classifySdkHttp(msg: string): number {
  if (/ENOTFOUND|ECONNREFUSED|timeout|network/i.test(msg)) return 503;
  if (!/^https?:\/\//.test(process.env.OAK_API_KEY ?? '')) return 400;
  if (/GET\s*:\s*\/key-stages/i.test(msg) || /Unknown host|Invalid URL|400|401|403|404/.test(msg))
    return 400;
  return 503;
}

async function buildHealth(): Promise<{
  status: HealthStatus;
  details: HealthDetails;
  http: number;
}> {
  const status: HealthStatus = { es: 'unknown', sdk: 'unknown', llm: 'disabled' };
  const details: HealthDetails = {};
  let http = 200;

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
    http = classifySdkHttp(toMessage(sdk.sdkError));
  }

  status.llm = llmEnabled() ? 'enabled' : 'disabled';
  return { status, details, http };
}

export async function GET(): Promise<Response> {
  try {
    const { status, details, http } = await buildHealth();
    return NextResponse.json({ status, details }, { status: http });
  } catch (e) {
    const msg = toMessage(e);
    const http =
      /required|invalid|Set OAK_API_KEY|OPENAI_API_KEY|ELASTICSEARCH_URL|SEARCH_API_KEY/i.test(msg)
        ? 400
        : 500;
    return NextResponse.json(
      { status: { es: 'unknown', sdk: 'unknown', llm: 'disabled' }, details: { fatal: msg } },
      { status: http },
    );
  }
}
