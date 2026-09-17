/**
 * Unit tests for the identity-naming validator's input boundaries.
 *
 * @remarks
 * These are the gate's two untrusted inputs. Every rejection is proved here
 * rather than through the CLI, so a malformed census or a mistyped invocation
 * is a named failure instead of a process that happened to exit non-zero.
 *
 * No fixture needs the forbidden token — census rows are keyed by path, and
 * the schema never reads file contents — so these fixtures carry none, and the
 * gate that guards this very file stays satisfied without any weakening.
 */

import { unwrap, unwrapErr } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { type CensusEntry } from './validate-identity-naming-census.js';
import {
  findBreakdownSumMismatches,
  parseCensusText,
  parseIdentityNamingArgv,
  selectCensusMode,
  type CensusBreakdownRow,
  type CensusFileRow,
} from './validate-identity-naming-io.js';

const ZERO = { name: 0, initialismUpper: 0, initialismLower: 0 };

/** One well-formed breakdown slice accounting for `count` occurrences. */
function slice(count: number): CensusBreakdownRow {
  return {
    mappingRole: 'd1-table',
    contextKind: 'mixed',
    dispositionClass: 'rename-in-place',
    count,
  };
}

/** A well-formed census row: `name` occurrences with a matching breakdown. */
function validRow(file: string, name = 1): CensusFileRow {
  return { file, kind: 'content', countByVariant: { ...ZERO, name }, breakdown: [slice(name)] };
}

/** A whole census file as text, wrapping the given rows. */
function censusText(entries: readonly unknown[]): string {
  return JSON.stringify({ $comment: 'the ratchet contract', generated: '2026-08-03', entries });
}

/** Parse and return the rejection message, failing loud on an unexpected pass. */
function rejectionMessage(entries: readonly unknown[]): string {
  return unwrapErr(parseCensusText({ label: 'census', text: censusText(entries) })).message;
}

describe('parseCensusText', () => {
  it('accepts a well-formed census, keeping the breakdown rows', () => {
    const rows = unwrap(parseCensusText({ label: 'census', text: censusText([validRow('a.md')]) }));

    expect(rows).toStrictEqual([validRow('a.md')]);
  });

  it('rejects text that is not JSON at all', () => {
    const failure = unwrapErr(parseCensusText({ label: 'census', text: 'not json {' }));

    expect(failure.message).toContain('not valid JSON');
  });

  it('rejects an unrecognised key on a row — strict at every object level', () => {
    expect(rejectionMessage([{ ...validRow('a.md'), note: 'why this row exists' }])).toContain(
      'note',
    );
  });

  it('rejects an unrecognised key at the census top level', () => {
    const text = JSON.stringify({ generated: '2026-08-03', entries: [], extra: true });

    expect(unwrapErr(parseCensusText({ label: 'census', text })).message).toContain('extra');
  });

  it('rejects a missing `generated` date', () => {
    const text = JSON.stringify({ entries: [] });

    expect(unwrapErr(parseCensusText({ label: 'census', text })).message).toContain('generated');
  });

  it('rejects a negative count', () => {
    expect(
      rejectionMessage([{ ...validRow('a.md'), countByVariant: { ...ZERO, name: -1 } }]),
    ).toContain('countByVariant.name');
  });

  it('rejects a non-integer count', () => {
    expect(
      rejectionMessage([{ ...validRow('a.md'), countByVariant: { ...ZERO, name: 1.5 } }]),
    ).toContain('countByVariant.name');
  });

  it('rejects an empty file path', () => {
    expect(rejectionMessage([validRow('')])).toContain('entries[0].file');
  });

  it('rejects a row with no breakdown — provenance is part of the contract', () => {
    const row = { file: 'a.md', kind: 'content', countByVariant: { ...ZERO, name: 1 } };

    expect(rejectionMessage([row])).toContain('breakdown');
  });

  it('rejects a breakdown whose counts do not sum to the row total', () => {
    expect(rejectionMessage([{ ...validRow('a.md', 3), breakdown: [slice(2)] }])).toContain(
      'do not sum',
    );
  });

  it('rejects duplicate (kind, file) rows — one cell, one contract', () => {
    const message = rejectionMessage([validRow('a.md'), validRow('a.md', 2)]);

    expect(message).toContain('duplicate');
    expect(message).toContain('content a.md');
  });

  it('accepts the same file under both kinds — path and content are distinct cells', () => {
    const rows = unwrap(
      parseCensusText({
        label: 'census',
        text: censusText([validRow('a.md'), { ...validRow('a.md'), kind: 'path' }]),
      }),
    );

    expect(rows.map((row) => row.kind)).toStrictEqual(['content', 'path']);
  });
});

describe('findBreakdownSumMismatches', () => {
  it('sums across all three case variants, not just the name leg', () => {
    const counts = { name: 1, initialismUpper: 2, initialismLower: 3 };
    const matching: CensusFileRow = {
      file: 'a.css',
      kind: 'content',
      countByVariant: counts,
      breakdown: [slice(6)],
    };

    expect(findBreakdownSumMismatches([matching])).toStrictEqual([]);
    expect(findBreakdownSumMismatches([{ ...matching, breakdown: [slice(5)] }])).toStrictEqual([
      { file: 'a.css', kind: 'content', variantTotal: 6, breakdownTotal: 5 },
    ]);
  });
});

describe('selectCensusMode', () => {
  it('is strict when the census file is absent', () => {
    expect(selectCensusMode(undefined)).toStrictEqual({ mode: 'strict' });
  });

  it('is strict when the census is empty — the end state is due', () => {
    expect(selectCensusMode([])).toStrictEqual({ mode: 'strict' });
  });

  it('is ratchet when rows exist, carrying them as the contract', () => {
    const census: readonly CensusEntry[] = [validRow('a.md')];

    expect(selectCensusMode(census)).toStrictEqual({ mode: 'ratchet', census });
  });
});

describe('parseIdentityNamingArgv', () => {
  it('defaults to the verdict-only invocation with no arguments', () => {
    expect(unwrap(parseIdentityNamingArgv([]))).toStrictEqual({ printCounts: false });
  });

  it('accepts --print-counts', () => {
    expect(unwrap(parseIdentityNamingArgv(['--print-counts']))).toStrictEqual({
      printCounts: true,
    });
  });

  it('rejects any other argument, naming it', () => {
    expect(unwrapErr(parseIdentityNamingArgv(['--print-count']))).toContain('--print-count');
    expect(unwrapErr(parseIdentityNamingArgv(['--print-counts', 'extra']))).toContain('extra');
  });
});
