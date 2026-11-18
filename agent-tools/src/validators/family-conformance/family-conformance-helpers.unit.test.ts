import { describe, expect, it } from 'vitest';

import {
  checkAggregates,
  checkSkeleton,
  compareScripts,
  splitLegs,
  substitutePlaceholders,
} from './family-conformance-helpers.js';
import type { CheckSkeleton, HostValues } from './family-conformance-manifest.js';

/**
 * Fixtures mirror the real shapes: a manifest body carries `{scope}` and
 * `{skill_prefix}` placeholders, the root `check` is `&&`-joined legs with
 * the family's head and tail around one turbo gate leg, and an aggregate is
 * the family's legs followed by any host legs.
 */
const HOST: HostValues = { scope: '@example', skill_prefix: 'ex-' };

const DECLARED_SCRIPTS = {
  build: 'turbo run --continue build',
  'skills:check': 'node skills-adapter-generate.js --check --prefix={skill_prefix}',
  'portability:check': 'pnpm --filter {scope}/agent-tools validate-portability',
};

const CONFORMING_SCRIPTS: Record<string, string> = {
  build: 'turbo run --continue build',
  'skills:check': 'node skills-adapter-generate.js --check --prefix=ex-',
  'portability:check': 'pnpm --filter @example/agent-tools validate-portability',
  check:
    'pnpm secrets:scan && pnpm lint:shell && pnpm sdk-codegen && ' +
    'turbo run --continue build test && turbo run --continue test:ui && ' +
    'pnpm knip:gate && pnpm repo-validators:check',
  'repo-validators:check':
    'pnpm --filter @example/agent-tools validate-check-ci-parity && ' +
    'pnpm practice:substrate:check && pnpm --filter @example/design validate-tokens',
};

const SKELETON: CheckSkeleton = {
  head: ['pnpm secrets:scan', 'pnpm lint:shell'],
  slot_before_build: 'host',
  gates: ['turbo run --continue build test'],
  slot_after_tests: 'host',
  tail: ['pnpm knip:gate', 'pnpm repo-validators:check'],
};

const AGGREGATES = {
  'repo-validators:check': [
    'pnpm --filter {scope}/agent-tools validate-check-ci-parity',
    'pnpm practice:substrate:check',
  ],
};

describe('substitutePlaceholders', () => {
  it('replaces every placeholder with the host value', () => {
    expect(substitutePlaceholders('{scope}/a {scope}/b --prefix={skill_prefix}', HOST)).toBe(
      '@example/a @example/b --prefix=ex-',
    );
  });
});

describe('splitLegs', () => {
  it('splits on && and trims, dropping empty legs', () => {
    expect(splitLegs(' pnpm a &&pnpm b&& && pnpm c ')).toEqual(['pnpm a', 'pnpm b', 'pnpm c']);
  });
});

describe('compareScripts', () => {
  it('reports no drift when every declared script matches after substitution', () => {
    expect(compareScripts(DECLARED_SCRIPTS, HOST, CONFORMING_SCRIPTS)).toEqual([]);
  });

  it('reports a missing script', () => {
    const withoutBuild = {
      'skills:check': CONFORMING_SCRIPTS['skills:check'] ?? '',
      'portability:check': CONFORMING_SCRIPTS['portability:check'] ?? '',
    };

    const drifts = compareScripts(DECLARED_SCRIPTS, HOST, withoutBuild);

    expect(drifts).toHaveLength(1);
    expect(drifts[0]?.area).toBe('script');
    expect(drifts[0]?.message).toContain('`build` is missing');
  });

  it('reports a differing body, naming both texts', () => {
    const drifted = { ...CONFORMING_SCRIPTS, 'portability:check': 'pnpm nothing' };

    const drifts = compareScripts(DECLARED_SCRIPTS, HOST, drifted);

    expect(drifts).toHaveLength(1);
    expect(drifts[0]?.message).toContain('reads `pnpm nothing`');
    expect(drifts[0]?.message).toContain(
      'declares `pnpm --filter @example/agent-tools validate-portability`',
    );
  });
});

