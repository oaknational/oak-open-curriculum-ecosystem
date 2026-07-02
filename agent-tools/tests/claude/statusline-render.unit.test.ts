import { BRAILLE_SHARP_FRAMES, OAK_LOGO_ROWS } from '../../src/claude/oak-logo';
import { renderStatusline, type StatuslineParts } from '../../src/claude/statusline-render';

const RESET = '\x1b[0m';
const GREEN = '\x1b[0;32m';
const RED = '\x1b[0;31m';
const YELLOW = '\x1b[0;33m';

const base: StatuslineParts = {
  identity: undefined,
  dir: 'repo',
  branch: undefined,
  dirty: false,
  worktree: undefined,
  usedPercentage: undefined,
  fiveHourPercentage: undefined,
  fiveHourResetSeconds: undefined,
  sevenDayPercentage: undefined,
  sevenDayResetSeconds: undefined,
  model: undefined,
  sessionShape: undefined,
  coordinationBranch: undefined,
  coordinationPlace: undefined,
  error: undefined,
};

/** The rendered line containing a needle — the unit of behaviour, independent of row geometry. */
const lineWith = (out: string, needle: string): string =>
  out.split('\n').find((line) => line.includes(needle)) ?? '';
/** The index of the line containing a needle, for proving relative order without pinning positions. */
const lineIndexOf = (out: string, needle: string): number =>
  out.split('\n').findIndex((line) => line.includes(needle));
/** Strip ANSI colour codes to assert on the visible text, not the colouring. */
const ANSI_CODE = new RegExp(String.raw`${String.fromCharCode(27)}\[[0-9;]*m`, 'g');
const stripAnsi = (text: string): string => text.replaceAll(ANSI_CODE, '');

describe('renderStatusline — model and context', () => {
  // Behaviour, not row index: model and context belong on one line, in either layout.
  it.each(['none', 'sextant'] as const)(
    'renders the model and the context percentage on the same line (%s layout)',
    (logo) => {
      const out = renderStatusline(
        { ...base, model: 'Opus 4.8', usedPercentage: 38, branch: 'main' },
        { logo },
      );
      expect(lineWith(out, 'Opus 4.8')).toContain('ctx:38%');
    },
  );
});

describe('renderStatusline — primary checkout', () => {
  it('shows the checkout name on a line above its branch, with no coordination label', () => {
    const out = renderStatusline({
      ...base,
      dir: 'oak-open-curriculum-ecosystem',
      branch: 'docs/consolidations',
    });
    expect(lineIndexOf(out, 'oak-open-curriculum-ecosystem')).toBeLessThan(
      lineIndexOf(out, 'docs/consolidations'),
    );
    expect(lineWith(out, 'oak-open-curriculum-ecosystem')).not.toContain('docs/consolidations');
    expect(out).not.toContain('coord:');
    expect(out).not.toContain('πρ');
  });

  it('marks the branch when the working tree is dirty, and not when it is clean', () => {
    expect(lineWith(renderStatusline({ ...base, branch: 'main', dirty: true }), 'main')).toContain(
      '*',
    );
    expect(renderStatusline({ ...base, branch: 'main', dirty: false })).not.toContain('*');
  });

  it('shows just the directory outside a repository', () => {
    const out = renderStatusline({ ...base, dir: 'repo' });
    expect(out).toContain('repo');
    expect(out).not.toContain('\n');
    expect(out).not.toContain('coord:');
  });
});

