/**
 * The contrast-verdict classifier is the honesty seam of the a11y
 * matrix (F15): these cells pin the measured/unmeasured split on the
 * check data. The load-bearing cells reproduce the two first-hand
 * signatures from the bundle-2 review census: the withheld 1:1
 * equalRatio node (invisible masthead text that passed CI) and the
 * ratio-0 bgGradient node (axe declining to measure, which must NOT
 * fail cells). Fixtures are full rule/node literals, no assertions.
 */
import { describe, expect, it } from 'vitest';

import {
  incompleteOutsideContrast,
  measuredContrastFailures,
  novelUnmeasuredContrast,
} from './axe-verdicts';

// The fence cells describe the MECHANISM with synthetic literal sets —
// the production ADJUDICATED_UNMEASURED_CONTRAST membership is
// sentinelled by the live suite, where a removed reason class goes red
// with its adjudication message; coupling these cells to it would move
// them whenever the set is extended.
const FENCE = new Set(['adjudicated-reason']);
const OPEN_FENCE = new Set<string>();

type Bucket = Parameters<typeof measuredContrastFailures>[0];
type RuleResult = Bucket['incomplete'][number];
type NodeResult = RuleResult['nodes'][number];

interface FixtureContrastData {
  readonly contrastRatio?: number;
  readonly expectedContrastRatio?: string;
  readonly messageKey?: string;
}

function contrastNode(
  data: FixtureContrastData | null,
  target = '.mast-inner > .brand-name',
): NodeResult {
  return {
    html: '<span>node</span>',
    target: [target],
    any:
      data === null
        ? []
        : [{ id: 'color-contrast', impact: 'serious', message: '', data, relatedNodes: [] }],
    all: [],
    none: [],
  };
}

function rule(id: string, nodes: NodeResult[], impact: 'serious' | null = 'serious'): RuleResult {
  return {
    id,
    impact,
    description: '',
    help: '',
    helpUrl: '',
    tags: [],
    nodes,
  };
}

function measured(ratio: number, messageKey?: string): FixtureContrastData {
  return {
    contrastRatio: ratio,
    expectedContrastRatio: '4.5:1',
    ...(messageKey === undefined ? {} : { messageKey }),
  };
}

describe('measuredContrastFailures — the withheld-failure seam', () => {
  it('fails the withheld 1:1 equalRatio node exactly like a violation', () => {
    const failures = measuredContrastFailures({
      violations: [],
      incomplete: [rule('color-contrast', [contrastNode(measured(1, 'equalRatio'))])],
    });
    expect(failures).toEqual([
      { target: '.mast-inner > .brand-name', ratio: 1, required: 4.5, bucket: 'incomplete' },
    ]);
  });

  it('fails a measured sub-threshold ratio (the 1.37:1 mid-transition class)', () => {
    const failures = measuredContrastFailures({
      violations: [],
      incomplete: [rule('color-contrast', [contrastNode(measured(1.37, 'shortTextContent'))])],
    });
    expect(failures).toHaveLength(1);
    expect(failures[0]?.ratio).toBe(1.37);
  });

  it('reads the violations bucket too, so a probe sees both filings', () => {
    const failures = measuredContrastFailures({
      violations: [rule('color-contrast', [contrastNode(measured(1.08))])],
      incomplete: [],
    });
    expect(failures).toEqual([
      { target: '.mast-inner > .brand-name', ratio: 1.08, required: 4.5, bucket: 'violations' },
    ]);
  });
});

describe('measuredContrastFailures — the not-measured boundary', () => {
  it('treats ratio 0 as the not-measured sentinel, never a failure', () => {
    const failures = measuredContrastFailures({
      violations: [],
      incomplete: [rule('color-contrast', [contrastNode(measured(0, 'bgGradient'))])],
    });
    expect(failures).toEqual([]);
  });

  it('passes a measured ratio at exactly the requirement (WCAG passes at 4.5:1)', () => {
    const failures = measuredContrastFailures({
      violations: [],
      incomplete: [rule('color-contrast', [contrastNode(measured(4.5, 'shortTextContent'))])],
    });
    expect(failures).toEqual([]);
  });

  it('honours a non-text 3:1 expectation from the data, not a constant', () => {
    const failures = measuredContrastFailures({
      violations: [],
      incomplete: [
        rule('color-contrast', [
          contrastNode({ contrastRatio: 2.9, expectedContrastRatio: '3:1' }),
        ]),
      ],
    });
    expect(failures[0]?.required).toBe(3);
  });
});

