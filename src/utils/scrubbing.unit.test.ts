import { describe, it, expect } from 'vitest';
import { scrubEmail, scrubSensitiveData } from './scrubbing.js';

describe('scrubEmail', () => {
  it('should scrub simple email addresses', () => {
    expect(scrubEmail('user@example.com')).toBe('use...@example.com');
    expect(scrubEmail('john.doe@company.com')).toBe('joh...@company.com');
    expect(scrubEmail('a@b.com')).toBe('a...@b.com');
  });

  it('should scrub emails within text', () => {
    expect(scrubEmail('Contact me at john@example.com for details')).toBe(
      'Contact me at joh...@example.com for details',
    );
  });

  it('should handle multiple emails in text', () => {
    expect(scrubEmail('Email: alice@example.com or bob@test.org')).toBe(
      'Email: ali...@example.com or bob...@test.org',
    );
  });

  it('should handle emails with numbers and special characters', () => {
    expect(scrubEmail('user123@example.com')).toBe('use...@example.com');
    expect(scrubEmail('first.last+tag@domain.co.uk')).toBe('fir...@domain.co.uk');
  });

  it('should handle edge cases', () => {
    expect(scrubEmail('')).toBe('');
    expect(scrubEmail('not an email')).toBe('not an email');
    expect(scrubEmail('@invalid.com')).toBe('@invalid.com');
    expect(scrubEmail('no-domain@')).toBe('no-domain@');
  });

  it('should preserve short email prefixes', () => {
    expect(scrubEmail('ab@example.com')).toBe('ab...@example.com');
    expect(scrubEmail('x@example.com')).toBe('x...@example.com');
  });
});

describe('scrubSensitiveData', () => {
  it('should scrub strings containing emails', () => {
    expect(scrubSensitiveData('user@example.com')).toBe('use...@example.com');
  });

  it('should handle non-string primitives', () => {
    expect(scrubSensitiveData(123)).toBe(123);
    expect(scrubSensitiveData(true)).toBe(true);
    expect(scrubSensitiveData(null)).toBe(null);
    expect(scrubSensitiveData(undefined)).toBe(undefined);
  });

  it('should scrub arrays recursively', () => {
    const input = ['user@example.com', 'plain text', 'admin@test.org'];
    const expected = ['use...@example.com', 'plain text', 'adm...@test.org'];
    expect(scrubSensitiveData(input)).toEqual(expected);
  });

  it('should scrub objects recursively', () => {
    const input = {
      name: 'John Doe',
      email: 'john@example.com',
      description: 'Contact at john@example.com',
    };
    const expected = {
      name: 'John Doe',
      email: 'joh...@example.com',
      description: 'Contact at joh...@example.com',
    };
    expect(scrubSensitiveData(input)).toEqual(expected);
  });

  it('should handle nested structures', () => {
    const input = {
      users: [
        { name: 'Alice', email: 'alice@example.com' },
        { name: 'Bob', email: 'bob@test.org' },
      ],
      admin: {
        contact: 'admin@company.com',
        backup: 'backup@company.com',
      },
    };
    const expected = {
      users: [
        { name: 'Alice', email: 'ali...@example.com' },
        { name: 'Bob', email: 'bob...@test.org' },
      ],
      admin: {
        contact: 'adm...@company.com',
        backup: 'bac...@company.com',
      },
    };
    expect(scrubSensitiveData(input)).toEqual(expected);
  });

  it('should handle arrays of mixed types', () => {
    const input = ['text', 123, 'user@example.com', { email: 'nested@example.com' }, null];
    const expected = ['text', 123, 'use...@example.com', { email: 'nes...@example.com' }, null];
    expect(scrubSensitiveData(input)).toEqual(expected);
  });
});
