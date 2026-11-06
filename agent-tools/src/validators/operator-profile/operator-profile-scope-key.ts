/**
 * Operator profile — the repository scope key from the root manifest's name.
 * Pure. The key is a fact of the repository (its package name), never of a
 * remote or a path (PDR-141 decision 3, amended 2026-10-28).
 */

import { err, ok, type Result } from '@oaknational/result';

import { SCOPE_KEY_PATTERN } from './operator-profile-schema.js';

/**
 * Derive the scope key from the root manifest's `name`: an unscoped name is
 * the key; a scoped `@scope/name` becomes `scope--name`; both lowercased.
 * The key is a fact of the repository (its package name), never of a remote
 * or a path, so every clone, fork and mirror of one repository reads one
 * scope file and a move between owners or hosts changes nothing.
 *
 * @param packageName - the root package.json `name` as written
 * @returns the scope key, or undefined when the name is absent or the key
 *   grammar cannot carry it
 */
export function scopeKeyFromPackageName(packageName: string): string | undefined {
  const match = /^(?:@([^/]+)\/)?([^/@]+)$/.exec(packageName.trim());
  if (match === null) {
    return undefined;
  }
  const scope = match[1];
  const name = match[2] ?? '';
  const key = (scope === undefined ? name : `${scope}--${name}`).toLowerCase();
  return SCOPE_KEY_PATTERN.test(key) ? key : undefined;
}

/** The manifest's own `name` field when it is a non-empty string, else undefined. */
function manifestName(parsed: unknown): string | undefined {
  if (typeof parsed !== 'object' || parsed === null || !('name' in parsed)) {
    return undefined;
  }
  const { name } = parsed;
  return Object.hasOwn(parsed, 'name') && typeof name === 'string' && name.trim() !== ''
    ? name
    : undefined;
}

/**
 * Derive the scope key from the text of a root `package.json`.
 *
 * @param manifestText - the manifest's content
 * @returns the key, or the reason none could be derived
 */
export function scopeKeyFromManifestText(manifestText: string): Result<string, string> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(manifestText);
  } catch {
    return err('the root package.json is not JSON');
  }
  const name = manifestName(parsed);
  if (name === undefined) {
    return err('the root package.json has no name');
  }
  const key = scopeKeyFromPackageName(name);
  return key === undefined
    ? err(`the package name ${JSON.stringify(name)} yields no scope key`)
    : ok(key);
}
