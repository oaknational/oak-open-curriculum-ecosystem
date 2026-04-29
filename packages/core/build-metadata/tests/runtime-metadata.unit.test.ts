import { ROOT_PACKAGE_VERSION } from '@oaknational/env';
import { describe, expect, it } from 'vitest';

import { getDisplayHostname, resolveApplicationVersion } from '../src/runtime-metadata.js';

describe('resolveApplicationVersion', () => {
  it('uses APP_VERSION_OVERRIDE when present', () => {
    const result = resolveApplicationVersion({
      APP_VERSION_OVERRIDE: '1.2.3',
    });

    expect(result).toEqual({
      ok: true,
      value: {
        value: '1.2.3',
        source: 'APP_VERSION_OVERRIDE',
      },
    });
  });

  it('uses the root package version when no override is present', () => {
    const result = resolveApplicationVersion({});

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(result.value.value).toBe(ROOT_PACKAGE_VERSION);
    expect(result.value.source).toBe('root_package_json');
  });

  it('returns an error for invalid overrides', () => {
    const result = resolveApplicationVersion({
      APP_VERSION_OVERRIDE: 'development',
    });

    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }

    expect(result.error.message).toContain('Invalid APP_VERSION_OVERRIDE value');
  });
});

describe('getDisplayHostname', () => {
  it('prefers the production hostname in production', () => {
    expect(
      getDisplayHostname({
        VERCEL_ENV: 'production',
        VERCEL_URL: 'preview-example.vercel.app',
        VERCEL_PROJECT_PRODUCTION_URL: 'Custom-Domain.Example',
      }),
    ).toBe('custom-domain.example');
  });

  it('falls back to VERCEL_URL outside production', () => {
    expect(
      getDisplayHostname({
        VERCEL_ENV: 'preview',
        VERCEL_URL: 'Preview-Example.Vercel.App',
      }),
    ).toBe('preview-example.vercel.app');
  });
});
