import { describe, expect, it } from 'vitest';

import {
  classifyOptionalReadFailure,
  collectPresentRootFiles,
} from './family-conformance-optional-reads.js';

describe('classifyOptionalReadFailure', () => {
  it('reads ENOENT as the file being absent', () => {
    const failure = Object.assign(new Error('no such file'), { code: 'ENOENT' });
    expect(classifyOptionalReadFailure('.husky/pre-push', failure)).toEqual({
      ok: true,
      value: 'absent',
    });
  });

  it('surfaces any other failure as an input error instead of reading it as absence', () => {
    const failure = Object.assign(new Error('permission denied'), { code: 'EACCES' });
    const reading = classifyOptionalReadFailure('.github/workflows/ci.yml', failure);
    expect(reading.ok).toBe(false);
    if (!reading.ok) {
      expect(reading.error.message).toBe(
        '.github/workflows/ci.yml could not be read: permission denied',
      );
    }
  });
});

describe('collectPresentRootFiles', () => {
  it('collects the names read as present', () => {
    const reading = collectPresentRootFiles(
      ['prettier.config.ts', '.prettierrc', '.prettierrc.json'],
      [
        { ok: true, value: 'present' },
        { ok: true, value: 'absent' },
        { ok: true, value: 'present' },
      ],
    );
    expect(reading.ok).toBe(true);
    if (reading.ok) {
      expect([...reading.value]).toEqual(['prettier.config.ts', '.prettierrc.json']);
    }
  });

  it('ends at the first unreadable file with its error', () => {
    const unreadable = new Error('.prettierrc could not be read: busy');
    const reading = collectPresentRootFiles(
      ['prettier.config.ts', '.prettierrc', '.prettierrc.json'],
      [
        { ok: true, value: 'present' },
        { ok: false, error: unreadable },
        { ok: true, value: 'present' },
      ],
    );
    expect(reading).toEqual({ ok: false, error: unreadable });
  });
});
