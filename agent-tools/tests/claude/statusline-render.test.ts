import { OAK_LOGO_ROWS } from '../../src/claude/oak-logo';
import { renderStatusline, type StatuslineParts } from '../../src/claude/statusline-render';

const RESET = '\x1b[0m';
const DIM = '\x1b[2m';
const CYAN = '\x1b[0;36m';
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
  model: undefined,
  sessionShape: undefined,
};

describe('renderStatusline', () => {
  it('puts the identity-and-context segments and the git segments on separate lines', () => {
    const lines = renderStatusline({
      identity: 'Fragrant Creeping Sapling',
      dir: 'oak-wt-eef',
      branch: 'feat/eef-explore-evidence',
      dirty: false,
      worktree: 'oak-wt-eef',
      usedPercentage: 12,
      model: 'Opus 4.7',
      sessionShape: undefined,
    }).split('\n');

    expect(lines).toHaveLength(2);
    expect(lines[0]).toContain('Fragrant Creeping Sapling');
    expect(lines[0]).toContain('Opus 4.7');
    expect(lines[0]).toContain('ctx:12%');
    expect(lines[0]).not.toContain('feat/eef-explore-evidence');
    expect(lines[1]).toContain('feat/eef-explore-evidence');
    expect(lines[1]).toContain('wt:oak-wt-eef');
  });

  it('emits a single line (no newline) when only git segments are present', () => {
    const out = renderStatusline({ ...base, branch: 'main' });
    expect(out).not.toContain('\n');
    expect(out).toContain('main');
    expect(out).toContain('repo');
    expect(out.indexOf('main')).toBeLessThan(out.indexOf('repo'));
  });

  it('omits the identity segment when no identity is resolved', () => {
    expect(renderStatusline({ ...base, dir: 'repo' })).toBe(`${CYAN}repo${RESET}`);
  });

  it('shows the directory when not in a linked worktree', () => {
    const line = renderStatusline({ ...base, worktree: undefined });
    expect(line).toContain(`${CYAN}repo${RESET}`);
    expect(line).not.toContain('wt:');
  });

  it('shows the worktree name instead of the directory in a linked worktree', () => {
    const line = renderStatusline({ ...base, dir: 'repo', worktree: 'oak-wt-eef' });
    expect(line).toContain(`${CYAN}wt:oak-wt-eef${RESET}`);
    expect(line).not.toContain(`${CYAN}repo${RESET}`);
  });

  it('marks a dirty working tree with an asterisk and a clean tree without one', () => {
    const dirtyOut = renderStatusline({ ...base, branch: 'main', dirty: true });
    expect(dirtyOut).toContain('main');
    expect(dirtyOut).toContain('*');

    const cleanOut = renderStatusline({ ...base, branch: 'main', dirty: false });
    expect(cleanOut).toContain('main');
    expect(cleanOut).not.toContain('*');
  });

  it('omits the branch segment outside a repository', () => {
    expect(renderStatusline({ ...base, branch: undefined, dirty: true })).not.toContain('*');
  });

  it('renders low context usage in green, rounded to a whole number', () => {
    const line = renderStatusline({ ...base, usedPercentage: 12.6 });
    expect(line).toContain(`${GREEN}ctx:13%${RESET}`);
    expect(line).not.toContain(`${YELLOW}ctx:13%`);
    expect(line).not.toContain(`${RED}ctx:13%`);
  });

  it('renders elevated context usage in yellow from 50%', () => {
    expect(renderStatusline({ ...base, usedPercentage: 50 })).toContain(`${YELLOW}ctx:50%${RESET}`);
    expect(renderStatusline({ ...base, usedPercentage: 49.4 })).not.toContain(`${YELLOW}ctx:49%`);
  });

  it('renders high context usage in red from 70%', () => {
    expect(renderStatusline({ ...base, usedPercentage: 70 })).toContain(`${RED}ctx:70%${RESET}`);
    expect(renderStatusline({ ...base, usedPercentage: 69.4 })).toContain(
      `${YELLOW}ctx:69%${RESET}`,
    );
  });

  it('omits the context segment when usage is absent', () => {
    expect(renderStatusline({ ...base, usedPercentage: undefined })).not.toContain('ctx:');
  });
});

