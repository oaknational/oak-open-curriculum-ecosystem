import fs from 'node:fs/promises';
import path from 'node:path';

import { z } from 'zod';

import { resolveRepoRoot } from '../../core/repo-root.js';
import { writeLine, writeErrorLine } from '../../core/terminal-output.js';

import {
  findLifecycleScriptViolations,
  type LifecycleScriptViolation,
} from './validate-lifecycle-scripts-helpers.js';

/**
 * Standalone validator that fails if the repository root's lifecycle scripts
 * (`postinstall`, `prepare`, and the install/publish/pack family) invoke a
 * package manager (`pnpm`/`pnpx`/`npm`/`npx`/`yarn`) or the build orchestrator
 * (`turbo`).
 *
 * The gate encodes the install-bootstrap principle: install-time work must be
 * smaller than the build graph and must not re-enter the package manager or
 * orchestrator. The canonical bootstrap form runs workspace source directly,
 * `tsx agent-tools/src/bootstrap/bootstrap.ts`; `prepare` may run `husky`.
 *
 * Wired into root `repo-validators:check`, so it runs on every pre-commit and
 * pre-push alongside the sibling validators.
 *
 * @packageDocumentation
 */

const repoRoot = resolveRepoRoot(import.meta.url);

/**
 * The only part of the root `package.json` this validator reads. Unknown keys
 * are ignored; `scripts` defaults to empty so a manifest without scripts is not
 * an error.
 */
const RootPackageJsonSchema = z.object({
  scripts: z.record(z.string(), z.string()).default({}),
});

function formatViolations(violations: readonly LifecycleScriptViolation[]): string {
  return violations
    .map((violation) => `  ${violation.hook}: ${violation.term}  (in "${violation.script}")`)
    .join('\n');
}

async function main(): Promise<void> {
  const packageJsonPath = path.join(repoRoot, 'package.json');
  const parsed: unknown = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));

  const result = RootPackageJsonSchema.safeParse(parsed);
  if (!result.success) {
    writeErrorLine(
      `validate-lifecycle-scripts: could not parse "scripts" from ${packageJsonPath}.`,
    );
    process.exit(1);
  }

  const violations = findLifecycleScriptViolations(result.data.scripts);

  if (violations.length === 0) {
    writeLine(
      'validate-lifecycle-scripts: OK (no package-manager/turbo invocations in root lifecycle scripts)',
    );
    return;
  }

  writeErrorLine(
    `validate-lifecycle-scripts: ${violations.length} forbidden invocation(s) in root lifecycle scripts.\n\n` +
      `${formatViolations(violations)}\n\n` +
      `Install-time bootstrap must not invoke a package manager or turbo. Run workspace source ` +
      `directly (e.g. \`tsx agent-tools/src/bootstrap/bootstrap.ts\`); \`husky\` is allowed for \`prepare\`.`,
  );
  process.exit(1);
}

await main();
