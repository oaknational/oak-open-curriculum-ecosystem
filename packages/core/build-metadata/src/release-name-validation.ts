/**
 * Shared Sentry release-name validation.
 *
 * @packageDocumentation
 */

const MAX_RELEASE_NAME_LENGTH = 200;
const FORBIDDEN_RELEASE_CHARS = /[\n\t/\\]/u;

/**
 * Validate a Sentry release name against the documented denylist.
 *
 * @remarks Matches the Sentry "Naming Releases" denylist exactly:
 * reject newlines, tabs, forward slash, backslash; reject exactly
 * `'.'`, `'..'`, or a single space; length must be between 1 and 200
 * inclusive. The token `'latest'` is accepted.
 */
export function isValidReleaseName(value: string): boolean {
  if (value.length === 0 || value.length > MAX_RELEASE_NAME_LENGTH) {
    return false;
  }

  if (value === '.' || value === '..' || value === ' ') {
    return false;
  }

  if (FORBIDDEN_RELEASE_CHARS.test(value)) {
    return false;
  }

  return true;
}
