/**
 * The forbidden shapes of `.codex/rules/seat-landing.rules`: the file's
 * forbidden `prefix_rule`s, carried here verbatim with their justifications.
 * Pairing is by pattern, since the rules are anonymous. The consolidation
 * validator asserting the file's forbidden patterns equal this table is its
 * own lane.
 */

/** One forbidden shape, named for the summary. */
export type ShapeKind =
  'stage-whole-tree' | 'commit-rewrites-or-skips-hooks' | 'push-outside-the-bot';

export interface ForbiddenShape {
  readonly kind: ShapeKind;
  /** The rule's pattern: `git`, this subcommand, then any of `tokens`. */
  readonly subcommand: string;
  /** The rule's trailing alternatives; empty when the subcommand alone is the shape. */
  readonly tokens: readonly string[];
  /** The letter that carries one of `tokens` inside a short-option cluster such as `-an`. */
  readonly clusterLetter: string | undefined;
  /** The rule's justification, verbatim. */
  readonly justification: string;
}

export const SHAPES: readonly ForbiddenShape[] = [
  {
    kind: 'stage-whole-tree',
    subcommand: 'add',
    tokens: ['-A', '--all', '.'],
    clusterLetter: 'A',
    justification: 'Stage by explicit pathspec, never the whole tree.',
  },
  {
    kind: 'commit-rewrites-or-skips-hooks',
    subcommand: 'commit',
    tokens: ['--amend', '--no-verify', '-n'],
    clusterLetter: 'n',
    justification: 'Never skip the hooks and never rewrite a commit: make a new commit instead.',
  },
  {
    kind: 'push-outside-the-bot',
    subcommand: 'push',
    tokens: [],
    clusterLetter: undefined,
    justification:
      'Push with `pnpm agent-tools merge-bot push --branch <branch>`, which refuses force and default branches.',
  },
];

/** The rule's justification for a shape, verbatim. */
export function justificationOf(kind: ShapeKind): string {
  return SHAPES.find((shape) => shape.kind === kind)?.justification ?? '';
}
