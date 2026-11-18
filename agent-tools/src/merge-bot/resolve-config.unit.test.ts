/**
 * Flag resolution for `merge-bot mint-token` — pure: literal argv in, a
 * `Result` out, no fakes and no IO.
 *
 * These states are reachable without touching the filesystem because supplying
 * all three identity flags means the repo-config authority is never consulted.
 * Scope validation is the security-relevant half: it decides which permissions
 * a credential will carry, so it is described here rather than only through
 * the CLI's wiring.
 */

import { describe, expect, it } from 'vitest';

import { resolveMintTokenConfig } from './resolve-config.js';

/** Identity flags, so resolution stays inside the pure branch. */
const IDENTITY = ['--app-id', '1', '--private-key-path', '/k.pem', '--repo', 'o/r'] as const;

function resolve(...flags: readonly string[]): ReturnType<typeof resolveMintTokenConfig> {
  return resolveMintTokenConfig([...flags, ...IDENTITY], {
    runGitImpl: () => {
      throw new Error('git must not run when every identity flag is explicit');
    },
  });
}

function errorMessage(result: ReturnType<typeof resolveMintTokenConfig>): string {
  return result.ok ? '' : result.error.message;
}

describe('resolveMintTokenConfig scope handling', () => {
  it('carries the scope name through on a valid scope', () => {
    const result = resolve('--scope', 'code-scanning-alerts');

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.scope).toBe('code-scanning-alerts');
    }
  });

  it('refuses a missing scope and teaches a command that can be pasted whole', () => {
    const message = errorMessage(resolve());

    expect(message).toContain('--scope is required');
    expect(message).toContain('pull-request-work');
    expect(message).toContain('code-scanning-alerts');
    // The remediation must be COMPLETE — a fragment leaves the reader to
    // reconstruct it, which is how the stale-paste problem started.
    expect(message).toContain('merge-bot mint-token --scope <scope-name>');
    // …and must not fail open: the assignment form is what stops an empty
    // GH_TOKEN falling back to the human's credential.
    expect(message).toContain('|| exit 1');
  });

  it('suggests a placeholder rather than steering the reader to the widest scope', () => {
    // Naming a concrete scope here teaches whichever one is listed first,
    // which is the write scope — the opposite of least-privilege by default.
    expect(errorMessage(resolve())).not.toContain('--scope pull-request-work');
  });

  it('refuses an unknown scope', () => {
    const message = errorMessage(resolve('--scope', 'admin-everything'));

    expect(message).toContain('unknown --scope "admin-everything"');
    expect(message).toContain('code-scanning-alerts');
  });

  it.each(['toString', 'constructor', '__proto__', 'valueOf'])(
    'refuses the inherited property name %s as a scope',
    (inherited) => {
      // Membership must be an OWN-property test. Under an `in` test these
      // resolve to Object.prototype members, and a function-valued match is
      // dropped by JSON.stringify — minting a body with no permissions key at
      // all, which GitHub reads as the installation's full grant.
      expect(errorMessage(resolve('--scope', inherited))).toContain('unknown --scope');
    },
  );

  it('refuses a repeated scope instead of letting the last one win', () => {
    // Last-wins is privilege-directional: a wrapper appending its own default
    // would silently upgrade a read-only intent to three writes.
    const message = errorMessage(
      resolve('--scope', 'code-scanning-alerts', '--scope', 'pull-request-work'),
    );

    expect(message).toContain('more than once');
  });

  it('refuses a repeated scope in either order, so neither position wins', () => {
    const message = errorMessage(
      resolve('--scope', 'pull-request-work', '--scope', 'code-scanning-alerts'),
    );

    expect(message).toContain('more than once');
  });
});
