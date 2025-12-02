/**
 * Entity summary renderer for the widget.
 *
 * Renders detailed views of single entities: lessons, units, or subjects.
 *
 * @see widget-renderer-registry.ts - Registry that routes to this renderer
 */

/**
 * JavaScript function to render entity summary data in the widget.
 *
 * Handles lesson summaries (lessonTitle, keyLearningPoints, lessonKeywords),
 * unit summaries (unitTitle, unitLessons, priorKnowledgeRequirements),
 * and subject details (subjectTitle, sequences, keyStages).
 */
export const ENTITY_SUMMARY_RENDERER = `
function renderEntitySummary(data) {
  let h = '';
  
  // Detect entity type and get title
  const title = data.lessonTitle || data.unitTitle || data.subjectTitle || 'Details';
  const subtitle = [data.subjectTitle, data.keyStageTitle, data.year ? 'Year ' + data.year : ''].filter(Boolean).join(' • ');
  
  // Header section
  h += '<div class="sec"><h2 class="sec-ttl">' + esc(title) + '</h2>';
  if (subtitle && subtitle !== title) h += '<p class="meta">' + esc(subtitle) + '</p>';
  h += '</div>';
  
  // Key Learning Points (lessons)
  if (data.keyLearningPoints && Array.isArray(data.keyLearningPoints) && data.keyLearningPoints.length > 0) {
    h += '<div class="sec"><h2 class="sec-ttl">Key Learning Points<span class="badge">' + data.keyLearningPoints.length + '</span></h2>';
    h += '<ul class="klp-list">';
    data.keyLearningPoints.forEach(p => {
      const point = typeof p === 'string' ? p : (p.keyLearningPoint || '');
      if (point) h += '<li>' + esc(point) + '</li>';
    });
    h += '</ul></div>';
  }
  
  // Keywords (lessons)
  if (data.lessonKeywords && Array.isArray(data.lessonKeywords) && data.lessonKeywords.length > 0) {
    h += '<div class="sec"><h2 class="sec-ttl">Keywords<span class="badge">' + data.lessonKeywords.length + '</span></h2>';
    h += '<dl class="keywords">';
    data.lessonKeywords.forEach(k => {
      h += '<dt>' + esc(k.keyword || '') + '</dt>';
      h += '<dd>' + esc(k.description || '') + '</dd>';
    });
    h += '</dl></div>';
  }
  
  // Prior Knowledge (units)
  if (data.priorKnowledgeRequirements && Array.isArray(data.priorKnowledgeRequirements) && data.priorKnowledgeRequirements.length > 0) {
    h += '<div class="sec"><h2 class="sec-ttl">Prior Knowledge</h2>';
    h += '<ul class="klp-list">';
    data.priorKnowledgeRequirements.forEach(p => {
      h += '<li>' + esc(p) + '</li>';
    });
    h += '</ul></div>';
  }
  
  // National Curriculum Content (units)
  if (data.nationalCurriculumContent && Array.isArray(data.nationalCurriculumContent) && data.nationalCurriculumContent.length > 0) {
    h += '<div class="sec"><h2 class="sec-ttl">National Curriculum</h2>';
    h += '<ul class="klp-list">';
    data.nationalCurriculumContent.forEach(c => {
      h += '<li>' + esc(c) + '</li>';
    });
    h += '</ul></div>';
  }
  
  // Unit Lessons (units)
  if (data.unitLessons && Array.isArray(data.unitLessons) && data.unitLessons.length > 0) {
    h += '<div class="sec"><h2 class="sec-ttl">Lessons<span class="badge">' + data.unitLessons.length + '</span></h2><div class="list">';
    data.unitLessons.forEach(l => {
      const state = l.state === 'published' ? '' : (l.state === 'new' ? ' <span class="badge new">New</span>' : '');
      h += '<div class="item"><p class="item-ttl">' + (l.lessonOrder || '') + '. ' + esc(l.lessonTitle || l.title || '') + state + '</p></div>';
    });
    h += '</div></div>';
  }
  
  // Sequences (subjects)
  if (data.sequences && Array.isArray(data.sequences) && data.sequences.length > 0) {
    h += '<div class="sec"><h2 class="sec-ttl">Sequences<span class="badge">' + data.sequences.length + '</span></h2><div class="list">';
    data.sequences.forEach(s => {
      const years = s.years ? 'Years ' + Math.min(...s.years) + '-' + Math.max(...s.years) : '';
      h += '<div class="item"><p class="item-ttl">' + esc(s.sequenceSlug || s.title || '') + '</p>';
      if (years) h += '<p class="meta">' + esc(years) + '</p>';
      h += '</div>';
    });
    h += '</div></div>';
  }
  
  // Misconceptions (lessons)
  if (data.misconceptionsAndCommonMistakes && Array.isArray(data.misconceptionsAndCommonMistakes) && data.misconceptionsAndCommonMistakes.length > 0) {
    h += '<div class="sec"><h2 class="sec-ttl">Misconceptions</h2><div class="list">';
    data.misconceptionsAndCommonMistakes.forEach(m => {
      h += '<div class="item"><p class="item-ttl">' + esc(m.misconception || '') + '</p>';
      if (m.response) h += '<p class="meta"><strong>Response:</strong> ' + esc(m.response) + '</p>';
      h += '</div>';
    });
    h += '</div></div>';
  }
  
  // Teacher Tips (lessons)
  if (data.teacherTips && Array.isArray(data.teacherTips) && data.teacherTips.length > 0) {
    h += '<div class="sec"><h2 class="sec-ttl">Teacher Tips</h2><div class="list">';
    data.teacherTips.forEach(t => {
      const tip = typeof t === 'string' ? t : (t.teacherTip || '');
      if (tip) h += '<div class="item"><p class="meta">' + esc(tip) + '</p></div>';
    });
    h += '</div></div>';
  }
  
  // Pupil Outcome (lessons)
  if (data.pupilLessonOutcome) {
    h += '<div class="sec"><h2 class="sec-ttl">Pupil Outcome</h2>';
    h += '<p style="margin:0;font-size:14px">' + esc(data.pupilLessonOutcome) + '</p></div>';
  }
  
  // Canonical URL link
  if (data.canonicalUrl) {
    h += '<div class="sec" style="margin-top:16px;padding-top:16px;border-top:1px solid #e0e0e0">';
    h += '<a class="link" href="' + esc(data.canonicalUrl) + '" target="_blank" onclick="openOnOakWebsite(event, \\'' + esc(data.canonicalUrl) + '\\')">View original Oak resource →</a>';
    h += '</div>';
  }
  
  return h || '<div class="empty">No details available.</div>';
}
`.trim();
