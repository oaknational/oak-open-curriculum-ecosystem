import { describe, expect, it } from 'vitest';

import {
  isLessThanOrEqual,
  isValidSemver,
  parseSemver,
  SEMVER_PATTERN,
  type ParsedSemver,
} from '../src/semver.js';

describe('SEMVER_PATTERN', () => {
  it('accepts strict X.Y.Z without prerelease or build metadata', () => {
    expect(SEMVER_PATTERN.test('1.0.0')).toBe(true);
    expect(SEMVER_PATTERN.test('0.0.0')).toBe(true);
    expect(SEMVER_PATTERN.test('10.20.30')).toBe(true);
  });

  it('accepts prerelease identifiers per semver §9', () => {
    expect(SEMVER_PATTERN.test('1.0.0-alpha')).toBe(true);
    expect(SEMVER_PATTERN.test('1.0.0-alpha.1')).toBe(true);
    expect(SEMVER_PATTERN.test('1.0.0-0.3.7')).toBe(true);
    expect(SEMVER_PATTERN.test('1.0.0-x.7.z.92')).toBe(true);
  });

  it('accepts build-metadata identifiers per semver §10', () => {
    expect(SEMVER_PATTERN.test('1.0.0+20130313144700')).toBe(true);
    expect(SEMVER_PATTERN.test('1.0.0-beta+exp.sha.5114f85')).toBe(true);
    expect(SEMVER_PATTERN.test('1.0.0+21AF26D3----117B344092BD')).toBe(true);
  });

  it('rejects leading zeros in numeric identifiers', () => {
    expect(SEMVER_PATTERN.test('01.0.0')).toBe(false);
    expect(SEMVER_PATTERN.test('1.02.0')).toBe(false);
    expect(SEMVER_PATTERN.test('1.0.03')).toBe(false);
  });

  it('rejects negative numbers and non-numeric components', () => {
    expect(SEMVER_PATTERN.test('-1.0.0')).toBe(false);
    expect(SEMVER_PATTERN.test('1.-1.0')).toBe(false);
    expect(SEMVER_PATTERN.test('a.b.c')).toBe(false);
  });

  it('rejects partial versions and trailing junk', () => {
    expect(SEMVER_PATTERN.test('1.0')).toBe(false);
    expect(SEMVER_PATTERN.test('1')).toBe(false);
    expect(SEMVER_PATTERN.test('1.0.0.0')).toBe(false);
    expect(SEMVER_PATTERN.test('1.0.0 ')).toBe(false);
    expect(SEMVER_PATTERN.test(' 1.0.0')).toBe(false);
  });
});

describe('isValidSemver', () => {
  it('returns true for valid semver strings', () => {
    expect(isValidSemver('1.0.0')).toBe(true);
    expect(isValidSemver('1.5.0')).toBe(true);
    expect(isValidSemver('1.0.0-alpha.1')).toBe(true);
    expect(isValidSemver('1.0.0+build.1')).toBe(true);
  });

  it('returns false for invalid semver strings', () => {
    expect(isValidSemver('1.0')).toBe(false);
    expect(isValidSemver('latest')).toBe(false);
    expect(isValidSemver('')).toBe(false);
    expect(isValidSemver('v1.0.0')).toBe(false);
  });
});

describe('parseSemver', () => {
  it('parses a strict X.Y.Z version', () => {
    const parsed = parseSemver('1.5.0');

    expect(parsed).not.toBeNull();
    if (parsed === null) {
      return;
    }

    const expected: ParsedSemver = {
      major: 1,
      minor: 5,
      patch: 0,
      prerelease: [],
    };

    expect(parsed).toEqual(expected);
  });

  it('parses a prerelease version with mixed identifiers, coercing to strings', () => {
    const parsed = parseSemver('1.0.0-alpha.7.x');

    expect(parsed).not.toBeNull();
    if (parsed === null) {
      return;
    }

    expect(parsed.major).toBe(1);
    expect(parsed.minor).toBe(0);
    expect(parsed.patch).toBe(0);
    expect(parsed.prerelease).toEqual(['alpha', '7', 'x']);
  });

  it('returns null for an invalid version', () => {
    expect(parseSemver('not-a-version')).toBeNull();
    expect(parseSemver('1.0')).toBeNull();
  });

  it('exposes prerelease as a readonly string array', () => {
    const parsed = parseSemver('1.0.0-alpha');

    expect(parsed).not.toBeNull();
    if (parsed === null) {
      return;
    }

    const probe: readonly string[] = parsed.prerelease;
    expect(probe).toEqual(['alpha']);
  });
});

describe('isLessThanOrEqual', () => {
  it('respects semver §11 precedence on plain releases', () => {
    expect(isLessThanOrEqual('1.0.0', '1.0.1')).toBe(true);
    expect(isLessThanOrEqual('1.0.1', '1.0.0')).toBe(false);
    expect(isLessThanOrEqual('1.0.0', '1.0.0')).toBe(true);
    expect(isLessThanOrEqual('1.2.0', '1.10.0')).toBe(true);
  });

  it('treats prerelease versions as lower than the same X.Y.Z release', () => {
    expect(isLessThanOrEqual('1.0.0-alpha', '1.0.0')).toBe(true);
    expect(isLessThanOrEqual('1.0.0', '1.0.0-alpha')).toBe(false);
  });

  it('orders prerelease identifiers per §11.4', () => {
    expect(isLessThanOrEqual('1.0.0-alpha', '1.0.0-alpha.1')).toBe(true);
    expect(isLessThanOrEqual('1.0.0-alpha.1', '1.0.0-alpha.beta')).toBe(true);
    expect(isLessThanOrEqual('1.0.0-beta', '1.0.0-beta.2')).toBe(true);
    expect(isLessThanOrEqual('1.0.0-rc.1', '1.0.0')).toBe(true);
  });

  it('throws or rejects invalid inputs deterministically', () => {
    expect(() => isLessThanOrEqual('not-a-version', '1.0.0')).toThrow();
  });
});
