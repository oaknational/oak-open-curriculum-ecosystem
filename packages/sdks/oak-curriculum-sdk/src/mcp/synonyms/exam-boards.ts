/**
 * Exam board synonyms.
 *
 * Maps canonical exam board slugs to alternative terms users might use.
 *
 * Sources:
 * - OWA: reference/Oak-Web-Application/src/context/Search/suggestions/oakCurriculumData.ts
 */

export const examBoardSynonyms = {
  aqa: ['aqa exam board', 'assessment and qualifications alliance'],
  edexcel: ['pearson', 'pearson edexcel', 'edexcel exam board'],
  edexcelb: ['edexcel b', 'pearson edexcel b'],
  eduqas: ['wjec eduqas', 'wjec', 'eduqas exam board'],
  ocr: ['ocr exam board', 'oxford cambridge rsa', 'oxford cambridge and rsa'],
} as const;

export type ExamBoardSynonyms = typeof examBoardSynonyms;
