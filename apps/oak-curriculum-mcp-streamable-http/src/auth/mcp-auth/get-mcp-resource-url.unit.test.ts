import { describe, it, expect } from 'vitest';
import { getMcpResourceUrl } from './get-mcp-resource-url.js';

describe('getMcpResourceUrl', () => {
  it('returns canonical MCP resource URL for allowed host', () => {
    const req = {
      protocol: 'https',
      get: () => 'example.com',
      originalUrl: '/mcp',
    };

    expect(getMcpResourceUrl(req, ['example.com'])).toBe('https://example.com/mcp');
  });

  it('throws when host is missing', () => {
    const req = {
      protocol: 'https',
      get: () => undefined,
      originalUrl: '/mcp',
    };

    expect(() => getMcpResourceUrl(req, ['example.com'])).toThrow(
      'Cannot generate MCP resource URL: missing host header',
    );
  });

  it('throws when host is malformed', () => {
    const req = {
      protocol: 'https',
      get: () => '[::1]evil',
      originalUrl: '/mcp',
    };

    expect(() => getMcpResourceUrl(req, ['::1'])).toThrow(
      'Cannot generate MCP resource URL: invalid host header format: [::1]evil',
    );
  });

  it('throws when host is not allow-listed', () => {
    const req = {
      protocol: 'https',
      get: () => 'evil.com',
      originalUrl: '/mcp',
    };

    expect(() => getMcpResourceUrl(req, ['example.com'])).toThrow(
      'Cannot generate MCP resource URL: host not allowed: evil.com',
    );
  });
});
