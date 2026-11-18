/**
 * Build one member of the install-time closure with its own toolchain: its
 * `tsup` for JS, then agent-tools' compiler with `--emitDeclarationOnly` over
 * its `tsconfig.build.json` for declarations, and the one recipe a member must
 * declare to be built this way. Every failure exits the install loudly, naming
 * the member. Like every bootstrap module it imports no workspace package, for
 * the reason `install-time-closure.ts` gives.
 *
 * @packageDocumentation
 */

import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

import { writeLine, writeErrorLine } from '../core/terminal-output.js';

import { productionWorkspaceDepFsIo } from './bootstrap-helpers-io.js';
import {
  binPathFromManifest,
  interpretSpawnOutcome,
  workspaceDepDistIsStale,
} from './bootstrap-helpers.js';
import { missingDistArtifacts } from './dist-witnesses.js';
import { type InstallTimeDep } from './install-time-closure.js';

/**
 * The one build script every closure member must declare, because it is what
 * {@link buildWorkspaceDep} runs (`tsup`, then `tsc --emitDeclarationOnly`
 * over the member's `tsconfig.build.json`). The derivation refuses a member
 * that declares anything else, rather than building it wrongly.
 */
export const BUILD_RECIPE = 'tsup && tsc --emitDeclarationOnly --project tsconfig.build.json';

/** Run one build step under the current node binary, exiting loudly on failure. */
function runStep(label: string, binPath: string, args: readonly string[], cwd: string): void {
  const result = spawnSync(process.execPath, [binPath, ...args], { cwd, stdio: 'inherit' });
  const verdict = interpretSpawnOutcome(label, {
    error: result.error,
    signal: result.signal,
    status: result.status,
  });
  if (verdict.failed) {
    const reason = verdict.reason ?? `${label} failed`;
    writeErrorLine(`[bootstrap-agent-tools] ${reason}`);
    process.exit(verdict.exitCode);
  }
}

/**
 * Build one workspace dep with its own toolchain (tsup JS + tsc declarations),
 * unless its built `dist` is already current for the present `src`.
 *
 * Rebuilds on staleness, not mere absence: a warm checkout that pulls new leaf
 * source over an old `dist` must rebuild, or agent-tools' own `tsc` fails
 * against the stale `.d.ts` and bricks the fail-open guards (MCP-472). See
 * {@link workspaceDepDistIsStale}.
 *
 * @param dep - The closure member.
 * @param repoRoot - Absolute path of the repository root.
 * @param tscBin - agent-tools' own compiler, which writes the declarations.
 */
export function buildWorkspaceDep(dep: InstallTimeDep, repoRoot: string, tscBin: string): void {
  const depRelDir = dep.dir;
  const depDir = path.join(repoRoot, depRelDir);
  const depName = path.basename(depRelDir);
  if (!workspaceDepDistIsStale(depDir, dep.distArtifacts, productionWorkspaceDepFsIo)) {
    return;
  }
  runStep(`tsup (${depName})`, resolveTsupBin(depDir, depRelDir), [], depDir);
  runStep(
    `tsc declarations (${depName})`,
    tscBin,
    ['--emitDeclarationOnly', '--project', path.join(depDir, 'tsconfig.build.json')],
    depDir,
  );
  exitUnlessWitnessesWritten(dep, depDir);
  writeLine(`[bootstrap-agent-tools] built ${depRelDir}/dist`);
}

/** The dependency's own `tsup` bin, resolved from its directory, exiting loudly when it is missing. */
function resolveTsupBin(depDir: string, depRelDir: string): string {
  const depRequire = createRequire(path.join(depDir, 'package.json'));
  let tsupManifestPath: string;
  try {
    tsupManifestPath = depRequire.resolve('tsup/package.json');
  } catch {
    writeErrorLine(
      `[bootstrap-agent-tools] cannot resolve "tsup" from ${depRelDir} — the install looks incomplete.`,
    );
    process.exit(1);
  }
  const tsupManifest: unknown = JSON.parse(readFileSync(tsupManifestPath, 'utf8'));
  const tsupBin = binPathFromManifest(path.dirname(tsupManifestPath), tsupManifest, 'tsup');
  if (tsupBin === undefined) {
    writeErrorLine(
      `[bootstrap-agent-tools] the resolved tsup manifest for ${depRelDir} has no usable bin entry.`,
    );
    process.exit(1);
  }
  return tsupBin;
}

/** Exit loudly when the build left out a file the dependency's entry points name. */
function exitUnlessWitnessesWritten(dep: InstallTimeDep, depDir: string): void {
  const missing = missingDistArtifacts(depDir, dep.distArtifacts, productionWorkspaceDepFsIo);
  if (missing.length > 0) {
    writeErrorLine(
      `[bootstrap-agent-tools] the build of ${dep.dir} did not write ${missing.join(', ')}, ` +
        'which its package.json entry points name.',
    );
    process.exit(1);
  }
}
