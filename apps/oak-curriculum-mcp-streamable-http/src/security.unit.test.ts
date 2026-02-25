import { describe, it, expect } from 'vitest';
import { extractHostname } from './security.js';

describe('extractHostname', () => {
  it('extracts hostname from hostname with port', () => {
    expect(extractHostname('localhost:3333')).toBe('localhost');
    expect(extractHostname('127.0.0.1:8080')).toBe('127.0.0.1');
  });

  it('returns hostname unchanged when no port is present', () => {
    expect(extractHostname('example.com')).toBe('example.com');
  });

  it('extracts ipv6 hostname from bracketed host header with port', () => {
    expect(extractHostname('[::1]:3333')).toBe('::1');
    expect(extractHostname('[2001:db8::1]:8080')).toBe('2001:db8::1');
  });

  it('extracts ipv6 hostname from bracketed host header without port', () => {
    expect(extractHostname('[::1]')).toBe('::1');
  });

  it('returns empty string for invalid ipv6 host header missing closing bracket', () => {
    expect(extractHostname('[::1:3333')).toBe('');
  });
});
