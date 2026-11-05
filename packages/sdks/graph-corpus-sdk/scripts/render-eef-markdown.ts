#!/usr/bin/env node

/**
 * Writes the EEF corpus markdown projection — the corpus reference and one
 * file per strand — into a directory of the caller's choice. The rendering
 * itself is the pure `renderEefMarkdownFiles` in `src/`; this script only
 * writes, then verifies.
 *
 * Containment (the mechanism lives in `write-contained.ts`): the output root
 * must sit inside the directory the command runs from (`process.cwd()`: this
 * package's directory under `pnpm --filter … render:eef-markdown`, or wherever
 * `pnpm exec tsx` is run) — checked lexically before anything is created,
 * canonically through its nearest existing ancestor before it is created, and
 * canonically once it exists; every target directory gets the same checks, and
 * every target is written only through a descriptor verified to be a
 * single-link regular file, so anything else in a target's place is refused.
 * Every written file is then checked against this repository's own formatter
 * configuration (resolved from the script's location, never from the output
 * directory), so a drift between the renderer's normal form and the
 * repository's formatter settings fails here rather than in a consumer's gate.
 *
 * The script only writes. A file an earlier render produced that the current
 * corpus no longer does (a renamed or withdrawn strand) stays in the output
 * directory until the caller removes it, so a consumer that commits the set
 * renders into an empty directory or clears it first.
 *
 * Usage: `pnpm render:eef-markdown --out <directory>` from this package, or
 * `pnpm exec tsx packages/sdks/graph-corpus-sdk/scripts/render-eef-markdown.ts --out <directory>`
 * from the repository root. `<directory>` resolves against, and must stay
 * inside, the directory the command runs from.
 */

import { resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { check, resolveConfig, type Options } from 'prettier';
import {
  renderEefMarkdownFiles,
  type RenderedMarkdownFile,
} from '../src/eef-strands/eef-markdown-files.js';
import { ensureContainedDirectory, type Refusal, writeContained } from './write-contained.js';

/** This repository's formatter configuration, resolved from where this script lives. */
async function repositoryFormatterOptions(): Promise<Options | null> {
  return resolveConfig(fileURLToPath(import.meta.url));
}

/**
 * Resolve `--out` against the working directory and refuse it outside that
 * directory: lexically before anything is created, canonically through its
 * nearest existing ancestor, and canonically once it exists.
 */
function containedOutputRoot(outArgument: string): string | Refusal {
  const base = process.cwd();
  const candidate = resolve(base, outArgument);
  if (candidate !== base && !candidate.startsWith(`${base}${sep}`)) {
    return { refused: `--out '${outArgument}' resolves outside the working directory '${base}'` };
  }
  return ensureContainedDirectory(candidate, base);
}

/**
 * Write every rendered file and verify each against the formatter options.
 *
 * @returns The paths of files not in the formatter's normal form, or the refusal that stopped the run.
 */
async function writeAndVerify(
  outputRoot: string,
  files: readonly RenderedMarkdownFile[],
  options: Options,
): Promise<readonly string[] | Refusal> {
  const notNormal: string[] = [];
  for (const file of files) {
    const written = writeContained(outputRoot, file);
    if (typeof written !== 'string') {
      return written;
    }
    if (!(await check(file.text, { ...options, parser: 'markdown' }))) {
      notNormal.push(file.path);
    }
  }
  return notNormal;
}

function fail(message: string): void {
  process.stderr.write(`render-eef-markdown: ${message}\n`);
  process.exitCode = 1;
}

async function main(outArgument: string): Promise<void> {
  const options = await repositoryFormatterOptions();
  if (options === null) {
    fail('the repository formatter configuration was not found');
    return;
  }
  const outputRoot = containedOutputRoot(outArgument);
  if (typeof outputRoot !== 'string') {
    fail(outputRoot.refused);
    return;
  }
  const files = renderEefMarkdownFiles();
  const outcome = await writeAndVerify(outputRoot, files, options);
  if ('refused' in outcome) {
    fail(outcome.refused);
    return;
  }
  if (outcome.length > 0) {
    fail(
      `wrote ${String(files.length)} files to ${outputRoot}, but ${String(outcome.length)} are not in the repository formatter's normal form: ${outcome.join(', ')}`,
    );
    return;
  }
  process.stdout.write(
    `wrote ${String(files.length)} files to ${outputRoot}; all in the repository formatter's normal form\n`,
  );
}

const { values } = parseArgs({ options: { out: { type: 'string' } }, strict: true });
const outArgument = values.out?.trim() ?? '';

if (outArgument === '') {
  process.stderr.write('usage: render-eef-markdown --out <directory>\n');
  process.exitCode = 2;
} else {
  try {
    await main(outArgument);
  } catch (error) {
    fail(error instanceof Error ? error.message : String(error));
  }
}
