/**
 * Unit tests for `buildSearchSdkConfig`.
 *
 * Verifies the pure config normalisation — especially the webhook-URL
 * filtering logic that maps `'none'` and empty values to `undefined`.
 */

import { describe, it, expect } from 'vitest';
import { buildSearchSdkConfig } from './build-search-sdk-config.js';
import type { CliSdkEnv } from './create-cli-sdk.js';

/** Minimal valid env fixture for tests. */
function baseEnv(overrides: Partial<CliSdkEnv> = {}): CliSdkEnv {
  return {
    ELASTICSEARCH_URL: 'http://localhost:9200',
    ELASTICSEARCH_API_KEY: 'test-key',
    SEARCH_INDEX_TARGET: 'primary',
    ...overrides,
  };
}

describe('buildSearchSdkConfig', () => {
  it('returns indexTarget from env', () => {
    const config = buildSearchSdkConfig(baseEnv({ SEARCH_INDEX_TARGET: 'sandbox' }));
    expect(config.indexTarget).toBe('sandbox');
  });

  it('passes indexVersion through when set', () => {
    const config = buildSearchSdkConfig(baseEnv({ SEARCH_INDEX_VERSION: 'v42' }));
    expect(config.indexVersion).toBe('v42');
  });

  it('leaves indexVersion undefined when not set', () => {
    const config = buildSearchSdkConfig(baseEnv());
    expect(config.indexVersion).toBeUndefined();
  });

  it('maps a real webhook URL through to config', () => {
    const config = buildSearchSdkConfig(
      baseEnv({ ZERO_HIT_WEBHOOK_URL: 'https://hooks.example.com/zero-hit' }),
    );
    expect(config.zeroHit?.webhookUrl).toBe('https://hooks.example.com/zero-hit');
  });

  it('maps "none" webhook URL to undefined', () => {
    const config = buildSearchSdkConfig(baseEnv({ ZERO_HIT_WEBHOOK_URL: 'none' }));
    expect(config.zeroHit?.webhookUrl).toBeUndefined();
  });

  it('maps undefined webhook URL to undefined', () => {
    const config = buildSearchSdkConfig(baseEnv({ ZERO_HIT_WEBHOOK_URL: undefined }));
    expect(config.zeroHit?.webhookUrl).toBeUndefined();
  });

  it('passes persistence settings through', () => {
    const config = buildSearchSdkConfig(
      baseEnv({
        ZERO_HIT_PERSISTENCE_ENABLED: true,
        ZERO_HIT_INDEX_RETENTION_DAYS: 90,
      }),
    );
    expect(config.zeroHit?.persistenceEnabled).toBe(true);
    expect(config.zeroHit?.retentionDays).toBe(90);
  });
});
