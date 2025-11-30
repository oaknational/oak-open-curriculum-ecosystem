import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { spawn, type ChildProcess } from 'child_process';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { dirname } from 'path';
import {
  UnifiedLogger,
  buildResourceAttributes,
  logLevelToSeverityNumber,
} from '@oaknational/mcp-logger';
import { createNodeStdoutSink } from '@oaknational/mcp-logger/node';
import { fileURLToPath } from 'url';

const thisDir = dirname(fileURLToPath(import.meta.url));

// Create logger for E2E tests
const logger = new UnifiedLogger({
  minSeverity: logLevelToSeverityNumber('INFO'),
  resourceAttributes: buildResourceAttributes({}, 'e2e-tests', '1.0.0'),
  context: {},
  stdoutSink: createNodeStdoutSink(),
  fileSink: null,
});

// Load env from repo root using shared helper
import { loadRootEnv } from '@oaknational/mcp-env';
const loaded = loadRootEnv({
  startDir: thisDir,
  requiredKeys: ['NOTION_API_KEY'],
  env: process.env,
});
if (loaded.loaded) {
  logger.debug('Loaded .env file', { path: loaded.path });
} else {
  logger.debug('No .env file loaded from root', { repoRoot: loaded.repoRoot });
}

// Type guard for object with property
function hasProperty<K extends PropertyKey>(obj: unknown, key: K): obj is Record<K, unknown> {
  return typeof obj === 'object' && obj !== null && key in obj;
}

// Type guard for text content
function isTextContent(c: unknown): c is { type: string; text?: string } {
  if (!hasProperty(c, 'type')) {
    return false;
  }
  return c.type === 'text';
}

// Validate NOTION_API_KEY is present - FAIL if missing (don't skip)
const NOTION_API_KEY = process.env.NOTION_API_KEY;
if (!NOTION_API_KEY || NOTION_API_KEY.trim().length === 0) {
  throw new Error(
    'NOTION_API_KEY is required for E2E tests. Set it in .env file in repository root. ' +
      'Tests must FAIL when configuration is wrong, not skip.',
  );
}

logger.info('Running E2E tests with Notion API', { keyPresent: !!NOTION_API_KEY });

describe('E2E: MCP Server with Real Notion API', () => {
  let serverProcess: ChildProcess;
  let client: Client;

  beforeAll(async () => {
    // Spawn the server process
    serverProcess = spawn('node', ['dist/index.js'], {
      env: {
        ...process.env,
        NOTION_API_KEY, // Already validated to be non-empty
        LOG_LEVEL: 'error', // Reduce noise in tests
      },
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    // Create MCP client
    const transport = new StdioClientTransport({
      command: 'node',
      args: ['dist/index.js'],
      env: {
        ...process.env,
        NOTION_API_KEY, // Already validated to be non-empty
        LOG_LEVEL: 'error',
      },
    });

    client = new Client(
      {
        name: 'test-client',
        version: '1.0.0',
      },
      {
        capabilities: {},
      },
    );

    await client.connect(transport);

    // Give the server time to initialize
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }, 30000); // 30 second timeout for setup

  afterAll(async () => {
    // Clean up
    // Runtime checks needed: if beforeAll fails, these may be undefined

    await client.close();

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (serverProcess) {
      serverProcess.kill();
      // Wait for process to exit
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  });

  it('should connect to the server', () => {
    // Server connection is verified by successful client initialization
    // The client is connected if we reach this point
    expect(client).toBeDefined();
  });

  it('should list available resources', async () => {
    const response = await client.listResources();
    expect(response.resources).toBeDefined();
    expect(response.resources.length).toBeGreaterThan(0);

    // Should have discovery resource
    const discoveryResource = response.resources.find((r) => r.uri === 'notion://discovery');
    expect(discoveryResource).toBeDefined();
    expect(discoveryResource?.name).toBe('Notion Resource Discovery');
  });

  it('should list available tools', async () => {
    const response = await client.listTools();
    expect(response.tools).toBeDefined();
    expect(response.tools.length).toBe(5);

    const toolNames = response.tools.map((t) => t.name);
    expect(toolNames).toContain('notion-search');
    expect(toolNames).toContain('notion-list-databases');
    expect(toolNames).toContain('notion-query-database');
    expect(toolNames).toContain('notion-get-page');
    expect(toolNames).toContain('notion-list-users');
  });

  it('should read discovery resource', async () => {
    const response = await client.readResource({
      uri: 'notion://discovery',
    });

    expect(response.contents).toBeDefined();
    expect(response.contents.length).toBe(1);
    const content = response.contents[0];
    expect(content.mimeType).toBe('application/json');
    // Narrow to text response type
    if (!('text' in content)) {
      throw new TypeError('Test: Expected text content, got blob');
    }

    expect(content.text).toContain('# Notion Workspace Discovery');

    // Should contain real data from Notion
    expect(content.text).toContain('## Summary');
    expect(content.text).toContain('## Resources');
  });

  it('should list users using the tool', async () => {
    const response = await client.callTool({
      name: 'notion-list-users',
      arguments: {},
    });

    expect(response.content).toBeDefined();
    expect(Array.isArray(response.content)).toBe(true);

    if (!Array.isArray(response.content)) {
      throw new TypeError('Test: Expected content to be an array');
    }

    expect(response.content.length).toBeGreaterThan(0);

    const textContent = response.content.find(isTextContent);
    expect(textContent).toBeDefined();
    if (textContent?.text) {
      expect(textContent.text).toContain('Found');
      expect(textContent.text).toContain('user');
      // Check for email scrubbing - format: first letter + asterisks + last letter @ domain
      expect(textContent.text).toMatch(/[a-z]\*+[a-z]@[a-z]+\.[a-z]+/);
    }
  });

  it('should search for content', async () => {
    const response = await client.callTool({
      name: 'notion-search',
      arguments: {
        query: 'test',
      },
    });

    expect(response.content).toBeDefined();
    expect(Array.isArray(response.content)).toBe(true);

    if (!Array.isArray(response.content)) {
      throw new Error('Expected content to be an array');
    }

    const textContent = response.content.find(isTextContent);
    expect(textContent).toBeDefined();
    if (textContent?.text) {
      expect(textContent.text).toContain('Found');
      expect(textContent.text).toContain('results for "test"');
    }
  });

  it('should handle errors gracefully', async () => {
    // Try to get a non-existent page
    const response = await client.callTool({
      name: 'notion-get-page',
      arguments: {
        page_id: 'non-existent-page-id-12345',
      },
    });

    expect(response.content).toBeDefined();

    if (!Array.isArray(response.content)) {
      throw new Error('Expected content to be an array');
    }

    const textContent = response.content.find(isTextContent);
    expect(textContent).toBeDefined();
    if (textContent?.text) {
      expect(textContent.text).toContain('Error');
    }
    expect(response.isError).toBe(true);
  });
});
