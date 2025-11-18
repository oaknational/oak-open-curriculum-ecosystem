import { spawn } from 'node:child_process';

function processLine(line: string): string | null {
  if (line.trim().length === 0) {
    return null;
  }
  return line;
}

async function run(): Promise<number> {
  const args = process.argv.slice(2);
  const child = spawn('typedoc', args, { stdio: ['ignore', 'pipe', 'pipe'] });
  child.stdout.setEncoding('utf8');
  child.stderr.setEncoding('utf8');

  child.stdout.on('data', (chunk: string) => {
    for (const raw of chunk.split(/\r?\n/)) {
      const line = processLine(raw);
      if (line) {
        console.log(line);
      }
    }
  });

  child.stderr.on('data', (chunk: string) => {
    for (const raw of chunk.split(/\r?\n/)) {
      const line = processLine(raw);
      if (line) {
        console.error(line);
      }
    }
  });

  return await new Promise<number>((resolve) => {
    child.on('close', (code) => resolve(code ?? 0));
    child.on('error', () => resolve(1));
  });
}

await run().then((code) => {
  process.exitCode = code;
});
