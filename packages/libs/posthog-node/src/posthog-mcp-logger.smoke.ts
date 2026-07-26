import assert from 'node:assert/strict';
import { setTimeout as delay } from 'node:timers/promises';

import { PostHogMCP, setLogger } from '@posthog/mcp';

const SENSITIVE_DETAIL = 'vendor-sensitive-detail';
let failureMessage: string | undefined;

class ThrowingCapturePostHogMcp extends PostHogMCP {
  override capture(): void {
    assert.fail(SENSITIVE_DETAIL);
  }
}

setLogger((message) => {
  if (message.startsWith('Failed to capture PostHog event ')) {
    failureMessage = message;
  }
});
const client = new ThrowingCapturePostHogMcp('phc_smoke');
client.captureInitialize({
  distinctId: 'oakph:v1:smoke:actor',
  properties: {},
  protocolVersion: '2025-06-18',
});

await delay(25);
setLogger(undefined);
await client._shutdown(100);

assert(
  failureMessage?.includes(SENSITIVE_DETAIL) === true,
  'The PostHog MCP SDK did not surface its suppressed capture failure',
);
