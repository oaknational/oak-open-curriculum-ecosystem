/**
 * Git's own options before the subcommand (`git -C <path> reset`) that take a
 * separate argument when not `=`-joined. Shared by the Claude Bash guard's
 * argument matcher and the Codex seat-rollout reader, which both pass them,
 * with their argument, to find the subcommand.
 *
 * @packageDocumentation
 */

/** The git global options whose argument is the next word unless `=`-joined. */
export const GIT_GLOBAL_OPTIONS_WITH_ARGUMENT: ReadonlySet<string> = new Set([
  '-C',
  '-c',
  '--git-dir',
  '--work-tree',
  '--namespace',
  '--config-env',
  '--attr-source',
  '--list-cmds',
]);
