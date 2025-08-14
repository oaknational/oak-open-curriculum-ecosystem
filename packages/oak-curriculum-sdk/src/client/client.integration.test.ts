import { describe, it, expect } from 'vitest';
import { createOakClient, createOakPathBasedClient } from './index';

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
});
