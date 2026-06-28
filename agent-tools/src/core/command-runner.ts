import { type Result } from '@oaknational/result';

/**
 * A subprocess runner seam: runs a trusted binary with `args` from `cwd`,
 * returning its result on a zero exit or the underlying error on a non-zero exit —
 * the Result pattern (ADR-088), never a throw, so a subprocess failure is visible
 * to the type system at every call site.
 *
 * @remarks
 * `T` is the captured-output shape: `string` for runners whose stdout the caller
 * consumes (git, gh), `void` for runners that only signal success/failure (pnpm,
 * which inherits stdio so there is nothing to capture).
 *
 * This is the single shared seam shape for the spawn lane's git, pnpm, and gh
 * runners. It was hoisted to `core/` once a third independent consumer appeared
 * (git + pnpm + gh), per the consolidate-at-third-consumer discipline — replacing
 * three separate `(args, cwd) => Result<T, Error>` declarations with one
 * parametrised type. Each domain seam (`SpawnGitRunner`, `PnpmRunner`,
 * `GhRunner`) is a thin alias that keeps its semantic name while sharing this
 * shape.
 */
export type CommandRunner<T = string> = (args: readonly string[], cwd: string) => Result<T, Error>;
