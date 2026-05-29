import { renderStatusline, type StatuslineParts } from '../../src/claude/statusline-render';

const RESET = '[0m';
const BOLD_GREEN = '[1;32m';
const CYAN = '[0;36m';
const BOLD_BLUE = '[1;34m';
const RED = '[0;31m';
const YELLOW = '[0;33m';
const MAGENTA = '[0;35m';

const base: StatuslineParts = {
  identity: undefined,
  dir: 'repo',
  branch: undefined,
  dirty: false,
  worktree: undefined,
  usedPercentage: undefined,
  model: undefined,
};

describe('renderStatusline', () => {
  it('renders every segment for a full linked-worktree payload', () => {
    expect(
      renderStatusline({
        identity: 'Fragrant Creeping Sapling',
        dir: 'oak-wt-eef',
        branch: 'feat/eef-explore-evidence',
        dirty: false,
        worktree: 'oak-wt-eef',
        usedPercentage: 12,
        model: 'Opus 4.7',
      }),
    ).toBe(
      `${MAGENTA}Fragrant Creeping Sapling${RESET} ${BOLD_GREEN}➜${RESET} ${CYAN}oak-wt-eef${RESET}` +
        ` ${BOLD_BLUE}git:(${RED}feat/eef-explore-evidence${BOLD_BLUE})${RESET}` +
        ` ${BOLD_BLUE}wt:(${CYAN}oak-wt-eef${BOLD_BLUE})${RESET} ctx:12% [Opus 4.7]`,
    );
  });

  it('omits the identity prefix when no identity is resolved', () => {
    expect(renderStatusline({ ...base, dir: 'repo' })).toBe(
      `${BOLD_GREEN}➜${RESET} ${CYAN}repo${RESET}`,
    );
  });

  it('omits the git and worktree segments outside a repository', () => {
    const line = renderStatusline({ ...base, branch: undefined, worktree: 'ignored' });
    expect(line).toBe(
      `${BOLD_GREEN}➜${RESET} ${CYAN}repo${RESET} ${BOLD_BLUE}wt:(${CYAN}ignored${BOLD_BLUE})${RESET}`,
    );
  });

  it('shows the dirty mark when the working tree has changes', () => {
    expect(renderStatusline({ ...base, branch: 'main', dirty: true })).toContain(
      `${YELLOW}✗${RESET}`,
    );
  });

  it('omits the dirty mark on a clean tree', () => {
    expect(renderStatusline({ ...base, branch: 'main', dirty: false })).not.toContain('✗');
  });

  it('omits the worktree segment in the main working tree', () => {
    expect(renderStatusline({ ...base, branch: 'main', worktree: undefined })).not.toContain(
      'wt:(',
    );
  });

  it('rounds the context percentage to a whole number', () => {
    expect(renderStatusline({ ...base, usedPercentage: 12.6 })).toContain('ctx:13%');
  });

  it('omits the context segment when usage is absent', () => {
    expect(renderStatusline({ ...base, usedPercentage: undefined })).not.toContain('ctx:');
  });
});
