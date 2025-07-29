import { describe, it, expect } from 'vitest';
import { getServerConfig, getServerCapabilities } from './index.js';

describe('getServerConfig', () => {
  it('should return server configuration with name and version', () => {
    const config = getServerConfig();

    expect(config).toEqual({
      name: 'oak-notion-mcp',
      version: '0.0.0-development',
    });
  });

  it('should be a pure function returning the same values', () => {
    const config1 = getServerConfig();
    const config2 = getServerConfig();

    expect(config1).toEqual(config2);
    expect(config1).not.toBe(config2); // Different object references
  });
});

describe('getServerCapabilities', () => {
  it('should return capabilities object', () => {
    const options = getServerCapabilities();

    expect(options).toEqual({
      capabilities: {
        resources: {},
        tools: {},
        prompts: {},
      },
    });
  });

  it('should be a pure function returning the same structure', () => {
    const options1 = getServerCapabilities();
    const options2 = getServerCapabilities();

    expect(options1).toEqual(options2);
    expect(options1).not.toBe(options2); // Different object references
  });
});
