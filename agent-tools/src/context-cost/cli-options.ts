export interface ContextCostOptions {
  readonly globs: readonly string[];
  readonly json: boolean;
  readonly help: boolean;
}

export type ParseResult =
  | { readonly ok: true; readonly options: ContextCostOptions }
  | { readonly ok: false; readonly error: string };

interface MutableContextCostOptions {
  globs: string[];
  json: boolean;
  help: boolean;
}

type FlagHandler = (state: MutableContextCostOptions) => void;
type ValueHandler = (state: MutableContextCostOptions, value: string) => void;

const FLAG_HANDLERS: Readonly<Record<string, FlagHandler>> = {
  '--json': (state) => {
    state.json = true;
  },
  '--help': (state) => {
    state.help = true;
  },
  '-h': (state) => {
    state.help = true;
  },
};

const VALUE_HANDLERS: Readonly<Record<string, ValueHandler>> = {
  '--glob': (state, value) => {
    state.globs.push(value);
  },
};

export const CONTEXT_COST_HELP_TEXT = [
  'context-cost --glob <pattern> [--glob <pattern> ...] [--json]',
  '',
  'Estimate token cost over a fileset using the chars/4 baseline tokenizer.',
  'Token estimate is approximate (~10-15% accuracy band against real tokenizers',
  'for English-prose markdown). See .agent/analysis/practice-context-cost-baseline.md',
  'for methodology.',
  '',
  'Options:',
  '  --glob <pattern>   File glob to include. Repeatable. Required unless --help.',
  '  --json             Emit machine-readable JSON to stdout instead of tab-',
  '                     separated text. Warnings still go to stderr.',
  '  -h, --help         Show this help.',
  '',
  'Examples:',
  "  agent-tools context-cost --glob '.agent/rules/*.md'",
  "  agent-tools context-cost --glob '.agent/skills/**/SKILL.md' --glob '.agent/skills/**/SKILL-CANONICAL.md'",
  "  agent-tools context-cost --glob '.agent/rules/*.md' --json",
].join('\n');

export function parseArgs(argv: readonly string[]): ParseResult {
  const state: MutableContextCostOptions = {
    globs: [],
    json: false,
    help: false,
  };

  try {
    let index = 0;
    while (index < argv.length) {
      const consumedIndex = consumeArg({ argv, index, state });
      index = consumedIndex + 1;
    }

    if (state.help) {
      return { ok: true, options: state };
    }

    if (state.globs.length === 0) {
      return { ok: false, error: `--glob is required\n\n${CONTEXT_COST_HELP_TEXT}` };
    }

    return { ok: true, options: state };
  } catch (error) {
    return { ok: false, error: `${error instanceof Error ? error.message : String(error)}` };
  }
}

function consumeArg(input: {
  readonly argv: readonly string[];
  readonly index: number;
  readonly state: MutableContextCostOptions;
}): number {
  const arg = input.argv[input.index];

  if (arg === '--') {
    return input.argv.length;
  }

  if (consumeFlag(input.state, arg)) {
    return input.index;
  }

  const valueHandler = getValueHandler(arg);
  if (valueHandler !== undefined) {
    const nextIndex = input.index + 1;
    valueHandler(input.state, requireValue(input.argv, nextIndex, arg ?? ''));
    return nextIndex;
  }

  if (arg?.startsWith('--')) {
    throw new Error(`unknown option: ${arg}\n\n${CONTEXT_COST_HELP_TEXT}`);
  }

  throw new Error(`unexpected positional argument: ${arg ?? ''}\n\n${CONTEXT_COST_HELP_TEXT}`);
}

function consumeFlag(state: MutableContextCostOptions, arg: string | undefined): boolean {
  const handler = FLAG_HANDLERS[arg ?? ''];
  if (handler === undefined) {
    return false;
  }

  handler(state);
  return true;
}

function getValueHandler(arg: string | undefined): ValueHandler | undefined {
  return VALUE_HANDLERS[arg ?? ''];
}

function requireValue(argv: readonly string[], index: number, option: string): string {
  const value = argv[index];
  if (value === undefined || value.startsWith('--')) {
    throw new Error(`${option} requires a value\n\n${CONTEXT_COST_HELP_TEXT}`);
  }
  return value;
}
