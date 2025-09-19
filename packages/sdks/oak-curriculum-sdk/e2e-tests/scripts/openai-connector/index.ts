
import type { OakApiPathBasedClient } from '../../../client/index.js';
import { executeToolCall } from '../../../mcp/execute-tool-call.js';
import {
  generateCanonicalUrlWithContext,
  extractSlug,
  type ContentType,
} from '../api-schema/routing/url-helpers.js';

export type OpenAiToolName = 'search' | 'fetch';

export function isOpenAiToolName(value: unknown): value is OpenAiToolName {
  return value === 'search' || value === 'fetch';
}

export type OpenAiSearchArgs =
  | string
  | {
      query?: string;
      q?: string;
      keyStage?: 'ks1' | 'ks2' | 'ks3' | 'ks4';
      subject?:
        | 'art'
        | 'citizenship'
        | 'computing'
        | 'cooking-nutrition'
        | 'design-technology'
        | 'english'
        | 'french'
        | 'geography'
        | 'german'
        | 'history'
        | 'maths'
        | 'music'
        | 'physical-education'
        | 'religious-education'
        | 'rshe-pshe'
        | 'science'
        | 'spanish';
      unit?: string;
    };

export type OpenAiFetchArgs = string | { id: string };

function getOwn(obj: unknown, key: string): unknown {
  if (obj === null || typeof obj !== 'object') return undefined;
  const desc = Object.getOwnPropertyDescriptor(obj, key);
  return desc?.value;
}

function normalizeSearchArgs(args: unknown): {
  q: string;
  keyStage?: string;
  subject?: string;
  unit?: string;
} {
  if (typeof args === 'string') {
    const trimmed = args.trim();
    if (trimmed) return { q: trimmed };
  }
  if (args && typeof args === 'object') {
    const qRaw = getOwn(args, 'q') ?? getOwn(args, 'query');
    const ks = getOwn(args, 'keyStage');
    const subj = getOwn(args, 'subject');
    const unitVal = getOwn(args, 'unit');
    if (typeof qRaw === 'string' && qRaw.trim().length > 0) {
      const out: { q: string; keyStage?: string; subject?: string; unit?: string } = {
        q: qRaw.trim(),
      };
      if (typeof ks === 'string') out.keyStage = ks;
      if (typeof subj === 'string') out.subject = subj;
      if (typeof unitVal === 'string') out.unit = unitVal;
      return out;
    }
  }
  throw new TypeError('search requires a non-empty query string ("query" or "q")');
}

function normalizeFetchId(args: unknown): string {
  let idVal: unknown;
  if (typeof args === 'string') {
    idVal = args;
  } else if (args && typeof args === 'object') {
    idVal = getOwn(args, 'id');
  }
  if (typeof idVal !== 'string' || idVal.trim() === '') throw new TypeError('fetch requires an "id" string');
  return idVal.trim();
}

function detectTypeFromId(id: string): ContentType | undefined {
  if (id.startsWith('lesson:')) return 'lesson';
  if (id.startsWith('unit:')) return 'unit';
  if (id.startsWith('subject:')) return 'subject';
  if (id.startsWith('sequence:')) return 'sequence';
  if (id.startsWith('thread:')) return 'thread';
  return undefined;
}

