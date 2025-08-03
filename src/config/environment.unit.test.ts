import { describe, it, expect, vi } from 'vitest';
import { createMcpServerInfo, getNotionConfig } from './environment.js';

// Mock the env module to avoid validation during tests
vi.mock('./env.js', () => ({
  env: {
    NOTION_API_KEY: 'test_key_123',
  },
}));

describe('getNotionConfig', () => {
  it('should return config with API key from env', () => {
    const config = getNotionConfig();

    expect(config.apiKey).toBe('test_key_123');
    expect(config.version).toBe('2022-06-28');
  });
});

describe('createMcpServerInfo', () => {
  it('should create server info with name and version', () => {
    const config = {
      name: 'test-server',
      version: '1.2.3',
    };

    const serverInfo = createMcpServerInfo(config);

    expect(serverInfo.name).toBe('test-server');
    expect(serverInfo.version).toBe('1.2.3');
  });

  it('should handle semantic version formats', () => {
    const config = {
      name: 'oak-notion-mcp',
      version: '0.0.0-development',
    };

    const serverInfo = createMcpServerInfo(config);

    expect(serverInfo.name).toBe('oak-notion-mcp');
    expect(serverInfo.version).toBe('0.0.0-development');
  });

  it('should handle simple version numbers', () => {
    const config = {
      name: 'my-server',
      version: '1.0.0',
    };

    const serverInfo = createMcpServerInfo(config);

    expect(serverInfo.version).toBe('1.0.0');
  });

  it('should preserve exact name formatting', () => {
    const config = {
      name: 'Test-Server_123',
      version: '1.0.0',
    };

    const serverInfo = createMcpServerInfo(config);

    expect(serverInfo.name).toBe('Test-Server_123');
  });
});
