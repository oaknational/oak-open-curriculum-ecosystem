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

import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
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
import {
  checkBulkDataFreshness,
  nodeManifestFsReader,
  type BulkFreshness,
  type ManifestFsReader,
} from '../../src/cli/shared/bulk-freshness.js';

// ============================================================================
// Types
// ============================================================================

/**
 * Bundle readers plus the writes the generator performs. Injected so the
 * generator's refusal order is provable without a real filesystem.
 */
export interface GeneratorFs extends ManifestFsReader {
  readonly mkdirSync: (path: string) => void;
  readonly writeFileSync: (path: string, content: string) => void;
}

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
  /** The current time (injected; no ambient clock). */
  readonly now: Date;
  /** Injected filesystem (use {@link nodeGeneratorFs} in production). */
  readonly fs: GeneratorFs;
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
  fs: GeneratorFs,
): Result<readonly { filename: string; content: string }[], GenerationError> {
  try {
    const files = fs.readdirSync(bulkDir).filter((f) => {
      // Only process files with -primary.json or -secondary.json suffix
      return f.endsWith('-primary.json') || f.endsWith('-secondary.json');
    });

    const results: { filename: string; content: string }[] = [];
    for (const filename of files) {
      const filepath = join(bulkDir, filename);
      const content = fs.readFileSync(filepath);
      results.push({ filename, content });
    }

    return ok(results);
  } catch (error) {
    return err({
      kind: 'io_error',
      message: `Failed to read bulk data files: ${error instanceof Error ? error.message : String(error)}`,
      cause: error,
    });
  }
}

/**
 * Ensures the output directory exists.
 */
