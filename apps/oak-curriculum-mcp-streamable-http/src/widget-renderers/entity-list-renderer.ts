/**
 * Entity list renderer for the widget.
 *
 * Generic renderer for arrays of curriculum entities:
 * key stages, subjects, lessons, units, threads, sequences, years.
 *
 * @see widget-renderer-registry.ts - Registry that routes to this renderer
 */

/**
 * JavaScript function to render entity lists in the widget.
 *
 * Automatically detects entity type from first item's properties:
 * - keyStageTitle/keyStageSlug → Key Stages
 * - subjectTitle/subjectSlug → Subjects
 * - lessonTitle/lessonSlug → Lessons
 * - unitTitle/unitSlug → Units
 * - threadTitle/threadSlug → Threads
 * - sequenceSlug → Sequences
 * - year → Years
 * - title/slug → Generic entities
 */
export const ENTITY_LIST_RENDERER = `
function renderEntityList(data) {
  // Handle both array and object with results array
  const items = Array.isArray(data) ? data : (data.results || data.items || []);
  
  if (!Array.isArray(items) || items.length === 0) {
    return '<div class="empty">No items found.</div>';
  }
  
  const first = items[0] || {};
  
  // Detect entity type from properties
  let entityType = 'Items';
  let titleProp = 'title';
  let slugProp = 'slug';
  
  if (first.keyStageTitle || first.keyStageSlug) {
    entityType = 'Key Stages';
    titleProp = 'keyStageTitle';
    slugProp = 'keyStageSlug';
  } else if (first.subjectTitle || first.subjectSlug) {
    entityType = 'Subjects';
    titleProp = 'subjectTitle';
    slugProp = 'subjectSlug';
  } else if (first.lessonTitle || first.lessonSlug) {
    entityType = 'Lessons';
    titleProp = 'lessonTitle';
    slugProp = 'lessonSlug';
  } else if (first.unitTitle || first.unitSlug) {
    entityType = 'Units';
    titleProp = 'unitTitle';
    slugProp = 'unitSlug';
  } else if (first.threadTitle || first.threadSlug) {
    entityType = 'Threads';
    titleProp = 'threadTitle';
    slugProp = 'threadSlug';
  } else if (first.sequenceSlug) {
    entityType = 'Sequences';
    titleProp = 'sequenceSlug';
    slugProp = 'sequenceSlug';
  } else if (first.year !== undefined) {
    entityType = 'Years';
    titleProp = 'year';
  } else if (first.title) {
    entityType = 'Items';
    titleProp = 'title';
    slugProp = 'slug';
  }
  
  let h = '<div class="sec"><h2 class="sec-ttl">' + esc(entityType) + '<span class="badge">' + items.length + '</span></h2><div class="list">';
  
  const maxItems = 10;
  const displayItems = items.slice(0, maxItems);
  
  displayItems.forEach(item => {
    const title = item[titleProp] || item.title || item.slug || item.name || 'Untitled';
    const displayTitle = titleProp === 'year' ? 'Year ' + title : title;
    
    // Build metadata line
    const metaParts = [];
    if (item.subjectTitle && titleProp !== 'subjectTitle') metaParts.push(item.subjectTitle);
    if (item.keyStageTitle && titleProp !== 'keyStageTitle') metaParts.push(item.keyStageTitle);
    if (item.keyStage) metaParts.push(item.keyStage);
    if (item.year && titleProp !== 'year') metaParts.push('Year ' + item.year);
    if (item.phaseTitle) metaParts.push(item.phaseTitle);
    if (item.order !== undefined) metaParts.push('Order: ' + item.order);
    
    const meta = metaParts.join(' • ');
    const url = item.canonicalUrl || '';
    
    h += '<div class="item"><p class="item-ttl">' + esc(displayTitle) + '</p>';
    if (meta) h += '<p class="meta">' + esc(meta) + '</p>';
    
    // Key stages within subjects/sequences
    if (item.keyStages && Array.isArray(item.keyStages) && item.keyStages.length > 0) {
      const ksNames = item.keyStages.map(ks => ks.keyStageTitle || ks.title || ks).join(', ');
      h += '<p class="meta">Key Stages: ' + esc(ksNames) + '</p>';
    }
    
    // Years within subjects/sequences
    if (item.years && Array.isArray(item.years) && item.years.length > 0 && titleProp !== 'year') {
      const yearRange = 'Years ' + Math.min(...item.years) + '-' + Math.max(...item.years);
      h += '<p class="meta">' + esc(yearRange) + '</p>';
    }
    
    // Units within year groups
    if (item.units && Array.isArray(item.units) && item.units.length > 0) {
      h += '<p class="meta">' + item.units.length + ' units</p>';
    }
    
    if (url) h += '<a class="link" href="' + esc(url) + '" target="_blank" onclick="openOnOakWebsite(event, \\'' + esc(url) + '\\')">View on Oak →</a>';
    h += '</div>';
  });
  
  if (items.length > maxItems) {
    h += '<p class="meta" style="text-align:center;margin-top:8px">+' + (items.length - maxItems) + ' more</p>';
  }
  
  h += '</div></div>';
  return h;
}
`.trim();