describe('renderStatusline with an Oak logo column', () => {
  const SEXTANT = OAK_LOGO_ROWS.sextant;

  it('distributes the segments across four rows beside the logo column', () => {
    const rows = renderStatusline(
      {
        identity: 'Bilby hunts Eventide',
        dir: 'oak-open-curriculum-ecosystem',
        branch: 'feat/comms-research',
        dirty: true,
        worktree: undefined,
        usedPercentage: 38,
        model: 'Opus 4.8',
        sessionShape: undefined,
      },
      { logo: 'sextant' },
    ).split('\n');

    expect(rows[0]).toContain('Bilby hunts Eventide');
    expect(rows[1]).toContain('Opus 4.8');
    expect(rows[2]).toContain('ctx:38%');
    expect(rows[2]).toContain('feat/comms-research');
    expect(rows[3]).toContain('oak-open-curriculum-ecosystem');
  });

  it('renders all four logo rows even when only the directory segment is present', () => {
    expect(
      renderStatusline({ ...base, dir: 'repo' }, { logo: 'sextant' })
        .split('\n')
        .slice(0, 4),
    ).toEqual([
      `${GREEN}${SEXTANT[0]}${RESET}`,
      `${GREEN}${SEXTANT[1]}${RESET}`,
      `${GREEN}${SEXTANT[2]}${RESET}`,
      `${GREEN}${SEXTANT[3]}${RESET}  ${CYAN}repo${RESET}`,
    ]);
  });

  it('spans the separator rule to the active logo width, on by default', () => {
    // Mechanism, not configuration: the rule width is derived from whichever
    // logo is active — never a hardcoded width or glyph — proven across two
    // styles whose widths differ (sextant is seven columns, braille six).
    for (const style of ['sextant', 'braille'] as const) {
      const lines = renderStatusline({ ...base, dir: 'repo' }, { logo: style }).split('\n');
      const ruleRow = lines[lines.length - 1].replaceAll(DIM, '').replaceAll(RESET, '');
      expect([...ruleRow].length).toBe([...OAK_LOGO_ROWS[style][0]].length);
    }
  });

  it('tiles a caller-supplied rule glyph across the logo width', () => {
    // Inject a probe glyph and prove the set-it -> renders-it mechanism at the
    // logo width; never assert the default glyph (owner-tunable presentation).
    const probe = '=';
    const lines = renderStatusline(
      { ...base, dir: 'repo' },
      { logo: 'sextant', logoSeparator: probe },
    ).split('\n');
    const ruleRow = lines[lines.length - 1].replaceAll(DIM, '').replaceAll(RESET, '');
    const logoWidth = [...OAK_LOGO_ROWS.sextant[0]].length;
    expect([...ruleRow]).toEqual(Array.from({ length: logoWidth }, () => probe));
  });

  it('suppresses the separator rule when given an empty glyph', () => {
    // The off switch: an explicit empty string drops the rule row entirely.
    const lines = renderStatusline(
      { ...base, dir: 'repo' },
      { logo: 'sextant', logoSeparator: '' },
    ).split('\n');
    expect(lines).toHaveLength(OAK_LOGO_ROWS.sextant.length);
    expect(lines[lines.length - 1]).toContain('repo');
  });

  it('omits the separator row in the no-logo layout', () => {
    const lines = renderStatusline({ ...base, dir: 'repo' }, { logoSeparator: '<<sep>>' }).split(
      '\n',
    );
    expect(lines).not.toContain('<<sep>>');
  });

  it('uses universal quadrant glyphs for the quad style', () => {
    const lines = renderStatusline({ ...base, dir: 'repo' }, { logo: 'quad' }).split('\n');
    expect(lines[0]).toBe(`${GREEN}${OAK_LOGO_ROWS.quad[0]}${RESET}`);
    expect(lines[3]).toBe(`${GREEN}${OAK_LOGO_ROWS.quad[3]}${RESET}  ${CYAN}repo${RESET}`);
  });

  it('renders the two-line layout when the logo style is none', () => {
    const out = renderStatusline({ ...base, dir: 'repo', model: 'Opus 4.8' }, { logo: 'none' });
    expect(out).toContain('\n');
    expect(out).toBe(`${DIM}Opus 4.8${RESET}\n${CYAN}repo${RESET}`);
  });
});
