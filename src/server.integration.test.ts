import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMcpServer } from './server.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import type { NotionClientWrapper } from './notion/client.js';
import type { Logger } from './logging/logger.js';

describe('MCP Server', () => {
  const mockLogger: Logger = {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  };

  const mockNotionClient: NotionClientWrapper = {
    listUsers: vi.fn(),
    getPage: vi.fn(),
    getDatabase: vi.fn(),
    queryDatabase: vi.fn(),
    search: vi.fn(),
    getBlockChildren: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle resource list requests', async () => {
    const config = {
      name: 'test-server',
      version: '1.0.0',
    };

    const server = createMcpServer({
      notionClient: mockNotionClient,
      logger: mockLogger,
      config,
    });

    // Setup mock to return users
    vi.mocked(mockNotionClient.listUsers).mockResolvedValue([
      {
        id: 'user-1',
        object: 'user',
        type: 'person',
        name: 'Test User',
        avatar_url: null,
        person: { email: 'test@example.com' },
      },
    ]);

    // Create transport and connect
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

    await server.connect(serverTransport);

    const client = new Client(
      {
        name: 'test-client',
        version: '1.0.0',
      },
      {
        capabilities: {},
      },
    );

    await client.connect(clientTransport);

    // Test behavior: when we list resources, we should get back resources
    const response = await client.listResources();

    expect(response.resources).toBeDefined();
    expect(Array.isArray(response.resources)).toBe(true);
    expect(response.resources.length).toBeGreaterThan(0);

    // Should include discovery resource
    const discoveryResource = response.resources.find((r) => r.uri === 'notion://discovery');
    expect(discoveryResource).toBeDefined();
    expect(discoveryResource?.name).toBe('Notion Resource Discovery');
  });

  it('should handle tool list requests', async () => {
    const config = {
      name: 'test-server',
      version: '1.0.0',
    };

    const server = createMcpServer({
      notionClient: mockNotionClient,
      logger: mockLogger,
      config,
    });

    // Create transport and connect
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

    await server.connect(serverTransport);

    const client = new Client(
      {
        name: 'test-client',
        version: '1.0.0',
      },
      {
        capabilities: {},
      },
    );

    await client.connect(clientTransport);

    // Test behavior: when we list tools, we should get back our tools
    const response = await client.listTools();

    expect(response.tools).toBeDefined();
    expect(Array.isArray(response.tools)).toBe(true);
    expect(response.tools.length).toBe(5);

    // Check that all expected tools are present
    const toolNames = response.tools.map((t) => t.name);
    expect(toolNames).toContain('notion-search');
    expect(toolNames).toContain('notion-list-databases');
    expect(toolNames).toContain('notion-query-database');
    expect(toolNames).toContain('notion-get-page');
    expect(toolNames).toContain('notion-list-users');
  });

  it('should handle tool call requests', async () => {
    const config = {
      name: 'test-server',
      version: '1.0.0',
    };

    const server = createMcpServer({
      notionClient: mockNotionClient,
      logger: mockLogger,
      config,
    });

    // Setup mock to return users
    vi.mocked(mockNotionClient.listUsers).mockResolvedValue([
      {
        id: 'user-1',
        object: 'user',
        type: 'person',
        name: 'Test User',
        avatar_url: null,
        person: { email: 'test@example.com' },
      },
    ]);

    // Create transport and connect
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

    await server.connect(serverTransport);

    const client = new Client(
      {
        name: 'test-client',
        version: '1.0.0',
      },
      {
        capabilities: {},
      },
    );

    await client.connect(clientTransport);

    // Test behavior: when we call a tool, it should return results
    const response = await client.callTool({
      name: 'notion-list-users',
      arguments: {},
    });

    expect(response.content).toBeDefined();
    expect(Array.isArray(response.content)).toBe(true);

    // Type guard for content array
    if (!Array.isArray(response.content)) {
      throw new Error('Expected content to be an array');
    }

    const content = response.content;
    expect(content.length).toBeGreaterThan(0);

    const firstItem: unknown = content[0];
    if (!firstItem || typeof firstItem !== 'object' || !('type' in firstItem)) {
      throw new Error('Expected first content item to have type property');
    }

    expect(firstItem.type).toBe('text');
    if ('text' in firstItem) {
      expect(firstItem.text).toContain('Found 1 user');
      expect(firstItem.text).toContain('Test User');
      expect(firstItem.text).toContain('tes...@example.com'); // Email should be scrubbed
    }
  });

  it('should handle errors gracefully', async () => {
    const config = {
      name: 'test-server',
      version: '1.0.0',
    };

    const server = createMcpServer({
      notionClient: mockNotionClient,
      logger: mockLogger,
      config,
    });

    // Create transport and connect
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

    await server.connect(serverTransport);

    const client = new Client(
      {
        name: 'test-client',
        version: '1.0.0',
      },
      {
        capabilities: {},
      },
    );

    await client.connect(clientTransport);

    // Test behavior: when we call a non-existent tool, it should throw an error
    await expect(
      client.callTool({
        name: 'non-existent-tool',
        arguments: {},
      }),
    ).rejects.toThrow('Tool not found');
  });
});
