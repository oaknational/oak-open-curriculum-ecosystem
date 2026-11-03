import { spawnSync } from 'node:child_process';
import { chmodSync, existsSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

import { resolveRepoRoot } from '../core/repo-root.js';
import { writeLine, writeErrorLine } from '../core/terminal-output.js';

import { interpretTscOutcome } from './bootstrap-helpers.js';
import { BUILD_RECIPE, buildWorkspaceDep } from './closure-member-build.js';
import { readWorkspaceManifests, readWorkspacePatterns } from './install-time-closure-io.js';
import { type InstallTimeDep, installTimeClosure } from './install-time-closure.js';
import {
  shellcheckInstallerEnv,
  shellcheckProvisionSkip,
  shellcheckProvisionWarning,
} from './shellcheck-provision.js';

/**
 * Install-time bootstrap, run by the root `postinstall` via `tsx`.
 *
 * Builds `@oaknational/agent-tools` `dist` so the repo's PreToolUse guards
 * (`.claude/settings.json`) and agent CLIs are available immediately after
 * `pnpm install`. It reproduces agent-tools' own build script
 * (`tsc -p tsconfig.build.json` + the executable-bit chmod) by invoking `tsc`
 * directly, so the build orchestrator (`turbo`) and the package manager stay
 * out of the install lifecycle — enforced by the `validate-lifecycle-scripts`
 * validator.
 *
 * agent-tools reaches workspace packages whose entry points name built output
 * under `dist` — there is no source-pointing export condition: the packages it
 * imports, the ESLint plugin its lint config imports, and the config-base
 * package whose `tsup` base their build configs import. Which packages those
 * are is derived from the workspace manifests at run time
 * (`install-time-closure.ts`), never listed here. On a fresh checkout (Vercel,
 * CI, a new worktree) `postinstall` runs before any orchestrated build, so this
 * bootstrap first builds that closure in dependency order with each package's
 * own toolchain (`tsup` for JS, `tsc --emitDeclarationOnly` for types),
 * skipping any dep whose built `dist` is already current for its `src`, and so
 * ESLint's config, which imports the plugin, loads after `pnpm install` alone.
 *
 * `typescript` is a direct dependency of agent-tools, so it is present in dev
 * and `--prod` installs alike; a missing compiler therefore signals a corrupt
 * install and fails loudly rather than silently leaving the fail-open guards
 * without `dist`. Set `OAK_SKIP_AGENT_TOOLS_BOOTSTRAP=1` to opt out deliberately.
 *
 * @packageDocumentation
 */

const repoRoot = resolveRepoRoot(import.meta.url);
/** Repo-relative directory of agent-tools: the package running this bootstrap, and the closure's root. */
const AGENT_TOOLS_DIR = 'agent-tools';
const agentToolsDir = path.join(repoRoot, AGENT_TOOLS_DIR);

/**
 * The workspace packages built before agent-tools, derived from the workspace
 * manifests: every package agent-tools reaches whose entry points name built
 * output under `dist`, in dependency order (`install-time-closure.ts`).
 * Computed, never kept: a new agent-tools workspace dependency, or a new
 * dependency of one of those, joins the closure without an edit here. The
 * incidents the hand-kept list caused are recorded in that module's TSDoc.
 * Exits loudly, naming the cause, when a read or the derivation refuses.
 */
function readInstallTimeClosure(): readonly InstallTimeDep[] {
  const patterns = readWorkspacePatterns(repoRoot);
  const manifests = patterns.ok ? readWorkspaceManifests(repoRoot, patterns.value) : patterns;
  const closure = manifests.ok
    ? installTimeClosure(manifests.value, { rootDir: AGENT_TOOLS_DIR, buildRecipe: BUILD_RECIPE })
    : manifests;
  if (!closure.ok) {
    writeErrorLine(
      `[bootstrap-agent-tools] cannot derive the install-time closure: ${closure.error}`,
    );
    process.exit(1);
  }
  return closure.value;
}

/** Set the executable bit on every compiled CLI entry, mirroring the build script. */
function markExecutableArtifacts(): void {
  const binDir = path.join(agentToolsDir, 'dist', 'src', 'bin');
  if (existsSync(binDir)) {
    for (const entry of readdirSync(binDir)) {
      if (entry.endsWith('.js')) {
        chmodSync(path.join(binDir, entry), 0o755);
      }
    }
  }
  const statuslinePath = path.join(
    agentToolsDir,
    'dist',
    'src',
    'claude',
    'statusline-identity.js',
  );
  if (existsSync(statuslinePath)) {
    chmodSync(statuslinePath, 0o755);
  }
}

/**
 * Install the pinned shellcheck the shell lint gate runs, unless another
 * surface owns it here (`shellcheck-provision.ts`). The installer streams its
 * own output and is a no-op on the present pin; a failure warns and the
 * install goes on, since the gate itself refuses without the pin.
 */
function provisionShellcheck(): void {
  const skip = shellcheckProvisionSkip(process.env);
  if (skip !== null) {
    writeLine(`[bootstrap-agent-tools] shellcheck left to ${skip}`);
    return;
  }
  const result = spawnSync(path.join(repoRoot, '.agent', 'setup', 'install-shellcheck.sh'), [], {
    cwd: repoRoot,
    env: shellcheckInstallerEnv(process.env),
    stdio: 'inherit',
  });
  const warning = shellcheckProvisionWarning({
    error: result.error,
    signal: result.signal,
    status: result.status,
  });
  if (warning !== null) {
    writeErrorLine(warning);
  }
}

function main(): void {
  if (process.env.OAK_SKIP_AGENT_TOOLS_BOOTSTRAP === '1') {
    writeLine('[bootstrap-agent-tools] skipped (OAK_SKIP_AGENT_TOOLS_BOOTSTRAP=1)');
    return;
  }

  let tscBin: string;
  try {
    tscBin = createRequire(path.join(agentToolsDir, 'package.json')).resolve('typescript/bin/tsc');
  } catch {
    writeErrorLine(
      '[bootstrap-agent-tools] cannot resolve "typescript" from agent-tools — the install looks incomplete.',
    );
    writeErrorLine(
      '[bootstrap-agent-tools] Re-run `pnpm install`, or set OAK_SKIP_AGENT_TOOLS_BOOTSTRAP=1 to bypass deliberately.',
    );
    process.exit(1);
  }

  for (const dep of readInstallTimeClosure()) {
    buildWorkspaceDep(dep, repoRoot, tscBin);
  }

  const result = spawnSync(
    process.execPath,
    [tscBin, '-p', path.join(agentToolsDir, 'tsconfig.build.json')],
    { cwd: agentToolsDir, stdio: 'inherit' },
  );
  const verdict = interpretTscOutcome({
    error: result.error,
    signal: result.signal,
    status: result.status,
  });
  if (verdict.failed) {
    writeErrorLine(`[bootstrap-agent-tools] ${verdict.reason ?? 'tsc build failed'}`);
    process.exit(verdict.exitCode);
  }

  markExecutableArtifacts();
  writeLine('[bootstrap-agent-tools] built agent-tools/dist');
  provisionShellcheck();
}

main();
