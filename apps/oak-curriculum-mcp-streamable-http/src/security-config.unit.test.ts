import { describe, it, expect } from 'vitest';
import { resolveAllowedHosts } from './security-config.js';

/**
 * Unit tests for the DNS rebinding protection allow-list resolution.
 *
 * CORS is unconditionally permissive (all origins allowed) so there is no
 * CORS configuration to test. Security is enforced by OAuth authentication.
 *
 * The composed proof — that the resolved list actually admits both a
 * configured host and a platform-derived one at the guard — lives in
 * `security-config.integration.test.ts`.
 */

const BASE_HOSTS = ['localhost', '127.0.0.1', '::1'];

/**
 * The three Vercel system hostnames, in the order `runtime-config` derives
 * them. `VERCEL_URL` is the *generated deployment* URL and is a distinct value
 * on every deployment — which is why the allow-list has to keep taking these
 * from the platform rather than from a hand-written list.
 */
const VERCEL_HOSTS = [
  'example-deployment-9f2c1ab.vercel.example', // VERCEL_URL — regenerated per deployment
  'example-git-main.vercel.example', // VERCEL_BRANCH_URL
  'curriculum-mcp-alpha.oaknational.dev', // VERCEL_PROJECT_PRODUCTION_URL
];

describe('resolveAllowedHosts', () => {
  it('allows the configured hosts, the platform hosts and the loopback addresses together', () => {
    // 'localhost' is configured AND already a base host, so this input also
    // pins that an overlapping entry appears once.
    const configured = ['custom.example.com', 'localhost'];

    const result = resolveAllowedHosts(configured, VERCEL_HOSTS);

    expect(result).toEqual([
      'custom.example.com',
      'localhost',
      ...VERCEL_HOSTS,
      '127.0.0.1',
      '::1',
    ]);
  });

  /**
   * MCP-634. Configuring `ALLOWED_HOSTS` used to REPLACE the derived list, so
   * naming the new custom domain would have evicted the hostname production is
   * actually served on. This assertion is the one that discriminates: a check
   * that only confirmed the new host was allowed would pass while production
   * was down.
   */
  it('does not evict the Vercel-derived hosts when a custom domain is configured', () => {
    const result = resolveAllowedHosts(['mcp.thenational.academy'], VERCEL_HOSTS);

    expect(result).toContain('mcp.thenational.academy');
    expect(result).toEqual(expect.arrayContaining(VERCEL_HOSTS));
    expect(result).toEqual(expect.arrayContaining(BASE_HOSTS));
  });

  /**
   * The same eviction one environment over. A resolver that only became
   * additive once Vercel hostnames were present would still drop the loopback
   * addresses off-Vercel, which is the identical defect wearing a local
   * costume.
   */
  it('keeps the loopback addresses when a host is configured off-Vercel', () => {
    const result = resolveAllowedHosts(['mcp.thenational.academy'], []);

    expect(result).toEqual(['mcp.thenational.academy', ...BASE_HOSTS]);
  });

  /**
   * The shape `config/harness-*.env`, the e2e helpers and the dev contract all
   * use. Asserted rather than argued: this configuration must come through the
   * change byte-identical.
   */
  it('is unchanged for a configuration naming exactly the loopback addresses', () => {
    const result = resolveAllowedHosts(['localhost', '127.0.0.1', '::1'], []);

    expect(result).toEqual(BASE_HOSTS);
  });

  it('returns all Vercel hosts + BASE_HOSTS when no config and Vercel hosts present', () => {
    const result = resolveAllowedHosts(undefined, VERCEL_HOSTS);

    expect(result).toEqual([...VERCEL_HOSTS, ...BASE_HOSTS]);
  });

  it('returns all Vercel hosts + BASE_HOSTS with single Vercel host', () => {
    const result = resolveAllowedHosts(undefined, ['myapp.vercel.example']);

    expect(result).toEqual(['myapp.vercel.example', ...BASE_HOSTS]);
  });

  it('returns only BASE_HOSTS when no config and no Vercel hosts', () => {
    const result = resolveAllowedHosts(undefined, []);

    expect(result).toEqual(BASE_HOSTS);
  });

  it('returns only BASE_HOSTS when config is empty array', () => {
    const result = resolveAllowedHosts([], []);

    expect(result).toEqual(BASE_HOSTS);
  });

  /**
   * `parseCsv` yields `undefined` for an unset `ALLOWED_HOSTS` and `[]` for a
   * value that is only separators, so both inputs occur in production. The
   * difference must not be a signal.
   */
  it('treats an empty configured array as equivalent to no configuration', () => {
    const result = resolveAllowedHosts([], VERCEL_HOSTS);

    expect(result).toEqual([...VERCEL_HOSTS, ...BASE_HOSTS]);
  });

  it('deduplicates hosts when a Vercel host is already in BASE_HOSTS', () => {
    const result = resolveAllowedHosts(undefined, ['localhost', 'myapp.vercel.example']);

    expect(result).toEqual(['localhost', 'myapp.vercel.example', '127.0.0.1', '::1']);
  });
});
