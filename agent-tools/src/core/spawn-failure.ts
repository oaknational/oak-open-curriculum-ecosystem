/**
 * Describe why a `spawnSync` run returned an error, for a check's failure message.
 *
 * `spawnSync` sets `error` both when the child never started (a launch failure such
 * as ENOENT) and when its `timeout` fired (ETIMEDOUT). A message that reads only the
 * error reports a hang as a failure to run and loses the backstop's signal, so the two
 * are told apart by the code. Pure: no IO, no clock.
 */
export interface SpawnFailure {
  readonly code?: string | undefined;
  readonly message: string;
}

export function describeSpawnFailure(
  what: string,
  error: SpawnFailure,
  backstopMs: number,
): string {
  if (error.code === 'ETIMEDOUT') {
    return `${what} did not finish within the ${String(backstopMs)} ms hang backstop`;
  }
  return `${what} failed to run (${error.code ?? 'no code'}): ${error.message}`;
}
