/**
 * Unit tests for HTML escaping utility.
 *
 * Tests verify that special HTML characters are properly escaped
 * to prevent XSS vulnerabilities.
 */

import { describe, expect, it } from 'vitest';

import { escapeHtml } from './escape-html.js';

describe('escapeHtml', () => {
  it('escapes ampersand', () => {
    expect(escapeHtml('foo & bar')).toBe('foo &amp; bar');
  });

  it('escapes less than', () => {
    expect(escapeHtml('<script>')).toBe('&lt;script&gt;');
  });

  it('escapes greater than', () => {
    expect(escapeHtml('a > b')).toBe('a &gt; b');
  });

  it('escapes double quotes', () => {
    expect(escapeHtml('say "hello"')).toBe('say &quot;hello&quot;');
  });

  it('escapes single quotes', () => {
    expect(escapeHtml("it's")).toBe('it&#039;s');
  });

  it('escapes multiple special characters', () => {
    expect(escapeHtml('<a href="test">foo & bar</a>')).toBe(
      '&lt;a href=&quot;test&quot;&gt;foo &amp; bar&lt;/a&gt;',
    );
  });

  it('returns unchanged string when no special characters', () => {
    expect(escapeHtml('plain text')).toBe('plain text');
  });

  it('handles empty string', () => {
    expect(escapeHtml('')).toBe('');
  });
});
