import type { KeyStage, SubjectSlug, LessonsIndexDoc, UnitsIndexDoc } from '../types/oak';
import type { OakClient } from '../adapters/oak-adapter-sdk';

export async function buildIndexBulkOps(
  client: OakClient,
  keyStages: readonly string[],
  subjects: readonly string[],
): Promise<unknown[]> {
  const ksList = filterKeyStages(keyStages);
  const subjList = filterSubjects(subjects);
  const bulkOps: unknown[] = [];
  for (const subject of subjList)
    for (const ks of ksList) bulkOps.push(...(await buildOpsForPair(client, ks, subject)));
  return bulkOps;
}

function filterKeyStages(list: readonly string[]): KeyStage[] {
  return list.filter(
    (ks): ks is KeyStage => ks === 'ks1' || ks === 'ks2' || ks === 'ks3' || ks === 'ks4',
  );
}

function filterSubjects(list: readonly string[]): SubjectSlug[] {
  const subjectStrings = [
    'art',
    'citizenship',
    'computing',
    'cooking-nutrition',
    'design-technology',
    'english',
    'french',
    'geography',
    'german',
    'history',
    'maths',
    'music',
    'physical-education',
    'religious-education',
    'rshe-pshe',
    'science',
    'spanish',
  ] as const;
  const subjectSet = new Set<string>(subjectStrings);
  return list.filter((s): s is SubjectSlug => subjectSet.has(s));
}

async function buildOpsForPair(
  client: OakClient,
  ks: KeyStage,
  subject: SubjectSlug,
): Promise<unknown[]> {
  const ops: unknown[] = [];
  const [units, lessonsGrouped] = await Promise.all([
    client.getUnitsByKeyStageAndSubject(ks, subject),
    client.getLessonsByKeyStageAndSubject(ks, subject),
  ]);
  for (const u of units) ops.push(...buildUnitOps(u, subject, ks));
  for (const groupOps of await buildLessonOps(client, lessonsGrouped, subject, ks))
    ops.push(...groupOps);
  return ops;
}

function buildUnitOps(
  u: { unitSlug: string; unitTitle: string },
  subject: SubjectSlug,
  ks: KeyStage,
): unknown[] {
  const unitDoc: UnitsIndexDoc = {
    unit_id: u.unitSlug,
    unit_slug: u.unitSlug,
    unit_title: u.unitTitle,
    subject_slug: subject,
    key_stage: ks,
    lesson_ids: [],
    lesson_count: 0,
  };
  return [{ index: { _index: 'oak_units', _id: unitDoc.unit_id } }, unitDoc];
}

async function buildLessonOps(
  client: OakClient,
  groups: readonly {
    unitSlug: string;
    unitTitle: string;
    lessons: { lessonSlug: string; lessonTitle: string }[];
  }[],
  subject: SubjectSlug,
  ks: KeyStage,
): Promise<unknown[][]> {
  const allOps: unknown[][] = [];
  for (const group of groups) {
    const opsForGroup: unknown[] = [];
    for (const lesson of group.lessons) {
      const transcript = await client.getLessonTranscript(lesson.lessonSlug);
      const doc: LessonsIndexDoc = {
        lesson_id: lesson.lessonSlug,
        lesson_slug: lesson.lessonSlug,
        lesson_title: lesson.lessonTitle,
        subject_slug: subject,
        key_stage: ks,
        unit_ids: [group.unitSlug],
        unit_titles: [group.unitTitle],
        transcript_text: transcript.transcript,
      };
      opsForGroup.push({ index: { _index: 'oak_lessons', _id: doc.lesson_id } }, doc);
    }
    allOps.push(opsForGroup);
  }
  return allOps;
}
