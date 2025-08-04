import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMcpServer } from './server.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import type { Logger } from './chora/aither/logging/logger-interface.js';
import { createMockListUsersResponse } from './test-helpers/notion-api-mocks.js';
import { createMockLogger, createMockNotionOperations } from './test-helpers/factories.js';

describe('MCP Server', () => {
  const mockLogger: Logger = createMockLogger();

  // Create a partial mock of NotionClient with only the methods we use
  const mockNotionClient = {
    users: {
      list: vi.fn(),
    },
    pages: {
      retrieve: vi.fn(),
    },
    databases: {
      retrieve: vi.fn(),
      query: vi.fn(),
    },
    blocks: {
      children: {
        list: vi.fn(),
      },
    },
    search: vi.fn(),
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
      notionOperations: createMockNotionOperations(),
      config,
    });

    // Setup mock to return users
    vi.mocked(mockNotionClient.users.list).mockResolvedValue(
      createMockListUsersResponse([
        {
          id: 'user-1',
          object: 'user',
          type: 'person',
          name: 'Test User',
          avatar_url: null,
          person: { email: 'test@example.com' },
        },
      ]),
    );

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
      notionOperations: createMockNotionOperations(),
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

  /**
   * Setup server and client for testing
   */
  async function setupServerAndClient() {
    const config = { name: 'test-server', version: '1.0.0' };
    const server = createMcpServer({
      notionClient: mockNotionClient,
      logger: mockLogger,
      notionOperations: createMockNotionOperations(),
      config,
    });

    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    await server.connect(serverTransport);

    const client = new Client({ name: 'test-client', version: '1.0.0' }, { capabilities: {} });
    await client.connect(clientTransport);

    return { server, client };
  }

  /**
   * Setup mock for list users response
   */
  function setupListUsersMock() {
    vi.mocked(mockNotionClient.users.list).mockResolvedValue(
      createMockListUsersResponse([
        {
          id: 'user-1',
          object: 'user',
          type: 'person',
          name: 'Test User',
          avatar_url: null,
          person: { email: 'test@example.com' },
        },
      ]),
    );
  }

  it('should handle tool call requests', async () => {
    setupListUsersMock();
    const { client } = await setupServerAndClient();

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

    const firstItem: unknown = response.content[0];
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
      notionOperations: createMockNotionOperations(),
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