function ensureOutputDir(outputDir: string, fs: GeneratorFs): Result<void, GenerationError> {
  try {
    fs.mkdirSync(outputDir);
    return ok(undefined);
  } catch (error) {
    return err({
      kind: 'io_error',
      message: `Failed to create output directory: ${error instanceof Error ? error.message : String(error)}`,
      cause: error,
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
  fs: GeneratorFs,
): Result<string, GenerationError> {
  const filepath = join(outputDir, filename);
  try {
    fs.writeFileSync(filepath, content);
    return ok(filepath);
  } catch (error) {
    return err({
      kind: 'io_error',
      message: `Failed to write ${filename}: ${error instanceof Error ? error.message : String(error)}`,
      file: filepath,
      cause: error,
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
function generateManifestFile(
  allData: readonly ParsedBulkData[],
  downloadedAt: string,
  now: Date,
): string {
  const lines: string[] = [];

  lines.push(
    '/**',
    ' * Bulk data manifest with generation metadata.',
    ' *',
    ' * @generated - DO NOT EDIT',
    ` * Generated at: ${now.toISOString()}`,
    ` * Data downloaded at: ${downloadedAt}`,
    ' */',
    '',
    '/**',
    ' * Metadata for a subject/phase combination.',
    ' */',
    'interface SubjectPhaseMetadata {',
    '  readonly subject: string;',
    "  readonly phase: 'primary' | 'secondary';",
    '  readonly sequenceSlug: string;',
    '  readonly lessonCount: number;',
    '}',
    '',
    '/**',
    ' * All subject/phase combinations in the bulk data.',
    ' */',
    'export const BULK_DATA_MANIFEST: readonly SubjectPhaseMetadata[] = [',
  );
  for (const data of allData) {
    lines.push(
      '  {',
      `    subject: '${data.subject}',`,
      `    phase: '${data.phase}',`,
      `    sequenceSlug: '${data.sequenceSlug}',`,
      `    lessonCount: ${data.lessonCount},`,
      '  },',
    );
  }
  lines.push(
    '] as const;',
    '',
    `/** Number of subject/phase combinations */`,
    `export const SUBJECT_PHASE_COUNT = ${allData.length} as const;`,
  );

  return lines.join('\n');
}

/**
 * Main generator function.
 */
/** A logger that prints in verbose mode and is silent otherwise. */
function createVerboseLogger(verbose: boolean): (message: string) => void {
  return verbose ? (message) => console.log(message) : () => undefined;
}

/**
 * Verify the bundle's vintage via the shared freshness contract, mapping
 * its error into this generator's error shape.
 */
function verifyBundleVintage(
  bulkDir: string,
  now: Date,
  fs: GeneratorFs,
): Result<BulkFreshness, GenerationError> {
  const freshness = checkBulkDataFreshness({ bulkDir, now, fs });
  if (!freshness.ok) {
    return err({ kind: 'validation_error', message: freshness.error.message });
  }
  return freshness;
}

/**
 * Emits every generated artefact in order; the first failed write aborts.
 */
function writeGeneratedFiles(
  outputDir: string,
  allData: readonly ParsedBulkData[],
  downloadedAt: string,
  now: Date,
  fs: GeneratorFs,
): Result<readonly string[], GenerationError> {
  const lessonSlugDataset = buildLessonSlugDataset(allData, now);
  const outputs: readonly (readonly [string, string])[] = [
    ['lesson-slugs-by-subject.ts', emitAllLessonSlugTypes(allData, now)],
    ['lesson-slugs-by-subject.types.ts', emitLessonSlugDatasetTypes()],
    ['lesson-slugs-by-subject.data.json', JSON.stringify(lessonSlugDataset, null, 2)],
    ['ground-truth-schemas.ts', emitGroundTruthSchemas(now)],
    ['bulk-data-manifest.ts', generateManifestFile(allData, downloadedAt, now)],
    ['index.ts', generateIndexFile()],
  ];
  const filesWritten: string[] = [];
  for (const [filename, content] of outputs) {
    const written = writeOutputFile(outputDir, filename, content, fs);
    if (!written.ok) {
      return written;
    }
    filesWritten.push(written.value);
  }
  return ok(filesWritten);
}

export async function generateGroundTruthTypes(
  options: GeneratorOptions,
): Promise<Result<GenerationResult, GenerationError>> {
  const { bulkDir, outputDir, verbose, now, fs } = options;
  const logVerbose = createVerboseLogger(verbose);

  logVerbose(`Reading bulk data from: ${bulkDir}`);

  // Step 0: Verify the bundle's vintage before generating anything from it.
  // Bulk data is downloaded per-checkout; generating from a silently stale
  // bundle bakes its vintage into every generated artefact.
  const freshness = verifyBundleVintage(bulkDir, now, fs);
  if (!freshness.ok) {
    return freshness;
  }
  const { downloadedAt } = freshness.value;
  logVerbose(
    `Bulk data vintage: downloaded ${downloadedAt} (${freshness.value.ageDays} day(s) old)`,
  );

  // Step 1: Read bulk files
  const filesResult = readBulkDataFiles(bulkDir, fs);
  if (!filesResult.ok) {
    return filesResult;
  }

  logVerbose(`Found ${filesResult.value.length} bulk data files`);

  // Step 2: Parse all files
  const parseResult = parseAllBulkData(filesResult.value);
  if (!parseResult.ok) {
    return parseResult;
  }

  const allData = parseResult.value;
  const totalLessons = allData.reduce((sum, d) => sum + d.lessonCount, 0);

  logVerbose(`Parsed ${allData.length} subject/phase combinations`);
  logVerbose(`Total lessons: ${totalLessons}`);

  // Step 3: Ensure output directory exists
  const dirResult = ensureOutputDir(outputDir, fs);
  if (!dirResult.ok) {
    return dirResult;
  }

  // Step 4: Generate and write files
  const writeResult = writeGeneratedFiles(outputDir, allData, downloadedAt, now, fs);
  if (!writeResult.ok) {
    return writeResult;
  }
  const filesWritten = writeResult.value;

  logVerbose(['Generated files:', ...filesWritten.map((file) => `  ${file}`)].join('\n'));

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

  const nodeGeneratorFs: GeneratorFs = {
    ...nodeManifestFsReader,
    mkdirSync: (path) => {
      mkdirSync(path, { recursive: true });
    },
    writeFileSync: (path, content) => {
      writeFileSync(path, content, 'utf-8');
    },
  };

  const result = await generateGroundTruthTypes({
    bulkDir,
    outputDir,
    verbose: true,
    now: new Date(),
    fs: nodeGeneratorFs,
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

// Only run main() when executed directly as a script, not when imported for
// testing. `pathToFileURL` handles the percent-encoding a raw `file://`
// template literal gets wrong for paths with spaces or non-ASCII characters.
const isMainModule = import.meta.url === pathToFileURL(process.argv[1] ?? '').href;
if (isMainModule) {
  try {
    await main();
  } catch (error: unknown) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
}
