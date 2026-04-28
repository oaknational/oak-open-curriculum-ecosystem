import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Structural invariant: this workspace's runtime `src/` tree MUST NOT import
 * from any Node-only built-in (`node:*`) or from `@sentry/*`.
 *
 * @remarks
 * Enforces ADR-160's browser-safety guarantee: `@oaknational/observability`
 * is the foundation layer that both the Node Sentry adapter and a future
 * browser adapter (L-12) compose. A Node-only import anywhere in this
 * workspace's runtime source would make the package unusable in the
 * browser, breaking L-12's adapter pattern before it ships.
 *
 * Test files (`*.test.ts`) are exempted because test harnesses legitimately
 * use `node:fs` / `node:path` / `node:url` for structural invariant checks
 * exactly like this one.
 *
 * File-content scanning is preferred over an ESLint rule because the scan
 * proves reality, not just config intent.
 */

const workspaceSrcDir = join(dirname(fileURLToPath(import.meta.url)), '.');
const nodeOnlyImportPattern = /['"]node:[^'"]+['"]/u;
const sentryImportPattern = /['"]@sentry\/[^'"]+['"]/u;

function collectRuntimeTypescriptFiles(directory: string): readonly string[] {
  const entries = readdirSync(directory, { recursive: true, withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.ts'))
    .filter((entry) => !entry.name.endsWith('.test.ts'))
    .map((entry) => {
      const parentPath = entry.parentPath;
      return relative(directory, join(parentPath, entry.name));
    });
}

describe('browser-safety structural invariants', () => {
  it('contains no node:* import in any runtime src file', () => {
    const files = collectRuntimeTypescriptFiles(workspaceSrcDir);
    expect(files.length).toBeGreaterThan(0);

    const offenders = files
      .map((relativePath) => {
        const contents = readFileSync(join(workspaceSrcDir, relativePath), 'utf8');
        const match = nodeOnlyImportPattern.exec(contents);
        return match === null ? null : { file: relativePath, match: match[0] };
      })
      .filter((entry): entry is { file: string; match: string } => entry !== null);

    expect(offenders).toEqual([]);
  });

  it('contains no @sentry/* import in any runtime src file', () => {
    const files = collectRuntimeTypescriptFiles(workspaceSrcDir);
    expect(files.length).toBeGreaterThan(0);

    const offenders = files
      .map((relativePath) => {
        const contents = readFileSync(join(workspaceSrcDir, relativePath), 'utf8');
        const match = sentryImportPattern.exec(contents);
        return match === null ? null : { file: relativePath, match: match[0] };
      })
      .filter((entry): entry is { file: string; match: string } => entry !== null);

    expect(offenders).toEqual([]);
  });
});
