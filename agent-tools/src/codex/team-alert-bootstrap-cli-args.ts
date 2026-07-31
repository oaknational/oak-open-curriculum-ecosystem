import { err, ok, type Result } from '@oaknational/result';

/** Complete teaching help for the Codex team-alert bootstrap command. */
export const TEAM_ALERT_BOOTSTRAP_HELP_TEXT = [
  'Usage: pnpm codex-team-alert-bootstrap:generate [--check]',
  '',
  'Generate or validate the Codex team-alert projection committed in AGENTS.md.',
  '',
  'Options:',
  '  (no arguments)   Generate the committed AGENTS.md projection.',
  '  --check          Verify the committed projection without writing files.',
  '  -h, --help       Show this help.',
  '',
  'Examples:',
  '  pnpm codex-team-alert-bootstrap:generate',
  '  pnpm codex-team-alert-bootstrap:generate --check',
].join('\n');

export type TeamAlertBootstrapMode = 'check' | 'generate' | 'help';

/** Parse the complete CLI argument vector before any repository IO begins. */
export function parseTeamAlertBootstrapMode(
  args: readonly string[],
): Result<TeamAlertBootstrapMode, Error> {
  if (args.length === 0) {
    return ok('generate');
  }
  if (args.length === 1 && args[0] === '--check') {
    return ok('check');
  }
  if (args.length === 1 && (args[0] === '--help' || args[0] === '-h')) {
    return ok('help');
  }
  return err(
    new Error(
      `Unsupported Codex team-alert bootstrap arguments: ${args.join(' ')}\n\n` +
        TEAM_ALERT_BOOTSTRAP_HELP_TEXT,
    ),
  );
}
