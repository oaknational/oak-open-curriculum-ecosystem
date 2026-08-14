import { constants } from 'node:fs';

import {
  appendDebugLogEntry,
  DEBUG_LOG_OPEN_FLAGS,
  type DebugLogFs,
} from '../../src/claude/statusline-debug-log';

/**
 * In-memory fake of the narrow descriptor-level fs surface, recording
 * calls and options. No IO anywhere in this suite: the OS filesystem
 * bridge is not ours to prove — these tests prove our code's behaviour at
 * the injected seam (testing-strategy §Test Types; ADR-078). The fake is
 * branch-free: failure tests override the single method they break,
 * following `statusline-frame-store.unit.test.ts`.
 */
function fakeFs(): {
  fs: DebugLogFs;
  mkdirs: { path: string; mode: number }[];
  opens: { path: string; flags: number; mode: number }[];
  fchmods: { fd: number; mode: number }[];
  writes: { fd: number; data: string }[];
  closes: number[];
} {
  const mkdirs: { path: string; mode: number }[] = [];
  const opens: { path: string; flags: number; mode: number }[] = [];
  const fchmods: { fd: number; mode: number }[] = [];
  const writes: { fd: number; data: string }[] = [];
  const closes: number[] = [];
  return {
    mkdirs,
    opens,
    fchmods,
    writes,
    closes,
    fs: {
      mkdirSync(path, options) {
        mkdirs.push({ path, mode: options.mode });
      },
      openSync(path, flags, mode) {
        opens.push({ path, flags, mode });
        return 7;
      },
      fstatSync() {
        return { isFile: () => true };
      },
      fchmodSync(fd, mode) {
        fchmods.push({ fd, mode });
      },
      writeSync(fd, data, offset, length) {
        writes.push({ fd, data: data.subarray(offset, offset + length).toString('utf8') });
        return length;
      },
      closeSync(fd) {
        closes.push(fd);
      },
    },
  };
}

