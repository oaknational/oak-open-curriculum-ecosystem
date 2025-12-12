/**
 * Exam board synonyms.
 *
 * Maps canonical exam board slugs to alternative terms users might use.
 *
 * @module synonyms/exam-boards
 */

export const examBoardSynonyms = {
  aqa: ['aqa exam board', 'assessment and qualifications alliance'],
  edexcel: ['pearson', 'pearson edexcel'],
  ocr: ['ocr exam board', 'oxford cambridge rsa'],
  wjec: ['wjec eduqas', 'eduqas'],
} as const;

export type ExamBoardSynonyms = typeof examBoardSynonyms;
