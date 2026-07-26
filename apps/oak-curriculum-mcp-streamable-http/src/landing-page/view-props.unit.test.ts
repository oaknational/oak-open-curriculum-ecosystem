/**
 * The view-props boundary guard narrows the hydration payload strictly: the
 * client trusts nothing it did not verify, and a round-trip through JSON is
 * lossless for the whole contract.
 */
import { isErr, isOk, unwrap } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { deriveLandingPageViewProps } from './derive-view-props.js';
import { parseLandingPageViewProps } from './view-props.js';

describe('parseLandingPageViewProps', () => {
  it('round-trips the real derived props through JSON losslessly', () => {
    const derived = deriveLandingPageViewProps({
      vercelHost: 'example.vercel.app',
      appVersion: '1.2.3-test',
      themeSelectorEnabled: true,
    });
    const parsed = parseLandingPageViewProps(JSON.parse(JSON.stringify(derived)));
    expect(isOk(parsed)).toBe(true);
    expect(unwrap(parsed)).toEqual(derived);
  });

  it('accepts the minimal shape with optional fields absent', () => {
    const parsed = parseLandingPageViewProps({
      aggregatedTools: [],
      generatedTools: [],
      resources: [],
      themeSelectorEnabled: false,
    });
    expect(isOk(parsed)).toBe(true);
  });

  it.each([
    ['(root)', null],
    ['(root)', []],
    ['aggregatedTools', { aggregatedTools: 'nope' }],
    ['aggregatedTools', { aggregatedTools: [{ name: 'x' }], generatedTools: [], resources: [] }],
    [
      'generatedTools',
      { aggregatedTools: [], generatedTools: [{ description: 'y' }], resources: [] },
    ],
    [
      'resources',
      { aggregatedTools: [], generatedTools: [], resources: [{ uri: 'u', title: 't' }] },
    ],
    ['vercelHost', { aggregatedTools: [], generatedTools: [], resources: [], vercelHost: 42 }],
    [
      'themeSelectorEnabled',
      { aggregatedTools: [], generatedTools: [], resources: [], themeSelectorEnabled: 'true' },
    ],
  ])('rejects with path %s', (path, value) => {
    const parsed = parseLandingPageViewProps(value);
    expect(isErr(parsed)).toBe(true);
    if (isErr(parsed)) {
      expect(parsed.error.path).toBe(path);
    }
  });
});
