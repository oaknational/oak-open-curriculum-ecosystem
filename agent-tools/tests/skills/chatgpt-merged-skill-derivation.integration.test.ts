import { describe, expect, it } from 'vitest';
import { parse as parseYaml } from 'yaml';
import { z } from 'zod';

import {
  splitFrontmatter as splitDocument,
  type SplitDocument,
} from '../../src/collaboration-state/test-helpers/frontmatter.js';
import {
  listRepoDirectory,
  readRepoDocument,
} from '../../src/collaboration-state/test-helpers/repo-doc.js';

/**
 * The merged ChatGPT skills are derived from Claude workflow+agent pairs; this
 * suite recomputes the derivation so neither side can drift silently, and it
 * covers every copy-only skill the package holds, not a fixed list.
 *
 * @remarks
 * MCP-692. A copy-only skill is one under `plugins/oak-open-curriculum-chatgpt/skills/`
 * with no same-named directory under the Claude plugin's `skills/`. Each must
 * derive from the same-named Claude workflow (whose "Delegate to" line names
 * the agent) and carry that agent's body byte-identical from its first `##`
 * heading onward. Before that heading the merged skill has exactly two
 * paragraphs: an opening paragraph that replaces the workflow's `$ARGUMENTS`
 * line and says to ask when the input is missing, then the agent's own opening
 * paragraph with one sentence appended that carries the dependency the agent's
 * `skills:` frontmatter declares. Its description is the workflow's, word for
 * word. The rest of the frontmatter differs by design (licence, compatibility,
 * metadata) and is governed by the package-invariants suite.
 *
 * The two authored edits (the opening paragraph, and the phrase the dependency
 * sentence bears on) are declared per skill below. A copy-only skill without a
 * declaration fails the coverage test, so nothing derives unchecked; the
 * skill-copy validator separately requires the same-named workflow to exist.
 *
 * ADR-078 helper-mediated committed-artefact reads.
 */

const CLAUDE_SKILLS_ROOT = 'plugins/oak-open-curriculum/skills';
const AGENTS_ROOT = 'plugins/oak-open-curriculum/agents';
const WORKFLOWS_ROOT = 'plugins/oak-open-curriculum/workflows';
const SKILLS_ROOT = 'plugins/oak-open-curriculum-chatgpt/skills';

/** The authored edits each merged skill declares; every copy-only skill must have an entry. */
const DECLARED_EDITS = {
  'audit-sequence': {
    opening:
      'Audit the draft sequence the user has shared. If they have not given you one, ask for it before going further.',
    bearsOn: 'sequencing',
  },
  'find-misconceptions': {
    opening:
      'Find the misconceptions for the topic the user has named. If they have not said which year group or key stage, ask before going further.',
    bearsOn: 'the teaching response',
  },
} as const;

const DERIVATIONS = Object.entries(DECLARED_EDITS).map(([skill, edits]) => ({ skill, ...edits }));

const AgentFrontmatterSchema = z.object({ skills: z.string().min(1) });
const DescriptionSchema = z.object({ description: z.string().min(1) });
/** The workflow names its agent on one line: `Delegate to the **<agent>** agent.` */
const DELEGATE_LINE = /^Delegate to the \*\*([a-z0-9-]+)\*\* agent\.$/m;

interface SplitBody {
  /** Paragraphs before the first `##` heading. */
  readonly head: readonly string[];
  /** Everything from the first `##` heading to the end. */
  readonly sections: string;
}

/** The shared splitter, with the missing-fence case turned into a named failure here. */
function splitFrontmatter(markdown: string): SplitDocument {
  const split = splitDocument(markdown);
  expect(split, 'document has no frontmatter block').toBeDefined();
  return split ?? { frontmatter: '', body: markdown };
}

function splitBody(body: string): SplitBody {
  const index = body.search(/^## /m);
  expect(index, 'body has no `##` section').toBeGreaterThan(-1);
  const head = body
    .slice(0, index)
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);
  return { head, sections: body.slice(index) };
}

async function readDescription(repoRelativePath: string): Promise<string> {
  const { frontmatter } = splitFrontmatter(await readRepoDocument(repoRelativePath));
  return DescriptionSchema.parse(parseYaml(frontmatter)).description;
}

/** The copy-only skills: package skill directories with no same-named Claude skill directory. */
async function listCopyOnlySkills(): Promise<readonly string[]> {
  const [packaged, claude] = await Promise.all([
    listRepoDirectory(SKILLS_ROOT),
    listRepoDirectory(CLAUDE_SKILLS_ROOT),
  ]);
  const claudeNames = new Set(claude.map((entry) => entry.name));
  return packaged
    .filter((entry) => entry.kind === 'directory' && !claudeNames.has(entry.name))
    .map((entry) => entry.name);
}

/** The agent a workflow delegates to, read from the workflow itself. */
async function readDelegatedAgent(skill: string): Promise<string> {
  const { body } = splitFrontmatter(await readRepoDocument(`${WORKFLOWS_ROOT}/${skill}/SKILL.md`));
  const match = DELEGATE_LINE.exec(body);
  expect(
    match,
    `${skill} workflow has no "Delegate to the **<agent>** agent." line`,
  ).not.toBeNull();
  return match?.[1] ?? '';
}

async function readPair(skill: string) {
  const agent = await readDelegatedAgent(skill);
  const [agentDocument, skillDocument] = await Promise.all([
    readRepoDocument(`${AGENTS_ROOT}/${agent}.md`),
    readRepoDocument(`${SKILLS_ROOT}/${skill}/SKILL.md`),
  ]);
  const agentParts = splitFrontmatter(agentDocument);
  return {
    agentName: agent,
    dependency: AgentFrontmatterSchema.parse(parseYaml(agentParts.frontmatter)).skills,
    agent: splitBody(agentParts.body),
    skill: splitBody(splitFrontmatter(skillDocument).body),
  };
}

describe('copy-only skills are all covered by a declared derivation', () => {
  it('declares edits for exactly the copy-only skills the package holds', async () => {
    const copyOnly = await listCopyOnlySkills();

    expect(
      copyOnly.length,
      'no copy-only skills found — this suite would otherwise pass vacuously',
    ).toBeGreaterThan(0);
    expect([...copyOnly].sort((a, b) => a.localeCompare(b, 'en'))).toStrictEqual(
      Object.keys(DECLARED_EDITS).sort((a, b) => a.localeCompare(b, 'en')),
    );
  });
});

describe.each(DERIVATIONS)(
  'merged skill $skill derives from its Claude workflow and agent',
  ({ skill, opening, bearsOn }) => {
    it('carries every section of the delegated agent byte for byte', async () => {
      const pair = await readPair(skill);

      expect(pair.skill.sections).toBe(pair.agent.sections);
    });

    it('opens with the declared ask-if-missing paragraph, then the agent’s opening plus the dependency sentence', async () => {
      const pair = await readPair(skill);

      expect(pair.agent.head).toHaveLength(1);
      const dependencySentence = `Apply Oak's six curriculum principles as background where they bear on ${bearsOn} — the \`${pair.dependency}\` skill holds them in full.`;
      expect(pair.skill.head).toStrictEqual([
        opening,
        `${pair.agent.head[0]} ${dependencySentence}`,
      ]);
    });

    it('carries the Claude workflow’s description word for word, so both plugins route alike', async () => {
      const [workflow, merged] = await Promise.all([
        readDescription(`${WORKFLOWS_ROOT}/${skill}/SKILL.md`),
        readDescription(`${SKILLS_ROOT}/${skill}/SKILL.md`),
      ]);

      expect(merged).toBe(workflow);
    });
  },
);