describe('appendDebugLogEntry', () => {
  it('appends one timestamped line through a no-follow descriptor, creating parent and file privately', () => {
    const { fs, mkdirs, opens, fchmods, writes, closes } = fakeFs();
    appendDebugLogEntry('/base/dir/statusline.log', '{"a":1}', '2026-08-07T15:00:00.000Z', fs);
    expect(mkdirs).toEqual([{ path: '/base/dir', mode: 0o700 }]);
    expect(opens).toEqual([
      { path: '/base/dir/statusline.log', flags: DEBUG_LOG_OPEN_FLAGS, mode: 0o600 },
    ]);
    expect(fchmods).toEqual([{ fd: 7, mode: 0o600 }]);
    expect(writes).toEqual([{ fd: 7, data: '2026-08-07T15:00:00.000Z {"a":1}\n' }]);
    expect(closes).toEqual([7]);
  });

  it('opens without following symlinks and refuses blocking destinations by flag', () => {
    // The flag set IS the boundary contract: no-follow kills a pre-placed
    // symlink at the destination (ELOOP), nonblock turns a reader-less FIFO
    // into ENXIO instead of a hang, append+create+wronly is the only write
    // shape the log needs.
    expect(DEBUG_LOG_OPEN_FLAGS).toBe(
      constants.O_WRONLY |
        constants.O_APPEND |
        constants.O_CREAT |
        constants.O_NOFOLLOW |
        constants.O_NONBLOCK,
    );
  });

  it('collapses line breaks so one invocation is one greppable line', () => {
    const { fs, writes } = fakeFs();
    appendDebugLogEntry('/d/s.log', '{\n"a": 1\n}', '2026-08-07T15:00:00.000Z', fs);
    expect(writes[0]?.data).toBe('2026-08-07T15:00:00.000Z { "a": 1 }\n');
  });

  it('trims the trailing newline the harness sends, keeping the entry one line', () => {
    const { fs, writes } = fakeFs();
    appendDebugLogEntry('/d/s.log', '{"a":1}\n', '2026-08-07T15:00:00.000Z', fs);
    expect(writes[0]?.data).toBe('2026-08-07T15:00:00.000Z {"a":1}\n');
  });

  it('preserves internal whitespace — the logged payload stays faithful to what arrived', () => {
    const { fs, writes } = fakeFs();
    appendDebugLogEntry('/d/s.log', '{"cwd":"/a  b/c"}', '2026-08-07T15:00:00.000Z', fs);
    expect(writes[0]?.data).toBe('2026-08-07T15:00:00.000Z {"cwd":"/a  b/c"}\n');
  });

  it('preserves leading and trailing non-linebreak whitespace — only line breaks are transformed', () => {
    const { fs, writes } = fakeFs();
    appendDebugLogEntry('/d/s.log', '  {"a":1}\t \n', '2026-08-07T15:00:00.000Z', fs);
    expect(writes[0]?.data).toBe('2026-08-07T15:00:00.000Z   {"a":1}\t \n');
  });

  it('writes the whole line through short writes — a partial write never truncates the entry', () => {
    // POSIX write may consume fewer bytes than requested; the loop must
    // continue from the reported offset until the line is complete.
    const { fs, writes } = fakeFs();
    const threeBytesAtATime: DebugLogFs = {
      ...fs,
      writeSync(fd, data, offset, length) {
        const consumed = Math.min(3, length);
        writes.push({ fd, data: data.subarray(offset, offset + consumed).toString('utf8') });
        return consumed;
      },
    };
    appendDebugLogEntry('/d/s.log', '{"a":1}', '2026-08-07T15:00:00.000Z', threeBytesAtATime);
    expect(writes.map((entry) => entry.data).join('')).toBe('2026-08-07T15:00:00.000Z {"a":1}\n');
  });

  it('accumulates successive invocations as successive lines through the same seam', () => {
    const { fs, writes } = fakeFs();
    appendDebugLogEntry('/d/s.log', '{"n":1}', '2026-08-07T15:00:00.000Z', fs);
    appendDebugLogEntry('/d/s.log', '{"n":2}', '2026-08-07T15:00:10.000Z', fs);
    expect(writes.map((entry) => entry.data)).toEqual([
      '2026-08-07T15:00:00.000Z {"n":1}\n',
      '2026-08-07T15:00:10.000Z {"n":2}\n',
    ]);
  });

  it('soft-fails a symlinked destination — the no-follow open throws and nothing is written', () => {
    const { fs, writes } = fakeFs();
    const linkRefused: DebugLogFs = {
      ...fs,
      openSync() {
        throw new Error('ELOOP: symbolic link encountered');
      },
    };
    expect(() =>
      appendDebugLogEntry('/d/s.log', '{"a":1}', '2026-08-07T15:00:00.000Z', linkRefused),
    ).not.toThrow();
    expect(writes).toEqual([]);
  });

  it('never writes to a non-regular destination, and still closes the descriptor', () => {
    // A FIFO with a live reader passes the nonblocking open; the descriptor
    // check is what refuses it.
    const { fs, writes, closes } = fakeFs();
    const nonRegular: DebugLogFs = {
      ...fs,
      fstatSync() {
        return { isFile: () => false };
      },
    };
    appendDebugLogEntry('/d/s.log', '{"a":1}', '2026-08-07T15:00:00.000Z', nonRegular);
    expect(writes).toEqual([]);
    expect(closes).toEqual([7]);
  });

  it('refuses to write when the destination cannot be retightened to owner-only', () => {
    const { fs, writes, closes } = fakeFs();
    const notOurs: DebugLogFs = {
      ...fs,
      fchmodSync() {
        throw new Error('EPERM: operation not permitted');
      },
    };
    expect(() =>
      appendDebugLogEntry('/d/s.log', '{"a":1}', '2026-08-07T15:00:00.000Z', notOurs),
    ).not.toThrow();
    expect(writes).toEqual([]);
    expect(closes).toEqual([7]);
  });

  it('swallows write failures — the statusline never breaks for its own logging', () => {
    const { fs, closes } = fakeFs();
    const appendDenied: DebugLogFs = {
      ...fs,
      writeSync() {
        throw new Error('EACCES: append denied');
      },
    };
    expect(() =>
      appendDebugLogEntry('/d/s.log', '{"a":1}', '2026-08-07T15:00:00.000Z', appendDenied),
    ).not.toThrow();
    expect(closes).toEqual([7]);
  });

  it('swallows mkdir failures the same way', () => {
    const { fs, writes } = fakeFs();
    const mkdirDenied: DebugLogFs = {
      ...fs,
      mkdirSync() {
        throw new Error('EACCES: mkdir denied');
      },
    };
    expect(() =>
      appendDebugLogEntry('/d/s.log', '{"a":1}', '2026-08-07T15:00:00.000Z', mkdirDenied),
    ).not.toThrow();
    expect(writes).toEqual([]);
  });
});