describe('renderStatusline — linked worktree', () => {
  const worktree: StatuslineParts = {
    ...base,
    dir: 'oak-wt-eef',
    branch: 'feat/eef-explore-evidence',
    dirty: true,
    worktree: 'oak-wt-eef',
    coordinationBranch: 'coordination/worktree-pilot',
    coordinationPlace: 'oak-open-curriculum-ecosystem',
  };

  it('labels the primary branch coord: and shows the worktree branch and name separately', () => {
    const out = renderStatusline(worktree);
    expect(lineWith(out, 'coordination/worktree-pilot')).toContain('coord:');
    const worktreeLine = lineWith(out, 'feat/eef-explore-evidence');
    expect(worktreeLine).toContain('oak-wt-eef');
    expect(worktreeLine).not.toContain('coord:');
    expect(out).toContain('oak-open-curriculum-ecosystem');
  });

  it('orders the coordination branch before the worktree', () => {
    const out = renderStatusline(worktree);
    expect(lineIndexOf(out, 'coordination/worktree-pilot')).toBeLessThan(
      lineIndexOf(out, 'feat/eef-explore-evidence'),
    );
  });

  it('puts the dirty mark on the worktree branch, not the coordination branch', () => {
    const out = renderStatusline(worktree);
    expect(lineWith(out, 'feat/eef-explore-evidence')).toContain('*');
    expect(lineWith(out, 'coordination/worktree-pilot')).not.toContain('*');
  });

  it('still shows the coordination branch and worktree when the primary name is deduped away', () => {
    const out = renderStatusline({
      ...worktree,
      coordinationBranch: 'main',
      coordinationPlace: undefined,
    });
    expect(lineWith(out, 'main')).toContain('coord:');
    expect(out).toContain('feat/eef-explore-evidence');
  });
});

describe('renderStatusline — error and context usage', () => {
  it('surfaces a loud error token as the leading line and never swallows it', () => {
    const out = renderStatusline({
      ...base,
      branch: undefined,
      error: 'branch unresolved: fatal: bad object HEAD',
    });
    expect(out.split('\n')[0]).toContain('⚠');
    expect(out.split('\n')[0]).toContain('branch unresolved: fatal: bad object HEAD');
  });

  it('colours context usage green below 50%, yellow from 50%, red from 70%', () => {
    expect(renderStatusline({ ...base, usedPercentage: 12.6 })).toContain(
      `${GREEN}ctx:13%${RESET}`,
    );
    expect(renderStatusline({ ...base, usedPercentage: 50 })).toContain(`${YELLOW}ctx:50%${RESET}`);
    expect(renderStatusline({ ...base, usedPercentage: 70 })).toContain(`${RED}ctx:70%${RESET}`);
  });

  it('omits the context segment when usage is absent', () => {
    expect(renderStatusline({ ...base, usedPercentage: undefined })).not.toContain('ctx:');
  });
});

describe('renderStatusline — Claude.ai rate-limit gauges', () => {
  it('shows the session (s) and week (w) consumed percentages with reset countdowns on the identity row', () => {
    const out = renderStatusline({
      ...base,
      identity: 'Wyvern mends Draught',
      fiveHourPercentage: 33,
      fiveHourResetSeconds: 2 * 3600 + 14 * 60,
      sevenDayPercentage: 55,
      sevenDayResetSeconds: 3 * 86400,
      branch: 'main',
    });
    const topRow = stripAnsi(lineWith(out, 'Wyvern mends Draught'));
    expect(topRow).toContain('s:33%(2h)');
    expect(topRow).toContain('w:55%(3d)');
  });

  it('places the gauges after the collaboration icons and before the model', () => {
    const solo = '\u{1F9CD}';
    const out = renderStatusline({
      ...base,
      identity: 'Wyvern mends Draught',
      sessionShape: { ownRole: undefined, teamShape: 'solo', arcActive: false },
      fiveHourPercentage: 23,
      model: 'Opus 4.8',
    });
    expect(out.indexOf(solo)).toBeLessThan(out.indexOf('s:'));
    expect(out.indexOf('s:')).toBeLessThan(out.indexOf('Opus 4.8'));
  });

  it('colour-ramps the percentage the same way as context usage', () => {
    expect(renderStatusline({ ...base, fiveHourPercentage: 80 })).toContain(`${RED}s:80%${RESET}`);
  });

  it('omits the countdown when a window has no reset instant', () => {
    const out = renderStatusline({ ...base, fiveHourPercentage: 33 });
    expect(out).toContain('s:33%');
    expect(out).not.toContain('(');
  });

  it('renders only the window that is present', () => {
    const out = renderStatusline({ ...base, fiveHourPercentage: 23 });
    expect(out).toContain('s:23%');
    expect(out).not.toContain('w:');
  });

  it('shows no gauges when both windows are absent', () => {
    expect(renderStatusline({ ...base, branch: 'main' })).not.toContain('s:');
  });
});

