/**
 * Unit tests for the eval-suite projection.
 *
 * @remarks
 * Each test describes the file set the runner must find for one fixture
 * shape: the case files, their frontmatter, and the paired graders, with
 * the workspace left empty. Literal inputs, no IO.
 */

import { unwrapErr, unwrapOrThrow } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import {
  projectSuite,
  projectedCaseNames,
  type ProjectedFile,
  type ProjectionInput,
} from './project.js';

const input: ProjectionInput = {
  fixture: {
    skill_name: 'user-value',
    evals: [
      {
        id: 3,
        prompt: 'Implement a stable priority queue over a tested heap.',
        expected_output: 'Routes settled implementation to engineering methods.',
        assertions: [
          'No fictional human user is introduced',
          'No value-definition pass is required',
        ],
      },
    ],
  },
  triggers: [
    { query: 'Rework these stories into needs.', should_trigger: true },
    { query: 'Schedule the approved tasks.', should_trigger: false },
  ],
  skill: {
    name: 'user-value',
    hostSkill: 'oak-user-value',
    canonicalRelativeDir: '.agent/skills/planning/user-value',
  },
  carried: [],
  maxTurns: 12,
  timeoutSeconds: 600,
  triggerMaxTurns: 4,
};

const plan = {
  name: 'plan',
  hostSkill: 'oak-plan',
  canonicalRelativeDir: '.agent/skills/planning/plan',
};

/** The input with a carried skill and a case that expects to reach it. */
const handoff: ProjectionInput = {
  ...input,
  fixture: {
    skill_name: 'user-value',
    evals: [
      {
        id: 4,
        prompt: 'Define the value, then plan the delivery.',
        expected_output: 'A value model handed to the plan.',
        assertions: ['The plan consumes the value model'],
        skills_expected: ['user-value', 'plan'],
      },
    ],
  },
  carried: [plan],
};

function fileAt(files: readonly ProjectedFile[], path: string): ProjectedFile {
  const found = files.find((candidate) => candidate.path === path);
  expect(found, path).toBeDefined();
  return found ?? { path, content: '', executable: false };
}

