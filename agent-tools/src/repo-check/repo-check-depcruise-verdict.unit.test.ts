import { describe, expect, it } from 'vitest';

import {
  depcruiseSummaryFailures,
  unloadedCruiseOptionFailures,
  type DepcruiseSummaryEvidence,
} from './repo-check-depcruise-verdict.js';

/**
 * The dependency-cruiser gate reads the cruise's own summary for its verdict.
 * These tests describe the pure mapping from that summary, and from the
 * configured options, to gate failures. The cruise itself lives in the
 * composition root: `repo-check-depcruise.integration.test.ts` proves its
 * wiring, and the gate running proves the real cruise.
 */

const TYPESCRIPT_FOUND = {
  name: 'typescript',
  version: '>=2.0.0 <7.0.0',
  currentVersion: 'typescript@6.0.3',
  available: true,
};

const TYPESCRIPT_OUT_OF_RANGE = {
  name: 'typescript',
  version: '>=2.0.0 <7.0.0',
  currentVersion: '-',
  available: false,
};

type Transpiler = DepcruiseSummaryEvidence['environment']['transpilersFound'][number];

function summary(input: {
  readonly error?: number;
  readonly warn?: number;
  readonly info?: number;
  readonly ignore?: number;
  readonly typescript?: Transpiler;
  readonly issueNames?: readonly string[];
}): DepcruiseSummaryEvidence {
  return {
    error: input.error ?? 0,
    warn: input.warn ?? 0,
    info: input.info ?? 0,
    ignore: input.ignore ?? 0,
    environment: {
      transpilersFound: [
        { name: 'javascript', version: '*', currentVersion: '-', available: true },
        ...(input.typescript === undefined ? [] : [input.typescript]),
      ],
      ...(input.issueNames === undefined
        ? {}
        : {
            issues: input.issueNames.map((name) => ({
              severity: 'warn' as const,
              name,
              description: `${name} described`,
            })),
          }),
    },
  };
}

describe('depcruiseSummaryFailures', () => {
  it('passes a cruise that had the TypeScript compiler and found and raised nothing', () => {
    expect(depcruiseSummaryFailures(summary({ typescript: TYPESCRIPT_FOUND }))).toStrictEqual([]);
  });

  it('fails a cruise whose TypeScript compiler was outside the supported range, as a TypeScript 7 bump leaves it', () => {
    const failures = depcruiseSummaryFailures(
      summary({
        typescript: TYPESCRIPT_OUT_OF_RANGE,
        issueNames: ['missing-typescript-transpiler'],
      }),
    );

    expect(failures).toHaveLength(2);
    expect(failures[0]).toContain('no supported TypeScript compiler');
    expect(failures[0]).toContain('>=2.0.0 <7.0.0');
    expect(failures[1]).toContain('missing-typescript-transpiler');
  });

  it('fails a cruise with no TypeScript transpiler record at all', () => {
    const failures = depcruiseSummaryFailures(summary({}));

    expect(failures).toHaveLength(1);
    expect(failures[0]).toContain('no supported TypeScript compiler');
  });

  it('fails on any environment issue, not only the TypeScript one — each is a warning', () => {
    const failures = depcruiseSummaryFailures(
      summary({ typescript: TYPESCRIPT_FOUND, issueNames: ['missing-babel-transpiler'] }),
    );

    expect(failures).toHaveLength(1);
    expect(failures[0]).toContain('missing-babel-transpiler');
  });

  it("fails on error-severity violations, stating the cruise's own count", () => {
    const failures = depcruiseSummaryFailures(summary({ typescript: TYPESCRIPT_FOUND, error: 1 }));

    expect(failures).toStrictEqual(['1 error-severity violations']);
  });

  it('fails on warn-severity violations, which the command line leaves out of its exit code', () => {
    const failures = depcruiseSummaryFailures(summary({ typescript: TYPESCRIPT_FOUND, warn: 2 }));

    expect(failures).toHaveLength(1);
    expect(failures[0]).toContain('2 warn-severity violations');
  });

  it('fails on info-severity violations, which the report lists', () => {
    const failures = depcruiseSummaryFailures(summary({ typescript: TYPESCRIPT_FOUND, info: 3 }));

    expect(failures).toHaveLength(1);
    expect(failures[0]).toContain('3 info-severity violations');
  });

  it('fails on ignored violations, so neither an ignore rule nor a baseline grandfathers one', () => {
    const failures = depcruiseSummaryFailures(summary({ typescript: TYPESCRIPT_FOUND, ignore: 4 }));

    expect(failures).toHaveLength(1);
    expect(failures[0]).toContain('4 ignored violations');
  });
});

describe('unloadedCruiseOptionFailures', () => {
  it('passes a configuration that names neither a webpack nor a babel configuration', () => {
    expect(unloadedCruiseOptionFailures({})).toStrictEqual([]);
  });

  it('fails each configured key the gate would otherwise ignore', () => {
    const failures = unloadedCruiseOptionFailures({
      webpackConfig: { fileName: 'webpack.config.js' },
      babelConfig: { fileName: '.babelrc' },
    });

    expect(failures).toHaveLength(2);
    expect(failures[0]).toContain('webpackConfig');
    expect(failures[1]).toContain('babelConfig');
  });
});
