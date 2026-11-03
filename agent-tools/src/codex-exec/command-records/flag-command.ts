import {
  assignmentsEnd,
  endsOptions,
  gitSubcommands,
  isWrapper,
  placesOf,
} from './command-places.js';
import { SHAPES, type ForbiddenShape, type ShapeKind } from './forbidden-shapes.js';
import { basename, isAssignment } from '../../shell/interpreter-script.js';
import { redirectionWordKind } from '../../shell/redirections.js';

import type { Command } from './shell-commands.js';

/**
 * The forbidden shapes of `.codex/rules/seat-landing.rules`, matched against
 * one shell segment, and the allowlist rendering of a segment for a summary.
 *
 * Matching is wider than the harness's: the exec policy matches a rule's
 * pattern as a positional prefix, while this reader finds the program after
 * leading assignments, wrappers and redirections, finds git's subcommand past
 * its own options and redirections (the command-places module reads where
 * they sit), and then matches the rule's tokens after the subcommand, a
 * short-option cluster included (`git commit -F m --no-verify`,
 * `git commit -an`). So a shape that the policy would refuse is found even
 * when it ran in a form the policy's prefix never saw. Git's grammar puts
 * options before a bare `--` and pathspecs after it, so an option-shaped
 * token is matched before the bare `--` that ends options only (a pathspec
 * literally named `-A` is a file), while the whole-tree pathspec `.` is found
 * on either side of it. The values of the subcommand's own options are not
 * read, so a `--` given as one ends options here although git reads the
 * token after it as an option (`git commit -m -- -n`): a residual. The shapes
 * themselves live in the forbidden-shapes module.
 */

/** A shape found in a segment, with the token that matched. */
export interface Hit {
  readonly kind: ShapeKind;
  /** The rule's own token (a cluster carrying the rule's letter reports that letter's option), or the subcommand: never a value. */
  readonly token: string;
}

const CLUSTER = /^-[A-Za-z]+$/;

/** The rule token an option-shaped token matches: itself when it is one, the letter's option when a short-option cluster carries the shape's letter, else none. */
function optionToken(shape: ForbiddenShape, token: string): string | undefined {
  if (token.startsWith('-') && shape.tokens.includes(token)) {
    return token;
  }
  if (
    shape.clusterLetter !== undefined &&
    CLUSTER.test(token) &&
    token.includes(shape.clusterLetter)
  ) {
    return `-${shape.clusterLetter}`;
  }
  return undefined;
}

/** Whether a token is one of the shape's pathspec tokens (the whole tree, `.`). */
function matchesPathspec(shape: ForbiddenShape, token: string): boolean {
  return !token.startsWith('-') && shape.tokens.includes(token);
}

/**
 * The shape's rule token in the arguments from each index on: the first
 * option before the bare `--` that ends options, else the first pathspec
 * anywhere. Folded from the end, so every place a subcommand may sit is read
 * in one pass.
 */
function tokensFrom(shape: ForbiddenShape, segment: Command): readonly (string | undefined)[] {
  const tokens: (string | undefined)[] = [];
  let option: string | undefined;
  let pathspec: string | undefined;
  for (let index = segment.length - 1; index >= 0; index -= 1) {
    const token = segment[index] ?? '';
    option = endsOptions(segment, index) ? undefined : (optionToken(shape, token) ?? option);
    pathspec = matchesPathspec(shape, token) ? token : pathspec;
    tokens[index] = option ?? pathspec;
  }
  return tokens;
}

/** The forbidden shape a git segment carries, at most one hit per segment, over every place its subcommand may sit. */
export function flagCommand(segment: Command): readonly Hit[] {
  const folded = new Map<ForbiddenShape, readonly (string | undefined)[]>();
  for (const subcommand of gitSubcommands(segment)) {
    const name = segment[subcommand] ?? '';
    const shape = SHAPES.find((candidate) => candidate.subcommand === name);
    if (shape !== undefined && shape.tokens.length === 0) {
      return [{ kind: shape.kind, token: name }];
    }
    if (shape !== undefined) {
      const tokens = folded.get(shape) ?? tokensFrom(shape, segment);
      folded.set(shape, tokens);
      const token = tokens[subcommand + 1];
      if (token !== undefined) {
        return [{ kind: shape.kind, token }];
      }
    }
  }
  return [];
}

