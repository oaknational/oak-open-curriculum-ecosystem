/**
 * Quiz renderer for the widget.
 *
 * Renders starter and exit quiz questions with correct answer highlighting.
 *
 * @see widget-renderer-registry.ts - Registry that routes to this renderer
 */

/**
 * JavaScript function to render quiz data in the widget.
 *
 * Handles the following data shape:
 * - { starterQuiz?: QuizQuestion[], exitQuiz?: QuizQuestion[] }
 *
 * Each question has:
 * - question: string
 * - questionType: string
 * - answers: { content: string, distractor: boolean, type: string }[]
 */
export const QUIZ_RENDERER = `
function renderQuiz(data) {
  let h = '';
  
  function renderQuizSection(title, questions) {
    if (!questions || !Array.isArray(questions) || questions.length === 0) return '';
    let s = '<div class="sec"><h2 class="sec-ttl">' + esc(title) + '<span class="badge">' + questions.length + '</span></h2><div class="list">';
    questions.forEach((q, i) => {
      s += '<div class="item quiz-q">';
      s += '<p class="item-ttl"><span class="q-num">' + (i + 1) + '</span>' + esc(q.question || '') + '</p>';
      if (q.answers && Array.isArray(q.answers)) {
        s += '<div class="answers">';
        q.answers.forEach(a => {
          const isCorrect = a.distractor === false;
          const cls = isCorrect ? 'answer correct' : 'answer';
          const icon = isCorrect ? '✓' : '';
          const content = a.content || '';
          s += '<div class="' + cls + '">' + (icon ? '<span class="ans-icon">' + icon + '</span>' : '') + esc(content) + '</div>';
        });
        s += '</div>';
      }
      s += '</div>';
    });
    s += '</div></div>';
    return s;
  }
  
  h += renderQuizSection('Starter Quiz', data.starterQuiz);
  h += renderQuizSection('Exit Quiz', data.exitQuiz);
  
  if (!h) {
    h = '<div class="empty">No quiz data available.</div>';
  }
  
  // Canonical URL link
  if (data.canonicalUrl) {
    h += '<div class="sec" style="margin-top:16px;padding-top:16px;border-top:1px solid #e0e0e0">';
    h += '<a class="link" href="' + esc(data.canonicalUrl) + '" target="_blank" onclick="openOnOakWebsite(event, \\'' + esc(data.canonicalUrl) + '\\')">View original Oak resource →</a>';
    h += '</div>';
  }
  
  return h;
}
`.trim();
