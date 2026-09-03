/**
 * The bake's env→options supply leg: literal environment in, options out.
 *
 * @remarks
 * This is the leg between the runtime header assertion (x-app-version, per
 * response) and the render meta assertion (app-version, per bake) — under
 * build-time baking those come from different moments, and this mapping is
 * the only code deciding what the baked page believes about host and
 * version. Each row is a literal environment.
 */

import { describe, expect, it } from 'vitest';

import { resolveBakeOptions } from './bake-landing-page.js';

describe('resolveBakeOptions', () => {
  it('derives the production host and the version override when both are set', () => {
    const options = resolveBakeOptions({
      VERCEL_ENV: 'production',
      VERCEL_PROJECT_PRODUCTION_URL: 'mcp.example.org',
      VERCEL_URL: 'deploy-abc123.vercel.app',
      APP_VERSION_OVERRIDE: '9.9.9-probe',
    });

    expect(options.vercelHost).toBe('mcp.example.org');
    expect(options.appVersion).toBe('9.9.9-probe');
  });

  it('uses the deployment URL outside production', () => {
    const options = resolveBakeOptions({
      VERCEL_ENV: 'preview',
      VERCEL_PROJECT_PRODUCTION_URL: 'mcp.example.org',
      VERCEL_URL: 'deploy-abc123.vercel.app',
    });

    expect(options.vercelHost).toBe('deploy-abc123.vercel.app');
  });

  it('omits the host entirely off Vercel (the localhost/dev render)', () => {
    const options = resolveBakeOptions({});

    expect('vercelHost' in options).toBe(false);
  });

  it('supplies the canonical host alongside the deployment host when configured', () => {
    // Both reach the options; which one WINS is the shared served-origin
    // derivation's rule, proven on the rendered page rather than here.
    const options = resolveBakeOptions({
      VERCEL_ENV: 'production',
      VERCEL_PROJECT_PRODUCTION_URL: 'mcp.example.org',
      CANONICAL_HOST: 'mcp.thenational.academy',
    });

    expect(options.canonicalHost).toBe('mcp.thenational.academy');
    expect(options.vercelHost).toBe('mcp.example.org');
  });

  it('omits the canonical host when it is not configured', () => {
    expect('canonicalHost' in resolveBakeOptions({})).toBe(false);
  });

  it('falls back to the build identity version when no override is set', () => {
    const options = resolveBakeOptions({});

    // resolveApplicationVersion resolves the root package version when the
    // override is absent; the exact value is the build's, not this test's —
    // what matters is that the page is never baked versionless by default.
    expect(options.appVersion).toMatch(/^\d+\.\d+\.\d+/);
  });
});