/** A token before the program: an assignment's name in the leading run of assignments (before `assignments`), a wrapper's name, an option's letter, or nothing; a bare operator's target, or an option's value shaped like an assignment, is nothing. */
function renderLeading(segment: Command, index: number, assignments: number): string {
  const token = segment[index] ?? '';
  if (index < assignments && isAssignment(token)) {
    return `${token.slice(0, token.indexOf('=') + 1)}<value>`;
  }
  if (redirectionWordKind(segment[index - 1] ?? '') === 'operator') {
    return '<arg>';
  }
  if (isWrapper(token)) {
    return basename(token);
  }
  return token.startsWith('-') ? renderTrailing(token) : '<arg>';
}

/** The subcommands a summary prints by name: the rules' own and no other. */
const NAMED_SUBCOMMANDS: ReadonlySet<string> = new Set(SHAPES.map((shape) => shape.subcommand));

/** The flags a summary prints by name: the rules' own tokens and no other. */
const NAMED_FLAGS: ReadonlySet<string> = new Set(
  SHAPES.flatMap((shape) => shape.tokens.filter((token) => token.startsWith('-'))),
);

/** A token after the program: a rule's flag by name, any other long flag as `--<flag>`, any other short option or cluster as `-<flag>`, or nothing. */
function renderTrailing(token: string): string {
  if (token === '--') {
    return token;
  }
  const name = token.split('=')[0] ?? token;
  if (NAMED_FLAGS.has(name)) {
    return name;
  }
  if (token.startsWith('--')) {
    return '--<flag>';
  }
  return token.startsWith('-') && token.length > 1 ? '-<flag>' : '<arg>';
}

/** Where a rendering places a segment's program, git's subcommand, and the first positional token. */
interface RenderPlaces {
  readonly assignments: number;
  readonly program: number;
  readonly subcommand: number | undefined;
  readonly positional: number;
}

/** The program as a summary prints it: `git` when it is git, a flag placeholder when a reading placed an option there (`> git -C/dir push`), else `<arg>`, since every shape is git's and any other program is a word another reading placed there (`exec -a name git push`). */
function renderProgram(token: string): string {
  if (token.startsWith('-')) {
    return renderTrailing(token);
  }
  return basename(token) === 'git' ? 'git' : '<arg>';
}

/** One token of a segment as a summary prints it. */
function renderToken(segment: Command, index: number, places: RenderPlaces): string {
  const token = segment[index] ?? '';
  if (index === places.subcommand) {
    return NAMED_SUBCOMMANDS.has(token) ? token : '<arg>';
  }
  if (index < places.program) {
    return renderLeading(segment, index, places.assignments);
  }
  if (index === places.program) {
    return renderProgram(token);
  }
  return index > places.positional ? '<arg>' : renderTrailing(token);
}

/**
 * A segment by allowlist: `git` when the program is git, git's subcommand
 * when it names a forbidden shape, an assignment's name in the shell's
 * leading run of assignments, the rules' own flags by name, every other long
 * flag as `--<flag>` and every other short option or cluster as `-<flag>`,
 * and `<arg>` for every other token, every redirection and its target
 * included, and every token after the bare `--` that ends options. The
 * program is placed with every redirection given its target, so a
 * redirection's path never prints as a program; where that reading differs
 * from the one a shape was found under, an option in the program's place
 * prints as a flag placeholder, and any other program or a subcommand that
 * names no shape as `<arg>`. A value shaped like a flag (a message beginning `-` or `--`)
 * prints as a flag placeholder too. No value, path, message, URL or letter
 * of one that a seat typed is printed.
 */
export function renderSegment(segment: Command): string {
  const { program, subcommand } = placesOf(segment);
  const dash = segment.findIndex((_, index) => index > program && endsOptions(segment, index));
  const places = {
    assignments: assignmentsEnd(segment),
    program,
    subcommand,
    positional: dash === -1 ? segment.length : dash,
  };
  return segment.map((_, index) => renderToken(segment, index, places)).join(' ');
}
