import { err, isErr, ok, type Result } from '@oaknational/result';

import {
  findOptionalStandaloneMarkerRange,
  type MarkerRange,
} from './team-alert-bootstrap-markers.js';

/** Delimiters around the generated projection in AGENTS.md. */
export const AGENTS_PROJECTION_START = '<!-- CODEX_TEAM_ALERT_BOOTSTRAP_GENERATED_START -->';
export const AGENTS_PROJECTION_END = '<!-- CODEX_TEAM_ALERT_BOOTSTRAP_GENERATED_END -->';

const REQUIRED_AGENTS_POINTERS = [
  'Read [AGENT.md](.agent/directives/AGENT.md)',
  'See [RULES_INDEX.md](RULES_INDEX.md) for the canonical rules list.',
] as const;

/** Insert or replace the generated AGENTS.md block without changing its static pointers. */
export function renderAgentsWithTeamAlertProjection(
  agents: string,
  projection: string,
): Result<string, Error> {
  const markerDefect = projectionTargetMarkerDefect(projection);
  if (markerDefect !== undefined) {
    return err(new Error(markerDefect));
  }

  const range = findGeneratedRange(agents);
  if (isErr(range)) {
    return range;
  }

  const missingPointer = findMissingStaticPointer(agents, range.value);
  if (missingPointer !== undefined) {
    return err(new Error(`AGENTS.md is missing its required static pointer: ${missingPointer}`));
  }

  const generatedBlock = renderGeneratedBlock(projection);
  return range.value === undefined
    ? ok(`${agents.trimEnd()}\n\n${generatedBlock}\n`)
    : ok(replaceGeneratedBlock(agents, range.value, generatedBlock));
}

/** Return the shared source/target integrity defect for nested generated markers. */
export function projectionTargetMarkerDefect(projection: string): string | undefined {
  return projection.includes(AGENTS_PROJECTION_START) || projection.includes(AGENTS_PROJECTION_END)
    ? 'Codex team-alert projection must not contain AGENTS.md generated markers.'
    : undefined;
}

function findGeneratedRange(agents: string): Result<MarkerRange | undefined, Error> {
  return findOptionalStandaloneMarkerRange(agents, AGENTS_PROJECTION_START, AGENTS_PROJECTION_END, {
    duplicate: 'AGENTS.md may contain at most one generated Codex team-alert projection.',
    incomplete: 'AGENTS.md Codex team-alert projection markers are incomplete.',
    order: 'AGENTS.md Codex team-alert projection markers are out of order.',
    standalone: 'AGENTS.md Codex team-alert projection markers must occupy complete lines.',
  });
}

function findMissingStaticPointer(agents: string, range: MarkerRange | undefined) {
  if (range === undefined) {
    return REQUIRED_AGENTS_POINTERS.find((pointer) => !agents.includes(pointer));
  }

  const before = agents.slice(0, range.startIndex);
  const after = agents.slice(range.endIndex + AGENTS_PROJECTION_END.length);
  return REQUIRED_AGENTS_POINTERS.find(
    (pointer) => !before.includes(pointer) && !after.includes(pointer),
  );
}

function renderGeneratedBlock(projection: string): string {
  return [AGENTS_PROJECTION_START, '', projection.trimEnd(), AGENTS_PROJECTION_END].join('\n');
}

function replaceGeneratedBlock(agents: string, range: MarkerRange, generatedBlock: string): string {
  const afterEnd = range.endIndex + AGENTS_PROJECTION_END.length;
  const rendered = `${agents.slice(0, range.startIndex)}${generatedBlock}${agents.slice(afterEnd)}`;
  return `${rendered.trimEnd()}\n`;
}