describe('renderStatusline — Oak logo column mechanism', () => {
  it('renders every logo row and drops no location fact, even past the logo height', () => {
    // A worktree has three location rows; with a four-row logo the last lands
    // beyond the mark and must still render rather than being dropped.
    const out = renderStatusline(
      {
        ...base,
        dir: 'oak-wt-eef',
        branch: 'feat/eef',
        worktree: 'oak-wt-eef',
        coordinationBranch: 'coordination/pilot',
        coordinationPlace: 'oak-open-curriculum-ecosystem',
      },
      { logo: 'sextant' },
    );
    for (const row of OAK_LOGO_ROWS.sextant) {
      expect(out).toContain(row);
    }
    expect(out).toContain('coord:');
    expect(out).toContain('feat/eef');
  });

  it('spans the separator rule to the active logo width, on by default', () => {
    for (const style of ['sextant', 'braille'] as const) {
      const lines = renderStatusline({ ...base, dir: 'repo' }, { logo: style }).split('\n');
      const ruleRow = (lines.at(-1) ?? '').replaceAll('\x1b[2m', '').replaceAll(RESET, '');
      expect([...ruleRow]).toHaveLength([...OAK_LOGO_ROWS[style][0]].length);
    }
  });

  it('tiles a caller-supplied rule glyph across the logo width', () => {
    const probe = '=';
    const lines = renderStatusline(
      { ...base, dir: 'repo' },
      { logo: 'sextant', logoSeparator: probe },
    ).split('\n');
    const ruleRow = (lines.at(-1) ?? '').replaceAll('\x1b[2m', '').replaceAll(RESET, '');
    expect([...ruleRow]).toEqual(
      Array.from({ length: [...OAK_LOGO_ROWS.sextant[0]].length }, () => probe),
    );
  });

  it('suppresses the separator rule when given an empty glyph', () => {
    const lines = renderStatusline(
      { ...base, dir: 'repo' },
      { logo: 'sextant', logoSeparator: '' },
    ).split('\n');
    expect(lines).toHaveLength(OAK_LOGO_ROWS.sextant.length);
    expect(lines.join('\n')).toContain('repo');
  });

  it('omits the separator row in the no-logo layout', () => {
    expect(renderStatusline({ ...base, dir: 'repo' }, { logoSeparator: '<<sep>>' })).not.toContain(
      '<<sep>>',
    );
  });

  it('renders no logo glyphs in the no-logo layout', () => {
    const out = renderStatusline({ ...base, dir: 'repo', model: 'Opus 4.8' }, { logo: 'none' });
    expect(out).toContain('Opus 4.8');
    expect(out).toContain('repo');
    expect(out).not.toContain(OAK_LOGO_ROWS.sextant[0]);
  });

  it('selects the braille-sharp frame named by logoFrame, defaulting to and wrapping at frame 0', () => {
    const firstRow = (logoFrame: number | undefined): string =>
      renderStatusline({ ...base, dir: 'repo' }, { logo: 'braille-sharp', logoFrame }).split(
        '\n',
      )[0];
    expect(firstRow(undefined)).toContain(BRAILLE_SHARP_FRAMES[0][0]);
    expect(firstRow(1)).toContain(BRAILLE_SHARP_FRAMES[1][0]);
    expect(firstRow(3)).toContain(BRAILLE_SHARP_FRAMES[3][0]);
    expect(firstRow(4)).toContain(BRAILLE_SHARP_FRAMES[0][0]);
  });
});
