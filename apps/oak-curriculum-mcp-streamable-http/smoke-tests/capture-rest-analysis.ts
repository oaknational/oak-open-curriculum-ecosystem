import { promises as fs } from 'node:fs';
import path from 'node:path';

import { loadRootEnv } from '@oaknational/mcp-env';

import { DEFAULT_LOG_DIRECTORY } from './logging.js';

interface RestCaptureTarget {
  readonly toolName: string;
  readonly path: string;
  readonly description: string;
}

interface RestPayload {
  readonly fetchedAt: string;
  readonly status: number;
  readonly url: string;
  readonly body: unknown;
}

const API_BASE_URL = process.env.OAK_API_BASE_URL ?? 'https://open-api.thenational.academy/api/v0';
const ANALYSIS_DIRECTORY = path.join(DEFAULT_LOG_DIRECTORY, 'analysis');

const TARGETS: RestCaptureTarget[] = [
  {
    toolName: 'get-key-stages',
    path: '/key-stages',
    description: 'List of all key stages',
  },
  {
    toolName: 'get-key-stages-subject-lessons',
    path: '/key-stages/ks2/subject/english/lessons?limit=5',
    description: 'Lessons for KS2 English (first 5)',
  },
];

function ensureApiKey(): string {
  if (!process.env.OAK_API_KEY) {
    loadRootEnv({ requiredKeys: ['OAK_API_KEY'], startDir: process.cwd(), env: process.env });
  }
  const apiKey = process.env.OAK_API_KEY;
  if (!apiKey) {
    throw new Error('OAK_API_KEY is required to capture REST payloads');
  }
  return apiKey;
}

async function fetchJson(url: string, apiKey: string): Promise<RestPayload> {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: 'application/json',
    },
  });
  const body = await response.json();
  return {
    fetchedAt: new Date().toISOString(),
    status: response.status,
    url,
    body,
  };
}

function createAnalysisFileName(toolName: string): string {
  const safe = toolName.toLowerCase().replace(/[^a-z0-9-]+/g, '-');
  return `${safe}-rest.json`;
}

async function writeAnalysisSnapshot(
  toolName: string,
  payload: RestPayload & { readonly description: string },
): Promise<void> {
  await fs.mkdir(ANALYSIS_DIRECTORY, { recursive: true });
  const filePath = path.join(ANALYSIS_DIRECTORY, createAnalysisFileName(toolName));
  await fs.writeFile(filePath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  console.log(`Captured REST payload for ${toolName} -> ${filePath}`);
}

async function captureRestPayloads(): Promise<void> {
  const apiKey = ensureApiKey();
  for (const target of TARGETS) {
    const url = `${API_BASE_URL}${target.path}`;
    try {
      const payload = await fetchJson(url, apiKey);
      await writeAnalysisSnapshot(target.toolName, {
        ...payload,
        description: target.description,
      });
    } catch (error) {
      console.error(`Failed to capture REST payload for ${target.toolName}`, error);
    }
  }
}

void captureRestPayloads();
