import { NextResponse } from 'next/server';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

export const runtime = 'nodejs';

function makeEnv(): NodeJS.ProcessEnv {
  return {
    ...process.env,
    ELASTICSEARCH_URL: process.env.ELASTICSEARCH_URL,
    ELASTICSEARCH_API_KEY: process.env.ELASTICSEARCH_API_KEY,
  };
}

function toUint8(buffer: Buffer): Uint8Array {
  return new Uint8Array(buffer);
}

function safeErrorText(err: unknown): string {
  if (err instanceof Error) {
    return err.message;
  }
  if (typeof err === 'string') {
    return err;
  }
  try {
    return JSON.stringify(err);
  } catch {
    return 'Unknown error';
  }
}

export function POST(): Response {
  const scriptPath = fileURLToPath(new URL('../../../../scripts/setup.sh', import.meta.url));
  const cwd = path.dirname(scriptPath);
  const env = makeEnv();

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const proc = spawn('bash', [scriptPath], { cwd, env });

      proc.stdout.on('data', (chunk: Buffer) => {
        controller.enqueue(toUint8(chunk));
      });
      proc.stderr.on('data', (chunk: Buffer) => {
        controller.enqueue(toUint8(chunk));
      });
      proc.on('error', (err) => {
        const msg = Buffer.from(`\n[error] ${safeErrorText(err)}\n`);
        controller.enqueue(new Uint8Array(msg));
      });
      proc.on('close', (code) => {
        const codeText: string = code === null ? 'null' : String(code);
        const msg = Buffer.from(`\n[done] exit code ${codeText}\n`);
        controller.enqueue(new Uint8Array(msg));
        controller.close();
      });
    },
  });

  return new NextResponse(stream, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}
