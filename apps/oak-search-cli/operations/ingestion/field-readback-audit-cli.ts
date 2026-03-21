export interface FieldReadbackCliArgs {
  readonly ledgerPath: string;
  readonly attempts: number;
  readonly intervalMs: number;
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

export function parseCliArgs(args: readonly string[]): FieldReadbackCliArgs {
  let ledgerPath = '.agent/plans/semantic-search/archive/completed/field-gap-ledger.json';
  let attempts = 6;
  let intervalMs = 5000;

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--ledger') {
      ledgerPath = parseLedgerArg(args, index);
      index += 1;
      continue;
    }
    if (arg === '--attempts') {
      attempts = parseAttemptsArg(args, index);
      index += 1;
      continue;
    }
    if (arg === '--interval-ms') {
      intervalMs = parseIntervalArg(args, index);
      index += 1;
      continue;
    }
  }

  const emitJson = args.includes('--emit-json');
  return { ledgerPath, attempts, intervalMs, emitJson };
}