describe('novelUnmeasuredContrast — the adjudicated-reason fence', () => {
  it('absorbs reasons inside the adjudicated set silently', () => {
    const novel = novelUnmeasuredContrast(
      {
        incomplete: [
          rule('color-contrast', [
            contrastNode(measured(0, 'adjudicated-reason')),
            contrastNode(measured(0, 'adjudicated-reason')),
          ]),
        ],
      },
      FENCE,
    );
    expect(novel).toEqual([]);
  });

  it('surfaces a reason outside the set loudly', () => {
    const novel = novelUnmeasuredContrast(
      { incomplete: [rule('color-contrast', [contrastNode(measured(0, 'novel-reason'))])] },
      FENCE,
    );
    expect(novel).toEqual([{ target: '.mast-inner > .brand-name', reason: 'novel-reason' }]);
  });

  it('leaves measured nodes to the failure seam even when adjudicated', () => {
    const novel = novelUnmeasuredContrast(
      { incomplete: [rule('color-contrast', [contrastNode(measured(1, 'adjudicated-reason'))])] },
      FENCE,
    );
    expect(novel).toEqual([]);
  });
});

describe('novelUnmeasuredContrast — reason survival across vendor shapes', () => {
  it('surfaces a node with no contrast data at all', () => {
    const novel = novelUnmeasuredContrast(
      { incomplete: [rule('color-contrast', [contrastNode(null)])] },
      OPEN_FENCE,
    );
    expect(novel).toEqual([{ target: '.mast-inner > .brand-name', reason: 'no-check-data' }]);
  });

  it('keeps a reason-only vendor shape as its own name (pseudoContent, no ratio)', () => {
    // 4.12.1 early-return paths ship a messageKey with one or no
    // measurement fields; the name must survive, never collapse.
    const novel = novelUnmeasuredContrast(
      {
        incomplete: [
          rule('color-contrast', [
            contrastNode({ messageKey: 'pseudoContent', expectedContrastRatio: '4.5:1' }),
            contrastNode({ messageKey: 'nonBmp' }, '.emoji'),
          ]),
        ],
      },
      OPEN_FENCE,
    );
    expect(novel).toEqual([
      { target: '.mast-inner > .brand-name', reason: 'pseudoContent' },
      { target: '.emoji', reason: 'nonBmp' },
    ]);
  });

  it('treats markerless check data as no-check-data', () => {
    const novel = novelUnmeasuredContrast(
      { incomplete: [rule('color-contrast', [contrastNode({})])] },
      OPEN_FENCE,
    );
    expect(novel).toEqual([{ target: '.mast-inner > .brand-name', reason: 'no-check-data' }]);
  });

  it('routes a ratio without an expectation to the fence, never the void', () => {
    // Totality: every node lands in exactly one seam.
    const novel = novelUnmeasuredContrast(
      {
        incomplete: [
          rule('color-contrast', [contrastNode({ contrastRatio: 2, messageKey: 'oddShape' })]),
        ],
      },
      OPEN_FENCE,
    );
    expect(novel).toEqual([{ target: '.mast-inner > .brand-name', reason: 'oddShape' }]);
  });
});

describe('incompleteOutsideContrast — reviewOnFail failures stay loud', () => {
  it('projects a non-contrast incomplete rule (e.g. bypass)', () => {
    const outside = incompleteOutsideContrast({
      incomplete: [rule('bypass', [contrastNode(null, 'html > body')])],
    });
    expect(outside).toEqual([{ id: 'bypass', impact: 'serious', targets: ['html > body'] }]);
  });

  it('excludes color-contrast, which the two seams above own', () => {
    const outside = incompleteOutsideContrast({
      incomplete: [rule('color-contrast', [contrastNode(measured(0, 'bgGradient'))])],
    });
    expect(outside).toEqual([]);
  });

  it('names a null impact unknown rather than dropping the rule', () => {
    const outside = incompleteOutsideContrast({
      incomplete: [rule('bypass', [contrastNode(null, 'html > body')], null)],
    });
    expect(outside).toEqual([{ id: 'bypass', impact: 'unknown', targets: ['html > body'] }]);
  });
});