describe('checkSkeleton', () => {
  it('reads the host slots from a conforming check', () => {
    const reading = checkSkeleton(SKELETON, HOST, CONFORMING_SCRIPTS['check']);

    expect(reading.drifts).toEqual([]);
    expect(reading.slotBeforeBuild).toEqual(['pnpm sdk-codegen']);
    expect(reading.slotAfterTests).toEqual(['turbo run --continue test:ui']);
  });

  it('reads empty slots when the host adds nothing', () => {
    const bare =
      'pnpm secrets:scan && pnpm lint:shell && turbo run --continue build test && ' +
      'pnpm knip:gate && pnpm repo-validators:check';

    const reading = checkSkeleton(SKELETON, HOST, bare);

    expect(reading.drifts).toEqual([]);
    expect(reading.slotBeforeBuild).toEqual([]);
    expect(reading.slotAfterTests).toEqual([]);
  });

  it('reports a missing check script', () => {
    const reading = checkSkeleton(SKELETON, HOST, undefined);

    expect(reading.drifts.map((entry) => entry.area)).toEqual(['check']);
    expect(reading.drifts[0]?.message).toContain('missing');
  });

  it('reports a head that does not open the script', () => {
    const reading = checkSkeleton(SKELETON, HOST, 'pnpm lint:shell && pnpm secrets:scan && x');

    expect(reading.drifts.some((entry) => entry.message.includes('head legs'))).toBe(true);
  });

  it('reports a tail that does not close the script', () => {
    const noTail = 'pnpm secrets:scan && pnpm lint:shell && turbo run --continue build test';

    const reading = checkSkeleton(SKELETON, HOST, noTail);

    expect(reading.drifts.some((entry) => entry.message.includes('tail legs'))).toBe(true);
  });

  it('reports the family gate legs run more than once, which the host slots never carry', () => {
    const twice =
      'pnpm secrets:scan && pnpm lint:shell && turbo run --continue build test && ' +
      'pnpm host:extra && turbo run --continue build test && ' +
      'pnpm knip:gate && pnpm repo-validators:check';

    const reading = checkSkeleton(SKELETON, HOST, twice);

    expect(reading.drifts).toHaveLength(1);
    expect(reading.drifts[0]?.message).toContain('more than once');
    expect(reading.slotAfterTests).toEqual([]);
  });

  it('reports gates that are absent or reordered between head and tail', () => {
    const reordered =
      'pnpm secrets:scan && pnpm lint:shell && turbo run --continue test build && ' +
      'pnpm knip:gate && pnpm repo-validators:check';

    const reading = checkSkeleton(SKELETON, HOST, reordered);

    expect(reading.drifts).toHaveLength(1);
    expect(reading.drifts[0]?.message).toContain('gate legs');
    expect(reading.drifts[0]?.message).toContain('`turbo run --continue test build`');
  });
});

describe('checkAggregates', () => {
  it('accepts an aggregate that starts with the family legs and adds host legs', () => {
    expect(checkAggregates(AGGREGATES, HOST, CONFORMING_SCRIPTS)).toEqual([]);
  });

  it('reports a missing aggregate', () => {
    const drifts = checkAggregates(AGGREGATES, HOST, { check: 'pnpm x' });

    expect(drifts).toHaveLength(1);
    expect(drifts[0]?.area).toBe('aggregate');
    expect(drifts[0]?.message).toContain('missing');
  });

  it('names the first leg that diverges from the family prefix', () => {
    const drifted = {
      'repo-validators:check':
        'pnpm --filter @example/agent-tools validate-check-ci-parity && pnpm something-else',
    };

    const drifts = checkAggregates(AGGREGATES, HOST, drifted);

    expect(drifts).toHaveLength(1);
    expect(drifts[0]?.message).toContain('leg 2 is `pnpm something-else`');
    expect(drifts[0]?.message).toContain('`pnpm practice:substrate:check`');
  });

  it('reports a family leg the aggregate ends before', () => {
    const short = {
      'repo-validators:check': 'pnpm --filter @example/agent-tools validate-check-ci-parity',
    };

    const drifts = checkAggregates(AGGREGATES, HOST, short);

    expect(drifts[0]?.message).toContain('leg 2 is (end of script)');
  });
});
