#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';

import {
  planCursorSessionIdentityHook,
  type CursorSessionIdentityHookEnvironment,
} from '../cursor/oak-session-identity-hook.js';

const plan = planCursorSessionIdentityHook({
  stdinText: readFileSync(0, 'utf8'),
  environment: processEnvironment(),
  fallbackProjectDir: process.cwd(),
  nowIso: new Date().toISOString(),
});

if (plan.mirror !== undefined) {
  try {
    writeFileSync(plan.mirror.absolutePath, `${JSON.stringify(plan.mirror.payload, null, 2)}\n`);
  } catch {
    // The mirror is a best-effort human affordance; hook output remains valid.
  }
}

process.stdout.write(`${JSON.stringify(plan.output)}\n`);

function processEnvironment(): CursorSessionIdentityHookEnvironment {
  return {
    ...(process.env.CURSOR_PROJECT_DIR === undefined
      ? {}
      : { CURSOR_PROJECT_DIR: process.env.CURSOR_PROJECT_DIR }),
    ...(process.env.CLAUDE_PROJECT_DIR === undefined
      ? {}
      : { CLAUDE_PROJECT_DIR: process.env.CLAUDE_PROJECT_DIR }),
    ...(process.env.OAK_SKIP_COMPOSER_SESSION_MIRROR === undefined
      ? {}
      : { OAK_SKIP_COMPOSER_SESSION_MIRROR: process.env.OAK_SKIP_COMPOSER_SESSION_MIRROR }),
  };
}
