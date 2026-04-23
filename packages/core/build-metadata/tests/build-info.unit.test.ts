import { describe, expect, it } from 'vitest';

import { buildBuildInfo, serialiseBuildInfo, type BuildInfo } from '../src/build-info.js';
import type { ResolvedBuildTimeRelease } from '../src/build-time-release.js';

const FIXTURE_RELEASE: ResolvedBuildTimeRelease = {
  value: 'preview-feat-otel-c8b6664',
  source: 'preview_branch_sha',
  environment: 'preview',
  gitSha: 'c8b666485ecb08b5dc27e428737b4077c0531f57',
};

const FIXTURE_NOW = new Date('2026-04-23T12:34:56.000Z');

describe('buildBuildInfo', () => {
  it('maps the resolver result onto the persisted shape', () => {
    const info = buildBuildInfo({
      release: FIXTURE_RELEASE,
      branch: 'feat/otel_sentry_enhancements',
      now: FIXTURE_NOW,
    });

    expect(info).toEqual<BuildInfo>({
      release: 'preview-feat-otel-c8b6664',
      releaseSource: 'preview_branch_sha',
      environment: 'preview',
      gitSha: 'c8b666485ecb08b5dc27e428737b4077c0531f57',
      branch: 'feat/otel_sentry_enhancements',
      generatedAt: '2026-04-23T12:34:56.000Z',
      schemaVersion: 1,
    });
  });

  it('preserves an undefined gitSha and branch', () => {
    const info = buildBuildInfo({
      release: { ...FIXTURE_RELEASE, gitSha: undefined },
      branch: undefined,
      now: FIXTURE_NOW,
    });

    expect(info.gitSha).toBeUndefined();
    expect(info.branch).toBeUndefined();
  });
});

describe('serialiseBuildInfo', () => {
  it('produces stable two-space-indented JSON with a trailing newline', () => {
    const info = buildBuildInfo({
      release: FIXTURE_RELEASE,
      branch: 'feat/otel_sentry_enhancements',
      now: FIXTURE_NOW,
    });

    const serialised = serialiseBuildInfo(info);

    expect(serialised.endsWith('\n')).toBe(true);
    expect(serialised).toBe(
      [
        '{',
        '  "release": "preview-feat-otel-c8b6664",',
        '  "releaseSource": "preview_branch_sha",',
        '  "environment": "preview",',
        '  "gitSha": "c8b666485ecb08b5dc27e428737b4077c0531f57",',
        '  "branch": "feat/otel_sentry_enhancements",',
        '  "generatedAt": "2026-04-23T12:34:56.000Z",',
        '  "schemaVersion": 1',
        '}',
        '',
      ].join('\n'),
    );
  });

  it('round-trips through JSON.parse', () => {
    const info = buildBuildInfo({
      release: FIXTURE_RELEASE,
      branch: 'feat/otel_sentry_enhancements',
      now: FIXTURE_NOW,
    });

    expect(JSON.parse(serialiseBuildInfo(info))).toEqual(info);
  });
});
