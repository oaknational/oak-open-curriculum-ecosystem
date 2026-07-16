import { describe, expect, it } from 'vitest';

import {
  createPostToolBatchFingerprint,
  disablePostToolBatchHook,
  enablePostToolBatchHook,
  hasPostToolBatchHook,
} from '../../src/codex-hook-review/settings';

const FINGERPRINT = {
  hooks: [
    {
      type: 'command',
      command: process.execPath,
      args: ['/private/hook.mjs', '--oak-codex-hook-review-v1'],
      timeout: 4,
      async: true,
    },
  ],
} as const;

describe('local Claude settings merge', () => {
  it('constructs the exact async exec-form PostToolBatch fingerprint', () => {
    expect(createPostToolBatchFingerprint(4, '/private/hook.mjs', process.execPath)).toStrictEqual({
      ok: true,
      value: FINGERPRINT,
    });
    expect(createPostToolBatchFingerprint(0, '/private/hook.mjs', process.execPath)).toStrictEqual({
      ok: false,
      error: { kind: 'invalid-owned-hook-timeout' },
    });
  });

  it('adds the async no-matcher hook once and preserves unrelated settings', () => {
    const settings = {
      permissions: { allow: ['Read'] },
      hooks: { SessionStart: [{ matcher: '*', hooks: [] }] },
    };
    const enabledSettings = {
      permissions: { allow: ['Read'] },
      hooks: {
        SessionStart: [{ matcher: '*', hooks: [] }],
        PostToolBatch: [FINGERPRINT],
      },
    };

    expect(enablePostToolBatchHook(settings, FINGERPRINT)).toStrictEqual({
      ok: true,
      value: enabledSettings,
    });
    expect(enablePostToolBatchHook(enabledSettings, FINGERPRINT)).toStrictEqual({
      ok: true,
      value: enabledSettings,
    });
  });

  it('disables every owned fingerprint variant', () => {
    const similar = { hooks: [{ ...FINGERPRINT.hooks[0], timeout: 5 }] } as const;
    const settings = { hooks: { PostToolBatch: [similar, FINGERPRINT] } };

    expect(disablePostToolBatchHook(settings)).toStrictEqual({
      ok: true,
      value: { hooks: { PostToolBatch: [] } },
    });
  });

  it('replaces and removes stale owned variants by stable marker', () => {
    const stale = {
      hooks: [
        {
          ...FINGERPRINT.hooks[0],
          command: '/old/node',
          args: ['/old/hook.mjs', '--oak-codex-hook-review-v1'],
          timeout: 99,
        },
      ],
    } as const;

    expect(
      enablePostToolBatchHook({ hooks: { PostToolBatch: [stale] } }, FINGERPRINT),
    ).toStrictEqual({ ok: true, value: { hooks: { PostToolBatch: [FINGERPRINT] } } });
    expect(
      disablePostToolBatchHook({ hooks: { PostToolBatch: [stale, FINGERPRINT] } }),
    ).toStrictEqual({ ok: true, value: { hooks: { PostToolBatch: [] } } });
  });

  it('owns drifted groups whenever any handler carries the stable marker', () => {
    const drifted = {
      matcher: 'Edit|Write',
      futureGroupField: true,
      hooks: [
        { type: 'command', command: '/foreign/hook', args: ['--keep'], timeout: 1 },
        {
          type: 'future-command-type',
          command: '/old/node',
          args: ['/old/hook.mjs', '--extra', '--oak-codex-hook-review-v1'],
          timeout: 'future-timeout-shape',
          async: false,
          futureHandlerField: true,
        },
      ],
    } as const;

    expect(
      enablePostToolBatchHook({ hooks: { PostToolBatch: [drifted] } }, FINGERPRINT),
    ).toStrictEqual({ ok: true, value: { hooks: { PostToolBatch: [FINGERPRINT] } } });
    expect(
      disablePostToolBatchHook({ hooks: { PostToolBatch: [drifted, FINGERPRINT] } }),
    ).toStrictEqual({ ok: true, value: { hooks: { PostToolBatch: [] } } });
  });

  it('preserves groups that mention marker text outside handler args', () => {
    const unrelated = {
      matcher: '--oak-codex-hook-review-v1',
      hooks: [
        {
          type: 'command',
          command: '--oak-codex-hook-review-v1',
          args: ['/foreign/hook.mjs'],
          timeout: 4,
          async: true,
        },
      ],
    } as const;

    expect(disablePostToolBatchHook({ hooks: { PostToolBatch: [unrelated] } })).toStrictEqual({
      ok: true,
      value: { hooks: { PostToolBatch: [unrelated] } },
    });
  });

  it('detects only the exact owned fingerprint', () => {
    const similar = { hooks: [{ ...FINGERPRINT.hooks[0], timeout: 5 }] } as const;
    const extended = {
      ...FINGERPRINT,
      matcher: '*',
    } as const;

    expect(
      hasPostToolBatchHook({ hooks: { PostToolBatch: [similar] } }, FINGERPRINT),
    ).toStrictEqual({
      ok: true,
      value: false,
    });
    expect(
      hasPostToolBatchHook({ hooks: { PostToolBatch: [similar, FINGERPRINT] } }, FINGERPRINT),
    ).toStrictEqual({ ok: true, value: true });
    expect(
      hasPostToolBatchHook({ hooks: { PostToolBatch: [extended] } }, FINGERPRINT),
    ).toStrictEqual({ ok: true, value: false });
  });

  it('refuses to overwrite a malformed existing hook surface', () => {
    expect(enablePostToolBatchHook({ hooks: 'invalid' }, FINGERPRINT)).toStrictEqual({
      ok: false,
      error: { kind: 'invalid-hooks-setting' },
    });
  });
});
