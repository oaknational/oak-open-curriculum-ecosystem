/**
 * Render coverage for the session-shape indicators: every shape combination
 * (unknown/solo/peer/directed × arc on/off × director/non-director own role),
 * the no-shape tick, the solo-vs-unknown distinction (a confident solo carries
 * its own marker; an unknown shape shows nothing), clean dropping of absent
 * indicator segments, and placement in both layouts — the no-logo two-line
 * layout (indicators on the coordination line) and the four-row Oak-mark layout
 * (indicators trailing the identity on row 0).
 */
import { describe, expect, it } from 'vitest';

import { OAK_LOGO_ROWS } from '../../src/claude/oak-logo';
import { renderStatusline, type StatuslineParts } from '../../src/claude/statusline-render';
import { type SessionShape } from '../../src/claude/statusline-session-shape';

const RESET = '[0m';
const DIM = '[2m';
const MAGENTA = '[0;35m';
const CYAN = '[0;36m';

const SEP = `${DIM} · ${RESET}`;

const COMPASS = '\u{1F9ED}';
const FAMILY = '\u{1F46A}';
const PEER = '\u{1F91D}';
const SOLO = '\u{1F9CD}';
const OBSERVING = `${DIM}\u{1F440}${RESET}`;
const FEATHER = '\u{1FAB6}';

function parts(sessionShape: SessionShape | undefined): StatuslineParts {
  return {
    identity: 'Monsoon guards Cirrus',
    dir: 'repo',
    branch: undefined,
    dirty: false,
    worktree: undefined,
    usedPercentage: undefined,
    model: undefined,
    sessionShape,
    coordinationBranch: undefined,
    coordinationPlace: undefined,
    error: undefined,
  };
}

function shape(overrides: Partial<SessionShape>): SessionShape {
  return { ownRole: undefined, teamShape: 'solo', arcActive: false, ...overrides };
}

const IDENTITY = `${MAGENTA}Monsoon guards Cirrus${RESET}`;
const PLACE = `${CYAN}repo${RESET}`;

describe('renderStatusline — session-shape indicators', () => {
  it('renders the solo marker for a confident solo session', () => {
    expect(renderStatusline(parts(shape({})))).toBe(`${IDENTITY}${SEP}${SOLO}\n${PLACE}`);
  });

  it('renders nothing for an unknown shape (unreadable registry)', () => {
    expect(renderStatusline(parts(shape({ teamShape: 'unknown' })))).toBe(`${IDENTITY}\n${PLACE}`);
  });

  it('renders nothing for an unresolved (undefined) shape', () => {
    expect(renderStatusline(parts(undefined))).toBe(`${IDENTITY}\n${PLACE}`);
  });

  it('distinguishes a confident solo from an unknown shape', () => {
    const solo = renderStatusline(parts(shape({})));
    const unknown = renderStatusline(parts(shape({ teamShape: 'unknown' })));

    expect(solo).not.toBe(unknown);
    expect(solo).toContain(SOLO);
    expect(unknown).not.toContain(SOLO);
  });

  it('renders the peer icon for a peer window', () => {
    expect(renderStatusline(parts(shape({ teamShape: 'peer' })))).toBe(
      `${IDENTITY}${SEP}${PEER}\n${PLACE}`,
    );
  });

  it('renders the dimmed eyes glyph for an observing non-member session', () => {
    expect(renderStatusline(parts(shape({ teamShape: 'observing' })))).toBe(
      `${IDENTITY}${SEP}${OBSERVING}\n${PLACE}`,
    );
  });

  it('renders the family icon for a directed window without my demark', () => {
    expect(renderStatusline(parts(shape({ teamShape: 'directed' })))).toBe(
      `${IDENTITY}${SEP}${FAMILY}\n${PLACE}`,
    );
  });

  it('suffixes the compass demark to the identity when I am the director', () => {
    expect(renderStatusline(parts(shape({ teamShape: 'directed', ownRole: 'director' })))).toBe(
      `${IDENTITY} ${COMPASS}${SEP}${FAMILY}\n${PLACE}`,
    );
  });

  it('shows no demark for a non-director own role', () => {
    expect(renderStatusline(parts(shape({ teamShape: 'peer', ownRole: 'curator' })))).toBe(
      `${IDENTITY}${SEP}${PEER}\n${PLACE}`,
    );
  });

  it('renders the solo marker and wing for a solo session with a live channel', () => {
    expect(renderStatusline(parts(shape({ arcActive: true })))).toBe(
      `${IDENTITY}${SEP}${SOLO} ${FEATHER}\n${PLACE}`,
    );
  });

  it('renders the wing alone for an unknown shape with a live channel', () => {
    expect(renderStatusline(parts(shape({ teamShape: 'unknown', arcActive: true })))).toBe(
      `${IDENTITY}${SEP}${FEATHER}\n${PLACE}`,
    );
  });

  it('renders peer icon and wing together', () => {
    expect(renderStatusline(parts(shape({ teamShape: 'peer', arcActive: true })))).toBe(
      `${IDENTITY}${SEP}${PEER} ${FEATHER}\n${PLACE}`,
    );
  });

  it('renders the dimmed eyes glyph and wing for an observing session with a live channel', () => {
    expect(renderStatusline(parts(shape({ teamShape: 'observing', arcActive: true })))).toBe(
      `${IDENTITY}${SEP}${OBSERVING} ${FEATHER}\n${PLACE}`,
    );
  });

  it('renders family icon and wing for a directed window I am not directing', () => {
    expect(renderStatusline(parts(shape({ teamShape: 'directed', arcActive: true })))).toBe(
      `${IDENTITY}${SEP}${FAMILY} ${FEATHER}\n${PLACE}`,
    );
  });

  it('renders the full directed-director-with-wing combination', () => {
    expect(
      renderStatusline(
        parts(shape({ teamShape: 'directed', ownRole: 'director', arcActive: true })),
      ),
    ).toBe(`${IDENTITY} ${COMPASS}${SEP}${FAMILY} ${FEATHER}\n${PLACE}`);
  });

  it('keeps indicators in the single-line layout, before the model segment', () => {
    const rendered = renderStatusline({
      ...parts(shape({ teamShape: 'peer', arcActive: true })),
      model: 'Fable 5',
      usedPercentage: 12,
      branch: 'feat/statusline-enhancements',
    });

    const indicatorsAt = rendered.indexOf(PEER);
    const modelAt = rendered.indexOf('Fable 5');
    const branchAt = rendered.indexOf('feat/statusline-enhancements');
    expect(indicatorsAt).toBeGreaterThan(-1);
    expect(indicatorsAt).toBeLessThan(modelAt);
    expect(modelAt).toBeLessThan(branchAt);
  });

  it('shows team indicators even when identity is unavailable', () => {
    const rendered = renderStatusline({
      ...parts(shape({ teamShape: 'peer' })),
      identity: undefined,
    });

    expect(rendered).toBe(`${PEER}\n${PLACE}`);
  });
});

