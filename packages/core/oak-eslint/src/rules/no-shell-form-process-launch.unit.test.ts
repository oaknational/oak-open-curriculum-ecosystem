import { noShellFormProcessLaunchRule } from './no-shell-form-process-launch.js';
import { ruleTester } from '../test-support/rule-tester.js';

ruleTester.run('no-shell-form-process-launch', noShellFormProcessLaunchRule, {
  valid: [
    // ────────────────────────────────────────────────────────────────────
    // Argv-form launches with no shell option.
    // ────────────────────────────────────────────────────────────────────
    {
      code: `import { execFileSync } from 'node:child_process';\nexecFileSync('git', ['log', ref], { encoding: 'utf8' });`,
    },
    {
      code: `import { execFile, fork, spawn, spawnSync } from 'node:child_process';\nspawn('git', ['status']);\nspawnSync('pnpm', [gate], { cwd: root, stdio: 'ignore' });\nexecFile('gh', ['pr', 'view']);\nfork('./worker.js', ['--once']);`,
    },
    {
      code: `import { spawn } from 'child_process';\nspawn('git', ['status']);`,
    },
    {
      code: `import { sync as crossSpawnSync } from 'cross-spawn';\ncrossSpawnSync('pnpm', [...args], { cwd, stdio: 'inherit' });`,
    },
    {
      code: `import * as childProcess from 'node:child_process';\nchildProcess.execFileSync('git', ['status']);\nchildProcess.spawn('git', ['status']);`,
    },
    {
      code: `import childProcess from 'node:child_process';\nchildProcess.execFile('git', ['status']);`,
    },
    {
      code: `const { execFileSync } = require('node:child_process');\nexecFileSync('git', ['status']);`,
    },
    // ────────────────────────────────────────────────────────────────────
    // An explicit `shell: false` launches no shell.
    // ────────────────────────────────────────────────────────────────────
    {
      code: `import { spawnSync } from 'node:child_process';\nspawnSync('git', ['status'], { shell: false });`,
    },
    {
      code: `const options = {};\noptions.shell = false;`,
    },
    // ────────────────────────────────────────────────────────────────────
    // `exec` on anything that is not the child_process module.
    // ────────────────────────────────────────────────────────────────────
    {
      code: `const match = /ready (\\d+)/u.exec(text);`,
    },
    {
      code: `const GREEN = /ok/u;\nconst green = GREEN.exec(result.stdout);`,
    },
    {
      code: `import { spawnSync } from 'node:child_process';\nconst result = spawnSync('git', ['status']);\nconst match = PATTERN.exec(String(result.stdout));`,
    },
    {
      code: `import * as childProcess from 'node:child_process';\nfunction scan(childProcess: RegExp, line: string) { return childProcess.exec(line); }`,
    },
    {
      code: `import { exec } from './database-client.js';\nexec('select 1');`,
    },
    // ────────────────────────────────────────────────────────────────────
    // Type-only positions run nothing.
    // ────────────────────────────────────────────────────────────────────
    {
      code: `import type { ExecFileSyncOptionsWithStringEncoding, exec } from 'node:child_process';\ntype Exec = typeof exec;`,
    },
    {
      code: `interface LaunchOptions { readonly shell: boolean }\nfunction read({ shell }: LaunchOptions) { return shell; }`,
    },
  ],
  invalid: [
    // ────────────────────────────────────────────────────────────────────
    // exec / execSync imported by name, with or without the node: prefix.
    // ────────────────────────────────────────────────────────────────────
    {
      code: `import { exec } from 'node:child_process';\nexec('git status');`,
      errors: [{ messageId: 'shellRunningFunction', data: { name: 'exec' } }],
    },
    {
      code: `import { execSync } from 'child_process';\nexecSync('git status');`,
      errors: [{ messageId: 'shellRunningFunction', data: { name: 'execSync' } }],
    },
    {
      code: `import { exec as run, execFile, execSync as runSync } from 'node:child_process';`,
      errors: [
        { messageId: 'shellRunningFunction', data: { name: 'exec' } },
        { messageId: 'shellRunningFunction', data: { name: 'execSync' } },
      ],
    },
    {
      code: `export { exec, spawn } from 'node:child_process';`,
      errors: [{ messageId: 'shellRunningFunction', data: { name: 'exec' } }],
    },
    // ────────────────────────────────────────────────────────────────────
    // exec / execSync reached as a member of the module.
    // ────────────────────────────────────────────────────────────────────
    {
      code: `import * as cp from 'node:child_process';\ncp.exec('git status');`,
      errors: [{ messageId: 'shellRunningFunction', data: { name: 'exec' } }],
    },
    {
      code: `import childProcess from 'node:child_process';\nchildProcess.execSync('git status');`,
      errors: [{ messageId: 'shellRunningFunction', data: { name: 'execSync' } }],
    },
    {
      code: `import * as cp from 'child_process';\ncp['exec']('git status');`,
      errors: [{ messageId: 'shellRunningFunction', data: { name: 'exec' } }],
    },
    {
      code: `import { promisify } from 'node:util';\nimport * as cp from 'node:child_process';\nconst run = promisify(cp.exec);`,
      errors: [{ messageId: 'shellRunningFunction', data: { name: 'exec' } }],
    },
    {
      code: `import * as cp from 'node:child_process';\nconst { execSync, spawn } = cp;`,
      errors: [{ messageId: 'shellRunningFunction', data: { name: 'execSync' } }],
    },
    {
      code: `import cp = require('node:child_process');\ncp.exec('git status');`,
      errors: [{ messageId: 'shellRunningFunction', data: { name: 'exec' } }],
    },
    // ────────────────────────────────────────────────────────────────────
    // exec / execSync reached through require(...).
    // ────────────────────────────────────────────────────────────────────
    {
      code: `const { exec } = require('node:child_process');`,
      errors: [{ messageId: 'shellRunningFunction', data: { name: 'exec' } }],
    },
    {
      code: `const cp = require('child_process');\ncp.execSync('git status');`,
      errors: [{ messageId: 'shellRunningFunction', data: { name: 'execSync' } }],
    },
    {
      code: `require('node:child_process').exec('git status');`,
      errors: [{ messageId: 'shellRunningFunction', data: { name: 'exec' } }],
    },
    // ────────────────────────────────────────────────────────────────────
    // A shell option that is not the literal `false`.
    // ────────────────────────────────────────────────────────────────────
    {
      code: `import { spawnSync } from 'node:child_process';\nspawnSync('git', ['log', ref], { shell: true });`,
      errors: [{ messageId: 'shellOption' }],
    },
    {
      code: `import { spawn } from 'node:child_process';\nspawn('git', ['status'], { shell: 'bash' });`,
      errors: [{ messageId: 'shellOption' }],
    },
    {
      code: `import { execFile } from 'node:child_process';\nexecFile('git', ['status'], { shell: useShell });`,
      errors: [{ messageId: 'shellOption' }],
    },
    {
      code: `import { spawn } from 'node:child_process';\nspawn('git', ['status'], { shell });`,
      errors: [{ messageId: 'shellOption' }],
    },
    {
      code: `import { spawn } from 'node:child_process';\nspawn('git', ['status'], { 'shell': true });`,
      errors: [{ messageId: 'shellOption' }],
    },
    {
      code: `import { sync as crossSpawnSync } from 'cross-spawn';\ncrossSpawnSync('pnpm', [gate], { ...base, shell: true });`,
      errors: [{ messageId: 'shellOption' }],
    },
    // ────────────────────────────────────────────────────────────────────
    // A shell option written away from the launch call still reaches it.
    // ────────────────────────────────────────────────────────────────────
    {
      code: `import { spawnSync } from 'node:child_process';\nconst options = { stdio: 'inherit', shell: true };\nspawnSync('git', ['status'], options);`,
      errors: [{ messageId: 'shellOption' }],
    },
    {
      code: `runGate('pnpm', ['lint'], { shell: true });`,
      errors: [{ messageId: 'shellOption' }],
    },
    {
      code: `const options = {};\noptions.shell = true;`,
      errors: [{ messageId: 'shellOption' }],
    },
  ],
});
