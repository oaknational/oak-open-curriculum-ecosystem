import { describe, expect, it } from 'vitest';

import type { RefFormatOracle } from './ref-format.js';
import { parseRetireArgs } from './retire-args.js';
import { failureMessage } from './test-helpers/result-failure.js';

/**
 * The `merge-bot retire` argv contract: one required `--branch`, legal by
 * git's grammar AND inside the command's URL-safe name list, and `--json`.
 * The ref-format oracle is an injected fake (a constant answer), so git's
 * grammar here is a table.
 */

const everyNameLegal: RefFormatOracle = () => true;
const seams = { refFormatOracle: everyNameLegal };

describe('parseRetireArgs', () => {
  it('parses the full flag line', () => {
    expect(parseRetireArgs(['--branch', 'feat/branch-retire', '--json'], seams)).toEqual({
      ok: true,
      value: { branch: 'feat/branch-retire', json: true },
    });
  });

  it('requires --branch: there is no current-branch default for a delete', () => {
    expect(failureMessage(parseRetireArgs(['--json'], seams))).toContain('--branch');
  });

  it.each(['issue#12', '%2e%2e/tags/v1'])(
    'refuses a git-legal name outside the URL-safe list: %s',
    (name) => {
      expect(failureMessage(parseRetireArgs(['--branch', name], seams))).toContain('by hand');
    },
  );

  it("refuses a name git's grammar rejects", () => {
    const nothingLegal: RefFormatOracle = () => false;

    expect(parseRetireArgs(['--branch', 'feat/x'], { refFormatOracle: nothingLegal }).ok).toBe(
      false,
    );
  });

  it.each(['--force', '-f'])(
    'refuses %s by name: a refusal is surfaced, never overridden',
    (flag) => {
      expect(failureMessage(parseRetireArgs([flag, '--branch', 'feat/x'], seams))).toContain(flag);
    },
  );

  it('refuses a repeated --branch and an unknown argument', () => {
    expect(parseRetireArgs(['--branch', 'a', '--branch', 'b'], seams).ok).toBe(false);
    expect(parseRetireArgs(['--branch', 'a', '--prune'], seams).ok).toBe(false);
  });

  it.each([
    ['--branch', 'a', '--x\u001b[2J'],
    ['--branch', 'a\u001b[2J'],
    ['--branch', '-\u001b[2J'],
  ])('echoes a refused argument without its control characters: %j', (...argv) => {
    const parsed = parseRetireArgs(argv, seams);

    expect(parsed.ok).toBe(false);
    expect(failureMessage(parsed)).not.toContain('\u001b');
  });
});
