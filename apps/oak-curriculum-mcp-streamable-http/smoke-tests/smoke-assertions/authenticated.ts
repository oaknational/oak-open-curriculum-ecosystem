import assert from 'node:assert/strict';

import { extractToolPayload, fetchToolResponse, parseToolResult } from './tools.js';
import { REQUIRED_ACCEPT, type SmokeContext } from './types.js';
import { createAssertionLogger, logAssertionSuccess } from './logging.js';
import { createClerkOAuthAccessToken } from '../auth/clerk-oauth-token.js';
import { createToolHeaders } from './common.js';

export async function assertAuthenticatedToolCall(context: SmokeContext): Promise<void> {
  if (process.env.SMOKE_CLERK_PROGRAMMATIC_AUTH === 'false') {
    const logger = createAssertionLogger(context, 'auth-happy-path');
    logger.warn(
      'Skipping authenticated MCP call - set SMOKE_CLERK_PROGRAMMATIC_AUTH=true to enable programmatic auth assertions',
    );
    return;
  }

  const logger = createAssertionLogger(context, 'auth-happy-path');
  logger.debug('Using backend API OAuth helper (programmatic PKCE flow)');
  const access = await createClerkOAuthAccessToken();

  const accessToken = access.accessToken;
  const headers = {
    ...createToolHeaders(context),
    Accept: REQUIRED_ACCEPT,
    Authorization: `Bearer ${accessToken}`,
  };

  try {
    const response = await fetchToolResponse(context, headers, logger);
    assert.ok(response, 'Authenticated tool call should return a response');
    const { envelope, resultRecord } = parseToolResult(response, logger);
    assert.ok(!envelope.error, 'Authenticated tool call should not return an error envelope');
    const payload = extractToolPayload(resultRecord, logger);
    assert.ok(payload.length > 0, 'Authenticated tool call should return at least one item');

    logAssertionSuccess(logger, 'Authenticated get-key-stages call succeeded', {
      itemCount: payload.length,
    });
  } finally {
    await access.cleanup();
  }
}
