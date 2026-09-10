import { describe, expect, it } from 'vitest';

import { validateCliState, type CliState } from '../../src/mcp-conformance/cli-validation.js';

const RUNNABLE: CliState = {
  help: false,
  unattended: false,
  seed: false,
  drive: false,
  target: 'https://mcp.thenational.academy/mcp',
  suites: ['protocol'],
  credentialsFile: undefined,
  reportDir: undefined,
  baselineDir: undefined,
  packOut: undefined,
  preambleFile: undefined,
  suiteErrors: [],
};

describe('validateCliState — refusals are loud, the runnable state is silent', () => {
  it('a runnable state validates clean', () => {
    expect(validateCliState({ ...RUNNABLE })).toBeUndefined();
  });

  it('an oauth-only invocation with --credentials-file is refused naming the cure (the flag would be silently dropped)', () => {
    const refusal = validateCliState({
      ...RUNNABLE,
      suites: ['oauth'],
      credentialsFile: 'tmp/creds.json',
    });
    expect(refusal).toContain('not consumed by the oauth suite');
    expect(refusal).toContain('protocol | apps');
  });

  it('a mixed suite set keeps --credentials-file (protocol and apps consume it)', () => {
    expect(
      validateCliState({
        ...RUNNABLE,
        suites: ['oauth', 'apps'],
        credentialsFile: 'tmp/creds.json',
      }),
    ).toBeUndefined();
  });

  it('--unattended with --credentials-file is refused (the unattended plan is credential-free)', () => {
    const refusal = validateCliState({
      ...RUNNABLE,
      unattended: true,
      credentialsFile: 'tmp/creds.json',
    });
    expect(refusal).toContain('credential-free');
  });

  it('a missing target is refused', () => {
    expect(validateCliState({ ...RUNNABLE, target: undefined })).toBe('--target is required');
  });

  it('duplicate suites are refused naming the duplicates', () => {
    const refusal = validateCliState({ ...RUNNABLE, suites: ['protocol', 'protocol'] });
    expect(refusal).toContain('duplicate --suite');
    expect(refusal).toContain('protocol');
  });
});

describe('validateCliState — the drive operation (MCP-303)', () => {
  const DRIVE: CliState = { ...RUNNABLE, drive: true, suites: [] };

  it('a drive with a target and credentials validates clean', () => {
    expect(validateCliState({ ...DRIVE, credentialsFile: 'tmp/creds.json' })).toBeUndefined();
  });

  it('drive and seed are mutually exclusive operations', () => {
    const refusal = validateCliState({ ...DRIVE, seed: true });
    expect(refusal).toContain('--drive');
    expect(refusal).toContain('--seed');
  });

  it('drive enumerates from the server, so --suite is refused', () => {
    const refusal = validateCliState({ ...DRIVE, suites: ['protocol'] });
    expect(refusal).toContain('--suite');
    expect(refusal).toContain('enumerates');
  });

  it('drive has no unattended mode — the flag is refused', () => {
    const refusal = validateCliState({ ...DRIVE, unattended: true });
    expect(refusal).toContain('--unattended');
  });

  it('drive derives from the live surface, so --baseline-dir is refused rather than silently ignored', () => {
    const refusal = validateCliState({ ...DRIVE, baselineDir: 'somewhere/baselines' });
    expect(refusal).toContain('--baseline-dir');
  });

  it('pack-out and preamble-file only mean something under --drive', () => {
    expect(validateCliState({ ...RUNNABLE, packOut: 'tmp/pack.md' })).toContain('--drive');
    expect(validateCliState({ ...RUNNABLE, preambleFile: 'tmp/preamble.json' })).toContain(
      '--drive',
    );
  });
});
