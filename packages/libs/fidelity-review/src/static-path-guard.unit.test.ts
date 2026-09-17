import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { decodeUrlPath, resolveWithinRoot } from './static-path-guard';

const ROOT = path.resolve('/served/export-root');

describe('decodeUrlPath', () => {
  it('decodes and strips the query', () => {
    expect(decodeUrlPath('/whitelabel/specimen.html?brand=x')).toBe('/whitelabel/specimen.html');
    expect(decodeUrlPath('/Identity%20Switchboard.html')).toBe('/Identity Switchboard.html');
  });

  it('answers a malformed percent-escape with nothing, never a throw', () => {
    // This runs inside the http request listener — a throw there kills the
    // capture run with a raw URIError instead of a 404.
    expect(decodeUrlPath('/%zz')).toBeUndefined();
    expect(decodeUrlPath('/fonts/Lexend%')).toBeUndefined();
  });

  it('rejects an embedded NUL — a decoded %00 would make fs calls throw downstream', () => {
    expect(decodeUrlPath('/%00')).toBeUndefined();
    expect(decodeUrlPath('/ok%00.html')).toBeUndefined();
  });

  it('rejects an overlong-UTF-8 traversal encoding as malformed', () => {
    expect(decodeUrlPath('/%c0%ae%c0%ae/secrets.txt')).toBeUndefined();
  });
});

describe('resolveWithinRoot', () => {
  it('resolves an in-root request to its filesystem path', () => {
    expect(resolveWithinRoot(ROOT, '/Identity%20Switchboard.html')).toBe(
      path.join(ROOT, 'Identity Switchboard.html'),
    );
  });

  it('strips a query string before resolving', () => {
    expect(resolveWithinRoot(ROOT, '/whitelabel/specimen.html?brand=x')).toBe(
      path.join(ROOT, 'whitelabel', 'specimen.html'),
    );
  });

  it('rejects traversal out of the root', () => {
    expect(resolveWithinRoot(ROOT, '/../secrets.txt')).toBeUndefined();
    expect(resolveWithinRoot(ROOT, '/a/../../b.txt')).toBeUndefined();
    expect(resolveWithinRoot(ROOT, '/%2e%2e/escape.txt')).toBeUndefined();
  });

  it('rejects traversal hidden behind a %2f-encoded separator — decode MUST precede resolve', () => {
    // If decode and resolve were ever reordered, this row is the one that
    // catches it: the encoded separator only becomes a path boundary after
    // decoding, and the resolved path then escapes the root.
    expect(resolveWithinRoot(ROOT, '/..%2fsecrets.txt')).toBeUndefined();
    expect(resolveWithinRoot(ROOT, '/a%2f..%2f..%2fb.txt')).toBeUndefined();
  });

  it('treats a double-encoded dot-dot as a literal in-root segment (the decode is single-pass)', () => {
    expect(resolveWithinRoot(ROOT, '/%252e%252e/escape.txt')).toBe(
      path.join(ROOT, '%2e%2e', 'escape.txt'),
    );
  });

  it('rejects a NUL-carrying request rather than returning a path fs calls choke on', () => {
    expect(resolveWithinRoot(ROOT, '/ok%00.html')).toBeUndefined();
  });

  it('contains an absolute-form request target (Node passes the full URI as req.url)', () => {
    expect(resolveWithinRoot(ROOT, 'http://evil.example/../../etc/passwd')).toBeUndefined();
  });

  it('rejects a sibling directory sharing the root as a string prefix', () => {
    expect(resolveWithinRoot(ROOT, '/../export-root-evil/x.txt')).toBeUndefined();
  });

  it('rejects the bare root itself (a directory, not a file)', () => {
    expect(resolveWithinRoot(ROOT, '/')).toBeUndefined();
  });

  it('rejects a malformed percent-escape rather than throwing', () => {
    expect(resolveWithinRoot(ROOT, '/%zz')).toBeUndefined();
  });

  it('judges the canonical root, not the caller spelling — a trailing separator still serves', () => {
    expect(resolveWithinRoot(`${ROOT}${path.sep}`, '/specimen.html')).toBe(
      path.join(ROOT, 'specimen.html'),
    );
  });

  it('refuses a relative root — the same contract shape as dev-server demoDir, no ambient cwd', () => {
    expect(resolveWithinRoot('served-export', '/specimen.html')).toBeUndefined();
  });
});
