import { describe, expect, it } from 'vitest';

import { dryRunDiagnostics, plannedTaskCount } from './repo-check-lint-changed.js';

/**
 * The skip decision reads turbo's own dry-run plan: the task graph `turbo run`
 * would execute under the same filter. These tests describe the pure reading of
 * that plan and of the dry run's stderr; the process edge is described with a
 * fake runtime in `tests/repo-check-lint-changed.integration.test.ts`.
 */

describe('plannedTaskCount', () => {
  it('reads a plan whose task graph is empty as no task', () => {
    // The shape turbo 2.10 prints for a commit that changes no workspace: the
    // scope may still name the root package, which declares no lint task.
    const plan = JSON.stringify({ packages: ['//'], tasks: [] });

    expect(plannedTaskCount(plan)).toBe(0);
  });

  it('counts every planned task, dependency builds included', () => {
    const plan = JSON.stringify({
      packages: ['@oaknational/result'],
      tasks: [{ taskId: '@oaknational/result#build' }, { taskId: '@oaknational/result#lint' }],
    });

    expect(plannedTaskCount(plan)).toBe(2);
  });

  it('refuses output that is not JSON, naming the dry run', () => {
    expect(() => plannedTaskCount('• turbo 2.10.13')).toThrow(/turbo dry run/u);
  });

  it('refuses a plan that carries no task list rather than reading it as empty', () => {
    // A changed plan shape must fail loudly: reading it as "no task" would
    // silently skip the lint of a commit that changes a workspace.
    expect(() => plannedTaskCount(JSON.stringify({ packages: [] }))).toThrow(/turbo dry run/u);
  });
});

/** The escape character that opens an SGR colour sequence. */
const ESC = String.fromCharCode(0x1b);

describe('dryRunDiagnostics', () => {
  it.each([
    { label: 'as turbo 2.10.13 prints it', stderr: '• turbo 2.10.13\n' },
    { label: 'of a later version ending in CRLF', stderr: '• turbo 2.11.0\r\n' },
  ])("reads turbo's version banner $label as no diagnostic", ({ stderr }) => {
    // A routine turbo upgrade must not fail every commit's hook.
    expect(dryRunDiagnostics(stderr)).toStrictEqual([]);
  });

  it('reads the banner dimmed by forced colour as no diagnostic', () => {
    // turbo 2.10.13 wraps the banner in SGR codes under CLICOLOR_FORCE=1.
    expect(dryRunDiagnostics(`${ESC}[2m• turbo 2.10.13${ESC}[0m\n`)).toStrictEqual([]);
  });

  it('returns a warning without the colour codes FORCE_COLOR wraps it in', () => {
    const coloured = `${ESC}[33;40m WARNING ${ESC}[0m ${ESC}[33;49mTURBO_REMOTE_CACHE_READ_ONLY is deprecated${ESC}[0m\n`;

    expect(dryRunDiagnostics(coloured)).toStrictEqual([
      'WARNING  TURBO_REMOTE_CACHE_READ_ONLY is deprecated',
    ]);
  });

  it("reads turbo's one-time telemetry notice as no diagnostic", () => {
    // The stderr of turbo 2.10.13's first dry run under a config directory that
    // has not yet shown the notice (a new machine, user or container).
    const stderr = [
      '',
      'Attention:',
      'Turborepo now collects completely anonymous telemetry regarding usage.',
      'This information is used to shape the Turborepo roadmap and prioritize features.',
      "You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:",
      'https://turborepo.dev/docs/telemetry',
      '',
      '• turbo 2.10.13',
      '',
    ].join('\n');

    expect(dryRunDiagnostics(stderr)).toStrictEqual([]);
  });

  it('reads every other line as a diagnostic, whatever its shape', () => {
    // An unrecognised line fails the gate rather than passing unread: a new
    // turbo or pnpm diagnostic format must not slip through a green run. The
    // last three lines only resemble the banner.
    const stderr = [
      '• turbo 2.10.13',
      ' WARN  Unsupported engine',
      '(node:1) DeprecationWarning: x',
      '• turbo 2.10.13 (update available)',
      'x • turbo 2.10.13',
      '• turbo 2.10.13WARNING',
      '',
    ].join('\n');

    expect(dryRunDiagnostics(stderr)).toStrictEqual([
      'WARN  Unsupported engine',
      '(node:1) DeprecationWarning: x',
      '• turbo 2.10.13 (update available)',
      'x • turbo 2.10.13',
      '• turbo 2.10.13WARNING',
    ]);
  });
});
