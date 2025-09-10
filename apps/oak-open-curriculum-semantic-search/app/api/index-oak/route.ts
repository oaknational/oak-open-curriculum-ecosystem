import { NextRequest, NextResponse } from 'next/server';
import { env } from '@lib/env';
import type { KeyStage, SubjectSlug, LessonsIndexDoc, UnitsIndexDoc } from '@types/oak';
import { createOakSdkClient } from '@adapters/oak-adapter-sdk';
import { KEY_STAGES, SUBJECTS, isKeyStage, isSubject } from '@adapters/sdk-guards';
import { esBulk } from '@lib/elastic-http';
import { getRateLimit } from '@lib/rate-limit';

/** Guard header check */
function authorize(req: NextRequest): boolean {
  const k = req.headers.get('x-api-key');
  return typeof k === 'string' && k.length > 0 && k === env().SEARCH_API_KEY;
}

export const maxDuration = 300;

export async function GET(req: NextRequest): Promise<Response> {
  if (!authorize(req)) return new NextResponse('Unauthorized', { status: 401 });

  // Optional: peek at rate limit (free endpoint)
  try {
    await getRateLimit();
  } catch {
    /* ignore */
  }

  const client = createOakSdkClient();

  const keyStages: KeyStage[] = (KEY_STAGES as readonly unknown[]).filter(isKeyStage);
  const subjects: SubjectSlug[] = (SUBJECTS as readonly unknown[]).filter(isSubject);

  const bulkOps: unknown[] = [];

  for (const subject of subjects) {
    for (const ks of keyStages) {
      try {
        const units = await client.getUnitsByKeyStageAndSubject(ks, subject);
        const lessonsGrouped = await client.getLessonsByKeyStageAndSubject(ks, subject);

        for (const u of units) {
          const unitDoc: UnitsIndexDoc = {
            unit_id: u.unitSlug,
            unit_slug: u.unitSlug,
            unit_title: u.unitTitle,
            subject_slug: subject,
            key_stage: ks,
            lesson_ids: [],
            lesson_count: 0,
          };
          bulkOps.push({ index: { _index: 'oak_units', _id: unitDoc.unit_id } }, unitDoc);
        }

        for (const group of lessonsGrouped) {
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
            bulkOps.push({ index: { _index: 'oak_lessons', _id: doc.lesson_id } }, doc);
          }
        }
      } catch {
        // Consider structured logging
      }
    }
  }

  if (bulkOps.length > 0) await esBulk(bulkOps);
  return NextResponse.json({ ok: true, indexedDocs: bulkOps.length / 2 });
}
