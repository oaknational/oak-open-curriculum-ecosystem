import { InvalidArgumentError } from 'commander';

/** Parsed and validated lifecycle ingest options. */
export interface ParsedLifecycleIngestOpts {
  readonly bulkDir?: string;
  readonly subjectFilter?: string[];
  readonly minDocCount?: number;
  readonly verbose?: boolean;
}

interface LifecycleIngestOptsCandidate {
  readonly bulkDir?: unknown;
  readonly subjectFilter?: unknown;
  readonly minDocCount?: unknown;
  readonly verbose?: unknown;
}

function isAllowedOptionKey(key: string): boolean {
  return key === 'bulkDir' || key === 'subjectFilter' || key === 'minDocCount' || key === 'verbose';
}

function hasOnlyAllowedKeys(value: LifecycleIngestOptsCandidate): boolean {
  for (const key in value) {
    if (!isAllowedOptionKey(key)) {
      return false;
    }
  }
  return true;
}

function isLifecycleIngestOptsCandidate(value: unknown): value is LifecycleIngestOptsCandidate {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }
  return hasOnlyAllowedKeys(value);
}

function parseBulkDir(value: unknown): string | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (typeof value !== 'string') {
    throw new InvalidArgumentError('--bulk-dir must be a string path.');
  }
  return value;
}

function parseSubjectFilter(value: unknown): string[] | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (!Array.isArray(value) || !value.every((entry) => typeof entry === 'string')) {
    throw new InvalidArgumentError('--subject-filter expects one or more subject strings.');
  }
  return value;
}

function parseMinDocCount(value: unknown): number | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (
    typeof value !== 'number' ||
    !Number.isFinite(value) ||
    !Number.isInteger(value) ||
    value < 0
  ) {
    throw new InvalidArgumentError('--min-doc-count must be a non-negative integer.');
  }
  return value;
}

function parseVerbose(value: unknown): boolean | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (typeof value !== 'boolean') {
    throw new InvalidArgumentError('--verbose must be a boolean flag.');
  }
  return value;
}

/**
 * Validate and parse commander lifecycle ingest options.
 *
 * @param rawOpts - Commander option payload supplied to the command handler.
 * @returns Strongly typed lifecycle ingest options.
 * @throws InvalidArgumentError when any option value is invalid.
 */
export function parseLifecycleIngestOpts(rawOpts: unknown): ParsedLifecycleIngestOpts {
  if (!isLifecycleIngestOptsCandidate(rawOpts)) {
    throw new InvalidArgumentError('Invalid command options: expected an option object.');
  }
  return {
    bulkDir: parseBulkDir(rawOpts.bulkDir),
    subjectFilter: parseSubjectFilter(rawOpts.subjectFilter),
    minDocCount: parseMinDocCount(rawOpts.minDocCount),
    verbose: parseVerbose(rawOpts.verbose),
  };
}
