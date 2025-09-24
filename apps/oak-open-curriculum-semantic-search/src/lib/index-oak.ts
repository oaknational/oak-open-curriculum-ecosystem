import { generateCanonicalUrl, isKeyStage, isSubject } from '@oaknational/oak-curriculum-sdk';
import type { KeyStage, SearchSubjectSlug } from '../types/oak';
import type { OakClient, SubjectSequenceEntry } from '../adapters/oak-adapter-sdk';
import { type SequenceFacetSource } from './indexing/sequence-facets';
import { buildSequenceFacetOps, buildSequenceFacetSources } from './indexing/sequence-facet-index';
import {
  buildLessonDocuments,
  buildRollupDocuments,
  buildUnitDocuments,
} from './indexing/index-bulk-helpers';

export async function buildIndexBulkOps(
  client: OakClient,
  keyStages: readonly string[],
  subjects: readonly string[],
): Promise<unknown[]> {
  const bulkOps: unknown[] = [];
  for (const subject of filterSubjects(subjects)) {
    const subjectSequences = await client.getSubjectSequences(subject);
    const sequenceSources = await buildSequenceFacetSources(
      (slug) => client.getSequenceUnits(slug),
      subjectSequences,
    );
    for (const ks of filterKeyStages(keyStages)) {
      bulkOps.push(
        ...(await buildOpsForPair(client, ks, subject, subjectSequences, sequenceSources)),
      );
    }
  }
  return bulkOps;
}

function filterKeyStages(list: readonly string[]): KeyStage[] {
  return list.filter((ks): ks is KeyStage => isKeyStage(ks));
}

function filterSubjects(list: readonly string[]): SearchSubjectSlug[] {
  return list.filter((s): s is SearchSubjectSlug => isSubject(s));
}

async function buildOpsForPair(
  client: OakClient,
  ks: KeyStage,
  subject: SearchSubjectSlug,
  subjectSequences: readonly SubjectSequenceEntry[],
  sequenceSources: ReadonlyMap<string, SequenceFacetSource>,
): Promise<unknown[]> {
  const [units, groups] = await Promise.all([
    client.getUnitsByKeyStageAndSubject(ks, subject),
    client.getLessonsByKeyStageAndSubject(ks, subject),
  ]);

  const subjectProgrammesUrl = generateCanonicalUrl('subject', subject, {
    subject: { keyStageSlugs: [ks] },
  });
  if (!subjectProgrammesUrl) {
    throw new Error(`Missing subject programmes canonical URL for ${subject}/${ks}`);
  }

  const { unitSummaries, unitOps } = await buildUnitDocuments(
    client,
    units,
    subject,
    ks,
    subjectProgrammesUrl,
  );
  const { lessonOps, rollupSnippets } = await buildLessonDocuments(
    client,
    groups,
    unitSummaries,
    subject,
    ks,
  );
  const rollupOps = buildRollupDocuments(
    unitSummaries,
    rollupSnippets,
    subject,
    ks,
    subjectProgrammesUrl,
  );
  const sequenceFacetOps = buildSequenceFacetOps({
    subject,
    keyStage: ks,
    sequences: subjectSequences,
    sequenceSources,
    unitSummaries,
  });

  return [...unitOps, ...lessonOps, ...rollupOps, ...sequenceFacetOps];
}
