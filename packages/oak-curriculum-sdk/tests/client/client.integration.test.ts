import { describe, it, expect } from 'vitest';
import { createOakClient, createOakPathBasedClient } from '../../src/client/index';

describe('Oak Client Integration', () => {
  describe('createOakClient', () => {
    it('should create a client with valid API key', () => {
      const client = createOakClient('test-api-key');
      expect(client).toBeDefined();
      expect(client.GET).toBeDefined();
      expect(client.POST).toBeDefined();
      expect(client.PUT).toBeDefined();
      expect(client.DELETE).toBeDefined();
    });

    it('should throw error when API key is empty', () => {
      expect(() => createOakClient('')).toThrow('API key');
    });
  });

  describe('createOakPathBasedClient', () => {
    it('should create a path-based client with valid API key', () => {
      const client = createOakPathBasedClient('test-api-key');
      expect(client).toBeDefined();
    });

    it('should throw error when API key is empty', () => {
      expect(() => createOakPathBasedClient('')).toThrow('API key');
    });
  });

  describe('Client type safety', () => {
    it('should have correct types for API methods', () => {
      const client = createOakClient('test-api-key');

      // This test mainly verifies that TypeScript compilation works
      // with the generated types
      type ClientType = typeof client;
      type GetMethod = ClientType['GET'];

      // If this compiles, our types are working
      const _testTypeGuard: GetMethod = client.GET;
      expect(_testTypeGuard).toBeDefined();
    });
  });
});
