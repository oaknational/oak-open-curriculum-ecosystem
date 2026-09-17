#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';

import {
  planCursorSessionIdentityHook,
  cursorSessionIdentityHookEnvironmentFromProcessEnv,
} from '../cursor/oak-session-identity-hook.js';

const plan = planCursorSessionIdentityHook({
  stdinText: readFileSync(0, 'utf8'),
  environment: cursorSessionIdentityHookEnvironmentFromProcessEnv(process.env),
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