export async function executeOpenAiToolCall(
  name: OpenAiToolName,
  args: unknown,
  client: OakApiPathBasedClient,
): Promise<unknown> {
  if (name === 'search') {
    const { q, keyStage, subject, unit } = normalizeSearchArgs(args);
    const [lessons, transcripts] = await Promise.all([
      executeToolCall('get-search-lessons', { q, keyStage, subject, unit }, client),
      executeToolCall('get-search-transcripts', { q }, client),
    ]);

    function extractData(value: unknown): unknown | null {
      if (value === null || typeof value !== 'object') return null;
      const desc = Object.getOwnPropertyDescriptor(value, 'data');
      return desc ? desc.value : null;
    }

    const lessonsData = extractData(lessons);
    const transcriptsData = extractData(transcripts);
    return { q, keyStage, subject, unit, lessons: lessonsData, transcripts: transcriptsData };
  }

  if (name === 'fetch') {
    const id = normalizeFetchId(args);
    const type = detectTypeFromId(id);
    if (!type) throw new TypeError('Unsupported id prefix in ' + id);
    const slug = extractSlug(id);

    switch (type) {
      case 'lesson': {
        const res = await executeToolCall('get-lessons-summary', { lesson: slug }, client);
        const data = (() => {
          if (res === null || typeof res !== 'object') return null;
          const d = Object.getOwnPropertyDescriptor(res, 'data');
          return d ? d.value : null;
        })();
        const canonicalUrl = generateCanonicalUrlWithContext('lesson', id);
        return { id, type, canonicalUrl, data };
      }
      case 'unit': {
        const res = await executeToolCall('get-units-summary', { unit: slug }, client);
        const data = (() => {
          if (res === null || typeof res !== 'object') return null;
          const d = Object.getOwnPropertyDescriptor(res, 'data');
          return d ? d.value : null;
        })();
        const canonicalUrl = generateCanonicalUrlWithContext('unit', id);
        return { id, type, canonicalUrl, data };
      }
      case 'subject': {
        const res = await executeToolCall('get-subject-detail', { subject: slug }, client);
        const data = (() => {
          if (res === null || typeof res !== 'object') return null;
          const d = Object.getOwnPropertyDescriptor(res, 'data');
          return d ? d.value : null;
        })();
        const canonicalUrl = generateCanonicalUrlWithContext('subject', id);
        return { id, type, canonicalUrl, data };
      }
      case 'sequence': {
        const res = await executeToolCall('get-sequences-units', { sequence: slug }, client);
        const data = (() => {
          if (res === null || typeof res !== 'object') return null;
          const d = Object.getOwnPropertyDescriptor(res, 'data');
          return d ? d.value : null;
        })();
        const canonicalUrl = generateCanonicalUrlWithContext('sequence', id);
        return { id, type, canonicalUrl, data };
      }
      case 'thread': {
        const res = await executeToolCall('get-threads-units', { threadSlug: slug }, client);
        const data = (() => {
          if (res === null || typeof res !== 'object') return null;
          const d = Object.getOwnPropertyDescriptor(res, 'data');
          return d ? d.value : null;
        })();
        const canonicalUrl = generateCanonicalUrlWithContext('thread', id);
        return { id, type, canonicalUrl, data };
      }
      default:
        throw new TypeError('Unsupported content type: ' + String(type));
    }
  }

  throw new TypeError('Unknown OpenAI tool: ' + String(name));
}

export const OPENAI_CONNECTOR_TOOL_DEFS = {
  search: {
    name: 'search',
    description:
      'Search across lessons and transcripts. Args: { query: string; keyStage?; subject?; unit? } or a string query.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        keyStage: { type: 'string', enum: ['ks1', 'ks2', 'ks3', 'ks4'] },
        subject: {
          type: 'string',
          enum: [
            'art',
            'citizenship',
            'computing',
            'cooking-nutrition',
            'design-technology',
            'english',
            'french',
            'geography',
            'german',
            'history',
            'maths',
            'music',
            'physical-education',
            'religious-education',
            'rshe-pshe',
            'science',
            'spanish',
          ],
        },
        unit: { type: 'string' },
      },
      required: ['query'],
      additionalProperties: false,
    } as const,
  },
  fetch: {
    name: 'fetch',
    description:
      'Fetch a resource by id (e.g., lesson:slug, unit:slug, subject:slug, sequence:slug, thread:slug).',
    inputSchema: {
      type: 'object',
      properties: { id: { type: 'string' } },
      required: ['id'],
      additionalProperties: false,
    } as const,
  },
} as const;
