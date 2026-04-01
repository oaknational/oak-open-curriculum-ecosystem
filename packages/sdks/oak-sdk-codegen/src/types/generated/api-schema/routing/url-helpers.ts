/**
* GENERATED FILE - DO NOT EDIT
*
* Oak URL helpers for teachers-site resources (deterministic, no network).
*
* The oakUrl is the direct, slug-based URL for a resource on the Oak National
* website. It is distinct from the upstream's canonicalUrl, which encodes full
* curriculum context (programme, unit, key stage, exam board).
*
* URL patterns sourced from OWA routing (src/pages/teachers/) and verified against
* the live site. Sequences and units live under /teachers/curriculum/, not /teachers/programmes/.
*/

export const CONTENT_TYPE_PREFIXES = {
  lesson: { prefix: 'lesson:', contentType: 'lesson', pathSegment: 'lessons' },
  unit: { prefix: 'unit:', contentType: 'unit', pathSegment: 'units' },
  subject: { prefix: 'subject:', contentType: 'subject', pathSegment: 'subjects' },
  sequence: { prefix: 'sequence:', contentType: 'sequence', pathSegment: 'sequences' },
  thread: { prefix: 'thread:', contentType: 'thread', pathSegment: 'threads' },
} as const;

export type ContentType = keyof typeof CONTENT_TYPE_PREFIXES;

export function extractSlug(id: string): string {
  const idx = id.indexOf(':');
  return idx >= 0 ? id.slice(idx + 1) : id;
}

function urlForLesson(slug: string): string {
  return 'https://www.thenational.academy/teachers/lessons/' + slug;
}

/**
 * Generates the Oak URL for a sequence (curriculum view).
 *
 * Pattern: /teachers/curriculum/\{sequenceSlug\}/units
 * Example: art-secondary → https://www.thenational.academy/teachers/curriculum/art-secondary/units
 */
function urlForSequence(slug: string): string {
  return 'https://www.thenational.academy/teachers/curriculum/' + slug + '/units';
}

/**
 * Generates the Oak URL for a unit within its curriculum context.
 *
 * Pattern: /teachers/curriculum/\{sequenceSlug\}/units/\{unitSlug\}
 * Requires sequenceSlug in context. The sequenceSlug is derived from the unit's
 * subject and phase (e.g. 'maths-primary') by the response augmentation layer.
 */
function urlForUnit(slug: string, context?: { sequenceSlug?: string }): string | undefined {
  const seq = context?.sequenceSlug;
  if (seq) {
    return 'https://www.thenational.academy/teachers/curriculum/' + seq + '/units/' + slug;
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

/**
 * Generate an Oak URL for a resource with context.
 *
 * The Oak URL is the direct, slug-based URL for a resource on the Oak National
 * website. It does not require curriculum context (unlike the upstream's
 * canonicalUrl which encodes programme, unit, key stage, and exam board).
 *
 * @param type - The content type ('lesson', 'sequence', 'unit', 'subject', or 'thread')
 * @param id - The ID of the resource
 * @param context - Context for unit (sequenceSlug) or subject (keyStageSlugs)
 * @returns The Oak URL, or `null` for threads (no website equivalent)
 * @throws TypeError if content type is unsupported or required context is missing
 *
 * Return semantics:
 * - `string`: Valid Oak URL
 * - `null`: Entity type has no Oak URL (threads have no OWA page)
 * - Throws: Invalid type or missing required context (fail fast)
 *
 * Unit context: the caller is responsible for deriving `sequenceSlug` from
 * available data (typically `subjectSlug + '-' + phaseSlug` from the API response).
 */
export function generateOakUrlWithContext(
  type: ContentType,
  id: string,
  context?: {
    unit?: { sequenceSlug?: string };
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
  // Threads are data concepts without Oak URLs - return null
  if (type === 'thread') {
    result = null;
    validType = true;
  }

  if (!validType) {
    throw new TypeError(`Oak URL generation failed: Unsupported content type: ${String(type)}, id: ${id}`);
  }
  if (result === undefined) {
    throw new TypeError(`Oak URL generation failed: Missing required context for ${String(type)}, id: ${id}, context: ${JSON.stringify(context)}`);
  }
  return result;
}
