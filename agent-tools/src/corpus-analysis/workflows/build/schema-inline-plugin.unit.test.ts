import { describe, expect, it } from 'vitest';

import { deriveAgentJsonSchemas } from '../agent-schemas.js';
import {
  AGENT_SCHEMAS_MODULE_FILTER,
  RUN_DATA_MODULE_FILTER,
  agentSchemasModuleSource,
  agentSchemasInlinePlugin,
  runDataModuleSource,
  runDataInlinePlugin,
} from './schema-inline-plugin.js';

/**
 * The inline plugins substitute two modules when bundling sandbox artefacts: the real
 * `agent-schemas.ts` (which value-imports zod) with a precomputed zod-free literal, and
 * the unseeded `run-data.ts` sentinel with the stage-tagged validated payload. The
 * exported filters and module-source builders ARE the substitution contract — the
 * plugins compose exactly these values, so the tests assert the product, not copies.
 * (A mis-wired substitution cannot ship regardless: the sandbox purity scan fails the
 * build if zod survives, and an unseeded artefact fails its stage guard at zero spend.)
 */

describe('module filters (the substitution targets)', () => {
  it('the schema filter matches exactly the workflows agent-schemas module', () => {
    expect(
      AGENT_SCHEMAS_MODULE_FILTER.test(
        '/repo/agent-tools/src/corpus-analysis/workflows/agent-schemas.ts',
      ),
    ).toBe(true);
    expect(
      AGENT_SCHEMAS_MODULE_FILTER.test('/repo/agent-tools/src/corpus-analysis/judgment-schemas.ts'),
    ).toBe(false);
  });

  it('the run-data filter matches exactly the workflows run-data module', () => {
    expect(
      RUN_DATA_MODULE_FILTER.test('/repo/agent-tools/src/corpus-analysis/workflows/run-data.ts'),
    ).toBe(true);
    expect(
      RUN_DATA_MODULE_FILTER.test(
        '/repo/agent-tools/src/corpus-analysis/workflows/agent-schemas.ts',
      ),
    ).toBe(false);
  });

  it('the plugins carry their registered names', () => {
    expect(agentSchemasInlinePlugin().name).toBe('inline-derived-agent-schemas');
    expect(runDataInlinePlugin('map', { windows: [] }).name).toBe('inline-run-data');
  });
});

describe('agentSchemasModuleSource', () => {
  const source = agentSchemasModuleSource();

  it('exports AGENT_JSON_SCHEMAS as a literal that round-trips to the derived schemas', () => {
    const literalJson = source
      .replace('export const AGENT_JSON_SCHEMAS = ', '')
      .replace(/;\s*$/, '');
    expect(JSON.parse(literalJson)).toEqual(deriveAgentJsonSchemas());
  });

  it('is zod-free source with no module system (safe for the sandbox purity scan)', () => {
    expect(source).not.toMatch(/\bzod\b|\bz\./);
    // \b guards against schema content like the "importance" property.
    expect(source).not.toMatch(/\bimport\b/);
  });
});

describe('runDataModuleSource', () => {
  it('exports the stage discriminant and RUN_DATA as compact literals that round-trip', () => {
    const data = { windows: [{ window: 'w01', files: ['a.md'] }] };
    const source = runDataModuleSource('map', data);
    if (!source.ok) {
      expect.fail(`expected generated source, got: ${source.error.message}`);
    }
    const lines = source.value.trimEnd().split('\n');
    expect(lines[0]).toBe('export const RUN_DATA_STAGE = "map";');
    expect(
      JSON.parse((lines[1] ?? '').replace('export const RUN_DATA = ', '').replace(/;$/, '')),
    ).toEqual(data);
    // Compact serialisation — the payload competes with code for the harness size cap.
    expect(source.value).not.toContain('  "windows"');
  });

  it('refuses unserialisable data (undefined) — an unseeded build must stay unseeded loudly', () => {
    const source = runDataModuleSource('map', undefined);
    expect(!source.ok && source.error.message).toMatch(/run data/i);
  });
});
