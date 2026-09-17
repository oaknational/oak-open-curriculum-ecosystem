import { describe, it, expect } from 'vitest';

import { requestsHtmlDocument } from './mcp-middleware.js';

/**
 * Unit coverage for the browser-shape predicate the auth fork reads.
 *
 * @remarks
 * The app serves no HTML, so nothing here describes a document being
 * returned. What it describes is which requests `mcp-public-browser-leg.ts`
 * must recognise as browser traffic — so the auth vendor's handshake cannot
 * answer them with a redirect (MCP-518) — and, in the safety direction,
 * which requests it must never claim, so no protocol request can lose its
 * auth context. The fork's end-to-end effect is proven in
 * `clerk-public-surface.integration.test.ts`.
 */
describe('requestsHtmlDocument', () => {
  it('U1: GET naming text/event-stream is protocol traffic', () => {
    expect(requestsHtmlDocument('GET', 'text/event-stream')).toBe(false);
  });

  it('U2: GET naming text/html is browser traffic', () => {
    expect(requestsHtmlDocument('GET', 'text/html')).toBe(true);
  });

  it('U2a: GET naming application/xhtml+xml is browser traffic', () => {
    expect(requestsHtmlDocument('GET', 'application/xhtml+xml')).toBe(true);
  });

  it('U3: GET naming both html and event-stream stays protocol traffic', () => {
    expect(requestsHtmlDocument('GET', 'text/html, text/event-stream')).toBe(false);
    expect(requestsHtmlDocument('GET', 'text/event-stream, text/html')).toBe(false);
  });

  it('U4: a browser-realistic Accept is browser traffic', () => {
    expect(
      requestsHtmlDocument(
        'GET',
        'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      ),
    ).toBe(true);
  });

  it('U5: */* alone is never browser traffic', () => {
    expect(requestsHtmlDocument('GET', '*/*')).toBe(false);
  });

  it('U6: an absent Accept is never browser traffic', () => {
    expect(requestsHtmlDocument('GET', undefined)).toBe(false);
    expect(requestsHtmlDocument('GET', '')).toBe(false);
  });

  it('U7: malformed Accept values never throw and are never browser traffic', () => {
    for (const accept of [';;q=,', 'text/', ',,,', ';', '   ', 'q=0.9']) {
      expect(requestsHtmlDocument('GET', accept)).toBe(false);
    }
  });

  it('U8: non-GET/HEAD methods are never browser traffic', () => {
    for (const method of ['POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH']) {
      expect(requestsHtmlDocument(method, 'text/html')).toBe(false);
    }
  });

  it('U10: HEAD is judged exactly as GET is', () => {
    expect(requestsHtmlDocument('HEAD', 'text/html')).toBe(true);
    expect(requestsHtmlDocument('HEAD', 'text/event-stream')).toBe(false);
    expect(requestsHtmlDocument('HEAD', '*/*')).toBe(false);
  });

  it('matches tokens case-insensitively and ignores media-range parameters', () => {
    expect(requestsHtmlDocument('GET', 'TEXT/HTML;q=0.9')).toBe(true);
    expect(requestsHtmlDocument('GET', 'Text/Event-Stream')).toBe(false);
  });
});
