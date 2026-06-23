import { describe, expect, it } from 'vitest';

import {
  countLiveItems,
  LIVE_ITEM_STATUSES,
  parseRegisterItems,
  TERMINAL_ITEM_STATUSES,
  validateRegisterItems,
} from './item-count.js';

const ENTRY = (status: string): string =>
  `- **a candidate title**\n  \`[captured: 2026-06-16 | source: a napkin entry | target: a rule | trigger: a second instance | size: S | status: ${status}]\``;

describe('parseRegisterItems', () => {
  it('extracts the fields of a single inline-bracket entry, including status', () => {
    const [item] = parseRegisterItems(ENTRY('pending'));
    expect(item.fields.captured).toBe('2026-06-16');
    expect(item.fields.source).toBe('a napkin entry');
    expect(item.fields.target).toBe('a rule');
    expect(item.fields.trigger).toBe('a second instance');
    expect(item.fields.size).toBe('S');
    expect(item.status).toBe('pending');
  });

  it('parses an entry whose bracket block wraps across several physical lines', () => {
    const wrapped = [
      '  `[captured: 2026-06-12 | source: Cosmos + Moss napkin entries',
      '  | target: build-system investigation lane | trigger: a third lane hits a',
      '  non-reproducing pre-push failure | size: M',
      '  | status: pending]`',
    ].join('\n');
    const [item] = parseRegisterItems(wrapped);
    expect(item.fields.captured).toBe('2026-06-12');
    expect(item.fields.size).toBe('M');
    expect(item.status).toBe('pending');
  });

  it('parses every entry when several are present', () => {
    const content = `${ENTRY('pending')}\n\n${ENTRY('due')}\n\n${ENTRY('graduated')}`;
    expect(parseRegisterItems(content)).toHaveLength(3);
  });

  it('does not parse an entry inside a fenced code block (a documented example is not live debt)', () => {
    const content = ['```text', ENTRY('pending'), '```'].join('\n');
    expect(parseRegisterItems(content)).toHaveLength(0);
  });
});

describe('countLiveItems', () => {
  it('counts only live items and excludes terminal dispositions', () => {
    const items = parseRegisterItems(
      [
        ENTRY('pending'),
        ENTRY('due'),
        ENTRY('overdue'),
        ENTRY('graduated'),
        ENTRY('rejected'),
      ].join('\n\n'),
    );
    // 3 live (pending, due, overdue); 2 terminal (graduated, rejected) excluded.
    expect(countLiveItems(items).total).toBe(3);
  });

  it('reports the live count broken down by status', () => {
    const items = parseRegisterItems(
      [ENTRY('pending'), ENTRY('pending'), ENTRY('due'), ENTRY('graduated')].join('\n\n'),
    );
    expect(countLiveItems(items).byStatus).toEqual({ pending: 2, due: 1, overdue: 0 });
  });

  it('partitions the status vocabulary: live and terminal are disjoint and together exhaust it', () => {
    const all = [...LIVE_ITEM_STATUSES, ...TERMINAL_ITEM_STATUSES];
    expect(new Set(all).size).toBe(all.length);
    expect(all).toHaveLength(6);
  });

  it('counts an entry whose status carries a trailing annotation as live (the inversion guard: debt cannot be hidden by annotating the status)', () => {
    const items = parseRegisterItems(ENTRY('pending — see the note below'));
    expect(countLiveItems(items).total).toBe(1);
    expect(countLiveItems(items).byStatus.pending).toBe(1);
  });

  it('does not count a terminal status carrying a trailing annotation as live (the inversion guard: a disposition cannot be undone by annotating it)', () => {
    const items = parseRegisterItems(ENTRY('graduated — reconsider next cycle'));
    expect(countLiveItems(items).total).toBe(0);
  });
});

describe('validateRegisterItems', () => {
  it('returns no findings for a conformant entry', () => {
    expect(validateRegisterItems(ENTRY('pending'))).toEqual([]);
  });

  it('rejects an owner-gated status as its own finding kind', () => {
    const findings = validateRegisterItems(ENTRY('owner-gated'));
    expect(findings).toHaveLength(1);
    expect(findings[0].kind).toBe('owner-gated-status');
  });

  it('rejects an unknown status that is not owner-gated', () => {
    const findings = validateRegisterItems(ENTRY('parked'));
    expect(findings).toHaveLength(1);
    expect(findings[0].kind).toBe('unknown-status');
  });

  it('flags an annotated owner-gated status with the owner-gated finding kind', () => {
    const findings = validateRegisterItems(ENTRY('owner-gated 2026-06-02 — keep until recurrence'));
    expect(findings).toHaveLength(1);
    expect(findings[0].kind).toBe('owner-gated-status');
  });

  it('flags an annotated live status as non-conformant — the status must be a bare enum token', () => {
    const findings = validateRegisterItems(ENTRY('pending — see the note below'));
    expect(findings).toHaveLength(1);
    expect(findings[0].kind).toBe('unknown-status');
  });

  it('rejects an inline entry missing a required field as malformed', () => {
    const missingTrigger = `- **t**\n  \`[captured: 2026-06-16 | source: s | target: r | size: S | status: pending]\``;
    const findings = validateRegisterItems(missingTrigger);
    expect(findings).toHaveLength(1);
    expect(findings[0].kind).toBe('malformed');
  });

  it('rejects a legacy block-format entry as malformed', () => {
    const legacy = [
      '## A candidate',
      '',
      '- **captured-date**: 2026-06-03',
      '- **source-surface**: a napkin entry',
      '- **graduation-target**: a rule',
      '- **trigger-condition**: a second instance',
      '- **status**: pending',
    ].join('\n');
    const findings = validateRegisterItems(legacy);
    expect(findings).toHaveLength(1);
    expect(findings[0].kind).toBe('malformed');
  });

  it('flags a fenced bare-pipe entry with a known status as malformed (it is silently uncounted otherwise)', () => {
    const fencedBare = [
      '- **a candidate title**',
      '',
      '  ```text',
      '  captured: 2026-06-21 | source: a napkin entry | target: a rule | trigger: a second instance | size: S | status: pending',
      '  ```',
    ].join('\n');
    const findings = validateRegisterItems(fencedBare);
    expect(findings).toHaveLength(1);
    expect(findings[0].kind).toBe('malformed');
  });

  it('flags a bare unwrapped entry (no fence, no bracket) with a known status as malformed', () => {
    const bare = [
      '- **a candidate title**',
      '  captured: 2026-06-21 | source: s | target: r | trigger: t | size: S | status: due',
    ].join('\n');
    const findings = validateRegisterItems(bare);
    expect(findings).toHaveLength(1);
    expect(findings[0].kind).toBe('malformed');
  });

  it('does not flag a fenced canonical bracket block — a documented example is not a malformed entry', () => {
    const fencedCanonical = ['```text', ENTRY('pending'), '```'].join('\n');
    expect(validateRegisterItems(fencedCanonical)).toEqual([]);
  });

  it('does not flag a bare block whose status is a placeholder, not a known enum', () => {
    const placeholder = [
      '- **schema example**',
      '  captured: <date> | source: <text> | target: <text> | trigger: <text> | size: <S/M/L> | status: <enum>',
    ].join('\n');
    expect(validateRegisterItems(placeholder)).toEqual([]);
  });
});
