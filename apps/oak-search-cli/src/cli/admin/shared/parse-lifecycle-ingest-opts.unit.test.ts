import { describe, expect, it } from 'vitest';
import { InvalidArgumentError } from 'commander';
import { parseLifecycleIngestOpts } from './parse-lifecycle-ingest-opts.js';

function expectInvalidOption(input: unknown, message: string): void {
  try {
    parseLifecycleIngestOpts(input);
    throw new Error('Expected parseLifecycleIngestOpts to throw InvalidArgumentError.');
  } catch (error) {
    expect(error).toBeInstanceOf(InvalidArgumentError);
    expect(error).toBeInstanceOf(Error);
    if (error instanceof Error) {
      expect(error.message).toContain(message);
    }
  }
}

describe('parseLifecycleIngestOpts', () => {
  it('parses valid option objects', () => {
    const result = parseLifecycleIngestOpts({
      bulkDir: './bulk-downloads',
      subjectFilter: ['maths', 'science'],
      minDocCount: 10,
      verbose: true,
    });

    expect(result).toEqual({
      bulkDir: './bulk-downloads',
      subjectFilter: ['maths', 'science'],
      minDocCount: 10,
      verbose: true,
    });
  });

  it('rejects arrays as invalid option objects', () => {
    expectInvalidOption([], 'Invalid command options: expected an option object.');
  });

  it('rejects non-object option payloads', () => {
    expectInvalidOption(null, 'Invalid command options: expected an option object.');
    expectInvalidOption(123, 'Invalid command options: expected an option object.');
  });

  it('rejects unknown option keys', () => {
    expectInvalidOption(
      { bulkDir: './bulk-downloads', unsupported: true },
      'Invalid command options: expected an option object.',
    );
  });

  it('rejects non-string bulkDir values', () => {
    expectInvalidOption({ bulkDir: 123 }, '--bulk-dir must be a string path.');
  });

  it('rejects subjectFilter arrays with non-string entries', () => {
    expectInvalidOption(
      { subjectFilter: ['maths', 1] },
      '--subject-filter expects one or more subject strings.',
    );
  });

  it('rejects subjectFilter when not an array', () => {
    expectInvalidOption(
      { subjectFilter: 'maths' },
      '--subject-filter expects one or more subject strings.',
    );
  });

  it('rejects non-integer minDocCount', () => {
    expectInvalidOption({ minDocCount: 1.5 }, '--min-doc-count must be a non-negative integer.');
  });

  it('rejects negative or non-finite minDocCount values', () => {
    expectInvalidOption({ minDocCount: -1 }, '--min-doc-count must be a non-negative integer.');
    expectInvalidOption(
      { minDocCount: Number.POSITIVE_INFINITY },
      '--min-doc-count must be a non-negative integer.',
    );
    expectInvalidOption(
      { minDocCount: Number.NaN },
      '--min-doc-count must be a non-negative integer.',
    );
  });

  it('rejects non-boolean verbose values', () => {
    expectInvalidOption({ verbose: 1 }, '--verbose must be a boolean flag.');
  });
});
