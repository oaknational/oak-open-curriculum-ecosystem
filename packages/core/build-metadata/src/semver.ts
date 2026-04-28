/**
 * Canonical semver helpers for Oak's build pipeline.
 *
 * @remarks
 * The shared, npm-`semver`-backed home for application-version
 * validation logic. Replaces three near-identical inline copies of
 * the same regex previously scattered across
 * `runtime-metadata.ts`, `scripts/validate-root-application-version.mjs`,
 * and `apps/oak-curriculum-mcp-streamable-http/build-scripts/vercel-ignore-production-non-release-build.mjs`.
 *
 * The two scripts retain inline copies for their pre-`pnpm install`
 * (vercel-ignore) and pre-`dist/` (validate-root-application-version)
 * constraints; their inline regex stays in sync with this module via
 * the parity test at `tests/semver-parity.test.ts`.
 *
 * @packageDocumentation
 */

import { lte as semverLte, parse as semverParse } from 'semver';

/**
 * Strict semver §2 / §9 / §10 pattern.
 *
 * @remarks
 * Verbatim copy of the canonical regex from the npm `semver` package's
 * §2 strict pattern, preserved here so tools that need a regex (rather
 * than a parser) can match without depending on `semver`'s private API.
 * Required by the two pre-install / pre-dist scripts noted above.
 */
export const SEMVER_PATTERN =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/u;

/**
 * Structurally parsed semver components.
 *
 * @remarks
 * `prerelease` is exposed as a `readonly string[]` for ergonomic
 * consumer use: numeric prerelease identifiers (e.g. the `7` in
 * `1.0.0-alpha.7.x`) are coerced to their decimal string form. Use
 * {@link isLessThanOrEqual} for §11.4 precedence comparisons; do not
 * try to reproduce §11.4 ordering from this array, since the
 * numeric/alphanumeric distinction is lost by the coercion.
 */
export interface ParsedSemver {
  readonly major: number;
  readonly minor: number;
  readonly patch: number;
  readonly prerelease: readonly string[];
}

/**
 * Test whether a string conforms to strict semver §2.
 *
 * @remarks
 * Uses {@link SEMVER_PATTERN} rather than `semver.valid()` because the
 * npm `semver` package accepts a leading `v` prefix (e.g. `v1.0.0`)
 * for compatibility with common tag conventions; the strict §2 grammar
 * does not. Matching the regex keeps `isValidSemver` consistent with
 * the inline regex copies in pre-`pnpm install` scripts.
 *
 * @example
 * isValidSemver('1.5.0');         // true
 * isValidSemver('1.0.0-alpha.1'); // true
 * isValidSemver('latest');        // false
 * isValidSemver('1.0');           // false
 * isValidSemver('v1.0.0');        // false (no v-prefix per strict §2)
 */
export function isValidSemver(version: string): boolean {
  return SEMVER_PATTERN.test(version);
}

/**
 * Parse a semver string into its components, or return `null` if the
 * string is not strict-semver-valid.
 *
 * @example
 * parseSemver('1.5.0');
 * // \{ major: 1, minor: 5, patch: 0, prerelease: [] \}
 *
 * parseSemver('1.0.0-alpha.7.x');
 * // \{ major: 1, minor: 0, patch: 0, prerelease: ['alpha', '7', 'x'] \}
 *
 * parseSemver('not-a-version'); // null
 */
export function parseSemver(version: string): ParsedSemver | null {
  const parsed = semverParse(version);

  if (parsed === null) {
    return null;
  }

  const prerelease: readonly string[] = parsed.prerelease.map((identifier) =>
    typeof identifier === 'number' ? identifier.toString(10) : identifier,
  );

  return {
    major: parsed.major,
    minor: parsed.minor,
    patch: parsed.patch,
    prerelease,
  };
}

/**
 * Compare two semver strings per §11 precedence.
 *
 * @returns `true` if `a` ≤ `b` in semver order, `false` otherwise.
 * @throws If either input is not strict-semver-valid.
 *
 * @example
 * isLessThanOrEqual('1.0.0', '1.0.1');         // true
 * isLessThanOrEqual('1.2.0', '1.10.0');        // true
 * isLessThanOrEqual('1.0.0-alpha', '1.0.0');   // true (prerelease lower than release)
 * isLessThanOrEqual('1.0.0-alpha.1', '1.0.0-alpha.beta'); // true (numeric lower than alphanumeric)
 */
export function isLessThanOrEqual(a: string, b: string): boolean {
  if (!isValidSemver(a)) {
    throw new Error(`Invalid semver: ${a}`);
  }
  if (!isValidSemver(b)) {
    throw new Error(`Invalid semver: ${b}`);
  }

  return semverLte(a, b);
}
