import type {
  IAvailableTranspiler,
  ICruiseOptions,
  ICruiseResult,
  IEnvironmentIssue,
  IFormatOptions,
  IViolation,
} from 'dependency-cruiser';
import { describe, expect, it } from 'vitest';

import { runDepcruiseGate, type DepcruiseGateRuntime } from './repo-check-depcruise.js';

/**
 * The dependency-cruiser gate's composition root, driven through its injected
 * runtime. The configuration reader, the tsconfig extractor, the cruise, the
 * formatter and the two output streams are simple fakes, so these tests prove
 * the wiring between them: what reaches the cruise, what is printed, and the
 * status returned. No file is read and nothing is cruised. Each fixture's
 * failure lines are asserted by their count and by the clauses that carry the
 * diagnosis or the action, never whole sentences (testing-patterns.md
 * §Rendered-Output Assertions), and without importing the verdict; the verdict's
 * own unit suite (`repo-check-depcruise-verdict.unit.test.ts`) covers every
 * summary it maps. The configuration file's name and the real API are proved by
 * the gate running (`pnpm depcruise`).
 */

/** The name every failure line is written under. */
const GATE_PREFIX = 'repo-check depcruise-gate: ';

/**
 * The directories holding every workspace `pnpm-workspace.yaml` declares, all
 * of which the gate owes a cruise. A literal, not the gate's own constant: a
 * root dropped from that constant would still equal itself, and a cruise over
 * fewer roots is a silent partial cruise that exits clean, which the gate
 * running cannot catch.
 */
const WORKSPACE_ROOTS = ['agent-tools', 'jcdotnet', 'tooling'];

/** The manifest text the fake runtime serves: the three roots, one as a glob. */
const WORKSPACE_MANIFEST = 'packages:\n  - agent-tools\n  - jcdotnet\n  - tooling/*\n';

/** The reporter the gate's printed report comes from: `err`, as the gate's docblock states. */
const ERR_REPORTER: IFormatOptions = { outputType: 'err' };

/** Options as the configuration reader returns them, naming a tsconfig. */
const CONFIGURED_OPTIONS: ICruiseOptions = {
  doNotFollow: { path: 'node_modules' },
  tsConfig: { fileName: 'tsconfig.depcruise.json' },
};

/** A parsed tsconfig, as the extractor returns it. */
const PARSED_TSCONFIG = {
  options: { baseUrl: '.' },
  fileNames: ['jcdotnet/app/page.tsx'],
  errors: [],
};

/** The text the fake formatter returns; the gate must print it verbatim. */
const REPORT = 'the formatted report of the cruised result\n';

const JAVASCRIPT_FOUND: IAvailableTranspiler = {
  name: 'javascript',
  version: '*',
  currentVersion: '-',
  available: true,
};

const TYPESCRIPT_FOUND: IAvailableTranspiler = {
  name: 'typescript',
  version: '>=2.0.0 <7.0.0',
  currentVersion: 'typescript@6.0.3',
  available: true,
};

/** The compiler outside dependency-cruiser's supported range, as a TypeScript 7 bump leaves it. */
const TYPESCRIPT_UNAVAILABLE: IAvailableTranspiler = {
  ...TYPESCRIPT_FOUND,
  currentVersion: '-',
  available: false,
};

const MISSING_TYPESCRIPT_ISSUE: IEnvironmentIssue = {
  severity: 'warn',
  name: 'missing-typescript-transpiler',
  description: 'typescript files found, but no supported typescript compiler',
};

const VIOLATION: IViolation = {
  from: 'agent-tools/src/a.ts',
  to: 'jcdotnet/app/b.ts',
  rule: { name: 'no-cross-workspace-imports', severity: 'error' },
};

