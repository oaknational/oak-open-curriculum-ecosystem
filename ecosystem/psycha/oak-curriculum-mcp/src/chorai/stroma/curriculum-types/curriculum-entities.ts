/**
 * Curriculum Entity Types
 *
 * Core entity types for the Oak Curriculum domain.
 * These types are derived from the Oak Curriculum API schema.
 */

/**
 * Key stage information
 */
export interface KeyStage {
  slug: string;
  title: string;
  shortCode: string;
}

/**
 * Subject information
 */
export interface Subject {
  slug: string;
  title: string;
  shortCode?: string;
}

/**
 * Programme entity
 */
export interface Programme {
  programmeSlug: string;
  subjectTitle: string;
  tierTitle?: string | null;
  tierSlug?: string | null;
  examBoardTitle?: string | null;
  examBoardSlug?: string | null;
  yearTitle: string;
  yearSlug: string;
  unitCount?: number;
  lessonCount?: number;
  keyStage?: KeyStage;
  subject?: Subject;
}

/**
 * Unit entity
 */
export interface Unit {
  unitId: string;
  title: string;
  slug: string;
  nullTitle?: string;
  keyStageSlug: string;
  keyStageTitle: string;
  subjectSlug: string;
  subjectTitle: string;
  yearTitle: string;
  programmeSlug: string;
  optionality?: string;
  unitStudyOrder?: number;
  lessonCount?: number;
  lessons?: Lesson[];
}

/**
 * Lesson entity
 */
export interface Lesson {
  lessonSlug: string;
  lessonTitle: string;
  tierTitle?: string | null;
  tierSlug?: string | null;
  contentGuidance?: string | null;
  misconceptionsAndCommonMistakes?: string | null;
  teacherTips?: string | null;
  lessonKeywords?: string | null;
  copyrightContent?: string | null;
  supervisionLevel?: string | null;
  worksheetUrl?: string | null;
  presentationUrl?: string | null;
  videoMuxPlaybackId?: string | null;
  videoWithSignLanguageMuxPlaybackId?: string | null;
  transcriptSentences?: string | null;
  isLegacy: boolean;
  unitSlug: string;
  unitTitle: string;
  keyStageSlug: string;
  keyStageTitle: string;
  subjectSlug: string;
  subjectTitle: string;
  yearTitle: string;
  programmeSlug: string;
}
