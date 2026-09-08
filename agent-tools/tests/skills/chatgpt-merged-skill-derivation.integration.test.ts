import { describe, expect, it } from 'vitest';
import { parse as parseYaml } from 'yaml';
import { z } from 'zod';

import { readRepoDocument } from '../../src/collaboration-state/test-helpers/repo-doc.js';

/**
 * The two merged ChatGPT skills are derived from Claude agents; this suite
 * recomputes the derivation so neither side can drift silently.
 *
 * @remarks
 * MCP-692. The `audit-sequence` and `find-misconceptions` skills under
 * `plugins/oak-open-curriculum-chatgpt/skills/` each carry a Claude agent's
 * body byte-identical from its first `##` heading onward. Before that heading
 * the merged skill has exactly two paragraphs: an opening paragraph that
 * replaces the workflow's `$ARGUMENTS` line and says to ask when the input is
 * missing, then the agent's own opening paragraph with one sentence appended
 * that carries the dependency the agent's `skills:` frontmatter declares. The
 * frontmatter itself differs by design (description, licence, compatibility,
 * metadata) and is governed by the package-invariants suite, not here.
 *
 * The copy validator cannot see these two skills (they exist only in the
 * ChatGPT package), so this is their drift gate. It runs in both directions:
 * an agent edit that never reached the merged skill fails, and so does a fix
 * made to the merged skill directly, because the Claude plugin is the source
 * and corrections land there first (package README).
 *
 * ADR-078 helper-mediated committed-artefact reads.
 */

const AGENTS_ROOT = 'plugins/oak-open-curriculum/agents';
const SKILLS_ROOT = 'plugins/oak-open-curriculum-chatgpt/skills';

/**
 * Each merged skill, the agent it derives from, and the two declared edits:
 * the literal opening paragraph, and the phrase the dependency sentence bears
 * on (the sentence's remaining words are fixed below).
 */
const DERIVATIONS = [
  {
    agent: 'sequencing-auditor',
    skill: 'audit-sequence',
    opening:
      'Audit the draft sequence the user has shared. If they have not given you one, ask for it before going further.',
    bearsOn: 'sequencing',
  },
  {
    agent: 'misconception-miner',
    skill: 'find-misconceptions',
    opening:
      'Find the misconceptions for the topic the user has named. If they have not said which year group or key stage, ask before going further.',
    bearsOn: 'the teaching response',
  },
] as const;

const AgentFrontmatterSchema = z.object({ skills: z.string().min(1) });

interface SplitBody {
  /** Paragraphs before the first `##` heading. */
  readonly head: readonly string[];
  /** Everything from the first `##` heading to the end. */
  readonly sections: string;
}

function splitFrontmatter(markdown: string): {
  readonly frontmatter: string;
  readonly body: string;
} {
  const fence = /^---\n([\s\S]*?)\n---\n/.exec(markdown);
  expect(fence, 'document has no frontmatter block').not.toBeNull();
  return { frontmatter: fence?.[1] ?? '', body: markdown.slice(fence?.[0].length ?? 0) };
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

async function readPair(agent: string, skill: string) {
  const [agentDocument, skillDocument] = await Promise.all([
    readRepoDocument(`${AGENTS_ROOT}/${agent}.md`),
    readRepoDocument(`${SKILLS_ROOT}/${skill}/SKILL.md`),
  ]);
  const agentParts = splitFrontmatter(agentDocument);
  return {
    dependency: AgentFrontmatterSchema.parse(parseYaml(agentParts.frontmatter)).skills,
    agent: splitBody(agentParts.body),
    skill: splitBody(splitFrontmatter(skillDocument).body),
  };
}

describe.each(DERIVATIONS)(
  'merged skill $skill derives from agent $agent',
  ({ agent, skill, opening, bearsOn }) => {
    it('carries every section of the agent byte for byte', async () => {
      const pair = await readPair(agent, skill);

      expect(pair.skill.sections).toBe(pair.agent.sections);
    });

    it('opens with the declared ask-if-missing paragraph, then the agent’s opening plus the dependency sentence', async () => {
      const pair = await readPair(agent, skill);

      expect(pair.agent.head).toHaveLength(1);
      const dependencySentence = `Apply Oak's six curriculum principles as background where they bear on ${bearsOn} — the \`${pair.dependency}\` skill holds them in full.`;
      expect(pair.skill.head).toStrictEqual([
        opening,
        `${pair.agent.head[0]} ${dependencySentence}`,
      ]);
    });
  },
);
