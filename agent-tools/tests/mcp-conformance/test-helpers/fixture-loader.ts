/**
 * Fixture surface for the mcp-conformance tests. The committed artefacts ARE
 * the primary fixtures — retained REAL observation reports from the
 * 2026-07-26 alpha evidence runs and the live committed baselines — loaded
 * and pinned at their canonical paths rather than copied into test files, so
 * the tests describe the exact bytes the wrapper will meet in production.
 * Lives in `test-helpers/` per the no-real-io-in-tests structural allowlist:
 * real IO performed on behalf of tests belongs on a helper surface, not on
 * the `.test.ts` import surface.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { isJsonObject } from '../../../src/core/json.js';
import { baselineSchema, type Baseline } from '../../../src/mcp-conformance/baseline-schema.js';
import {
  compatReportSchema,
  type CompatReport,
} from '../../../src/mcp-conformance/compat-types.js';
import { mcpjamReportSchema, type McpjamReport } from '../../../src/mcp-conformance/types.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const FIXTURES = join(HERE, '..', 'fixtures');
const BASELINES = join(HERE, '..', '..', '..', 'src', 'mcp-conformance', 'baselines');

export function loadFixtureRaw(name: string): string {
  return readFileSync(join(FIXTURES, name), 'utf8');
}

export function loadFixture(name: string): McpjamReport {
  return mcpjamReportSchema.parse(JSON.parse(loadFixtureRaw(name)));
}

export function loadBaseline(name: string): Baseline {
  return baselineSchema.parse(JSON.parse(readFileSync(join(BASELINES, name), 'utf8')));
}

/**
 * A retained compat capture, parsed at the real boundary. Parsing INSIDE the
 * call (never via an intermediate binding) is what keeps `JSON.parse`'s `any`
 * off the test surface — the same shape `loadFixture` uses above.
 */
export function loadCompatReport(name: string): CompatReport {
  return compatReportSchema.parse(JSON.parse(loadFixtureRaw(name)));
}

/** Deep, typed clone for in-test mutation of expected-check maps. */
export function cloneBaseline(baseline: Baseline): Baseline {
  return structuredClone(baseline);
}

/** Re-serialise a raw fixture with its reporter schemaVersion overwritten. */
export function rawWithSchemaVersion(raw: string, version: number): string {
  const doc: unknown = JSON.parse(raw);
  if (!isJsonObject(doc)) {
    // Throw-guard, never a silent fallback: a non-object fixture root means
    // the override could not apply, and returning `raw` unchanged would let
    // the consuming test assert against an unmutated document.
    throw new Error('rawWithSchemaVersion: fixture root is not a JSON object');
  }
  return JSON.stringify({ ...doc, schemaVersion: version });
}
