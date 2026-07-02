import { describe, expect, it } from 'vitest';

import {
  analyzeFileBytes,
  detectBom,
  findFirstInvalidUtf8,
  isBinary,
  reportFailsThreshold,
  scanText,
} from './check-encoding-helpers.js';
import { classifyCodepoint } from './check-encoding-tables.js';

/** Build a byte buffer from a list of byte values, for legible fixtures. */
function bytesOf(...values: number[]): Uint8Array {
  return Uint8Array.from(values);
}

/** Encode a string to UTF-8 bytes (valid-input fixtures). */
function utf8(text: string): Uint8Array {
  return new TextEncoder().encode(text);
}

const ESC = '\x1b';

describe('classifyCodepoint', () => {
  it('classifies the escape control byte as a C0 control', () => {
    expect(classifyCodepoint(0x1b)).toStrictEqual({ category: 'c0-control', name: 'ESCAPE' });
  });

  it('classifies DELETE and the C1 range as c1-control', () => {
    expect(classifyCodepoint(0x7f)).toStrictEqual({ category: 'c1-control', name: 'DELETE' });
    expect(classifyCodepoint(0x85)?.category).toBe('c1-control');
  });

  it('classifies a right-to-left override as a bidi control', () => {
    expect(classifyCodepoint(0x202e)).toStrictEqual({
      category: 'bidi-control',
      name: 'RIGHT-TO-LEFT OVERRIDE',
    });
  });

  it('classifies the replacement character', () => {
    expect(classifyCodepoint(0xfffd)?.category).toBe('replacement-char');
  });

  it('classifies zero-width and unusual-space characters', () => {
    expect(classifyCodepoint(0x200b)?.category).toBe('zero-width');
    expect(classifyCodepoint(0x00a0)?.category).toBe('unusual-space');
  });

  it('classifies an em dash as informational typographic punctuation', () => {
    expect(classifyCodepoint(0x2014)).toStrictEqual({ category: 'typographic', name: 'EM DASH' });
  });

  it('leaves ordinary text and the allowed whitespace controls unflagged', () => {
    expect(classifyCodepoint(0x61)).toBeNull(); // 'a'
    expect(classifyCodepoint(0x09)).toBeNull(); // TAB
    expect(classifyCodepoint(0x0a)).toBeNull(); // LF
    expect(classifyCodepoint(0x1f600)).toBeNull(); // 😀
  });
});

describe('findFirstInvalidUtf8', () => {
  it('accepts ASCII and multibyte UTF-8, including astral codepoints', () => {
    expect(findFirstInvalidUtf8(utf8('plain ascii'))).toBeNull();
    expect(findFirstInvalidUtf8(utf8('café — résumé'))).toBeNull();
    expect(findFirstInvalidUtf8(utf8('emoji 😀 ok'))).toBeNull();
    expect(findFirstInvalidUtf8(bytesOf())).toBeNull();
  });

  it('rejects a lone continuation byte', () => {
    expect(findFirstInvalidUtf8(bytesOf(0x80))).toStrictEqual({ bytePosition: 0, badBytes: '80' });
  });

  it('rejects a truncated multibyte sequence', () => {
    // 0xC3 starts a 2-byte sequence but no continuation follows.
    expect(findFirstInvalidUtf8(bytesOf(0x41, 0xc3))?.bytePosition).toBe(1);
  });

  it('rejects an overlong encoding', () => {
    // C0 80 is an overlong encoding of NUL.
    expect(findFirstInvalidUtf8(bytesOf(0xc0, 0x80))?.bytePosition).toBe(0);
  });

  it('rejects a UTF-16 surrogate codepoint', () => {
    // ED A0 80 = U+D800, a lone high surrogate.
    expect(findFirstInvalidUtf8(bytesOf(0xed, 0xa0, 0x80))?.bytePosition).toBe(0);
  });

  it('rejects a codepoint above U+10FFFF', () => {
    expect(findFirstInvalidUtf8(bytesOf(0xf5, 0x80, 0x80, 0x80))?.bytePosition).toBe(0);
  });
});

