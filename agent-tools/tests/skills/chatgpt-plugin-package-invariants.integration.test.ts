import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import {
  listRepoDirectory,
  readRepoDocument,
  repoPathExists,
} from '../../src/collaboration-state/test-helpers/repo-doc.js';
import { parseFrontmatter } from '../../src/skills-adapter-generate/discovery.js';

/**
 * The ChatGPT/Codex package's shipped invariants, recomputed from the tree.
 *
 * @remarks
 * MCP-692. `plugins/oak-open-curriculum-chatgpt/` is what OpenAI ingests, and
 * two of its properties were checked by hand at submission and recorded in
 * the PR body only: there is no `.mcp.json` (bundling a server badges the
 * plugin "desktop only"), and `interface.capabilities` is `[]` (the value
 * that passed ingestion on 2026-09-07). This suite recomputes both on every
 * run, and with them the manifest fields that must agree with the Claude
 * manifest and the frontmatter contract every shipped skill must meet.
 *
 * Learned from MCP-509: a guard that reads an absent value asserts nothing.
 * The manifest is parsed through a schema so a shape change fails loudly,
 * and the skill scan refuses an empty directory rather than passing
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

const CodexManifestSchema = SharedManifestFieldsSchema.extend({
  skills: z.literal('./skills/'),
  interface: z.object({
    displayName: z.string().min(1),
    shortDescription: z.string().min(1),
    longDescription: z.string().min(1),
    capabilities: z.array(z.unknown()),
  }),
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

async function listShippedSkills(): Promise<readonly string[]> {
  const entries = await listRepoDirectory(SKILLS_ROOT);
  const skills = entries.filter((name) => !name.startsWith('.'));
  expect(
    skills,
    `${SKILLS_ROOT} holds no skills — this suite would otherwise pass vacuously`,
  ).not.toHaveLength(0);
  return skills;
}

describe('ChatGPT/Codex package invariants', () => {
  it('declares no capabilities, the value that passed OpenAI ingestion', async () => {
    const manifest = await readCodexManifest();

    expect(manifest.interface.capabilities).toStrictEqual([]);
  });

  it('bundles no MCP server, so the plugin is not badged desktop-only', async () => {
    expect(await repoPathExists(`${PACKAGE_ROOT}/.mcp.json`)).toBe(false);
  });

  it('describes the same product as the Claude manifest, field for field', async () => {
    const codex = await readCodexManifest();
    const claude = await readClaudeSharedFields();

    expect(SharedManifestFieldsSchema.parse(codex)).toStrictEqual(claude);
    expect(codex.interface.longDescription).toBe(codex.description);
  });

  it('gives every shipped skill a frontmatter name matching its directory', async () => {
    const skills = await listShippedSkills();

    for (const skill of skills) {
      const frontmatter = parseFrontmatter(
        await readRepoDocument(`${SKILLS_ROOT}/${skill}/SKILL.md`),
      );

      expect(
        frontmatter,
        `${skill}/SKILL.md has no parseable name/description frontmatter`,
      ).toBeDefined();
      expect(frontmatter?.name).toBe(skill);
    }
  });

  it('keeps every shipped skill description within the routing limit', async () => {
    const skills = await listShippedSkills();

    const overLong = [];
    for (const skill of skills) {
      const frontmatter = parseFrontmatter(
        await readRepoDocument(`${SKILLS_ROOT}/${skill}/SKILL.md`),
      );
      const length = frontmatter?.description.length ?? 0;
      if (length === 0 || length > MAX_DESCRIPTION_LENGTH) {
        overLong.push(`${skill}: ${length} characters`);
      }
    }

    expect(overLong, `descriptions must be 1–${MAX_DESCRIPTION_LENGTH} characters`).toStrictEqual(
      [],
    );
  });
});
