import { describe, expect, it } from 'vitest';

import { atomicTextWriter } from '../../src/collaboration-state/atomic-file';
import {
  createJsonFileAtomically,
  updateJsonFileWithRetry,
  updateJsonStateWithRetry,
  writeJsonFileAtomically,
} from '../../src/collaboration-state/transaction';
import {
  listEntries,
  makeTempDirectory,
  readText,
  removeDirectory,
  tempPath,
  writeText,
} from '../test-helpers/temp-collaboration-state';

describe('collaboration JSON atomic writes', () => {
  it('writes parseable JSON after validating the serialized text', async () => {
    const directory = await makeTempDirectory('oak-collaboration-transaction-');
    const filePath = tempPath(directory, 'state.json');
    try {
      await writeJsonFileAtomically({
        filePath,
        value: { schema_version: 'test', body: 'line one\nline two with `ticks` and $HOME' },
        validateText: (text) => {
          expect(JSON.parse(text)).toHaveProperty('schema_version', 'test');
        },
      });

      expect(JSON.parse(await readText(filePath))).toStrictEqual({
        schema_version: 'test',
        body: 'line one\nline two with `ticks` and $HOME',
      });
    } finally {
      await removeDirectory(directory);
    }
  });

  it('creates no target or temp file when serialized JSON validation fails', async () => {
    const directory = await makeTempDirectory('oak-collaboration-transaction-');
    const filePath = tempPath(directory, 'state.json');
    try {
      await expect(
        writeJsonFileAtomically({
          filePath,
          value: { schema_version: 'test' },
          validateText: () => {
            throw new Error('schema says no');
          },
        }),
      ).rejects.toThrow('schema says no');

      expect(await listEntries(directory)).toStrictEqual([]);
    } finally {
      await removeDirectory(directory);
    }
  });

  it('exclusively creates immutable JSON files without overwriting an existing target', async () => {
    const directory = await makeTempDirectory('oak-collaboration-transaction-');
    const filePath = tempPath(directory, 'event.json');
    try {
      await createJsonFileAtomically({
        filePath,
        value: { event_id: 'one' },
        validateText: JSON.parse,
      });

      await expect(
        createJsonFileAtomically({
          filePath,
          value: { event_id: 'two' },
          validateText: JSON.parse,
        }),
      ).rejects.toThrow(/EEXIST|file already exists/u);

      expect(JSON.parse(await readText(filePath))).toStrictEqual({ event_id: 'one' });
    } finally {
      await removeDirectory(directory);
    }
  });

  it('leaves no partial target when publish fails after the temp file is written', async () => {
    const writes = new Map<string, string>();
    const removed: string[] = [];
    const writeAtomically = atomicTextWriter({
      writeSyncedFile: async (path, text) => {
        writes.set(path, text);
      },
      link: async () => {
        throw new Error('publish failed');
      },
      rename: async () => {
        throw new Error('publish failed');
      },
      remove: async (path) => {
        removed.push(path);
        writes.delete(path);
      },
      syncDirectory: async () => undefined,
    });

    await expect(
      writeAtomically('/tmp/state.json', 'new text', { exclusiveCreate: true }),
    ).rejects.toThrow('publish failed');

    expect(Array.from(writes)).toStrictEqual([]);
    expect(removed).toHaveLength(1);
  });

  it('retries when the state text changes between read and write', async () => {
    const writes: string[] = [];
    const reads = ['{"value":1}\n', '{"value":2}\n', '{"value":2}\n'];

    const result = await updateJsonStateWithRetry({
      maxAttempts: 3,
      parseText: parseCounterState,
      validateText: validateCounterState,
      readText: () => reads.shift() ?? '{"value":2}\n',
      writeText: (value) => {
        writes.push(value);
      },
      transform: (value: { readonly value: number }) => ({
        value: value.value + 1,
      }),
    });

    expect(result).toStrictEqual({ attempts: 2 });
    expect(writes).toStrictEqual(['{\n  "value": 3\n}\n']);
  });

  it('serializes concurrent JSON file updates without lost writes', async () => {
    const directory = await makeTempDirectory('oak-collaboration-transaction-');
    const filePath = tempPath(directory, 'counter.json');
    try {
      await writeText(filePath, '{"value":0}\n');

      await Promise.all(
        Array.from({ length: 5 }, () =>
          updateJsonFileWithRetry({
            filePath,
            maxAttempts: 3,
            parseText: parseCounterState,
            validateText: validateCounterState,
            transform: (value) => ({ value: value.value + 1 }),
          }),
        ),
      );

      expect(parseCounterState(await readText(filePath))).toStrictEqual({ value: 5 });
    } finally {
      await removeDirectory(directory);
    }
  });
});

interface CounterState {
  readonly value: number;
}

function validateCounterState(text: string): void {
  parseCounterState(text);
}

function parseCounterState(text: string): CounterState {
  const parsed: unknown = JSON.parse(text);
  if (
    typeof parsed === 'object' &&
    parsed !== null &&
    'value' in parsed &&
    typeof parsed.value === 'number'
  ) {
    return { value: parsed.value };
  }

  throw new Error('invalid counter state');
}
