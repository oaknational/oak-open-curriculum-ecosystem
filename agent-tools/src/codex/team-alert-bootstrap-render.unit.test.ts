import { describe, expect, it } from 'vitest';

import { ok, unwrapErr } from '@oaknational/result';

import {
  AGENTS_PROJECTION_END,
  AGENTS_PROJECTION_START,
  renderAgentsWithTeamAlertProjection,
} from './team-alert-bootstrap-render.js';

const PROJECTION = `## Codex team-session alert bootstrap

Load \`$oak-start-right-team\` for coordinated Codex work.
`;
const BASE_AGENTS = [
  '# AGENTS.md',
  '',
  'Read [AGENT.md](.agent/directives/AGENT.md)',
  '',
  'See [RULES_INDEX.md](RULES_INDEX.md) for the canonical rules list.',
  '',
].join('\n');

describe('renderAgentsWithTeamAlertProjection', () => {
  it('appends a delimited projection while preserving the static entry points', () => {
    expect(renderAgentsWithTeamAlertProjection(BASE_AGENTS, PROJECTION)).toStrictEqual(
      ok(
        [
          BASE_AGENTS.trimEnd(),
          '',
          AGENTS_PROJECTION_START,
          '',
          PROJECTION.trimEnd(),
          AGENTS_PROJECTION_END,
          '',
        ].join('\n'),
      ),
    );
  });

  it('replaces one existing projection and is idempotent', () => {
    const stale = generatedAgents('stale');
    const current = generatedAgents(PROJECTION.trimEnd());
    const expected = renderAgentsWithTeamAlertProjection(BASE_AGENTS, PROJECTION);

    expect(renderAgentsWithTeamAlertProjection(stale, PROJECTION)).toStrictEqual(expected);
    expect(renderAgentsWithTeamAlertProjection(current, PROJECTION)).toStrictEqual(expected);
  });

  it('rejects duplicate target markers', () => {
    const duplicated = [
      BASE_AGENTS,
      AGENTS_PROJECTION_START,
      'one',
      AGENTS_PROJECTION_END,
      AGENTS_PROJECTION_START,
      'two',
      AGENTS_PROJECTION_END,
    ].join('\n');

    expect(unwrapErr(renderAgentsWithTeamAlertProjection(duplicated, PROJECTION)).message).toBe(
      'AGENTS.md may contain at most one generated Codex team-alert projection.',
    );
  });

  it.each([
    ['duplicate start only', `${AGENTS_PROJECTION_START}\n`],
    ['duplicate end only', `${AGENTS_PROJECTION_END}\n`],
  ])('rejects %s in AGENTS.md', (_label, extraMarker) => {
    const malformed = [
      BASE_AGENTS,
      AGENTS_PROJECTION_START,
      'one',
      AGENTS_PROJECTION_END,
      extraMarker,
    ].join('\n');

    expect(unwrapErr(renderAgentsWithTeamAlertProjection(malformed, PROJECTION)).message).toBe(
      'AGENTS.md may contain at most one generated Codex team-alert projection.',
    );
  });

  it('rejects incomplete target markers', () => {
    const incomplete = `${BASE_AGENTS}${AGENTS_PROJECTION_START}\n`;

    expect(unwrapErr(renderAgentsWithTeamAlertProjection(incomplete, PROJECTION)).message).toBe(
      'AGENTS.md Codex team-alert projection markers are incomplete.',
    );
  });

  it('reports malformed target markers before missing static pointers', () => {
    const outOfOrder = ['# AGENTS.md', AGENTS_PROJECTION_END, AGENTS_PROJECTION_START].join('\n');

    expect(unwrapErr(renderAgentsWithTeamAlertProjection(outOfOrder, PROJECTION)).message).toBe(
      'AGENTS.md Codex team-alert projection markers are out of order.',
    );
  });

  it('rejects required static pointers that exist only inside the stale generated block', () => {
    const stale = [
      '# AGENTS.md',
      '',
      AGENTS_PROJECTION_START,
      'Read [AGENT.md](.agent/directives/AGENT.md)',
      'See [RULES_INDEX.md](RULES_INDEX.md) for the canonical rules list.',
      AGENTS_PROJECTION_END,
      '',
    ].join('\n');

    expect(unwrapErr(renderAgentsWithTeamAlertProjection(stale, PROJECTION)).message).toBe(
      'AGENTS.md is missing its required static pointer: ' +
        'Read [AGENT.md](.agent/directives/AGENT.md)',
    );
  });

  it.each([
    ['inline start marker', `text ${AGENTS_PROJECTION_START} text\n`],
    ['backticked end marker', `text \`${AGENTS_PROJECTION_END}\` text\n`],
  ])('rejects projection content containing an %s', (_label, projection) => {
    expect(unwrapErr(renderAgentsWithTeamAlertProjection(BASE_AGENTS, projection)).message).toBe(
      'Codex team-alert projection must not contain AGENTS.md generated markers.',
    );
  });

  it.each([
    ['prefixed start marker', AGENTS_PROJECTION_START, `prefix${AGENTS_PROJECTION_START}`],
    ['suffixed start marker', AGENTS_PROJECTION_START, `${AGENTS_PROJECTION_START}suffix`],
    ['prefixed end marker', AGENTS_PROJECTION_END, `prefix${AGENTS_PROJECTION_END}`],
    ['suffixed end marker', AGENTS_PROJECTION_END, `${AGENTS_PROJECTION_END}suffix`],
  ])('rejects a %s', (_label, marker, malformedMarker) => {
    const agents = generatedAgents(PROJECTION.trimEnd()).replace(marker, malformedMarker);

    expect(unwrapErr(renderAgentsWithTeamAlertProjection(agents, PROJECTION)).message).toBe(
      'AGENTS.md Codex team-alert projection markers must occupy complete lines.',
    );
  });
});

function generatedAgents(projection: string): string {
  return [
    BASE_AGENTS.trimEnd(),
    '',
    AGENTS_PROJECTION_START,
    '',
    projection,
    AGENTS_PROJECTION_END,
    '',
  ].join('\n');
}
