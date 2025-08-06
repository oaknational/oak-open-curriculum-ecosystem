import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { spawn, type ChildProcess } from 'child_process';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { config } from 'dotenv';
import { join, resolve } from 'path';
import { existsSync } from 'fs';
import { createConsoleLogger } from '@oaknational/mcp-core';

// Create logger for E2E tests
const logger = createConsoleLogger({
  name: 'e2e-tests',
  level:
    process.env.LOG_LEVEL === 'debug' ||
    process.env.LOG_LEVEL === 'info' ||
    process.env.LOG_LEVEL === 'warn' ||
    process.env.LOG_LEVEL === 'error'
      ? process.env.LOG_LEVEL
      : 'info',
});

// Find and load the .env file from the repo root
// __dirname is e2e-tests, so we go up: e2e-tests -> oak-notion-mcp -> ecosystem -> repo root
const repoRoot = resolve(__dirname, '../../..');
const envPath = join(repoRoot, '.env');

if (existsSync(envPath)) {
  config({ path: envPath });
  logger.debug('Loaded .env file', { path: envPath });
} else {
  // Try fallback locations
  logger.debug('.env not found at repo root, trying fallbacks', { tried: envPath });
  config({ path: join(process.cwd(), '../../.env') });
  config(); // Also try local .env as fallback
}

// Type guard for object with property
function hasProperty<K extends PropertyKey>(obj: unknown, key: K): obj is Record<K, unknown> {
  return typeof obj === 'object' && obj !== null && key in obj;
}

// Type guard for text content
function isTextContent(c: unknown): c is { type: string; text?: string } {
  if (!hasProperty(c, 'type')) return false;
  return c.type === 'text';
}

// Skip E2E tests if no API key is provided
const NOTION_API_KEY = process.env.NOTION_API_KEY;
const RUN_E2E = process.env.RUN_E2E === 'true';

// Log test environment status
if (!NOTION_API_KEY || !RUN_E2E) {
  logger.info('E2E Test Environment', {
    RUN_E2E: process.env.RUN_E2E,
    NOTION_API_KEY: NOTION_API_KEY ? 'Found' : 'Not found',
  });

  if (!NOTION_API_KEY) {
    logger.warn('E2E tests will be skipped: NOTION_API_KEY not found');
  }
  if (!RUN_E2E) {
    logger.info('E2E tests will be skipped: Set RUN_E2E=true to run');
  }
} else {
  logger.info('Running E2E tests with Notion API');
}

describe.skipIf(!NOTION_API_KEY || !RUN_E2E)('E2E: MCP Server with Real Notion API', () => {
  let serverProcess: ChildProcess;
  let client: Client;

  beforeAll(async () => {
    // Spawn the server process
    serverProcess = spawn('node', ['dist/index.js'], {
      env: {
        ...process.env,
        NOTION_API_KEY: NOTION_API_KEY ?? '',
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
        NOTION_API_KEY: NOTION_API_KEY ?? '',
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
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (client) {
      await client.close();
    }
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
    expect(response.contents[0]?.mimeType).toBe('application/json');
    expect(response.contents[0]?.text).toContain('# Notion Workspace Discovery');

    // Should contain real data from Notion
    expect(response.contents[0]?.text).toContain('## Summary');
    expect(response.contents[0]?.text).toContain('## Resources');
  });

  it('should list users using the tool', async () => {
    const response = await client.callTool({
      name: 'notion-list-users',
      arguments: {},
    });

    expect(response.content).toBeDefined();
    expect(Array.isArray(response.content)).toBe(true);

    if (!Array.isArray(response.content)) {
      throw new Error('Expected content to be an array');
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
