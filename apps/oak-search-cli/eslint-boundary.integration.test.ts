import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { ESLint } from 'eslint';

interface LintMessage {
  readonly ruleId: string | null;
  readonly message: string;
}

interface LintScenario {
  readonly filePath: string;
  readonly code: string;
}

const workspaceDir = dirname(fileURLToPath(import.meta.url));
const boundaryFixturePaths = [
  'src/cli/search/__boundary-fixture__.ts',
  'src/cli/shared/__boundary-fixture__.ts',
  'src/lib/__boundary-fixture__.ts',
  'src/lib/indexing/__boundary-fixture__.ts',
  'src/adapters/__boundary-fixture__.ts',
  'src/cli/observe/__boundary-fixture__.ts',
  'src/cli/admin/__boundary-fixture__.ts',
  'evaluation/analysis/__boundary-fixture__.ts',
  'operations/sandbox/__boundary-fixture__.ts',
  'operations/ingestion/__boundary-fixture__.ts',
];

async function lintScenario(scenario: LintScenario): Promise<readonly LintMessage[]> {
  return lintScenarioWithFixtures(scenario, boundaryFixturePaths);
}

async function lintScenarioWithFixtures(
  scenario: LintScenario,
  fixturePaths: readonly string[],
): Promise<readonly LintMessage[]> {
  const absoluteFilePath = resolve(workspaceDir, scenario.filePath);
  // These tests rely on ESLint loading the workspace flat config from cwd and
  // applying file-pattern boundary rules to the virtual file path passed to lintText.
  const eslint = new ESLint({
    cwd: workspaceDir,
    overrideConfig: {
      languageOptions: {
        parserOptions: {
          projectService: {
            allowDefaultProject: fixturePaths,
          },
        },
      },
    },
  });
  const [result] = await eslint.lintText(scenario.code, {
    filePath: absoluteFilePath,
  });
  if (!result) {
    throw new Error(`ESLint did not return a result for scenario file: ${scenario.filePath}`);
  }
  return result.messages.map((message) => ({
    ruleId: message.ruleId,
    message: message.message,
  }));
}

function hasRestrictedImportsError(messages: readonly LintMessage[], text: string): boolean {
  return messages.some(
    (message) =>
      message.ruleId === '@typescript-eslint/no-restricted-imports' &&
      message.message.includes(text),
  );
}

function hasNoLintErrors(messages: readonly LintMessage[]): boolean {
  return messages.length === 0;
}

function hasNoRestrictedImportsErrors(messages: readonly LintMessage[]): boolean {
  return messages.every((message) => message.ruleId !== '@typescript-eslint/no-restricted-imports');
}

