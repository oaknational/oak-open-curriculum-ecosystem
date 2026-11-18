import type { BranchArgSeams } from './branch-arg.js';
import type { GitExecutor } from './git-executor.js';
import type { PushMint } from './push-mint.js';
import type { MergeBotResolveInput } from './resolve-identity.js';

/**
 * The composition surface the merge-bot actions that run git in the invoking
 * repository share: `merge-bot push` and `merge-bot retire`. `cli.ts` fills it
 * once, and each action extends it with its own seams, so a seam added here
 * reaches both and a field one action alone takes cannot ride into the
 * other's input unnoticed.
 */
export interface GitActionInput {
  readonly identityInput: MergeBotResolveInput;
  /** The invoking repository's root: the cwd every git call runs in. */
  readonly repoRoot: string;
  readonly stdout: Pick<NodeJS.WriteStream, 'write'>;
  readonly stderr: Pick<NodeJS.WriteStream, 'write'>;
  /** The token mint: `cli.ts` composes it over its mint seams; a test injects one whole. */
  readonly mint: PushMint;
  /** Git seams: the executor, and the binary path (defaults to the trusted absolute path). */
  readonly gitExecutor?: GitExecutor;
  readonly gitPath?: string;
  /**
   * Base environment for the git child. Defaults to `process.env` at the leaf
   * (the default-seam pattern `merge.ts`'s `readEnv` records): Node
   * REPLACES a provided child env rather than merging it, so injecting the
   * token-file path forces constructing the whole environment, and git needs
   * PATH and friends underneath.
   */
  readonly baseEnv?: Readonly<Record<string, string | undefined>>;
  /** The `--branch` check's seams (`branch-arg.ts`); its oracle defaults to asking the git binary. */
  readonly branchArgSeams?: BranchArgSeams;
}
