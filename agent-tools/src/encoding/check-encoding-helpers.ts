/**
 * Pure, byte-level detection helpers for the repository encoding scanner:
 * UTF-8 validity, byte-order marks, binary classification, codepoint scanning,
 * normalization-form, and severity roll-up. All functions operate on bytes or
 * decoded strings (never a pre-decoded string from disk, which would replace
 * invalid sequences with U+FFFD and mask the defect), so detection is
 * unit-testable in isolation from file I/O.
 *
 * @packageDocumentation
 */

import { classifyCodepoint } from './check-encoding-tables.js';
import {
  SEVERITY_BY_CATEGORY,
  SEVERITY_ORDER,
  type BomKind,
  type CodepointFinding,
  type EncodingCategory,
  type EncodingSeverity,
  type FileEncodingReport,
  type InvalidUtf8,
} from './check-encoding-types.js';

interface Utf8Sequence {
  readonly continuationCount: number;
  readonly minCodepoint: number;
  readonly initial: number;
}

/** Decode a UTF-8 lead byte into its sequence shape, or `null` if not a valid lead. */
function leadByteSequence(lead: number): Utf8Sequence | null {
  if (lead >= 0xc2 && lead <= 0xdf) {
    return { continuationCount: 1, minCodepoint: 0x80, initial: lead & 0x1f };
  }
  if (lead >= 0xe0 && lead <= 0xef) {
    return { continuationCount: 2, minCodepoint: 0x800, initial: lead & 0x0f };
  }
  if (lead >= 0xf0 && lead <= 0xf4) {
    return { continuationCount: 3, minCodepoint: 0x10000, initial: lead & 0x07 };
  }
  return null;
}

function isContinuationByte(byte: number | undefined): byte is number {
  return byte !== undefined && byte >= 0x80 && byte <= 0xbf;
}

function isValidCodepoint(codepoint: number, minCodepoint: number): boolean {
  const isSurrogate = codepoint >= 0xd800 && codepoint <= 0xdfff;
  return codepoint >= minCodepoint && codepoint <= 0x10ffff && !isSurrogate;
}

/** Decode the codepoint of a sequence at `index`, or `null` if the bytes are invalid. */
function decodeSequenceAt(bytes: Uint8Array, index: number, sequence: Utf8Sequence): number | null {
  let codepoint = sequence.initial;
  for (let offset = 1; offset <= sequence.continuationCount; offset += 1) {
    const continuation = bytes[index + offset];
    if (!isContinuationByte(continuation)) {
      return null;
    }
    codepoint = (codepoint << 6) | (continuation & 0x3f);
  }
  return isValidCodepoint(codepoint, sequence.minCodepoint) ? codepoint : null;
}

function invalidAt(bytes: Uint8Array, index: number): InvalidUtf8 {
  const badBytes = Array.from(bytes.subarray(index, index + 4), (byte) =>
    byte.toString(16).toUpperCase().padStart(2, '0'),
  ).join(' ');
  return { bytePosition: index, badBytes };
}

/**
 * Find the first byte offset at which `bytes` ceases to be valid UTF-8, or
 * `null` when the whole buffer is strictly valid.
 *
 * @remarks
 * Strict means: rejects lone continuation bytes, truncated sequences, overlong
 * encodings, UTF-16 surrogate codepoints, and anything above U+10FFFF — the same
 * rigor as a fatal `TextDecoder` or Python's strict decoder. ASCII is a subset of
 * UTF-8 and passes.
 */
export function findFirstInvalidUtf8(bytes: Uint8Array): InvalidUtf8 | null {
  let index = 0;
  while (index < bytes.length) {
    const lead = bytes[index];
    if (lead === undefined) {
      break;
    }
    if (lead <= 0x7f) {
      index += 1;
      continue;
    }
    const sequence = leadByteSequence(lead);
    if (sequence === null || decodeSequenceAt(bytes, index, sequence) === null) {
      return invalidAt(bytes, index);
    }
    index += sequence.continuationCount + 1;
  }
  return null;
}

function startsWith(bytes: Uint8Array, prefix: readonly number[]): boolean {
  return bytes.length >= prefix.length && prefix.every((byte, offset) => bytes[offset] === byte);
}

