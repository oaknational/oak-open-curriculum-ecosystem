#!/usr/bin/env node
/**
 * Merge Oak Cursor statusLine into ~/.cursor/cli-config.json.
 *
 * Cursor documents statusLine as a global CLI setting; the command path is
 * stored absolute so it works regardless of cwd. Re-run after moving the repo.
 *
 * Usage: node .cursor/scripts/install-statusline-cli-config.mjs
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const shimPath = resolve(repoRoot, '.cursor/scripts/statusline-identity.mjs');
const command = `node ${shimPath}`;

const configDir =
  process.env.CURSOR_CONFIG_DIR ??
  (process.env.XDG_CONFIG_HOME
    ? resolve(process.env.XDG_CONFIG_HOME, 'cursor')
    : resolve(homedir(), '.cursor'));
const configPath = resolve(configDir, 'cli-config.json');

const defaults = {
  version: 1,
  editor: { vimMode: false },
  permissions: { allow: [], deny: [] },
};

let config = { ...defaults };
if (existsSync(configPath)) {
  try {
    const parsed = JSON.parse(readFileSync(configPath, 'utf8'));
    if (parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed)) {
      config = { ...defaults, ...parsed };
      if (parsed.editor !== null && typeof parsed.editor === 'object') {
        config.editor = { ...defaults.editor, ...parsed.editor };
      }
      if (parsed.permissions !== null && typeof parsed.permissions === 'object') {
        config.permissions = {
          allow: Array.isArray(parsed.permissions.allow) ? parsed.permissions.allow : [],
          deny: Array.isArray(parsed.permissions.deny) ? parsed.permissions.deny : [],
        };
      }
    }
  } catch (error) {
    console.error(`Could not parse ${configPath}: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
} else {
  mkdirSync(configDir, { recursive: true });
}

config.statusLine = {
  type: 'command',
  command,
  padding: 2,
};

writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`, 'utf8');
console.log(`Updated ${configPath}`);
console.log(`  statusLine.command: ${command}`);
