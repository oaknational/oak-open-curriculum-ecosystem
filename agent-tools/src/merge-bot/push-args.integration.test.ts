import { unwrapErr } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { parsePushArgs } from './push-args.js';
import { gitRefFormatOracle, RefFormatOracleUnavailableError } from './ref-format.js';

/**
 * The `merge-bot push` argv contract against git's ref-format oracle with an
 * injected run, so the operational failure path is exercised without a git
 * binary.
 */

describe('parsePushArgs with a git that cannot run', () => {
  it('RETURNS the failure as operational, never a usage error', () => {
    // git's oracle with a run that fails to start, as it does with no git on
    // PATH: this parser's whole contract is its Result, so the failure is
    // returned and typed rather than read as an illegal branch name.
    const error = unwrapErr(
      parsePushArgs(['--branch', 'lane'], {
        refFormatOracle: gitRefFormatOracle(() => ({
          status: null,
          error: new Error('spawn git ENOENT'),
        })),
      }),
    );

    // Typed, so the front door can answer it as operational (exit 1) rather
    // than as a mistyped argument (exit 2 plus a usage dump).
    expect(error).toBeInstanceOf(RefFormatOracleUnavailableError);
    // The spawn's own failure and the remedy survive; the usage text does not drown them.
    expect(error.message).toContain('ENOENT');
    expect(error.message).toContain('put it on PATH');
    expect(error.message).not.toContain('--json puts EXACTLY');
  });

  it('RETURNS a git that ends without an exit status as operational, never an illegal name', () => {
    const error = unwrapErr(
      parsePushArgs(['--branch', 'lane'], {
        refFormatOracle: gitRefFormatOracle(() => ({ status: null })),
      }),
    );

    expect(error).toBeInstanceOf(RefFormatOracleUnavailableError);
  });
});
