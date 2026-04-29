import type { KeyStage, SearchSubjectSlug } from '../../types/oak';
import type { LessonSkipReason } from './ingestion-events';

interface SkippedUnit {
  unitSlug: string;
  unitTitle: string;
  subject: SearchSubjectSlug;
  keyStage: KeyStage;
}

interface SkippedLessonGroup {
  unitSlug: string;
  unitTitle: string;
  lessonCount: number;
  lessonSlugs: string[];
  subject: SearchSubjectSlug;
  keyStage: KeyStage;
}

/**
 * Information about an individual lesson that was skipped during ingestion.
 *
 * This captures lessons that failed individually (e.g., 404 from lesson summary),
 * as opposed to lessons skipped because their parent unit was unavailable.
 */
interface SkippedLesson {
  /** The lesson slug that was skipped. */
  lessonSlug: string;
  /** The unit slug containing the lesson. */
  unitSlug: string;
  /** The subject of the lesson. */
  subject: SearchSubjectSlug;
  /** The key stage of the lesson. */
  keyStage: KeyStage;
  /** The reason the lesson was skipped. */
  reason: LessonSkipReason;
  /** HTTP status code if applicable. */
  httpStatus?: number;
}

export interface DataIntegrityReport {
  skippedUnits: SkippedUnit[];
  skippedLessonGroups: SkippedLessonGroup[];
  /** Individual lessons that were skipped due to fetch failures. */
  skippedLessons: SkippedLesson[];
}

export function createDataIntegrityCollector(): DataIntegrityReport {
  return {
    skippedUnits: [],
    skippedLessonGroups: [],
    skippedLessons: [],
  };
}

export function hasDataIntegrityIssues(report: DataIntegrityReport): boolean {
  return (
    report.skippedUnits.length > 0 ||
    report.skippedLessonGroups.length > 0 ||
    report.skippedLessons.length > 0
  );
}

export function getDataIntegritySummary(report: DataIntegrityReport): {
  totalSkippedUnits: number;
  totalSkippedLessons: number;
  skippedLessonsByReason: Map<LessonSkipReason, number>;
  affectedSubjects: Set<SearchSubjectSlug>;
  affectedKeyStages: Set<KeyStage>;
} {
  const totalSkippedUnits = report.skippedUnits.length;
  // Total skipped lessons = lessons in skipped groups + individually skipped lessons
  const lessonsInSkippedGroups = report.skippedLessonGroups.reduce(
    (sum, group) => sum + group.lessonCount,
    0,
  );
  const totalSkippedLessons = lessonsInSkippedGroups + report.skippedLessons.length;

  // Count skipped lessons by reason
  const skippedLessonsByReason = new Map<LessonSkipReason, number>();
  for (const lesson of report.skippedLessons) {
    const current = skippedLessonsByReason.get(lesson.reason) ?? 0;
    skippedLessonsByReason.set(lesson.reason, current + 1);
  }

  const affectedSubjects = new Set([
    ...report.skippedUnits.map((u) => u.subject),
    ...report.skippedLessonGroups.map((g) => g.subject),
    ...report.skippedLessons.map((l) => l.subject),
  ]);
  const affectedKeyStages = new Set([
    ...report.skippedUnits.map((u) => u.keyStage),
    ...report.skippedLessonGroups.map((g) => g.keyStage),
    ...report.skippedLessons.map((l) => l.keyStage),
  ]);

  return {
    totalSkippedUnits,
    totalSkippedLessons,
    skippedLessonsByReason,
    affectedSubjects,
    affectedKeyStages,
  };
}
