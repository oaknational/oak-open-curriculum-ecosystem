#!/usr/bin/env node
/**
 * CLI for the skills adapter generator.
 *
 * Usage:
 *   skills-adapter-generate            # generate adapters into the current repo
 *   skills-adapter-generate --check    # exit non-zero if any adapter is stale
 *   skills-adapter-generate --clear    # clear all adapter dirs before generating
 */
import { argv, exit, stderr, stdout } from 'node:process';

import { clearGeneratedAdapters, generateAdapters } from '../skills-adapter-generate/generator.js';

interface CliFlags {
  readonly clear: boolean;
  readonly check: boolean;
  readonly prefix: string;
}

function parseFlags(args: readonly string[]): CliFlags {
  let clear = false;
  let check = false;
  let prefix = 'jc-';
  for (const arg of args) {
    if (arg === '--clear') {
      clear = true;
    } else if (arg === '--check') {
      check = true;
    } else if (arg.startsWith('--prefix=')) {
      prefix = arg.slice('--prefix='.length);
    }
  }
  return { clear, check, prefix };
}

async function main(): Promise<number> {
  const flags = parseFlags(argv.slice(2));
  const repoRoot = process.cwd();

  if (flags.clear) {
    await clearGeneratedAdapters(repoRoot);
    stdout.write('Cleared adapter directories.\n');
  }

  const outcome = await generateAdapters({ repoRoot, prefix: flags.prefix });

  stdout.write(`Wrote ${String(outcome.written.length)} adapter files.\n`);
  if (outcome.skipped.length > 0) {
    stderr.write(`Skipped (no canonical SKILL): ${outcome.skipped.join(', ')}\n`);
  }
  return 0;
}

main()
  .then((code) => exit(code))
  .catch((error: unknown) => {
    stderr.write(`skills-adapter-generate failed: ${String(error)}\n`);
    exit(1);
  });
