/**
 * `pre-push` push-shape CLI: tells the hook what the push does before any gate
 * runs.
 *
 * The `.husky/pre-push` hook captures git's ref lines into a temp file and
 * calls this with `--refs-file <path>`. This is the thin IO adapter around the
 * pure {@link classifyPush}. It answers the hook on two channels:
 *
 * - **stdout carries the verdict as one exact word**, and only when the
 *   command exits {@link EXIT_OK}: {@link VERDICT_RUN_GATES} (the push sends
 *   commits, or git supplied no ref lines) or {@link VERDICT_DELETIONS_ONLY}
 *   (the push only deletes refs, so the gates have no commit to check). The
 *   hook passes a push without its gates on that second word alone, so a crash,
 *   which prints no verdict, can never waive them.
 * - **the exit code says whether there is a verdict**: {@link EXIT_OK};
 *   {@link EXIT_FAILURE} when the refs file cannot be read; {@link EXIT_USAGE}
 *   when the call named none; {@link EXIT_REFUSED} when the push deletes a ref
 *   and sends commits, which the rule `deletions-never-ride-a-push` refuses.
 *   The hook stops the push on every non-zero code.
 *
 * Explanations for a person go to stderr.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { classifyPush } from './classify-push.js';

export const EXIT_OK = 0;
export const EXIT_FAILURE = 1;
export const EXIT_USAGE = 2;
export const EXIT_REFUSED = 3;

export const VERDICT_RUN_GATES = 'run-gates';
export const VERDICT_DELETIONS_ONLY = 'deletions-only';

const USAGE = 'usage: push-shape --refs-file <path>\n';

const DELETIONS_ONLY_NOTICE =
  'push shape: this push deletes refs and sends no commits, so there is nothing for the ' +
  'pre-push gates to check.\n';

const MIXED_REFUSAL =
  'push shape: REFUSED. This push deletes a ref and sends commits to another ' +
  '(rule: deletions-never-ride-a-push).\n' +
  '  Cure: make it two pushes. Push the commits on their own, so the gates check them; ' +
  'then delete the refs in a push that sends nothing else.\n';

/** Where the command writes: the verdict word, and the lines for a person. */
export interface PushShapeOutput {
  readonly verdict: (word: string) => void;
  readonly explain: (text: string) => void;
}

/** The path given to `--refs-file`, or undefined when the flag or its value is absent. */
function refsFilePath(argv: readonly string[]): string | undefined {
  const flag = argv.indexOf('--refs-file');
  const value = flag === -1 ? undefined : argv[flag + 1];
  return value === undefined || value === '' ? undefined : value;
}

/** The refs file's text, or undefined when it cannot be read. */
function readRefs(path: string, readFile: (path: string) => string): string | undefined {
  try {
    return readFile(path);
  } catch {
    return undefined;
  }
}

/**
 * Classify the push in the named refs file and report it. Pure orchestration
 * over an injected file reader and injected output sinks.
 *
 * @returns the process exit code; a verdict is written only with {@link EXIT_OK}.
 */
export function runPushShape(
  argv: readonly string[],
  readFile: (path: string) => string,
  output: PushShapeOutput,
): number {
  const path = refsFilePath(argv);
  if (path === undefined) {
    output.explain(USAGE);
    return EXIT_USAGE;
  }
  const refsText = readRefs(path, readFile);
  if (refsText === undefined) {
    output.explain(`push shape: cannot read the refs file ${path}, so the push is not passed.\n`);
    return EXIT_FAILURE;
  }
  const shape = classifyPush(refsText);
  if (shape === 'mixed') {
    output.explain(MIXED_REFUSAL);
    return EXIT_REFUSED;
  }
  if (shape === 'deletions-only') {
    output.explain(DELETIONS_ONLY_NOTICE);
    output.verdict(VERDICT_DELETIONS_ONLY);
    return EXIT_OK;
  }
  output.verdict(VERDICT_RUN_GATES);
  return EXIT_OK;
}

const currentFilePath = fileURLToPath(import.meta.url);
if (process.argv[1] === currentFilePath) {
  process.exit(
    runPushShape(process.argv.slice(2), (path) => readFileSync(path, 'utf8'), {
      verdict: (word) => process.stdout.write(`${word}\n`),
      explain: (text) => process.stderr.write(text),
    }),
  );
}
