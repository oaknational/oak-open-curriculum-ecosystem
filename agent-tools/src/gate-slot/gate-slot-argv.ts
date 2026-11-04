/** What the gate-slot command line asks for. */
export type GateSlotCommand =
  | { readonly kind: 'help' }
  | { readonly kind: 'status' }
  | { readonly kind: 'run'; readonly pnpmArgs: readonly string[] }
  | { readonly kind: 'usage-error'; readonly message: string };

const HELP_FLAGS: ReadonlySet<string> = new Set(['--help', '-h']);

/**
 * Parse the gate-slot arguments. `run` takes one form only, a pnpm command
 * (`run pnpm check`): every gate is a pnpm command, so the gate child is
 * always the trusted pnpm binary rather than whatever `PATH` finds. This is
 * not a security boundary (`pnpm exec` runs anything). Every argument after
 * `pnpm` belongs to pnpm, flags included.
 */
export function parseGateSlotArgv(argv: readonly string[]): GateSlotCommand {
  const [subcommand, ...rest] = argv;
  if (subcommand === undefined) {
    return { kind: 'usage-error', message: 'a subcommand is required' };
  }
  if (HELP_FLAGS.has(subcommand) && rest.length === 0) {
    return { kind: 'help' };
  }
  if (subcommand === 'status') {
    return parseStatus(rest);
  }
  if (subcommand === 'run') {
    return parseRun(rest);
  }

  return { kind: 'usage-error', message: `unknown subcommand: ${subcommand}` };
}

function parseStatus(rest: readonly string[]): GateSlotCommand {
  return rest.length === 0
    ? { kind: 'status' }
    : { kind: 'usage-error', message: 'status takes no arguments' };
}

function parseRun(rest: readonly string[]): GateSlotCommand {
  const [program, ...pnpmArgs] = rest;
  if (program !== 'pnpm' || pnpmArgs.length === 0) {
    return { kind: 'usage-error', message: 'run takes a pnpm command: run pnpm <args>' };
  }

  return { kind: 'run', pnpmArgs };
}
