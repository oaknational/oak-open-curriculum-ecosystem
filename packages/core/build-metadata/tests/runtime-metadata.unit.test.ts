import { describe, expect, it } from 'vitest';

import {
  getDisplayHostname,
  resolveApplicationVersion,
  resolveGitSha,
} from '../src/runtime-metadata.js';

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

    expect(result.value.value).toBe('1.5.0');
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

describe('resolveGitSha', () => {
  it('prefers GIT_SHA_OVERRIDE', () => {
    const result = resolveGitSha({
      GIT_SHA_OVERRIDE: '3ad6f452abc123def4567890abc123def4567890',
      VERCEL_GIT_COMMIT_SHA: 'c8b666485ecb08b5dc27e428737b4077c0531f57',
    });

    expect(result).toEqual({
      ok: true,
      value: {
        value: '3ad6f452abc123def4567890abc123def4567890',
        source: 'GIT_SHA_OVERRIDE',
      },
    });
  });

  it('uses VERCEL_GIT_COMMIT_SHA when no override is present', () => {
    const result = resolveGitSha({
      VERCEL_GIT_COMMIT_SHA: 'c8b666485ecb08b5dc27e428737b4077c0531f57',
    });

    expect(result).toEqual({
      ok: true,
      value: {
        value: 'c8b666485ecb08b5dc27e428737b4077c0531f57',
        source: 'VERCEL_GIT_COMMIT_SHA',
      },
    });
  });

  it('returns undefined when no git metadata is present', () => {
    const result = resolveGitSha({});

    expect(result).toEqual({
      ok: true,
      value: undefined,
    });
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