describe('renderStatusline — session-shape indicators in the four-row layout', () => {
  // Raw ESC matches the renderer's GREEN byte-for-byte (same convention as the
  // RESET/DIM/MAGENTA/CYAN constants above).
  const GREEN = '[0;32m';
  const SEXTANT = OAK_LOGO_ROWS.sextant;
  const mark = (row: string): string => `${GREEN}${row}${RESET}`;
  const GAP = '  ';

  it('trails the indicators and demark on the identity row (full combo)', () => {
    const out = renderStatusline(
      parts(shape({ teamShape: 'directed', ownRole: 'director', arcActive: true })),
      { logo: 'sextant' },
    );
    expect(out.split('\n').slice(0, 4)).toEqual([
      `${mark(SEXTANT[0])}${GAP}${IDENTITY} ${COMPASS}${SEP}${FAMILY} ${FEATHER}`,
      mark(SEXTANT[1]),
      mark(SEXTANT[2]),
      `${mark(SEXTANT[3])}${GAP}${PLACE}`,
    ]);
  });

  it('shows the peer icon on the identity row with no demark for a peer window', () => {
    const out = renderStatusline(parts(shape({ teamShape: 'peer' })), { logo: 'sextant' });
    expect(out.split('\n')[0]).toBe(`${mark(SEXTANT[0])}${GAP}${IDENTITY}${SEP}${PEER}`);
  });

  it('shows the solo marker on the identity row for a confident solo session', () => {
    const out = renderStatusline(parts(shape({})), { logo: 'sextant' });
    expect(out.split('\n')[0]).toBe(`${mark(SEXTANT[0])}${GAP}${IDENTITY}${SEP}${SOLO}`);
  });

  it('leaves the identity row bare of indicators for an unknown shape', () => {
    const out = renderStatusline(parts(shape({ teamShape: 'unknown' })), { logo: 'sextant' });
    expect(out.split('\n')[0]).toBe(`${mark(SEXTANT[0])}${GAP}${IDENTITY}`);
  });

  it('renders the team icon alone on the identity row when identity is unavailable', () => {
    const out = renderStatusline(
      { ...parts(shape({ teamShape: 'peer' })), identity: undefined },
      { logo: 'sextant' },
    );
    expect(out.split('\n')[0]).toBe(`${mark(SEXTANT[0])}${GAP}${PEER}`);
  });
});
