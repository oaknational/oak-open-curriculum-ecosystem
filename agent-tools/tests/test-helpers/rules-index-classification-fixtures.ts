import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

/**
 * Test-helpers surface for the RULES_INDEX classification validation test
 * (`agent-tools/tests/rules/rules-index-classification.unit.test.ts`).
 * Provides loaders for the canonical rule corpus and the index markdown.
 *
 * Lives under `test-helpers/` per the structural path-shape allowlist
 * named in `packages/core/oak-eslint/src/rules/no-real-io-in-tests.ts`.
 * Tests consume these loaders rather than importing `node:fs/promises`
 * directly per ADR-078.
 */

const repoRoot = path.resolve(__dirname, '..', '..', '..');
const rulesDir = path.join(repoRoot, '.agent', 'rules');
const indexPath = path.join(repoRoot, 'RULES_INDEX.md');

export async function loadRulesIndexMarkdown(): Promise<string> {
  return readFile(indexPath, 'utf8');
}

export async function listCanonicalRuleFiles(): Promise<readonly string[]> {
  const entries = await readdir(rulesDir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => `.agent/rules/${entry.name}`)
    .sort((a, b) => a.localeCompare(b));
}
