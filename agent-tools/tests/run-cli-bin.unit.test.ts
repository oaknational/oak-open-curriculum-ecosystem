import { describe, expect, it } from 'vitest';

import { runCliBin } from '../src/bin/run-cli-bin';
import type {
  AgentToolsCliInput,
  AgentToolsCliResult,
  AgentToolsEnvironment,
} from '../src/bin/agent-tools-cli-types';

interface TestIo {
  readonly stdoutChunks: string[];
  readonly stderrChunks: string[];
  readonly exitCodes: number[];
  readonly stdout: Pick<NodeJS.WritableStream, 'write'>;
  readonly stderr: Pick<NodeJS.WritableStream, 'write'>;
  readonly setExitCode: (code: number) => void;
}

function makeTestIo(): TestIo {
  const stdoutChunks: string[] = [];
  const stderrChunks: string[] = [];
  const exitCodes: number[] = [];
  return {
    stdoutChunks,
    stderrChunks,
    exitCodes,
    stdout: {
      write: (text: string): boolean => {
        stdoutChunks.push(text);
        return true;
      },
    },
    stderr: {
      write: (text: string): boolean => {
        stderrChunks.push(text);
        return true;
      },
    },
    setExitCode: (code: number) => {
      exitCodes.push(code);
    },
  };
}

const fakeEnv: AgentToolsEnvironment = {};

describe('runCliBin', () => {
  it('prefixes the command name onto user argv and propagates runner result fields', async () => {
    const io = makeTestIo();
    const recordedInputs: AgentToolsCliInput[] = [];
    const runner = async (input: AgentToolsCliInput): Promise<AgentToolsCliResult> => {
      recordedInputs.push(input);
      return { exitCode: 0, stdout: 'OUT', stderr: 'ERR' };
    };

    await runCliBin({
      command: 'agent-identity',
      argv: ['--seed', 'abc'],
      cwd: '/repo',
      env: fakeEnv,
      stdout: io.stdout,
      stderr: io.stderr,
      setExitCode: io.setExitCode,
      runner,
    });

    expect(recordedInputs).toHaveLength(1);
    expect(recordedInputs[0]?.argv).toEqual(['agent-identity', '--seed', 'abc']);
    expect(recordedInputs[0]?.cwd).toBe('/repo');
    expect(recordedInputs[0]?.env).toBe(fakeEnv);
    expect(io.stdoutChunks).toEqual(['OUT']);
    expect(io.stderrChunks).toEqual(['ERR']);
    expect(io.exitCodes).toEqual([0]);
  });

  it('on Error throw writes message + newline to stderr and sets exitCode=2', async () => {
    const io = makeTestIo();
    const runner = async (): Promise<AgentToolsCliResult> => {
      throw new Error('runner exploded');
    };

    await runCliBin({
      command: 'commit-queue',
      argv: [],
      cwd: '/repo',
      env: fakeEnv,
      stdout: io.stdout,
      stderr: io.stderr,
      setExitCode: io.setExitCode,
      runner,
    });

    expect(io.stderrChunks).toEqual(['runner exploded\n']);
    expect(io.stdoutChunks).toEqual([]);
    expect(io.exitCodes).toEqual([2]);
  });

  it('propagates empty runner stdout/stderr through io.write unchanged (no implicit filtering)', async () => {
    const io = makeTestIo();
    const runner = async (): Promise<AgentToolsCliResult> => ({
      exitCode: 0,
      stdout: '',
      stderr: '',
    });

    await runCliBin({
      command: 'branch-touched-files',
      argv: [],
      cwd: '/repo',
      env: fakeEnv,
      stdout: io.stdout,
      stderr: io.stderr,
      setExitCode: io.setExitCode,
      runner,
    });

    expect(io.stdoutChunks).toEqual(['']);
    expect(io.stderrChunks).toEqual(['']);
    expect(io.exitCodes).toEqual([0]);
  });

  it('on non-Error throw writes String(value) + newline to stderr and sets exitCode=2', async () => {
    const io = makeTestIo();
    const nonErrorThrowable: unknown = 'boom';
    const runner = async (): Promise<AgentToolsCliResult> => {
      throw nonErrorThrowable;
    };

    await runCliBin({
      command: 'codex-exec',
      argv: ['x'],
      cwd: '/repo',
      env: fakeEnv,
      stdout: io.stdout,
      stderr: io.stderr,
      setExitCode: io.setExitCode,
      runner,
    });

    expect(io.stderrChunks).toEqual(['boom\n']);
    expect(io.exitCodes).toEqual([2]);
  });
});
