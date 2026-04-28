import { describe, expect, it } from 'vitest';
import { createSentryTags } from './runtime-sinks.js';

describe('createSentryTags (ADR-163 §2 OTel tag convention)', () => {
  it('emits the git.commit.sha key (OTel code.git.commit.sha convention) when gitSha is present', () => {
    const tags = createSentryTags(
      { environment: 'production', release: '1.5.0', gitSha: 'abcdef1234567' },
      'oak-http',
      undefined,
    );

    expect(tags).toMatchObject({ 'git.commit.sha': 'abcdef1234567' });
    expect(tags).not.toHaveProperty('git_sha');
  });

  it('omits git.commit.sha key when gitSha is absent', () => {
    const tags = createSentryTags(
      { environment: 'production', release: '1.5.0' },
      'oak-http',
      undefined,
    );

    expect(tags).not.toHaveProperty('git.commit.sha');
    expect(tags).not.toHaveProperty('git_sha');
  });

  it('includes service, environment, release alongside git.commit.sha', () => {
    const tags = createSentryTags(
      { environment: 'preview', release: 'branch-build-1', gitSha: 'fedcba9876543' },
      'oak-search-cli',
      undefined,
    );

    expect(tags).toEqual({
      service: 'oak-search-cli',
      environment: 'preview',
      release: 'branch-build-1',
      'git.commit.sha': 'fedcba9876543',
    });
  });

  it('includes traceId and spanId when trace context is provided', () => {
    const tags = createSentryTags(
      { environment: 'development', release: 'local', gitSha: '0123456789abc' },
      'oak-http',
      { traceId: 'trace-id', spanId: 'span-id' },
    );

    expect(tags).toEqual({
      service: 'oak-http',
      environment: 'development',
      release: 'local',
      'git.commit.sha': '0123456789abc',
      traceId: 'trace-id',
      spanId: 'span-id',
    });
  });
});
