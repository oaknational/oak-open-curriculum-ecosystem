import { Readable } from 'node:stream';

/** A writable a CLI case can read back. */
interface CapturedStream {
  readonly write: (chunk: string) => void;
}

/**
 * The streams a `runCodexExecCli` case runs against, with the text each
 * output stream received readable afterwards.
 */
export interface CliIo {
  readonly stdin: Readable;
  readonly stdout: CapturedStream;
  readonly stderr: CapturedStream;
  readonly stdoutText: string;
  readonly stderrText: string;
}

/**
 * The stdin, stdout and stderr a `runCodexExecCli` case runs against: stdin
 * is the given lines joined by newlines, and each output stream is captured
 * so a test can read what the command wrote. Shared by every CLI case so a
 * second subcommand does not copy the fake.
 */
export function makeIo(stdinLines: readonly string[] = []): CliIo {
  const stdin = Readable.from(stdinLines.join('\n'));
  const stdoutChunks: string[] = [];
  const stderrChunks: string[] = [];
  return {
    stdin,
    stdout: {
      write: (chunk: string) => {
        stdoutChunks.push(chunk);
      },
    },
    stderr: {
      write: (chunk: string) => {
        stderrChunks.push(chunk);
      },
    },
    get stdoutText() {
      return stdoutChunks.join('');
    },
    get stderrText() {
      return stderrChunks.join('');
    },
  };
}
