import type { KeyStage, SearchSubjectSlug } from '../../types/oak';

export interface SkippedUnit {
  unitSlug: string;
  unitTitle: string;
  subject: SearchSubjectSlug;
  keyStage: KeyStage;
}

export interface SkippedLessonGroup {
  unitSlug: string;
  unitTitle: string;
  lessonCount: number;
  lessonSlugs: string[];
  subject: SearchSubjectSlug;
  keyStage: KeyStage;
}

export interface DataIntegrityReport {
  skippedUnits: SkippedUnit[];
  skippedLessonGroups: SkippedLessonGroup[];
}

export function createDataIntegrityCollector(): DataIntegrityReport {
  return {
    skippedUnits: [],
    skippedLessonGroups: [],
  };
}

export function hasDataIntegrityIssues(report: DataIntegrityReport): boolean {
  return report.skippedUnits.length > 0 || report.skippedLessonGroups.length > 0;
}

export function getDataIntegritySummary(report: DataIntegrityReport): {
  totalSkippedUnits: number;
  totalSkippedLessons: number;
  affectedSubjects: Set<SearchSubjectSlug>;
  affectedKeyStages: Set<KeyStage>;
} {
  const totalSkippedUnits = report.skippedUnits.length;
  const totalSkippedLessons = report.skippedLessonGroups.reduce(
    (sum, group) => sum + group.lessonCount,
    0,
  );
  const affectedSubjects = new Set([
    ...report.skippedUnits.map((u) => u.subject),
    ...report.skippedLessonGroups.map((g) => g.subject),
  ]);
  const affectedKeyStages = new Set([
    ...report.skippedUnits.map((u) => u.keyStage),
    ...report.skippedLessonGroups.map((g) => g.keyStage),
  ]);

  return {
    totalSkippedUnits,
    totalSkippedLessons,
    affectedSubjects,
    affectedKeyStages,
  };
}
