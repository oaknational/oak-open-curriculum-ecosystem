/**
 * Generate deterministic URL helper library for teachers-site canonical URLs.
 *
 * This codegen does not read the schema for routes (the OpenAPI does not contain them),
 * but we keep it in type-gen to align with the project rule: helpers and types flow
 * from generation, not ad-hoc runtime code in apps.
 */

function headerSection(): string {
  return `/**
* GENERATED FILE - DO NOT EDIT
*
* Canonical URL helpers for teachers-site resources (deterministic, no network).
*/
`;
}

function typesSection(): string {
  return `export const CONTENT_TYPE_PREFIXES = {
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
`;
}

function helpersSection(): string {
  return `function urlForLesson(slug: string): string {
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
`;
}

function dispatcherSection(): string {
  return `/**
 * Generate a canonical URL for a resource with context.
 *
 * @param type - The content type ('lesson', 'sequence', 'unit', 'subject', or 'thread')
 * @param id - The ID of the resource
 * @param context - Context for unit (subjectSlug, phaseSlug) or subject (keyStageSlugs)
 * @returns The canonical URL, or \`null\` for threads (no website equivalent)
 * @throws TypeError if content type is unsupported or required context is missing
 *
 * Return semantics:
 * - \`string\`: Valid canonical URL
 * - \`null\`: Entity type has no canonical URL (e.g., threads)
 * - Throws: Invalid type or missing required context (fail fast)
 */
export function generateCanonicalUrlWithContext(
  type: ContentType,
  id: string,
  context?: {
    unit?: { subjectSlug?: string; phaseSlug?: string };
    subject?: { keyStageSlugs?: readonly string[] };
  },
): string | null {
  const slug = extractSlug(id);
  let result: string | null | undefined;
  let validType = false;

  if (type === 'lesson') {
    result = urlForLesson(slug);
    validType = true;
  }
  if (type === 'sequence') {
    result = urlForSequence(slug);
    validType = true;
  }
  if (type === 'unit') {
    result = urlForUnit(slug, context?.unit);
    validType = true;
  }
  if (type === 'subject') {
    result = urlForSubject(slug, context?.subject?.keyStageSlugs);
    validType = true;
  }
  // Threads are data concepts without canonical URLs - return null
  if (type === 'thread') {
    result = null;
    validType = true;
  }

  if (!validType) {
    throw new TypeError(\`Canonical URL generation failed: Unsupported content type: \${String(type)}, id: \${id}\`);
  }
  if (result === undefined) {
    throw new TypeError(\`Canonical URL generation failed: Missing required context for \${String(type)}, id: \${id}, context: \${JSON.stringify(context)}\`);
  }
  return result;
}
`;
}

export function generateUrlHelpers(): string {
  const fallbackSection = `export function generateCanonicalUrl(
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
    return urlForUnit(slug, context?.unit);
  }
  if (type === 'subject') {
    return urlForSubject(slug, context?.subject?.keyStageSlugs);
  }
  // Threads are data concepts without canonical URLs - return undefined
  if (type === 'thread') return undefined;
  throw new TypeError('Canonical URL generation failed: Unsupported content type: ' + String(type));
}`;
  return [
    headerSection(),
    typesSection(),
    helpersSection(),
    dispatcherSection(),
    fallbackSection,
  ].join('\n');
}
