/**
 * Unit tests for the evidence plan.
 *
 * @remarks
 * Each test describes what the retained evidence must look like for one
 * runner result or trace: the copies planned per run, the machine-local
 * paths scrubbed from published text, the final answer lifted from a trace,
 * and the blob id a manifest records. Literal inputs, no IO. The
 * machine-local paths under test are composed at run time so this file
 * carries none itself.
 */

import { unwrapErr, unwrapOrThrow } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { getJsonValue, isJsonObject, parseJsonText } from '../core/json.js';
import {
  finalAnswerOf,
  parseRunnerResult,
  planEvidenceCopies,
  scrubMachinePaths,
} from './evidence.js';
import { blobIdsFromHashObject, manifestText } from './manifest.js';

const segments = (...parts: readonly string[]): string => `/${parts.join('/')}`;

const runnerResult = JSON.stringify({
  claudeVersion: '2.1.283',
  costUsd: 0.2,
  startedAt: '2026-09-27T10:00:00.000Z',
  partial: false,
  cases: [
    {
      name: 'case-01',
      arms: {
        without: [
          { passed: false, score: 0.5, tracePath: '/scratch/e-abc/out/trace.jsonl', graders: [] },
        ],
        with: [
          { passed: true, score: 1, tracePath: '/scratch/e-def/out/trace.jsonl', graders: [] },
          { passed: true, score: 1, tracePath: '', graders: [] },
        ],
      },
      extra: 'carried',
    },
  ],
});

describe('parseRunnerResult', () => {
  it('parses the runner result, keeping fields it does not read', () => {
    const result = unwrapOrThrow(parseRunnerResult(runnerResult));
    expect(result.cases[0]?.arms['with']).toHaveLength(2);
    expect(result.cases[0]?.['extra']).toBe('carried');
  });

  it('refuses a result without cases, naming the boundary', () => {
    expect(unwrapErr(parseRunnerResult(JSON.stringify({ costUsd: 1 }))).message).toContain(
      'runner result',
    );
  });
});

describe('planEvidenceCopies', () => {
  it('plans one trace and one answer per run with a trace, arms in name order', () => {
    expect(planEvidenceCopies(unwrapOrThrow(parseRunnerResult(runnerResult)))).toEqual([
      {
        caseName: 'case-01',
        arm: 'with',
        run: 1,
        tracePath: '/scratch/e-def/out/trace.jsonl',
        traceTarget: 'traces/case-01.with.1.jsonl',
        answerTarget: 'answers/case-01.with.1.md',
      },
      {
        caseName: 'case-01',
        arm: 'without',
        run: 1,
        tracePath: '/scratch/e-abc/out/trace.jsonl',
        traceTarget: 'traces/case-01.without.1.jsonl',
        answerTarget: 'answers/case-01.without.1.md',
      },
    ]);
  });
});

describe('scrubMachinePaths', () => {
  it('replaces the explicit roots, longest first, then the runner workspaces and scaffolds, then home directories', () => {
    const macHome = segments('Users', 'someone', 'x');
    const linuxHome = segments('home', 'other', 'y');
    const workspace = `${segments('private', 'tmp', 'e-Ab12')}${segments('home', 'cwd')}`;
    const scaffoldOut = `${segments('tmp', 'e-Cd34')}/out/trace.jsonl`;
    const text = `plugin at /plugins/root and /plugins/root/evals; workspace ${workspace}/.agent/x; trace ${scaffoldOut}; home ${macHome} and ${linuxHome}`;
    const scrubbed = scrubMachinePaths(text, [
      { from: '/plugins/root', to: '<plugin>' },
      { from: '/plugins/root/evals', to: '<evals>' },
    ]);
    expect(scrubbed).toBe(
      `plugin at <plugin> and <evals>; workspace <workspace>/.agent/x; trace <scaffold>/out/trace.jsonl; home ${segments('Users', '<user>', 'x')} and ${segments('home', '<user>', 'y')}`,
    );
  });

  it('scrubs a home directory without a trailing separator and in the hyphenated project-key form', () => {
    const bareHome = segments('Users', 'someone');
    const key = `-${['Users', 'someone', 'code', 'repo'].join('-')}`;
    const text = `"home":"${bareHome}", key ${key}, end ${bareHome}.`;
    expect(scrubMachinePaths(text, [])).toBe(
      `"home":"${segments('Users', '<user>')}", key -Users-<user>-code-repo, end ${segments('Users', '<user>')}.`,
    );
  });
});

