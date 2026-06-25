import {
  createFsFrameStore,
  type FrameStoreFs,
  resolveFrameStateDir,
} from '../../src/claude/statusline-frame-store';

describe('resolveFrameStateDir', () => {
  it('uses XDG_STATE_HOME when set', () => {
    expect(resolveFrameStateDir({ XDG_STATE_HOME: '/x/state' }, '/workspace/u')).toBe(
      '/x/state/oak-statusline-frames',
    );
  });

  it('falls back to ~/.local/state when XDG_STATE_HOME is unset — never the OS temp dir', () => {
    // The security property of the insecure-temporary-file fix: the per-session
    // state resolves under the user's private state home, not the shared temp dir.
    expect(resolveFrameStateDir({}, '/workspace/u')).toBe(
      '/workspace/u/.local/state/oak-statusline-frames',
    );
  });
});

/** In-memory fake of the narrow fs surface, recording the options passed. */
function fakeFs(seed: Record<string, string> = {}): {
  fs: FrameStoreFs;
  mkdirOptions: { recursive: true; mode: number }[];
  writeOptions: { encoding: 'utf8'; mode: number }[];
} {
  const store = new Map<string, string>(Object.entries(seed));
  const mkdirOptions: { recursive: true; mode: number }[] = [];
  const writeOptions: { encoding: 'utf8'; mode: number }[] = [];
  return {
    mkdirOptions,
    writeOptions,
    fs: {
      readFileSync(path) {
        const value = store.get(path);
        if (value === undefined) {
          throw new Error(`ENOENT: ${path}`);
        }
        return value;
      },
      writeFileSync(path, data, options) {
        writeOptions.push(options);
        store.set(path, data);
      },
      mkdirSync(_path, options) {
        mkdirOptions.push(options);
      },
    },
  };
}

describe('createFsFrameStore', () => {
  it('round-trips a per-session counter through the injected fs', () => {
    const { fs } = fakeFs();
    const store = createFsFrameStore('/base', fs);
    expect(store.read('session-a')).toBeUndefined();
    store.write('session-a', '3');
    expect(store.read('session-a')).toBe('3');
  });

  it('requests owner-only modes so per-session state is private on a shared host', () => {
    const { fs, mkdirOptions, writeOptions } = fakeFs();
    createFsFrameStore('/base', fs).write('session-a', '1');
    expect(mkdirOptions).toEqual([{ recursive: true, mode: 0o700 }]);
    expect(writeOptions).toEqual([{ encoding: 'utf8', mode: 0o600 }]);
  });

  it('soft-fails an unreadable counter as absent (cycle restarts at frame 0)', () => {
    const { fs } = fakeFs();
    const store = createFsFrameStore('/base', {
      ...fs,
      readFileSync() {
        throw new Error('unreadable');
      },
    });
    expect(store.read('session-a')).toBeUndefined();
  });
});