/** A cruise result whose summary carries the given compiler record, issues and violations. */
function cruiseResult(input: {
  readonly typescript: IAvailableTranspiler;
  readonly issues?: readonly IEnvironmentIssue[];
  readonly error?: number;
  readonly violations?: readonly IViolation[];
}): ICruiseResult {
  return {
    modules: [],
    summary: {
      error: input.error ?? 0,
      advisedExitCode: input.error ?? 0,
      warn: 0,
      info: 0,
      ignore: 0,
      totalCruised: 1,
      violations: [...(input.violations ?? [])],
      optionsUsed: {},
      environment: {
        version: '18.1.1',
        nodeVersionSupported: '^20.12||^22||>=24',
        nodeVersionFound: 'v24.15.0',
        osVersionFound: 'darwin',
        transpilersFound: [JAVASCRIPT_FOUND, input.typescript],
        extensionsFound: [],
        ...(input.issues === undefined ? {} : { issues: [...input.issues] }),
      },
    },
  };
}

/** The one failure line that contains `needle`, so a multi-line assertion never pins line order. */
function lineContaining(lines: readonly string[], needle: string): string {
  const matching = lines.filter((line) => line.includes(needle));
  expect(matching).toHaveLength(1);
  return matching[0] ?? '';
}

/**
 * Assert the line starts with the gate's name. It compares the line's opening
 * characters rather than searching the whole line, so text written before the
 * name fails, and the failure message shows what the line actually starts with.
 */
function expectUnderGateName(line: string | undefined): void {
  expect(line?.slice(0, GATE_PREFIX.length)).toBe(GATE_PREFIX);
}

/**
 * A fake runtime: the reader returns `options`, the cruise returns `output`
 * (a result, or reporter text), and every call the gate makes is recorded.
 */
function gateRuntime(
  output: ICruiseResult | string,
  options: ICruiseOptions = CONFIGURED_OPTIONS,
  manifestText: string = WORKSPACE_MANIFEST,
) {
  const tsConfigReads: string[] = [];
  const cruisedRoots: ReadonlySet<string>[] = [];
  const cruises: unknown[] = [];
  const formatted: unknown[] = [];
  const reportWrites: string[] = [];
  const failureLines: string[] = [];
  const runtime: DepcruiseGateRuntime = {
    readWorkspaceManifest() {
      return manifestText;
    },
    extractDepcruiseOptions() {
      return Promise.resolve(options);
    },
    extractTSConfig(tsConfigFileName) {
      tsConfigReads.push(tsConfigFileName);
      return PARSED_TSCONFIG;
    },
    cruise(roots, cruiseOptions, _resolveOptions, transpileOptions) {
      // A set: the cruise's reach does not depend on the order of its roots.
      cruisedRoots.push(new Set(roots));
      cruises.push({ options: cruiseOptions, transpileOptions });
      // The API's identity reporter returns exit code 0 whatever the cruise
      // found; the gate's verdict must come from the summary, never an exit code.
      return Promise.resolve({ output, exitCode: 0 });
    },
    format(cruised, formatOptions) {
      formatted.push({ cruised, formatOptions });
      return Promise.resolve({ output: REPORT, exitCode: 0 });
    },
    writeReport(text) {
      reportWrites.push(text);
    },
    writeFailure(line) {
      failureLines.push(line);
    },
  };
  return { tsConfigReads, cruisedRoots, cruises, formatted, reportWrites, failureLines, runtime };
}