describe('eslint boundary policy (ADR-134)', () => {
  it('fails when non-admin search modules import admin surface', { timeout: 30_000 }, async () => {
    const messages = await lintScenario({
      filePath: 'src/cli/search/__boundary-fixture__.ts',
      code: `
import type { AdminService } from '@oaknational/oak-search-sdk/admin';
export type { AdminService };
`,
    });

    expect(
      hasRestrictedImportsError(
        messages,
        'Non-admin CLI modules must not import admin capability surface.',
      ),
    ).toBe(true);
  });

  it('fails when non-admin shared modules import root SDK surface', async () => {
    const messages = await lintScenario({
      filePath: 'src/cli/shared/__boundary-fixture__.ts',
      code: `
import type { RetrievalService } from '@oaknational/oak-search-sdk';
export type { RetrievalService };
`,
    });

    expect(
      hasRestrictedImportsError(
        messages,
        "Non-admin CLI modules must import from '@oaknational/oak-search-sdk/read'.",
      ),
    ).toBe(true);
  });

  it('fails when app code imports SDK deep/internal implementation paths', async () => {
    const messages = await lintScenario({
      filePath: 'src/lib/__boundary-fixture__.ts',
      code: `
import { resolveSearchIndexName } from '@oaknational/oak-search-sdk/internal/index';
export const value = resolveSearchIndexName;
`,
    });

    expect(
      hasRestrictedImportsError(
        messages,
        'App code must not import SDK internal or deep implementation paths.',
      ),
    ).toBe(true);
  });

  it('allows read surface imports in non-admin modules', async () => {
    const messages = await lintScenario({
      filePath: 'src/cli/observe/__boundary-fixture__.ts',
      code: `
import type { RetrievalService } from '@oaknational/oak-search-sdk/read';
export type { RetrievalService };
`,
    });

    expect(hasNoLintErrors(messages)).toBe(true);
  });

  it('allows admin surface imports in admin modules', async () => {
    const messages = await lintScenario({
      filePath: 'src/cli/admin/__boundary-fixture__.ts',
      code: `
import type { AdminService } from '@oaknational/oak-search-sdk/admin';
export type { AdminService };
`,
    });

    expect(hasNoLintErrors(messages)).toBe(true);
  });

  it('fails when non-admin lib modules import root SDK surface', async () => {
    const messages = await lintScenario({
      filePath: 'src/lib/__boundary-fixture__.ts',
      code: `
import type { RetrievalService } from '@oaknational/oak-search-sdk';
export type { RetrievalService };
`,
    });

    expect(
      hasRestrictedImportsError(
        messages,
        "Non-admin CLI modules must import from '@oaknational/oak-search-sdk/read'.",
      ),
    ).toBe(true);
  });

  it('fails when admin modules import read surface', async () => {
    const messages = await lintScenario({
      filePath: 'src/cli/admin/__boundary-fixture__.ts',
      code: `
import type { RetrievalService } from '@oaknational/oak-search-sdk/read';
export type { RetrievalService };
`,
    });

    expect(
      hasRestrictedImportsError(
        messages,
        "Admin CLI modules must not import the read surface; use '@oaknational/oak-search-sdk/admin'.",
      ),
    ).toBe(true);
  });

  it('fails when admin modules import root SDK surface', async () => {
    const messages = await lintScenario({
      filePath: 'src/cli/admin/__boundary-fixture__.ts',
      code: `
import type { RetrievalService } from '@oaknational/oak-search-sdk';
export type { RetrievalService };
`,
    });

    expect(
      hasRestrictedImportsError(
        messages,
        "Admin CLI modules must import from '@oaknational/oak-search-sdk/admin'.",
      ),
    ).toBe(true);
  });

  it('fails when indexing modules import read surface', async () => {
    const messages = await lintScenario({
      filePath: 'src/lib/indexing/__boundary-fixture__.ts',
      code: `
import type { RetrievalService } from '@oaknational/oak-search-sdk/read';
export type { RetrievalService };
`,
    });

    expect(
      hasRestrictedImportsError(
        messages,
        "Admin CLI modules must not import the read surface; use '@oaknational/oak-search-sdk/admin'.",
      ),
    ).toBe(true);
  });

  it('fails when adapter modules import read surface', async () => {
    const messages = await lintScenario({
      filePath: 'src/adapters/__boundary-fixture__.ts',
      code: `
import type { RetrievalService } from '@oaknational/oak-search-sdk/read';
export type { RetrievalService };
`,
    });

    expect(
      hasRestrictedImportsError(
        messages,
        "Admin CLI modules must not import the read surface; use '@oaknational/oak-search-sdk/admin'.",
      ),
    ).toBe(true);
  });

  it('allows admin surface imports in indexing modules', async () => {
    const messages = await lintScenario({
      filePath: 'src/lib/indexing/__boundary-fixture__.ts',
      code: `
import type { AdminService } from '@oaknational/oak-search-sdk/admin';
export type { AdminService };
`,
    });

    expect(hasNoLintErrors(messages)).toBe(true);
  });

  it('allows admin surface imports in evaluation helper modules', async () => {
    const messages = await lintScenario({
      filePath: 'evaluation/analysis/__boundary-fixture__.ts',
      code: `
import type { SearchSdk } from '@oaknational/oak-search-sdk/admin';
export type { SearchSdk };
`,
    });

    expect(hasNoLintErrors(messages)).toBe(true);
  });

  it('fails when evaluation helper modules import root SDK surface', async () => {
    const messages = await lintScenario({
      filePath: 'evaluation/analysis/__boundary-fixture__.ts',
      code: `
import type { RetrievalService } from '@oaknational/oak-search-sdk';
export type { RetrievalService };
`,
    });

    expect(
      hasRestrictedImportsError(
        messages,
        "Mixed-capability modules must import from '@oaknational/oak-search-sdk/read' or '@oaknational/oak-search-sdk/admin', never root.",
      ),
    ).toBe(true);
  });

  it('fails when evaluation helper modules import SDK internal paths', async () => {
    const messages = await lintScenario({
      filePath: 'evaluation/analysis/__boundary-fixture__.ts',
      code: `
import { resolveSearchIndexName } from '@oaknational/oak-search-sdk/internal/index';
export const value = resolveSearchIndexName;
`,
    });

    expect(
      hasRestrictedImportsError(
        messages,
        'App code must not import SDK internal or deep implementation paths.',
      ),
    ).toBe(true);
  });

  it('allows read surface imports in evaluation helper modules', async () => {
    const messages = await lintScenario({
      filePath: 'evaluation/analysis/__boundary-fixture__.ts',
      code: `
import type { RetrievalService } from '@oaknational/oak-search-sdk/read';
export type { RetrievalService };
`,
    });

    expect(hasNoLintErrors(messages)).toBe(true);
  });

  it('allows admin surface imports in operations modules', async () => {
    const messages = await lintScenario({
      filePath: 'operations/sandbox/__boundary-fixture__.ts',
      code: `
import type { SearchSdk } from '@oaknational/oak-search-sdk/admin';
export type { SearchSdk };
`,
    });

    expect(hasNoRestrictedImportsErrors(messages)).toBe(true);
  });
});
