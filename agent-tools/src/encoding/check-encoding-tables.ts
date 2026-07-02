/**
 * Codepoint classification tables for the encoding scanner.
 *
 * @remarks
 * Named bidi, zero-width, unusual-space, and typographic codepoints are held in
 * one table; control ranges and the replacement character are matched by range
 * checks in {@link classifyCodepoint}.
 *
 * @packageDocumentation
 */

import { type CodepointClass, type EncodingCategory } from './check-encoding-types.js';

/** C0 control codepoints that are legitimate in text: TAB, LF, CR. */
const ALLOWED_C0 = new Set<number>([0x09, 0x0a, 0x0d]);

/** Codepoints with a fixed category and human-readable name. */
const NAMED_CODEPOINTS: ReadonlyMap<number, readonly [EncodingCategory, string]> = new Map([
  // Bidirectional controls — Trojan-Source source-spoofing risk.
  [0x200e, ['bidi-control', 'LEFT-TO-RIGHT MARK']],
  [0x200f, ['bidi-control', 'RIGHT-TO-LEFT MARK']],
  [0x202a, ['bidi-control', 'LEFT-TO-RIGHT EMBEDDING']],
  [0x202b, ['bidi-control', 'RIGHT-TO-LEFT EMBEDDING']],
  [0x202c, ['bidi-control', 'POP DIRECTIONAL FORMATTING']],
  [0x202d, ['bidi-control', 'LEFT-TO-RIGHT OVERRIDE']],
  [0x202e, ['bidi-control', 'RIGHT-TO-LEFT OVERRIDE']],
  [0x2066, ['bidi-control', 'LEFT-TO-RIGHT ISOLATE']],
  [0x2067, ['bidi-control', 'RIGHT-TO-LEFT ISOLATE']],
  [0x2068, ['bidi-control', 'FIRST STRONG ISOLATE']],
  [0x2069, ['bidi-control', 'POP DIRECTIONAL ISOLATE']],
  // Zero-width and invisible format characters.
  [0x200b, ['zero-width', 'ZERO WIDTH SPACE']],
  [0x200c, ['zero-width', 'ZERO WIDTH NON-JOINER']],
  [0x200d, ['zero-width', 'ZERO WIDTH JOINER']],
  [0x2060, ['zero-width', 'WORD JOINER']],
  [0x180e, ['zero-width', 'MONGOLIAN VOWEL SEPARATOR']],
  [0xfeff, ['zero-width', 'ZERO WIDTH NO-BREAK SPACE']],
  // Unusual spaces — render as a space or nothing; copy-paste and diff hazards.
  [0x00a0, ['unusual-space', 'NO-BREAK SPACE']],
  [0x00ad, ['unusual-space', 'SOFT HYPHEN']],
  [0x1680, ['unusual-space', 'OGHAM SPACE MARK']],
  [0x2000, ['unusual-space', 'EN QUAD']],
  [0x2001, ['unusual-space', 'EM QUAD']],
  [0x2002, ['unusual-space', 'EN SPACE']],
  [0x2003, ['unusual-space', 'EM SPACE']],
  [0x2004, ['unusual-space', 'THREE-PER-EM SPACE']],
  [0x2005, ['unusual-space', 'FOUR-PER-EM SPACE']],
  [0x2006, ['unusual-space', 'SIX-PER-EM SPACE']],
  [0x2007, ['unusual-space', 'FIGURE SPACE']],
  [0x2008, ['unusual-space', 'PUNCTUATION SPACE']],
  [0x2009, ['unusual-space', 'THIN SPACE']],
  [0x200a, ['unusual-space', 'HAIR SPACE']],
  [0x202f, ['unusual-space', 'NARROW NO-BREAK SPACE']],
  [0x205f, ['unusual-space', 'MEDIUM MATHEMATICAL SPACE']],
  [0x3000, ['unusual-space', 'IDEOGRAPHIC SPACE']],
  // Typographic punctuation — valid and usually intentional; informational only.
  [0x2018, ['typographic', 'LEFT SINGLE QUOTATION MARK']],
  [0x2019, ['typographic', 'RIGHT SINGLE QUOTATION MARK']],
  [0x201a, ['typographic', 'SINGLE LOW-9 QUOTATION MARK']],
  [0x201b, ['typographic', 'SINGLE HIGH-REVERSED-9 QUOTATION MARK']],
  [0x201c, ['typographic', 'LEFT DOUBLE QUOTATION MARK']],
  [0x201d, ['typographic', 'RIGHT DOUBLE QUOTATION MARK']],
  [0x201e, ['typographic', 'DOUBLE LOW-9 QUOTATION MARK']],
  [0x2010, ['typographic', 'HYPHEN']],
  [0x2011, ['typographic', 'NON-BREAKING HYPHEN']],
  [0x2012, ['typographic', 'FIGURE DASH']],
  [0x2013, ['typographic', 'EN DASH']],
  [0x2014, ['typographic', 'EM DASH']],
  [0x2015, ['typographic', 'HORIZONTAL BAR']],
  [0x2026, ['typographic', 'HORIZONTAL ELLIPSIS']],
  [0x2032, ['typographic', 'PRIME']],
  [0x2033, ['typographic', 'DOUBLE PRIME']],
  [0x00ab, ['typographic', 'LEFT-POINTING DOUBLE ANGLE QUOTATION MARK']],
  [0x00bb, ['typographic', 'RIGHT-POINTING DOUBLE ANGLE QUOTATION MARK']],
  [0x2039, ['typographic', 'SINGLE LEFT-POINTING ANGLE QUOTATION MARK']],
  [0x203a, ['typographic', 'SINGLE RIGHT-POINTING ANGLE QUOTATION MARK']],
]);

/** Names for the C0/C1 control codepoints most likely to appear by accident. */
const CONTROL_NAMES: ReadonlyMap<number, string> = new Map([
  [0x07, 'BELL'],
  [0x08, 'BACKSPACE'],
  [0x0b, 'LINE TABULATION'],
  [0x0c, 'FORM FEED'],
  [0x1b, 'ESCAPE'],
  [0x1c, 'INFORMATION SEPARATOR FOUR'],
  [0x1d, 'INFORMATION SEPARATOR THREE'],
  [0x1e, 'INFORMATION SEPARATOR TWO'],
  [0x1f, 'INFORMATION SEPARATOR ONE'],
]);

function controlName(cp: number): string {
  return CONTROL_NAMES.get(cp) ?? `CONTROL U+${cp.toString(16).toUpperCase().padStart(4, '0')}`;
}

/**
 * Classify one Unicode codepoint, returning its finding category and a
 * human-readable name, or `null` when the codepoint is ordinary text.
 */
export function classifyCodepoint(cp: number): CodepointClass | null {
  if (cp === 0xfffd) {
    return { category: 'replacement-char', name: 'REPLACEMENT CHARACTER' };
  }
  const named = NAMED_CODEPOINTS.get(cp);
  if (named !== undefined) {
    return { category: named[0], name: named[1] };
  }
  if (cp < 0x20 && !ALLOWED_C0.has(cp)) {
    return { category: 'c0-control', name: controlName(cp) };
  }
  if (cp === 0x7f) {
    return { category: 'c1-control', name: 'DELETE' };
  }
  if (cp >= 0x80 && cp <= 0x9f) {
    return { category: 'c1-control', name: controlName(cp) };
  }
  return null;
}
