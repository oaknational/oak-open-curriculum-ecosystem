import { join } from 'node:path';

import { ok } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { collectPairResults, registerPathFor, reportDirFor, resolveRunFlags } from './orchestrator';
import type { FidelityPair } from './pairing-types';

const ENV_EMPTY: NodeJS.ProcessEnv = {};

describe('resolveRunFlags', () => {
  it('defaults to the app base, standard width, and no mode flags', () => {
    const flags = resolveRunFlags([], ENV_EMPTY, 'http://localhost:3020');

    expect(flags.ok ? flags.value : undefined).toEqual({
      base: 'http://localhost:3020',
      width: 1440,
      reportOnly: false,
      keepServer: false,
    });
  });

  it('reads --base, --report-only and --keep-server from argv', () => {
    const flags = resolveRunFlags(
      ['--base', 'http://localhost:4000/', '--report-only', '--keep-server'],
      ENV_EMPTY,
      'http://localhost:3020',
    );

    expect(flags.ok ? flags.value : undefined).toEqual({
      base: 'http://localhost:4000',
      width: 1440,
      reportOnly: true,
      keepServer: true,
    });
  });

  it('propagates a width rejection as the run-fatal error string', () => {
    const flags = resolveRunFlags(['--width', '1440px'], ENV_EMPTY, 'http://localhost:3020');

    expect(flags.ok).toBe(false);
    expect(flags.ok ? undefined : flags.error).toContain('1440px');
  });
});

describe('the run layout convention', () => {
  it("places the report dir exactly two levels below the demo root — the position the renderer's evidence links assume", () => {
    // Real filesystem paths, host-joined by the product; the expectations
    // derive the same form so the convention is pinned on every platform.
    expect(reportDirFor('/apps/demo')).toBe(join('/apps/demo', 'demo-evidence', 'fidelity-report'));
    expect(registerPathFor('/apps/demo')).toBe(join('/apps/demo', 'fidelity-register.json'));
  });
});

const pairOf = (id: string): FidelityPair => ({
  id,
  kind: 'page-fullpage',
  exportPng: `demo-evidence/export-${id}.png`,
  livePng: `demo-evidence/live-${id}.png`,
  liveRoute: `/${id}`,
  diffEligible: true,
});

describe('collectPairResults', () => {
  it('collects every pair result in declaration order', () => {
    const pairs = [pairOf('a'), pairOf('b')];
    const outcome = collectPairResults(pairs, (pair) => ok({ pair, status: 'reference-only' }));

    expect(outcome.ok ? outcome.value.map((result) => result.pair.id) : undefined).toEqual([
      'a',
      'b',
    ]);
  });
});
