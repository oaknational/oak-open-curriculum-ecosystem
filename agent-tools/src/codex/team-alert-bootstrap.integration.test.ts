import { describe, expect, it } from 'vitest';

import { err, ok, unwrapErr } from '@oaknational/result';

import {
  AGENTS_PROJECTION_END,
  AGENTS_PROJECTION_START,
  checkTeamAlertBootstrap,
  generateTeamAlertBootstrap,
  type TeamAlertBootstrapFileIo,
} from './team-alert-bootstrap.js';

const REPO_ROOT = '/repo';
const AGENTS_PATH = 'AGENTS.md';
const CANONICAL_RULE_PATH = '.agent/rules/use-monitor-for-event-driven-wake.md';
const SOURCE_PROJECTION_START = '<!-- CODEX_TEAM_ALERT_BOOTSTRAP_SOURCE_START -->';
const SOURCE_PROJECTION_END = '<!-- CODEX_TEAM_ALERT_BOOTSTRAP_SOURCE_END -->';
const PROJECTION = `## Codex team-session alert bootstrap

Load \`$oak-start-right-team\` for coordinated Codex work.
`;
const CANONICAL = [
  '# Rule',
  '',
  SOURCE_PROJECTION_START,
  PROJECTION.trimEnd(),
  SOURCE_PROJECTION_END,
  '',
].join('\n');
const BASE_AGENTS = [
  '# AGENTS.md',
  '',
  'Read [AGENT.md](.agent/directives/AGENT.md)',
  '',
  'See [RULES_INDEX.md](RULES_INDEX.md) for the canonical rules list.',
  '',
].join('\n');
const CURRENT_AGENTS = [
  BASE_AGENTS.trimEnd(),
  '',
  '<!-- CODEX_TEAM_ALERT_BOOTSTRAP_GENERATED_START -->',
  '',
  PROJECTION.trimEnd(),
  '<!-- CODEX_TEAM_ALERT_BOOTSTRAP_GENERATED_END -->',
  '',
].join('\n');

describe('Codex team-alert projection generation', () => {
  it('writes the canonical projection through the typed filesystem seam', async () => {
    const writes: string[] = [];
    const io: TeamAlertBootstrapFileIo = {
      readCanonicalRule: () => Promise.resolve(ok(CANONICAL)),
      readAgents: () => Promise.resolve(ok(BASE_AGENTS)),
      writeAgents: (_repoRoot, content) => {
        writes.push(content);
        return Promise.resolve();
      },
    };

    await expect(generateTeamAlertBootstrap(REPO_ROOT, io)).resolves.toStrictEqual(
      ok(`${REPO_ROOT}/${AGENTS_PATH}`),
    );
    expect(writes).toStrictEqual([CURRENT_AGENTS]);
  });

  it('reports stale and current projections from constant reads', async () => {
    const staleIo: TeamAlertBootstrapFileIo = {
      readCanonicalRule: () => Promise.resolve(ok(CANONICAL)),
      readAgents: () => Promise.resolve(ok(BASE_AGENTS)),
      writeAgents: () => Promise.resolve(),
    };
    const currentIo: TeamAlertBootstrapFileIo = {
      readCanonicalRule: () => Promise.resolve(ok(CANONICAL)),
      readAgents: () => Promise.resolve(ok(CURRENT_AGENTS)),
      writeAgents: () => Promise.resolve(),
    };

    await expect(checkTeamAlertBootstrap(REPO_ROOT, staleIo)).resolves.toStrictEqual(
      ok({ upToDate: false }),
    );
    await expect(checkTeamAlertBootstrap(REPO_ROOT, currentIo)).resolves.toStrictEqual(
      ok({ upToDate: true }),
    );
  });

  it.each([AGENTS_PROJECTION_START, AGENTS_PROJECTION_END])(
    'rejects canonical projection containing %s without writing AGENTS.md',
    async (targetMarker) => {
      const writes: string[] = [];
      const io: TeamAlertBootstrapFileIo = {
        readCanonicalRule: () =>
          Promise.resolve(ok(CANONICAL.replace(PROJECTION.trimEnd(), `text ${targetMarker} text`))),
        readAgents: () => Promise.resolve(ok(BASE_AGENTS)),
        writeAgents: (_repoRoot, content) => {
          writes.push(content);
          return Promise.resolve();
        },
      };

      const failure = unwrapErr(await generateTeamAlertBootstrap(REPO_ROOT, io));
      expect(failure.message).toBe(
        'Codex team-alert projection must not contain AGENTS.md generated markers.',
      );
      expect(writes).toStrictEqual([]);
    },
  );

  it('preserves a reported read Error as the contextual cause', async () => {
    const sourceError = new Error('permission denied');
    const io: TeamAlertBootstrapFileIo = {
      readCanonicalRule: () => Promise.resolve(err(sourceError)),
      readAgents: () => Promise.resolve(ok(BASE_AGENTS)),
      writeAgents: () => Promise.resolve(),
    };

    const failure = unwrapErr(await generateTeamAlertBootstrap(REPO_ROOT, io));
    expect(failure.message).toBe(`Cannot read canonical rule ${CANONICAL_RULE_PATH}`);
    expect(failure.cause).toBe(sourceError);
  });

  it('preserves a rejected read Error as the contextual cause', async () => {
    const sourceError = new Error('storage offline', { cause: new Error('device missing') });
    const io: TeamAlertBootstrapFileIo = {
      readCanonicalRule: () => Promise.reject(sourceError),
      readAgents: () => Promise.resolve(ok(BASE_AGENTS)),
      writeAgents: () => Promise.resolve(),
    };

    const failure = unwrapErr(await generateTeamAlertBootstrap(REPO_ROOT, io));
    expect(failure.message).toBe(`Cannot read canonical rule ${CANONICAL_RULE_PATH}`);
    expect(failure.cause).toBe(sourceError);
  });

  it('preserves a rejected write Error as the contextual cause', async () => {
    const sourceError = new Error('read-only filesystem');
    const io: TeamAlertBootstrapFileIo = {
      readCanonicalRule: () => Promise.resolve(ok(CANONICAL)),
      readAgents: () => Promise.resolve(ok(BASE_AGENTS)),
      writeAgents: () => Promise.reject(sourceError),
    };

    const failure = unwrapErr(await generateTeamAlertBootstrap(REPO_ROOT, io));
    expect(failure.message).toBe(`Cannot write ${AGENTS_PATH}`);
    expect(failure.cause).toBe(sourceError);
  });
});
