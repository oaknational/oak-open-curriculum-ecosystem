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

  it('should scrub the specific email from Notion', () => {
    expect(scrubEmail('mitchell.lloyd154@gmail.com')).toBe('mit...@gmail.com');
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
    // Note: undefined case tested implicitly - passes through unchanged
  });

  it('should return arrays unchanged (KISS principle)', () => {
    const input = ['user@example.com', 'plain text', 'admin@test.org'];
    // Arrays pass through unchanged - only strings are scrubbed
    expect(scrubSensitiveData(input)).toBe(input);
  });

  it('should return objects unchanged (KISS principle)', () => {
    const input = {
      name: 'John Doe',
      email: 'john@example.com',
      description: 'Contact at john@example.com',
    };
    // Objects pass through unchanged - only strings are scrubbed
    expect(scrubSensitiveData(input)).toBe(input);
  });

  it('should only scrub when given a string directly', () => {
    // Following KISS: if you want something scrubbed, pass it as a string
    expect(scrubSensitiveData('admin@company.com')).toBe('adm...@company.com');
    expect(scrubSensitiveData('backup@company.com')).toBe('bac...@company.com');

    // Complex structures pass through - caller is responsible for extracting strings
    const complexData = {
      users: [{ email: 'alice@example.com' }],
    };
    expect(scrubSensitiveData(complexData)).toBe(complexData);
  });

  it('should handle arrays of mixed types by returning unchanged', () => {
    const input = ['text', 123, 'user@example.com', { email: 'nested@example.com' }, null];
    // Following KISS: arrays pass through unchanged
    expect(scrubSensitiveData(input)).toBe(input);
  });
});
