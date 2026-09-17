/**
 * Real-IO seam for the dependency-cruiser boundary-rule red-proofs:
 * builds a temp fixture tree and cruises it IN-PROCESS through the
 * dependency-cruiser JS API — no child processes (testing-strategy
 * §"No process spawning in in-process tests"; real-binary composition
 * belongs at smoke tier, so the proof runs the library, not the
 * binary). Kept out of the test file per the no-real-io-in-tests
 * convention (ADR-078) — the test imports this helper; the helper owns
 * the filesystem work and the cruise invocation.
 */

import { mkdirSync, mkdtempSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { cruise } from 'dependency-cruiser';
import extractDepcruiseConfig from 'dependency-cruiser/config-utl/extract-depcruise-config';

export interface DepcruiseFixture {
  readonly dir: string;
  readonly writeFile: (relative: string, content: string) => void;
  readonly remove: () => void;
}

export function makeDepcruiseFixture(prefix: string): DepcruiseFixture {
  // realpath so baseDir matches the resolver's realpathed module paths —
  // macOS's tmpdir is a symlink (/var -> /private/var), and a symlinked
  // baseDir makes every resolved `to` relativise through ../.. noise.
  const dir = realpathSync(mkdtempSync(path.join(tmpdir(), prefix)));
  return {
    dir,
    writeFile: (relative, content) => {
      const target = path.join(dir, relative);
      mkdirSync(path.dirname(target), { recursive: true });
      writeFileSync(target, content);
    },
    remove: () => {
      rmSync(dir, { recursive: true, force: true });
    },
  };
}

/** One reported violation, as the assertions consume it. */
export interface FixtureViolation {
  readonly from: string;
  readonly to: string;
  readonly ruleName: string;
  readonly ruleSeverity: string;
}

/**
 * Cruise `scanDir` inside the fixture against the REAL repo config's
 * named forbidden rules under the REAL enforcement options (only
 * tsConfig/progress/reporterOptions dropped — they reference repo-root
 * files and terminal state, not enforcement semantics), anchored via
 * `baseDir` so module paths stay fixture-relative without touching
 * process state.
 */
export async function cruiseFixture(input: {
  readonly repoRoot: string;
  readonly fixtureDir: string;
  readonly ruleNames: readonly string[];
  readonly scanDir: string;
}): Promise<readonly FixtureViolation[]> {
  const real = await extractDepcruiseConfig(path.join(input.repoRoot, '.dependency-cruiser.mjs'));
  const names = new Set(input.ruleNames);
  // The enforcement options (exclude, doNotFollow, …) are TOP-LEVEL cruise
  // options — a nested ruleSet.options key is silently ignored, which would
  // run the suite under DEFAULT options: the exact nullification class this
  // helper exists to expose. Only repo-anchored and terminal-state options
  // are dropped; rest-destructuring leaves them unused by design.
  const enforcementOptions = { ...(real.options ?? {}) };
  delete enforcementOptions.tsConfig;
  delete enforcementOptions.progress;
  delete enforcementOptions.reporterOptions;
  const result = await cruise([input.scanDir], {
    ...enforcementOptions,
    ruleSet: {
      forbidden: (real.forbidden ?? []).filter((rule) => names.has(rule.name ?? '')),
    },
    validate: true,
    baseDir: input.fixtureDir,
  });
  if (typeof result.output === 'string') {
    // Unreachable by construction (no outputType requested returns the
    // result object); an empty return fails every red-proof assertion
    // loudly rather than smuggling a throw past the Result discipline.
    return [];
  }
  return result.output.summary.violations.map((violation) => ({
    from: violation.from,
    to: violation.to,
    ruleName: violation.rule.name,
    ruleSeverity: violation.rule.severity,
  }));
}
