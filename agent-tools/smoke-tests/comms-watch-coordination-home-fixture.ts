import { execFileSync } from 'node:child_process';
import { realpathSync } from 'node:fs';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { ACTIVE_CLAIMS_SCHEMA_VERSION } from '../src/collaboration-state/types';
import { resolveTrustedGit } from '../src/core/trusted-git';

export const AGENT_NAME = 'Europa stirs Void';
const SESSION_ID = '019fad-mcp360-smoke';
export const EVENT_ID = '10000000-0000-4000-8000-000000000360';
export const EVENT_TITLE = 'MCP-360 primary-home smoke event';

export interface Fixture {
  readonly root: string;
  readonly primary: string;
  readonly linked: string;
  readonly commsDir: string;
  readonly seenFile: string;
  readonly heartbeatFile: string;
  readonly activePath: string;
}

const peerIdentity = {
  agent_name: 'Lynx guards Whisper',
  platform: 'claude',
  model: 'test-model',
  session_id_prefix: '9e8a61',
  id: '6ba7b810-9dad-51d1-80b4-00c04fd430c8',
} as const;

function git(cwd: string, ...args: readonly string[]): void {
  execFileSync(resolveTrustedGit(), [...args], { cwd, encoding: 'utf8' });
}

async function writeJson(path: string, value: unknown): Promise<void> {
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`);
}

async function seedGitRepository(primary: string, linked: string): Promise<void> {
  await mkdir(primary, { recursive: true });
  git(primary, 'init', '--initial-branch=main');
  git(primary, 'config', 'user.email', 'mcp360-smoke@test.invalid');
  git(primary, 'config', 'user.name', 'MCP-360 Smoke');
  git(primary, 'config', 'commit.gpgsign', 'false');
  await writeFile(join(primary, 'README.md'), 'seed\n');
  git(primary, 'add', 'README.md');
  git(primary, 'commit', '-m', 'chore: seed');
  git(primary, 'worktree', 'add', linked, '-b', 'lane/mcp360');
}

function eventFixture(nowIso: string): unknown {
  return {
    schema_version: '2.0.0',
    event_id: EVENT_ID,
    created_at: nowIso,
    kind: 'narrative',
    author: peerIdentity,
    title: EVENT_TITLE,
    body: 'The omitted-path watcher must consume this primary-home event.',
  };
}

function registryFixture(nowIso: string): unknown {
  return {
    schema_version: ACTIVE_CLAIMS_SCHEMA_VERSION,
    claims: [
      {
        claim_id: 'aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee',
        agent_id: peerIdentity,
        thread: 'smoke-peer',
        areas: [{ kind: 'files', patterns: ['peer/**'] }],
        claimed_at: nowIso,
        freshness_seconds: 14400,
        sidebar_open: false,
        intent: 'Keep the F-95 populated-registry gate active.',
      },
    ],
  };
}

async function seedCoordinationState(fixture: Fixture): Promise<void> {
  await mkdir(fixture.commsDir, { recursive: true });
  const nowIso = new Date().toISOString();
  await writeJson(join(fixture.commsDir, `${EVENT_ID}.json`), eventFixture(nowIso));
  await writeJson(fixture.activePath, registryFixture(nowIso));
}

export async function makeFixture(): Promise<Fixture> {
  const root = realpathSync(await mkdtemp(join(tmpdir(), 'oak-mcp360-')));
  const primary = join(root, 'primary');
  const linked = join(root, 'linked');
  await seedGitRepository(primary, linked);
  const collaborationDir = join(primary, '.agent/state/collaboration');
  const seenFile = join(collaborationDir, 'comms-seen', `${AGENT_NAME}.json`);
  const fixture = {
    root,
    primary,
    linked,
    commsDir: join(collaborationDir, 'comms'),
    seenFile,
    heartbeatFile: `${seenFile}.heartbeat.json`,
    activePath: join(collaborationDir, 'active-claims.json'),
  };
  await seedCoordinationState(fixture);
  return fixture;
}

export function agentEnvironment(): NodeJS.ProcessEnv {
  const env = { ...process.env };
  delete env.PRACTICE_AGENT_SESSION_ID_CLAUDE;
  delete env.PRACTICE_AGENT_SESSION_ID_CURSOR;
  delete env.PRACTICE_AGENT_SESSION_ID_GEMINI;
  delete env.CODEX_THREAD_ID;
  delete env.conversationId;
  delete env.ANTIGRAVITY_SOURCE_METADATA;
  delete env.PRACTICE_COORDINATION_HOME;
  env.PRACTICE_AGENT_IDENTITY_OVERRIDE = AGENT_NAME;
  env.PRACTICE_AGENT_SESSION_ID_CODEX = SESSION_ID;
  return env;
}

export async function removeFixture(fixture: Fixture): Promise<void> {
  await rm(fixture.root, { recursive: true, force: true });
}