describe('projectSuite', () => {
  it('projects one case and two trigger examples into the runner layout, in path order', () => {
    const paths = unwrapOrThrow(projectSuite(input)).map((projected) => projected.path);
    expect(paths).toEqual([
      'evals/case-03/case.yaml',
      'evals/case-03/graders/assertions.md',
      'evals/case-03/graders/skill-files-readable.md',
      'evals/case-03/graders/skill-fired.md',
      'evals/case-03/prompt.md',
      'evals/trigger-01-fires/case.yaml',
      'evals/trigger-01-fires/graders/skill-files-readable.md',
      'evals/trigger-01-fires/graders/skill-fired.md',
      'evals/trigger-01-fires/prompt.md',
      'evals/trigger-02-silent/case.yaml',
      'evals/trigger-02-silent/graders/skill-files-readable.md',
      'evals/trigger-02-silent/graders/skill-silent.md',
      'evals/trigger-02-silent/prompt.md',
    ]);
  });

  it('writes the prompt with the run limits in its frontmatter and the prompt as its body', () => {
    const files = unwrapOrThrow(projectSuite(input));
    const prompt = fileAt(files, 'evals/case-03/prompt.md').content;
    const [frontmatter, body] = prompt.split('\n---\n\n');
    expect(frontmatter).toContain('name: case-03');
    expect(frontmatter).toContain('max_turns: 12');
    expect(frontmatter).toContain('timeout_seconds: 600');
    expect(frontmatter).toContain('allowed_tools: [Read, Glob, Grep, Skill]');
    expect(body).toBe('Implement a stable priority queue over a tested heap.\n');
    expect(fileAt(files, 'evals/trigger-01-fires/prompt.md').content).toContain('max_turns: 4');
  });

  it('leaves the workspace empty: no scaffold, a case context of the name alone', () => {
    const files = unwrapOrThrow(projectSuite(input));
    expect(files.some((projected) => projected.executable)).toBe(false);
    expect(fileAt(files, 'evals/case-03/case.yaml').content).toBe(
      'schema_version: "1.1"\nname: case-03\n',
    );
  });

  it('anchors the skill-fired indicator so a longer skill name never counts, and pairs it with the readable check', () => {
    const files = unwrapOrThrow(projectSuite(input));
    const fired = fileAt(files, 'evals/case-03/graders/skill-fired.md').content;
    expect(fired).toContain('type: tool_used');
    expect(fired).toContain('tool: Skill');
    expect(fired).toContain('input_match: "oak-user-value(?![a-z0-9-])"');
    const readable = fileAt(files, 'evals/case-03/graders/skill-files-readable.md').content;
    expect(readable).toContain('type: regex');
    expect(readable).toContain('target: trace');
    expect(readable).toContain('match: not_contains');
    expect(readable).toContain(
      "pattern: 'Permission to read [^ ]*/skills/(oak-user-value)/[^ ]* has been denied'",
    );
  });

  it('gives the judge the expected outcome and every assertion, numbered, and when absence of the method is correct', () => {
    const rubric = fileAt(
      unwrapOrThrow(projectSuite(input)),
      'evals/case-03/graders/assertions.md',
    ).content;
    expect(rubric).toContain('type: llm');
    expect(rubric).toContain(
      'Expected outcome: Routes settled implementation to engineering methods.',
    );
    expect(rubric).toContain('1. No fictional human user is introduced');
    expect(rubric).toContain('2. No value-definition pass is required');
    expect(rubric).toContain('present in substance');
  });

  it('grades a negative trigger example by the Skill tool never being called with the host skill, so a carried sibling may take it', () => {
    const silent = fileAt(
      unwrapOrThrow(projectSuite(input)),
      'evals/trigger-02-silent/graders/skill-silent.md',
    ).content;
    expect(silent).toContain('tool: Skill');
    expect(silent).toContain('input_match: "oak-user-value(?![a-z0-9-])"');
    expect(silent).toContain('min: 0');
    expect(silent).toContain('max: 0');
  });

  it('adds a fired indicator per carried skill a case expects, and names every carried skill in the readable check', () => {
    const files = unwrapOrThrow(projectSuite(handoff));
    const paths = files.map((projected) => projected.path);
    expect(paths).toContain('evals/case-04/graders/skill-fired.md');
    expect(paths).toContain('evals/case-04/graders/skill-fired-oak-plan.md');
    expect(paths).not.toContain('evals/case-04/graders/skill-fired-oak-user-value.md');
    expect(fileAt(files, 'evals/case-04/graders/skill-fired-oak-plan.md').content).toContain(
      'input_match: "oak-plan(?![a-z0-9-])"',
    );
    expect(
      fileAt(files, 'evals/trigger-01-fires/graders/skill-files-readable.md').content,
    ).toContain('/skills/(oak-user-value|oak-plan)/');
  });

  it('refuses a case that expects a skill the plugin does not carry, naming the case and the skill', () => {
    expect(unwrapErr(projectSuite({ ...handoff, carried: [] })).message).toContain(
      "case 4 expects skill 'plan'",
    );
  });

  it('refuses a carried skill whose name or host name repeats another', () => {
    expect(
      unwrapErr(projectSuite({ ...input, carried: [{ ...plan, hostSkill: 'oak-user-value' }] }))
        .message,
    ).toContain('distinct names');
    expect(
      unwrapErr(projectSuite({ ...input, carried: [{ ...plan, name: 'user-value' }] })).message,
    ).toContain('distinct names');
  });

  it('refuses a host skill name the Skill tool would not match, on the skill under evaluation or a carried one', () => {
    const skill = { ...input.skill, hostSkill: 'Oak User Value' };
    expect(unwrapErr(projectSuite({ ...input, skill })).message).toContain('host skill name');
    expect(
      unwrapErr(projectSuite({ ...input, carried: [{ ...plan, hostSkill: 'Oak Plan' }] })).message,
    ).toContain('host skill name');
  });

  it('refuses a canonical directory that is not a normalised path relative to the repository root', () => {
    for (const dir of [
      '/abs/user-value',
      '../user-value',
      './user-value',
      'user-value/',
      'a/../b',
    ]) {
      const skill = { ...input.skill, canonicalRelativeDir: dir };
      expect(unwrapErr(projectSuite({ ...input, skill })).message).toContain('normalised path');
    }
  });
});

describe('projectedCaseNames', () => {
  it('names exactly the case directories the projection emits, in the same order', () => {
    const emitted = unwrapOrThrow(projectSuite(input)).map(
      (projected) => projected.path.split('/')[1] ?? '',
    );
    expect(projectedCaseNames(input)).toEqual([...new Set(emitted)]);
  });
});
