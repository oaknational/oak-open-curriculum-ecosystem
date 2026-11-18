import {
  isMap,
  isPair,
  isScalar,
  isSeq,
  LineCounter,
  parseDocument,
  Scalar,
  visit,
  type Document,
  type Node,
  type Pair,
} from 'yaml';

import { joinContinuations, type CommandLine, type CommandSurface } from './command-surfaces.js';

/**
 * The shell commands of a CI workflow: the value of every step's `run` key,
 * as YAML reads it, one command per line of that value. Nothing else in a
 * workflow runs, so a step's `name` that mentions pnpm is not a command.
 * YAML's own folding decides the lines: a folded `run: >` value joins its
 * lines with spaces and keeps a line break at a blank or more-indented line,
 * so two commands the shell runs apart are never read as one.
 *
 * @packageDocumentation
 */

type VisitPath = readonly (Document | Node | Pair)[];

/** Whether a node is a scalar holding `name`. */
function isScalarOf(node: unknown, name: string): boolean {
  return isScalar(node) && node.value === name;
}

/** Whether a visit path ends in a map that is an item of a `steps` sequence. */
function endsInStep(path: VisitPath): boolean {
  const [steps, sequence, step] = path.slice(-3);
  return isPair(steps) && isScalarOf(steps.key, 'steps') && isSeq(sequence) && isMap(step);
}

/** The string value of a step's `run` key. */
function stepRunValue(pair: Pair, path: VisitPath): Scalar | undefined {
  return isScalarOf(pair.key, 'run') &&
    endsInStep(path) &&
    isScalar(pair.value) &&
    typeof pair.value.value === 'string'
    ? pair.value
    : undefined;
}

/**
 * One run value's commands. A literal block's lines are numbered exactly; a
 * folded or single-line value's commands all carry the line its text starts
 * on, since folding leaves no one-to-one map from its lines to the file's.
 */
function commandsOfRun(value: Scalar, lineCounter: LineCounter): readonly CommandLine[] {
  const start = lineCounter.linePos(value.range?.[0] ?? 0).line;
  const literal = value.type === Scalar.BLOCK_LITERAL;
  const first = literal || value.type === Scalar.BLOCK_FOLDED ? start + 1 : start;
  const lines = String(value.value)
    .split('\n')
    .map((text, index) => ({ line: literal ? first + index : first, text }));
  return joinContinuations(lines);
}

/**
 * The command surface of a CI workflow.
 *
 * @param path - The workflow's repo-relative path.
 * @param content - The workflow's text.
 * @throws When the text is not valid YAML, which the gate would not run either.
 */
export function workflowSurface(path: string, content: string): CommandSurface {
  const lineCounter = new LineCounter();
  const document = parseDocument(content, { lineCounter });
  const [error] = document.errors;
  if (error !== undefined) {
    throw new Error(`${path} is not valid YAML: ${error.message}`);
  }
  const lines: CommandLine[] = [];
  visit(document, {
    Pair(_key, pair, visitPath) {
      const value = stepRunValue(pair, visitPath);
      if (value !== undefined) {
        lines.push(...commandsOfRun(value, lineCounter));
      }
    },
  });
  return { path, lines };
}
