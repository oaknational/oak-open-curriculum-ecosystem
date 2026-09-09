import { describe, expect, it } from 'vitest';
import { parse as parseYaml } from 'yaml';
import { z } from 'zod';

import { splitFrontmatter } from '../../src/collaboration-state/test-helpers/frontmatter.js';
import {
  listRepoDirectory,
  readRepoDocument,
} from '../../src/collaboration-state/test-helpers/repo-doc.js';

/**
 * The ChatGPT/Codex package's shipped invariants, recomputed from the tree.
 *
 * @remarks
 * MCP-692. `plugins/oak-open-curriculum-chatgpt/` is what OpenAI ingests, and
 * its load-bearing properties were checked by hand at the 2026-09-07 sideload
 * and recorded in the PR body only. This suite recomputes them on every run:
 * the Codex manifest has exactly the shape the package relies on (skills only,
 * so no server, hook, or app can be declared, which is what keeps the plugin
 * off the desktop-only badge), `interface.capabilities` is the value that
 * passed ingestion, the two manifests describe one product, and every shipped
 * skill meets the frontmatter contract.
 *
 * Learned from MCP-509: a guard that reads an absent value asserts nothing.
 * The manifest is parsed through a strict schema so a shape change fails
 * loudly, and the skill scan refuses an empty directory rather than passing
 * vacuously.
 *
 * ADR-078 helper-mediated committed-artefact reads.
 */

const PACKAGE_ROOT = 'plugins/oak-open-curriculum-chatgpt';
const CODEX_MANIFEST_PATH = `${PACKAGE_ROOT}/.codex-plugin/plugin.json`;
const CLAUDE_MANIFEST_PATH = 'plugins/oak-open-curriculum/.claude-plugin/plugin.json';
const SKILLS_ROOT = `${PACKAGE_ROOT}/skills`;

/** Agent Skills specification: the description a host routes on is at most 1024 characters. */
const MAX_DESCRIPTION_LENGTH = 1024;

/** The fields the two manifests describe the same product with; they drift only by mistake. */
const SharedManifestFieldsSchema = z.object({
  name: z.string().min(1),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  description: z.string().min(1),
  author: z.object({ name: z.string().min(1), url: z.url() }),
  homepage: z.url(),
  repository: z.url(),
  license: z.string().min(1),
  keywords: z.array(z.string().min(1)).min(1),
});

/**
 * The Codex manifest's complete shape. Strict: an unknown top-level key (such
 * as `mcpServers`, `hooks`, or `apps`) fails the parse, so the package cannot
 * grow a declared surface without this test being revisited.
 */
const CodexManifestSchema = SharedManifestFieldsSchema.extend({
  skills: z.literal('./skills/'),
  interface: z
    .object({
      displayName: z.string().min(1),
      shortDescription: z.string().min(1),
      longDescription: z.string().min(1),
      developerName: z.string().min(1),
      category: z.string().min(1),
      capabilities: z.array(z.unknown()),
      websiteURL: z.url(),
      privacyPolicyURL: z.url(),
      termsOfServiceURL: z.url(),
      defaultPrompt: z.array(z.string().min(1).max(128)).max(3),
    })
    .strict(),
}).strict();

/** Everything the package ships at its root; anything else (a stray `.mcp.json`, say) is a packaging defect. */
const SHIPPED_ROOT_ENTRIES = ['.codex-plugin', 'README.md', 'skills'] as const;

const SkillFrontmatterSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
});

async function readJson(repoRelativePath: string): Promise<unknown> {
  return JSON.parse(await readRepoDocument(repoRelativePath));
}

async function readCodexManifest() {
  return CodexManifestSchema.parse(await readJson(CODEX_MANIFEST_PATH));
}

async function readClaudeSharedFields() {
  return SharedManifestFieldsSchema.parse(await readJson(CLAUDE_MANIFEST_PATH));
}

/** The frontmatter block of a skill, parsed as YAML and checked against the contract. */
function parseSkillFrontmatter(skill: string, markdown: string) {
  const split = splitFrontmatter(markdown);
  expect(split, `${skill}/SKILL.md has no frontmatter block`).toBeDefined();
  return SkillFrontmatterSchema.parse(parseYaml(split?.frontmatter ?? ''));
}

/** Every entry under `skills/` must be a skill directory; anything else is a packaging defect. */
async function listShippedSkills(): Promise<readonly string[]> {
  const entries = await listRepoDirectory(SKILLS_ROOT);
  const strays = entries.filter((entry) => entry.kind !== 'directory').map((entry) => entry.name);
  expect(
    strays,
    `non-directory entries under ${SKILLS_ROOT} would be ingested as part of the package`,
  ).toStrictEqual([]);
  const skills = entries.map((entry) => entry.name);
  expect(
    skills,
    `${SKILLS_ROOT} holds no skills — this suite would otherwise pass vacuously`,
  ).not.toHaveLength(0);
  return skills;
}

describe('ChatGPT/Codex package invariants', () => {
  it('declares skills and presentation metadata only, so the manifest names no server, hook or app', async () => {
    // A successful strict parse is the assertion: any other key, at either level, is rejected.
    const manifest = await readCodexManifest();

    expect(manifest.skills).toBe('./skills/');
  });

  it('ships exactly the manifest, the README and the skills at its root, so no companion file can badge it desktop-only', async () => {
    const entries = await listRepoDirectory(PACKAGE_ROOT);

    expect(entries.map((entry) => entry.name)).toStrictEqual(
      [...SHIPPED_ROOT_ENTRIES].sort((a, b) => a.localeCompare(b, 'en')),
    );
  });

  it('declares no capabilities, the value that passed OpenAI ingestion', async () => {
    const manifest = await readCodexManifest();

    expect(
      manifest.interface.capabilities,
      'capabilities: [] is the value the OpenAI sideload accepted on 2026-09-07 (package README); a non-empty value needs a fresh ingestion result recorded there, not removal of this assertion',
    ).toStrictEqual([]);
  });

  it('describes the same product as the Claude manifest, field for field', async () => {
    const codex = await readCodexManifest();
    const claude = await readClaudeSharedFields();

    expect(SharedManifestFieldsSchema.parse(codex)).toStrictEqual(claude);
    expect(codex.interface.longDescription).toBe(codex.description);
  });

  it('gives every shipped skill a frontmatter name matching its directory', async () => {
    const skills = await listShippedSkills();

    const mismatched: string[] = [];
    for (const skill of skills) {
      const frontmatter = parseSkillFrontmatter(
        skill,
        await readRepoDocument(`${SKILLS_ROOT}/${skill}/SKILL.md`),
      );
      if (frontmatter.name !== skill) {
        mismatched.push(`${skill}: name is ${frontmatter.name}`);
      }
    }

    expect(mismatched).toStrictEqual([]);
  });

  it('keeps every shipped skill description within the routing limit', async () => {
    const skills = await listShippedSkills();

    const overLong: string[] = [];
    for (const skill of skills) {
      const frontmatter = parseSkillFrontmatter(
        skill,
        await readRepoDocument(`${SKILLS_ROOT}/${skill}/SKILL.md`),
      );
      if (frontmatter.description.length > MAX_DESCRIPTION_LENGTH) {
        overLong.push(`${skill}: ${frontmatter.description.length} characters`);
      }
    }

    expect(
      overLong,
      `descriptions must be at most ${MAX_DESCRIPTION_LENGTH} characters`,
    ).toStrictEqual([]);
  });
});
