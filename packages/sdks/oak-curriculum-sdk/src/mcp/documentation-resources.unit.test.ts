/**
 * Unit tests for documentation resources.
 *
 * These tests validate the documentation resource definitions that provide the
 * "getting started" experience via MCP resources/list. Tool categories,
 * workflows, and tips are owned by the canonical `curriculum://model` resource
 * (and the `get-curriculum-model` tool), not duplicated as separate doc
 * resources — see S1 doc-resources single-sourcing.
 */

import { describe, it, expect } from 'vitest';
import { DOCUMENTATION_RESOURCES, getGettingStartedMarkdown } from './documentation-resources.js';

describe('DOCUMENTATION_RESOURCES', () => {
  it('has getting-started resource', () => {
    const resource = DOCUMENTATION_RESOURCES.find((r) => r.name === 'getting-started');
    expect(resource).toBeDefined();
    expect(resource?.uri).toBe('docs://oak/getting-started.md');
    expect(resource?.mimeType).toBe('text/markdown');
  });

  it('does not duplicate the tools-reference or workflows resources (single-sourced via curriculum://model)', () => {
    const uris = DOCUMENTATION_RESOURCES.map((r) => r.uri);
    expect(uris).not.toContain('docs://oak/tools.md');
    expect(uris).not.toContain('docs://oak/workflows.md');
  });

  it('all resources have required fields', () => {
    for (const resource of DOCUMENTATION_RESOURCES) {
      expect(resource.name).toBeDefined();
      expect(resource.uri).toBeDefined();
      expect(resource.title).toBeDefined();
      expect(resource.description).toBeDefined();
      expect(resource.mimeType).toBe('text/markdown');
    }
  });
});

describe('getGettingStartedMarkdown', () => {
  it('returns markdown string', () => {
    const markdown = getGettingStartedMarkdown();
    expect(typeof markdown).toBe('string');
    expect(markdown.length).toBeGreaterThan(0);
  });

  it('includes server name', () => {
    const markdown = getGettingStartedMarkdown();
    expect(markdown).toContain('Oak Curriculum');
  });

  it('includes authentication section', () => {
    const markdown = getGettingStartedMarkdown();
    expect(markdown).toContain('Authentication');
  });

  it('includes quick start section', () => {
    const markdown = getGettingStartedMarkdown();
    expect(markdown).toContain('Quick Start');
  });

  it('points to curriculum://model for orientation rather than copying tips', () => {
    const markdown = getGettingStartedMarkdown();
    expect(markdown).toContain('curriculum://model');
    expect(markdown).toContain('get-curriculum-model');
  });
});
