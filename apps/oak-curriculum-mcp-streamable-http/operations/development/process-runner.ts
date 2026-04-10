import { spawn, type ChildProcess } from 'node:child_process';
import { createWriteStream, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

import type { HttpDevCommand } from './http-dev-contract.js';
import type { ManagedProcess, ProcessCompletion, ProcessRunner } from './run-http-dev-session.js';

/**
 * Output streams used by the Node process runner.
 */
export interface NodeProcessRunnerOptions {
  readonly stdout: NodeJS.WriteStream;
  readonly stderr: NodeJS.WriteStream;
}

/**
 * Creates the real child-process runner used by the CLI entrypoint.
 */
export function createNodeProcessRunner(
  { stdout, stderr }: NodeProcessRunnerOptions = {
    stdout: process.stdout,
    stderr: process.stderr,
  },
): ProcessRunner {
  return {
    spawn(command) {
      return spawnCommand(command, stdout, stderr);
    },
  };
}

function spawnCommand(
  command: HttpDevCommand,
  stdout: NodeJS.WriteStream,
  stderr: NodeJS.WriteStream,
): ManagedProcess {
  const child: ChildProcess =
    command.output.kind === 'tee'
      ? spawn(command.command, [...command.args], {
          cwd: command.cwd,
          env: command.env,
          stdio: ['inherit', 'pipe', 'pipe'],
        })
      : spawn(command.command, [...command.args], {
          cwd: command.cwd,
          env: command.env,
          stdio: 'inherit',
        });
  const logStream = createLogStream(command);
  pipeOutput(child.stdout, stdout, logStream);
  pipeOutput(child.stderr, stderr, logStream);

  return {
    completed: createCompletionPromise(child, logStream),
    terminate(signal) {
      child.kill(signal);
    },
  };
}

function createLogStream(command: HttpDevCommand) {
  if (command.output.kind !== 'tee') {
    return undefined;
  }

  mkdirSync(dirname(command.output.filePath), { recursive: true });
  return createWriteStream(command.output.filePath, { flags: 'a' });
}

function pipeOutput(
  source: NodeJS.ReadableStream | null,
  destination: NodeJS.WriteStream,
  logStream: ReturnType<typeof createLogStream>,
): void {
  if (source === null) {
    return;
  }

  source.on('data', (chunk: Buffer | string) => {
    destination.write(chunk);
    logStream?.write(chunk);
  });
}

function createCompletionPromise(
  child: ChildProcess,
  logStream: ReturnType<typeof createLogStream>,
): Promise<ProcessCompletion> {
  return new Promise<ProcessCompletion>((resolve) => {
    let settled = false;

    const settle = (completion: ProcessCompletion) => {
      if (settled) {
        return;
      }

      settled = true;
      void closeLogStream(logStream).then(() => {
        resolve(completion);
      });
    };

    child.on('close', (code, signal) => {
      settle({
        kind: 'exit',
        code,
        signal,
      });
    });

    child.on('error', (error) => {
      settle({
        kind: 'error',
        error,
      });
    });
  });
}

async function closeLogStream(logStream: ReturnType<typeof createLogStream>): Promise<void> {
  if (logStream === undefined) {
    return;
  }

  await new Promise<void>((resolve) => {
    logStream.end(() => {
      resolve();
    });
  });
}
