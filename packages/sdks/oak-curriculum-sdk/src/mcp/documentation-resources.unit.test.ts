/**
 * Unit tests for documentation resources.
 *
 * These tests validate the documentation resource definitions that provide
 * "getting started" and tool usage documentation via MCP resources/list.
 */

import { describe, it, expect } from 'vitest';
import {
  DOCUMENTATION_RESOURCES,
  getGettingStartedMarkdown,
  getToolsReferenceMarkdown,
  getWorkflowsMarkdown,
} from './documentation-resources.js';

describe('DOCUMENTATION_RESOURCES', () => {
  it('has getting-started resource', () => {
    const resource = DOCUMENTATION_RESOURCES.find((r) => r.name === 'getting-started');
    expect(resource).toBeDefined();
    expect(resource?.uri).toBe('docs://oak/getting-started.md');
    expect(resource?.mimeType).toBe('text/markdown');
  });

  it('has tools-reference resource', () => {
    const resource = DOCUMENTATION_RESOURCES.find((r) => r.name === 'tools-reference');
    expect(resource).toBeDefined();
    expect(resource?.uri).toBe('docs://oak/tools.md');
    expect(resource?.mimeType).toBe('text/markdown');
  });

  it('has workflows resource', () => {
    const resource = DOCUMENTATION_RESOURCES.find((r) => r.name === 'workflows');
    expect(resource).toBeDefined();
    expect(resource?.uri).toBe('docs://oak/workflows.md');
    expect(resource?.mimeType).toBe('text/markdown');
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
});

describe('getToolsReferenceMarkdown', () => {
  it('returns markdown string', () => {
    const markdown = getToolsReferenceMarkdown();
    expect(typeof markdown).toBe('string');
    expect(markdown.length).toBeGreaterThan(0);
  });

  it('includes tool categories', () => {
    const markdown = getToolsReferenceMarkdown();
    expect(markdown).toContain('Discovery');
    expect(markdown).toContain('Browsing');
    expect(markdown).toContain('Fetching');
    expect(markdown).toContain('Progression');
  });

  it('mentions search tool', () => {
    const markdown = getToolsReferenceMarkdown();
    expect(markdown).toContain('search');
  });

  it('mentions fetch tool', () => {
    const markdown = getToolsReferenceMarkdown();
    expect(markdown).toContain('fetch');
  });

  it('includes agentSupport category', () => {
    const markdown = getToolsReferenceMarkdown();
    expect(markdown).toContain('Agent Support');
    expect(markdown).toContain('get-help');
    expect(markdown).toContain('get-ontology');
  });
});

describe('getWorkflowsMarkdown', () => {
  it('returns markdown string', () => {
    const markdown = getWorkflowsMarkdown();
    expect(typeof markdown).toBe('string');
    expect(markdown.length).toBeGreaterThan(0);
  });

  it('includes find lessons workflow', () => {
    const markdown = getWorkflowsMarkdown();
    expect(markdown).toContain('Find lessons');
  });

  it('includes lesson planning workflow', () => {
    const markdown = getWorkflowsMarkdown();
    expect(markdown).toContain('Plan a lesson');
  });

  it('includes numbered steps', () => {
    const markdown = getWorkflowsMarkdown();
    expect(markdown).toMatch(/1\./);
    expect(markdown).toMatch(/2\./);
  });

  it('includes userInteractions workflow FIRST', () => {
    const markdown = getWorkflowsMarkdown();
    expect(markdown).toContain('When finding or presenting Oak content');
    const userInteractionsIndex = markdown.indexOf('When finding or presenting');
    const findLessonsIndex = markdown.indexOf('Find lessons');
    expect(userInteractionsIndex).toBeLessThan(findLessonsIndex);
  });

  it('includes get-help and get-ontology in userInteractions workflow', () => {
    const markdown = getWorkflowsMarkdown();
    expect(markdown).toContain('get-help');
    expect(markdown).toContain('get-ontology');
  });

  it('includes returns field for workflow steps', () => {
    const markdown = getWorkflowsMarkdown();
    expect(markdown).toContain('Returns:');
    expect(markdown).toContain('Ranked list of matching lessons');
  });
});
