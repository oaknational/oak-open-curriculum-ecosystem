import { mkdir, mkdtemp, rm, copyFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { spawn } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import request from 'supertest';
import { z } from 'zod';
import { WIDGET_URI } from '@oaknational/sdk-codegen/widget-constants';
import { RESOURCE_MIME_TYPE } from '@modelcontextprotocol/ext-apps/server';
import type { CreateAppOptions } from '../src/application.js';
import { createMockObservability, createMockRuntimeConfig } from './helpers/test-config.js';
import { parseSseEnvelope } from './helpers/sse.js';
import { STUB_ACCEPT_HEADER } from './helpers/create-stubbed-http-app.js';

interface NodeImportResult {
  readonly exitCode: number | null;
  readonly signal: NodeJS.Signals | null;
  readonly stdout: string;
  readonly stderr: string;
}

interface RelocatedBuiltApplicationModule {
  readonly createApp: (options: CreateAppOptions) => Promise<Parameters<typeof request>[0]>;
}

function isRelocatedBuiltApplicationModule(
  value: unknown,
): value is RelocatedBuiltApplicationModule {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  return 'createApp' in value && typeof value.createApp === 'function';
}

const ResourcesReadResultSchema = z.object({
  contents: z.array(
    z.object({
      uri: z.string(),
      mimeType: z.string().optional(),
      text: z.string().optional(),
    }),
  ),
});

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

async function createRelocatedBuiltApplicationModule(): Promise<{
  readonly relocatedDir: string;
  readonly moduleUrl: string;
}> {
  const relocationRoot = resolve(import.meta.dirname, '../.tmp-built-artifacts');
  await mkdir(relocationRoot, { recursive: true });

  const relocatedDir = await mkdtemp(join(relocationRoot, 'application-'));
  const builtApplicationPath = resolve(import.meta.dirname, '../dist/application.js');
  const builtApplicationSourceMapPath = resolve(import.meta.dirname, '../dist/application.js.map');
  const relocatedApplicationPath = join(relocatedDir, 'application.js');
  const relocatedApplicationSourceMapPath = join(relocatedDir, 'application.js.map');

  await copyFile(builtApplicationPath, relocatedApplicationPath);
  await copyFile(builtApplicationSourceMapPath, relocatedApplicationSourceMapPath);

  return {
    relocatedDir,
    moduleUrl: pathToFileURL(relocatedApplicationPath).href,
  };
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

  it('serves the widget resource after the compiled app is relocated away from dist sidecars', async () => {
    const { relocatedDir, moduleUrl } = await createRelocatedBuiltApplicationModule();

    try {
      const module: unknown = await import(moduleUrl);
      if (!isRelocatedBuiltApplicationModule(module)) {
        throw new TypeError(`Relocated module at ${moduleUrl} does not export createApp`);
      }
      const runtimeConfig = createMockRuntimeConfig({
        dangerouslyDisableAuth: true,
        useStubTools: true,
      });
      const observability = createMockObservability(runtimeConfig);
      const app = await module.createApp({ runtimeConfig, observability });

      const response = await request(app)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', STUB_ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'resources/read',
          params: { uri: WIDGET_URI },
        });

      expect(response.status).toBe(200);

      const envelope = parseSseEnvelope(response.text);
      const parsed = ResourcesReadResultSchema.parse(envelope.result);
      const content = parsed.contents[0];

      expect(content?.uri).toBe(WIDGET_URI);
      expect(content?.mimeType).toBe(RESOURCE_MIME_TYPE);
      expect(content?.text).toContain('<!doctype html>');
    } finally {
      await rm(relocatedDir, { recursive: true, force: true });
    }
  });
});
