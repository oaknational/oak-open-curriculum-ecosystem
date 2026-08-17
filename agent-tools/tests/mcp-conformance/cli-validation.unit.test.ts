import { describe, expect, it } from 'vitest';

import { validateCliState, type CliState } from '../../src/mcp-conformance/cli-validation.js';

const RUNNABLE: CliState = {
  help: false,
  unattended: false,
  seed: false,
  drive: false,
  compat: false,
  target: 'https://curriculum-mcp-alpha.oaknational.dev/mcp',
  suites: ['protocol'],
  credentialsFile: undefined,
  reportDir: undefined,
  baselineDir: undefined,
  packOut: undefined,
  preambleFile: undefined,
  suiteErrors: [],
};

/** A runnable compat invocation: no suite vocabulary, credentials allowed. */
const RUNNABLE_COMPAT: CliState = { ...RUNNABLE, compat: true, suites: [] };

describe('validateCliState — the compat operation has its own vocabulary', () => {
  it('a runnable compat invocation validates clean', () => {
    expect(validateCliState({ ...RUNNABLE_COMPAT })).toBeUndefined();
  });

  it('compat accepts --credentials-file: reading the tool surface needs the authed surface', () => {
    expect(
      validateCliState({ ...RUNNABLE_COMPAT, credentialsFile: 'tmp/creds.json' }),
    ).toBeUndefined();
  });

  it('refuses --compat with --seed: seeding authors a suite baseline, and compat keeps none', () => {
    const refusal = validateCliState({ ...RUNNABLE_COMPAT, seed: true });
    expect(refusal).toContain('--seed');
  });

  it('refuses --compat with --baseline-dir: compat keeps no baseline to read either', () => {
    const refusal = validateCliState({ ...RUNNABLE_COMPAT, baselineDir: 'tmp/baselines' });
    expect(refusal).toContain('--baseline-dir');
  });

  it('refuses credentials over a cleartext non-loopback target: the token would ride in clear', () => {
    const refusal = validateCliState({
      ...RUNNABLE_COMPAT,
      target: 'http://mcp.example.test/mcp',
      credentialsFile: 'tmp/creds.json',
    });
    expect(refusal).toContain('https');
  });

  it('exempts loopback from the cleartext refusal: local capture is the documented workflow', () => {
    expect(
      validateCliState({
        ...RUNNABLE_COMPAT,
        target: 'http://localhost:3333/mcp',
        credentialsFile: 'tmp/creds.json',
      }),
    ).toBeUndefined();
  });

  it('refuses --compat with --drive: they are different operations', () => {
    const refusal = validateCliState({ ...RUNNABLE_COMPAT, drive: true });
    expect(refusal).toContain('different operations');
  });

  it('refuses --compat with --suite: compat evaluates hosts, not suites', () => {
    const refusal = validateCliState({ ...RUNNABLE_COMPAT, suites: ['protocol'] });
    expect(refusal).toContain('--suite');
  });

  it('refuses --compat with --unattended: the tool surface needs the authed read', () => {
    const refusal = validateCliState({ ...RUNNABLE_COMPAT, unattended: true });
    expect(refusal).toContain('--unattended');
  });

  it('refuses the drive-only pack flags on a compat run', () => {
    expect(validateCliState({ ...RUNNABLE_COMPAT, packOut: 'tmp/pack.md' })).toContain(
      '--pack-out',
    );
    expect(validateCliState({ ...RUNNABLE_COMPAT, preambleFile: 'tmp/preamble.json' })).toContain(
      '--preamble-file',
    );
  });
});

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
