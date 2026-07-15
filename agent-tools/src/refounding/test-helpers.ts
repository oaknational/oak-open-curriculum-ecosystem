import { err, ok, unwrap, type Result } from '@oaknational/result';

/**
 * Narrow a Result to its error with a fail-loud guard so error-shape
 * assertions run unconditionally — the inverse of `unwrap`, which
 * `@oaknational/result` does not ship. An if-guard here would make the
 * guarded assertions conditional (forbidden:
 * `.agent/rules/no-conditional-tests.md` §Forbidden mechanisms) and pass
 * silently on exactly the case it guards. Composes the sanctioned `unwrap`
 * over the swapped Result rather than adding a new throw site (ADR-088).
 *
 * @param result - The Result expected to be an Err.
 * @returns The error value.
 * @throws When the result is Ok — the test fails loud instead of skipping
 * its assertions.
 */
export function unwrapErr<T, E>(result: Result<T, E>): E {
  return unwrap(
    result.ok ? err(`expected Err, got Ok: ${JSON.stringify(result.value)}`) : ok(result.error),
  );
}
