import { describe, expect, it } from 'vitest';

import { readRepoDocument } from '../../src/collaboration-state/test-helpers/repo-doc.js';

/**
 * The two merged ChatGPT skills are derived from Claude agents; this suite
 * recomputes the derivation so neither side can drift silently.
 *
 * @remarks
 * MCP-692. The `audit-sequence` and `find-misconceptions` skills under
 * `plugins/oak-open-curriculum-chatgpt/skills/` are each a Claude agent's body
 * with exactly two additions: an opening paragraph that takes the place of the workflow's
 * `$ARGUMENTS` line (and says to ask when the input is missing), and one
 * sentence appended to the agent's first paragraph carrying the
 * `skills:` dependency the agent frontmatter declared. Everything from the
 * first `##` heading onward must be byte-identical.
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

/** Which Claude agent each merged skill is derived from. */
const DERIVATIONS = [
  { agent: 'sequencing-auditor', skill: 'audit-sequence' },
  { agent: 'misconception-miner', skill: 'find-misconceptions' },
] as const;

/** The declared edits: the sentence each merged skill appends to the agent's first paragraph. */
const DEPENDENCY_SENTENCE =
  /^ Apply Oak's six curriculum principles as background where they bear on .+ — the `oak-curriculum-principles` skill holds them in full\.$/;

interface SplitBody {
  /** Paragraphs before the first `##` heading. */
  readonly head: readonly string[];
  /** Everything from the first `##` heading to the end. */
  readonly sections: string;
}

function stripFrontmatter(markdown: string): string {
  const stripped = markdown.replace(/^---\n[\s\S]*?\n---\n/, '');
  expect(stripped, 'document has no frontmatter block').not.toBe(markdown);
  return stripped;
}

function splitBody(body: string): SplitBody {
  const index = body.indexOf('\n## ');
  expect(index, 'body has no `##` section').toBeGreaterThan(-1);
  const head = body
    .slice(0, index)
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);
  return { head, sections: body.slice(index) };
}

async function readPair(agent: string, skill: string) {
  const [agentBody, skillBody] = await Promise.all([
    readRepoDocument(`${AGENTS_ROOT}/${agent}.md`),
    readRepoDocument(`${SKILLS_ROOT}/${skill}/SKILL.md`),
  ]);
  return {
    agent: splitBody(stripFrontmatter(agentBody)),
    skill: splitBody(stripFrontmatter(skillBody)),
  };
}

describe.each(DERIVATIONS)('merged skill $skill derives from agent $agent', ({ agent, skill }) => {
  it('carries every section of the agent byte for byte', async () => {
    const pair = await readPair(agent, skill);

    expect(pair.skill.sections).toBe(pair.agent.sections);
  });

  it('opens with an ask-if-missing paragraph the agent does not have, then the agent’s own opening', async () => {
    const pair = await readPair(agent, skill);

    expect(pair.agent.head).toHaveLength(1);
    expect(pair.skill.head).toHaveLength(2);
    expect(pair.skill.head[0]).toMatch(/ask/i);
    expect(pair.skill.head[1]?.startsWith(pair.agent.head[0] ?? '')).toBe(true);
  });

  it('adds only the declared dependency sentence to the agent’s opening paragraph', async () => {
    const pair = await readPair(agent, skill);

    const appended = (pair.skill.head[1] ?? '').slice((pair.agent.head[0] ?? '').length);
    expect(appended).toMatch(DEPENDENCY_SENTENCE);
  });
});
