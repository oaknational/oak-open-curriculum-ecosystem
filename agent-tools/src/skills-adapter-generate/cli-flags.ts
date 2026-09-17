/**
 * Flag parsing for the skills-adapter-generate CLI, extracted so the
 * contract is unit-testable: unknown arguments REFUSE (a typo like
 * `--chekc` must never silently select the destructive generate path),
 * `--help` is first-class, and `--prefix` is required — this estate pins
 * `oak-` via the root `pnpm skills:generate` / `pnpm skills:check`
 * scripts, and an unpinned run would mint a second, unprefixed skill
 * estate the pinned checker never inspects.
 */

export interface CliFlags {
  readonly clear: boolean;
  readonly check: boolean;
  readonly prefix: string;
}

export type ParseCliFlagsResult =
  | { readonly kind: 'ok'; readonly flags: CliFlags }
  | { readonly kind: 'help' }
  | { readonly kind: 'error'; readonly message: string };

export const CLI_USAGE = [
  'Usage: skills-adapter-generate --prefix=<prefix> [--check] [--clear]',
  '  --prefix=<prefix>  REQUIRED adapter name prefix (this estate pins oak- via',
  '                     the root `pnpm skills:generate` / `pnpm skills:check`)',
  '  --check            report drift and exit non-zero instead of writing',
  '  --clear            clear generated adapter directories before generating',
  '  --help             show this usage',
].join('\n');

export function parseCliFlags(args: readonly string[]): ParseCliFlagsResult {
  let clear = false;
  let check = false;
  let prefix = '';
  for (const arg of args) {
    if (arg === '--help' || arg === '-h') {
      return { kind: 'help' };
    } else if (arg === '--clear') {
      clear = true;
    } else if (arg === '--check') {
      check = true;
    } else if (arg.startsWith('--prefix=')) {
      prefix = arg.slice('--prefix='.length);
    } else {
      return {
        kind: 'error',
        message: `unrecognised argument: ${arg} — refusing to guess on a destructive CLI`,
      };
    }
  }
  const prefixError = validatePrefix(prefix);
  if (prefixError !== undefined) {
    return { kind: 'error', message: prefixError };
  }
  return { kind: 'ok', flags: { clear, check, prefix } };
}

/** The prefix steers BOTH the write target and the sweep's expected-set: a
 * traversal value like `--prefix=../../` recursively deletes the real
 * projection estate and writes outside the repo (security round,
 * 2026-08-11). A prefix is a name fragment, never a path. */
function validatePrefix(prefix: string): string | undefined {
  if (prefix === '') {
    return (
      '--prefix is required (this estate pins `--prefix=oak-` via the root ' +
      '`pnpm skills:generate` / `pnpm skills:check` scripts). An unprefixed run would ' +
      'mint a second skill estate the pinned checker never inspects.'
    );
  }
  if (/[/\\]/.test(prefix) || prefix.includes('..') || prefix.startsWith('.')) {
    return `--prefix must be a plain name fragment (no path separators, no '..', no leading '.'): ${prefix}`;
  }
  return undefined;
}
