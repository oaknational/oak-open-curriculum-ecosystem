#!/usr/bin/env node
/**
 * CI entry point: reads the pull request's changed paths on stdin and writes
 * the `docs_only` job output.
 *
 * Stdin is `git diff --name-only -z` output (NUL-separated paths). The
 * verdict goes to `$GITHUB_OUTPUT` as `docs_only=true` or `docs_only=false`,
 * and a `::notice` on stderr says which and why. A local run with no
 * `GITHUB_OUTPUT` prints the notice only. The script always exits 0 once it
 * has a verdict; a failure to read stdin or write the output exits non-zero.
 * It cannot see whether the command feeding it failed: the workflow step sets
 * `shell: bash` so that `pipefail` fails the step in that case, and an empty
 * list reads as not docs-only either way.
 *
 * @packageDocumentation
 */

import { appendFile } from 'node:fs/promises';
import { text } from 'node:stream/consumers';

import { isDocsOnlyChange, parseChangedPaths } from './ci-docs-only.js';

const paths = parseChangedPaths(await text(process.stdin));
const docsOnly = isDocsOnlyChange(paths);

const outputPath = process.env.GITHUB_OUTPUT;
if (outputPath !== undefined && outputPath !== '') {
  await appendFile(outputPath, `docs_only=${String(docsOnly)}\n`);
}

const reason = docsOnly
  ? `all ${String(paths.length)} changed paths are Markdown under .agent or docs; browser-tests is skipped`
  : `${String(paths.length)} changed paths, not all Markdown under .agent or docs; every gate runs`;
process.stderr.write(`::notice title=Change scope::docs_only=${String(docsOnly)}: ${reason}\n`);
