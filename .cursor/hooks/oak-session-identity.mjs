#!/usr/bin/env node
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const builtHookUrl = new URL(
  '../../agent-tools/dist/src/bin/cursor-oak-session-identity-hook.js',
  import.meta.url,
);

if (existsSync(fileURLToPath(builtHookUrl))) {
  await import(builtHookUrl.href);
} else {
  process.stdout.write(`${JSON.stringify({ env: {}, additional_context: '' })}\n`);
}
