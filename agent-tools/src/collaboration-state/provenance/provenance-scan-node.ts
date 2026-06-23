/**
 * The `node:fs`-backed {@link ProvenanceScanIo} for the WS7 provenance check.
 *
 * @remarks
 * This is the one boundary where a throwing library (`node:fs`) is translated
 * into the repository {@link Result} pattern (ADR-088): each fallible read
 * catches and re-expresses the filesystem error as `err(message)`. Keeping it in
 * its own file leaves `provenance-scan.ts` IO-free and unit-testable against an
 * in-memory seam.
 *
 * @packageDocumentation
 */

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { err, ok } from '@oaknational/result';

import type { ProvenanceScanIo } from './provenance-scan.js';

const MARKDOWN_SUFFIX = '.md';

function errorMessage(cause: unknown): string {
  return cause instanceof Error ? cause.message : String(cause);
}

function listMarkdownFilesRecursive(root: string): string[] {
  const paths: string[] = [];
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    const full = join(root, entry.name);
    if (entry.isDirectory()) {
      paths.push(...listMarkdownFilesRecursive(full));
    } else if (entry.isFile() && entry.name.endsWith(MARKDOWN_SUFFIX)) {
      paths.push(full);
    }
  }
  return paths;
}

/**
 * Build the `node:fs`-backed {@link ProvenanceScanIo}. Markdown discovery
 * recurses into sub-directories (regular files and directories only — symbolic
 * links are not followed, which the repo's flat permanent-record roots do not
 * use) so a nested permanent-record root does not hide a citation surface.
 */
export function createNodeProvenanceScanIo(): ProvenanceScanIo {
  return {
    listEventFilenames(eventDir) {
      try {
        return ok(readdirSync(eventDir));
      } catch (cause) {
        return err(errorMessage(cause));
      }
    },
    listDocPaths(docRoot) {
      try {
        return ok(listMarkdownFilesRecursive(docRoot));
      } catch (cause) {
        return err(errorMessage(cause));
      }
    },
    readText(path) {
      try {
        return ok(readFileSync(path, 'utf8'));
      } catch (cause) {
        return err(errorMessage(cause));
      }
    },
    exists: (path) => existsSync(path),
  };
}