describe('runDepcruiseGate', () => {
  it('refuses before any cruise when the workspace manifest declares no packages, naming the manifest', async () => {
    const { cruises, reportWrites, failureLines, runtime } = gateRuntime(
      cruiseResult({ typescript: TYPESCRIPT_FOUND }),
      CONFIGURED_OPTIONS,
      'onlyBuiltDependencies:\n  - esbuild\n',
    );

    await expect(runDepcruiseGate(runtime)).resolves.toBe(1);

    expect(cruises).toStrictEqual([]);
    expect(reportWrites).toStrictEqual([]);
    expect(failureLines).toStrictEqual([
      `${GATE_PREFIX}pnpm-workspace.yaml declares no packages list to cruise`,
    ]);
  });

  it('passes a clean cruise and prints the err report formatted from that cruise', async () => {
    const result = cruiseResult({ typescript: TYPESCRIPT_FOUND });
    const { formatted, reportWrites, failureLines, runtime } = gateRuntime(result);

    await expect(runDepcruiseGate(runtime)).resolves.toBe(0);

    expect(formatted).toStrictEqual([{ cruised: result, formatOptions: ERR_REPORTER }]);
    expect(reportWrites).toStrictEqual([REPORT]);
    expect(failureLines).toStrictEqual([]);
  });

  it("fails a cruise that ran without the TypeScript compiler though it exited 0, naming the missing compiler and the environment issue under the gate's name", async () => {
    const { reportWrites, failureLines, runtime } = gateRuntime(
      cruiseResult({ typescript: TYPESCRIPT_UNAVAILABLE, issues: [MISSING_TYPESCRIPT_ISSUE] }),
    );

    await expect(runDepcruiseGate(runtime)).resolves.toBe(1);

    expect(reportWrites).toStrictEqual([REPORT]);
    expect(failureLines).toHaveLength(2);
    const compilerLine = lineContaining(failureLines, 'no supported TypeScript compiler');
    expectUnderGateName(compilerLine);
    expect(compilerLine).toContain('parsed none of the TypeScript estate');
    const issueLine = lineContaining(failureLines, MISSING_TYPESCRIPT_ISSUE.name);
    expectUnderGateName(issueLine);
  });

  it("fails a cruise with a single violation, writing its one failure line under the gate's name", async () => {
    const { reportWrites, failureLines, runtime } = gateRuntime(
      cruiseResult({ typescript: TYPESCRIPT_FOUND, error: 1, violations: [VIOLATION] }),
    );

    await expect(runDepcruiseGate(runtime)).resolves.toBe(1);

    expect(reportWrites).toStrictEqual([REPORT]);
    expect(failureLines).toHaveLength(1);
    expectUnderGateName(failureLines[0]);
    expect(failureLines[0]).toContain('error-severity violations');
    expect(failureLines[0]).toMatch(/\b1\b/u);
  });

  it('cruises every workspace with the options the configuration reader returned and the tsconfig those options name', async () => {
    const { tsConfigReads, cruisedRoots, cruises, runtime } = gateRuntime(
      cruiseResult({ typescript: TYPESCRIPT_FOUND }),
    );

    await expect(runDepcruiseGate(runtime)).resolves.toBe(0);

    expect(cruisedRoots).toStrictEqual([new Set(WORKSPACE_ROOTS)]);
    expect(tsConfigReads).toStrictEqual([CONFIGURED_OPTIONS.tsConfig?.fileName]);
    expect(cruises).toStrictEqual([
      { options: CONFIGURED_OPTIONS, transpileOptions: { tsConfig: PARSED_TSCONFIG } },
    ]);
  });

  it('refuses a configuration that names a webpack configuration, before cruising and printing no report', async () => {
    const { cruises, reportWrites, failureLines, runtime } = gateRuntime(
      cruiseResult({ typescript: TYPESCRIPT_FOUND }),
      { ...CONFIGURED_OPTIONS, webpackConfig: { fileName: 'webpack.config.js' } },
    );

    await expect(runDepcruiseGate(runtime)).resolves.toBe(1);

    expect(cruises).toStrictEqual([]);
    expect(reportWrites).toStrictEqual([]);
    expect(failureLines).toHaveLength(1);
    expectUnderGateName(failureLines[0]);
    expect(failureLines[0]).toContain('webpackConfig');
    expect(failureLines[0]).toContain('load it in repo-check-depcruise.ts');
  });

  it('refuses a cruise that returned reporter text instead of a result, printing no report', async () => {
    const { formatted, reportWrites, failureLines, runtime } = gateRuntime('reporter text');

    await expect(runDepcruiseGate(runtime)).resolves.toBe(1);

    expect(formatted).toStrictEqual([]);
    expect(reportWrites).toStrictEqual([]);
    expect(failureLines).toHaveLength(1);
    expectUnderGateName(failureLines[0]);
    expect(failureLines[0]).toContain('reporter text, not a result');
  });
});
