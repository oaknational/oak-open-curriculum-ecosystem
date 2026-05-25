export interface Options {
  readonly command: string | undefined;
  readonly topic: string | undefined;
  readonly values: ReadonlyMap<string, string>;
  readonly files: readonly string[];
  readonly areaPatterns: readonly string[];
  readonly tags: readonly string[];
}

/**
 * Per-key opt-in for bare-boolean handling. Tokens whose key is in this set
 * NEVER consume the next argv token: `--seed-from-now foo` parses as
 * `seed-from-now=true` plus a stray `foo` (the dispatcher rejects strays).
 *
 * Needed because the default `parseValueOption` path requires a value for
 * keys in `KNOWN_OPTION_KEYS`, and per-command specs (`commsWatchOptions`,
 * etc.) put the flag in that set for validation. Without this opt-in,
 * `--seed-from-now` would either be required to take a value or, if absent
 * from KNOWN_OPTION_KEYS, would silently consume the next non-`--` token.
 */
const BOOLEAN_OPTION_KEYS = new Set(['seed-from-now', 'no-auto-seed']);

const KNOWN_OPTION_KEYS = new Set([
  'active',
  'agent-name',
  'area-kind',
  'area-pattern',
  'body',
  'body-file',
  'body-json',
  'branch',
  'claim-id',
  'closed',
  'comms-dir',
  'created-at',
  'closure-summary',
  'current-cycle-label',
  'entry-json',
  'event-id',
  'events-dir',
  'file',
  'format',
  'help',
  'intent',
  'intent-id',
  'kind',
  'lifecycle-dir',
  'messages-dir',
  'model',
  'notes',
  'now',
  'output',
  'platform',
  'poll-ms',
  'repo-root',
  'shared-log',
  'seen-file',
  'subject',
  'summary',
  'tag',
  'thread',
  'thread-record',
  'title',
  'to-agent-name',
  'to-event-id',
  'to-model',
  'to-platform',
  'to-session-prefix',
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
  const tags: string[] = [];

  for (let index = 0; index < rest.length; ) {
    index = parseToken({ rest, index, values, files, areaPatterns, tags });
  }

  return { command, topic, values, files, areaPatterns, tags };
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

export function optionalPositiveInteger(options: Options, key: string): number | undefined {
  const raw = optional(options, key);
  if (raw === undefined) {
    return undefined;
  }

  const value = Number.parseInt(raw, 10);
  if (!Number.isInteger(value) || value <= 0 || String(value) !== raw) {
    throw new Error(`--${key} must be a positive integer`);
  }

  return value;
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
  readonly tags: string[];
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
  if (token === '--tag') {
    input.tags.push(requireFlagValue(token, next));
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
  if (BOOLEAN_OPTION_KEYS.has(key)) {
    input.values.set(key, 'true');
    return input.index + 1;
  }
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
