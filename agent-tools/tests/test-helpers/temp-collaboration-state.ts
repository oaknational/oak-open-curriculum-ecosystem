import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(fileURLToPath(new URL('../../..', import.meta.url)));

export async function makeTempDirectory(prefix: string): Promise<string> {
  return mkdtemp(join(tmpdir(), prefix));
}

export async function removeDirectory(path: string): Promise<void> {
  await rm(path, { recursive: true, force: true });
}

export function tempPath(directory: string, name: string): string {
  return join(directory, name);
}

export function readText(path: string): Promise<string> {
  return readFile(path, 'utf8');
}

export function listEntries(path: string): Promise<readonly string[]> {
  return readdir(path);
}

export async function writeText(path: string, text: string): Promise<void> {
  await writeFile(path, text);
}

export async function writeJson(path: string, value: unknown): Promise<void> {
  await writeText(path, `${JSON.stringify(value, null, 2)}\n`);
}

export async function makeTempCollaborationRepo(
  options: { readonly seedCommsEvent?: boolean } = {},
): Promise<string> {
  const root = await makeTempDirectory('oak-collaboration-integrity-');
  const collaborationRoot = join(root, '.agent/state/collaboration');
  await mkdir(join(collaborationRoot, 'comms'), { recursive: true });
  await mkdir(join(collaborationRoot, 'comms-seen'), { recursive: true });
  await mkdir(join(collaborationRoot, 'conversations'), { recursive: true });
  await mkdir(join(collaborationRoot, 'escalations'), { recursive: true });

  for (const schema of [
    'active-claims.schema.json',
    'closed-claims.schema.json',
    'comms-event.schema.json',
    'conversation.schema.json',
    'escalation.schema.json',
  ]) {
    await writeText(
      join(collaborationRoot, schema),
      await readText(join(repoRoot, '.agent/state/collaboration', schema)),
    );
  }

  await writeJson(join(collaborationRoot, 'active-claims.json'), {
    schema_version: '1.3.0',
    commit_queue: [],
    claims: [],
  });
  await writeJson(join(collaborationRoot, 'closed-claims.archive.json'), {
    schema_version: '1.3.0',
    claims: [],
  });
  if (options.seedCommsEvent !== false) {
    await writeJson(join(collaborationRoot, 'comms/event-one.json'), validCommsEvent());
  }
  await writeText(join(collaborationRoot, 'comms-seen/watcher.json'), 'event-one\n');

  return root;
}

function validCommsEvent(): unknown {
  return {
    schema_version: '2.0.0',
    event_id: 'event-one',
    created_at: '2026-06-01T10:00:00Z',
    kind: 'narrative',
    author: {
      agent_name: 'Woodland Creeping Petal',
      platform: 'codex',
      model: 'GPT-5',
      session_id_prefix: '019dd3',
    },
    title: 'Valid event',
    body: 'Valid body.',
  };
}
