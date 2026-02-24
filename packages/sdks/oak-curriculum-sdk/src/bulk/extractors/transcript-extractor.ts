/**
 * Transcript extractor for bulk download data.
 *
 * @remarks
 * Extracts video transcript content from lessons. Transcripts provide
 * rich semantic content for search indexing and can be mined for
 * additional vocabulary and concepts.

 */

import type { Lesson } from '@oaknational/curriculum-sdk-generation/bulk';

/**
 * Individual transcript sentence with timing (if available from VTT).
 */
export interface TranscriptSentence {
  /** The sentence text */
  readonly text: string;
  /** Sentence index in the transcript */
  readonly index: number;
}

/**
 * Extracted transcript with lesson context.
 */
export interface ExtractedTranscript {
  /** Lesson slug for reference */
  readonly lessonSlug: string;
  /** Lesson title for context */
  readonly lessonTitle: string;
  /** Unit slug for grouping */
  readonly unitSlug: string;
  /** Subject slug for filtering */
  readonly subjectSlug: string;
  /** Key stage slug for filtering */
  readonly keyStageSlug: string;
  /** Array of transcript sentences */
  readonly sentences: readonly TranscriptSentence[];
  /** Full transcript as single string (sentences joined) */
  readonly fullText: string;
  /** Word count for statistics */
  readonly wordCount: number;
  /** Whether VTT caption data is available */
  readonly hasVtt: boolean;
}

/**
 * Extracts transcripts from an array of lessons.
 *
 * @param lessons - Array of lessons from bulk download
 * @returns Array of extracted transcripts with context
 *
 * @remarks
 * The bulk download stores transcripts as a single string with newline-separated
 * sentences. This function parses them into individual sentences.
 *
 * @example
 * ```ts
 * const transcripts = extractTranscripts(bulkData.lessons);
 * const totalWords = transcripts.reduce((sum, t) => sum + t.wordCount, 0);
 * console.log(`Total transcript words: ${totalWords}`);
 * ```
 */
export function extractTranscripts(lessons: readonly Lesson[]): readonly ExtractedTranscript[] {
  const results: ExtractedTranscript[] = [];

  for (const lesson of lessons) {
    // Skip lessons without transcripts
    if (!lesson.transcript_sentences || lesson.transcript_sentences.length === 0) {
      continue;
    }

    // Transcript is stored as a single string with newline-separated sentences
    const rawTranscript = lesson.transcript_sentences;
    const sentenceTexts = rawTranscript
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const sentences: TranscriptSentence[] = sentenceTexts.map((text, index) => ({
      text,
      index,
    }));

    const fullText = sentenceTexts.join(' ');
    const wordCount = fullText.split(/\s+/).filter((w) => w.length > 0).length;

    // Check if VTT is available (not NULL sentinel)
    const hasVtt =
      typeof lesson.transcript_vtt === 'string' &&
      lesson.transcript_vtt !== 'NULL' &&
      lesson.transcript_vtt.length > 0;

    results.push({
      lessonSlug: lesson.lessonSlug,
      lessonTitle: lesson.lessonTitle,
      unitSlug: lesson.unitSlug,
      subjectSlug: lesson.subjectSlug,
      keyStageSlug: lesson.keyStageSlug,
      sentences,
      fullText,
      wordCount,
      hasVtt,
    });
  }

  return results;
}

/**
 * Extracts unique words from transcripts for vocabulary analysis.
 *
 * @param transcripts - Array of extracted transcripts
 * @param minLength - Minimum word length to include (default: 3)
 * @returns Map of words to their frequency across all transcripts
 */
export function extractTranscriptVocabulary(
  transcripts: readonly ExtractedTranscript[],
  minLength = 3,
): ReadonlyMap<string, number> {
  const wordFrequency = new Map<string, number>();

  for (const transcript of transcripts) {
    const words = transcript.fullText
      .toLowerCase()
      .replace(/[^a-z\s'-]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length >= minLength);

    for (const word of words) {
      wordFrequency.set(word, (wordFrequency.get(word) ?? 0) + 1);
    }
  }

  return wordFrequency;
}
