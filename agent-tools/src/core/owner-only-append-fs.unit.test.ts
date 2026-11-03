import { err, ok } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { attempt, fsFailureOf } from './owner-only-append-fs.js';

/**
 * The edge the real `node:fs` binding runs every call through: a throw
 * becomes an err, and only its code survives; the message, which names the
 * path, never does.
 */

function errnoError(message: string, code: unknown): Error {
  return Object.assign(new Error(message), { code });
}

describe('fsFailureOf', () => {
  it('keeps the errno code of a thrown fs error and drops its message', () => {
    const thrown = errnoError(
      "ELOOP: too many symbolic links encountered, open '/srv/estate/logs/x.jsonl'",
      'ELOOP',
    );
    expect(fsFailureOf(thrown)).toEqual({ code: 'ELOOP' });
  });

  it('withholds a code that is not shaped as an error code, so no path can ride in on it', () => {
    // Which codes are shaped as error codes is proven at `errorCodeOf`.
    const thrown = errnoError('write failed', "EACCES '/srv/estate/logs/x.jsonl'");
    expect(fsFailureOf(thrown)).toEqual({ code: 'UNKNOWN' });
  });

  it('reads an error with no code as UNKNOWN, never as its message', () => {
    expect(fsFailureOf(new Error('cannot write /srv/estate/logs/x.jsonl'))).toEqual({
      code: 'UNKNOWN',
    });
  });
});

describe('attempt', () => {
  it('turns a call that throws into an err carrying only its code', () => {
    // An invalid URL throws a coded TypeError that carries its input, a path here.
    const result = attempt(() => new URL('/srv/estate/logs/x.jsonl'));
    expect(result).toEqual(err({ code: 'ERR_INVALID_URL' }));
    expect(JSON.stringify(result)).not.toContain('/srv');
  });

  it('passes the value of a call that does not throw through as ok', () => {
    expect(attempt(() => 7)).toEqual(ok(7));
  });
});
