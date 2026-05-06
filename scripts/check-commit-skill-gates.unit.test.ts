import { describe, expect, it } from 'vitest';

import { runCommitSkillGates } from './check-commit-skill-gates.js';

const passingGate = async (): Promise<{ exitCode: number; stderr: string }> => ({
  exitCode: 0,
  stderr: '',
});

describe('runCommitSkillGates', () => {
  it('returns the fitness gate failure when the fitness gate exits non-zero', async () => {
    const result = await runCommitSkillGates({
      fitnessGate: async () => ({ exitCode: 1, stderr: 'fitness violations detected' }),
      vocabularyGate: passingGate,
      messageCheck: passingGate,
    });

    expect(result).toStrictEqual({
      ok: false,
      failedGate: 'fitness',
      exitCode: 1,
      stderr: 'fitness violations detected',
    });
  });

  it('returns the vocabulary gate failure when fitness passes but vocabulary fails', async () => {
    const result = await runCommitSkillGates({
      fitnessGate: passingGate,
      vocabularyGate: async () => ({ exitCode: 1, stderr: 'retired vocabulary present' }),
      messageCheck: passingGate,
    });

    expect(result).toStrictEqual({
      ok: false,
      failedGate: 'vocabulary',
      exitCode: 1,
      stderr: 'retired vocabulary present',
    });
  });

  it('returns the message-check failure when both tree-state gates pass', async () => {
    const result = await runCommitSkillGates({
      fitnessGate: passingGate,
      vocabularyGate: passingGate,
      messageCheck: async () => ({ exitCode: 1, stderr: 'subject must start lowercase' }),
    });

    expect(result).toStrictEqual({
      ok: false,
      failedGate: 'message',
      exitCode: 1,
      stderr: 'subject must start lowercase',
    });
  });

  it('returns ok when all three gates pass', async () => {
    const result = await runCommitSkillGates({
      fitnessGate: passingGate,
      vocabularyGate: passingGate,
      messageCheck: passingGate,
    });

    expect(result).toStrictEqual({ ok: true });
  });

  it('runs the fitness gate before the vocabulary gate', async () => {
    const callOrder: string[] = [];
    await runCommitSkillGates({
      fitnessGate: async () => {
        callOrder.push('fitness');
        return { exitCode: 0, stderr: '' };
      },
      vocabularyGate: async () => {
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

  it('does not invoke later gates after a failure short-circuits', async () => {
    const callOrder: string[] = [];
    const result = await runCommitSkillGates({
      fitnessGate: async () => {
        callOrder.push('fitness');
        return { exitCode: 2, stderr: 'fitness loop failure signal' };
      },
      vocabularyGate: async () => {
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
      failedGate: 'fitness',
      exitCode: 2,
      stderr: 'fitness loop failure signal',
    });
  });
});
