import { describe, it, expect } from 'vitest';

import { findRedirectUriRejection } from './oauth-proxy-redirect-uri-validation.js';

/**
 * The scheme RFC 9700 §2.6 forbids off the loopback, built into the one
 * fixture below whose host the analyser does not read as reserved: an
 * `http://` literal reads as a clear-text endpoint, where here it is the
 * shape under rejection (sonar-disposition-policy §S5332).
 */
const CLEAR_TEXT_SCHEME = 'http';

/**
 * The registration boundary's `redirect_uris` contract (MCP-188).
 *
 * RFC 9700 §2.6 ({@link https://www.rfc-editor.org/rfc/rfc9700.html#section-2.6}):
 * authorization servers MUST NOT allow redirection URIs using the `http`
 * scheme except for native clients using loopback interface redirection as
 * described in RFC 8252 §7.3
 * ({@link https://www.rfc-editor.org/rfc/rfc8252.html#section-7.3}) — §7.3
 * being the section that DEFINES loopback redirection, not the source of the
 * prohibition. RFC 7591 §3.2.2
 * ({@link https://www.rfc-editor.org/rfc/rfc7591.html#section-3.2.2}) names the
 * error codes returned to the client.
 */
describe('findRedirectUriRejection', () => {
  describe('conformant values are accepted', () => {
    it.each([
      // RFC 8252 §7.3 loopback IP literals — any port must be permitted, and
      // IPv4 loopback is the whole 127.0.0.0/8 range, not just 127.0.0.1.
      'http://127.0.0.1:61154/callback',
      'http://127.0.0.2/callback',
      'http://[::1]:3000/callback',
      // RFC 8252 §8.3 — permitted though NOT RECOMMENDED; Inspector-class
      // clients register it.
      'http://localhost:8080/callback',
      'https://client.example/callback',
      // RFC 8252 §7.1 private-use scheme. Cursor registers exactly this
      // shape, so the §8.4 reverse-domain SHOULD is deliberately not
      // enforced here.
      'cursor://callback',
    ])('accepts %s', (redirectUri) => {
      expect(findRedirectUriRejection({ redirect_uris: [redirectUri] })).toBeUndefined();
    });

    it('accepts a registration with no redirect_uris field', () => {
      expect(findRedirectUriRejection({ client_name: 'Cursor' })).toBeUndefined();
    });

    it('accepts an empty redirect_uris array', () => {
      expect(findRedirectUriRejection({ redirect_uris: [] })).toBeUndefined();
    });

    it('accepts a body that is not an object', () => {
      expect(findRedirectUriRejection(undefined)).toBeUndefined();
    });
  });

  describe('non-loopback http is rejected', () => {
    it.each([
      'http://evil.example/callback',
      // The WHATWG parser case-folds scheme and host before we compare.
      'HTTP://EVIL.EXAMPLE/callback',
      // Hosts that a prefix or substring test would misread as loopback.
      // These are the concrete holes an exact-equality check closes — an
      // unanchored test on `127.` accepts the first two, and one on
      // `localhost` accepts the third.
      'http://127.evil.example/callback',
      'http://127.0.0.1.evil.example/callback',
      'http://localhost.evil.example/callback',
      // Userinfo masking a non-loopback host: `hostname` is evil.example, so
      // reading `hostname` (never `host` or the raw string) rejects it.
      'http://localhost@evil.example/callback',
      // 0.0.0.0 binds every interface and is not loopback.
      `${CLEAR_TEXT_SCHEME}://0/callback`,
    ])('rejects %s', (redirectUri) => {
      expect(findRedirectUriRejection({ redirect_uris: [redirectUri] })).toMatchObject({
        error: 'invalid_redirect_uri',
      });
    });

    it('rejects when only one entry of several is non-conformant', () => {
      const rejection = findRedirectUriRejection({
        redirect_uris: ['https://good.example/cb', 'http://evil.example/cb'],
      });

      expect(rejection).toMatchObject({ error: 'invalid_redirect_uri' });
    });

    it('never echoes the submitted URI back to the client', () => {
      const rejection = findRedirectUriRejection({
        redirect_uris: ['http://evil.example/callback?secret=leaked'],
      });

      expect(rejection?.description).not.toContain('evil.example');
      expect(rejection?.description).not.toContain('leaked');
    });
  });

  describe('refusal stays scoped to the one obliged case', () => {
    // ADR-115's advertised-AS exception permits refusing only what a cited
    // clause obliges and the upstream demonstrably does not, and forbids
    // scheme preferences. Non-http schemes carry neither, so they pass
    // through to the upstream authorisation server unrefused — even ones we
    // would prefer to reject on general principle.
    it.each(['javascript:alert(1)', 'data:text/html,<script></script>', 'file:///etc/passwd'])(
      'forwards %s rather than refusing beyond the cited obligation',
      (redirectUri) => {
        expect(findRedirectUriRejection({ redirect_uris: [redirectUri] })).toBeUndefined();
      },
    );

    it('forwards an https redirect_uri carrying userinfo', () => {
      expect(
        findRedirectUriRejection({ redirect_uris: ['https://user@client.example/cb'] }),
      ).toBeUndefined();
    });
  });

  describe('malformed entries forward — they cannot carry the refused value', () => {
    // A non-loopback plain-http redirect URI is necessarily a PARSEABLE
    // STRING, so neither a non-string entry nor an unparseable one can be
    // what the cited clause obliges us to refuse. Refusing them anyway would
    // be a refusal of our own devising, which ADR-115 forbids.
    it('forwards an array entry that is not a string', () => {
      expect(findRedirectUriRejection({ redirect_uris: [42] })).toBeUndefined();
    });

    it.each(['not a url', '', '//localhost/cb', 'http://127.0.0.1:65536/cb'])(
      'forwards the unparseable value %s',
      (redirectUri) => {
        expect(findRedirectUriRejection({ redirect_uris: [redirectUri] })).toBeUndefined();
      },
    );

    it('still refuses a conformant-shaped entry sitting beside a malformed one', () => {
      // The entries are examined individually, so forwarding the malformed
      // ones cannot weaken the obligation. This is the test that makes the
      // removal safe rather than merely smaller.
      expect(
        findRedirectUriRejection({ redirect_uris: [42, 'not a url', 'http://evil.example/cb'] }),
      ).toMatchObject({ error: 'invalid_redirect_uri' });
    });
  });

  describe('a non-array redirect_uris forwards — the upstream demonstrably rejects it', () => {
    it('forwards a bare-string redirect_uris', () => {
      // Probed first-hand against the deployed alpha 2026-07-26: POST
      // /oauth/register with a bare-string redirect_uris returns 400
      // request_body_invalid from Clerk. The upstream discharges this case, so
      // ADR-115's demonstrated-gap test fails and the refusal is not ours to
      // make. The contrast licenses the one that ships: the same endpoint
      // returns 201 for an array carrying a plain-http non-loopback URI.
      expect(findRedirectUriRejection({ redirect_uris: 'http://evil.example/cb' })).toBeUndefined();
    });
  });

  describe('obfuscated loopback forms are canonicalised by the parser', () => {
    // The WHATWG parser normalises these to 127.0.0.1 before comparison,
    // so they are accepted rather than treated as novel hosts.
    it.each([
      'http://127.0.0.1/cb',
      'http://127.1/cb',
      'http://2130706433/cb',
      'http://0x7f000001/cb',
    ])('accepts the canonicalising form %s', (redirectUri) => {
      expect(findRedirectUriRejection({ redirect_uris: [redirectUri] })).toBeUndefined();
    });
  });
});
