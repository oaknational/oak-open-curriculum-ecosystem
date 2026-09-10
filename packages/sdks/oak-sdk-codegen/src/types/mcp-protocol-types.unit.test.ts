/**
 * Unit tests for the pagination-echo contract in mcp-protocol-types.
 *
 * The upstream Oak API signals further pages solely through an HTTP
 * `Link: <url>; rel="next"` response header. These tests describe the
 * system state where that signal survives into the tool result as a
 * structured `PaginationEcho` instead of being dropped at the MCP layer.
 */

import { describe, it, expect } from 'vitest';
import { derivePaginationFromLinkHeader } from './mcp-protocol-types.js';

describe('derivePaginationFromLinkHeader', () => {
  it('reports no further pages when the header is absent', () => {
    expect(derivePaginationFromLinkHeader(null)).toEqual({ hasMore: false });
  });

  it('reports the next offset and limit from a rel="next" link', () => {
    const header =
      '<https://open-api.thenational.academy/api/v0/key-stages/ks2/subject/maths/questions?limit=20&offset=20>; rel="next"';
    expect(derivePaginationFromLinkHeader(header)).toEqual({
      hasMore: true,
      nextOffset: 20,
      nextLimit: 20,
    });
  });

  it('reports no further pages when only non-next relations are present', () => {
    const header = '<https://example.test/things?offset=0&limit=20>; rel="prev"';
    expect(derivePaginationFromLinkHeader(header)).toEqual({ hasMore: false });
  });

  it('finds the rel="next" segment among multiple comma-separated links', () => {
    const header =
      '<https://example.test/things?offset=0&limit=20>; rel="prev", ' +
      '<https://example.test/things?offset=40&limit=20>; rel="next"';
    expect(derivePaginationFromLinkHeader(header)).toEqual({
      hasMore: true,
      nextOffset: 40,
      nextLimit: 20,
    });
  });

  it('omits offset and limit when the next link carries none', () => {
    const header = '<https://example.test/things?page=3>; rel="next"';
    expect(derivePaginationFromLinkHeader(header)).toEqual({ hasMore: true });
  });

  it('omits non-integer offset and limit values rather than guessing', () => {
    const header = '<https://example.test/things?offset=abc&limit=2.5>; rel="next"';
    expect(derivePaginationFromLinkHeader(header)).toEqual({ hasMore: true });
  });

  it('omits digit strings beyond the safe-integer range rather than echoing a lossy number', () => {
    const oversized = '9'.repeat(25);
    const header = `<https://example.test/things?offset=${oversized}&limit=20>; rel="next"`;
    expect(derivePaginationFromLinkHeader(header)).toEqual({ hasMore: true, nextLimit: 20 });
  });

  it('still reports hasMore when the next link URL is unparseable', () => {
    const header = '<https://exa mple.test/things?offset=40&limit=20>; rel="next"';
    expect(derivePaginationFromLinkHeader(header)).toEqual({ hasMore: true });
  });

  it('reads offset and limit from a relative next link target', () => {
    const header = '<?offset=40&limit=20>; rel="next"';
    expect(derivePaginationFromLinkHeader(header)).toEqual({
      hasMore: true,
      nextOffset: 40,
      nextLimit: 20,
    });
  });

  it('reads offset and limit from a path-only next link target', () => {
    const header = '</api/v0/things?offset=40&limit=20>; rel="next"';
    expect(derivePaginationFromLinkHeader(header)).toEqual({
      hasMore: true,
      nextOffset: 40,
      nextLimit: 20,
    });
  });

  it('accepts the bare-token rel form', () => {
    const header = '<https://example.test/things?offset=40&limit=20>; rel=next';
    expect(derivePaginationFromLinkHeader(header)).toEqual({
      hasMore: true,
      nextOffset: 40,
      nextLimit: 20,
    });
  });

  it('accepts next within a space-separated relation-type list', () => {
    const header = '<https://example.test/things?offset=40&limit=20>; rel="next last"';
    expect(derivePaginationFromLinkHeader(header)).toEqual({
      hasMore: true,
      nextOffset: 40,
      nextLimit: 20,
    });
  });

  it('matches the rel parameter case-insensitively and around whitespace', () => {
    const header = '<https://example.test/things?offset=40&limit=20>; REL = "NEXT"';
    expect(derivePaginationFromLinkHeader(header)).toEqual({
      hasMore: true,
      nextOffset: 40,
      nextLimit: 20,
    });
  });

  it('does not match the next relation quoted inside an unrelated parameter', () => {
    const header = String.raw`<https://example.test/things?offset=0&limit=20>; rel="prev"; title="see rel=\"next\""`;
    expect(derivePaginationFromLinkHeader(header)).toEqual({ hasMore: false });
  });
});
