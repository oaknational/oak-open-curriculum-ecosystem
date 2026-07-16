import { describe, expect, it } from 'vitest';

import {
  parseOperatorCommand,
  runCodexHookReviewOperator,
} from '../../src/codex-hook-review/operator.js';
import { requiredHookFingerprint } from '../../src/codex-hook-review/operator-runtime.js';

describe('parseOperatorCommand', () => {
  it.each(['probe', 'benchmark', 'enable', 'status', 'disable'] as const)(
    'accepts the %s operator command',
    (command) => {
      expect(parseOperatorCommand([command])).toBe(command);
    },
  );

  it('rejects missing, unknown, and additional arguments', () => {
    expect(parseOperatorCommand([])).toBeUndefined();
    expect(parseOperatorCommand(['benchmark', '--yes'])).toBeUndefined();
    expect(parseOperatorCommand(['run'])).toBeUndefined();
  });

  it('returns the documented exit code and usage without touching local state', async () => {
    const errors: string[] = [];
    const exitCode = await runCodexHookReviewOperator({
      args: [],
      projectRoot: '/project',
      environment: {},
      output: { writeLine: () => undefined, writeErrorLine: (message) => errors.push(message) },
    });

    expect(exitCode).toBe(1);
    expect(errors).toStrictEqual([
      'Usage: pnpm agent-tools:codex-hook-review probe|benchmark|enable|status|disable',
    ]);
  });
});

describe('requiredHookFingerprint', () => {
  const runtime = {
    deployment: { entryPath: '/private/hook.mjs', sha256: 'bundle' },
    executables: {
      node: { path: '/private/node', size: 1, mtimeMs: 1 },
      claude: { path: '/private/claude', size: 1, mtimeMs: 1 },
      codex: { path: '/private/codex', size: 1, mtimeMs: 1 },
      gitleaks: { path: '/private/gitleaks', size: 1, mtimeMs: 1 },
    },
  };

  it('returns the exact owned async hook fingerprint', () => {
    expect(requiredHookFingerprint(runtime)).toStrictEqual({
      ok: true,
      value: {
        hooks: [
          {
            type: 'command',
            command: '/private/node',
            args: ['/private/hook.mjs', '--oak-codex-hook-review-v1'],
            timeout: 6,
            async: true,
          },
        ],
      },
    });
  });

  it('returns a typed error for an invalid pinned path', () => {
    expect(
      requiredHookFingerprint({
        ...runtime,
        executables: {
          ...runtime.executables,
          node: { ...runtime.executables.node, path: 'node' },
        },
      }),
    ).toStrictEqual({ ok: false, error: { kind: 'invalid-hook-fingerprint' } });
  });
});
