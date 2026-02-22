/**
 * Browse-curriculum renderer for the widget.
 *
 * Renders the output of the `browse-curriculum` tool, which returns
 * `{ facets: { sequences: SequenceFacet[] }, filters }`.
 *
 * SequenceFacet uses camelCase (not snake_case):
 * - subjectSlug, sequenceSlug, keyStage, keyStageTitle
 * - phaseTitle, years[], units[], unitCount, lessonCount
 * - sequenceUrl (optional)
 *
 * @see widget-renderer-registry.ts - Registry routing
 * @see ./helpers.ts - Shared helpers (esc)
 */
export const BROWSE_RENDERER = `
function renderBrowse(d) {
  if (!d || !d.facets) return '<div class="empty">No programmes found.</div>';
  var seqs = d.facets.sequences;
  if (!Array.isArray(seqs) || seqs.length === 0) return '<div class="empty">No programmes found.</div>';

  var h = '<div class="sec"><h2 class="sec-ttl">Browse curriculum<span class="badge">' + seqs.length + '</span></h2><div class="list">';
  seqs.forEach(function(s) {
    var slug = s.sequenceSlug || '';
    var ksLabel = s.keyStageTitle || s.keyStage || '';
    var phase = s.phaseTitle || '';
    var url = s.sequenceUrl || '';
    var uCount = typeof s.unitCount === 'number' ? s.unitCount : 0;
    var lCount = typeof s.lessonCount === 'number' ? s.lessonCount : 0;

    h += '<div class="item"><p class="item-ttl">' + esc(slug) + '</p>';
    var meta = [ksLabel, phase, uCount + ' units', lCount + ' lessons'].filter(Boolean);
    h += '<p class="meta">' + esc(meta.join(' \\u2022 ')) + '</p>';

    if (Array.isArray(s.units) && s.units.length > 0) {
      h += '<p class="meta">';
      s.units.forEach(function(u, i) {
        if (i > 0) h += ', ';
        h += esc(u.unitTitle || u.unitSlug || '');
      });
      h += '</p>';
    }

    if (url) h += '<a class="link" href="' + esc(url) + '" target="_blank" rel="noopener noreferrer" data-oak-url="' + esc(url) + '">View on Oak \\u2192</a>';
    h += '</div>';
  });
  h += '</div></div>';
  return h;
}
`.trim();
