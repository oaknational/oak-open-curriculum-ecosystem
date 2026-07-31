import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import playwrightConfig from '../playwright.config.js';
import { HttpEnvSchema } from '../src/env.js';
import { resolveHttpDevExecutionPlan } from './development/http-dev-contract.js';

/**
 * The developer's ambient app `.env.local` analytics selection, modelled
 * as the lowest layer of the merge the webServer child sees. In the real
 * chain these keys arrive through `resolveEnv`'s file layers, BELOW
 * process env — so an ambient key the config block also pins loses to
 * the pin, and a key the block omits reaches the server. Spreading the
 * file layer first reproduces that precedence without reading any real
 * env file.
 */
const ambientPosthogSelection = {
  OBSERVABILITY_SINKS: '["posthog"]',
  POSTHOG_PROJECT_API_KEY: 'phc_test_dummy',
  POSTHOG_HOST: 'https://eu.i.posthog.com',
  POSTHOG_PSEUDONYM_ACTIVE_KEY_ID: 'k_test',
  POSTHOG_PSEUDONYM_KEYRING: '[{"id":"k_test","key":"test-key"}]',
};

// Boundary parse of the config shape this model reads: a missing or
// multi-entry webServer block means the model no longer describes the
// harness, so the file fails at its cause with the collection error.
const uiWebServerEnv: NodeJS.ProcessEnv = z
  .object({ env: z.record(z.string(), z.string()) })
  .parse(playwrightConfig.webServer).env;

function serverEnvSeenBy(composedParentEnv: NodeJS.ProcessEnv): NodeJS.ProcessEnv {
  const plan = resolveHttpDevExecutionPlan({
    mode: 'observe-noauth',
    workspaceRoot: '/workspace/apps/oak-curriculum-mcp-streamable-http',
    parentEnv: composedParentEnv,
    now: new Date(2026, 6, 30, 9, 0, 0),
  });
  return plan.server.env;
}

describe('test:ui webServer analytics-axis pin', () => {
  it('boots under an ambient posthog selection because the config layer pins the axis', () => {
    const parsed = HttpEnvSchema.parse(
      serverEnvSeenBy({ ...ambientPosthogSelection, ...uiWebServerEnv }),
    );
    expect(parsed.OBSERVABILITY_SINKS).not.toContain('posthog');
  });

  it('cannot boot when the config layer stops pinning the axis: posthog under disabled auth is refused', () => {
    const unpinned = { ...uiWebServerEnv };
    delete unpinned.OBSERVABILITY_SINKS;
    expect(() =>
      HttpEnvSchema.parse(serverEnvSeenBy({ ...ambientPosthogSelection, ...unpinned })),
    ).toThrow(/posthog cannot be selected while DANGEROUSLY_DISABLE_AUTH is true/);
  });
});
