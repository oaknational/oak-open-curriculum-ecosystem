/**
* GENERATED FILE - DO NOT EDIT
*
* Canonical URL helpers for teachers-site resources (deterministic, no network).
*/

import { createAdaptiveLogger } from '@oaknational/mcp-logger';

export const CONTENT_TYPE_PREFIXES = {
  lesson: { prefix: 'lesson:', contentType: 'lesson' },
  unit: { prefix: 'unit:', contentType: 'unit' },
  subject: { prefix: 'subject:', contentType: 'subject' },
  sequence: { prefix: 'sequence:', contentType: 'sequence' },
  thread: { prefix: 'thread:', contentType: 'thread' },
} as const;

export type ContentType = keyof typeof CONTENT_TYPE_PREFIXES;

export function extractSlug(id: string): string {
  const idx = id.indexOf(':');
  return idx >= 0 ? id.slice(idx + 1) : id;
}

function urlForLesson(slug: string): string {
  return 'https://www.thenational.academy/teachers/lessons/' + slug;
}

function urlForSequence(slug: string): string {
  return 'https://www.thenational.academy/teachers/programmes/' + slug + '/units';
}

function urlForUnit(slug: string, context?: { subjectSlug?: string; phaseSlug?: string }): string | undefined {
  const subj = context?.subjectSlug;
  const phase = context?.phaseSlug;
  if (subj && phase) {
    return 'https://www.thenational.academy/teachers/programmes/' + subj + '-' + phase + '/units/' + slug;
  }
  return undefined;
}

function urlForSubject(slug: string, keyStageSlugs?: readonly string[]): string | undefined {
  const ks = keyStageSlugs ?? [];
  const preferred = ['ks1', 'ks2', 'ks3', 'ks4'] as const;
  const chosen = preferred.find((k) => ks.includes(k));
  return chosen
    ? 'https://www.thenational.academy/teachers/key-stages/' + chosen + '/subjects/' + slug + '/programmes'
    : undefined;
}

export function generateCanonicalUrlWithContext(
  type: ContentType,
  id: string,
  context?: {
    unit?: { subjectSlug?: string; phaseSlug?: string };
    subject?: { keyStageSlugs?: readonly string[] };
  },
): string | undefined {
  const slug = extractSlug(id);
  if (type === 'lesson') return urlForLesson(slug);
  if (type === 'sequence') return urlForSequence(slug);
  if (type === 'unit') return urlForUnit(slug, context?.unit);
  if (type === 'subject') return urlForSubject(slug, context?.subject?.keyStageSlugs);
  return undefined;
}

export function generateCanonicalUrl(
  type: ContentType,
  id: string,
  context?: {
    unit?: { subjectSlug?: string; phaseSlug?: string };
    subject?: { keyStageSlugs?: readonly string[] };
  },
): string | undefined {
  const slug = extractSlug(id);
  if (type === 'lesson') return urlForLesson(slug);
  if (type === 'sequence') return urlForSequence(slug);
  if (type === 'unit') {
    const canonicalUrl = urlForUnit(slug, context?.unit);
    if (!canonicalUrl) {
      const logger = createAdaptiveLogger({ name: 'url-helpers' });
      logger.warn('Could not generate canonical URL for unit', { id, context: context?.unit });
    }
    return canonicalUrl;
  }
  if (type === 'subject') {
    const canonicalUrl = urlForSubject(slug, context?.subject?.keyStageSlugs);
    if (!canonicalUrl) {
      const logger = createAdaptiveLogger({ name: 'url-helpers' });
      logger.warn('Could not generate canonical URL for subject', { id, context: context?.subject?.keyStageSlugs });
    }
    return canonicalUrl;
  }
  throw new TypeError('Unsupported content type: ' + String(type));
}