import type { OptionSpec } from './argv-option-spec.js';

/**
 * The git subcommand option tables for the argument-aware Bash-guard matcher,
 * grounded on git 2.50's own manuals (`git help <subcommand>`). See the
 * tables module for what a table needs to be complete for.
 *
 * @packageDocumentation
 */

export const gitReset: readonly OptionSpec[] = [
  { name: 'soft' },
  { name: 'mixed' },
  { name: 'hard' },
  { name: 'merge' },
  { name: 'keep' },
  { name: 'quiet', short: 'q' },
  { name: 'no-quiet' },
  { name: 'refresh' },
  { name: 'no-refresh' },
  { name: 'patch', short: 'p' },
  { name: 'intent-to-add', short: 'N' },
  { name: 'recurse-submodules', arg: 'optional' },
  { name: 'no-recurse-submodules' },
  { name: 'pathspec-from-file', arg: 'required' },
  { name: 'pathspec-file-nul' },
];

export const gitRevert: readonly OptionSpec[] = [
  { name: 'edit', short: 'e' },
  { name: 'no-edit' },
  { name: 'mainline', short: 'm', arg: 'required' },
  { name: 'cleanup', arg: 'required' },
  { name: 'no-commit', short: 'n' },
  { name: 'gpg-sign', short: 'S', arg: 'optional' },
  { name: 'no-gpg-sign' },
  { name: 'signoff', short: 's' },
  { name: 'strategy', arg: 'required' },
  { name: 'strategy-option', short: 'X', arg: 'required' },
  { name: 'rerere-autoupdate' },
  { name: 'no-rerere-autoupdate' },
  { name: 'reference' },
  { name: 'continue' },
  { name: 'skip' },
  { name: 'quit' },
  { name: 'abort' },
];

export const gitPush: readonly OptionSpec[] = [
  { name: 'all' },
  { name: 'branches' },
  { name: 'prune' },
  { name: 'mirror' },
  { name: 'dry-run', short: 'n' },
  { name: 'porcelain' },
  { name: 'delete', short: 'd' },
  { name: 'tags' },
  { name: 'follow-tags' },
  { name: 'push-option', short: 'o', arg: 'required' },
  { name: 'receive-pack', arg: 'required' },
  { name: 'exec', arg: 'required' },
  { name: 'force-with-lease', arg: 'optional' },
  { name: 'no-force-with-lease' },
  { name: 'force-if-includes' },
  { name: 'no-force-if-includes' },
  { name: 'force', short: 'f' },
  { name: 'repo', arg: 'required' },
  { name: 'set-upstream', short: 'u' },
  { name: 'quiet', short: 'q' },
  { name: 'verbose', short: 'v' },
  { name: 'progress' },
  { name: 'recurse-submodules', arg: 'required' },
  { name: 'no-recurse-submodules' },
  { name: 'verify' },
  { name: 'no-verify' },
  { name: 'signed', arg: 'optional' },
  { name: 'no-signed' },
  { name: 'atomic' },
  { name: 'no-atomic' },
  { name: 'ipv4', short: '4' },
  { name: 'ipv6', short: '6' },
  { name: 'thin' },
  { name: 'no-thin' },
];

export const gitClean: readonly OptionSpec[] = [
  { name: 'd', short: 'd', shortOnly: true },
  { name: 'force', short: 'f' },
  { name: 'interactive', short: 'i' },
  { name: 'dry-run', short: 'n' },
  { name: 'quiet', short: 'q' },
  { name: 'exclude', short: 'e', arg: 'required' },
  { name: 'x', short: 'x', shortOnly: true },
  { name: 'X', short: 'X', shortOnly: true },
];

export const gitBranch: readonly OptionSpec[] = [
  { name: 'delete', short: 'd' },
  { name: 'D', short: 'D', shortOnly: true, implies: ['delete', 'force'] },
  { name: 'create-reflog' },
  { name: 'force', short: 'f' },
  { name: 'move', short: 'm' },
  { name: 'M', short: 'M', shortOnly: true, implies: ['move', 'force'] },
  { name: 'copy', short: 'c' },
  { name: 'C', short: 'C', shortOnly: true, implies: ['copy', 'force'] },
  { name: 'color', arg: 'optional' },
  { name: 'no-color' },
  { name: 'ignore-case', short: 'i' },
  { name: 'omit-empty' },
  { name: 'column', arg: 'optional' },
  { name: 'no-column' },
  { name: 'sort', arg: 'required' },
  { name: 'remotes', short: 'r' },
  { name: 'all', short: 'a' },
  { name: 'list', short: 'l' },
  { name: 'show-current' },
  { name: 'verbose', short: 'v' },
  { name: 'quiet', short: 'q' },
  { name: 'abbrev', arg: 'required' },
  { name: 'no-abbrev' },
  { name: 'track', short: 't', arg: 'optional' },
  { name: 'no-track' },
  { name: 'recurse-submodules' },
  { name: 'set-upstream' },
  { name: 'set-upstream-to', short: 'u', arg: 'required' },
  { name: 'unset-upstream' },
  { name: 'edit-description' },
  { name: 'contains', arg: 'optional' },
  { name: 'no-contains', arg: 'optional' },
  { name: 'merged', arg: 'optional' },
  { name: 'no-merged', arg: 'optional' },
  { name: 'points-at', arg: 'required' },
  { name: 'format', arg: 'required' },
];

export const gitWorktreeAdd: readonly OptionSpec[] = [
  { name: 'force', short: 'f' },
  { name: 'detach', short: 'd' },
  { name: 'checkout' },
  { name: 'no-checkout' },
  { name: 'lock' },
  { name: 'reason', arg: 'required' },
  { name: 'orphan' },
  { name: 'quiet', short: 'q' },
  { name: 'track' },
  { name: 'no-track' },
  { name: 'guess-remote' },
  { name: 'no-guess-remote' },
  { name: 'b', short: 'b', arg: 'required', shortOnly: true },
  { name: 'B', short: 'B', arg: 'required', shortOnly: true },
];

export const gitWorktreeRemove: readonly OptionSpec[] = [{ name: 'force', short: 'f' }];

export const gitWorktreeMove: readonly OptionSpec[] = [{ name: 'force', short: 'f' }];

export const gitWorktreeList: readonly OptionSpec[] = [
  { name: 'porcelain' },
  { name: 'verbose', short: 'v' },
  { name: 'z', short: 'z', shortOnly: true },
  { name: 'expire', arg: 'required' },
];

export const gitWorktreePrune: readonly OptionSpec[] = [
  { name: 'dry-run', short: 'n' },
  { name: 'verbose', short: 'v' },
  { name: 'expire', arg: 'required' },
];
