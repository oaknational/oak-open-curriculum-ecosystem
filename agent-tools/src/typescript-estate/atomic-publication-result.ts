import { err, isErr, type Result } from '@oaknational/result';

/** Translate a throwing publication adapter into its declared Result boundary. */
export function invokePublicationOperation<T>(operation: () => Result<T, Error>): Result<T, Error> {
  try {
    return operation();
  } catch (error: unknown) {
    return err(error instanceof Error ? error : new Error(String(error)));
  }
}

/** Retain both the write/fsync failure and the mandatory-close failure. */
export function combineWriteAndClose(
  written: Result<void, Error>,
  closed: Result<void, Error>,
): Result<void, Error> {
  if (isErr(written) && isErr(closed)) {
    return err(new AggregateError([written.error, closed.error], 'write and close both failed'));
  }
  return isErr(written) ? written : closed;
}
