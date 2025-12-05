import { generateCanonicalUrl, isKeyStage, isSubject } from '@oaknational/oak-curriculum-sdk';
import type { KeyStage, SearchSubjectSlug } from '../types/oak';
import type { OakClient, SubjectSequenceEntry } from '../adapters/oak-adapter-sdk';
import { type SequenceFacetSource } from './indexing/sequence-facets';
import {
  buildSequenceFacetOps,
  buildSequenceFacetSources,
  type SequenceFacetProcessingMetrics,
} from './indexing/sequence-facet-index';
import {
  buildLessonDocuments,
  buildRollupDocuments,
  buildUnitDocuments,
} from './indexing/index-bulk-helpers';
import { sandboxLogger } from './logger';

/** CLI-friendly log helper for progress reporting */
function progressLog(message: string): void {
  const timestamp = new Date().toISOString().slice(11, 19);
  console.log(`[${timestamp}] ${message}`);
}

export interface BuildIndexBulkOpsOptions {
  readonly onSequenceFacetProcessed?: (
    details: SequenceFacetProcessingMetrics & { subject: SearchSubjectSlug },
  ) => void;
}

export async function buildIndexBulkOps(
  client: OakClient,
  keyStages: readonly string[],
  subjects: readonly string[],
  options?: BuildIndexBulkOpsOptions,
): Promise<unknown[]> {
  const bulkOps: unknown[] = [];
  const filteredSubjects = filterSubjects(subjects);
  const filteredKeyStages = filterKeyStages(keyStages);

  progressLog(
    `Starting bulk ops build: ${filteredSubjects.length} subjects × ${filteredKeyStages.length} key stages`,
  );
  sandboxLogger.info('buildIndexBulkOps.start', {
    subjectCount: filteredSubjects.length,
    keyStageCount: filteredKeyStages.length,
  });

  let subjectIndex = 0;
  for (const subject of filteredSubjects) {
    subjectIndex++;
    progressLog(`[${subjectIndex}/${filteredSubjects.length}] Processing subject: ${subject}`);

    progressLog(`  Fetching sequences for ${subject}...`);
    const subjectSequences = await client.getSubjectSequences(subject);
    progressLog(`  Found ${subjectSequences.length} sequences`);

    const events: SequenceFacetProcessingMetrics[] = [];
    progressLog(`  Building sequence facet sources...`);
    const sequenceSources = await buildSequenceFacetSources(
      (slug) => client.getSequenceUnits(slug),
      subjectSequences,
      options?.onSequenceFacetProcessed
        ? {
            instrumentation: {
              record(details) {
                events.push(details);
              },
            },
          }
        : undefined,
    );
    progressLog(`  Sequence facet sources built`);

    if (options?.onSequenceFacetProcessed) {
      for (const event of events) {
        options.onSequenceFacetProcessed({ ...event, subject });
      }
    }

    let ksIndex = 0;
    for (const ks of filteredKeyStages) {
      ksIndex++;
      progressLog(`  [${ksIndex}/${filteredKeyStages.length}] Processing ${subject}/${ks}...`);
      const pairOps = await buildOpsForPair(client, ks, subject, subjectSequences, sequenceSources);
      bulkOps.push(...pairOps);
      progressLog(`    Generated ${pairOps.length} bulk operations`);
    }
  }

  progressLog(`Bulk ops build complete: ${bulkOps.length} total operations`);
  sandboxLogger.info('buildIndexBulkOps.complete', { totalOps: bulkOps.length });
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
  progressLog(`    Fetching units and lessons for ${subject}/${ks}...`);
  const [units, groups] = await Promise.all([
    client.getUnitsByKeyStageAndSubject(ks, subject),
    client.getLessonsByKeyStageAndSubject(ks, subject),
  ]);
  progressLog(`    Found ${units.length} units, ${groups.length} lesson groups`);

  const subjectProgrammesUrl = generateCanonicalUrl('subject', subject, {
    subject: { keyStageSlugs: [ks] },
  });
  if (!subjectProgrammesUrl) {
    throw new Error(`Missing subject programmes canonical URL for ${subject}/${ks}`);
  }

  progressLog(`    Building unit documents...`);
  const { unitSummaries, unitOps } = await buildUnitDocuments(
    client,
    units,
    subject,
    ks,
    subjectProgrammesUrl,
  );
  progressLog(`    Built ${unitOps.length / 2} unit docs`);

  progressLog(`    Building lesson documents (this may take a while)...`);
  const { lessonOps, rollupSnippets } = await buildLessonDocuments(
    client,
    groups,
    unitSummaries,
    subject,
    ks,
  );
  progressLog(`    Built ${lessonOps.length / 2} lesson docs`);

  progressLog(`    Building rollup documents...`);
  const rollupOps = buildRollupDocuments(
    unitSummaries,
    rollupSnippets,
    subject,
    ks,
    subjectProgrammesUrl,
  );
  progressLog(`    Built ${rollupOps.length / 2} rollup docs`);

  const sequenceFacetOps = buildSequenceFacetOps({
    subject,
    keyStage: ks,
    sequences: subjectSequences,
    sequenceSources,
    unitSummaries,
  });

  return [...unitOps, ...lessonOps, ...rollupOps, ...sequenceFacetOps];
}
