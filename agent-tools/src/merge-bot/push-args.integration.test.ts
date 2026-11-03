import { describe, expect, it } from 'vitest';

import { parsePushArgs } from './push-args.js';
import type { RefFormatOracle } from './ref-format.js';
import { failureMessage } from './test-helpers/result-failure.js';

/**
 * The `merge-bot push` argv contract over an injected ref-format oracle (a
 * constant answer), so no git binary is asked: what a refusal echoes of the
 * argument it refuses.
 */

const noNameLegal: RefFormatOracle = () => false;

/** A refusal's own line: the message's first, before the usage text. */
function refusalLine(argv: readonly string[]): string {
  const [line = ''] = failureMessage(parsePushArgs(argv, { refFormatOracle: noNameLegal })).split(
    '\n',
  );
  return line;
}

describe('parsePushArgs, with the oracle injected', () => {
  it.each([
    {
      name: 'an escape sequence in a --branch value',
      argv: ['--branch', 'a\u{1b}[2J'],
      shown: '"a[2J"',
    },
    {
      name: 'a direction override in a --branch value',
      argv: ['--branch', 'a\u{202e}b'],
      shown: '"ab"',
    },
    { name: 'an escape sequence in an unknown argument', argv: ['x\u{1b}[2J'], shown: '"x[2J"' },
  ])('echoes $name without its control and format characters', ({ argv, shown }) => {
    expect(refusalLine(argv)).toContain(shown);
    expect(refusalLine(argv)).not.toMatch(/[\p{Cc}\p{Cf}]/u);
  });
});