describe('detectBom', () => {
  it('detects a UTF-8 BOM', () => {
    expect(detectBom(bytesOf(0xef, 0xbb, 0xbf, 0x61))).toBe('utf8');
  });

  it('detects UTF-16 LE and BE BOMs', () => {
    expect(detectBom(bytesOf(0xff, 0xfe))).toBe('utf16-utf32');
    expect(detectBom(bytesOf(0xfe, 0xff))).toBe('utf16-utf32');
  });

  it('returns null for BOM-free content', () => {
    expect(detectBom(utf8('no bom here'))).toBeNull();
  });
});

describe('isBinary', () => {
  it('treats a NUL byte as the binary marker', () => {
    expect(isBinary(bytesOf(0x89, 0x50, 0x00, 0x4e))).toBe(true);
    expect(isBinary(utf8('text only'))).toBe(false);
  });
});

describe('scanText', () => {
  it('reports the 1-based line and column of a finding', () => {
    const findings = scanText(`line one\nha${ESC}lt`);
    expect(findings).toStrictEqual([
      { category: 'c0-control', codepoint: 'U+001B', name: 'ESCAPE', line: 2, column: 3 },
    ]);
  });

  it('finds nothing in clean prose', () => {
    expect(scanText('A normal sentence with words.')).toStrictEqual([]);
  });
});

describe('analyzeFileBytes', () => {
  it('reports a clean text file with no findings', () => {
    const report = analyzeFileBytes('clean.ts', utf8('const x = 1;\nexport { x };\n'));
    expect(report).toStrictEqual({
      path: 'clean.ts',
      isBinary: false,
      bom: null,
      invalidUtf8: null,
      notNfc: false,
      findings: [],
    });
  });

  it('flags a raw escape control byte embedded in source', () => {
    const report = analyzeFileBytes('ansi.ts', utf8(`const RESET = '${ESC}[0m';\n`));
    expect(report.findings).toStrictEqual([
      { category: 'c0-control', codepoint: 'U+001B', name: 'ESCAPE', line: 1, column: 16 },
    ]);
  });

  it('classifies a NUL-containing file as binary and scans nothing', () => {
    const report = analyzeFileBytes('logo.png', bytesOf(0x89, 0x50, 0x4e, 0x47, 0x00, 0x1b));
    expect(report.isBinary).toBe(true);
    expect(report.findings).toStrictEqual([]);
    expect(report.invalidUtf8).toBeNull();
  });

  it('detects a UTF-8 BOM and scans the body after it', () => {
    const report = analyzeFileBytes('bom.md', bytesOf(0xef, 0xbb, 0xbf, ...utf8('# Title\n')));
    expect(report.bom).toBe('utf8');
    expect(report.invalidUtf8).toBeNull();
    expect(report.findings).toStrictEqual([]);
  });

  it('reports invalid UTF-8 in a non-binary file', () => {
    const report = analyzeFileBytes('broken.txt', bytesOf(0x68, 0x69, 0x80, 0x0a));
    expect(report.invalidUtf8).toStrictEqual({ bytePosition: 2, badBytes: '80 0A' });
    expect(report.findings).toStrictEqual([]);
  });

  it('detects the replacement-character scar of prior mojibake', () => {
    const report = analyzeFileBytes('mojibake.md', utf8('answer \uFFFD label\n'));
    expect(report.findings.map((finding) => finding.category)).toStrictEqual(['replacement-char']);
  });

  it('detects non-NFC normalization', () => {
    // U+0065 + U+0301 (combining acute) is the NFD form of é; NFC composes it.
    const report = analyzeFileBytes('nfd.md', utf8('café\n'));
    expect(report.notNfc).toBe(true);
  });
});

describe('reportFailsThreshold', () => {
  const clean = analyzeFileBytes('a.ts', utf8('clean\n'));
  const typographic = analyzeFileBytes('b.md', utf8('an — em dash\n'));
  const control = analyzeFileBytes('c.ts', utf8(`x${ESC}y\n`));

  it('passes a clean file at every threshold', () => {
    expect(reportFailsThreshold(clean, 'critical')).toBe(false);
    expect(reportFailsThreshold(clean, 'informational')).toBe(false);
  });

  it('does not fail a critical threshold on informational typographic findings', () => {
    expect(reportFailsThreshold(typographic, 'critical')).toBe(false);
    expect(reportFailsThreshold(typographic, 'informational')).toBe(true);
  });

  it('fails a critical threshold on a C0 control', () => {
    expect(reportFailsThreshold(control, 'critical')).toBe(true);
  });
});
