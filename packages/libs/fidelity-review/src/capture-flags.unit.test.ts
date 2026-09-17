import { describe, expect, it } from 'vitest';

import {
  allowLoopbackOrigin,
  isAllowedRequestUrl,
  isSuspect,
  resolveBase,
  resolveWidth,
} from './capture-flags';

const ENV: NodeJS.ProcessEnv = { NODE_ENV: 'test' };
const DEFAULT_BASE = 'http://localhost:3010';

describe('resolveWidth', () => {
  it('defaults to the matched-geometry standard 1440', () => {
    const result = resolveWidth([], ENV);

    expect(result.ok ? result.value : result.error).toBe(1440);
  });

  it('prefers the --width flag over the WIDTH env var', () => {
    const result = resolveWidth(['--width', '1280'], { ...ENV, WIDTH: '900' });

    expect(result.ok ? result.value : result.error).toBe(1280);
  });

  it('reads the WIDTH env var when no flag is passed', () => {
    const result = resolveWidth([], { ...ENV, WIDTH: '900' });

    expect(result.ok ? result.value : result.error).toBe(900);
  });

  it('rejects non-integer, suffixed, fractional, and out-of-range widths loudly', () => {
    for (const raw of ['abc', '1440px', '1440.5', '100', '9000']) {
      const result = resolveWidth(['--width', raw], ENV);

      expect(result.ok).toBe(false);
    }
  });

  it('rejects a valueless --width flag instead of silently falling through', () => {
    // A user typing `--width` with no value must hear about it — a
    // silent fall-through to env/default hands them a width they did
    // not ask for.
    const result = resolveWidth(['--width'], { ...ENV, WIDTH: '1280' });

    expect(result.ok).toBe(false);
    expect(result.ok ? undefined : result.error.message).toContain('--width requires a value');
  });
});

describe('resolveBase', () => {
  it('answers the supplied default when nothing overrides it', () => {
    const result = resolveBase([], ENV, DEFAULT_BASE);

    expect(result.ok ? result.value : result.error).toBe('http://localhost:3010');
  });

  it('prefers the --base flag over BASE_URL and strips trailing slashes', () => {
    const result = resolveBase(
      ['--base', 'http://localhost:4000/'],
      { ...ENV, BASE_URL: 'http://127.0.0.1:9' },
      DEFAULT_BASE,
    );

    expect(result.ok ? result.value : result.error).toBe('http://localhost:4000');
  });

  it('reads BASE_URL when no flag is passed', () => {
    const result = resolveBase([], { ...ENV, BASE_URL: 'http://localhost:5000' }, DEFAULT_BASE);

    expect(result.ok ? result.value : result.error).toBe('http://localhost:5000');
  });

  it('rejects a valueless --base flag instead of silently falling through', () => {
    const result = resolveBase(
      ['--base'],
      { ...ENV, BASE_URL: 'http://localhost:5000' },
      DEFAULT_BASE,
    );

    expect(result.ok).toBe(false);
    expect(result.ok ? undefined : result.error.message).toContain('--base requires a value');
  });

  it('rejects a flag-shaped --base value — `--base --report-only` must fail, not eat the flag', () => {
    const result = resolveBase(['--base', '--report-only'], ENV, DEFAULT_BASE);

    expect(result.ok).toBe(false);
  });

  it('rejects a non-loopback base — capture egress is confined to local servers', () => {
    const result = resolveBase(['--base', 'http://example.com:3000'], ENV, DEFAULT_BASE);

    expect(result.ok).toBe(false);
    expect(result.ok ? undefined : result.error.message).toContain('loopback');
  });
});

describe('allowLoopbackOrigin', () => {
  it('admits exactly the loopback hosts, on either http scheme', () => {
    for (const base of [
      'http://localhost:3020',
      'http://127.0.0.1:3030',
      'http://[::1]:3010',
      'https://localhost:8443',
    ]) {
      const result = allowLoopbackOrigin(base);

      expect(result.ok).toBe(true);
    }
  });

  it('refuses non-loopback hosts, including lookalike subdomains', () => {
    for (const base of [
      'http://example.com',
      'http://localhost.evil.example',
      'http://169.254.169.254/latest/meta-data',
      'http://10.0.0.5:3020',
    ]) {
      const result = allowLoopbackOrigin(base);

      expect(result.ok).toBe(false);
    }
  });

  it('refuses non-http(s) schemes and unparseable URLs', () => {
    for (const base of ['file:///etc/passwd', 'ftp://localhost', 'not a url', '']) {
      const result = allowLoopbackOrigin(base);

      expect(result.ok).toBe(false);
    }
  });
});

describe('isAllowedRequestUrl', () => {
  const declared = 'http://localhost:3020';

  it('admits the declared origin and the ratified external font origins', () => {
    for (const url of [
      'http://localhost:3020/identity-switchboard',
      'https://fonts.googleapis.com/css2?family=Lexend',
      'https://fonts.gstatic.com/s/lexend/x.woff2',
      'https://cdn.jsdelivr.net/npm/some-kit-asset.css',
    ]) {
      expect(isAllowedRequestUrl(url, declared)).toBe(true);
    }
  });

  it('refuses every other origin, port drift on the declared host, and unparseable URLs', () => {
    for (const url of [
      'http://localhost:3030/other-app',
      'http://169.254.169.254/latest/meta-data',
      'https://evil.example/x.css',
      'not a url',
    ]) {
      expect(isAllowedRequestUrl(url, declared)).toBe(false);
    }
  });
});

describe('isSuspect', () => {
  it('accepts a real page: HTTP 200 with body height and visible text above thresholds', () => {
    expect(isSuspect(200, 2000, 5000)).toBe(false);
  });

  it('flags a non-200 status, a short body, or near-empty text', () => {
    expect(isSuspect(404, 2000, 5000)).toBe(true);
    expect(isSuspect(200, 100, 5000)).toBe(true);
    expect(isSuspect(200, 2000, 50)).toBe(true);
  });
});
