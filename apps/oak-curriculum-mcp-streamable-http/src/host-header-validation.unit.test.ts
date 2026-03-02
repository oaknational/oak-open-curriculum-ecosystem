import { describe, it, expect } from 'vitest';
import { isAllowedHostname, isValidHostHeader } from './host-header-validation.js';

describe('host-header-validation', () => {
  describe('isValidHostHeader', () => {
    it('accepts canonical host formats', () => {
      expect(isValidHostHeader('example.com')).toBe(true);
      expect(isValidHostHeader('example.com:443')).toBe(true);
      expect(isValidHostHeader('localhost:3333')).toBe(true);
      expect(isValidHostHeader('[::1]:3333')).toBe(true);
    });

    it('rejects malformed or dangerous host formats', () => {
      expect(isValidHostHeader('example.com:443@evil.com')).toBe(false);
      expect(isValidHostHeader('[::1]evil')).toBe(false);
      expect(isValidHostHeader('.example.com')).toBe(false);
      expect(isValidHostHeader('example..com')).toBe(false);
      expect(isValidHostHeader('example.com/path')).toBe(false);
    });
  });

  describe('isAllowedHostname', () => {
    it('matches exact hostnames case-insensitively', () => {
      expect(isAllowedHostname('example.com', ['EXAMPLE.COM'])).toBe(true);
    });

    it('matches wildcard hostnames', () => {
      expect(isAllowedHostname('api.example.com', ['*.example.com'])).toBe(true);
      expect(isAllowedHostname('deep.api.example.com', ['*.example.com'])).toBe(true);
      expect(isAllowedHostname('example.com', ['*.example.com'])).toBe(false);
    });
  });
});
