import { describe, expect, it } from 'vitest';

import { ok, unwrapErr } from '@oaknational/result';

import {
  TEAM_ALERT_BOOTSTRAP_HELP_TEXT,
  parseTeamAlertBootstrapMode,
} from './team-alert-bootstrap-cli-args.js';

describe('parseTeamAlertBootstrapMode', () => {
  it('selects generation only for the empty argument vector', () => {
    expect(parseTeamAlertBootstrapMode([])).toStrictEqual(ok('generate'));
  });

  it('selects drift checking only for the exact check argument vector', () => {
    expect(parseTeamAlertBootstrapMode(['--check'])).toStrictEqual(ok('check'));
  });

  it.each([['--help'], ['-h']] as const)(
    'selects help for the exact %s argument vector',
    (helpFlag) => {
      expect(parseTeamAlertBootstrapMode([helpFlag])).toStrictEqual(ok('help'));
    },
  );

  it.each([
    ['an unknown option', ['--definitely-unknown']],
    ['a positional argument', ['generate']],
    ['an option after check', ['--check', 'extra']],
    ['a repeated check option', ['--check', '--check']],
    ['help combined with another option', ['--help', '--check']],
  ] as const)('rejects %s with the complete teaching help', (_label, args) => {
    expect(unwrapErr(parseTeamAlertBootstrapMode(args)).message).toBe(
      `Unsupported Codex team-alert bootstrap arguments: ${args.join(' ')}\n\n` +
        TEAM_ALERT_BOOTSTRAP_HELP_TEXT,
    );
  });
});

describe('TEAM_ALERT_BOOTSTRAP_HELP_TEXT', () => {
  it('teaches generation, checking, help, and worked invocations', () => {
    expect(TEAM_ALERT_BOOTSTRAP_HELP_TEXT).toContain(
      'Usage: pnpm codex-team-alert-bootstrap:generate [--check]',
    );
    expect(TEAM_ALERT_BOOTSTRAP_HELP_TEXT).toContain(
      '  (no arguments)   Generate the committed AGENTS.md projection.',
    );
    expect(TEAM_ALERT_BOOTSTRAP_HELP_TEXT).toContain(
      '  --check          Verify the committed projection without writing files.',
    );
    expect(TEAM_ALERT_BOOTSTRAP_HELP_TEXT).toContain('  -h, --help       Show this help.');
    expect(TEAM_ALERT_BOOTSTRAP_HELP_TEXT).toContain('Examples:');
  });
});
