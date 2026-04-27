#!/usr/bin/env node
/**
 * Cursor `sessionStart` command hook (stdio JSON per official spec).
 *
 * Contract: https://cursor.com/docs/hooks — **sessionStart** input includes
 * `session_id` (same as conversation id); output may include `env` (session-
 * scoped for subsequent hook runs) and `additional_context` (injected into the
 * composer’s initial context). Hook processes receive `CURSOR_PROJECT_DIR`
 * (workspace root) per the same page’s environment table.
 *
 * Maps `session_id` → `env.OAK_AGENT_SEED`, derives the display name (when
 * agent-tools is built), injects `additional_context`, and best-effort
 * `user_message` plus `.cursor/oak-composer-session.local.json` (gitignored)
 * because Cursor’s hook contract has no programmatic Composer tab title field
 * (see agent-tools/docs/agent-identity.md). Fails open.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const COMPOSER_MIRROR_FILE = 'oak-composer-session.local.json';
const MIRROR_SCHEMA = 'oak.cursor-composer-session.v1';

function resolveProjectDir() {
  const fromCursor = (process.env.CURSOR_PROJECT_DIR ?? '').trim();
  if (fromCursor) {
    return fromCursor;
  }
  const fromClaude = (process.env.CLAUDE_PROJECT_DIR ?? '').trim();
  if (fromClaude) {
    return fromClaude;
  }
  return process.cwd();
}

function sessionIdPrefix(sessionId) {
  return sessionId.length >= 6 ? sessionId.slice(0, 6) : sessionId;
}

/**
 * Gitignored local file for human-visible identity (suggested tab title, full
 * session id for tooling). Cursor Hooks do not expose programmatic Composer
 * tab rename; see agent-tools/docs/agent-identity.md.
 */
function writeComposerMirror(projectDir, { sessionId, displayName, prefix }) {
  if ((process.env.OAK_SKIP_COMPOSER_SESSION_MIRROR ?? '').trim() === '1') {
    return;
  }
  if (!displayName) {
    return;
  }
  try {
    const path = join(projectDir, '.cursor', COMPOSER_MIRROR_FILE);
    const suggestedComposerTabTitle = `Oak · ${displayName}`;
    const payload = {
      schema: MIRROR_SCHEMA,
      updatedAt: new Date().toISOString(),
      composerSessionId: sessionId,
      sessionIdPrefix: prefix,
      displayName,
      suggestedComposerTabTitle,
    };
    writeFileSync(path, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  } catch {
    // mirror is best-effort only
  }
}

function main() {
  const emptyOut = () => {
    console.log(JSON.stringify({ env: {}, additional_context: '' }));
  };

  let input;
  try {
    input = JSON.parse(readFileSync(0, 'utf8'));
  } catch {
    emptyOut();
    process.exit(0);
  }

  const sessionId = typeof input.session_id === 'string' ? input.session_id.trim() : '';
  if (!sessionId) {
    emptyOut();
    process.exit(0);
  }

  const projectDir = resolveProjectDir();
  const cli = join(projectDir, 'agent-tools/dist/src/bin/agent-identity.js');
  const prefix = sessionIdPrefix(sessionId);

  let displayName = '';
  try {
    const result = spawnSync(process.execPath, [cli, '--seed', sessionId, '--format', 'display'], {
      cwd: projectDir,
      encoding: 'utf8',
      maxBuffer: 1024 * 1024,
    });
    if (result.status === 0 && result.stdout) {
      displayName = result.stdout.trim();
    }
  } catch {
    // missing CLI or spawn failure — still export seed for hook-scoped env
  }

  const env = { OAK_AGENT_SEED: sessionId };
  let additional_context = '';
  let user_message = '';

  if (displayName) {
    writeComposerMirror(projectDir, { sessionId, displayName, prefix });
    const tabHint = `Oak · ${displayName}`;
    user_message = `${tabHint} — suggested Composer tab title; details in .cursor/${COMPOSER_MIRROR_FILE}`;
    additional_context = [
      '[Oak agent identity]',
      `Deterministic display name for this composer session: ${displayName}`,
      `Suggested Composer tab title (Cursor has no hook API to set it automatically): ${tabHint}`,
      `PDR-027 session_id_prefix (first 6 of composer session_id): ${prefix}`,
      'OAK_AGENT_SEED is set from the composer session_id for hook subprocesses in this session.',
      'From repo root, `pnpm agent-tools:agent-identity --format display` also resolves when OAK_AGENT_SEED is set in your shell (if Cursor forwards session env to the terminal, it matches).',
    ].join('\n');
  } else {
    additional_context = [
      '[Oak agent identity]',
      `PDR-027 session_id_prefix (first 6 of composer session_id): ${prefix}`,
      'OAK_AGENT_SEED is set from the composer session_id for this session (hook subprocesses).',
      'Build agent-tools to see the derived name here: `pnpm agent-tools:build`, then re-open the composer or rely on `pnpm agent-tools:agent-identity --format display --seed <composer-session-id>`.',
    ].join('\n');
  }

  const out = { env, additional_context };
  if (user_message) {
    out.user_message = user_message;
  }
  console.log(JSON.stringify(out));
}

main();
