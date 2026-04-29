#!/usr/bin/env node
/**
 * Request Runner for Production Build Harness
 *
 * Sends a sequence of test requests to the running harness server
 * and reports timing and success/failure status.
 *
 * Usage: pnpm exec tsx scripts/run-requests.ts
 *
 * Environment:
 *   BASE_URL - Server base URL (default: http://localhost:3001)
 *   TIMEOUT_MS - Request timeout in milliseconds (default: 10000)
 *   RETRY_HEALTH_ATTEMPTS - Health check retry attempts (default: 30)
 *   RETRY_HEALTH_DELAY_MS - Delay between health check retries (default: 1000)
 */

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3001';
const TIMEOUT_MS = parseInt(process.env.TIMEOUT_MS ?? '10000', 10);
const RETRY_HEALTH_ATTEMPTS = parseInt(process.env.RETRY_HEALTH_ATTEMPTS ?? '30', 10);
const RETRY_HEALTH_DELAY_MS = parseInt(process.env.RETRY_HEALTH_DELAY_MS ?? '1000', 10);

type LogLevel = 'INFO' | 'ERROR' | 'SUCCESS';
type LogMeta = Readonly<Record<string, unknown>>;

function emit(level: LogLevel, msg: string, meta: LogMeta = {}): void {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message: msg,
    ...meta,
  };
  const out = level === 'ERROR' ? process.stderr : process.stdout;
  out.write(`${JSON.stringify(entry)}\n`);
}

const log = {
  info: (msg: string, meta?: LogMeta) => emit('INFO', msg, meta),
  error: (msg: string, meta?: LogMeta) => emit('ERROR', msg, meta),
  success: (msg: string, meta?: LogMeta) => emit('SUCCESS', msg, meta),
};

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function errorName(error: unknown): string {
  return error instanceof Error ? error.name : 'UnknownError';
}

function errorStack(error: unknown): string | undefined {
  return error instanceof Error ? error.stack : undefined;
}

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeout);
    return response;
  } catch (error) {
    clearTimeout(timeout);
    if (errorName(error) === 'AbortError') {
      throw new Error(`Request timeout after ${timeoutMs}ms`, { cause: error });
    }
    throw error;
  }
}

async function waitForHealthCheck(): Promise<true> {
  log.info('Waiting for server health check', {
    url: `${BASE_URL}/healthz`,
    maxAttempts: RETRY_HEALTH_ATTEMPTS,
    delayMs: RETRY_HEALTH_DELAY_MS,
  });

  for (let attempt = 1; attempt <= RETRY_HEALTH_ATTEMPTS; attempt++) {
    try {
      const response = await fetchWithTimeout(`${BASE_URL}/healthz`, { method: 'GET' }, 5000);

      if (response.ok) {
        log.success('Server is ready', { attempt, status: response.status });
        return true;
      }

      log.info('Health check returned non-OK status', {
        attempt,
        status: response.status,
      });
    } catch (error) {
      log.info('Health check failed, retrying', {
        attempt,
        error: errorMessage(error),
      });
    }

    if (attempt < RETRY_HEALTH_ATTEMPTS) {
      await sleep(RETRY_HEALTH_DELAY_MS);
    }
  }

  throw new Error(`Server health check failed after ${RETRY_HEALTH_ATTEMPTS} attempts`);
}

interface RequestScenario {
  readonly name: string;
  readonly method: string;
  readonly path: string;
  readonly body?: unknown;
  readonly headers?: Readonly<Record<string, string>>;
}

interface RequestResult {
  readonly name: string;
  readonly method: string;
  readonly path: string;
  readonly success: boolean;
  readonly status: number | null;
  readonly durationMs: number;
  readonly errorMessage: string | null;
}

