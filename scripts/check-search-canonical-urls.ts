import { createOakClient, generateCanonicalUrl } from '@oaknational/oak-curriculum-sdk';

async function main(): Promise<void> {
  const apiKey = process.env.OAK_API_KEY;
  if (!apiKey) {
    throw new Error('Set OAK_API_KEY');
  }

  const client = createOakClient(apiKey);
  const keyStage = 'ks3';
  const subject = 'geography';

  const lessonsRes = await client.GET('/key-stages/{keyStage}/subject/{subject}/lessons', {
    params: { path: { keyStage, subject } },
  });
  const unitsRes = await client.GET('/key-stages/{keyStage}/subject/{subject}/units', {
    params: { path: { keyStage, subject } },
  });
  const sequencesRes = await client.GET('/subjects/{subject}/sequences', {
    params: { path: { subject } },
  });

  if (!lessonsRes.data?.[0]?.lessons?.[0]) {
    throw new Error('No lesson data found for sanity check.');
  }
  if (!unitsRes.data?.[0]) {
    throw new Error('No unit data found for sanity check.');
  }
  if (!sequencesRes.data?.[0]) {
    throw new Error('No sequence data found for sanity check.');
  }

  const firstLesson = lessonsRes.data[0]!.lessons[0]!;
  const firstUnit = unitsRes.data[0]!;
  const lessonSlug = firstLesson.lessonSlug;
  const unitSlug = firstUnit.unitSlug;
  const phaseSlug = 'secondary';
  const sequenceSlug = sequencesRes.data[0]!.sequenceSlug;

  const lessonUrl = generateCanonicalUrl('lesson', lessonSlug);
  const unitUrl = generateCanonicalUrl('unit', unitSlug, {
    unit: { subjectSlug: subject, phaseSlug },
  });
  const sequenceUrl = generateCanonicalUrl('sequence', sequenceSlug);
  const subjectUrl = generateCanonicalUrl('subject', subject, {
    subject: { keyStageSlugs: [keyStage] },
  });

  const urls = [lessonUrl, unitUrl, sequenceUrl, subjectUrl];
  console.log('Checking canonical URLs:', urls);

  for (const url of urls) {
    if (!url) {
      throw new Error('Missing canonical URL');
    }
    const res = await fetch(url, { method: 'HEAD' });
    if (!res.ok) {
      throw new Error(`URL check failed: ${url} returned ${res.status}`);
    }
  }

  console.log('All canonical URLs reachable.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
