/**
 * Shared HTML rendering helpers for widget renderers.
 *
 * These are pure functions that generate HTML strings.
 * They run inside the ChatGPT sandbox as embedded JavaScript.
 *
 * Field-extraction helpers handle the scope-specific nested
 * structures from the SDK's search result types:
 * - lessons: `result.lesson.lesson_title` etc.
 * - units: `result.unit.unit_title` etc. (unit can be null)
 * - threads: `result.thread.thread_title`, `subject_slugs` (array)
 * - sequences: `result.sequence.sequence_title`, `key_stages` (array)
 *
 * @see widget-script.ts - Main widget script that uses these helpers
 */

/**
 * Helper JavaScript functions shared across all renderers.
 *
 * Includes:
 * - esc(): HTML entity escaping (prevents XSS)
 * - extractTitle(result, scope): title from nested scope object
 * - extractSubject(result, scope): subject, joining arrays for threads
 * - extractKeyStage(result, scope): key stage, joining arrays for sequences
 * - extractUrl(result, scope): scope-appropriate URL field
 */
export const WIDGET_HELPERS = `
function esc(s) {
  if (typeof s !== 'string') return '';
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

function scopeObj(r, scope) {
  var key = scope === 'lessons' ? 'lesson'
    : scope === 'units' ? 'unit'
    : scope === 'threads' ? 'thread'
    : scope === 'sequences' ? 'sequence'
    : null;
  return (key && r && r[key]) || null;
}

function extractTitle(r, scope) {
  var o = scopeObj(r, scope);
  if (!o) return 'Untitled';
  if (scope === 'lessons') return o.lesson_title || o.lesson_slug || 'Untitled';
  if (scope === 'units') return o.unit_title || o.unit_slug || 'Untitled';
  if (scope === 'threads') return o.thread_title || o.thread_slug || 'Untitled';
  return o.sequence_title || o.sequence_slug || 'Untitled';
}

function extractSubject(r, scope) {
  var o = scopeObj(r, scope);
  if (!o) return '';
  if (scope === 'threads') {
    var slugs = o.subject_slugs;
    if (Array.isArray(slugs) && slugs.length > 0) return slugs.join(' / ');
    return '';
  }
  return o.subject_title || o.subject_slug || '';
}

function extractKeyStage(r, scope) {
  var o = scopeObj(r, scope);
  if (!o) return '';
  if (scope === 'threads') return '';
  if (scope === 'sequences') {
    var ks = o.key_stages;
    if (Array.isArray(ks) && ks.length > 0) return ks.join(' / ');
    return '';
  }
  return o.key_stage_title || o.key_stage || '';
}

function extractUrl(r, scope) {
  var o = scopeObj(r, scope);
  if (!o) return '';
  if (scope === 'lessons') return o.lesson_url || '';
  if (scope === 'units') return o.unit_url || '';
  if (scope === 'threads') return o.thread_url || '';
  return o.sequence_url || '';
}
`.trim();
