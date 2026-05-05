import { noRealIoInTestsRule } from './no-real-io-in-tests.js';
import { ruleTester } from '../test-support/rule-tester.js';

const TEST_FILE = 'apps/oak-curriculum-mcp-streamable-http/src/handlers/example.test.ts';
const SPEC_FILE = 'apps/oak-curriculum-mcp-streamable-http/src/handlers/example.spec.ts';
const UNIT_TEST_FILE = 'apps/oak-curriculum-mcp-streamable-http/src/handlers/example.unit.test.ts';
const INTEGRATION_TEST_FILE =
  'apps/oak-curriculum-mcp-streamable-http/src/handlers/example.integration.test.ts';
const E2E_TEST_FILE = 'apps/oak-curriculum-mcp-streamable-http/e2e-tests/example.e2e.test.ts';
const NON_TEST_FILE = 'apps/oak-curriculum-mcp-streamable-http/src/handlers/example.ts';

const TEST_HELPERS_TEST = 'apps/oak-curriculum-mcp-streamable-http/src/test-helpers/loader.test.ts';
const TEST_FAKES_TEST = 'packages/libs/sentry-node/src/test-fakes/sentry-fake.test.ts';
const VITEST_CONFIG = 'apps/oak-curriculum-mcp-streamable-http/vitest.config.ts';
const VITEST_NAMED_CONFIG = 'apps/oak-curriculum-mcp-streamable-http/vitest.unit.config.ts';
const VITEST_SETUP = 'apps/oak-curriculum-mcp-streamable-http/vitest.setup.ts';

