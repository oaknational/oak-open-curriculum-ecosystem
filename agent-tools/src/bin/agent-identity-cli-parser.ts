/**
 * Supported output formats for the `agent-identity` CLI.
 */
export type AgentIdentityFormat = 'kebab' | 'display' | 'json';

/**
 * Parsed command-line arguments for `agent-identity`.
 */
export interface ParsedAgentIdentityArgs {
  /** Whether help output was requested. */
  readonly helpRequested: boolean;
  /** Explicit seed supplied with `--seed`, when present. */
  readonly seed?: string;
  /** Output format requested by the operator. */
  readonly format: AgentIdentityFormat;
}

/**
 * Generic parse success or failure result.
 */
export type ParseResult =
  | {
      readonly kind: 'ok';
      readonly value: ParsedAgentIdentityArgs;
    }
  | {
      readonly kind: 'error';
      readonly message: string;
    };

/**
 * Generic string resolution success or failure result.
 */
export type SeedResult =
  | {
      readonly kind: 'ok';
      readonly value: string;
    }
  | {
      readonly kind: 'error';
      readonly message: string;
    };

interface MutableParsedAgentIdentityArgs {
  helpRequested: boolean;
  seed: string | undefined;
  format: AgentIdentityFormat;
}

/**
 * Parse `agent-identity` argv without reading globals or exiting.
 *
 * @param argv - Arguments excluding `node` and the script path.
 * @returns Parsed arguments or a bad-usage error.
 */
export function parseAgentIdentityArgs(argv: readonly string[]): ParseResult {
  const values = [...argv];
  const parsed: MutableParsedAgentIdentityArgs = {
    helpRequested: false,
    seed: undefined,
    format: 'kebab',
  };

  while (values.length > 0) {
    const current = values.shift();
    const result = handleArgument(current, values, parsed);
    if (result.kind === 'error') {
      return result;
    }
  }

  return {
    kind: 'ok',
    value: toParsedArgs(parsed),
  };
}

function toParsedArgs(parsed: MutableParsedAgentIdentityArgs): ParsedAgentIdentityArgs {
  if (parsed.seed === undefined) {
    return {
      helpRequested: parsed.helpRequested,
      format: parsed.format,
    };
  }

  return {
    helpRequested: parsed.helpRequested,
    seed: parsed.seed,
    format: parsed.format,
  };
}

function handleArgument(
  current: string | undefined,
  values: string[],
  parsed: MutableParsedAgentIdentityArgs,
): SeedResult {
  if (current === undefined) {
    return ok('');
  }
  if (current === '--help' || current === '-h') {
    parsed.helpRequested = true;
    return ok(current);
  }
  if (current === '--seed') {
    return handleSeedFlag(values, parsed);
  }
  if (current === '--format') {
    return handleFormatFlag(values, parsed);
  }
  return error(`unknown argument '${current}'`);
}

function handleSeedFlag(values: string[], parsed: MutableParsedAgentIdentityArgs): SeedResult {
  const value = readFlagValue(values, '--seed');
  if (value.kind === 'ok') {
    parsed.seed = value.value;
  }
  return value;
}

function handleFormatFlag(values: string[], parsed: MutableParsedAgentIdentityArgs): SeedResult {
  const value = readFlagValue(values, '--format');
  if (value.kind === 'error') {
    return value;
  }
  const format = parseFormat(value.value);
  if (format.kind === 'ok') {
    parsed.format = format.value;
  }
  return format;
}

function readFlagValue(values: string[], flag: string): SeedResult {
  const value = values.shift();
  if (value === undefined || value.trim().length === 0 || value.startsWith('--')) {
    return error(`flag '${flag}' requires a value`);
  }
  return ok(value);
}

function parseFormat(value: string): SeedResultFormat {
  if (value === 'kebab' || value === 'display' || value === 'json') {
    return {
      kind: 'ok',
      value,
    };
  }
  return {
    kind: 'error',
    message: `unsupported format '${value}'; expected kebab, display, or json`,
  };
}

type SeedResultFormat =
  | {
      readonly kind: 'ok';
      readonly value: AgentIdentityFormat;
    }
  | {
      readonly kind: 'error';
      readonly message: string;
    };

function ok(value: string): SeedResult {
  return {
    kind: 'ok',
    value,
  };
}

function error(message: string): SeedResult {
  return {
    kind: 'error',
    message,
  };
}
