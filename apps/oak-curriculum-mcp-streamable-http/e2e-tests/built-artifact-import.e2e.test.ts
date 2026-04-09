import { spawn } from 'node:child_process';
import { describe, expect, it } from 'vitest';

interface NodeImportResult {
  readonly exitCode: number | null;
  readonly signal: NodeJS.Signals | null;
  readonly stdout: string;
  readonly stderr: string;
}

function runPlainNodeImport(moduleUrl: string): Promise<NodeImportResult> {
  return new Promise((resolve, reject) => {
    const child = spawn(
      process.execPath,
      [
        '--input-type=module',
        '--eval',
        `await import(${JSON.stringify(moduleUrl)}); process.stdout.write('IMPORT_OK\\n');`,
      ],
      {
        stdio: ['ignore', 'pipe', 'pipe'],
      },
    );

    let stdout = '';
    let stderr = '';

    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');
    child.stdout.on('data', (chunk: string) => {
      stdout += chunk;
    });
    child.stderr.on('data', (chunk: string) => {
      stderr += chunk;
    });
    child.on('error', reject);
    child.on('close', (exitCode, signal) => {
      resolve({ exitCode, signal, stdout, stderr });
    });
  });
}

describe('Built application artefact', () => {
  it('loads under plain Node ESM without a dev-time loader', async () => {
    const moduleUrl = new URL('../dist/application.js', import.meta.url).href;

    const result = await runPlainNodeImport(moduleUrl);

    expect(result.signal).toBeNull();
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('IMPORT_OK');
    expect(result.stderr).toBe('');
  });
});
