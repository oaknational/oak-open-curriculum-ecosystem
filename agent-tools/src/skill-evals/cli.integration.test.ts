/**
 * Integration tests for the skill-evals CLI.
 *
 * @remarks
 * Each test describes one invocation's user-facing outcome: the exit code
 * (0 done, 1 a named refusal, 2 usage), what stdout and stderr carry, and
 * that help and usage errors touch no seam. Driven through the in-memory
 * seams and the unified agent-tools topic surface; no real IO.
 */

import { describe, expect, it } from 'vitest';

import { getJsonValue, isJsonObject, parseJsonText } from '../core/json.js';
import { runSkillEvalsTopic } from '../bin/agent-tools-cli-topics.js';
import { USAGE } from './args.js';
import { runSkillEvalsCli } from './cli.js';
import { capture, harness, REPO, refusingSeams } from './test-helpers/in-memory-seams.js';

const RUN = [
  'run',
  '--skill',
  '.agent/skills/planning/user-value',
  '--host-skill',
  'oak-user-value',
];

describe('runSkillEvalsCli', () => {
  it('prints usage and exits 0 on --help, touching no seam', () => {
    const stdout = capture();
    const stderr = capture();
    const code = runSkillEvalsCli({
      args: ['--help'],
      repoRoot: REPO,
      stdout,
      stderr,
      seams: refusingSeams(),
    });
    expect(code).toBe(0);
    expect(stdout.text()).toBe(`${USAGE}\n`);
    expect(stderr.text()).toBe('');
  });

  it('names a usage error on stderr, exits 2 and runs nothing', () => {
    const h = harness();
    const stdout = capture();
    const stderr = capture();
    const code = runSkillEvalsCli({
      args: ['run', '--skill', 'a'],
      repoRoot: REPO,
      stdout,
      stderr,
      seams: h.seams,
    });
    expect(code).toBe(2);
    expect(stderr.text()).toContain('--host-skill');
    expect(h.runs).toEqual([]);
  });

  it('reports each suite and the evidence directory, exit 0', () => {
    const h = harness();
    const stdout = capture();
    const stderr = capture();
    const code = runSkillEvalsCli({ args: RUN, repoRoot: REPO, stdout, stderr, seams: h.seams });
    expect(code).toBe(0);
    expect(stderr.text()).toBe('');
    expect(stdout.text()).toContain('cases: 1 cases, ablation with-without, USD 0.50');
    expect(stdout.text()).toContain('triggers: 1 cases, ablation none');
    expect(stdout.text()).toContain(
      `evidence: ${REPO}/.agent/skills/planning/user-value/evals/results/2026-09-27T11-05-00Z`,
    );
  });

  it('with --json, writes the run summary as JSON on stdout', () => {
    const h = harness();
    const stdout = capture();
    const code = runSkillEvalsCli({
      args: [...RUN, '--json'],
      repoRoot: REPO,
      stdout,
      stderr: capture(),
      seams: h.seams,
    });
    expect(code).toBe(0);
    const summary = parseJsonText(stdout.text(), 'summary');
    expect(isJsonObject(summary)).toBe(true);
    if (isJsonObject(summary)) {
      expect(getJsonValue(summary, 'outDir')).toBe(
        `${REPO}/.agent/skills/planning/user-value/evals/results/2026-09-27T11-05-00Z`,
      );
    }
  });

  it('names an operational refusal on stderr and exits 1', () => {
    const h = harness(1);
    const stderr = capture();
    const code = runSkillEvalsCli({
      args: RUN,
      repoRoot: REPO,
      stdout: capture(),
      stderr,
      seams: h.seams,
    });
    expect(code).toBe(1);
    expect(stderr.text()).toContain('claude exited 1');
  });

  it('refuses to run when the agent-tools package version cannot be read, before any runner invocation', () => {
    const h = harness();
    h.files.delete(`${REPO}/agent-tools/package.json`);
    const stderr = capture();
    const code = runSkillEvalsCli({
      args: RUN,
      repoRoot: REPO,
      stdout: capture(),
      stderr,
      seams: h.seams,
    });
    expect(code).toBe(1);
    expect(stderr.text()).toContain('agent-tools/package.json');
    expect(h.runs).toEqual([]);
  });

  it('projects to --out and reports the count, exit 0', () => {
    const h = harness();
    const stdout = capture();
    const code = runSkillEvalsCli({
      args: [
        'project',
        '--skill',
        '.agent/skills/planning/user-value',
        '--host-skill',
        'oak-user-value',
        '--out',
        '/scratch/x',
      ],
      repoRoot: REPO,
      stdout,
      stderr: capture(),
      seams: h.seams,
    });
    expect(code).toBe(0);
    expect(stdout.text()).toMatch(/^projected \d+ files to \/scratch\/x\n$/u);
    expect(h.runs).toEqual([]);
  });
});

describe('the unified topic surface', () => {
  it('registers skill-evals and answers help through it', () => {
    const result = runSkillEvalsTopic({ argv: [], env: {}, cwd: '/x', repoRoot: REPO }, ['--help']);
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toBe(`${USAGE}\n`);
  });
});