ruleTester.run('no-real-io-in-tests', noRealIoInTestsRule, {
  valid: [
    // ────────────────────────────────────────────────────────────────────
    // Out-of-scope file shapes — rule does not fire on non-test files.
    // ────────────────────────────────────────────────────────────────────
    {
      filename: NON_TEST_FILE,
      code: `import { readFileSync } from 'node:fs';\nreadFileSync('config.json');`,
    },

    // ────────────────────────────────────────────────────────────────────
    // Empty / safe test file — no IO at all.
    // ────────────────────────────────────────────────────────────────────
    {
      filename: TEST_FILE,
      code: `import { describe, it, expect } from 'vitest';\ndescribe('a', () => { it('b', () => { expect(1).toBe(1); }); });`,
    },

    // ────────────────────────────────────────────────────────────────────
    // Type-only imports of banned modules — do not execute IO.
    // ────────────────────────────────────────────────────────────────────
    {
      filename: TEST_FILE,
      code: `import type { Stats } from 'node:fs';\nconst s: Stats | null = null;`,
    },
    {
      filename: TEST_FILE,
      code: `import { type Stats } from 'node:fs';\nconst s: Stats | null = null;`,
    },

    // ────────────────────────────────────────────────────────────────────
    // Allowlisted by structural path-shape: **/test-helpers/**.
    // ────────────────────────────────────────────────────────────────────
    {
      filename: TEST_HELPERS_TEST,
      code: `import { readFileSync } from 'node:fs';\nreadFileSync('fixture.json');`,
    },

    // ────────────────────────────────────────────────────────────────────
    // Allowlisted by structural path-shape: **/test-fakes/**.
    // ────────────────────────────────────────────────────────────────────
    {
      filename: TEST_FAKES_TEST,
      code: `import { spawn } from 'node:child_process';\nspawn('echo', ['hi']);`,
    },

    // ────────────────────────────────────────────────────────────────────
    // Allowlisted by structural path-shape: vitest.config.ts (workspace root).
    // ────────────────────────────────────────────────────────────────────
    {
      filename: VITEST_CONFIG,
      code: `import { defineConfig } from 'vitest/config';\nimport { readFileSync } from 'node:fs';\nexport default defineConfig({});`,
    },

    // ────────────────────────────────────────────────────────────────────
    // Allowlisted by structural path-shape: vitest.<name>.config.ts.
    // ────────────────────────────────────────────────────────────────────
    {
      filename: VITEST_NAMED_CONFIG,
      code: `import { defineConfig } from 'vitest/config';\nimport fs from 'node:fs';\nexport default defineConfig({});`,
    },

    // ────────────────────────────────────────────────────────────────────
    // Allowlisted by structural path-shape: vitest.setup.ts.
    // ────────────────────────────────────────────────────────────────────
    {
      filename: VITEST_SETUP,
      code: `import { readFileSync } from 'node:fs';\nimport { afterEach } from 'vitest';\nafterEach(() => readFileSync('reset.json'));`,
    },

    // ────────────────────────────────────────────────────────────────────
    // Allowlisted by caller-supplied allowlistPathShapes option — for a
    // frozen historical-violation inventory.
    // ────────────────────────────────────────────────────────────────────
    {
      filename: 'apps/oak-curriculum-mcp-streamable-http/src/legacy/legacy.test.ts',
      options: [{ allowlistPathShapes: ['**/legacy/**'] }],
      code: `import { readFileSync } from 'node:fs';\nreadFileSync('legacy-fixture.json');`,
    },

    // ────────────────────────────────────────────────────────────────────
    // Localhost fetch literals — allowed.
    // ────────────────────────────────────────────────────────────────────
    {
      filename: TEST_FILE,
      code: `await fetch('http://localhost:3333/health');`,
    },
    {
      filename: TEST_FILE,
      code: `await fetch('https://localhost/secure');`,
    },
    {
      filename: TEST_FILE,
      code: `await fetch('http://127.0.0.1:8080/api');`,
    },
    {
      filename: TEST_FILE,
      code: `await fetch('https://127.0.0.1/secure');`,
    },

    // ────────────────────────────────────────────────────────────────────
    // Importing a non-banned module — allowed.
    // ────────────────────────────────────────────────────────────────────
    {
      filename: TEST_FILE,
      code: `import { describe, it } from 'vitest';\nimport { strict as assert } from 'node:assert';\ndescribe('x', () => { it('y', () => { assert.equal(1, 1); }); });`,
    },

    // ────────────────────────────────────────────────────────────────────
    // require() of a non-banned module — allowed.
    // ────────────────────────────────────────────────────────────────────
    {
      filename: TEST_FILE,
      code: `const assert = require('node:assert');\nassert.equal(1, 1);`,
    },

    // ────────────────────────────────────────────────────────────────────
    // Method-call fetch (e.g. window.fetch / client.fetch) — out of scope; rule
    // targets the global fetch identifier only.
    // ────────────────────────────────────────────────────────────────────
    {
      filename: TEST_FILE,
      code: `const client = makeClient();\nawait client.fetch('https://example.com');`,
    },
  ],

  invalid: [
    // ────────────────────────────────────────────────────────────────────
    // STATIC IMPORTS — fs (named, default, fs/promises, node-prefixed).
    // ────────────────────────────────────────────────────────────────────
    {
      filename: TEST_FILE,
      code: `import { readFileSync } from 'fs';\nreadFileSync('x.json');`,
      errors: [{ messageId: 'bannedModuleStaticImport', data: { specifier: 'fs' } }],
    },
    {
      filename: TEST_FILE,
      code: `import { readFileSync } from 'node:fs';\nreadFileSync('x.json');`,
      errors: [{ messageId: 'bannedModuleStaticImport', data: { specifier: 'node:fs' } }],
    },
    {
      filename: TEST_FILE,
      code: `import fs from 'fs';\nfs.readFileSync('x.json');`,
      errors: [{ messageId: 'bannedModuleStaticImport', data: { specifier: 'fs' } }],
    },
    {
      filename: TEST_FILE,
      code: `import fs from 'node:fs';\nfs.readFileSync('x.json');`,
      errors: [{ messageId: 'bannedModuleStaticImport', data: { specifier: 'node:fs' } }],
    },
    {
      filename: TEST_FILE,
      code: `import { readFile } from 'fs/promises';\nawait readFile('x.json');`,
      errors: [{ messageId: 'bannedModuleStaticImport', data: { specifier: 'fs/promises' } }],
    },
    {
      filename: TEST_FILE,
      code: `import { readFile } from 'node:fs/promises';\nawait readFile('x.json');`,
      errors: [{ messageId: 'bannedModuleStaticImport', data: { specifier: 'node:fs/promises' } }],
    },
    {
      filename: TEST_FILE,
      code: `import * as fs from 'node:fs';\nfs.readFileSync('x.json');`,
      errors: [{ messageId: 'bannedModuleStaticImport', data: { specifier: 'node:fs' } }],
    },

    // ────────────────────────────────────────────────────────────────────
    // STATIC IMPORTS — child_process (every factory) + node-prefixed variant.
    // ────────────────────────────────────────────────────────────────────
    {
      filename: TEST_FILE,
      code: `import { spawn } from 'child_process';\nspawn('echo');`,
      errors: [{ messageId: 'bannedModuleStaticImport', data: { specifier: 'child_process' } }],
    },
    {
      filename: TEST_FILE,
      code: `import { exec } from 'child_process';\nexec('echo');`,
      errors: [{ messageId: 'bannedModuleStaticImport', data: { specifier: 'child_process' } }],
    },
    {
      filename: TEST_FILE,
      code: `import { fork } from 'child_process';\nfork('./worker.js');`,
      errors: [{ messageId: 'bannedModuleStaticImport', data: { specifier: 'child_process' } }],
    },
    {
      filename: TEST_FILE,
      code: `import { execFile } from 'child_process';\nexecFile('echo');`,
      errors: [{ messageId: 'bannedModuleStaticImport', data: { specifier: 'child_process' } }],
    },
    {
      filename: TEST_FILE,
      code: `import { spawnSync } from 'child_process';\nspawnSync('echo');`,
      errors: [{ messageId: 'bannedModuleStaticImport', data: { specifier: 'child_process' } }],
    },
    {
      filename: TEST_FILE,
      code: `import { execSync } from 'child_process';\nexecSync('echo');`,
      errors: [{ messageId: 'bannedModuleStaticImport', data: { specifier: 'child_process' } }],
    },
    {
      filename: TEST_FILE,
      code: `import { execFileSync } from 'child_process';\nexecFileSync('echo');`,
      errors: [{ messageId: 'bannedModuleStaticImport', data: { specifier: 'child_process' } }],
    },
    {
      filename: TEST_FILE,
      code: `import * as cp from 'node:child_process';\ncp.spawn('echo');`,
      errors: [
        { messageId: 'bannedModuleStaticImport', data: { specifier: 'node:child_process' } },
      ],
    },

    // ────────────────────────────────────────────────────────────────────
    // STATIC IMPORTS — worker_threads (Worker constructor).
    // ────────────────────────────────────────────────────────────────────
    {
      filename: TEST_FILE,
      code: `import { Worker } from 'worker_threads';\nnew Worker('./w.js');`,
      errors: [{ messageId: 'bannedModuleStaticImport', data: { specifier: 'worker_threads' } }],
    },
    {
      filename: TEST_FILE,
      code: `import { Worker } from 'node:worker_threads';\nnew Worker('./w.js');`,
      errors: [
        { messageId: 'bannedModuleStaticImport', data: { specifier: 'node:worker_threads' } },
      ],
    },

    // ────────────────────────────────────────────────────────────────────
    // STATIC IMPORTS — http / https / net / dgram (network surface).
    // ────────────────────────────────────────────────────────────────────
    {
      filename: TEST_FILE,
      code: `import * as http from 'http';\nhttp.createServer();`,
      errors: [{ messageId: 'bannedModuleStaticImport', data: { specifier: 'http' } }],
    },
    {
      filename: TEST_FILE,
      code: `import * as https from 'https';\nhttps.request('https://example.com');`,
      errors: [{ messageId: 'bannedModuleStaticImport', data: { specifier: 'https' } }],
    },
    {
      filename: TEST_FILE,
      code: `import * as net from 'net';\nnet.createConnection({ port: 80 });`,
      errors: [{ messageId: 'bannedModuleStaticImport', data: { specifier: 'net' } }],
    },
    {
      filename: TEST_FILE,
      code: `import * as dgram from 'dgram';\ndgram.createSocket('udp4');`,
      errors: [{ messageId: 'bannedModuleStaticImport', data: { specifier: 'dgram' } }],
    },
    {
      filename: TEST_FILE,
      code: `import * as http from 'node:http';\nhttp.createServer();`,
      errors: [{ messageId: 'bannedModuleStaticImport', data: { specifier: 'node:http' } }],
    },
    {
      filename: TEST_FILE,
      code: `import * as https from 'node:https';\nhttps.request('https://example.com');`,
      errors: [{ messageId: 'bannedModuleStaticImport', data: { specifier: 'node:https' } }],
    },
    {
      filename: TEST_FILE,
      code: `import * as net from 'node:net';\nnet.createConnection({ port: 80 });`,
      errors: [{ messageId: 'bannedModuleStaticImport', data: { specifier: 'node:net' } }],
    },
    {
      filename: TEST_FILE,
      code: `import * as dgram from 'node:dgram';\ndgram.createSocket('udp4');`,
      errors: [{ messageId: 'bannedModuleStaticImport', data: { specifier: 'node:dgram' } }],
    },

    // ────────────────────────────────────────────────────────────────────
    // DYNAMIC IMPORTS — fs / fs/promises / node:fs / child_process.
    // ────────────────────────────────────────────────────────────────────
    {
      filename: TEST_FILE,
      code: `await import('fs');`,
      errors: [{ messageId: 'bannedModuleDynamicImport', data: { specifier: 'fs' } }],
    },
    {
      filename: TEST_FILE,
      code: `await import('node:fs');`,
      errors: [{ messageId: 'bannedModuleDynamicImport', data: { specifier: 'node:fs' } }],
    },
    {
      filename: TEST_FILE,
      code: `await import('fs/promises');`,
      errors: [{ messageId: 'bannedModuleDynamicImport', data: { specifier: 'fs/promises' } }],
    },
    {
      filename: TEST_FILE,
      code: `import('child_process');`,
      errors: [{ messageId: 'bannedModuleDynamicImport', data: { specifier: 'child_process' } }],
    },
    {
      filename: TEST_FILE,
      code: `await import('node:fs/promises');`,
      errors: [{ messageId: 'bannedModuleDynamicImport', data: { specifier: 'node:fs/promises' } }],
    },
    {
      filename: TEST_FILE,
      code: `await import('node:child_process');`,
      errors: [
        { messageId: 'bannedModuleDynamicImport', data: { specifier: 'node:child_process' } },
      ],
    },

    // ────────────────────────────────────────────────────────────────────
    // REQUIRE — fs / node:fs / fs/promises / child_process.
    // ────────────────────────────────────────────────────────────────────
    {
      filename: TEST_FILE,
      code: `const fs = require('fs');\nfs.readFileSync('x');`,
      errors: [{ messageId: 'bannedModuleRequire', data: { specifier: 'fs' } }],
    },
    {
      filename: TEST_FILE,
      code: `const fs = require('node:fs');\nfs.readFileSync('x');`,
      errors: [{ messageId: 'bannedModuleRequire', data: { specifier: 'node:fs' } }],
    },
    {
      filename: TEST_FILE,
      code: `const fsp = require('fs/promises');\nfsp.readFile('x');`,
      errors: [{ messageId: 'bannedModuleRequire', data: { specifier: 'fs/promises' } }],
    },
    {
      filename: TEST_FILE,
      code: `const cp = require('child_process');\ncp.spawn('echo');`,
      errors: [{ messageId: 'bannedModuleRequire', data: { specifier: 'child_process' } }],
    },
    {
      filename: TEST_FILE,
      code: `const cp = require('node:child_process');\ncp.spawn('echo');`,
      errors: [{ messageId: 'bannedModuleRequire', data: { specifier: 'node:child_process' } }],
    },

    // ────────────────────────────────────────────────────────────────────
    // PROCESS surface — env (read), env (write), global/globalThis aliases.
    // ────────────────────────────────────────────────────────────────────
    {
      filename: TEST_FILE,
      code: `const apiKey = process.env.API_KEY;`,
      errors: [{ messageId: 'processEnvAccess' }],
    },
    {
      filename: TEST_FILE,
      code: `process.env.API_KEY = 'abc';`,
      errors: [{ messageId: 'processEnvAccess' }],
    },
    {
      filename: TEST_FILE,
      code: `const env = process.env;`,
      errors: [{ messageId: 'processEnvAccess' }],
    },
    {
      filename: TEST_FILE,
      code: `const apiKey = globalThis.process.env.API_KEY;`,
      errors: [{ messageId: 'processEnvAccess' }],
    },
    {
      filename: TEST_FILE,
      code: `const apiKey = global.process.env.API_KEY;`,
      errors: [{ messageId: 'processEnvAccess' }],
    },

    // ────────────────────────────────────────────────────────────────────
    // PROCESS surface — cwd / chdir + global/globalThis process aliases.
    // ────────────────────────────────────────────────────────────────────
    {
      filename: TEST_FILE,
      code: `const dir = process.cwd();`,
      errors: [{ messageId: 'processCwdCall' }],
    },
    {
      filename: TEST_FILE,
      code: `process.chdir('/tmp');`,
      errors: [{ messageId: 'processChdirCall' }],
    },
    {
      filename: TEST_FILE,
      code: `const dir = globalThis.process.cwd();`,
      errors: [{ messageId: 'processCwdCall' }],
    },
    {
      filename: TEST_FILE,
      code: `globalThis.process.chdir('/tmp');`,
      errors: [{ messageId: 'processChdirCall' }],
    },
    {
      filename: TEST_FILE,
      code: `const dir = global.process.cwd();`,
      errors: [{ messageId: 'processCwdCall' }],
    },
    {
      filename: TEST_FILE,
      code: `global.process.chdir('/tmp');`,
      errors: [{ messageId: 'processChdirCall' }],
    },

    // ────────────────────────────────────────────────────────────────────
    // PROCESS surface — bracket-notation forms must not bypass the rule.
    // ────────────────────────────────────────────────────────────────────
    {
      filename: TEST_FILE,
      code: `const apiKey = process['env'].API_KEY;`,
      errors: [{ messageId: 'processEnvAccess' }],
    },
    {
      filename: TEST_FILE,
      code: `const dir = process['cwd']();`,
      errors: [{ messageId: 'processCwdCall' }],
    },
    {
      filename: TEST_FILE,
      code: `process['chdir']('/tmp');`,
      errors: [{ messageId: 'processChdirCall' }],
    },
    {
      filename: TEST_FILE,
      code: `const apiKey = globalThis['process'].env.API_KEY;`,
      errors: [{ messageId: 'processEnvAccess' }],
    },

    // ────────────────────────────────────────────────────────────────────
    // FETCH — non-localhost literal + non-literal arg + missing arg.
    // ────────────────────────────────────────────────────────────────────
    {
      filename: TEST_FILE,
      code: `await fetch('https://example.com/api');`,
      errors: [{ messageId: 'fetchNonLocalhost' }],
    },
    {
      filename: TEST_FILE,
      code: `await fetch('http://api.thirdparty.io/v1');`,
      errors: [{ messageId: 'fetchNonLocalhost' }],
    },
    {
      filename: TEST_FILE,
      code: `await fetch('https://localhost.evil.com/api');`,
      errors: [{ messageId: 'fetchNonLocalhost' }],
    },
    {
      filename: TEST_FILE,
      code: `await fetch('https://127.0.0.1.evil.com/api');`,
      errors: [{ messageId: 'fetchNonLocalhost' }],
    },
    {
      filename: TEST_FILE,
      code: `const url = computeUrl();\nawait fetch(url);`,
      errors: [{ messageId: 'fetchNonLiteralArg' }],
    },
    {
      filename: TEST_FILE,
      code: `await fetch();`,
      errors: [{ messageId: 'fetchNonLiteralArg' }],
    },

    // ────────────────────────────────────────────────────────────────────
    // Test-file shape coverage — *.spec.ts / *.unit.test.ts /
    // *.integration.test.ts / *.e2e.test.ts all trigger.
    // ────────────────────────────────────────────────────────────────────
    {
      filename: SPEC_FILE,
      code: `import { readFileSync } from 'node:fs';\nreadFileSync('x');`,
      errors: [{ messageId: 'bannedModuleStaticImport', data: { specifier: 'node:fs' } }],
    },
    {
      filename: UNIT_TEST_FILE,
      code: `import { readFileSync } from 'node:fs';\nreadFileSync('x');`,
      errors: [{ messageId: 'bannedModuleStaticImport', data: { specifier: 'node:fs' } }],
    },
    {
      filename: INTEGRATION_TEST_FILE,
      code: `import { readFileSync } from 'node:fs';\nreadFileSync('x');`,
      errors: [{ messageId: 'bannedModuleStaticImport', data: { specifier: 'node:fs' } }],
    },
    {
      filename: E2E_TEST_FILE,
      code: `import { readFileSync } from 'node:fs';\nreadFileSync('x');`,
      errors: [{ messageId: 'bannedModuleStaticImport', data: { specifier: 'node:fs' } }],
    },
  ],
});
