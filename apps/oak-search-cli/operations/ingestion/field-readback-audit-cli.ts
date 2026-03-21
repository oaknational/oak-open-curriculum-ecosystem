export interface FieldReadbackCliArgs {
  readonly ledgerPath: string;
  readonly attempts: number;
  readonly intervalMs: number;
  readonly targetVersion?: string;
  readonly emitJson: boolean;
}

function parsePositiveInteger(value: string, argName: string): number {
  const parsedNumber = Number(value);
  if (!Number.isInteger(parsedNumber) || parsedNumber < 1) {
    throw new Error(`${argName} must be an integer >= 1, received: ${value}`);
  }
  return parsedNumber;
}

function parseOptionValue(args: readonly string[], index: number, argName: string): string {
  const optionValue = args[index + 1];
  if (!optionValue) {
    throw new Error(`Missing value for ${argName}`);
  }
  return optionValue;
}

function parseLedgerArg(args: readonly string[], index: number): string {
  return parseOptionValue(args, index, '--ledger');
}

function parseAttemptsArg(args: readonly string[], index: number): number {
  return parsePositiveInteger(parseOptionValue(args, index, '--attempts'), '--attempts');
}

function parseIntervalArg(args: readonly string[], index: number): number {
  return parsePositiveInteger(parseOptionValue(args, index, '--interval-ms'), '--interval-ms');
}

function parseTargetVersionArg(args: readonly string[], index: number): string {
  const targetVersion = args[index + 1];
  if (targetVersion === undefined) {
    throw new Error('Missing value for --target-version');
  }
  if (targetVersion.length === 0) {
    throw new Error('--target-version must be a non-empty string');
  }
  return targetVersion;
}

interface FieldReadbackCliParseState {
  readonly ledgerPath: string;
  readonly attempts: number;
  readonly intervalMs: number;
  readonly targetVersion?: string;
}

interface FieldReadbackCliParseResult {
  readonly lastConsumedIndex: number;
  readonly parseState: FieldReadbackCliParseState;
}

function createDefaultCliParseState(): FieldReadbackCliParseState {
  return {
    ledgerPath: '.agent/plans/semantic-search/archive/completed/field-gap-ledger.json',
    attempts: 6,
    intervalMs: 5000,
  };
}

function parseCliArg(
  args: readonly string[],
  index: number,
  parseState: FieldReadbackCliParseState,
): FieldReadbackCliParseResult {
  const arg = args[index];
  if (arg === '--ledger') {
    return {
      lastConsumedIndex: index + 1,
      parseState: { ...parseState, ledgerPath: parseLedgerArg(args, index) },
    };
  }
  if (arg === '--attempts') {
    return {
      lastConsumedIndex: index + 1,
      parseState: { ...parseState, attempts: parseAttemptsArg(args, index) },
    };
  }
  if (arg === '--interval-ms') {
    return {
      lastConsumedIndex: index + 1,
      parseState: { ...parseState, intervalMs: parseIntervalArg(args, index) },
    };
  }
  if (arg === '--target-version') {
    return {
      lastConsumedIndex: index + 1,
      parseState: { ...parseState, targetVersion: parseTargetVersionArg(args, index) },
    };
  }
  return { lastConsumedIndex: index, parseState };
}

export function parseCliArgs(args: readonly string[]): FieldReadbackCliArgs {
  let parseState = createDefaultCliParseState();

  for (let index = 0; index < args.length; index += 1) {
    const parseResult = parseCliArg(args, index, parseState);
    index = parseResult.lastConsumedIndex;
    parseState = parseResult.parseState;
  }

  const emitJson = args.includes('--emit-json');
  return { ...parseState, emitJson };
}
