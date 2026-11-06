#!/usr/bin/env node

/**
 * Core ADR-citation validator: no file under `.agent/practice-core/` carries
 * an ADR identifier (PDR-105's portability axis; the `practice-core-portability`
 * rule).
 *
 * Scans every tracked Core file for the written ADR citation and refuses each
 * one it finds (see the helpers module for what counts as a citation). The gate
 * is strict: nothing exempts a citation.
 *
 * Wired into root `docs-validators:check`, which runs in `pnpm check`,
 * `pnpm check:docs` and CI. Exit 0 = clean; 1 = findings; 2 = refusal (a
 * listing git could not give, no tracked Core file, or a Core file unreadable
 * or not scannable as text). The
 * status is returned from `main` and set on `process.exitCode`, so buffered
 * diagnostics reach a pipe before the process ends.
 *
 * @packageDocumentation
 */

import { resolveRepoRoot } from '../../core/repo-root.js';
import { writeErrorLine, writeLine } from '../../core/terminal-output.js';

import { readCore } from './read-core.js';
import { findCoreCitations, type CoreCitation } from './validate-core-adr-citations-helpers.js';

const NAME = 'validate-core-adr-citations';

function refuse(reason: string): number {
  writeErrorLine(`${NAME}: ${reason}`);
  return 2;
}

/** Every citation as `path:line:column  text`, then the cure. */
function reportCitations(citations: readonly CoreCitation[]): void {
  writeErrorLine(`✖ ${String(citations.length)} ADR citation(s) in the Core:`);
  for (const citation of citations) {
    writeErrorLine(
      `  ${citation.file}:${String(citation.line)}:${String(citation.column)}  ${citation.text}`,
    );
  }
  writeErrorLine('');
  writeErrorLine(
    'The Core travels to repositories where the ADR does not exist (PDR-105; the ' +
      'practice-core-portability rule). Name the concept the ADR records in place of its ' +
      'number, and never delete the sentence (PDR-079).',
  );
}

function main(): number {
  // projectDir is explicitly disabled: this validator reads the tree it runs
  // inside. The CLAUDE_PROJECT_DIR leg would rebind a worktree invocation to
  // the primary checkout and report the wrong estate green.
  const repoRoot = resolveRepoRoot(import.meta.url, { projectDir: undefined });
  const core = readCore(repoRoot);
  if (!core.ok) {
    return refuse(core.error);
  }
  const citations = findCoreCitations(core.value);
  if (citations.length > 0) {
    reportCitations(citations);
    return 1;
  }
  writeLine(`✓ no ADR citations in ${String(core.value.length)} Core files`);
  return 0;
}

process.exitCode = main();
