#!/usr/bin/env node
/**
 * Request Runner for Production Build Harness
 *
 * Sends a sequence of test requests to the running harness server
 * and reports timing and success/failure status.
 *
 * Usage:
 *   node scripts/run-requests.js
 *
 * Environment:
 *   BASE_URL - Server base URL (default: http://localhost:3001)
 *   TIMEOUT_MS - Request timeout in milliseconds (default: 10000)
 *   RETRY_HEALTH_ATTEMPTS - Health check retry attempts (default: 30)
 *   RETRY_HEALTH_DELAY_MS - Delay between health check retries (default: 1000)
 */

// Node.js built-in fetch is available in Node 18+
const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';
const TIMEOUT_MS = parseInt(process.env.TIMEOUT_MS || '10000', 10);
const RETRY_HEALTH_ATTEMPTS = parseInt(process.env.RETRY_HEALTH_ATTEMPTS || '30', 10);
const RETRY_HEALTH_DELAY_MS = parseInt(process.env.RETRY_HEALTH_DELAY_MS || '1000', 10);

// Logging utilities
const log = {
  info: (msg, meta = {}) => {
    const entry = {
      timestamp: new Date().toISOString(),
      level: 'INFO',
      message: msg,
      ...meta,
    };
    console.log(JSON.stringify(entry));
  },
  error: (msg, meta = {}) => {
    const entry = {
      timestamp: new Date().toISOString(),
      level: 'ERROR',
      message: msg,
      ...meta,
    };
    console.error(JSON.stringify(entry));
  },
  success: (msg, meta = {}) => {
    const entry = {
      timestamp: new Date().toISOString(),
      level: 'SUCCESS',
      message: msg,
      ...meta,
    };
    console.log(JSON.stringify(entry));
  },
};

// Sleep utility
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Request with timeout
async function fetchWithTimeout(url, options, timeoutMs) {
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
    if (error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeoutMs}ms`, { cause: error });
    }
    throw error;
  }
}

// Wait for server to be ready
async function waitForHealthCheck() {
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
        error: error.message,
      });
    }

    if (attempt < RETRY_HEALTH_ATTEMPTS) {
      await sleep(RETRY_HEALTH_DELAY_MS);
    }
  }

  throw new Error(`Server health check failed after ${RETRY_HEALTH_ATTEMPTS} attempts`);
}

// Execute a single request scenario
async function executeRequest(scenario) {
  const { name, method, path, body, headers = {} } = scenario;

  log.info(`Executing request: ${name}`, { method, path });

  const startTime = Date.now();
  let success = false;
  let status = null;
  let errorMessage = null;
  let responseBody;

  try {
    const url = `${BASE_URL}${path}`;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    if (body) {
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
    errorMessage = error.message;
    log.error(`Request error: ${name}`, {
      error: errorMessage,
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
    errorMessage,
  };
}

// Main execution
async function main() {
  log.info('Request runner starting', {
    baseUrl: BASE_URL,
    timeoutMs: TIMEOUT_MS,
  });

  const results = [];
  let allSucceeded = true;

  try {
    // Wait for server to be ready
    await waitForHealthCheck();

    // Define request scenarios
    const scenarios = [
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

    // Execute each scenario
    for (const scenario of scenarios) {
      const result = await executeRequest(scenario);
      results.push(result);

      if (!result.success) {
        allSucceeded = false;
      }

      // Brief pause between requests
      await sleep(500);
    }

    // Print summary table
    console.log('\n' + '='.repeat(80));
    console.log('REQUEST SUMMARY');
    console.log('='.repeat(80));
    console.log('Name                    | Method | Status | Duration | Result');
    console.log('-'.repeat(80));

    for (const result of results) {
      const name = result.name.padEnd(23);
      const method = result.method.padEnd(6);
      const status = (result.status || 'ERROR').toString().padEnd(6);
      const duration = `${result.durationMs}ms`.padEnd(8);
      const resultStr = result.success ? '✅ OK' : '❌ FAIL';

      console.log(`${name} | ${method} | ${status} | ${duration} | ${resultStr}`);

      if (result.errorMessage) {
        console.log(`  Error: ${result.errorMessage}`);
      }
    }

    console.log('='.repeat(80));

    // Overall summary
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
      error: error.message,
      stack: error.stack,
    });
    process.exit(1);
  }
}

// Run
main();
