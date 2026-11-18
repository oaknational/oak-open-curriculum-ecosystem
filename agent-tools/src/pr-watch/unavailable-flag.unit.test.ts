import { describe, expect, it } from 'vitest';

import { parseUnavailableFlag } from './unavailable-flag.js';

/** `--unavailable <login>=<comment-url>`: the login before the first `=`, the url after it. */

describe('parseUnavailableFlag', () => {
  it('reads the login and the url', () => {
    expect(
      parseUnavailableFlag(
        'copilot-pull-request-reviewer=https://github.com/acme/widgets/pull/42#issuecomment-1',
      ),
    ).toStrictEqual({
      login: 'copilot-pull-request-reviewer',
      url: 'https://github.com/acme/widgets/pull/42#issuecomment-1',
    });
  });

  it('keeps a url that carries its own `=`', () => {
    expect(parseUnavailableFlag('codex=https://example.test/a?b=c')).toStrictEqual({
      login: 'codex',
      url: 'https://example.test/a?b=c',
    });
  });

  it.each(['copilot-pull-request-reviewer', '=https://example.test/1', 'copilot=', ' = '])(
    'refuses %j',
    (value) => {
      expect(() => parseUnavailableFlag(value)).toThrow(
        `--unavailable takes <login>=<comment-url>, got "${value}"`,
      );
    },
  );
});