describe('finalAnswerOf', () => {
  it('lifts the result event text from a trace', () => {
    const trace = [
      JSON.stringify({ type: 'system', subtype: 'init' }),
      JSON.stringify({ type: 'assistant', message: {} }),
      JSON.stringify({ type: 'result', result: 'The answer.' }),
    ].join('\n');
    expect(finalAnswerOf(trace)).toBe('The answer.');
  });

  it('is empty when the trace has no result event', () => {
    expect(finalAnswerOf(JSON.stringify({ type: 'system' }))).toBe('');
  });
});

describe('blobIdsFromHashObject', () => {
  const first = 'ce013625030ba8dba906f756967f9e9ca394464a';
  const second = 'e69de29bb2d1d6434b8b29ae775ad8c2e48c5391';

  it.each([
    { name: 'one per line', stdout: `${first}\n${second}` },
    { name: 'CRLF line ends', stdout: `${first}\r\n${second}` },
  ])('reads the ids in path order from $name', ({ stdout }) => {
    expect(blobIdsFromHashObject(stdout, ['a.md', 'b.md'], 'dir')).toStrictEqual({
      ok: true,
      value: [first, second],
    });
  });

  it('refuses a count that differs from the paths, naming both counts', () => {
    const read = blobIdsFromHashObject(first, ['a.md', 'b.md'], 'dir');
    expect(read.ok).toBe(false);
    expect(read.ok ? '' : read.error.message).toContain('1 ids for 2 files');
  });

  it('refuses a line that is no object id, quoting it', () => {
    const read = blobIdsFromHashObject(`${first}\nfatal: bad`, ['a.md', 'b.md'], 'dir');
    expect(read.ok).toBe(false);
    expect(read.ok ? '' : read.error.message).toContain('"fatal: bad"');
  });
});

describe('manifestText', () => {
  it('records the evaluated versions, the runner configuration and each suite', () => {
    const text = manifestText({
      startedAt: '2026-09-27T10:00:00Z',
      repoHead: 'abc123',
      worktreeClean: true,
      agentToolsVersion: '1.2.3',
      skill: {
        hostSkill: 'oak-user-value',
        canonicalRelativeDir: '.agent/skills/planning/user-value',
        canonicalFiles: [{ path: 'SKILL-CANONICAL.md', blob: 'b1' }],
        adapterFiles: [{ path: 'SKILL.md', blob: 'b2' }],
        sharedReferenceFiles: [],
      },
      carried: [
        {
          hostSkill: 'oak-plan',
          canonicalRelativeDir: '.agent/skills/planning/plan',
          canonicalFiles: [{ path: 'SKILL-CANONICAL.md', blob: 'b3' }],
          adapterFiles: [{ path: 'SKILL.md', blob: 'b4' }],
          sharedReferenceFiles: [],
        },
      ],
      runner: 'claude',
      model: undefined,
      judgeModel: 'sonnet',
      suites: [
        {
          suite: 'cases',
          ablation: 'with-without',
          runs: 1,
          cases: ['case-01'],
          ran: ['case-01'],
          command: ['claude', 'plugin', 'eval', '<plugin>'],
          resultFile: 'result-cases.json',
          costUsd: 0.2,
          claudeVersion: '2.1.283',
          partial: false,
        },
      ],
    });
    const manifest = parseJsonText(text, 'manifest');
    expect(isJsonObject(manifest)).toBe(true);
    if (!isJsonObject(manifest)) {
      return;
    }
    expect(getJsonValue(manifest, 'repo_head')).toBe('abc123');
    expect(getJsonValue(manifest, 'worktree_clean')).toBe(true);
    expect(getJsonValue(manifest, 'host_skill')).toBe('oak-user-value');
    expect(getJsonValue(manifest, 'canonical_dir')).toBe('.agent/skills/planning/user-value');
    expect(getJsonValue(manifest, 'carried_skills')).toEqual([
      {
        host_skill: 'oak-plan',
        canonical_dir: '.agent/skills/planning/plan',
        canonical_files: [{ path: 'SKILL-CANONICAL.md', blob: 'b3' }],
        adapter_files: [{ path: 'SKILL.md', blob: 'b4' }],
        shared_reference_files: [],
      },
    ]);
    expect(getJsonValue(manifest, 'plugin_skill_form')).toContain('canonical body');
    expect(getJsonValue(manifest, 'runner')).toEqual({
      command: 'claude',
      model: 'the runner default',
      judge_model: 'sonnet',
    });
    expect(text.endsWith('\n')).toBe(true);
  });
});
