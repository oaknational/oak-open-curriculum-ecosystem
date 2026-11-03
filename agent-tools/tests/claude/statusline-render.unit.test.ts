import { BRAILLE_SHARP_FRAMES, LOGO_ROWS } from '../../src/claude/logo';
import { renderStatusline, type StatuslineParts } from '../../src/claude/statusline-render';

const RESET = '\x1b[0m';
const GREEN = '\x1b[0;32m';
const RED = '\x1b[0;31m';
const YELLOW = '\x1b[0;33m';

const base: StatuslineParts = {
  identity: undefined,
  identityPrefix: undefined,
  ownerJobsOpen: undefined,
  ownerJobsLink: undefined,
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
  effortLevel: undefined,
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

describe('renderStatusline — usage on the model row', () => {
  // Usage reads beside WHAT is doing the work (owner direction 2026-07-20,
  // superseding the repo-title placement cycle 1 shipped): the context and
  // rate-limit gauges join the model row, after the model name, in either
  // layout; every location row stays plain.
  it.each(['none', 'sextant'] as const)(
    'renders the context percentage on the model row, not the repo-title row (%s layout)',
    (logo) => {
      const out = renderStatusline(
        { ...base, model: 'Opus 4.8', usedPercentage: 38, branch: 'main', dir: 'repo' },
        { logo },
      );
      expect(lineWith(out, 'Opus 4.8')).toContain('ctx:38%');
      expect(lineWith(out, 'repo')).not.toContain('ctx:');
    },
  );

  it.each(['none', 'sextant'] as const)(
    'renders model then context then rate-limit gauges, in that order (%s layout)',
    (logo) => {
      const out = renderStatusline(
        {
          ...base,
          identity: 'Wyvern mends Draught',
          model: 'Opus 4.8',
          usedPercentage: 61,
          fiveHourPercentage: 19,
          sevenDayPercentage: 14,
          branch: 'main',
          dir: 'castr',
        },
        { logo },
      );
      const modelRow = stripAnsi(lineWith(out, 'Opus 4.8'));
      expect(modelRow).toContain('ctx:61%');
      expect(modelRow.indexOf('Opus 4.8')).toBeLessThan(modelRow.indexOf('ctx:61%'));
      expect(modelRow.indexOf('ctx:61%')).toBeLessThan(modelRow.indexOf('s:19%'));
      expect(modelRow.indexOf('s:19%')).toBeLessThan(modelRow.indexOf('w:14%'));
      expect(lineWith(out, 'castr')).not.toContain('ctx:');
      expect(lineWith(out, 'castr')).not.toContain('s:');
    },
  );

  it('keeps every location row plain in a linked worktree, carrying usage on the model row', () => {
    const out = renderStatusline({
      ...base,
      model: 'Opus 4.8',
      dir: 'oak-wt-eef',
      branch: 'feat/eef',
      worktree: 'oak-wt-eef',
      usedPercentage: 38,
      fiveHourPercentage: 23,
      coordinationBranch: 'coordination/pilot',
      coordinationPlace: 'oak-open-curriculum-ecosystem',
    });
    const modelRow = stripAnsi(lineWith(out, 'Opus 4.8'));
    expect(modelRow).toContain('ctx:38%');
    expect(modelRow).toContain('s:23%');
    expect(lineWith(out, 'oak-open-curriculum-ecosystem')).not.toContain('ctx:');
    expect(lineWith(out, 'coordination/pilot')).not.toContain('ctx:');
    expect(lineWith(out, 'feat/eef')).not.toContain('s:');
  });

  it('still renders usage when the model is absent (the gauges own the row)', () => {
    const out = renderStatusline({ ...base, usedPercentage: 42, branch: 'main', dir: 'repo' });
    expect(stripAnsi(out)).toContain('ctx:42%');
    expect(lineWith(out, 'repo')).not.toContain('ctx:');
  });
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

describe('renderStatusline — reasoning effort on the checkout row', () => {
  it('appends e:<level> after the checkout name in the primary layout', () => {
    const out = renderStatusline({
      ...base,
      dir: 'oak-open-curriculum-ecosystem',
      branch: 'main',
      effortLevel: 'high',
    });
    expect(stripAnsi(lineWith(out, 'oak-open-curriculum-ecosystem'))).toContain(
      'oak-open-curriculum-ecosystem · e:high',
    );
    expect(lineWith(out, 'main')).not.toContain('e:high');
  });

  it('appends e:<level> to the worktree row in the linked-worktree layout, never the coordination rows', () => {
    const out = renderStatusline({
      ...base,
      dir: 'oak-wt-eef',
      branch: 'feat/eef-explore-evidence',
      worktree: 'oak-wt-eef',
      coordinationBranch: 'coordination/worktree-pilot',
      coordinationPlace: 'oak-open-curriculum-ecosystem',
      effortLevel: 'max',
    });
    expect(stripAnsi(lineWith(out, 'oak-wt-eef'))).toContain('e:max');
    expect(lineWith(out, 'coordination/worktree-pilot')).not.toContain('e:max');
    expect(lineWith(out, 'oak-open-curriculum-ecosystem')).not.toContain('e:max');
  });

  it('renders no effort segment when the level is absent', () => {
    expect(renderStatusline({ ...base, dir: 'repo' })).not.toContain('e:');
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

describe('renderStatusline — identity shows the session join key (inter-Practice WS3)', () => {
  // One agent can carry a different name per estate (per-repo derivations); the
  // session_id_prefix is the only cross-repo join key, so the identity segment
  // renders it beside the name. Under the PDR-125 clause-5 shape rule (as
  // amended 2026-08-01) the statusline is the worked single-identity example
  // and a DELIBERATE hold-out: it renders one identity and is the operator's
  // paste source for the join key, so it shows the BARE prefix, never the
  // multi-identity visual-disambiguator token.
  it('renders the name with the session_id_prefix', () => {
    const out = renderStatusline({
      ...base,
      identity: 'Cricket lifts Echo',
      identityPrefix: '2fffa2',
    });
    expect(stripAnsi(lineWith(out, 'Cricket lifts Echo'))).toContain('Cricket lifts Echo (2fffa2)');
  });

  it('renders a missing prefix as unknown (PDR-027), never a bare name', () => {
    const out = renderStatusline({
      ...base,
      identity: 'Cricket lifts Echo',
      identityPrefix: undefined,
    });
    expect(stripAnsi(lineWith(out, 'Cricket lifts Echo'))).toContain(
      'Cricket lifts Echo (unknown)',
    );
  });

  it('drops the identity segment entirely when the name is absent, prefix or not', () => {
    const out = renderStatusline({ ...base, identity: undefined, identityPrefix: '2fffa2' });
    expect(out).not.toContain('2fffa2');
    expect(out).not.toContain('(unknown)');
  });
});

describe('renderStatusline — Claude.ai rate-limit gauges', () => {
  it('shows the session (s) and week (w) consumed percentages with reset countdowns on the model row', () => {
    const out = renderStatusline({
      ...base,
      identity: 'Wyvern mends Draught',
      model: 'Opus 4.8',
      fiveHourPercentage: 33,
      fiveHourResetSeconds: 2 * 3600 + 14 * 60,
      sevenDayPercentage: 55,
      sevenDayResetSeconds: 3 * 86400,
      branch: 'main',
      dir: 'repo',
    });
    const modelRow = stripAnsi(lineWith(out, 'Opus 4.8'));
    expect(modelRow).toContain('s:33%(2h)');
    expect(modelRow).toContain('w:55%(3d)');
    expect(stripAnsi(lineWith(out, 'repo'))).not.toContain('s:33%');
    expect(stripAnsi(lineWith(out, 'Wyvern mends Draught'))).not.toContain('s:33%');
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
    for (const row of LOGO_ROWS.sextant) {
      expect(out).toContain(row);
    }
    expect(out).toContain('coord:');
    expect(out).toContain('feat/eef');
  });

  it('spans the separator rule to the active logo width, on by default', () => {
    for (const style of ['sextant', 'braille'] as const) {
      const lines = renderStatusline({ ...base, dir: 'repo' }, { logo: style }).split('\n');
      const ruleRow = (lines.at(-1) ?? '').replaceAll('\x1b[2m', '').replaceAll(RESET, '');
      expect([...ruleRow]).toHaveLength([...LOGO_ROWS[style][0]].length);
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
      Array.from({ length: [...LOGO_ROWS.sextant[0]].length }, () => probe),
    );
  });

  it('suppresses the separator rule when given an empty glyph', () => {
    const lines = renderStatusline(
      { ...base, dir: 'repo' },
      { logo: 'sextant', logoSeparator: '' },
    ).split('\n');
    expect(lines).toHaveLength(LOGO_ROWS.sextant.length);
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
    expect(out).not.toContain(LOGO_ROWS.sextant[0]);
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

describe('owner-attention bell', () => {
  it('renders the bell beside the identity summary in the no-logo layout', () => {
    const out = renderStatusline({
      ...base,
      identity: 'Forge rides Brimstone',
      identityPrefix: '398e24',
      ownerJobsOpen: 5,
    });
    const summaryRow = out.split('\n').find((row) => row.includes('Forge rides Brimstone'));
    expect(summaryRow).toBeDefined();
    expect(summaryRow).toContain('\u{1F514}5');
  });

  it('renders the bell beside the identity summary in the logo layout', () => {
    const out = renderStatusline(
      { ...base, identity: 'Forge rides Brimstone', identityPrefix: '398e24', ownerJobsOpen: 2 },
      { logo: 'braille-sharp' },
    );
    const summaryRow = out.split('\n').find((row) => row.includes('Forge rides Brimstone'));
    expect(summaryRow).toBeDefined();
    expect(summaryRow).toContain('\u{1F514}2');
  });
});
