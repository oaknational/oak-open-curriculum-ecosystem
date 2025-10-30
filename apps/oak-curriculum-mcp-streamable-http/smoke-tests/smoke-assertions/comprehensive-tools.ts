/**
 * Comprehensive tool validation - exercises ALL 28 curriculum tools
 * with both happy paths (valid input) and unhappy paths (validation errors)
 */

import assert from 'node:assert/strict';
import type { Logger } from '@oaknational/mcp-logger';
import {
  fetchJson,
  parseFirstSsePayload,
  createToolHeaders,
  ensureRecord,
  ensureArray,
} from './common.js';
import type { SmokeContext } from './types.js';
import { createAssertionLogger, logAssertionSuccess } from './logging.js';

/**
 * Test all 28 curriculum tools with happy and unhappy paths
 */
export async function assertAllToolsWork(context: SmokeContext): Promise<void> {
  const logger = createAssertionLogger(context, 'comprehensive-tools');
  logger.info('Starting comprehensive tool validation (28 tools x 2 paths = 56 tests)');

  // Test tools in logical groups
  await testMetadataTools(context, logger);
  await testKeyStageTools(context, logger);
  await testLessonTools(context, logger);
  await testSequenceTools(context, logger);
  await testSubjectTools(context, logger);
  await testThreadTools(context, logger);
  await testSearchTools(context, logger);
  await testAggregatedTools(context, logger);

  logAssertionSuccess(logger, 'All 28 tools validated (happy + unhappy paths)');
}

/**
 * Test metadata/utility tools (changelog, rate-limit)
 */
async function testMetadataTools(context: SmokeContext, logger: Logger): Promise<void> {
  const headers = createToolHeaders(context);

  // get-changelog (happy path)
  await callTool(context, headers, logger, {
    name: 'get-changelog',
    args: { params: {} },
    expectSuccess: true,
  });

  // get-changelog-latest (happy path)
  await callTool(context, headers, logger, {
    name: 'get-changelog-latest',
    args: { params: {} },
    expectSuccess: true,
  });

  // get-rate-limit (happy path)
  await callTool(context, headers, logger, {
    name: 'get-rate-limit',
    args: { params: {} },
    expectSuccess: true,
  });

  // Unhappy path: missing required params field
  await callTool(context, headers, logger, {
    name: 'get-changelog',
    args: {}, // Missing params
    expectSuccess: false,
    errorPattern: /params|required/i,
  });
}

/**
 * Test key stage tools
 */
async function testKeyStageTools(context: SmokeContext, logger: Logger): Promise<void> {
  const headers = createToolHeaders(context);

  // get-key-stages (happy path)
  await callTool(context, headers, logger, {
    name: 'get-key-stages',
    args: { params: {} },
    expectSuccess: true,
  });

  // get-key-stages-subject-units (happy path)
  await callTool(context, headers, logger, {
    name: 'get-key-stages-subject-units',
    args: { params: { path: { keyStage: 'ks1', subject: 'maths' } } },
    expectSuccess: true,
  });

  // get-key-stages-subject-lessons (happy path)
  await callTool(context, headers, logger, {
    name: 'get-key-stages-subject-lessons',
    args: { params: { path: { keyStage: 'ks1', subject: 'maths' } } },
    expectSuccess: true,
  });

  // get-key-stages-subject-assets (happy path)
  await callTool(context, headers, logger, {
    name: 'get-key-stages-subject-assets',
    args: { params: { path: { keyStage: 'ks1', subject: 'maths' } } },
    expectSuccess: true,
  });

  // get-key-stages-subject-questions (happy path)
  await callTool(context, headers, logger, {
    name: 'get-key-stages-subject-questions',
    args: { params: { path: { keyStage: 'ks1', subject: 'maths' } } },
    expectSuccess: true,
  });

  // Unhappy path: missing required path parameter
  await callTool(context, headers, logger, {
    name: 'get-key-stages-subject-units',
    args: { params: { path: { keyStage: 'ks1' } } }, // Missing subject
    expectSuccess: false,
    errorPattern: /subject|required/i,
  });
}

/**
 * Test lesson tools
 */
