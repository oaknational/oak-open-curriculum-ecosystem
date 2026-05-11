export interface Options {
  readonly command: string | undefined;
  readonly topic: string | undefined;
  readonly values: ReadonlyMap<string, string>;
  readonly files: readonly string[];
  readonly areaPatterns: readonly string[];
}

const KNOWN_OPTION_KEYS = new Set([
  'active',
  'agent-name',
  'area-kind',
  'area-pattern',
  'body',
  'body-json',
  'claim-id',
  'closed',
  'created-at',
  'closure-summary',
  'entry-json',
  'event-id',
  'events-dir',
  'file',
  'help',
  'intent',
  'lifecycle-dir',
  'messages-dir',
  'model',
  'notes',
  'now',
  'output',
  'platform',
  'repo-root',
  'shared-log',
  'seen-file',
  'summary',
  'thread',
  'thread-record',
  'title',
  'ttl-seconds',
]);

export function parseOptions(argv: readonly string[]): Options {
  const normalizedArgv = argv[0] === '--' ? argv.slice(1) : argv;
  const [command, possibleTopic] = normalizedArgv;
  const topic = possibleTopic?.startsWith('--') === false ? possibleTopic : undefined;
  const rest = topic === undefined ? normalizedArgv.slice(1) : normalizedArgv.slice(2);
  const values = new Map<string, string>();
  const files: string[] = [];
  const areaPatterns: string[] = [];

  for (let index = 0; index < rest.length; ) {
    index = parseToken({ rest, index, values, files, areaPatterns });
  }

  return { command, topic, values, files, areaPatterns };
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

function parseToken(input: {
  readonly rest: readonly string[];
  readonly index: number;
  readonly values: Map<string, string>;
  readonly files: string[];
  readonly areaPatterns: string[];
}): number {
  const token = input.rest[input.index] ?? '';
  const next = input.rest[input.index + 1];

  if (token === '--help') {
    input.values.set('help', 'true');
    return input.index + 1;
  }
  if (token === '--file') {
    input.files.push(requireFlagValue(token, next));
    return input.index + 2;
  }
  if (token === '--area-pattern') {
    input.areaPatterns.push(requireFlagValue(token, next));
    return input.index + 2;
  }
  if (token.startsWith('--')) {
    return parseValueOption({ token, next, values: input.values, index: input.index });
  }

  throw new Error(`unknown argument: ${token}`);
}

function parseValueOption(input: {
  readonly token: string;
  readonly next: string | undefined;
  readonly values: Map<string, string>;
  readonly index: number;
}): number {
  const key = input.token.slice(2);
  if (!KNOWN_OPTION_KEYS.has(key)) {
    input.values.set(
      key,
      input.next === undefined || input.next.startsWith('--') ? 'true' : input.next,
    );
    return input.next === undefined || input.next.startsWith('--')
      ? input.index + 1
      : input.index + 2;
  }
  input.values.set(key, requireFlagValue(input.token, input.next));
  return input.index + 2;
}
