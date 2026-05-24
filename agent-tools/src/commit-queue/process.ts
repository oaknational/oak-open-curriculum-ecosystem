import { spawn } from 'node:child_process';

export interface InheritedProcessOptions {
  readonly command: string;
  readonly args: readonly string[];
  readonly cwd: string;
}

export interface InheritedProcessResult {
  readonly exitCode: number;
  readonly stderr: string;
}

export async function runInheritedProcess(
  options: InheritedProcessOptions,
): Promise<InheritedProcessResult> {
  return new Promise((resolve, reject) => {
    const child = spawn(options.command, options.args, {
      cwd: options.cwd,
      stdio: ['ignore', 'inherit', 'pipe'],
    });

    const stderrChunks: Buffer[] = [];
    child.stderr.on('data', (chunk: Buffer) => {
      stderrChunks.push(chunk);
      process.stderr.write(chunk);
    });

    child.on('error', (error) => {
      reject(error);
    });

    child.on('close', (code, signal) => {
      const stderr = Buffer.concat(stderrChunks).toString('utf8');
      if (code === null && signal !== null) {
        resolve({ exitCode: 128, stderr });
        return;
      }
      resolve({ exitCode: code ?? 0, stderr });
    });
  });
}
