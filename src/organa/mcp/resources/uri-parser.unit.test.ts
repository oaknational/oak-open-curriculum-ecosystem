import { describe, it, expect } from 'vitest';
import { parseResourceUri, validateResourceUri, buildResourceUri } from './uri-parser.js';

describe('parseResourceUri', () => {
  it('should parse page URI correctly', () => {
    const uri = 'notion://pages/abc-123-def';
    const result = parseResourceUri(uri);

    expect(result).toEqual({
      type: 'pages',
      id: 'abc-123-def',
    });
  });

  it('should parse database URI correctly', () => {
    const uri = 'notion://databases/xyz-456-ghi';
    const result = parseResourceUri(uri);

    expect(result).toEqual({
      type: 'databases',
      id: 'xyz-456-ghi',
    });
  });

  it('should parse user URI correctly', () => {
    const uri = 'notion://users/user-789-jkl';
    const result = parseResourceUri(uri);

    expect(result).toEqual({
      type: 'users',
      id: 'user-789-jkl',
    });
  });

  it('should handle URI with hyphens in ID', () => {
    const uri = 'notion://pages/12345678-1234-1234-1234-123456789012';
    const result = parseResourceUri(uri);

    expect(result).toEqual({
      type: 'pages',
      id: '12345678-1234-1234-1234-123456789012',
    });
  });

  it('should return null for invalid protocol', () => {
    const uri = 'http://pages/abc-123';
    const result = parseResourceUri(uri);

    expect(result).toBeNull();
  });

  it('should return null for invalid format', () => {
    const uri = 'notion://invalid';
    const result = parseResourceUri(uri);

    expect(result).toBeNull();
  });

  it('should return null for empty URI', () => {
    const result = parseResourceUri('');

    expect(result).toBeNull();
  });

  it('should return null for URI with empty ID', () => {
    const uri = 'notion://pages/';
    const result = parseResourceUri(uri);

    expect(result).toBeNull();
  });
});

describe('validateResourceUri', () => {
  it('should validate discovery URI', () => {
    const result = validateResourceUri('notion://discovery');

    expect(result).toEqual({
      valid: true,
    });
  });

  it('should validate correct page URI', () => {
    const result = validateResourceUri('notion://pages/abc-123');

    expect(result).toEqual({
      valid: true,
    });
  });

  it('should validate correct database URI', () => {
    const result = validateResourceUri('notion://databases/xyz-456');

    expect(result).toEqual({
      valid: true,
    });
  });

  it('should validate correct user URI', () => {
    const result = validateResourceUri('notion://users/user-789');

    expect(result).toEqual({
      valid: true,
    });
  });

  it('should reject invalid protocol', () => {
    const result = validateResourceUri('http://pages/abc-123');

    expect(result).toEqual({
      valid: false,
      errors: ['URI must use notion:// protocol'],
    });
  });

  it('should reject invalid resource type', () => {
    const result = validateResourceUri('notion://invalid/abc-123');

    expect(result).toEqual({
      valid: false,
      errors: ['Invalid resource type: invalid. Must be pages, databases, or users'],
    });
  });

  it('should reject missing ID', () => {
    const result = validateResourceUri('notion://pages/');

    expect(result).toEqual({
      valid: false,
      errors: ['Resource ID is required'],
    });
  });

  it('should reject malformed URI', () => {
    const result = validateResourceUri('notion://pages');

    expect(result).toEqual({
      valid: false,
      errors: ['Invalid URI format'],
    });
  });

  it('should reject empty URI', () => {
    const result = validateResourceUri('');

    expect(result).toEqual({
      valid: false,
      errors: ['URI is required'],
    });
  });
});

describe('buildResourceUri', () => {
  it('should build page URI', () => {
    const uri = buildResourceUri('pages', 'abc-123-def');

    expect(uri).toBe('notion://pages/abc-123-def');
  });

  it('should build database URI', () => {
    const uri = buildResourceUri('databases', 'xyz-456-ghi');

    expect(uri).toBe('notion://databases/xyz-456-ghi');
  });

  it('should build user URI', () => {
    const uri = buildResourceUri('users', 'user-789-jkl');

    expect(uri).toBe('notion://users/user-789-jkl');
  });

  it('should handle UUID format IDs', () => {
    const uri = buildResourceUri('pages', '12345678-1234-1234-1234-123456789012');

    expect(uri).toBe('notion://pages/12345678-1234-1234-1234-123456789012');
  });

  it('should handle IDs without hyphens', () => {
    const uri = buildResourceUri('databases', '1234567890abcdef');

    expect(uri).toBe('notion://databases/1234567890abcdef');
  });
});
