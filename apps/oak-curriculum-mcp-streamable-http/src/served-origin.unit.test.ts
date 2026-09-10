/**
 * Unit tests for served-origin resolution.
 *
 * Each state is a deployment the app self-describes from: canonical origin
 * configured, a Vercel deployment (production or preview — both arrive here
 * as a display hostname; the env→hostname mapping is
 * `@oaknational/build-metadata`'s proven behaviour, not re-proven here),
 * and local development.
 */

import { describe, it, expect } from 'vitest';
import { MCP_RESOURCE_PATH, resolveServedMcpUrl, resolveServedOrigin } from './served-origin.js';

describe('resolveServedOrigin', () => {
  it('a configured canonical origin wins over every other input', () => {
    expect(
      resolveServedOrigin({
        canonicalOrigin: 'https://mcp.thenational.academy',
        displayHostname: 'my-app.vercel.app',
        portEnv: '4000',
      }),
    ).toBe('https://mcp.thenational.academy');
  });

  it('a Vercel deployment serves at its display hostname over https', () => {
    expect(resolveServedOrigin({ displayHostname: 'my-app.vercel.app' })).toBe(
      'https://my-app.vercel.app',
    );
  });

  it('local development serves at localhost on the default port', () => {
    expect(resolveServedOrigin({})).toBe('http://localhost:3333');
  });

  it('local development honours a configured PORT', () => {
    expect(resolveServedOrigin({ portEnv: '4000' })).toBe('http://localhost:4000');
  });

  it('an empty display hostname is local development, not a scheme-only origin', () => {
    expect(resolveServedOrigin({ displayHostname: '' })).toBe('http://localhost:3333');
  });

  it('an empty PORT is the default port, not a port-less origin', () => {
    expect(resolveServedOrigin({ portEnv: '' })).toBe('http://localhost:3333');
  });
});

describe('resolveServedMcpUrl', () => {
  it('appends exactly the MCP resource path to the served origin', () => {
    expect(resolveServedMcpUrl({ displayHostname: 'my-app.vercel.app' })).toBe(
      `https://my-app.vercel.app${MCP_RESOURCE_PATH}`,
    );
  });

  it('two deployments with different display hostnames self-describe differently', () => {
    expect(resolveServedMcpUrl({ displayHostname: 'alpha.example.org' })).toBe(
      'https://alpha.example.org/mcp',
    );
    expect(resolveServedMcpUrl({ displayHostname: 'www.example.org' })).toBe(
      'https://www.example.org/mcp',
    );
  });
});
