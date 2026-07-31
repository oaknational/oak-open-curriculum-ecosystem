import { Buffer } from 'node:buffer';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { err, isErr, ok, type Result } from '@oaknational/result';

import { findRequiredStandaloneMarkerRange } from './team-alert-bootstrap-markers.js';
import {
  projectionTargetMarkerDefect,
  renderAgentsWithTeamAlertProjection,
} from './team-alert-bootstrap-render.js';

export { AGENTS_PROJECTION_END, AGENTS_PROJECTION_START } from './team-alert-bootstrap-render.js';

/** Canonical source for the projected Codex team-alert tripwire. */
const CANONICAL_RULE_PATH = '.agent/rules/use-monitor-for-event-driven-wake.md';

/** Codex-native repository instruction surface receiving the projection. */
export const AGENTS_PATH = 'AGENTS.md';

/** Delimiters around the canonical projection source. */
export const SOURCE_PROJECTION_START = '<!-- CODEX_TEAM_ALERT_BOOTSTRAP_SOURCE_START -->';
export const SOURCE_PROJECTION_END = '<!-- CODEX_TEAM_ALERT_BOOTSTRAP_SOURCE_END -->';

/** Keep the auto-loaded projection deliberately small for low-power seats. */
export const MAX_PROJECTION_BYTES = 1_200;
export const MAX_PROJECTION_LINES = 16;

/** Filesystem seam used by generation and drift checking. */
export interface TeamAlertBootstrapFileIo {
  readonly readCanonicalRule: (repoRoot: string) => Promise<Result<string, Error>>;
  readonly readAgents: (repoRoot: string) => Promise<Result<string, Error>>;
  readonly writeAgents: (repoRoot: string, content: string) => Promise<void>;
}

/** Production filesystem implementation. */
export const NODE_FILE_IO: TeamAlertBootstrapFileIo = {
  readCanonicalRule: (repoRoot) => readNodeText(join(repoRoot, CANONICAL_RULE_PATH)),
  readAgents: (repoRoot) => readNodeText(join(repoRoot, AGENTS_PATH)),
  writeAgents: (repoRoot, content) => writeFile(join(repoRoot, AGENTS_PATH), content, 'utf8'),
};

export interface TeamAlertBootstrapCheck {
  readonly upToDate: boolean;
}

/** Extract the single bounded projection from the canonical watcher rule. */
export function extractTeamAlertProjection(canonical: string): Result<string, Error> {
  const projection = extractMarkedProjection(canonical);
  if (isErr(projection)) {
    return projection;
  }
  const markerDefect = projectionTargetMarkerDefect(projection.value);
  if (markerDefect !== undefined) {
    return err(new Error(markerDefect));
  }
  const budgetDefect = projectionBudgetDefect(projection.value);
  return budgetDefect === undefined ? projection : err(new Error(budgetDefect));
}

function extractMarkedProjection(canonical: string): Result<string, Error> {
  const range = findRequiredStandaloneMarkerRange(
    canonical,
    SOURCE_PROJECTION_START,
    SOURCE_PROJECTION_END,
    {
      count: (startCount, endCount) =>
        `Expected exactly one ${SOURCE_PROJECTION_START} and one ` +
        `${SOURCE_PROJECTION_END}; found ${startCount} and ${endCount}.`,
      order: 'Codex team-alert projection markers are out of order.',
      standalone: 'Codex team-alert projection markers must each sit on their own line.',
    },
  );
  if (isErr(range)) {
    return range;
  }

  const projectionStart = range.value.startIndex + SOURCE_PROJECTION_START.length;
  const rawProjection = canonical.slice(projectionStart, range.value.endIndex);
  if (!rawProjection.startsWith('\n') || !rawProjection.endsWith('\n')) {
    return err(new Error('Codex team-alert projection markers must each sit on their own line.'));
  }

  const projection = `${rawProjection.slice(1).trimEnd()}\n`;
  if (projection.trim().length === 0) {
    return err(new Error('Codex team-alert projection must not be empty.'));
  }
  if (projection.includes('\r')) {
    return err(new Error('Codex team-alert projection must use LF line endings.'));
  }

  return ok(projection);
}

function projectionBudgetDefect(projection: string): string | undefined {
  const byteLength = Buffer.byteLength(projection, 'utf8');
  if (byteLength > MAX_PROJECTION_BYTES) {
    return (
      `Codex team-alert projection exceeds its ${MAX_PROJECTION_BYTES}-byte budget ` +
      `(${byteLength} bytes).`
    );
  }

  const lineCount = projection.trimEnd().split('\n').length;
  if (lineCount > MAX_PROJECTION_LINES) {
    return (
      `Codex team-alert projection exceeds its ${MAX_PROJECTION_LINES}-line budget ` +
      `(${lineCount} lines).`
    );
  }
  return undefined;
}

/** Generate the committed AGENTS.md projection from the canonical rule. */
export async function generateTeamAlertBootstrap(
  repoRoot: string,
  io: TeamAlertBootstrapFileIo,
): Promise<Result<string, Error>> {
  const rendered = await renderFromRepo(repoRoot, io);
  if (isErr(rendered)) {
    return rendered;
  }

  try {
    await io.writeAgents(repoRoot, rendered.value.rendered);
  } catch (cause: unknown) {
    return err(new Error(`Cannot write ${AGENTS_PATH}`, { cause: errorFrom(cause) }));
  }
  return ok(join(repoRoot, AGENTS_PATH));
}

/** Recompute in memory and fail when the committed AGENTS.md projection has drifted. */
export async function checkTeamAlertBootstrap(
  repoRoot: string,
  io: TeamAlertBootstrapFileIo,
): Promise<Result<TeamAlertBootstrapCheck, Error>> {
  const rendered = await renderFromRepo(repoRoot, io);
  return isErr(rendered)
    ? rendered
    : ok({ upToDate: rendered.value.actual === rendered.value.rendered });
}

interface RenderedTeamAlertBootstrap {
  readonly actual: string;
  readonly rendered: string;
}

async function renderFromRepo(
  repoRoot: string,
  io: TeamAlertBootstrapFileIo,
): Promise<Result<RenderedTeamAlertBootstrap, Error>> {
  const canonical = await readRequiredText(
    () => io.readCanonicalRule(repoRoot),
    `canonical rule ${CANONICAL_RULE_PATH}`,
  );
  if (isErr(canonical)) {
    return canonical;
  }
  const projection = extractTeamAlertProjection(canonical.value);
  if (isErr(projection)) {
    return projection;
  }
  const agents = await readRequiredText(() => io.readAgents(repoRoot), AGENTS_PATH);
  if (isErr(agents)) {
    return agents;
  }
  const rendered = renderAgentsWithTeamAlertProjection(agents.value, projection.value);
  return isErr(rendered) ? rendered : ok({ actual: agents.value, rendered: rendered.value });
}

async function readRequiredText(
  read: () => Promise<Result<string, Error>>,
  label: string,
): Promise<Result<string, Error>> {
  try {
    const result = await read();
    return isErr(result) ? err(new Error(`Cannot read ${label}`, { cause: result.error })) : result;
  } catch (cause: unknown) {
    return err(new Error(`Cannot read ${label}`, { cause: errorFrom(cause) }));
  }
}

async function readNodeText(path: string): Promise<Result<string, Error>> {
  try {
    return ok(await readFile(path, 'utf8'));
  } catch (cause: unknown) {
    return err(errorFrom(cause));
  }
}

function errorFrom(cause: unknown): Error {
  return cause instanceof Error ? cause : new Error(String(cause), { cause });
}
