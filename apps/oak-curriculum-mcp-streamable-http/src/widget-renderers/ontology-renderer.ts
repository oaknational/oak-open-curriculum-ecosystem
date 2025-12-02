/**
 * Ontology content renderer for the widget.
 *
 * Renders a human-friendly summary of the Oak Curriculum domain model
 * with curated relationships and external links. The full JSON data
 * remains available for AI agents in _meta.fullResults.
 *
 * @see widget-renderer-registry.ts - Registry that routes to this renderer
 */

/**
 * JavaScript function to render ontology content in the widget.
 *
 * Handles the ontologyData shape from get-ontology tool:
 * - curriculumStructure: { keyStages, phases, subjects }
 * - entityHierarchy: { description, levels }
 * - threads: { definition, examples }
 * - workflows: { findLessons, lessonPlanning, ... }
 */
export const ONTOLOGY_RENDERER = `
function renderOntology(o) {
  let h = '';

  // Quick Links section with external resources
  h += '<div class="sec"><h2 class="sec-ttl">Oak Curriculum</h2>';
  h += '<p style="margin:0 0 12px;font-size:14px">The Oak Curriculum covers Key Stages 1-4 across 20+ subjects, aligned to the National Curriculum for England.</p>';
  h += '<div style="display:flex;gap:8px;flex-wrap:wrap">';
  h += '<a class="link" href="https://www.thenational.academy/teachers/curriculum" target="_blank" onclick="openOnOakWebsite(event, \\'https://www.thenational.academy/teachers/curriculum\\')">Browse Curriculum \\u2192</a>';
  h += '<a class="link" href="https://open-api.thenational.academy/docs/about-oaks-data/ontology-diagrams" target="_blank" onclick="openOnOakWebsite(event, \\'https://open-api.thenational.academy/docs/about-oaks-data/ontology-diagrams\\')">View Data Model \\u2192</a>';
  h += '</div></div>';

  // Key Stages summary
  if (o.curriculumStructure?.keyStages) {
    const ks = o.curriculumStructure.keyStages;
    h += '<div class="sec"><h2 class="sec-ttl">Key Stages<span class="badge">' + ks.length + '</span></h2><div class="list">';
    ks.forEach(k => {
      h += '<div class="item"><p class="item-ttl">' + esc(k.name) + ' (' + esc(k.slug) + ')</p>';
      h += '<p class="meta">' + esc(k.phase) + ' \\u2022 Ages ' + esc(k.ageRange) + ' \\u2022 Years ' + (k.years || []).join(', ') + '</p>';
      if (k.description) h += '<p class="meta">' + esc(k.description) + '</p>';
      h += '</div>';
    });
    h += '</div></div>';
  }

  // Entity Hierarchy
  if (o.entityHierarchy?.levels) {
    h += '<div class="sec"><h2 class="sec-ttl">Content Hierarchy</h2>';
    h += '<p style="margin:0 0 8px;font-size:13px;color:#666">' + esc(o.entityHierarchy.description || 'Curriculum content is organised in a hierarchy') + '</p>';
    h += '<div class="list">';
    o.entityHierarchy.levels.forEach(lvl => {
      h += '<div class="item"><p class="item-ttl">' + esc(lvl.entity) + '</p>';
      h += '<p class="meta">Contains: ' + esc(lvl.contains || '') + '</p>';
      if (lvl.example) h += '<p class="meta">Example: <code>' + esc(lvl.example) + '</code></p>';
      h += '</div>';
    });
    h += '</div></div>';
  }

  // Threads concept
  if (o.threads) {
    h += '<div class="sec"><h2 class="sec-ttl">Threads</h2>';
    h += '<p style="margin:0 0 8px;font-size:13px">' + esc(o.threads.definition || '') + '</p>';
    if (o.threads.importance) h += '<p style="margin:0 0 8px;font-size:13px;font-style:italic">' + esc(o.threads.importance) + '</p>';
    if (o.threads.examples?.length) {
      h += '<div class="list">';
      o.threads.examples.slice(0,3).forEach(ex => {
        h += '<div class="item"><p class="item-ttl">' + esc(ex.slug) + ' (' + esc(ex.subject) + ')</p>';
        h += '<p class="meta">' + esc(ex.spans || '') + '</p>';
        if (ex.progression) h += '<p class="meta">' + esc(ex.progression) + '</p>';
        h += '</div>';
      });
      h += '</div>';
    }
    h += '</div>';
  }

  // Tool workflows summary
  if (o.workflows) {
    const workflows = Object.entries(o.workflows);
    if (workflows.length > 0) {
      h += '<div class="sec"><h2 class="sec-ttl">Workflows<span class="badge">' + workflows.length + '</span></h2><div class="list">';
      workflows.forEach(([, wf]) => {
        if (wf.title || wf.description) {
          h += '<div class="item"><p class="item-ttl">' + esc(wf.title || wf.description) + '</p>';
          if (wf.description && wf.title) h += '<p class="meta">' + esc(wf.description) + '</p>';
          if (wf.steps?.length) h += '<p class="meta">' + wf.steps.length + ' steps</p>';
          h += '</div>';
        }
      });
      h += '</div></div>';
    }
  }

  return h || '<div class="empty">No ontology data available.</div>';
}
`.trim();