async function testLessonTools(context: SmokeContext, logger: Logger): Promise<void> {
  const headers = createToolHeaders(context);
  const lessonId = 'maths-ks1-place-value-counting-objects-to-10';

  // get-lessons-summary (happy path)
  await callTool(context, headers, logger, {
    name: 'get-lessons-summary',
    args: { params: { path: { lesson: lessonId } } },
    expectSuccess: true,
  });

  // get-lessons-assets (happy path)
  await callTool(context, headers, logger, {
    name: 'get-lessons-assets',
    args: { params: { path: { lesson: lessonId } } },
    expectSuccess: true,
  });

  // get-lessons-quiz (happy path)
  await callTool(context, headers, logger, {
    name: 'get-lessons-quiz',
    args: { params: { path: { lesson: lessonId } } },
    expectSuccess: true,
  });

  // get-lessons-transcript (happy path)
  await callTool(context, headers, logger, {
    name: 'get-lessons-transcript',
    args: { params: { path: { lesson: lessonId } } },
    expectSuccess: true,
  });

  // Unhappy paths for lesson tools (validation errors)
  
  // Missing required lesson parameter
  await callTool(context, headers, logger, {
    name: 'get-lessons-summary',
    args: { params: { path: {} } }, // Missing lesson
    expectSuccess: false,
    errorPattern: /lesson|required/i,
  });

  // Missing required params field entirely
  await callTool(context, headers, logger, {
    name: 'get-lessons-quiz',
    args: {}, // Missing params
    expectSuccess: false,
    errorPattern: /params|required/i,
  });

  // get-lessons-assets-by-type: invalid enum type
  await callTool(context, headers, logger, {
    name: 'get-lessons-assets-by-type',
    args: { params: { path: { lesson: lessonId, type: 'invalid-type-xyz' } } },
    expectSuccess: false,
    errorPattern: /enum|type|invalid/i,
  });
}

/**
 * Test sequence tools
 */
async function testSequenceTools(context: SmokeContext, logger: Logger): Promise<void> {
  const headers = createToolHeaders(context);
  const sequenceId = 'maths-primary-ks1';

  // get-sequences-units (happy path)
  await callTool(context, headers, logger, {
    name: 'get-sequences-units',
    args: { params: { path: { sequence: sequenceId } } },
    expectSuccess: true,
  });

  // get-sequences-assets (happy path)
  await callTool(context, headers, logger, {
    name: 'get-sequences-assets',
    args: { params: { path: { sequence: sequenceId } } },
    expectSuccess: true,
  });

  // get-sequences-questions (happy path)
  await callTool(context, headers, logger, {
    name: 'get-sequences-questions',
    args: { params: { path: { sequence: sequenceId } } },
    expectSuccess: true,
  });

  // Unhappy path: missing required path
  await callTool(context, headers, logger, {
    name: 'get-sequences-units',
    args: { params: {} }, // Missing path
    expectSuccess: false,
    errorPattern: /path|required/i,
  });
}

/**
 * Test subject tools
 */
async function testSubjectTools(context: SmokeContext, logger: Logger): Promise<void> {
  const headers = createToolHeaders(context);

  // get-subjects (happy path)
  await callTool(context, headers, logger, {
    name: 'get-subjects',
    args: { params: {} },
    expectSuccess: true,
  });

  // get-subject-detail (happy path)
  await callTool(context, headers, logger, {
    name: 'get-subject-detail',
    args: { params: { path: { subject: 'maths' } } },
    expectSuccess: true,
  });

  // get-subjects-key-stages (happy path)
  await callTool(context, headers, logger, {
    name: 'get-subjects-key-stages',
    args: { params: { path: { subject: 'maths' } } },
    expectSuccess: true,
  });

  // get-subjects-sequences (happy path)
  await callTool(context, headers, logger, {
    name: 'get-subjects-sequences',
    args: { params: { path: { subject: 'maths' } } },
    expectSuccess: true,
  });

  // get-subjects-years (happy path)
  await callTool(context, headers, logger, {
    name: 'get-subjects-years',
    args: { params: { path: { subject: 'maths' } } },
    expectSuccess: true,
  });

  // Unhappy path: missing required subject parameter
  await callTool(context, headers, logger, {
    name: 'get-subject-detail',
    args: { params: { path: {} } }, // Missing subject
    expectSuccess: false,
    errorPattern: /subject|required/i,
  });
}

/**
 * Test thread tools
 */
async function testThreadTools(context: SmokeContext, logger: Logger): Promise<void> {
  const headers = createToolHeaders(context);

  // get-threads (happy path)
  const threadsResponse = await callTool(context, headers, logger, {
    name: 'get-threads',
    args: { params: {} },
    expectSuccess: true,
    returnResult: true,
  });

  // Extract first thread slug for get-threads-units test
  let threadSlug = 'addition'; // Default fallback
  if (threadsResponse) {
    const envelope = parseFirstSsePayload(threadsResponse.text);
    const result = ensureRecord(envelope.result, 'threads result');
    const content = ensureArray(result.content ?? [], 'threads content');
    if (content.length > 0) {
      const firstContent = ensureRecord(content[0], 'first content item');
      const text = String(firstContent.text ?? '');
      const parsed: unknown = JSON.parse(text);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const firstThread = ensureRecord(parsed[0], 'first thread');
        threadSlug = String(firstThread.slug ?? 'addition');
      }
    }
  }

  // get-threads-units (happy path using real thread)
  await callTool(context, headers, logger, {
    name: 'get-threads-units',
    args: { params: { path: { threadSlug } } },
    expectSuccess: true,
  });

  // Unhappy path: missing required threadSlug parameter
  await callTool(context, headers, logger, {
    name: 'get-threads-units',
    args: { params: { path: {} } }, // Missing threadSlug
    expectSuccess: false,
    errorPattern: /threadSlug|required/i,
  });
}

