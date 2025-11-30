/**
 * @fileoverview Unit tests for MCP configuration snippet generation.
 *
 * Tests verify that the JSON configuration snippet is correctly
 * generated for different deployment environments.
 */

import { describe, expect, it } from 'vitest';

import { createSnippet } from './create-snippet.js';

describe('createSnippet', () => {
  it('generates snippet with Vercel host URL', () => {
    const snippet = createSnippet('my-app.vercel.app');

    expect(snippet).toContain('"mcpServers"');
    expect(snippet).toContain('"oak-curriculum"');
    expect(snippet).toContain('"type": "http"');
    expect(snippet).toContain('"url": "https://my-app.vercel.app/mcp"');
  });

  it('generates snippet with localhost URL when no host', () => {
    const snippet = createSnippet();

    expect(snippet).toContain('"url": "http://localhost:3333/mcp"');
  });

  it('generates valid JSON structure', () => {
    const snippet = createSnippet('example.com');
    const jsonWrapped = `{${snippet}}`;
    const doParse = () => {
      const result: unknown = JSON.parse(jsonWrapped);
      return result;
    };
    expect(doParse).not.toThrow();
  });
});
