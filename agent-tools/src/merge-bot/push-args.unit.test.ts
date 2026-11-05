import { describe, expect, it } from 'vitest';

import { parsePushArgs } from './push-args.js';

/**
 * The `merge-bot push` argv contract — pure parsing, no fakes: the surface is
 * two flags and NOTHING else, and the flags that are deliberately absent
 * (`--force`, `--no-verify`) refuse by name rather than falling into a generic
 * unknown-flag message, so an operator reaching for a bypass is told there
 * isn't one.
 */

describe('parsePushArgs', () => {
  it('parses the full flag line', () => {
    const parsed = parsePushArgs(['--branch', 'jimcresswell/mcp-508-slice', '--json']);

    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(parsed.value).toEqual({ branch: 'jimcresswell/mcp-508-slice', json: true });
    }
  });

  it('defaults to the checked-out branch and human output', () => {
    const parsed = parsePushArgs([]);

    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      // No branch is resolved HERE: the argv layer records the absence, and
      // the action asks git which branch HEAD is on.
      expect(parsed.value.branch).toBeUndefined();
      expect(parsed.value.json).toBe(false);
    }
  });

  it('refuses --force by name: there is no force flag to reach for', () => {
    for (const flag of ['--force', '-f', '--force-with-lease']) {
      const parsed = parsePushArgs([flag]);
      expect(parsed.ok).toBe(false);
      if (!parsed.ok) {
        expect(parsed.error.message).toContain(flag);
        expect(parsed.error.message).toContain('no force');
      }
    }
  });

  it('refuses --no-verify by name: the hooks are the point', () => {
    const parsed = parsePushArgs(['--no-verify']);

    expect(parsed.ok).toBe(false);
    if (!parsed.ok) {
      expect(parsed.error.message).toContain('--no-verify');
      expect(parsed.error.message).toContain('hooks');
    }
  });

  it('requires --branch to be a git branch name', () => {
    // Blank, flag-shaped, option-shaped and ref-illegal values all fail: the
    // value lands inside a `HEAD:<branch>` refspec in git's OWN argv, so it
    // must never be able to read as anything but a branch name.
    for (const bad of ['', ' ', '--json', '-x', '--upload-pack=evil', 'a..b', 'feat/', 'x.lock']) {
      const parsed = parsePushArgs(['--branch', bad]);
      expect(parsed.ok).toBe(false);
      if (!parsed.ok) {
        expect(parsed.error.message).toContain('--branch');
      }
    }

    const missingValue = parsePushArgs(['--branch']);
    expect(missingValue.ok).toBe(false);
    if (!missingValue.ok) {
      expect(missingValue.error.message).toContain('--branch');
    }
  });

  it('rejects every ref shape git itself rejects — legality is the oracle question, not ours', () => {
    // R9: these four all satisfied the hand-rolled grammar this parser used to
    // carry, and `git check-ref-format` rejects every one — a trailing dot, a
    // doubled slash, a dot-leading component, and a `.lock` component that is
    // not the last. A lookalike admits precisely the shapes nobody thinks to
    // write down, which is why the oracle is asked instead of imitated. The
    // real `git check-ref-format` runs here, unfaked: asking anything else
    // would restore the lookalike one layer up.
    for (const bad of ['foo.', 'foo//bar', 'foo/.bar', 'foo.lock/bar']) {
      const parsed = parsePushArgs(['--branch', bad]);
      expect(parsed.ok, `expected git to reject "${bad}"`).toBe(false);
      if (!parsed.ok) {
        expect(parsed.error.message).toContain('--branch');
      }
    }
  });

  it('accepts the branch shapes the estate actually cuts', () => {
    for (const good of ['main', 'jimcresswell/mcp-508-merge-bot-merge', 'release-1.2.3', 'x_y']) {
      expect(parsePushArgs(['--branch', good]).ok).toBe(true);
    }
  });

  it('refuses a repeated --branch rather than letting argv order pick the target', () => {
    const parsed = parsePushArgs(['--branch', 'one', '--branch', 'two']);

    expect(parsed.ok).toBe(false);
    if (!parsed.ok) {
      expect(parsed.error.message).toContain('more than once');
    }
  });

  it('refuses unknown flags and bare positional arguments', () => {
    const unknown = parsePushArgs(['--wat', 'x']);
    expect(unknown.ok).toBe(false);
    if (!unknown.ok) {
      expect(unknown.error.message).toContain('--wat');
    }

    // A bare word is most likely a branch name typed without its flag; it must
    // not be swallowed as one, because the target of a push is not guessable.
    const positional = parsePushArgs(['some-branch']);
    expect(positional.ok).toBe(false);
    if (!positional.ok) {
      expect(positional.error.message).toContain('some-branch');
    }
  });
});