async function executeRequest(scenario: RequestScenario): Promise<RequestResult> {
  const { name, method, path, body, headers = {} } = scenario;

  log.info(`Executing request: ${name}`, { method, path });

  const startTime = Date.now();
  let success = false;
  let status: number | null = null;
  let errMsg: string | null = null;
  let responseBody: unknown;

  try {
    const url = `${BASE_URL}${path}`;
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    if (body !== undefined) {
      options.body = JSON.stringify(body);
    }

    const response = await fetchWithTimeout(url, options, TIMEOUT_MS);
    status = response.status;

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      responseBody = await response.json();
    } else {
      responseBody = await response.text();
    }

    success = response.ok;

    if (success) {
      log.success(`Request succeeded: ${name}`, {
        status,
        durationMs: Date.now() - startTime,
      });
    } else {
      log.error(`Request failed: ${name}`, {
        status,
        durationMs: Date.now() - startTime,
        responsePreview:
          typeof responseBody === 'string'
            ? responseBody.substring(0, 200)
            : JSON.stringify(responseBody).substring(0, 200),
      });
    }
  } catch (error) {
    errMsg = errorMessage(error);
    log.error(`Request error: ${name}`, {
      error: errMsg,
      durationMs: Date.now() - startTime,
    });
  }

  return {
    name,
    method,
    path,
    success,
    status,
    durationMs: Date.now() - startTime,
    errorMessage: errMsg,
  };
}

async function main(): Promise<void> {
  log.info('Request runner starting', {
    baseUrl: BASE_URL,
    timeoutMs: TIMEOUT_MS,
  });

  const results: RequestResult[] = [];
  let allSucceeded = true;

  try {
    await waitForHealthCheck();

    const scenarios: readonly RequestScenario[] = [
      {
        name: 'Health Check',
        method: 'GET',
        path: '/healthz',
      },
      {
        name: 'Landing Page',
        method: 'GET',
        path: '/',
      },
      {
        name: 'MCP Initialize',
        method: 'POST',
        path: '/mcp',
        headers: {
          Accept: 'application/json, text/event-stream',
        },
        body: {
          jsonrpc: '2.0',
          id: 1,
          method: 'initialize',
          params: {
            protocolVersion: '2024-11-05',
            capabilities: {},
            clientInfo: {
              name: 'harness-request-runner',
              version: '1.0.0',
            },
          },
        },
      },
    ];

    for (const scenario of scenarios) {
      const result = await executeRequest(scenario);
      results.push(result);

      if (!result.success) {
        allSucceeded = false;
      }

      await sleep(500);
    }

    process.stdout.write('\n' + '='.repeat(80) + '\n');
    process.stdout.write('REQUEST SUMMARY\n');
    process.stdout.write('='.repeat(80) + '\n');
    process.stdout.write('Name                    | Method | Status | Duration | Result\n');
    process.stdout.write('-'.repeat(80) + '\n');

    for (const result of results) {
      const name = result.name.padEnd(23);
      const method = result.method.padEnd(6);
      const statusStr = (result.status === null ? 'ERROR' : result.status.toString()).padEnd(6);
      const duration = `${result.durationMs}ms`.padEnd(8);
      const resultStr = result.success ? '✅ OK' : '❌ FAIL';

      process.stdout.write(`${name} | ${method} | ${statusStr} | ${duration} | ${resultStr}\n`);

      if (result.errorMessage) {
        process.stdout.write(`  Error: ${result.errorMessage}\n`);
      }
    }

    process.stdout.write('='.repeat(80) + '\n');

    const totalDuration = results.reduce((sum, r) => sum + r.durationMs, 0);
    const successCount = results.filter((r) => r.success).length;
    const failCount = results.length - successCount;

    log.info('Request runner completed', {
      totalRequests: results.length,
      succeeded: successCount,
      failed: failCount,
      totalDurationMs: totalDuration,
      overallResult: allSucceeded ? 'SUCCESS' : 'FAILURE',
    });

    if (allSucceeded) {
      log.success('All requests succeeded');
      process.exit(0);
    } else {
      log.error('Some requests failed');
      process.exit(1);
    }
  } catch (error) {
    log.error('Request runner failed', {
      error: errorMessage(error),
      stack: errorStack(error),
    });
    process.exit(1);
  }
}

await main();

export {};
