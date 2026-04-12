#!/usr/bin/env tsx
/**
 * Bulk Data Type Generator
 *
 * Parses bulk download data and generates:
 * 1. TypeScript union types for valid lesson slugs
 * 2. Zod schemas for ground truth validation
 *
 * Run with: pnpm bulk:codegen
 */

import { readdirSync, readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { ok, err, type Result } from '@oaknational/result';
import {
  parseBulkDataFile,
  extractLessonSlugs,
  parsePhaseFromFilename,
  type BulkDataParseError,
} from './bulk-data-parser';
import {
  buildLessonSlugDataset,
  emitAllLessonSlugTypes,
  emitLessonSlugDatasetTypes,
  type ParsedBulkData,
} from './type-emitter';
import { emitGroundTruthSchemas } from './schema-emitter';

// ============================================================================
// Types
// ============================================================================

/**
 * Options for the generator.
 */
interface GeneratorOptions {
  /** Path to bulk downloads directory */
  readonly bulkDir: string;
  /** Path to output directory */
  readonly outputDir: string;
  /** Whether to output verbose logs */
  readonly verbose: boolean;
}

/**
 * Result of running the generator.
 */
interface GenerationResult {
  /** Number of subjects processed */
  readonly subjectsProcessed: number;
  /** Total lesson count across all subjects */
  readonly totalLessons: number;
  /** Files written */
  readonly filesWritten: readonly string[];
}

/**
 * Error during generation.
 */
interface GenerationError {
  readonly kind: 'io_error' | 'parse_error' | 'validation_error';
  readonly message: string;
  readonly file?: string;
  readonly cause?: unknown;
}

// ============================================================================
// File I/O
// ============================================================================

/**
 * Reads all bulk data JSON files from the directory.
 */
function readBulkDataFiles(
  bulkDir: string,
): Result<readonly { filename: string; content: string }[], GenerationError> {
  try {
    const files = readdirSync(bulkDir).filter((f) => {
      // Only process files with -primary.json or -secondary.json suffix
      return f.endsWith('-primary.json') || f.endsWith('-secondary.json');
    });

    const results: { filename: string; content: string }[] = [];
    for (const filename of files) {
      const filepath = join(bulkDir, filename);
      const content = readFileSync(filepath, 'utf-8');
      results.push({ filename, content });
    }

    return ok(results);
  } catch (e) {
    return err({
      kind: 'io_error',
      message: `Failed to read bulk data files: ${e instanceof Error ? e.message : String(e)}`,
      cause: e,
    });
  }
}

/**
 * Ensures the output directory exists.
 */
function ensureOutputDir(outputDir: string): Result<void, GenerationError> {
  try {
    mkdirSync(outputDir, { recursive: true });
    return ok(undefined);
  } catch (e) {
    return err({
      kind: 'io_error',
      message: `Failed to create output directory: ${e instanceof Error ? e.message : String(e)}`,
      cause: e,
    });
  }
}

/**
 * Writes a file to the output directory.
 */
function writeOutputFile(
  outputDir: string,
  filename: string,
  content: string,
): Result<string, GenerationError> {
  const filepath = join(outputDir, filename);
  try {
    writeFileSync(filepath, content, 'utf-8');
    return ok(filepath);
  } catch (e) {
    return err({
      kind: 'io_error',
      message: `Failed to write ${filename}: ${e instanceof Error ? e.message : String(e)}`,
      file: filepath,
      cause: e,
    });
  }
}

// ============================================================================
// Parsing
// ============================================================================

/**
 * Parses all bulk data files into ParsedBulkData.
 */
function parseAllBulkData(
  files: readonly { filename: string; content: string }[],
): Result<readonly ParsedBulkData[], GenerationError> {
  const results: ParsedBulkData[] = [];
  const errors: { filename: string; error: BulkDataParseError }[] = [];

  for (const { filename, content } of files) {
    const parseResult = parseBulkDataFile(content);

    if (!parseResult.ok) {
      errors.push({ filename, error: parseResult.error });
      continue;
    }

    const phase = parsePhaseFromFilename(filename);
    if (phase === null) {
      errors.push({
        filename,
        error: { kind: 'validation_error', message: 'Could not determine phase from filename' },
      });
      continue;
    }

    const data = parseResult.value;
    const slugs = extractLessonSlugs(data);

    // Extract subject from sequence slug (e.g., "maths-primary" -> "maths")
    const subject = data.sequenceSlug.replace(`-${phase}`, '');

    results.push({
      subject,
      phase,
      sequenceSlug: data.sequenceSlug,
      lessonSlugs: slugs,
      lessonCount: slugs.length,
    });
  }

  if (errors.length > 0) {
    const errorMessages = errors
      .map(({ filename, error }) => `  ${filename}: ${error.message}`)
      .join('\n');
    return err({
      kind: 'parse_error',
      message: `Failed to parse ${errors.length} file(s):\n${errorMessages}`,
    });
  }

  // Sort by subject then phase for consistent output
  results.sort((a, b) => {
    const subjectCmp = a.subject.localeCompare(b.subject);
    if (subjectCmp !== 0) {
      return subjectCmp;
    }
    return a.phase.localeCompare(b.phase);
  });

  return ok(results);
}

// ============================================================================
// Generation
// ============================================================================

/**
 * Generates the index.ts re-export file.
 */
function generateIndexFile(): string {
  return `/**
 * Generated ground truth types and schemas.
 *
 * @generated - DO NOT EDIT
 */

/* eslint-disable no-restricted-syntax */
// export * is acceptable here as this is a generated barrel file

// Lesson slug validation data (Sets, type guards, branded types)
export * from './lesson-slugs-by-subject';

// Zod schemas for ground truth validation
export * from './ground-truth-schemas';

// Bulk data metadata
export * from './bulk-data-manifest';
`;
}

/**
 * Generates the manifest file with generation metadata.
 */
function generateManifestFile(allData: readonly ParsedBulkData[]): string {
  const lines: string[] = [];

  lines.push('/**');
  lines.push(' * Bulk data manifest with generation metadata.');
  lines.push(' *');
  lines.push(' * @generated - DO NOT EDIT');
  lines.push(` * Generated at: ${new Date().toISOString()}`);
  lines.push(' */');
  lines.push('');

  lines.push('/**');
  lines.push(' * Metadata for a subject/phase combination.');
  lines.push(' */');
  lines.push('interface SubjectPhaseMetadata {');
  lines.push('  readonly subject: string;');
  lines.push("  readonly phase: 'primary' | 'secondary';");
  lines.push('  readonly sequenceSlug: string;');
  lines.push('  readonly lessonCount: number;');
  lines.push('}');
  lines.push('');

  lines.push('/**');
  lines.push(' * All subject/phase combinations in the bulk data.');
  lines.push(' */');
  lines.push('export const BULK_DATA_MANIFEST: readonly SubjectPhaseMetadata[] = [');
  for (const data of allData) {
    lines.push('  {');
    lines.push(`    subject: '${data.subject}',`);
    lines.push(`    phase: '${data.phase}',`);
    lines.push(`    sequenceSlug: '${data.sequenceSlug}',`);
    lines.push(`    lessonCount: ${data.lessonCount},`);
    lines.push('  },');
  }
  lines.push('] as const;');
  lines.push('');

  lines.push(`/** Number of subject/phase combinations */`);
  lines.push(`export const SUBJECT_PHASE_COUNT = ${allData.length} as const;`);

  return lines.join('\n');
}

/**
 * Main generator function.
 */
export async function generateGroundTruthTypes(
  options: GeneratorOptions,
): Promise<Result<GenerationResult, GenerationError>> {
  const { bulkDir, outputDir, verbose } = options;

  if (verbose) {
    console.log(`Reading bulk data from: ${bulkDir}`);
  }

  // Step 1: Read bulk files
  const filesResult = readBulkDataFiles(bulkDir);
  if (!filesResult.ok) {
    return filesResult;
  }

  if (verbose) {
    console.log(`Found ${filesResult.value.length} bulk data files`);
  }

  // Step 2: Parse all files
  const parseResult = parseAllBulkData(filesResult.value);
  if (!parseResult.ok) {
    return parseResult;
  }

  const allData = parseResult.value;
  const totalLessons = allData.reduce((sum, d) => sum + d.lessonCount, 0);

  if (verbose) {
    console.log(`Parsed ${allData.length} subject/phase combinations`);
    console.log(`Total lessons: ${totalLessons}`);
  }

  // Step 3: Ensure output directory exists
  const dirResult = ensureOutputDir(outputDir);
  if (!dirResult.ok) {
    return dirResult;
  }

  // Step 4: Generate and write files
  const filesWritten: string[] = [];

  const lessonSlugDataset = buildLessonSlugDataset(allData);

  // Write lesson-slugs-by-subject loader + data files
  const typesContent = emitAllLessonSlugTypes(allData);
  const typesResult = writeOutputFile(outputDir, 'lesson-slugs-by-subject.ts', typesContent);
  if (!typesResult.ok) {
    return typesResult;
  }
  filesWritten.push(typesResult.value);

  const datasetTypesContent = emitLessonSlugDatasetTypes();
  const datasetTypesResult = writeOutputFile(
    outputDir,
    'lesson-slugs-by-subject.types.ts',
    datasetTypesContent,
  );
  if (!datasetTypesResult.ok) {
    return datasetTypesResult;
  }
  filesWritten.push(datasetTypesResult.value);

  const datasetJsonResult = writeOutputFile(
    outputDir,
    'lesson-slugs-by-subject.data.json',
    JSON.stringify(lessonSlugDataset, null, 2),
  );
  if (!datasetJsonResult.ok) {
    return datasetJsonResult;
  }
  filesWritten.push(datasetJsonResult.value);

  // Write ground-truth-schemas.ts
  const schemasContent = emitGroundTruthSchemas();
  const schemasResult = writeOutputFile(outputDir, 'ground-truth-schemas.ts', schemasContent);
  if (!schemasResult.ok) {
    return schemasResult;
  }
  filesWritten.push(schemasResult.value);

  // Write bulk-data-manifest.ts
  const manifestContent = generateManifestFile(allData);
  const manifestResult = writeOutputFile(outputDir, 'bulk-data-manifest.ts', manifestContent);
  if (!manifestResult.ok) {
    return manifestResult;
  }
  filesWritten.push(manifestResult.value);

  // Write index.ts
  const indexContent = generateIndexFile();
  const indexResult = writeOutputFile(outputDir, 'index.ts', indexContent);
  if (!indexResult.ok) {
    return indexResult;
  }
  filesWritten.push(indexResult.value);

  if (verbose) {
    console.log('Generated files:');
    for (const file of filesWritten) {
      console.log(`  ${file}`);
    }
  }

  return ok({
    subjectsProcessed: allData.length,
    totalLessons,
    filesWritten,
  });
}

// ============================================================================
// CLI Entry Point
// ============================================================================

/**
 * Main CLI entry point.
 */
async function main(): Promise<void> {
  const appDir = resolve(import.meta.dirname, '../..');
  const bulkDir = join(appDir, 'bulk-downloads');
  const outputDir = join(appDir, 'ground-truths', 'generated');

  console.log('Bulk Data Type Generator');
  console.log('========================');
  console.log('');

  const result = await generateGroundTruthTypes({
    bulkDir,
    outputDir,
    verbose: true,
  });

  if (!result.ok) {
    console.error('');
    console.error('Generation failed:', result.error.message);
    process.exit(1);
  }

  console.log('');
  console.log('Generation complete!');
  console.log(`  Subjects: ${result.value.subjectsProcessed}`);
  console.log(`  Lessons:  ${result.value.totalLessons}`);
  console.log(`  Files:    ${result.value.filesWritten.length}`);
}

// Run if executed directly
main().catch((e) => {
  console.error('Unexpected error:', e);
  process.exit(1);
});
