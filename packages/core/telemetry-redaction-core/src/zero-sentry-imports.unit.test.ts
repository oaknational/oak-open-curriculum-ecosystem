import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Structural invariant: this workspace MUST NOT import from any
 * `@sentry/*` package at source level.
 *
 * @remarks
 * Enforcement of ADR-160's browser-safety requirement for the
 * runtime-agnostic redactor core. The browser adapter (L-12) composes
 * this workspace and cannot tolerate `@sentry/node`'s Node-built-in
 * dependencies. File-content scanning is preferred over an ESLint rule
 * because the scan proves reality, not just config intent.
 *
 * The scan walks the workspace's `src/` tree recursively and fails if
 * ANY source file contains an import specifier beginning with
 * `@sentry/` — covers `@sentry/node`, `@sentry/browser`, `@sentry/core`,
 * `@sentry/types`, and any future vendor subpackage.
 */

const workspaceSrcDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'src');
const sentryImportPattern = /['"]@sentry\/[^'"]+['"]/u;

function collectTypescriptFiles(directory: string): readonly string[] {
  const entries = readdirSync(directory, { recursive: true, withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.ts'))
    .map((entry) => {
      const parentPath = entry.parentPath;
      return relative(directory, join(parentPath, entry.name));
    });
}

describe('zero @sentry/* imports invariant', () => {
  it('contains no @sentry/* import in any src/**/*.ts file', () => {
    const files = collectTypescriptFiles(workspaceSrcDir);
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
