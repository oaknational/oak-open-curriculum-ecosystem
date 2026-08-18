import { describe, expect, it } from 'vitest';

import {
  isOakClientProduct,
  isOakClientSurface,
  normaliseOakClientProduct,
  normaliseOakClientSurface,
} from './client-categories.js';
import type { ClientIdentityHeaders, OakClientProduct } from './event-policy-contract.js';

function compareProducts(left: OakClientProduct, right: OakClientProduct): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

/** A readable header container carrying exactly these values. */
function readable(...values: readonly unknown[]): ClientIdentityHeaders {
  return { readable: true, values };
}

/** A container the reader could not see into at all. */
const UNREADABLE: ClientIdentityHeaders = { readable: false };

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

describe('normaliseOakClientProduct', () => {
  // Every row below is a User-Agent verified first-hand in Oak's own inbound
  // traffic over the 7 days to 2026-08-13, with its observed request count.
  it.each([
    ['the bare Claude-User fetcher (10,045 requests)', ['Claude-User'], 'claude_ai'],
    [
      'the Claude-User fetcher declaring an embedded library token (~78% of inbound)',
      ['Claude-User (claude-code/1.0)'],
      'claude_ai',
    ],
    ['the Claude Code CLI (~3,100 requests)', ['claude-code/2.1.226 (cli)'], 'claude_code'],
    ['the Codex MCP client (~230 requests)', ['codex-mcp-client/0.147.0-alpha.6.5'], 'codex'],
  ])('attributes %s to its product', (_label, headerValues, expected) => {
    expect(normaliseOakClientProduct(readable(...headerValues))).toBe(expected);
  });

  it('separates Claude Code from Codex, which the surface axis merges into cli', () => {
    const claudeCode = ['claude-code/2.1.226 (cli)'];
    const codex = ['codex-mcp-client/0.147.0-alpha.6.5'];

    expect(normaliseOakClientSurface(claudeCode)).toBe('cli');
    expect(normaliseOakClientSurface(codex)).toBe('other');
    expect(normaliseOakClientProduct(readable(...claudeCode))).toBe('claude_code');
    expect(normaliseOakClientProduct(readable(...codex))).toBe('codex');
    expect(normaliseOakClientProduct(readable(...claudeCode))).not.toBe(
      normaliseOakClientProduct(readable(...codex)),
    );
  });

  it('attributes Claude.ai to its own product where the surface axis reads cli', () => {
    const claudeAi = ['Claude-User (claude-code/1.0)'];

    expect(normaliseOakClientSurface(claudeAi)).toBe('cli');
    expect(normaliseOakClientProduct(readable(...claudeAi))).toBe('claude_ai');
  });

  it('prefers the first header value that names a product', () => {
    expect(normaliseOakClientProduct(readable('claude-code/2.0', 'Claude-User'))).toBe(
      'claude_code',
    );
  });

  it('falls through a header naming no product to the next one', () => {
    expect(normaliseOakClientProduct(readable('anthropic-internal/1.0', 'claude-code/2.0'))).toBe(
      'claude_code',
    );
  });

  it('matches product tokens case-insensitively and ignores surrounding space', () => {
    expect(normaliseOakClientProduct(readable('  CLAUDE-CODE/2.0  '))).toBe('claude_code');
  });

  // The residual is measured and deliberately unclaimed, not an unread default:
  // these are Oak's own probes, smoke tests and the browser widget, none of them
  // a named MCP client product.
  it.each([
    ['curl, an Oak probe (291 requests)', ['curl/8.5.0']],
    ['a bare node client (249 requests)', ['node']],
    ['python-httpx (87 requests)', ['python-httpx/0.28.1']],
    [
      'a browser hitting the widget (74 requests)',
      ['Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/151.0.0.0'],
    ],
    ['Bun (39 requests)', ['Bun/1.4.0']],
    ['an Oak inspection script (11 requests)', ['directory-admin-dashboard-inspection']],
  ])('leaves %s in other', (_label, headerValues) => {
    expect(normaliseOakClientProduct(readable(...headerValues))).toBe('other');
  });

  // Anchoring: a product token is only a self-declaration when it LEADS the
  // value. These would each be misattributed by a substring match.
  it.each([
    [
      'a product name buried mid-string is not self-declaration',
      ['RAW-UA-SENTINEL-9f31 Claude-User (claude-code/1.0) raw-host'],
    ],
    ['a dash continuation is not a product boundary', ['claude-user-agent/1.0']],
    ['a longer token sharing a prefix is a different product', ['claude-codex/1.0']],
    ['a token continuing into alphanumerics', ['codex-mcp-clientele/1.0']],
  ])('refuses to attribute %s', (_label, headerValues) => {
    expect(normaliseOakClientProduct(readable(...headerValues))).toBe('other');
  });

  // The line between the two negative outcomes is CONTAINER READABILITY, never
  // value presence. A readable container that carried no client header is the
  // client's own choice, so it is a measurement -> 'other'. Only an unreadable or
  // missing container means this derivation could not run -> 'unavailable'.
  //
  // Keying on value presence instead would let any client raise 'unavailable' by
  // omitting its User-Agent, making a documented transport alarm
  // client-influenceable — which is not an alarm.
  it.each([
    ['a readable container carrying nothing', []],
    ['an absent header value', [undefined]],
    ['a non-string value', [42]],
    ['an object that would coerce to a product string', [{ toString: () => 'claude-code/2.0' }]],
    ['an empty string', ['']],
    ['a whitespace-only string', ['   ']],
    ['every value absent', [undefined, undefined]],
    ['an unrecognised client', ['python-httpx/0.28.1']],
  ])('reports %s as other, because the container was readable', (_label, values) => {
    expect(normaliseOakClientProduct(readable(...values))).toBe('other');
  });

  it('reports an unreadable container as unavailable', () => {
    expect(normaliseOakClientProduct(UNREADABLE)).toBe('unavailable');
  });

  // The behavioural guarantee the value exists to provide: a client cannot raise
  // the transport-health signal, however it manipulates its own headers.
  it.each([
    ['omitting every header', []],
    ['sending an empty user-agent', ['', '']],
    ['sending whitespace', ['   ', '   ']],
    ['sending an unrecognised agent', ['definitely-not-a-known-client/9.9']],
    ['sending a non-string', [42]],
  ])('cannot be pushed to unavailable by a client %s', (_label, values) => {
    expect(normaliseOakClientProduct(readable(...values))).not.toBe('unavailable');
  });

  it('still reads a present header when an earlier one is absent', () => {
    expect(normaliseOakClientProduct(readable(undefined, 'claude-code/2.0'))).toBe('claude_code');
    expect(normaliseOakClientProduct(readable(undefined, 'python-httpx/0.28.1'))).toBe('other');
  });

  it('cannot be smuggled past the anchor by an over-long value', () => {
    expect(normaliseOakClientProduct(readable(`${'x'.repeat(20_000)} claude-code/2.0`))).toBe(
      'other',
    );
    expect(normaliseOakClientProduct(readable(`claude-code/${'9'.repeat(20_000)}`))).toBe(
      'claude_code',
    );
  });

  it('reaches every value in the closed vocabulary, so none is unreachable', () => {
    const derived = new Set<OakClientProduct>([
      normaliseOakClientProduct(readable('Claude-User')),
      normaliseOakClientProduct(readable('claude-code/2.1.226 (cli)')),
      normaliseOakClientProduct(readable('codex-mcp-client/0.147.0')),
      normaliseOakClientProduct(readable('python-httpx/0.28.1')),
      normaliseOakClientProduct(UNREADABLE),
    ]);

    expect([...derived].sort(compareProducts)).toStrictEqual([
      'claude_ai',
      'claude_code',
      'codex',
      'other',
      'unavailable',
    ]);
  });
});

describe('isOakClientProduct', () => {
  it.each(['claude_ai', 'claude_code', 'codex', 'other', 'unavailable'])('accepts %s', (value) => {
    expect(isOakClientProduct(value)).toBe(true);
  });

  it.each([
    ['a surface-axis value', 'cli'],
    ['a family-axis value', 'claude'],
    ['a raw client string', 'claude-code/2.1.226 (cli)'],
    ['a non-string', 7],
    ['undefined', undefined],
  ])('rejects %s', (_label, value) => {
    expect(isOakClientProduct(value)).toBe(false);
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
