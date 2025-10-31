import assert from 'node:assert/strict';

import { extractToolPayload, fetchToolResponse, parseToolResult } from './tools.js';
import { REQUIRED_ACCEPT, type SmokeContext } from './types.js';
import { createAssertionLogger, logAssertionSuccess } from './logging.js';
import { createClerkOAuthAccessToken } from '../auth/clerk-oauth-token.js';
import { acquireHeadlessOAuthToken } from '../auth/headless-oauth-token.js';
import { createToolHeaders } from './common.js';

async function resolveSmokeAccess(
  logger: ReturnType<typeof createAssertionLogger>,
): Promise<
  | Awaited<ReturnType<typeof createClerkOAuthAccessToken>>
  | Awaited<ReturnType<typeof acquireHeadlessOAuthToken>>
> {
  if (process.env.SMOKE_USE_HEADLESS_OAUTH === 'true') {
    const headlessAccess = await acquireHeadlessOAuthToken();
    logger.debug('Using headless Playwright OAuth helper', {
      issuedAt: headlessAccess.metadata.issuedAt,
      oauthApplicationId: headlessAccess.metadata.oauthApplicationId,
    });
    return headlessAccess;
  }

  logger.debug('Using backend API OAuth helper (programmatic PKCE flow)');
  return createClerkOAuthAccessToken();
}

export async function assertAuthenticatedToolCall(context: SmokeContext): Promise<void> {
  if (process.env.SMOKE_CLERK_PROGRAMMATIC_AUTH === 'false') {
    const logger = createAssertionLogger(context, 'auth-happy-path');
    logger.warn(
      'Skipping authenticated MCP call - set SMOKE_CLERK_PROGRAMMATIC_AUTH=true to enable programmatic auth assertions',
    );
    return;
  }

  const logger = createAssertionLogger(context, 'auth-happy-path');
  const access = await resolveSmokeAccess(logger);

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
