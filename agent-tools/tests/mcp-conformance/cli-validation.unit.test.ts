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

  it('refuses credentials against an unparseable target — the target gate fails closed', () => {
    // A credential-gating check that waves through a URL it cannot inspect is
    // no gate: the token would still ride the run.
    const refusal = validateCliState({
      ...RUNNABLE_COMPAT,
      credentialsFile: 'tmp/creds.json',
      target: 'not a url',
    });
    expect(refusal).toContain('does not parse as a URL');
  });

  it('the cleartext refusal covers drive and the suites too — the exposure is credential-scoped', () => {
    // Review found the earlier compat-only placement left a drive or verdict
    // run's token on a cleartext wire unrefused.
    const cleartext = { target: 'http://mcp.example.test/mcp', credentialsFile: 'tmp/creds.json' };
    expect(validateCliState({ ...RUNNABLE, drive: true, suites: [], ...cleartext })).toContain(
      'https',
    );
    expect(validateCliState({ ...RUNNABLE, ...cleartext })).toContain('https');
    expect(
      validateCliState({
        ...RUNNABLE,
        drive: true,
        suites: [],
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

  it('a target embedding URL userinfo is refused: reports echo the target verbatim', () => {
    const refusal = validateCliState({
      ...RUNNABLE,
      target: 'https://user:secret@mcp.example.test/mcp',
    });
    expect(refusal).toContain('must not embed credentials');
    expect(refusal).toContain('--credentials-file');
  });

  it('a username-only userinfo is refused too — the shape leaks identity even without a password', () => {
    expect(
      validateCliState({ ...RUNNABLE, target: 'https://user@mcp.example.test/mcp' }),
    ).toContain('must not embed credentials');
  });

  it('a token in the target query string is refused — the target is echoed into reports', () => {
    const refusal = validateCliState({
      ...RUNNABLE,
      target: 'https://mcp.example.test/mcp?access_token=ya29.SECRET',
    });
    expect(refusal).toContain('must not carry credentials in its query or fragment');
    expect(refusal).toContain('--credentials-file');
  });

  it('a token in the target fragment is refused too — a fragment is not searchParams', () => {
    expect(
      validateCliState({ ...RUNNABLE, target: 'https://mcp.example.test/mcp#token=SECRET' }),
    ).toContain('must not carry credentials');
  });

  it('a benign query parameter is NOT refused — the guard names credential keys, not all queries', () => {
    expect(
      validateCliState({ ...RUNNABLE, target: 'https://mcp.example.test/mcp?page=2' }),
    ).toBeUndefined();
  });

  it('an unparseable target is refused for EVERY operation, credentialed or not — fail closed', () => {
    // The first cut of this branch failed open uncredentialed, justified by
    // "the emit sites redact the target". Review falsified that: the
    // redactor's name set is deliberately narrower than the validator's, so a
    // scheme-typo target smuggled `?token=` past both layers. Every operation
    // hands the target to `mcpjam --url`, which needs a URL — there is no
    // legitimate non-URL target, so nothing is lost by refusing.
    expect(
      validateCliState({ ...RUNNABLE, target: 'mcp.example.test/mcp?token=SECRET' }),
    ).toContain('does not parse as a URL');
  });

  it('a non-http(s) protocol is refused — `user:secret@host` parses as protocol `user:`', () => {
    // WHATWG URL reads `user:SECRET@h.test/mcp` as scheme `user:` with an
    // empty username, so the userinfo check alone never sees the secret. The
    // protocol gate closes that class structurally; mcpjam speaks http(s)
    // only, so no legitimate target is refused.
    const refusal = validateCliState({ ...RUNNABLE, target: 'user:SECRET@mcp.example.test/mcp' });
    expect(refusal).toContain('http(s)');
    expect(validateCliState({ ...RUNNABLE, target: 'ws://mcp.example.test/mcp' })).toContain(
      'http(s)',
    );
  });

  it('a credential in a fragment that carries its own `?` is refused — the SPA callback shape', () => {
    // `#/cb?code=SECRET` makes URLSearchParams read the key as `/cb?code`,
    // which slips a structural check; the raw-string scan cannot be misled.
    expect(
      validateCliState({ ...RUNNABLE, target: 'https://mcp.example.test/mcp?x=1#/cb?code=SECRET' }),
    ).toContain('must not carry credentials');
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