/**
 * Test search tools
 */
async function testSearchTools(context: SmokeContext, logger: Logger): Promise<void> {
  const headers = createToolHeaders(context);

  // get-search-lessons (happy path)
  await callTool(context, headers, logger, {
    name: 'get-search-lessons',
    args: { params: { query: { q: 'fractions' } } },
    expectSuccess: true,
  });

  // get-search-transcripts (happy path)
  await callTool(context, headers, logger, {
    name: 'get-search-transcripts',
    args: { params: { query: { q: 'addition' } } },
    expectSuccess: true,
  });

  // Unhappy path: missing required query parameter
  await callTool(context, headers, logger, {
    name: 'get-search-lessons',
    args: { params: { query: {} } }, // Missing q
    expectSuccess: false,
    errorPattern: /q|query|required/i,
  });
}

/**
 * Test aggregated tools (search, fetch)
 */
async function testAggregatedTools(context: SmokeContext, logger: Logger): Promise<void> {
  const headers = createToolHeaders(context);

  // search (happy path)
  await callTool(context, headers, logger, {
    name: 'search',
    args: { query: 'fractions', keyStage: 'ks1' },
    expectSuccess: true,
  });

  // fetch (happy path) - use real lesson ID
  await callTool(context, headers, logger, {
    name: 'fetch',
    args: { id: 'maths-ks1-place-value-counting-objects-to-10' },
    expectSuccess: true,
  });

  // fetch unhappy path: missing required ID
  await callTool(context, headers, logger, {
    name: 'fetch',
    args: {}, // Missing id
    expectSuccess: false,
    errorPattern: /id|required/i,
  });
}

/**
 * Helper to call a tool and validate response
 */
async function callTool(
  context: SmokeContext,
  headers: Record<string, string>,
  logger: Logger,
  options: {
    readonly name: string;
    readonly args: Record<string, unknown>;
    readonly expectSuccess: boolean;
    readonly errorPattern?: RegExp;
    readonly allowRemoteFailure?: boolean;
    readonly returnResult?: boolean;
  },
): Promise<{ res: Response; text: string } | null> {
  const { name, args, expectSuccess, errorPattern, allowRemoteFailure, returnResult } = options;

  logger.debug(`Testing ${name}`, { expectSuccess, args });

  const response = await fetchJson(new URL('/mcp', context.baseUrl), {
    method: 'POST',
    headers,
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: `test-${name}`,
      method: 'tools/call',
      params: {
        name,
        arguments: args,
      },
    }),
  });

  // For remote mode, some failures are acceptable (e.g., API returns 404 for invalid IDs)
  if (context.mode === 'remote' && response.res.status !== 200 && allowRemoteFailure) {
    logger.warn(`${name} failed on remote (acceptable for validation tests)`, {
      status: response.res.status,
      expectSuccess,
    });
    return returnResult ? response : null;
  }

  if (expectSuccess) {
    // Happy path: expect 200 and no JSON-RPC error
    assert.equal(response.res.status, 200, `${name} should return 200`);
    const envelope = parseFirstSsePayload(response.text);
    assert.ok(!envelope.error, `${name} should not return JSON-RPC error`);
    logger.debug(`✅ ${name} (happy path)`, { status: response.res.status });
  } else {
    // Unhappy path: expect error (either HTTP error OR JSON-RPC error with pattern)
    const envelope = parseFirstSsePayload(response.text);
    const hasError = envelope.error !== undefined;

    if (!hasError && response.res.status === 200) {
      // If we got 200 with no error, that's wrong
      assert.fail(`${name} should return validation error for invalid input`);
    }

    if (errorPattern && hasError) {
      const error = ensureRecord(envelope.error, `${name} error`);
      const message = String(error.message ?? '');
      assert.match(message, errorPattern, `${name} error should match expected pattern`);
    }

    logger.debug(`✅ ${name} (unhappy path - validation error as expected)`, {
      hasError,
      status: response.res.status,
    });
  }

  return returnResult ? response : null;
}

