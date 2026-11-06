import { describe, expect, it } from 'vitest';

import {
  commitSkillAdvisoryChecks,
  runCommitSkillAdvisories,
} from './check-commit-skill-advisories.js';

const passingCheck = async (): Promise<{ exitCode: number; stderr: string }> => ({
  exitCode: 0,
  stderr: '',
});

describe('commitSkillAdvisoryChecks', () => {
  // The sentinel: a subject whose quote would let Windows' cmd.exe, reading a
  // pnpm.cmd shim's arguments a second time, run what follows the ampersand.
  const hostileSubject = 'fix(scope): a" & echo injected & "';

  it('puts no argument it was given on the command line of a launched check', async () => {
    const checks = commitSkillAdvisoryChecks(['-m', hostileSubject], {
      // A launched check's output is its own command line, so any argument
      // that reaches one shows in the results.
      runPnpm: async (args) => ({ exitCode: 0, stderr: args.join(' ') }),
      checkMessage: () => 0,
    });

    const results = [
      await checks.fitnessCheck(),
      await checks.vocabularyCheck(),
      await checks.messageCheck(),
    ];

    expect(results.map((result) => result.stderr).join('\n')).not.toContain(hostileSubject);
  });

  it("answers the message advisory with the in-process check's verdict", async () => {
    const checks = commitSkillAdvisoryChecks(['-m', hostileSubject], {
      runPnpm: passingCheck,
      checkMessage: () => 1,
    });

    expect(await checks.messageCheck()).toStrictEqual({ exitCode: 1, stderr: '' });
  });
});

describe('runCommitSkillAdvisories', () => {
  it('returns the fitness advisory failure when the fitness check exits non-zero', async () => {
    const result = await runCommitSkillAdvisories({
      fitnessCheck: async () => ({ exitCode: 1, stderr: 'fitness violations detected' }),
      vocabularyCheck: passingCheck,
      messageCheck: passingCheck,
    });

    expect(result).toStrictEqual({
      ok: false,
      failedCheck: 'fitness',
      exitCode: 1,
      stderr: 'fitness violations detected',
    });
  });

  it('returns the vocabulary advisory failure when fitness passes but vocabulary fails', async () => {
    const result = await runCommitSkillAdvisories({
      fitnessCheck: passingCheck,
      vocabularyCheck: async () => ({ exitCode: 1, stderr: 'retired vocabulary present' }),
      messageCheck: passingCheck,
    });

    expect(result).toStrictEqual({
      ok: false,
      failedCheck: 'vocabulary',
      exitCode: 1,
      stderr: 'retired vocabulary present',
    });
  });

  it('returns the message-check failure when both tree-state advisories pass', async () => {
    const result = await runCommitSkillAdvisories({
      fitnessCheck: passingCheck,
      vocabularyCheck: passingCheck,
      messageCheck: async () => ({ exitCode: 1, stderr: 'subject must start lowercase' }),
    });

    expect(result).toStrictEqual({
      ok: false,
      failedCheck: 'message',
      exitCode: 1,
      stderr: 'subject must start lowercase',
    });
  });

  it('returns ok when all three advisory checks pass', async () => {
    const result = await runCommitSkillAdvisories({
      fitnessCheck: passingCheck,
      vocabularyCheck: passingCheck,
      messageCheck: passingCheck,
    });

    expect(result).toStrictEqual({ ok: true });
  });

  it('runs the fitness check before the vocabulary check', async () => {
    const callOrder: string[] = [];
    await runCommitSkillAdvisories({
      fitnessCheck: async () => {
        callOrder.push('fitness');
        return { exitCode: 0, stderr: '' };
      },
      vocabularyCheck: async () => {
        callOrder.push('vocabulary');
        return { exitCode: 0, stderr: '' };
      },
      messageCheck: async () => {
        callOrder.push('message');
        return { exitCode: 0, stderr: '' };
      },
    });

    expect(callOrder).toStrictEqual(['fitness', 'vocabulary', 'message']);
  });

  it('does not invoke later advisory checks after a failure short-circuits', async () => {
    const callOrder: string[] = [];
    const result = await runCommitSkillAdvisories({
      fitnessCheck: async () => {
        callOrder.push('fitness');
        return { exitCode: 2, stderr: 'fitness loop failure signal' };
      },
      vocabularyCheck: async () => {
        callOrder.push('vocabulary');
        return { exitCode: 0, stderr: '' };
      },
      messageCheck: async () => {
        callOrder.push('message');
        return { exitCode: 0, stderr: '' };
      },
    });

    expect(callOrder).toStrictEqual(['fitness']);
    expect(result).toStrictEqual({
      ok: false,
      failedCheck: 'fitness',
      exitCode: 2,
      stderr: 'fitness loop failure signal',
    });
  });
});
