import { describe, expect, it } from 'vitest';

import { lastStartedLeg, readCheckLegs, startedLegs } from './repo-check-check-legs.js';

/**
 * The profile reads captured `pnpm check` output against the legs of the
 * root `check` script. These tests describe the pure mapping from a scripts
 * map to legs, and from output lines to the legs that started.
 */

const SCRIPTS = {
  check: 'pnpm format-check:root && pnpm lint && pnpm knip && pnpm depcruise',
  'format-check:root': 'pnpm agent-tools:repo-check prettier-tracked',
  lint: 'turbo run lint',
  knip: 'knip',
  depcruise: 'depcruise agent-tools tooling jcdotnet',
};

const CHECK_ECHO = `$ ${SCRIPTS.check}`;

function legs() {
  const result = readCheckLegs(SCRIPTS);
  if (!result.ok) {
    throw result.error;
  }
  return result.value;
}

describe('readCheckLegs', () => {
  it('reads each leg in chain order with the line pnpm prints when it starts', () => {
    expect(legs()).toStrictEqual([
      {
        name: 'format-check:root',
        startLine: '$ pnpm agent-tools:repo-check prettier-tracked',
        turboTasks: [],
      },
      { name: 'lint', startLine: '$ turbo run lint', turboTasks: ['lint'] },
      { name: 'knip', startLine: '$ knip', turboTasks: [] },
      { name: 'depcruise', startLine: '$ depcruise agent-tools tooling jcdotnet', turboTasks: [] },
    ]);
  });

  it('refuses a manifest without a check script', () => {
    const result = readCheckLegs({ lint: 'turbo run lint' });

    expect(result.ok).toBe(false);
  });

  it('refuses a check leg the manifest does not define', () => {
    const result = readCheckLegs({ check: 'pnpm lint && pnpm missing', lint: 'turbo run lint' });

    expect(result.ok).toBe(false);
    expect(result.ok ? '' : result.error.message).toContain('missing');
  });

  it('refuses a turbo invocation written directly into check, which prints no leg start line', () => {
    const result = readCheckLegs({ check: 'pnpm knip && turbo run test', knip: 'knip' });

    expect(result.ok).toBe(false);
  });

  it('refuses a check segment that is not a pnpm script, rather than dropping it', () => {
    // Dropped, the segment's failure would be attributed to the leg before it.
    const result = readCheckLegs({
      check: 'pnpm knip && node scripts/x.mjs && pnpm depcruise',
      knip: 'knip',
      depcruise: 'depcruise agent-tools',
    });

    expect(result.ok).toBe(false);
    expect(result.ok ? '' : result.error.message).toContain('node scripts/x.mjs');
  });

  it('follows a leg that runs another root script to the turbo tasks it reaches', () => {
    const result = readCheckLegs({
      check: 'pnpm lint',
      lint: 'pnpm lint:all',
      'lint:all': 'turbo run lint',
    });

    expect(result.ok ? result.value : []).toStrictEqual([
      { name: 'lint', startLine: '$ pnpm lint:all', turboTasks: ['lint'] },
    ]);
  });

  it('stops following a script chain that loops back on itself', () => {
    const result = readCheckLegs({ check: 'pnpm a', a: 'pnpm b', b: 'pnpm a' });

    expect(result.ok ? result.value : []).toStrictEqual([
      { name: 'a', startLine: '$ pnpm b', turboTasks: [] },
    ]);
  });
});

describe('startedLegs', () => {
  it('does not read a leg as started because the check echo names it', () => {
    // The always-true form: the echo of the check script itself contains
    // `pnpm depcruise`, so a substring match says every leg ran.
    expect(CHECK_ECHO).toContain('pnpm depcruise');

    const output = [CHECK_ECHO, '$ pnpm agent-tools:repo-check prettier-tracked', 'boom'].join(
      '\n',
    );

    expect(startedLegs(output, legs()).map((leg) => leg.name)).toStrictEqual(['format-check:root']);
  });

  it('reads start lines from interleaved stdout and stderr, in chain order', () => {
    const output = ['$ depcruise agent-tools tooling jcdotnet', '$ turbo run lint', '$ knip'].join(
      '\n',
    );

    expect(startedLegs(output, legs()).map((leg) => leg.name)).toStrictEqual([
      'lint',
      'knip',
      'depcruise',
    ]);
  });

  it('matches whole lines only, so a prefixed or quoted start line does not count', () => {
    const output = ['@oaknational/agent-tools:lint: $ knip', 'echo "$ knip"'].join('\n');

    expect(startedLegs(output, legs())).toStrictEqual([]);
  });

  it('reads a start line that colour output dims', () => {
    // With colour forced, pnpm wraps each start line in SGR dim and reset
    // sequences; built from the ESC code point so the source holds no control
    // character.
    const escape = String.fromCodePoint(0x1b);
    const output = `${escape}[2m$ knip${escape}[22m`;

    expect(startedLegs(output, legs()).map((leg) => leg.name)).toStrictEqual(['knip']);
  });
});

describe('lastStartedLeg', () => {
  it('names the last leg that started, which is the leg a failed chain stopped in', () => {
    const output = [
      CHECK_ECHO,
      '$ pnpm agent-tools:repo-check prettier-tracked',
      '$ turbo run lint',
    ].join('\n');

    expect(lastStartedLeg(output, legs())?.name).toBe('lint');
  });

  it('names no leg when none started', () => {
    expect(lastStartedLeg(CHECK_ECHO, legs())).toBeUndefined();
  });
});
