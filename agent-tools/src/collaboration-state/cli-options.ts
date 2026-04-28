export interface Options {
  readonly command: string | undefined;
  readonly topic: string | undefined;
  readonly values: ReadonlyMap<string, string>;
  readonly files: readonly string[];
}

export function parseOptions(argv: readonly string[]): Options {
  const normalizedArgv = argv[0] === '--' ? argv.slice(1) : argv;
  const [command, possibleTopic] = normalizedArgv;
  const topic = possibleTopic?.startsWith('--') === false ? possibleTopic : undefined;
  const rest = topic === undefined ? normalizedArgv.slice(1) : normalizedArgv.slice(2);
  const values = new Map<string, string>();
  const files: string[] = [];

  for (let index = 0; index < rest.length; index += 1) {
    const token = rest[index];
    const next = rest[index + 1];
    if (token === '--file') {
      files.push(requireFlagValue(token, next));
      index += 1;
    } else if (token.startsWith('--')) {
      values.set(token.slice(2), requireFlagValue(token, next));
      index += 1;
    } else {
      throw new Error(`unknown argument: ${token}`);
    }
  }

  return { command, topic, values, files };
}

export function required(options: Options, key: string): string {
  const value = optional(options, key);
  if (value === undefined) {
    throw new Error(`missing required option --${key}`);
  }

  return value;
}

export function optional(options: Options, key: string): string | undefined {
  return options.values.get(key);
}

export function valueOrDefault(options: Options, key: string, fallback: string): string {
  return optional(options, key) ?? fallback;
}

function requireFlagValue(flag: string, value: string | undefined): string {
  if (value === undefined || value.startsWith('--')) {
    throw new Error(`flag '${flag}' requires a value`);
  }

  return value;
}
