import { describe, it, expect } from 'vitest';
import { createMcpServerInfo } from './environment.js';

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
