import { describe, it, expect } from 'vitest';
import {
  validateEnvironmentVariables,
  parseNotionConfig,
  createMcpServerInfo,
} from './environment.js';

describe('validateEnvironmentVariables', () => {
  it('should return valid when all required variables present', () => {
    const result = validateEnvironmentVariables({
      NOTION_API_KEY: 'secret_abc123',
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toBeUndefined();
  });

  it('should return errors when NOTION_API_KEY missing', () => {
    const result = validateEnvironmentVariables({});

    expect(result.valid).toBe(false);
    expect(result.errors).toContain('NOTION_API_KEY is required');
  });

  it('should return errors when NOTION_API_KEY is undefined', () => {
    const result = validateEnvironmentVariables({
      NOTION_API_KEY: undefined,
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain('NOTION_API_KEY is required');
  });

  it('should return errors when NOTION_API_KEY is empty string', () => {
    const result = validateEnvironmentVariables({
      NOTION_API_KEY: '',
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain('NOTION_API_KEY is required');
  });

  it('should accept API key with special characters', () => {
    const result = validateEnvironmentVariables({
      NOTION_API_KEY: 'secret_123-ABC/xyz+==',
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toBeUndefined();
  });

  it('should ignore extra environment variables', () => {
    const result = validateEnvironmentVariables({
      NOTION_API_KEY: 'secret_abc123',
      OTHER_VAR: 'some value',
      NODE_ENV: 'production',
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toBeUndefined();
  });
});

describe('parseNotionConfig', () => {
  it('should parse a valid Notion API key', () => {
    const apiKey = 'secret_abc123';
    const config = parseNotionConfig(apiKey);

    expect(config.apiKey).toBe(apiKey);
    expect(config.version).toBe('2022-06-28');
  });

  it('should trim whitespace from API key', () => {
    const config = parseNotionConfig('  secret_abc123  ');

    expect(config.apiKey).toBe('secret_abc123');
  });

  it('should handle API keys with special characters', () => {
    const apiKey = 'secret_123-ABC/xyz+==';
    const config = parseNotionConfig(apiKey);

    expect(config.apiKey).toBe(apiKey);
  });

  it('should set default Notion API version', () => {
    const config = parseNotionConfig('secret_abc123');

    expect(config.version).toBe('2022-06-28');
  });

  it('should handle very long API keys', () => {
    const longKey = 'secret_' + 'a'.repeat(100);
    const config = parseNotionConfig(longKey);

    expect(config.apiKey).toBe(longKey);
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
