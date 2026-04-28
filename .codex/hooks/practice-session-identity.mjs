#!/usr/bin/env node
/**
 * Codex `SessionStart` hook shim for Practice agent identity.
 *
 * Delegates to the built adapter inside agent-tools at
 * `agent-tools/dist/src/bin/codex-session-identity-hook.js`. The adapter
 * parses Codex stdin JSON and prints a `hookSpecificOutput` payload carrying
 * the PDR-027 identity block plus the canonical identity-preflight command.
 *
 * Soft surface: if the build artefact is missing or the adapter fails before
 * producing output, this shim exits 0 with `{}` so session startup continues.
 */

import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const builtHookUrl = new URL(
  '../../agent-tools/dist/src/bin/codex-session-identity-hook.js',
  import.meta.url,
);

try {
  if (existsSync(fileURLToPath(builtHookUrl))) {
    await import(builtHookUrl.href);
  } else {
    process.stdout.write('{}\n');
  }
} catch {
  process.stdout.write('{}\n');
}
