import { describe, expect, it } from 'vitest';

import { isOakClientSurface, normaliseOakClientSurface } from './event-policy-helpers.js';

describe('normaliseOakClientSurface', () => {
  it.each([
    ['a claude-code product token (constructed shape)', ['claude-code/2.0'], 'cli'],
    [
      'the Claude-User claude-code fetcher (observed in live traffic)',
      ['Claude-User (claude-code/1.0)'],
      'cli',
    ],
    ['a self-declaring vscode token (constructed shape)', ['vscode/1.99'], 'vscode'],
    [
      'a browser Mozilla prefix (web convention)',
      ['Mozilla/5.0 (Macintosh; Intel Mac OS X)'],
      'web',
    ],
    ['a self-declaring sdk segment (constructed shape)', ['node-mcp-sdk/1.2'], 'sdk'],
    ['a later sdk occurrence after a rejected embedded one', ['sdkman sdk/1.0'], 'sdk'],
  ])('derives %s to its category', (_label, headerValues, expected) => {
    expect(normaliseOakClientSurface(headerValues)).toBe(expected);
  });

  it.each([
    ['sdk outranks the embedded claude-code token', ['claude-code-sdk/0.3'], 'sdk'],
    ['vscode outranks the embedded claude-code token', ['claude-code-for-vscode/1.0'], 'vscode'],
    [
      'a product token outranks the browser prefix beside it',
      ['Mozilla/5.0 (Windows) vscode/1.99'],
      'vscode',
    ],
    [
      'a claude-code token outranks the browser prefix beside it',
      ['Mozilla/5.0 claude-code/2.0'],
      'cli',
    ],
  ])('%s', (_label, headerValues, expected) => {
    expect(normaliseOakClientSurface(headerValues)).toBe(expected);
  });

  it('prefers the first header value that yields a category', () => {
    expect(normaliseOakClientSurface(['claude-code/2.0', 'Mozilla/5.0'])).toBe('cli');
  });

  it('falls through an unrecognised first header to the next one', () => {
    expect(normaliseOakClientSurface(['anthropic-internal/1.0', 'Mozilla/5.0'])).toBe('web');
  });

  it('matches tokens case-insensitively', () => {
    expect(normaliseOakClientSurface(['VSCode/1.99'])).toBe('vscode');
  });

  it.each([
    ['a bare Claude-User value carries no citable surface token', ['Claude-User/1.0']],
    ['a token embedded in a trailing alphanumeric run is not a segment', ['sdkman/1.0']],
    ['a token adjoined by a leading alphanumeric run is not a segment', ['my-appsdk/1.0']],
    ['an unrecognised product token', ['python-httpx/0.27']],
    ['a non-string value', [42]],
    ['an empty value list', []],
    ['an undefined value', [undefined]],
  ])('derives %s to other', (_label, headerValues) => {
    expect(normaliseOakClientSurface(headerValues)).toBe('other');
  });
});

describe('isOakClientSurface', () => {
  it.each(['cli', 'sdk', 'vscode', 'web', 'other'])('accepts %s', (value) => {
    expect(isOakClientSurface(value)).toBe(true);
  });

  it.each([
    ['an out-of-set string', 'browser'],
    ['a non-string', 7],
    ['undefined', undefined],
  ])('rejects %s', (_label, value) => {
    expect(isOakClientSurface(value)).toBe(false);
  });
});