/** Detect a leading byte-order mark, or `null` when none is present. */
export function detectBom(bytes: Uint8Array): BomKind | null {
  if (startsWith(bytes, [0xef, 0xbb, 0xbf])) {
    return 'utf8';
  }
  if (
    startsWith(bytes, [0x00, 0x00, 0xfe, 0xff]) ||
    startsWith(bytes, [0xff, 0xfe]) ||
    startsWith(bytes, [0xfe, 0xff])
  ) {
    return 'utf16-utf32';
  }
  return null;
}

/** A binary file is one containing a NUL byte; never treated as a UTF-8 violation. */
export function isBinary(bytes: Uint8Array): boolean {
  return bytes.includes(0x00);
}

/**
 * Scan decoded, valid-UTF-8 text for non-standard codepoints, tracking 1-based
 * line and column. Iterates by Unicode codepoint, so astral characters (emoji)
 * are counted once and never mistaken for a lone surrogate.
 */
export function scanText(text: string): CodepointFinding[] {
  const findings: CodepointFinding[] = [];
  let line = 1;
  let column = 0;
  for (const char of text) {
    if (char === '\n') {
      line += 1;
      column = 0;
      continue;
    }
    column += 1;
    const cp = char.codePointAt(0);
    if (cp === undefined) {
      continue;
    }
    const classified = classifyCodepoint(cp);
    if (classified === null) {
      continue;
    }
    findings.push({
      category: classified.category,
      codepoint: `U+${cp.toString(16).toUpperCase().padStart(4, '0')}`,
      name: classified.name,
      line,
      column,
    });
  }
  return findings;
}

const UTF8_BOM_LENGTH = 3;

/**
 * Analyse one file's raw bytes into a {@link FileEncodingReport}.
 *
 * @param filePath - repo-relative path, used only for labelling.
 * @param bytes - the file's raw bytes (never a pre-decoded string).
 */
export function analyzeFileBytes(filePath: string, bytes: Uint8Array): FileEncodingReport {
  const bom = detectBom(bytes);
  const base = { path: filePath, bom } as const;

  if (isBinary(bytes)) {
    return { ...base, isBinary: true, invalidUtf8: null, notNfc: false, findings: [] };
  }
  // A UTF-16/32 BOM means the file is not UTF-8 by construction; report the BOM
  // and do not also report the (expected) UTF-8 decode failure.
  if (bom === 'utf16-utf32') {
    return { ...base, isBinary: false, invalidUtf8: null, notNfc: false, findings: [] };
  }

  const body = bom === 'utf8' ? bytes.subarray(UTF8_BOM_LENGTH) : bytes;
  const invalidUtf8 = findFirstInvalidUtf8(body);
  if (invalidUtf8 !== null) {
    return { ...base, isBinary: false, invalidUtf8, notNfc: false, findings: [] };
  }

  const text = new TextDecoder('utf-8', { fatal: false, ignoreBOM: true }).decode(body);
  return {
    ...base,
    isBinary: false,
    invalidUtf8: null,
    notNfc: text.normalize('NFC') !== text,
    findings: scanText(text),
  };
}

/** Count each finding category present in a report (the single source for tallies). */
export function reportCategoryCounts(report: FileEncodingReport): Map<EncodingCategory, number> {
  const counts = new Map<EncodingCategory, number>();
  const bump = (category: EncodingCategory): void => {
    counts.set(category, (counts.get(category) ?? 0) + 1);
  };
  if (report.invalidUtf8 !== null) {
    bump('invalid-utf8');
  }
  if (report.bom === 'utf8') {
    bump('utf8-bom');
  }
  if (report.bom === 'utf16-utf32') {
    bump('utf16-utf32-bom');
  }
  if (report.notNfc) {
    bump('non-nfc');
  }
  for (const finding of report.findings) {
    bump(finding.category);
  }
  return counts;
}

/**
 * Whether a report has a finding at or above a severity threshold — the gate
 * predicate for `--fail-on`.
 */
export function reportFailsThreshold(
  report: FileEncodingReport,
  threshold: EncodingSeverity,
): boolean {
  const present = new Set<EncodingSeverity>(
    [...reportCategoryCounts(report).keys()].map((category) => SEVERITY_BY_CATEGORY[category]),
  );
  const thresholdRank = SEVERITY_ORDER.indexOf(threshold);
  return SEVERITY_ORDER.some((severity, rank) => rank <= thresholdRank && present.has(severity));
}
